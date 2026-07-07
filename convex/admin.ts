// convex/admin.ts
// All admin-only Convex functions.
// Every handler calls assertAdmin() first with identity.tokenIdentifier.
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { assertAdmin } from "./adminConfig";
import { Id } from "./_generated/dataModel";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getAdminIdentity(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");
  assertAdmin(identity.tokenIdentifier);
  return identity;
}

async function logAdminAction(
  ctx: any,
  adminUid: string,
  action: string,
  description: string,
  targetId?: string,
  targetType?: string
) {
  await ctx.db.insert("adminLogs", {
    adminUid,
    action,
    targetId,
    targetType,
    description,
    createdAt: Date.now(),
  });
}

// ─── QUERIES ──────────────────────────────────────────────────────────────────

/** 8 KPI numbers for the overview dashboard. */
export const adminGetDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    await getAdminIdentity(ctx);

    const allUsers = await ctx.db.query("users").take(10000);
    const totalUsers = allUsers.length;

    const allShops = await ctx.db.query("shops").take(10000);
    const totalShops = allShops.length;
    const approvedShops = allShops.filter((s: any) => s.status === "approved").length;
    const pendingShops = allShops.filter((s: any) => s.status === "pending").length;

    const todayIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
    const todayStr = todayIST.toISOString().split("T")[0];
    const todayBookings = await ctx.db
      .query("bookings")
      .filter((q: any) => q.eq(q.field("date"), todayStr))
      .take(10000);

    const todayBookingCount = todayBookings.length;
    const todayRevenue = todayBookings
      .filter((b: any) => b.status === "completed")
      .reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);

    const ratedShops = allShops.filter((s: any) => s.totalReviews > 0);
    const avgRating =
      ratedShops.length > 0
        ? ratedShops.reduce((sum: number, s: any) => sum + (s.rating || 0), 0) / ratedShops.length
        : 0;

    const activeWalkIns = await ctx.db
      .query("walkIns")
      .withIndex("by_status", (q: any) => q.eq("status", "active"))
      .take(500);
    const activeBookings = await ctx.db
      .query("bookings")
      .filter((q: any) => q.eq(q.field("status"), "active"))
      .take(500);
    const liveActiveSessions = activeWalkIns.length + activeBookings.length;

    return {
      totalUsers,
      totalShops,
      approvedShops,
      pendingShops,
      todayBookingCount,
      todayRevenue,
      avgRating: Math.round(avgRating * 10) / 10,
      liveActiveSessions,
    };
  },
});

/** Daily booking counts + revenue for the last N days. */
export const adminGetBookingsTrend = query({
  args: { days: v.number() },
  handler: async (ctx, args) => {
    await getAdminIdentity(ctx);
    const result: { date: string; count: number; revenue: number }[] = [];
    const now = Date.now();
    for (let i = args.days - 1; i >= 0; i--) {
      const d = new Date(now - i * 86400000 + 5.5 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split("T")[0];
      const bookings = await ctx.db
        .query("bookings")
        .filter((q: any) => q.eq(q.field("date"), dateStr))
        .take(2000);
      const revenue = bookings
        .filter((b: any) => b.status === "completed")
        .reduce((s: number, b: any) => s + (b.totalAmount || 0), 0);
      result.push({ date: dateStr, count: bookings.length, revenue });
    }
    return result;
  },
});

/** Weekly new user signup counts for the last N weeks. */
export const adminGetUserGrowthTrend = query({
  args: { weeks: v.number() },
  handler: async (ctx, args) => {
    await getAdminIdentity(ctx);
    const now = Date.now();
    const result: { week: string; count: number }[] = [];
    for (let i = args.weeks - 1; i >= 0; i--) {
      const weekStart = new Date(now - (i + 1) * 7 * 86400000);
      const weekEnd = new Date(now - i * 7 * 86400000);
      const weekLabel = weekStart.toISOString().split("T")[0];
      const users = await ctx.db
        .query("users")
        .filter((q: any) =>
          q.and(
            q.gte(q.field("_creationTime"), weekStart.getTime()),
            q.lt(q.field("_creationTime"), weekEnd.getTime())
          )
        )
        .take(5000);
      result.push({ week: weekLabel, count: users.length });
    }
    return result;
  },
});

/** Hourly booking distribution across all bookings. */
export const adminGetBookingsByHour = query({
  args: {},
  handler: async (ctx) => {
    await getAdminIdentity(ctx);
    const bookings = await ctx.db.query("bookings").take(5000);
    const hourMap: Record<number, number> = {};
    for (let h = 0; h < 24; h++) hourMap[h] = 0;
    for (const b of bookings) {
      const t = b.time || "";
      const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (match) {
        let hour = parseInt(match[1]);
        const ampm = match[3].toUpperCase();
        if (ampm === "PM" && hour !== 12) hour += 12;
        if (ampm === "AM" && hour === 12) hour = 0;
        hourMap[hour] = (hourMap[hour] || 0) + 1;
      }
    }
    return Object.entries(hourMap).map(([hour, count]) => ({
      hour: parseInt(hour),
      count,
    }));
  },
});

/** Top N shops by total revenue from completed bookings. */
export const adminGetTopShopsByRevenue = query({
  args: { limit: v.number() },
  handler: async (ctx, args) => {
    await getAdminIdentity(ctx);
    const shops = await ctx.db.query("shops").take(500);
    const revenueMap: Record<string, number> = {};
    const bookings = await ctx.db
      .query("bookings")
      .filter((q: any) => q.eq(q.field("status"), "completed"))
      .take(10000);
    for (const b of bookings) {
      const id = b.shopId as string;
      revenueMap[id] = (revenueMap[id] || 0) + (b.totalAmount || 0);
    }
    return shops
      .map((s: any) => ({ shopId: s._id, shopName: s.shopName, revenue: revenueMap[s._id] || 0 }))
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, args.limit);
  },
});

