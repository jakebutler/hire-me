import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Upload and parse resume
export const uploadResume = mutation({
  args: {
    userId: v.id("users"),
    fileName: v.string(),
    fileStorageId: v.id("_storage"),
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
  },
  handler: async (ctx, args) => {
    // If this is a master resume, mark all other master resumes as non-master
    if (args.isMaster) {
      const existingMasterResumes = await ctx.db
        .query("resumes")
        .withIndex("by_user_master", (q) => 
          q.eq("userId", args.userId).eq("isMaster", true)
        )
        .collect();

      for (const resume of existingMasterResumes) {
        await ctx.db.patch(resume._id, { isMaster: false });
      }
    }

    const resumeId = await ctx.db.insert("resumes", {
      userId: args.userId,
      fileName: args.fileName,
      fileStorageId: args.fileStorageId,
      parsedText: args.parsedText,
      structured: args.structured,
      isMaster: args.isMaster,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return resumeId;
  },
});

// Get user's master resume
export const getMasterResume = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const masterResume = await ctx.db
      .query("resumes")
      .withIndex("by_user_master", (q) => 
        q.eq("userId", args.userId).eq("isMaster", true)
      )
      .first();

    return masterResume;
  },
});

// Get all user resumes
export const getUserResumes = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const resumes = await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return resumes;
  },
});

// Generate file URL for resume
export const getResumeFileUrl = query({
  args: { resumeId: v.id("resumes") },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.resumeId);
    
    if (!resume || !resume.fileStorageId) {
      return null;
    }

    const url = await ctx.storage.getUrl(resume.fileStorageId);
    return url;
  },
});

// Update resume structured data
export const updateResumeData = mutation({
  args: {
    resumeId: v.id("resumes"),
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
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.resumeId, {
      structured: args.structured,
      updatedAt: Date.now(),
    });

    return args.resumeId;
  },
});