import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { bindingProfileFormSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all profiles
  app.get("/api/profiles", async (_req, res) => {
    const profiles = await storage.getAllProfiles();
    res.json(profiles);
  });

  // Get single profile
  app.get("/api/profiles/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid profile ID" });
    }

    const profile = await storage.getProfile(id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  });

  // Create profile
  app.post("/api/profiles", async (req, res) => {
    try {
      const data = bindingProfileFormSchema.parse(req.body);
      const profile = await storage.createProfile(data);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create profile" });
    }
  });

  // Update profile
  app.patch("/api/profiles/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid profile ID" });
    }

    try {
      const data = bindingProfileFormSchema.partial().parse(req.body);
      const updated = await storage.updateProfile(id, data);
      if (!updated) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Delete profile
  app.delete("/api/profiles/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid profile ID" });
    }

    const success = await storage.deleteProfile(id);
    if (!success) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(204).send();
  });

  const httpServer = createServer(app);
  return httpServer;
}