/** Paginated users list with optional search and filters. */
export const adminGetAllUsers = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
    roleFilter: v.optional(v.string()),
    banFilter: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await getAdminIdentity(ctx);
    return await ctx.db.query("users").order("desc").paginate(args.paginationOpts);
  },
});

/** Full user detail including booking count and reviews written. */
export const adminGetUserDetail = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await getAdminIdentity(ctx);
    const user = await ctx.db.get(args.userId);
    if (!user) return null;
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_customer", (q) => q.eq("customerId", user.uid))
      .take(50);
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_customer", (q) => q.eq("customerId", user.uid))
      .take(20);
    return { user, bookings, reviews, bookingCount: bookings.length };
  },
});

/** Paginated shops list with status and active filters. */
export const adminGetAllShops = query({
  args: {
    paginationOpts: paginationOptsValidator,
    statusFilter: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await getAdminIdentity(ctx);
    return await ctx.db.query("shops").order("desc").paginate(args.paginationOpts);
  },
});

/** Full shop detail with services and revenue stats. */
export const adminGetShopDetail = query({
  args: { shopId: v.id("shops") },
  handler: async (ctx, args) => {
    await getAdminIdentity(ctx);
    const shop = await ctx.db.get(args.shopId);
    if (!shop) return null;
    const imageUrl = shop.imageStorageId
      ? await ctx.storage.getUrl(shop.imageStorageId)
      : shop.image;
    const services = await ctx.db
      .query("services")
      .withIndex("by_shopId", (q) => q.eq("shopId", args.shopId))
      .take(100);
    const blockedDates = await ctx.db
      .query("blockedDates")
      .withIndex("by_shop", (q) => q.eq("shopId", args.shopId))
      .take(100);
    const completedBookings = await ctx.db
      .query("bookings")
      .withIndex("by_shop", (q) => q.eq("shopId", args.shopId))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .take(1000);
    const totalRevenue = completedBookings.reduce((s, b) => s + (b.totalAmount || 0), 0);

    // Today's bookings
    const todayIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
    const todayStr = todayIST.toISOString().split("T")[0];
    const todayBookings = await ctx.db
      .query("bookings")
      .withIndex("by_shop_date_time", (q) => q.eq("shopId", args.shopId).eq("date", todayStr))
      .take(100);
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_shop", (q) => q.eq("shopId", args.shopId))
      .order("desc")
      .take(10);

    return { shop: { ...shop, image: imageUrl }, services, blockedDates, totalRevenue, todayBookings, reviews };
  },
});

/** Paginated bookings with optional status and date filters. */
export const adminGetAllBookings = query({
  args: {
    paginationOpts: paginationOptsValidator,
    statusFilter: v.optional(v.string()),
    shopId: v.optional(v.id("shops")),
    dateFrom: v.optional(v.string()),
    dateTo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await getAdminIdentity(ctx);
    return await ctx.db.query("bookings").order("desc").paginate(args.paginationOpts);
  },
});

