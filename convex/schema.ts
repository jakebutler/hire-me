import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    persona: v.union(v.literal("targeted"), v.literal("volume")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"]),

  resumes: defineTable({
    userId: v.id("users"),
    fileName: v.string(),
    fileUrl: v.optional(v.string()),
    fileStorageId: v.optional(v.id("_storage")),
    parsedText: v.string(),
    structured: v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      experience: v.array(v.object({
        title: v.string(),
        company: v.string(),
        startDate: v.optional(v.string()),
        endDate: v.optional(v.string()),
        description: v.optional(v.string()),
      })),
      education: v.array(v.object({
        degree: v.string(),
        institution: v.string(),
        graduationDate: v.optional(v.string()),
        gpa: v.optional(v.string()),
      })),
      skills: v.array(v.string()),
      certifications: v.array(v.string()),
    }),
    isMaster: v.boolean(),
    jobId: v.optional(v.id("jobs")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_master", ["userId", "isMaster"]),

  jobs: defineTable({
    userId: v.id("users"),
    title: v.string(),
    company: v.string(),
    url: v.optional(v.string()),
    descriptionText: v.string(),
    structuredData: v.object({
      requirements: v.array(v.string()),
      responsibilities: v.array(v.string()),
      benefits: v.array(v.string()),
      location: v.optional(v.string()),
      salary: v.optional(v.string()),
    }),
    status: v.union(
      v.literal("New job"),
      v.literal("Application submitted"),
      v.literal("Interview scheduled"),
      v.literal("Awaiting response"),
      v.literal("Pending user response"),
      v.literal("Not hired")
    ),
    jobResumeVersionId: v.optional(v.id("resumes")),
    coachSuggestions: v.optional(v.string()),
    notes: v.optional(v.string()),
    followUpDate: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),
});