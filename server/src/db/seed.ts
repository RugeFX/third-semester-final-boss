// src/db/seed.ts
import "dotenv/config";
import { db } from "./index"; // Sesuaikan path ke file koneksi Drizzle Anda
import * as schema from "./schema";
import { faker } from "@faker-js/faker";
import { hash } from "bcrypt";

async function seed() {
  console.log("⏳ Running seed...");

  const start = Date.now();

  // Clear old data
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

  // Membership Plans
  const membershipPlans = await db
    .insert(schema.membershipPlansTable)
    .values([
      { cost: "50000", period: 1 }, // Bulanan
      { cost: "135000", period: 3 }, // 3 Bulan
      { cost: "500000", period: 12 }, // Tahunan
    ])
    .returning();
  console.log(`✅ Seeded ${membershipPlans.length} membership plans.`);

  // Categories
  const categories = await db
    .insert(schema.categoriesTable)
    .values([
      {
        name: "Sepeda Motor",
        weight: "150", // dalam kg
        icon: "/icons/motorcycle.svg",
        thumbnail: "/thumbnails/motorcycle.png",
      },
      {
        name: "Mobil",
        weight: "1500", // dalam kg
        icon: "/icons/car.svg",
        thumbnail: "/thumbnails/car.png",
      },
      {
        name: "Truk",
        weight: "3500", // dalam kg
        icon: "/icons/truck.svg",
        thumbnail: "/thumbnails/truck.png",
      },
    ])
    .returning();
  console.log(`✅ Seeded ${categories.length} categories.`);

  // Parking Levels
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
      }
    ]).returning();

  console.log(`✅ Seeded ${users.length} users.`);

  const adminUser = users.find((u) => u.role === "admin")!;
  const memberUser = users.find((u) => u.role === "member")!;

  // Members
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

  // Prices (tergantung Categories)
  const prices = await db
    .insert(schema.pricesTable)
    .values([
      { category_id: categories[0].id, amount: "2000" }, // Motor
      { category_id: categories[1].id, amount: "5000" }, // Mobil
      { category_id: categories[2].id, amount: "10000" }, // Truk
    ])
    .returning();
  console.log(`✅ Seeded ${prices.length} prices.`);

  // Vehicle Details (tergantung Categories)
  const vehicles = await db
    .insert(schema.vehicleDetailsTable)
    .values([
      { plate_number: "B 1234 ABC", category_id: categories[1].id }, // Mobil
      { plate_number: "D 5678 XYZ", category_id: categories[0].id }, // Motor
      { plate_number: "F 9101 LMN", category_id: categories[2].id }, // Truk
    ])
    .returning();
  console.log(`✅ Seeded ${vehicles.length} vehicles.`);

  // Transactions (tergantung banyak tabel)
  const transactions = await db
    .insert(schema.transactionsTable)
    .values([
      // 1. Member masuk parkir
      {
        status: "ENTRY",
        user_id: memberUser.id,
        vehicle_detail_id: vehicles[0].id, // Mobil
        parking_level_id: parkingLevels[0].id, // Lantai 1
      },
      // 2. Pengguna non-member masuk parkir
      {
        status: "ENTRY",
        user_id: null, // Non-member
        vehicle_detail_id: vehicles[1].id, // Motor
        parking_level_id: parkingLevels[2].id, // Lantai 3
      },
      // 3. Transaksi selesai (sudah keluar dan bayar)
      {
        status: "EXIT",
        user_id: null,
        vehicle_detail_id: vehicles[2].id, // Truk
        parking_level_id: parkingLevels[0].id, // Lantai 1
        paid_amount: "20000", // Bayar 20rb
      },
    ])
    .returning();
  console.log(`✅ Seeded ${transactions.length} transactions.`);

  // Audit Logs (tergantung Users)
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