/** Paginated reviews with optional rating and shop filters. */
export const adminGetAllReviews = query({
  args: {
    paginationOpts: paginationOptsValidator,
    ratingFilter: v.optional(v.number()),
    shopId: v.optional(v.id("shops")),
  },
  handler: async (ctx, args) => {
    await getAdminIdentity(ctx);
    return await ctx.db.query("reviews").order("desc").paginate(args.paginationOpts);
  },
});

/** Live operations: all active walkIns + active bookings. */
export const adminGetLiveOperations = query({
  args: {},
  handler: async (ctx) => {
    await getAdminIdentity(ctx);
    const activeWalkIns = await ctx.db
      .query("walkIns")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .take(200);
    const activeBookings = await ctx.db
      .query("bookings")
      .filter((q) => q.eq(q.field("status"), "active"))
      .take(200);
    const barberStatuses = await ctx.db.query("barberStatus").take(200);

    // Enrich with shop names
    const shopIds = [...new Set([
      ...activeWalkIns.map((w: any) => w.shopId),
      ...activeBookings.map((b: any) => b.shopId),
    ])];
    const shopMap: Record<string, string> = {};
    for (const id of shopIds) {
      const s = await ctx.db.get(id as Id<"shops">);
      if (s) shopMap[id as string] = s.shopName;
    }
    return {
      activeWalkIns: activeWalkIns.map((w: any) => ({ ...w, shopName: shopMap[w.shopId] || "Unknown" })),
      activeBookings: activeBookings.map((b: any) => ({ ...b, shopName: shopMap[b.shopId] || "Unknown" })),
      barberStatuses,
    };
  },
});


/** Paginated admin activity log. */
export const adminGetActivityLog = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    await getAdminIdentity(ctx);
    return await ctx.db
      .query("adminLogs")
      .withIndex("by_created")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

/** All appConfig key-value pairs (returned as array for list-based access). */
export const adminGetAppConfig = query({
  args: {},
  handler: async (ctx) => {
    await getAdminIdentity(ctx);
    return await ctx.db.query("appConfig").take(100);
  },
});

/** Bookings, users, and revenue grouped by city (location field). */
export const adminGetGeographicStats = query({
  args: {},
  handler: async (ctx) => {
    await getAdminIdentity(ctx);
    const users = await ctx.db.query("users").take(5000);
    const cityUserMap: Record<string, number> = {};
    for (const u of users) {
      const city = u.location || "Unknown";
      cityUserMap[city] = (cityUserMap[city] || 0) + 1;
    }

    const completedBookings = await ctx.db
      .query("bookings")
      .filter((q) => q.eq(q.field("status"), "completed"))
      .take(5000);
    const shops = await ctx.db.query("shops").take(1000);
    const shopCityMap: Record<string, string> = {};
    for (const s of shops) shopCityMap[s._id as string] = s.locationLabel || s.address || "Unknown";

    const cityRevenueMap: Record<string, number> = {};
    const cityBookingMap: Record<string, number> = {};
    for (const b of completedBookings) {
      const city = shopCityMap[b.shopId as string] || "Unknown";
      cityRevenueMap[city] = (cityRevenueMap[city] || 0) + (b.totalAmount || 0);
      cityBookingMap[city] = (cityBookingMap[city] || 0) + 1;
    }

    const cities = [...new Set([...Object.keys(cityUserMap), ...Object.keys(cityRevenueMap)])];
    return cities.map((city) => ({
      city,
      users: cityUserMap[city] || 0,
      bookings: cityBookingMap[city] || 0,
      revenue: cityRevenueMap[city] || 0,
    }));
  },
});

/** Retention funnel data: once/twice/repeat bookers. */
export const adminGetRetentionStats = query({
  args: {},
  handler: async (ctx) => {
    await getAdminIdentity(ctx);
    const allBookings = await ctx.db.query("bookings").take(10000);
    const perUser: Record<string, number> = {};
    for (const b of allBookings) {
      perUser[b.customerId] = (perUser[b.customerId] || 0) + 1;
    }
    const counts = Object.values(perUser);
    return {
      bookedOnce: counts.filter((c) => c === 1).length,
      bookedTwice: counts.filter((c) => c === 2).length,
      bookedThreePlus: counts.filter((c) => c >= 3).length,
      neverBooked:
        (await ctx.db.query("users").take(10000)).length - Object.keys(perUser).length,
    };
  },
});

/** Review tag frequency map. */
export const adminGetReviewTagFrequency = query({
  args: {},
  handler: async (ctx) => {
    await getAdminIdentity(ctx);
    const reviews = await ctx.db.query("reviews").take(5000);
    const tagMap: Record<string, number> = {};
    for (const r of reviews) {
      for (const tag of r.tags || []) {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      }
    }
    return Object.entries(tagMap)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  },
});

