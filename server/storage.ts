import { bindingProfiles, type BindingProfile, type InsertBindingProfile } from "@shared/schema";

export interface IStorage {
  getProfile(id: number): Promise<BindingProfile | undefined>;
  getAllProfiles(): Promise<BindingProfile[]>;
  createProfile(profile: InsertBindingProfile): Promise<BindingProfile>;
  updateProfile(id: number, profile: Partial<InsertBindingProfile>): Promise<BindingProfile | undefined>;
  deleteProfile(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private profiles: Map<number, BindingProfile>;
  private currentId: number;

  constructor() {
    this.profiles = new Map();
    this.currentId = 1;
  }

  async getProfile(id: number): Promise<BindingProfile | undefined> {
    return this.profiles.get(id);
  }

  async getAllProfiles(): Promise<BindingProfile[]> {
    return Array.from(this.profiles.values());
  }

  async createProfile(insertProfile: InsertBindingProfile): Promise<BindingProfile> {
    const id = this.currentId++;
    const profile: BindingProfile = {
      ...insertProfile,
      id,
      lastModified: new Date(),
    };
    this.profiles.set(id, profile);
    return profile;
  }

  async updateProfile(id: number, updates: Partial<InsertBindingProfile>): Promise<BindingProfile | undefined> {
    const existing = this.profiles.get(id);
    if (!existing) return undefined;

    const updated: BindingProfile = {
      ...existing,
      ...updates,
      id,
      lastModified: new Date(),
    };
    this.profiles.set(id, updated);
    return updated;
  }

  async deleteProfile(id: number): Promise<boolean> {
    return this.profiles.delete(id);
  }
}

export const storage = new MemStorage();
