import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertUser = mutation({
  args: {
    uid: v.string(), // Firebase UID
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
    gpsLocation: v.optional(v.string()),
    role: v.optional(v.union(v.literal("customer"), v.literal("shop_owner"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    if (identity.subject !== args.uid) throw new Error("Unauthorized");

    const allExisting = await ctx.db
      .query("users")
      .withIndex("by_uid", (q) => q.eq("uid", args.uid))
      .collect();
    const existing = allExisting[0];

    // Remove any duplicate previous records from Convex
    for (let i = 1; i < allExisting.length; i++) {
      await ctx.db.delete(allExisting[i]._id);
    }

    const data = {
      uid: args.uid,
      firebaseUid: args.uid, // Align both for consistency
      name: args.name,
      email: args.email,
      phone: args.phone,
      location: args.location,
      gpsLocation: args.gpsLocation,
      role: args.role ?? (existing?.role || "customer"),
    };

    if (existing) {
      await ctx.db.patch(existing._id, data);
      return existing._id;
    }

    return await ctx.db.insert("users", {
      ...data,
      createdAt: new Date().toISOString(),
    });
  },
});

export const getUserByUid = query({
  args: { uid: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    if (identity.subject !== args.uid) throw new Error("Unauthorized");

    return await ctx.db
      .query("users")
      .withIndex("by_uid", (q) => q.eq("uid", args.uid))
      .first();
  },
});
export const deleteUserAccount = mutation({
  args: { uid: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    if (identity.subject !== args.uid) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_uid", (q) => q.eq("uid", args.uid))
      .first();

    if (!user) throw new Error("User not found");

    // LEG-07 FIX: Delete personal data to comply with "Right to Erasure"
    // Here we hard-delete the user record containing PII.
    // In a full implementation, you would also delete or anonymize related
    // bookings, reviews, and notifications in a background job or here.
    await ctx.db.delete(user._id);

    return { success: true };
  },
});

export const updateUserProfile = mutation({
  args: {
    uid: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    if (identity.subject !== args.uid) throw new Error("Unauthorized");

    // 1. Find all user records matching this uid
    const userRecords = await ctx.db
      .query("users")
      .withIndex("by_uid", (q) => q.eq("uid", args.uid))
      .collect();

    if (userRecords.length === 0) {
      throw new Error("User not found");
    }

    // Update primary record with new data
    await ctx.db.patch(userRecords[0]._id, {
      name: args.name,
      phone: args.phone,
      location: args.location,
    });

    // Remove any previous/duplicate user records from Convex
    for (let i = 1; i < userRecords.length; i++) {
      await ctx.db.delete(userRecords[i]._id);
    }

    // 2. Update bookings so previous customerName/customerPhone data is replaced/removed in Convex
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_customer", (q) => q.eq("customerId", args.uid))
      .collect();
    for (const b of bookings) {
      await ctx.db.patch(b._id, {
        customerName: args.name,
        customerPhone: args.phone,
      });
    }

    // 3. Update reviews so previous customerName is replaced/removed in Convex
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_customer", (q) => q.eq("customerId", args.uid))
      .collect();
    for (const r of reviews) {
      await ctx.db.patch(r._id, {
        customerName: args.name,
      });
    }

    // 4. Remove previous location requests for this user from Convex
    const locationReqs = await ctx.db
      .query("locationRequests")
      .withIndex("by_user", (q) => q.eq("userId", args.uid))
      .collect();
    for (const lr of locationReqs) {
      await ctx.db.delete(lr._id);
    }

    return { success: true };
  },
});