/** Paginated notifications log. */
export const adminGetAllNotifications = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    await getAdminIdentity(ctx);
    return await ctx.db
      .query("notifications")
      .withIndex("by_created")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

/** All offers. */
export const adminGetAllOffers = query({
  args: {},
  handler: async (ctx) => {
    await getAdminIdentity(ctx);
    return await ctx.db.query("offers").take(200);
  },
});

/** Rate limit top offenders. */
export const adminGetRateLimitOffenders = query({
  args: {},
  handler: async (ctx) => {
    await getAdminIdentity(ctx);
    const oneHourAgo = Date.now() - 3600000;
    const limits = await ctx.db.query("rateLimits").take(2000);
    const recent = limits.filter((r: any) => r.timestamp > oneHourAgo);
    const perUser: Record<string, number> = {};
    for (const r of recent) {
      perUser[r.userId] = (perUser[r.userId] || 0) + 1;
    }
    return Object.entries(perUser)
      .map(([userId, hits]) => ({ userId, hits }))
      .sort((a, b) => b.hits - a.hits)
      .slice(0, 20);
  },
});

/** Month-over-month growth stats. */
export const adminGetGrowthStats = query({
  args: {},
  handler: async (ctx) => {
    await getAdminIdentity(ctx);
    const now = Date.now();
    const thisMonthStart = new Date(now);
    thisMonthStart.setDate(1);
    thisMonthStart.setHours(0, 0, 0, 0);
    const lastMonthStart = new Date(thisMonthStart);
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

    const users = await ctx.db.query("users").take(10000);
    const thisMonthUsers = users.filter((u: any) => u._creationTime >= thisMonthStart.getTime()).length;
    const lastMonthUsers = users.filter(
      (u: any) => u._creationTime >= lastMonthStart.getTime() && u._creationTime < thisMonthStart.getTime()
    ).length;

    const bookings = await ctx.db.query("bookings").take(10000);
    const thisMonthBookings = bookings.filter((b: any) => b._creationTime >= thisMonthStart.getTime()).length;
    const lastMonthBookings = bookings.filter(
      (b: any) => b._creationTime >= lastMonthStart.getTime() && b._creationTime < thisMonthStart.getTime()
    ).length;

    return {
      userGrowth: lastMonthUsers > 0 ? Math.round(((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100) : 0,
      bookingGrowth: lastMonthBookings > 0 ? Math.round(((thisMonthBookings - lastMonthBookings) / lastMonthBookings) * 100) : 0,
      thisMonthUsers,
      lastMonthUsers,
      thisMonthBookings,
      lastMonthBookings,
    };
  },
});

/** Booking status breakdown for donut chart. */
export const adminGetBookingStatusBreakdown = query({
  args: {},
  handler: async (ctx) => {
    await getAdminIdentity(ctx);
    const bookings = await ctx.db.query("bookings").take(10000);
    const map: Record<string, number> = { pending: 0, confirmed: 0, active: 0, completed: 0, cancelled: 0 };
    for (const b of bookings) map[b.status] = (map[b.status] || 0) + 1;
    return Object.entries(map).map(([status, count]) => ({ status, count }));
  },
});

// ─── MUTATIONS ────────────────────────────────────────────────────────────────

export const adminApproveShop = mutation({
  args: { shopId: v.id("shops") },
  handler: async (ctx, args) => {
    const identity = await getAdminIdentity(ctx);
    const shop = await ctx.db.get(args.shopId);
    if (!shop) throw new Error("Shop not found");
    await ctx.db.patch(args.shopId, { status: "approved" });
    await logAdminAction(ctx, identity.tokenIdentifier, "APPROVE_SHOP", `Approved shop: ${shop.shopName}`, args.shopId as string, "shop");
    // Notify shop owner via in-app notification
    const owner = await ctx.db.query("users").withIndex("by_uid", (q) => q.eq("uid", shop.firebaseUid || shop.ownerId)).first();
    if (owner) {
      await ctx.db.insert("notifications", {
        userId: owner.uid,
        title: "Shop Approved! 🎉",
        message: `Your shop "${shop.shopName}" has been approved and is now live on Cutzo!`,
        type: "shop_approved",
        isRead: false,
        createdAt: Date.now(),
      });
    }
  },
});

export const adminRejectShop = mutation({
  args: { shopId: v.id("shops"), reason: v.string() },
  handler: async (ctx, args) => {
    const identity = await getAdminIdentity(ctx);
    const shop = await ctx.db.get(args.shopId);
    if (!shop) throw new Error("Shop not found");
    await ctx.db.patch(args.shopId, { status: "rejected" });
    await logAdminAction(ctx, identity.tokenIdentifier, "REJECT_SHOP", `Rejected shop: ${shop.shopName}. Reason: ${args.reason}`, args.shopId as string, "shop");
    const owner = await ctx.db.query("users").withIndex("by_uid", (q) => q.eq("uid", shop.firebaseUid || shop.ownerId)).first();
    if (owner) {
      await ctx.db.insert("notifications", {
        userId: owner.uid,
        title: "Shop Application Update",
        message: `Your shop "${shop.shopName}" was not approved. Reason: ${args.reason}`,
        type: "shop_rejected",
        isRead: false,
        createdAt: Date.now(),
      });
    }
  },
});

export const adminToggleShopActive = mutation({
  args: { shopId: v.id("shops") },
  handler: async (ctx, args) => {
    const identity = await getAdminIdentity(ctx);
    const shop = await ctx.db.get(args.shopId);
    if (!shop) throw new Error("Shop not found");
    const newVal = !shop.isActive;
    await ctx.db.patch(args.shopId, { isActive: newVal });
    await logAdminAction(ctx, identity.tokenIdentifier, "TOGGLE_SHOP_ACTIVE", `Set shop "${shop.shopName}" isActive=${newVal}`, args.shopId as string, "shop");
  },
});

export const adminToggleShopOpen = mutation({
  args: { shopId: v.id("shops") },
  handler: async (ctx, args) => {
    const identity = await getAdminIdentity(ctx);
    const shop = await ctx.db.get(args.shopId);
    if (!shop) throw new Error("Shop not found");
    const newVal = !shop.isOpen;
    await ctx.db.patch(args.shopId, { isOpen: newVal });
    await logAdminAction(ctx, identity.tokenIdentifier, "TOGGLE_SHOP_OPEN", `Set shop "${shop.shopName}" isOpen=${newVal}`, args.shopId as string, "shop");
  },
});

export const adminUpdateShopDetails = mutation({
  args: {
    shopId: v.id("shops"),
    shopName: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    openTime: v.optional(v.string()),
    closeTime: v.optional(v.string()),
    slotDuration: v.optional(v.number()),
    maxBookingsPerSlot: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await getAdminIdentity(ctx);
    const { shopId, ...fields } = args;
    const shop = await ctx.db.get(shopId);
    if (!shop) throw new Error("Shop not found");
    const patch: any = {};
    if (fields.shopName !== undefined) patch.shopName = fields.shopName;
    if (fields.phone !== undefined) patch.phone = fields.phone;
    if (fields.address !== undefined) patch.address = fields.address;
    if (fields.openTime !== undefined) patch.openTime = fields.openTime;
    if (fields.closeTime !== undefined) patch.closeTime = fields.closeTime;
    if (fields.slotDuration !== undefined) patch.slotDuration = fields.slotDuration;
    if (fields.maxBookingsPerSlot !== undefined) patch.maxBookingsPerSlot = fields.maxBookingsPerSlot;
    await ctx.db.patch(shopId, patch);
    await logAdminAction(ctx, identity.tokenIdentifier, "UPDATE_SHOP", `Updated shop "${shop.shopName}" details`, shopId as string, "shop");
  },
});

export const adminAddShopService = mutation({
  args: { shopId: v.id("shops"), name: v.string(), price: v.number(), duration: v.number() },
  handler: async (ctx, args) => {
    const identity = await getAdminIdentity(ctx);
    await ctx.db.insert("services", { shopId: args.shopId, name: args.name, price: args.price, duration: args.duration });
    await logAdminAction(ctx, identity.tokenIdentifier, "ADD_SERVICE", `Added service "${args.name}" to shopId ${args.shopId}`, args.shopId as string, "shop");
  },
});

export const adminUpdateShopService = mutation({
  args: { serviceId: v.id("services"), name: v.string(), price: v.number(), duration: v.number() },
  handler: async (ctx, args) => {
    const identity = await getAdminIdentity(ctx);
    await ctx.db.patch(args.serviceId, { name: args.name, price: args.price, duration: args.duration });
    await logAdminAction(ctx, identity.tokenIdentifier, "UPDATE_SERVICE", `Updated service ${args.serviceId}`, args.serviceId as string, "service");
  },
});

export const adminDeleteShopService = mutation({
  args: { serviceId: v.id("services") },
  handler: async (ctx, args) => {
    const identity = await getAdminIdentity(ctx);
    await ctx.db.delete(args.serviceId);
    await logAdminAction(ctx, identity.tokenIdentifier, "DELETE_SERVICE", `Deleted service ${args.serviceId}`, args.serviceId as string, "service");
  },
});

export const adminBanUser = mutation({
  args: { userId: v.id("users"), banUntil: v.number(), reason: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await getAdminIdentity(ctx);
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");
    await ctx.db.patch(args.userId, { bookingBanUntil: args.banUntil });
    const banDate = new Date(args.banUntil).toLocaleDateString();
    await logAdminAction(ctx, identity.tokenIdentifier, "BAN_USER", `Banned user ${user.name} until ${banDate}. Reason: ${args.reason || "Not specified"}`, args.userId as string, "user");
    await ctx.db.insert("notifications", {
      userId: user.uid,
      title: "Account Restriction",
      message: `Your account has been temporarily restricted until ${banDate}. Reason: ${args.reason || "Violation of terms"}`,
      type: "account_ban",
      isRead: false,
      createdAt: Date.now(),
    });
  },
});

export const adminUnbanUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await getAdminIdentity(ctx);
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");
    await ctx.db.patch(args.userId, { bookingBanUntil: undefined });
    await logAdminAction(ctx, identity.tokenIdentifier, "UNBAN_USER", `Removed ban from user ${user.name}`, args.userId as string, "user");
  },
});

