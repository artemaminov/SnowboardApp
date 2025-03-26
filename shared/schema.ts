import { pgTable, text, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const bindingProfiles = pgTable("binding_profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  frontAngle: real("front_angle").notNull(),
  backAngle: real("back_angle").notNull(),
  stanceWidth: real("stance_width").notNull(),
  setback: real("setback").notNull(),
  bootSize: real("boot_size").notNull(),
  riderWeight: real("rider_weight").notNull(),
  riderHeight: real("rider_height").notNull(),
  boardType: text("board_type").notNull(),
  highbackHeight: real("highback_height"),
  bindingStiffness: integer("binding_stiffness"),
  stance: text("stance").notNull().default("regular"),
  lastModified: timestamp("last_modified").notNull().defaultNow(),
});

export const insertBindingProfileSchema = createInsertSchema(bindingProfiles).omit({
  id: true,
  lastModified: true,
});

export type InsertBindingProfile = z.infer<typeof insertBindingProfileSchema>;
export type BindingProfile = typeof bindingProfiles.$inferSelect;

// Extended schema with validation
export const bindingProfileFormSchema = insertBindingProfileSchema.extend({
  frontAngle: z.number().min(-45).max(45),
  backAngle: z.number().min(-45).max(45),
  stanceWidth: z.number().min(0).max(100),
  setback: z.number().min(-10).max(10),
  bootSize: z.number().min(4).max(15),
  riderWeight: z.number().min(30).max(200),
  riderHeight: z.number().min(120).max(220),
  boardType: z.enum(["standard", "wide"]),
  stance: z.enum(["regular", "goofy"]),
  highbackHeight: z.number().min(0).max(10).optional(),
  bindingStiffness: z.number().min(1).max(10).optional(),
});