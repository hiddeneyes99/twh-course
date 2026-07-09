import { pgTable, integer, text, timestamp } from "drizzle-orm/pg-core";

/** Stores bcrypt-hashed PINs for each member. Lives in Replit PostgreSQL. */
export const memberPinsTable = pgTable("member_pins", {
  memberId: integer("member_id").primaryKey(),
  pinHash: text("pin_hash").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type MemberPin = typeof memberPinsTable.$inferSelect;