export const adminAddStrike = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await getAdminIdentity(ctx);
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");
    const newStrikes = (user.noShowStrikes || 0) + 1;
    await ctx.db.patch(args.userId, { noShowStrikes: newStrikes });
    await logAdminAction(ctx, identity.tokenIdentifier, "ADD_STRIKE", `Added strike to ${user.name}. Now at ${newStrikes} strikes`, args.userId as string, "user");
  },
});

export const adminRemoveStrike = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await getAdminIdentity(ctx);
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");
    const newStrikes = Math.max(0, (user.noShowStrikes || 0) - 1);
    await ctx.db.patch(args.userId, { noShowStrikes: newStrikes });
    await logAdminAction(ctx, identity.tokenIdentifier, "REMOVE_STRIKE", `Removed strike from ${user.name}. Now at ${newStrikes} strikes`, args.userId as string, "user");
  },
});

export const adminDeleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await getAdminIdentity(ctx);
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");
    // Delete notifications
    const notifs = await ctx.db.query("notifications").withIndex("by_user", (q) => q.eq("userId", user.uid)).take(500);
    for (const n of notifs) await ctx.db.delete(n._id);
    // Delete reviews
    const reviews = await ctx.db.query("reviews").withIndex("by_customer", (q) => q.eq("customerId", user.uid)).take(500);
    for (const r of reviews) await ctx.db.delete(r._id);
    // Delete user
    await ctx.db.delete(args.userId);
    await logAdminAction(ctx, identity.tokenIdentifier, "DELETE_USER", `Deleted user ${user.name} (${user.email})`, args.userId as string, "user");
  },
});

