import { bindingProfiles, type BindingProfile, type InsertBindingProfile } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getProfile(id: number): Promise<BindingProfile | undefined>;
  getAllProfiles(): Promise<BindingProfile[]>;
  createProfile(profile: InsertBindingProfile): Promise<BindingProfile>;
  updateProfile(id: number, profile: Partial<InsertBindingProfile>): Promise<BindingProfile | undefined>;
  deleteProfile(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getProfile(id: number): Promise<BindingProfile | undefined> {
    const [profile] = await db.select().from(bindingProfiles).where(eq(bindingProfiles.id, id));
    return profile;
  }

  async getAllProfiles(): Promise<BindingProfile[]> {
    return await db.select().from(bindingProfiles);
  }

  async createProfile(profile: InsertBindingProfile): Promise<BindingProfile> {
    const [created] = await db.insert(bindingProfiles).values({
      ...profile,
      highbackHeight: profile.highbackHeight ?? null,
      bindingStiffness: profile.bindingStiffness ?? null,
    }).returning();
    return created;
  }

  async updateProfile(id: number, updates: Partial<InsertBindingProfile>): Promise<BindingProfile | undefined> {
    const [updated] = await db
      .update(bindingProfiles)
      .set({
        ...updates,
        lastModified: new Date(),
      })
      .where(eq(bindingProfiles.id, id))
      .returning();
    return updated;
  }

  async deleteProfile(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(bindingProfiles)
      .where(eq(bindingProfiles.id, id))
      .returning();
    return !!deleted;
  }
}

export const storage = new DatabaseStorage();