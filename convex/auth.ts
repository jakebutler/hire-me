import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";

// Register a new user
export const registerUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    persona: v.union(v.literal("targeted"), v.literal("volume")),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(args.password, saltRounds);

    // Create the user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      passwordHash,
      persona: args.persona,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { userId, email: args.email, persona: args.persona };
  },
});

// Login user
export const loginUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(args.password, user.passwordHash);
    
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    // Update last login
    await ctx.db.patch(user._id, {
      updatedAt: Date.now(),
    });

    return {
      userId: user._id,
      email: user.email,
      persona: user.persona,
    };
  },
});

// Get user by ID
export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    
    if (!user) {
      return null;
    }

    // Return user without password hash
    return {
      _id: user._id,
      email: user.email,
      persona: user.persona,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },
});