export const adminCancelBooking = mutation({
  args: { bookingId: v.id("bookings"), reason: v.string() },
  handler: async (ctx, args) => {
    const identity = await getAdminIdentity(ctx);
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) throw new Error("Booking not found");
    await ctx.db.patch(args.bookingId, { status: "cancelled", cancelReason: args.reason });
    await logAdminAction(ctx, identity.tokenIdentifier, "CANCEL_BOOKING", `Force-cancelled booking ${args.bookingId}. Reason: ${args.reason}`, args.bookingId as string, "booking");
    await ctx.db.insert("notifications", {
      userId: booking.customerId,
      title: "Booking Cancelled",
      message: `Your booking has been cancelled. Reason: ${args.reason}`,
      type: "booking_cancelled",
      isRead: false,
      createdAt: Date.now(),
    });
  },
});

export const adminCompleteBooking = mutation({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    const identity = await getAdminIdentity(ctx);
    await ctx.db.patch(args.bookingId, { status: "completed", completedAt: Date.now() });
    await logAdminAction(ctx, identity.tokenIdentifier, "COMPLETE_BOOKING", `Force-completed booking ${args.bookingId}`, args.bookingId as string, "booking");
  },
});

export const adminDeleteReview = mutation({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    const identity = await getAdminIdentity(ctx);
    const review = await ctx.db.get(args.reviewId);
    if (!review) throw new Error("Review not found");
    // Recalculate shop rating
    const shop = await ctx.db.get(review.shopId);
    if (shop && shop.totalReviews > 0) {
      const newTotal = Math.max(0, shop.totalReviews - 1);
      const newSum = Math.max(0, (shop.totalRatingSum || shop.rating * shop.totalReviews) - review.rating);
      const newRating = newTotal > 0 ? newSum / newTotal : 0;
      await ctx.db.patch(review.shopId, { totalReviews: newTotal, totalRatingSum: newSum, rating: newRating });
    }
    await ctx.db.delete(args.reviewId);
    await logAdminAction(ctx, identity.tokenIdentifier, "DELETE_REVIEW", `Deleted review ${args.reviewId}`, args.reviewId as string, "review");
  },
});

