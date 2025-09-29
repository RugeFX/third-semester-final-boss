import {
  integer,
  decimal,
  pgEnum,
  pgTable,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const roleEnums = pgEnum("role", ["admin", "member"]);

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fullname: varchar("fullname").notNull(),
  username: varchar("username").unique().notNull(),
  password: varchar("password").notNull(),
  role: roleEnums().notNull(),
});

export const usersRelations = relations(usersTable, ({ one }) => ({
  member: one(membersTable, {
    fields: [usersTable.id],
    references: [membersTable.user_id],
  }),
}));

export const membersTable = pgTable("members", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  joined_at: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
  ended_at: timestamp("ended_at", { withTimezone: true }).notNull(),
  user_id: integer("user_id")
    .notNull()
    .references(() => usersTable.id),
});

export const membersRelations = relations(membersTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [membersTable.user_id],
    references: [usersTable.id],
  }),
}));

export const membershipPlansTable = pgTable("membership_plans", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  cost: decimal("cost").notNull(),
  period: integer("period").notNull().default(1), // in months
});

export const categoriesTable = pgTable("categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name").notNull(),
  weight: decimal("weight").notNull(),
  icon: varchar("icon").notNull(), 
  thumbnail: varchar("thumbnail").notNull(),
});

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
  vehicle: many(vehicleDetailsTable),
  prices: many(pricesTable),
}));

export const vehicleDetailsTable = pgTable("vehicle_details", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  plate_number: varchar("plate_number").notNull(),
  category_id: integer("category_id")
    .notNull()
    .references(() => categoriesTable.id),
});

export const vehicleDetailsRelations = relations(
  vehicleDetailsTable,
  ({ one }) => ({
    category: one(categoriesTable, {
      fields: [vehicleDetailsTable.category_id],
      references: [categoriesTable.id],
    }),
  })
);

export const pricesTable = pgTable("prices", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  amount: decimal("amount").notNull(),
  category_id: integer("category_id")
    .notNull()
    .references(() => categoriesTable.id),
});

export const pricesRelations = relations(pricesTable, ({ one }) => ({
  category: one(categoriesTable, {
    fields: [pricesTable.category_id],
    references: [categoriesTable.id],
  }),
}));

export const parkingLevelsTable = pgTable("parking_levels", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name").notNull(),
  max_weight: decimal("max_weight").notNull(),
});

export const parkingLevelsRelations = relations(
  parkingLevelsTable,
  ({ many }) => ({
    transactions: many(transactionsTable),
  })
);

export const statusEnums = pgEnum("status", ["ENTRY", "EXIT"]);

export const transactionsTable = pgTable("transactions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  status: statusEnums("status").notNull().default("ENTRY"),
  paid_amount: decimal("paid_amount"),
  access_code: varchar("access_code")
    .unique()
    .notNull()
    .default(sql`gen_random_uuid()`),
  user_id: integer("user_id").references(() => usersTable.id),
  vehicle_detail_id: integer("vehicle_detail_id")
    .notNull()
    .references(() => vehicleDetailsTable.id),
  parking_level_id: integer("parking_level_id")
    .notNull()
    .references(() => parkingLevelsTable.id),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const transactionsRelations = relations(
  transactionsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [transactionsTable.user_id],
      references: [usersTable.id],
    }),
    vehicleDetail: one(vehicleDetailsTable, {
      fields: [transactionsTable.vehicle_detail_id],
      references: [vehicleDetailsTable.id],
    }),
    parkingLevel: one(parkingLevelsTable, {
      fields: [transactionsTable.parking_level_id],
      references: [parkingLevelsTable.id],
    }),
  })
);

export const auditLogsTable = pgTable("audit_logs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  context: varchar("context").notNull(),
  type: varchar("type").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: integer("created_by").notNull().references(() => usersTable.id),
});

export const auditLogsRelations = relations(
  auditLogsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [auditLogsTable.created_by],
      references: [usersTable.id],
    }),
  })
);