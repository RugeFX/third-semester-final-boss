import "dotenv/config";
import { db } from "./index";
import * as schema from "./schema";
import { faker } from "@faker-js/faker";
import { hash } from "bcrypt";
async function seed() {
    console.log("⏳ Running seed...");
    const start = Date.now();
    console.log("🗑️  Clearing old data...");
    await db.delete(schema.auditLogsTable);
    await db.delete(schema.transactionsTable);
    await db.delete(schema.pricesTable);
    await db.delete(schema.vehicleDetailsTable);
    await db.delete(schema.membersTable);
    await db.delete(schema.usersTable);
    await db.delete(schema.categoriesTable);
    await db.delete(schema.membershipPlansTable);
    await db.delete(schema.parkingLevelsTable);
    console.log("🌱 Seeding tables with no dependencies...");
    const membershipPlans = await db
        .insert(schema.membershipPlansTable)
        .values([
        { cost: "50000", period: 1 },
        { cost: "135000", period: 3 },
        { cost: "500000", period: 12 },
    ])
        .returning();
    console.log(`✅ Seeded ${membershipPlans.length} membership plans.`);
    const categories = await db
        .insert(schema.categoriesTable)
        .values([
        {
            name: "Sepeda Motor",
            weight: "150",
            icon: "/icons/motorcycle.svg",
            thumbnail: "/thumbnails/motorcycle.png",
        },
        {
            name: "Mobil",
            weight: "1500",
            icon: "/icons/car.svg",
            thumbnail: "/thumbnails/car.png",
        },
        {
            name: "Truk",
            weight: "3500",
            icon: "/icons/truck.svg",
            thumbnail: "/thumbnails/truck.png",
        },
    ])
        .returning();
    console.log(`✅ Seeded ${categories.length} categories.`);
    const parkingLevels = await db
        .insert(schema.parkingLevelsTable)
        .values([
        { name: "Lantai 1 (Semua Kendaraan)", max_weight: "5000" },
        { name: "Lantai 2 (Mobil & Motor)", max_weight: "2000" },
        { name: "Lantai 3 (Khusus Motor)", max_weight: "300" },
    ])
        .returning();
    console.log(`✅ Seeded ${parkingLevels.length} parking levels.`);
    console.log("🌱 Seeding users and members...");
    const hashedPassword = await hash("password123", 10);
    const users = await db
        .insert(schema.usersTable)
        .values([
        {
            fullname: "Admin Parkir",
            username: "admin",
            password: hashedPassword,
            role: "admin",
        },
        {
            fullname: faker.person.fullName(),
            username: "member1",
            password: hashedPassword,
            role: "member",
        },
    ])
        .returning();
    console.log(`✅ Seeded ${users.length} users.`);
    const adminUser = users.find((u) => u.role === "admin");
    const memberUser = users.find((u) => u.role === "member");
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    const members = await db
        .insert(schema.membersTable)
        .values([
        {
            user_id: memberUser.id,
            ended_at: oneMonthFromNow,
        },
    ])
        .returning();
    console.log(`✅ Seeded ${members.length} members.`);
    console.log("🌱 Seeding tables with dependencies...");
    const farFutureDate = new Date("9999-12-31T23:59:59Z");
    const pastDate = new Date("2020-01-01T00:00:00Z");
    const prices = await db
        .insert(schema.pricesTable)
        .values([
        {
            category_id: categories[0].id,
            amount: "5000",
            type: "INITIAL_BLOCK",
            block_hours: 2,
            is_active: true,
            valid_from: pastDate,
            valid_until: farFutureDate,
        },
        {
            category_id: categories[0].id,
            amount: "2000",
            type: "SUBSEQUENT_HOUR",
            is_active: true,
            valid_from: pastDate,
            valid_until: farFutureDate,
        },
        {
            category_id: categories[1].id,
            amount: "10000",
            type: "INITIAL_BLOCK",
            block_hours: 2,
            is_active: true,
            valid_from: pastDate,
            valid_until: farFutureDate,
        },
        {
            category_id: categories[1].id,
            amount: "3000",
            type: "SUBSEQUENT_HOUR",
            is_active: true,
            valid_from: pastDate,
            valid_until: farFutureDate,
        },
        {
            category_id: categories[2].id,
            amount: "20000",
            type: "INITIAL_BLOCK",
            block_hours: 2,
            is_active: true,
            valid_from: pastDate,
            valid_until: farFutureDate,
        },
        {
            category_id: categories[2].id,
            amount: "7500",
            type: "SUBSEQUENT_HOUR",
            is_active: true,
            valid_from: pastDate,
            valid_until: farFutureDate,
        },
    ])
        .returning();
    console.log(`✅ Seeded ${prices.length} prices.`);
    const vehicles = await db
        .insert(schema.vehicleDetailsTable)
        .values([
        { plate_number: "B 1234 ABC", category_id: categories[1].id },
        { plate_number: "D 5678 XYZ", category_id: categories[0].id },
        { plate_number: "F 9101 LMN", category_id: categories[2].id },
    ])
        .returning();
    console.log(`✅ Seeded ${vehicles.length} vehicles.`);
    const transactions = await db
        .insert(schema.transactionsTable)
        .values([
        {
            status: "ENTRY",
            user_id: memberUser.id,
            vehicle_detail_id: vehicles[0].id,
            parking_level_id: parkingLevels[0].id,
        },
        {
            status: "ENTRY",
            user_id: null,
            vehicle_detail_id: vehicles[1].id,
            parking_level_id: parkingLevels[2].id,
        },
        {
            status: "EXIT",
            user_id: null,
            vehicle_detail_id: vehicles[2].id,
            parking_level_id: parkingLevels[0].id,
            paid_amount: "20000",
        },
    ])
        .returning();
    console.log(`✅ Seeded ${transactions.length} transactions.`);
    const auditLogs = await db
        .insert(schema.auditLogsTable)
        .values([
        {
            context: "System",
            type: "Seeding",
            created_by: adminUser.id,
        },
        {
            context: "Authentication",
            type: "User Created",
            created_by: adminUser.id,
        },
    ])
        .returning();
    console.log(`✅ Seeded ${auditLogs.length} audit logs.`);
    const end = Date.now();
    console.log(`\n🎉 Seed completed in ${end - start}ms`);
}
seed().catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map