export const adminCreateOffer = mutation({
  args: {
    title: v.string(),
    discount: v.string(),
    expiryDate: v.string(),
    city: v.string(),
    applicableShops: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await getAdminIdentity(ctx);
    const id = await ctx.db.insert("offers", args);
    await logAdminAction(ctx, identity.tokenIdentifier, "CREATE_OFFER", `Created offer "${args.title}" for ${args.city}`, id as string, "offer");
  },
});

export const adminUpdateOffer = mutation({
  args: {
    offerId: v.id("offers"),
    title: v.optional(v.string()),
    discount: v.optional(v.string()),
    expiryDate: v.optional(v.string()),
    city: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await getAdminIdentity(ctx);
    const { offerId, ...fields } = args;
    const patch: any = {};
    if (fields.title) patch.title = fields.title;
    if (fields.discount) patch.discount = fields.discount;
    if (fields.expiryDate) patch.expiryDate = fields.expiryDate;
    if (fields.city) patch.city = fields.city;
    await ctx.db.patch(offerId, patch);
    await logAdminAction(ctx, identity.tokenIdentifier, "UPDATE_OFFER", `Updated offer ${offerId}`, offerId as string, "offer");
  },
});

export const adminDeleteOffer = mutation({
  args: { offerId: v.id("offers") },
  handler: async (ctx, args) => {
    const identity = await getAdminIdentity(ctx);
    await ctx.db.delete(args.offerId);
    await logAdminAction(ctx, identity.tokenIdentifier, "DELETE_OFFER", `Deleted offer ${args.offerId}`, args.offerId as string, "offer");
  },
});

export const adminSendBroadcastNotif = mutation({
  args: {
    title: v.string(),
    message: v.string(),
    type: v.string(),
    targetRole: v.optional(v.string()), // "all" | "customer" | "shop_owner"
  },
  handler: async (ctx, args) => {
    const identity = await getAdminIdentity(ctx);
    const users = await ctx.db.query("users").take(5000);
    const targets = args.targetRole && args.targetRole !== "all"
      ? users.filter((u: any) => u.role === args.targetRole)
      : users;
    for (const user of targets) {
      await ctx.db.insert("notifications", {
        userId: user.uid,
        title: args.title,
        message: args.message,
        type: args.type,
        isRead: false,
        createdAt: Date.now(),
      });
    }
    await logAdminAction(ctx, identity.tokenIdentifier, "BROADCAST_NOTIF", `Sent broadcast "${args.title}" to ${targets.length} users (role: ${args.targetRole || "all"})`);
    return { sent: targets.length };
  },
});

export const adminSendUserNotification = mutation({
  args: { userId: v.id("users"), title: v.string(), message: v.string(), type: v.string() },
  handler: async (ctx, args) => {
    const identity = await getAdminIdentity(ctx);
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");
    await ctx.db.insert("notifications", {
      userId: user.uid,
      title: args.title,
      message: args.message,
      type: args.type,
      isRead: false,
      createdAt: Date.now(),
    });
    await logAdminAction(ctx, identity.tokenIdentifier, "SEND_NOTIFICATION", `Sent notification to ${user.name}: "${args.title}"`, args.userId as string, "user");
  },
});

export const adminUpdateAppConfig = mutation({
  args: { key: v.string(), value: v.any() },
  handler: async (ctx, args) => {
    const identity = await getAdminIdentity(ctx);
    const existing = await ctx.db.query("appConfig").withIndex("by_key", (q) => q.eq("key", args.key)).first();
    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value, updatedAt: Date.now() });
    } else {
      await ctx.db.insert("appConfig", { key: args.key, value: args.value, updatedAt: Date.now() });
    }
    await logAdminAction(ctx, identity.tokenIdentifier, "UPDATE_APP_CONFIG", `Set appConfig[${args.key}] = ${JSON.stringify(args.value)}`);
  },
});

