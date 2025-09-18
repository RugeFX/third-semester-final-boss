import { integer, pgEnum, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';

export const usersEnum = pgEnum('role', ['admin', 'member']);

export const usersTable = pgTable('users', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar('name').notNull(),
    password: varchar('password').notNull(),
    role: usersEnum().notNull(),
})

export const usersRelations = relations(usersTable, ({ one }) => ({
    member: one(membersTable, {
        fields: [usersTable.id],
        references: [membersTable.user_id],
    }),
}))

export const membersTable = pgTable('members', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    joined_at: timestamp('joined_at').notNull().defaultNow(),
    ended_at: timestamp('ended_at').notNull(),
    user_id: integer('user_id').notNull().references(() => usersTable.id),
})

export const membersRelations = relations(membersTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [membersTable.user_id],
        references: [usersTable.id],
    }),
}))

export const categoriesTable = pgTable('categories', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar('name').notNull(),
    weight: integer('weight').notNull(),
})

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
    vehicles: many(vehiclesDetailsTable),
    prices: many(pricesTable),
}))

export const vehiclesDetailsTable = pgTable('vehicles_details', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    plat_number: varchar('plat_number').notNull(),
    category_id: integer('category_id').notNull().references(() => categoriesTable.id),
})

export const vehiclesDetailsRelations = relations(vehiclesDetailsTable, ({ one }) => ({
    category: one(categoriesTable, {
        fields: [vehiclesDetailsTable.category_id],
        references: [categoriesTable.id],
    }),
}))

export const pricesTable = pgTable('prices', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    amount: integer('amount').notNull(),
    category_id: integer('category_id').notNull().references(() => categoriesTable.id),
})

export const pricesRelations = relations(pricesTable, ({ one }) => ({
    category: one(categoriesTable, {
        fields: [pricesTable.category_id],
        references: [categoriesTable.id],
    }),
}))

export const parkingLevelsTable = pgTable('parking_levels', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar('name').notNull(),
    max_weight: integer('max_weight').notNull(),
})

export const parkingLevelsRelations = relations(parkingLevelsTable, ({ many }) => ({
    transactions: many(transactionsTable),
}))

export const transactionsEnum = pgEnum('status', ['ENTRY', 'EXIT']);

export const transactionsTable = pgTable('transactions', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    status: transactionsEnum().notNull(),
    paid_amount: integer('paid_amount').notNull(),
    access_code: varchar('access_code').unique().notNull(),
    user_id: integer('user_id').notNull().references(() => usersTable.id),
    vehicle_detail_id: integer('vehicle_detail_id').notNull().references(() => vehiclesDetailsTable.id),
    parking_level_id: integer('parking_level_id').notNull().references(() => parkingLevelsTable.id),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
})

export const transactionsRelations = relations(transactionsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [transactionsTable.user_id],
        references: [usersTable.id],
    }),
    vehiclesDetail: one(vehiclesDetailsTable, {
        fields: [transactionsTable.vehicle_detail_id],
        references: [vehiclesDetailsTable.id],
    }),
    parkingLevel: one(parkingLevelsTable, {
        fields: [transactionsTable.parking_level_id],
        references: [parkingLevelsTable.id],
    }),
}))