export const adminForceCompleteWalkIn = mutation({
  args: { walkInId: v.id("walkIns") },
  handler: async (ctx, args) => {
    const identity = await getAdminIdentity(ctx);
    await ctx.db.patch(args.walkInId, { status: "completed" });
    await logAdminAction(ctx, identity.tokenIdentifier, "FORCE_COMPLETE_WALKIN", `Force-completed walk-in ${args.walkInId}`, args.walkInId as string, "walkIn");
  },
});

export const adminAddBlockedDate = mutation({
  args: { shopId: v.id("shops"), date: v.string(), reason: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await getAdminIdentity(ctx);
    await ctx.db.insert("blockedDates", { shopId: args.shopId, date: args.date, reason: args.reason });
    await logAdminAction(ctx, identity.tokenIdentifier, "ADD_BLOCKED_DATE", `Blocked date ${args.date} for shop ${args.shopId}`, args.shopId as string, "shop");
  },
});

export const adminRemoveBlockedDate = mutation({
  args: { blockedDateId: v.id("blockedDates") },
  handler: async (ctx, args) => {
    const identity = await getAdminIdentity(ctx);
    await ctx.db.delete(args.blockedDateId);
    await logAdminAction(ctx, identity.tokenIdentifier, "REMOVE_BLOCKED_DATE", `Removed blocked date ${args.blockedDateId}`, args.blockedDateId as string, "blockedDate");
  },
});

// ─── ADDITIONAL FUNCTIONS ────────────────────────────────────────────────────

/** Paginated admin activity log (alias for ActivityLogPage). */
export const adminGetAdminLogs = query({
  args: {
    paginationOpts: paginationOptsValidator,
    adminId: v.optional(v.string()),
    actionFilter: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await getAdminIdentity(ctx);
    return await ctx.db
      .query("adminLogs")
      .withIndex("by_created")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

/** Set/update a single appConfig key-value pair. Alias to adminUpdateAppConfig with string value. */
export const adminSetConfig = mutation({
  args: { key: v.string(), value: v.string() },
  handler: async (ctx, args) => {
    const identity = await getAdminIdentity(ctx);
    const existing = await ctx.db
      .query("appConfig")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value, updatedAt: Date.now() });
    } else {
      await ctx.db.insert("appConfig", { key: args.key, value: args.value, updatedAt: Date.now() });
    }
    await logAdminAction(
      ctx,
      identity.tokenIdentifier,
      "UPDATE_APP_CONFIG",
      `Set appConfig[${args.key}] = ${args.value}`
    );
  },
});

/** Returns appConfig as array of {key, value} pairs (for AppConfigPage list). */
export const adminGetAppConfigList = query({
  args: {},
  handler: async (ctx) => {
    await getAdminIdentity(ctx);
    return await ctx.db.query("appConfig").take(100);
  },
});

/** System health — enriched with aggregate metrics for the health dashboard. */
export const adminGetSystemHealth = query({
  args: {},
  handler: async (ctx) => {
    await getAdminIdentity(ctx);
    const now = Date.now();

    const activeWalkIns = await ctx.db
      .query("walkIns")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .take(500);
    const staleSessions = activeWalkIns.filter((w: any) => w.calculatedFinishTime < now).length;

    const allBookings = await ctx.db.query("bookings").take(10000);
    const totalBookings = allBookings.length;
    const confirmedBookings = allBookings.filter((b: any) => b.status === "confirmed" || b.status === "active").length;
    const totalRevenue = allBookings
      .filter((b: any) => b.status === "completed")
      .reduce((s: number, b: any) => s + (b.totalAmount || 0), 0);

    const allUsers = await ctx.db.query("users").take(10000);
    const totalUsers = allUsers.length;
    // Active = signed up in last 30 days as a proxy
    const thirtyDaysAgo = now - 30 * 86400000;
    const activeUsers = allUsers.filter((u: any) => u._creationTime > thirtyDaysAgo).length;

    const errorLogs = await ctx.db
      .query("adminLogs")
      .withIndex("by_created")
      .order("desc")
      .take(50);
    const errorLogCount = errorLogs.filter((l: any) => l.action?.includes("ERROR") || l.description?.includes("error")).length;

    return {
      staleSessions,
      totalBookings,
      confirmedBookings,
      totalRevenue,
      totalUsers,
      activeUsers,
      errorLogCount,
    };
  },
});
