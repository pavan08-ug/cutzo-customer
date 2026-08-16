import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { format, formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  Bell,
  Bookmark,
  Check,
  ChevronRight,
  FileText,
  Instagram,
  Linkedin,
  Loader2,
  MapPin,
  MessageCircle,
  Pencil,
  Scissors,
  Shield,
  Tag,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { openExternalUrl } from "../../lib/utils";
import { saveCustomer } from "./authStorage";

// ─── Shared UI Helpers ─────────────────────────────────────────────────────

function ScreenHeader({ title, subtitle, onBack, action }: { title: string; subtitle?: string; onBack: () => void; action?: React.ReactNode }) {
  return (
    <div className="shrink-0 customer-header px-4 pb-6 pt-4 safe-top">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 scale-tap"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        {action}
      </div>
      <h1 className="text-2xl font-bold text-white animate-fade-slide-up">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-white/70 animate-fade-in-delayed">{subtitle}</p>}
    </div>
  );
}

// ─── Saved Shops Screen ────────────────────────────────────────────────────

export function SavedShopsScreen({ userId, onBack }: { userId: string; onBack: () => void }) {
  const shops = useQuery(api.profile.getSavedShops, userId ? { userId } : "skip");
  const toggleSaved = useMutation(api.profile.toggleSavedShop);

  const [localShops, setLocalShops] = useState(shops);
  useEffect(() => {
    if (shops !== undefined) setLocalShops(shops);
  }, [shops]);

  const removeShop = async (shopId: any) => {
    // Optimistic UI updates
    setLocalShops((cur) => cur?.filter((s) => s._id !== shopId));
    await toggleSaved({ userId, shopId });
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-muted">
      <ScreenHeader title="Saved Shops" subtitle="Your favorite barber shops" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 pt-4" style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))" }}>
        {localShops === undefined ? (
          <div className="py-20 text-center text-muted-foreground animate-pulse">Loading...</div>
        ) : localShops.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <Bookmark className="mx-auto mb-3 h-10 w-10 opacity-30" />
            <p className="font-semibold">No saved shops</p>
            <p className="mt-1 text-xs">Shops you bookmark will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {localShops.map((shop) => (
              <div key={shop._id} className="flex gap-3 overflow-hidden rounded-[18px] bg-card p-3 card-shadow relative">
                <img
                  src={shop.image || "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=200&q=80"}
                  alt={shop.shopName}
                  className="h-20 w-20 shrink-0 rounded-[12px] object-cover"
                />
                <div className="flex-1 min-w-0 py-1">
                  <h3 className="truncate font-bold text-foreground">{shop.shopName}</h3>
                  <div className="mt-1 flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <p className="truncate text-xs font-medium">{shop.address}</p>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="flex items-center gap-1 rounded-[6px] bg-orange-100 px-1.5 py-0.5 text-[11px] font-bold text-orange-700">
                      ★ {shop.rating}
                    </span>
                    <span className="text-[11px] font-semibold text-muted-foreground border-l border-border pl-2">
                      ₹{shop.startingPrice} onwards
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeShop(shop._id)}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground scale-tap"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Offers Screen ─────────────────────────────────────────────────────────

export function OffersScreen({ city, onBack }: { city: string; onBack: () => void }) {
  const offers = useQuery(api.profile.getActiveOffers, { city });

  return (
    <div className="flex h-[100dvh] flex-col bg-muted">
      <ScreenHeader title="Offers & Coupons" subtitle={`Deals in ${city}`} onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 pt-4" style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))" }}>
        {offers === undefined ? (
          <div className="py-20 text-center text-muted-foreground animate-pulse">Loading...</div>
        ) : offers.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <Tag className="mx-auto mb-3 h-10 w-10 opacity-30" />
            <p className="font-semibold">No active offers</p>
            <p className="mt-1 text-xs">Check back later for exciting deals.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {offers.map((offer) => {
              const expires = new Date(offer.expiryDate);
              const isClosing = expires.getTime() - Date.now() < 24 * 60 * 60 * 1000;
              return (
                <div key={offer._id} className="relative overflow-hidden rounded-[18px] bg-card p-5 card-shadow">
                  {/* Decorative background circle */}
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="inline-block rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                          {offer.city} Offer
                        </span>
                        <h3 className="mt-2 text-xl font-extrabold text-foreground">{offer.discount}</h3>
                        <p className="mt-0.5 text-sm font-semibold text-muted-foreground">{offer.title}</p>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                        <Tag className="h-5 w-5 text-accent" />
                      </div>
                    </div>
                    
                    <div className="mt-5 flex items-center justify-between border-t border-dashed border-border pt-4">
                      <p className={`text-xs font-bold ${isClosing ? "text-destructive" : "text-muted-foreground"}`}>
                        Expires {format(expires, "MMM do, yyyy")}
                      </p>
                      <button className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-white scale-tap">
                        Copy Code
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Personal Info Screen ──────────────────────────────────────────────────

export function PersonalInfoScreen({ userId, onBack }: { userId: string; onBack: () => void }) {
  const customerList = useQuery(api.users.getUserByUid, userId ? { uid: userId } : "skip");
  const updateUserProfile = useMutation(api.users.updateUserProfile);
  const upsertUser = useMutation(api.users.upsertUser);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);

  const c = customerList;

  useEffect(() => {
    if (c) {
      setName(c.name || "");
      setPhone(c.phone || "");
      setLocation(c.location || "");
    }
  }, [c]);

  const handleEditClick = (field: "name" | "phone" | "location") => {
    setIsEditing(true);
    setTimeout(() => {
      if (field === "name") nameRef.current?.focus();
      if (field === "phone") phoneRef.current?.focus();
      if (field === "location") locationRef.current?.focus();
    }, 50);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      // 1. Call updateUserProfile in Convex to update profile & remove previous data
      if (api.users.updateUserProfile) {
        await updateUserProfile({
          uid: userId,
          name: name.trim(),
          phone: phone.trim(),
          location: location.trim(),
        });
      } else {
        await upsertUser({
          uid: userId,
          name: name.trim(),
          email: c?.email || "",
          phone: phone.trim(),
          location: location.trim(),
          gpsLocation: c?.gpsLocation || "",
          role: c?.role || "customer",
        });
      }

      // 2. Also update local storage session/customer DB
      try {
        saveCustomer({
          userId: userId,
          role: c?.role || "customer",
          name: name.trim(),
          phone: phone.trim(),
          location: location.trim() || "Location pending",
          email: c?.email || "",
        });
      } catch (e) {
        console.warn("Local save error", e);
      }

      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (customerList === undefined) {
    return (
      <div className="flex h-[100dvh] flex-col bg-muted">
        <ScreenHeader title="Personal Info" onBack={onBack} />
        <div className="py-20 text-center animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-muted">
      <ScreenHeader 
        title="Personal Info" 
        subtitle="Your account details" 
        onBack={onBack}
        action={
          !isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold text-white scale-tap hover:bg-white/30 transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span>Edit</span>
            </button>
          ) : undefined
        }
      />
      <div className="flex-1 overflow-y-auto px-4 pt-4" style={{ paddingBottom: "calc(100px + env(safe-area-inset-bottom, 0px))" }}>
        {saveSuccess && (
          <div className="mb-4 flex items-center gap-2.5 rounded-2xl bg-green-500/15 border border-green-500/30 p-3.5 text-xs font-bold text-green-700 dark:text-green-400 animate-fade-slide-up shadow-sm">
            <Check className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
            <span>Profile updated & previous data removed from Convex!</span>
          </div>
        )}

        <div className="overflow-hidden rounded-[18px] bg-card card-shadow mb-6">
          {/* Full Name */}
          <div className="border-b border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-3">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Full Name</p>
                {isEditing ? (
                  <input
                    ref={nameRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    className="mt-1.5 w-full rounded-xl border border-primary/40 bg-primary/5 px-3.5 py-2 text-base font-semibold text-foreground focus:border-primary focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                  />
                ) : (
                  <p className="mt-1 text-base font-semibold text-foreground">{name || c?.name || "Not provided"}</p>
                )}
              </div>
              {!isEditing && (
                <button
                  onClick={() => handleEditClick("name")}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 active:scale-95 transition-all scale-tap"
                  title="Edit Name"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Phone Number */}
          <div className="border-b border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-3">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Phone Number</p>
                {isEditing ? (
                  <input
                    ref={phoneRef}
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="mt-1.5 w-full rounded-xl border border-primary/40 bg-primary/5 px-3.5 py-2 text-base font-semibold text-foreground focus:border-primary focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                  />
                ) : (
                  <p className="mt-1 text-base font-semibold text-foreground">{phone || c?.phone || "Not provided"}</p>
                )}
              </div>
              {!isEditing && (
                <button
                  onClick={() => handleEditClick("phone")}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 active:scale-95 transition-all scale-tap"
                  title="Edit Phone Number"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Email (Read only) */}
          <div className="p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Email</p>
            <p className="mt-1 text-base font-semibold text-foreground">{c?.email || "Not provided"}</p>
          </div>
        </div>

        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location Settings</p>
        <div className="overflow-hidden rounded-[18px] bg-card card-shadow mb-6">
          {/* Current City */}
          <div className="border-b border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-3">
                <p className="text-sm font-semibold text-foreground">Current City</p>
                {isEditing ? (
                  <input
                    ref={locationRef}
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter city (e.g., Bnglr)"
                    className="mt-1.5 w-full rounded-xl border border-primary/40 bg-primary/5 px-3.5 py-2 text-sm font-medium text-foreground focus:border-primary focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                  />
                ) : (
                  <p className="mt-0.5 text-xs text-muted-foreground">{location || c?.location || "Unknown"}</p>
                )}
              </div>
              {isEditing ? (
                <MapPin className="h-5 w-5 text-primary shrink-0 self-center" />
              ) : (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary shrink-0" />
                  <button
                    onClick={() => handleEditClick("location")}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 active:scale-95 transition-all scale-tap"
                    title="Edit Location"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* GPS Permission */}
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-semibold text-foreground">GPS Permission</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Used for showing nearby shops</p>
            </div>
            <div className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-green-700">
              Allowed
            </div>
          </div>
        </div>

        {/* Update / Action Buttons */}
        {isEditing ? (
          <div className="mt-4 flex gap-3 animate-fade-in">
            <button
              onClick={() => {
                setIsEditing(false);
                setName(c?.name || "");
                setPhone(c?.phone || "");
                setLocation(c?.location || "");
              }}
              disabled={isSaving}
              className="flex-1 rounded-2xl border border-border bg-card py-3.5 text-sm font-bold text-muted-foreground hover:bg-muted active:scale-95 transition-all scale-tap"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !name.trim()}
              className="flex-[2] flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-primary/90 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:opacity-95 active:scale-95 transition-all scale-tap disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>Update Profile</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 py-3.5 text-sm font-bold text-primary hover:bg-primary/15 active:scale-95 transition-all scale-tap"
            >
              <Pencil className="h-4 w-4" />
              <span>Edit Personal Info</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── Notifications Screen ──────────────────────────────────────────────────

export function NotificationsScreen({ userId, onBack }: { userId: string; onBack: () => void }) {
  const { results, status, loadMore } = usePaginatedQuery(
    api.profile.getUserNotifications,
    userId ? { userId } : "skip",
    { initialNumItems: 10 }
  );

  const clearAll = useMutation(api.profile.clearUserNotifications);
  const deleteNotification = useMutation(api.profile.deleteNotification);

  const handleClearAll = async () => {
    if (confirm("Are you sure you want to clear all notifications?")) {
      await clearAll({ userId });
    }
  };

  const handleDelete = async (id: any, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNotification({ notificationId: id });
  };

  const actionButton = (results?.length ?? 0) > 0 ? (
    <button
      onClick={handleClearAll}
      className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold text-white scale-tap hover:bg-white/30 transition-colors"
    >
      Clear All
    </button>
  ) : null;

  return (
    <div className="flex h-[100dvh] flex-col bg-muted">
      <ScreenHeader title="Notifications" subtitle="Updates and alerts" onBack={onBack} action={actionButton} />
      <div className="flex-1 overflow-y-auto px-4 pt-4" style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))" }}>
        {status === "LoadingFirstPage" ? (
          <div className="py-20 text-center animate-pulse">Loading...</div>
        ) : (results?.length ?? 0) === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <Bell className="mx-auto mb-3 h-10 w-10 opacity-30" />
            <p className="font-semibold">No notifications yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {results?.map((n) => (
              <div key={n._id} className={`flex gap-3 rounded-[18px] p-4 card-shadow relative ${n.isRead ? "bg-card" : "bg-primary/5"}`}>
                <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${n.isRead ? "bg-muted text-muted-foreground" : "bg-primary text-white"}`}>
                  <Bell className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`text-sm font-bold truncate ${n.isRead ? "text-foreground" : "text-primary"}`}>{n.title}</h3>
                    <span className="shrink-0 text-[10px] font-semibold text-muted-foreground mt-0.5">
                      {formatDistanceToNow(n.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                </div>
                <button
                  onClick={(e) => handleDelete(n._id, e)}
                  className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground scale-tap hover:bg-muted/80 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            
            {status === "CanLoadMore" && (
              <button
                onClick={() => loadMore(15)}
                className="mt-4 w-full rounded-xl border border-border py-4 text-sm font-bold text-primary hover:bg-primary/5 active:scale-95 transition-all"
              >
                Load More Notifications
              </button>
            )}
            
            {status === "LoadingMore" && (
              <div className="mt-4 py-4 text-center text-xs font-semibold text-muted-foreground animate-pulse">
                Fetching more...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Static Policy Screens ─────────────────────────────────────────────────

// ─── Static Policy Screens ─────────────────────────────────────────────────

export function PrivacyScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex h-[100dvh] flex-col bg-muted">
      <ScreenHeader title="Privacy Policy" subtitle="Last Updated: August 4, 2026" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 pt-4" style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))" }}>
        <div className="rounded-[18px] bg-card p-5 card-shadow space-y-6 text-foreground">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 shrink-0">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Cutzo Privacy Policy</h2>
              <p className="text-xs text-muted-foreground">How we collect, use, and protect your data</p>
            </div>
          </div>

          <div className="rounded-xl bg-primary/5 p-4 text-xs leading-relaxed text-foreground border border-primary/20">
            <strong>Introduction:</strong> Cutzo ("we", "our", or "us") operates the Cutzo mobile application (the "Service"). This page explains what information we collect, why we collect it, and how we protect it.
          </div>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">1</span>
              Information We Collect
            </h3>
            <ul className="space-y-1.5 text-xs text-muted-foreground pl-2">
              <li>• <strong className="text-foreground">Phone number:</strong> User authentication and booking communication</li>
              <li>• <strong className="text-foreground">Name:</strong> Personalization and booking records</li>
              <li>• <strong className="text-foreground">Location (approximate):</strong> Finding nearby salons/barbershops</li>
              <li>• <strong className="text-foreground">Device push token:</strong> Sending booking status notifications</li>
              <li>• <strong className="text-foreground">Payment transaction reference:</strong> Confirming slot booking fee payment</li>
            </ul>
            <div className="mt-3 rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-800 dark:text-amber-300">
              <strong>Important:</strong> We do NOT collect or store your UPI PIN, card number, CVV, or bank account details. All payment processing is handled securely by Razorpay (a PCI-DSS compliant payment gateway).
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">2</span>
              How We Use Your Information
            </h3>
            <ul className="space-y-1 text-xs text-muted-foreground pl-2">
              <li>• To create and manage your account</li>
              <li>• To process slot bookings and send confirmation OTPs</li>
              <li>• To notify you about booking status updates</li>
              <li>• To detect and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">3</span>
              Payments
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Cutzo charges a non-refundable platform fee of ₹3 per booking to confirm your appointment slot. This fee is processed securely through Razorpay. We store only the Razorpay Order ID and Payment ID for record-keeping — never your actual payment credentials.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">4</span>
              Data Sharing
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We share your name and phone number with the shop/salon you book with, solely for the purpose of fulfilling your appointment. We do not sell your data to third parties.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">5</span>
              Data Retention
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We retain your booking history for 1 year. You may request deletion of your account and associated data by contacting us at <a href="mailto:support@cutzo.in" className="text-primary font-semibold underline">support@cutzo.in</a>.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">6</span>
              Security
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All data is stored securely. All API communications use HTTPS/TLS encryption.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">7</span>
              Children's Privacy
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our Service is not directed to children under 13. We do not knowingly collect data from children.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">8</span>
              Contact Us
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If you have any questions, contact us at: <a href="mailto:support@cutzo.in" className="text-primary font-semibold underline">support@cutzo.in</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export function TermsScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex h-[100dvh] flex-col bg-muted">
      <ScreenHeader title="Terms & Conditions" subtitle="Effective Date: August 5, 2026 | Last Updated: August 5, 2026" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 pt-4" style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))" }}>
        <div className="rounded-[18px] bg-card p-5 card-shadow space-y-6 text-foreground">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 shrink-0">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Terms & Conditions</h2>
              <p className="text-xs text-muted-foreground">User agreement & platform usage rules</p>
            </div>
          </div>

          <div className="text-xs text-muted-foreground border-b border-border pb-4 space-y-1">
            <p><strong>App Name:</strong> Cutzo – Barber Booking App</p>
            <p><strong>Operated by:</strong> Cutzo Life</p>
            <p><strong>Website:</strong> <a href="https://cutzolife.in" target="_blank" rel="noreferrer" className="text-primary font-semibold underline">https://cutzolife.in</a></p>
            <p><strong>Support:</strong> WhatsApp <a href="https://wa.me/919164228596" target="_blank" rel="noreferrer" className="text-primary font-semibold underline">+91 91642 28596</a> | Instagram <a href="https://www.instagram.com/cutzo.life/" target="_blank" rel="noreferrer" className="text-primary font-semibold underline">@cutzo.life</a></p>
          </div>

          <div className="rounded-xl bg-primary/5 p-4 text-xs leading-relaxed text-foreground border border-primary/20">
            By downloading, installing, or using the Cutzo mobile application ("App"), you ("Customer," "User," or "you") agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, do not use the App.
          </div>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">1</span>
              Acceptance of Terms
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              By downloading, installing, or using the Cutzo mobile application ("App"), you ("Customer," "User," or "you") agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, do not use the App.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              These Terms apply to all users of the App, including customers who book appointments and shop owners who list their services on the platform.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">2</span>
              About Cutzo
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              Cutzo is a <strong>technology platform</strong> that connects customers with barber shops and grooming professionals in India. Cutzo acts as an intermediary marketplace — we facilitate bookings and payments but are <strong>not</strong> the service provider.
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground pl-2">
              <li>• The actual grooming services are provided by independent barber shops and professionals ("Vendors")</li>
              <li>• Cutzo does not employ barbers or operate barber shops</li>
              <li>• Cutzo is not responsible for the quality, safety, or outcome of services provided by Vendors</li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">3</span>
              Eligibility
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              To use the App, you must:
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground pl-2 mb-2">
              <li>• Be at least <strong>18 years of age</strong></li>
              <li>• Have a valid Google account for authentication</li>
              <li>• Have a valid Indian mobile phone number (+91)</li>
              <li>• Reside in India (the platform currently operates in India only)</li>
              <li>• Have the legal capacity to enter into a binding agreement</li>
            </ul>
            <p className="text-xs text-muted-foreground leading-relaxed">
              By creating an account, you represent and warrant that you meet all of the above requirements.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">4</span>
              Account Registration
            </h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div>
                <strong className="text-foreground font-semibold">4.1 Sign-In Method:</strong> Cutzo uses <strong>Google Sign-In</strong> (powered by Firebase Authentication) as the sole authentication method for customers. By signing in, you authorise Cutzo to access your Google Account name and email address.
              </div>
              <div>
                <strong className="text-foreground font-semibold">4.2 Profile Completion:</strong> After Google Sign-In, you must complete your profile by providing: your full name, a valid 10-digit Indian mobile number, and your city. You confirm that all information provided is accurate and up to date.
              </div>
              <div>
                <strong className="text-foreground font-semibold">4.3 Account Responsibility:</strong> You are responsible for maintaining the security of your account. You agree to not share your account with others, notify us immediately of any unauthorised use, and ensure the phone number on your account is valid and reachable.
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">5</span>
              Booking Process
            </h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div>
                <strong className="text-foreground font-semibold">5.1 How Bookings Work:</strong>
                <ul className="space-y-1 pl-2 mt-1">
                  <li>1. You browse available barber shops filtered by your location or city</li>
                  <li>2. You select a shop, choose one or more services, pick a date and available time slot</li>
                  <li>3. You review the booking summary and pay the ₹3 non-refundable platform booking fee via Razorpay</li>
                  <li>4. Your booking request is sent to the shop owner for confirmation</li>
                  <li>5. You will receive a booking confirmation notification once the shop accepts</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground font-semibold">5.2 Booking Confirmation:</strong> A booking is only confirmed when: payment of the ₹3 platform fee is successfully completed, AND the shop owner accepts the booking request. A booking request that has not been accepted is <strong>not</strong> a confirmed appointment.
              </div>
              <div>
                <strong className="text-foreground font-semibold">5.3 Slot Availability:</strong> Slot availability is checked in real time. Cutzo cannot guarantee that a slot will remain available between selection and payment. If a slot becomes unavailable before payment is completed, you will be notified and the payment will not proceed.
              </div>
              <div>
                <strong className="text-foreground font-semibold">5.4 Service Cost:</strong> The ₹3 booking fee is a <strong>platform fee</strong> charged by Cutzo to secure your slot. The actual cost of grooming services is displayed in the App and must be <strong>paid directly to the shop</strong> at the time of service. Cutzo does not collect the service fee.
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">6</span>
              Payments
            </h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div>
                <strong className="text-foreground font-semibold">6.1 Platform Booking Fee:</strong>
                <ul className="space-y-1 pl-2 mt-1">
                  <li>• A non-refundable fee of <strong>₹3 (Indian Rupees three)</strong> is charged per booking to secure your appointment slot</li>
                  <li>• This fee is processed securely through <strong>Razorpay</strong>, a PCI-DSS compliant payment gateway</li>
                  <li>• The amount is hardcoded on our server — it cannot be tampered with or overridden</li>
                  <li>• All transactions are in Indian Rupees (INR)</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground font-semibold">6.2 Payment Security:</strong>
                <ul className="space-y-1 pl-2 mt-1">
                  <li>• Cutzo does <strong>not</strong> store your card number, CVV, UPI PIN, or bank account details</li>
                  <li>• Only Razorpay Order ID and Payment ID are stored for verification and audit purposes</li>
                  <li>• All payment signatures are verified using HMAC-SHA256 cryptographic verification</li>
                  <li>• A maximum of 5 payment order creations per hour per account is enforced to prevent abuse</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground font-semibold">6.3 Failed Payments:</strong> If a payment is deducted but the booking is not successfully created, the amount will be automatically refunded by Razorpay to your original payment method within <strong>5–7 business days</strong>.
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">7</span>
              Cancellation & Refund Policy
            </h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div>
                <strong className="text-foreground font-semibold">7.1 Customer Cancellation:</strong> The ₹3 booking fee is <strong>non-refundable</strong> if you cancel an appointment or if you are a no-show (fail to appear for your appointment).
              </div>
              <div>
                <strong className="text-foreground font-semibold">7.2 Vendor Cancellation:</strong> If the barber shop or shop owner cancels a confirmed booking, the ₹3 booking fee will be <strong>fully refunded</strong> to the original payment method. Refunds will be processed within <strong>5–7 business days</strong>.
              </div>
              <div>
                <strong className="text-foreground font-semibold">7.3 Failed Transaction Refunds:</strong> If a payment fails or is deducted without a successful booking confirmation, an automatic refund will be issued within <strong>5–7 business days</strong>.
              </div>
              <div>
                <strong className="text-foreground font-semibold">7.4 Refund Process:</strong> Refunds are processed through Razorpay back to the original payment method (card, UPI, net banking, wallet). Cutzo does not process cash refunds.
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">8</span>
              No-Show Policy
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              If you fail to appear for a confirmed appointment without cancellation:
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground pl-2">
              <li>• A <strong>no-show strike</strong> will be recorded on your account</li>
              <li>• Accumulation of <strong>3 or more no-show strikes</strong> may result in a <strong>temporary booking ban</strong></li>
              <li>• The ban duration is at Cutzo's discretion and may range from 24 hours to 7 days</li>
              <li>• Repeated violations may result in permanent suspension of your account</li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">9</span>
              OTP Check-In System
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              When you arrive at a barber shop for your appointment, you may be required to provide a <strong>One-Time Password (OTP)</strong> to verify your identity and confirm your arrival. The OTP is:
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground pl-2">
              <li>• Generated at the time of booking</li>
              <li>• Shared only with the shop owner on your arrival</li>
              <li>• Valid for a limited time period</li>
              <li>• Deleted after expiry</li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">10</span>
              Reviews and Ratings
            </h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div>
                <strong className="text-foreground font-semibold">10.1 Eligibility:</strong> Only customers who have completed a verified booking at a shop may leave a review for that shop.
              </div>
              <div>
                <strong className="text-foreground font-semibold">10.2 Review Standards:</strong> By submitting a review, you agree that your review is honest and based on genuine experience, and you will not post defamatory, abusive, offensive, or misleading content, or post reviews in exchange for payment.
              </div>
              <div>
                <strong className="text-foreground font-semibold">10.3 Moderation:</strong> Cutzo reserves the right to remove reviews that violate these standards.
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">11</span>
              Prohibited Activities
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              You agree <strong>not</strong> to:
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground pl-2">
              <li>• Create fake or multiple accounts</li>
              <li>• Impersonate another person or entity</li>
              <li>• Submit false booking requests</li>
              <li>• Attempt to manipulate slot availability or payment amounts</li>
              <li>• Harass, abuse, or threaten shop owners or other users</li>
              <li>• Attempt to reverse-engineer, scrape, or exploit the platform</li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">12</span>
              Vendor / Shop Owner Terms
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Shop owners separately agree to provide accurate information, honour confirmed bookings, not charge more than listed pricing, and accept/reject booking requests timely. Cutzo reserves the right to suspend or remove shops for non-compliance.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">13</span>
              Push Notifications and Messaging
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              By creating an account, you consent to receive push notifications via Firebase Cloud Messaging and appointment reminders via Meta WhatsApp API (or SMS fallback).
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">14</span>
              Intellectual Property
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All content in the App, including the Cutzo name, logo, design, graphics, and code, is the exclusive property of Cutzo Life and is protected by intellectual property laws.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">15</span>
              Third-Party Services
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The App integrates with Google/Firebase, Razorpay, Meta WhatsApp API, Twilio, and Convex. Cutzo is not responsible for their terms or conduct.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">16</span>
              Disclaimers
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Cutzo provides a technology marketplace only. We do not guarantee the quality, safety, or skill of Vendors. We do not guarantee uninterrupted or error-free operation of the App.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">17</span>
              Limitation of Liability
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              To the maximum extent permitted by law, Cutzo Life is not liable for indirect, incidental, or consequential damages. Our total liability is limited to the booking fee actually paid (i.e. ₹3).
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">18</span>
              Indemnification
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You agree to indemnify and hold harmless Cutzo Life from any claims, damages, or expenses arising from your use of the App or violation of these Terms.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">19</span>
              Governing Law and Dispute Resolution
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka, India.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">20</span>
              Modifications to Terms
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms at any time. Continued use of the App after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">21</span>
              Termination
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You may stop using the App at any time. We reserve the right to suspend or terminate your account if you violate these Terms or accumulate no-show strikes.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">22</span>
              Contact Us
            </h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>For any questions, concerns, or disputes related to these Terms:</p>
              <div className="pl-2 pt-1 space-y-1">
                <p><strong>Cutzo Life</strong></p>
                <p>📱 WhatsApp: <a href="https://wa.me/919164228596" target="_blank" rel="noreferrer" className="text-primary font-semibold underline">+91 91642 28596</a></p>
                <p>📸 Instagram: <a href="https://www.instagram.com/cutzo.life/" target="_blank" rel="noreferrer" className="text-primary font-semibold underline">@cutzo.life</a></p>
                <p>💼 LinkedIn: <a href="https://www.linkedin.com/company/cutzo-life/" target="_blank" rel="noreferrer" className="text-primary font-semibold underline">Cutzo Life</a></p>
                <p>🌐 Website: <a href="https://cutzolife.in" target="_blank" rel="noreferrer" className="text-primary font-semibold underline">https://cutzolife.in</a></p>
                <p>📄 Terms URL: <a href="https://cutzolife.in/terms" target="_blank" rel="noreferrer" className="text-primary font-semibold underline">https://cutzolife.in/terms</a></p>
              </div>
            </div>
          </section>

          <div className="border-t border-border pt-4 mt-6">
            <h3 className="text-xs font-bold text-foreground mb-2 uppercase tracking-wider">Additional Disclosures</h3>
          </div>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">23</span>
              Service Description
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Cutzo is a slot booking platform that allows customers to book appointments at salons and barbershops.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">24</span>
              Platform Booking Fee
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              A non-refundable platform fee of ₹3 is charged per booking to secure your appointment slot. This fee is:
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground pl-2">
              <li>• Charged at the time of booking confirmation</li>
              <li>• Non-refundable if you cancel or do not show up</li>
              <li>• Processed via Razorpay (secure payment gateway)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">25</span>
              Refund Policy
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The ₹3 platform fee is non-refundable. However, if a payment is deducted but a booking is not created due to a technical error, you may contact us at <a href="mailto:support@cutzo.in" className="text-primary font-semibold underline">support@cutzo.in</a> within 48 hours for a review.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">26</span>
              User Responsibilities
            </h3>
            <ul className="space-y-1 text-xs text-muted-foreground pl-2">
              <li>• You must provide accurate information when booking</li>
              <li>• You must arrive on time for your appointment</li>
              <li>• You must be at least 13 years old to use this service</li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">27</span>
              Cancellations
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You can cancel a booking from the "My Bookings" screen. The ₹3 fee is not refunded upon cancellation.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">28</span>
              Limitation of Liability
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Cutzo is a platform that connects customers with service providers. We are not responsible for the quality of services provided by shops. Any disputes regarding services must be resolved directly with the shop.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">29</span>
              Changes to Terms
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time. Continued use of the app after changes constitutes acceptance.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export function HelpScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex h-[100dvh] flex-col bg-muted">
      <ScreenHeader title="Connect Us" subtitle="We're here for you" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 pt-4" style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))" }}>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => openExternalUrl("https://wa.me/919164228596")}
            className="flex items-center justify-between rounded-[16px] bg-card p-4 card-shadow scale-tap w-full"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">WhatsApp Support</p>
                <p className="text-xs text-muted-foreground">+91 91 6422 859 6 • Avg. response: 5 mins</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>

          <button
            onClick={() => openExternalUrl("https://www.instagram.com/cutzo.life/")}
            className="flex items-center justify-between rounded-[16px] bg-card p-4 card-shadow scale-tap w-full"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                <Instagram className="h-5 w-5 text-pink-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">Instagram</p>
                <p className="text-xs text-muted-foreground">Follow & Connect on @cutzo.life</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>

          <button
            onClick={() => openExternalUrl("https://www.linkedin.com/company/cutzo-life/?viewAsMember=true")}
            className="flex items-center justify-between rounded-[16px] bg-card p-4 card-shadow scale-tap w-full"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Linkedin className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">LinkedIn</p>
                <p className="text-xs text-muted-foreground">Connect with Cutzo Life company page</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function AboutScreen({ onBack, onOpenTerms, onOpenPrivacy, onOpenTeam }: { onBack: () => void; onOpenTerms?: () => void; onOpenPrivacy?: () => void; onOpenTeam?: () => void }) {
  return (
    <div className="flex h-[100dvh] flex-col bg-muted">
      <ScreenHeader title="About CUTZO" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 pt-6 text-center" style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))" }}>
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[24px] bg-primary card-shadow">
          <Scissors className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-2xl font-extrabold text-foreground">CUTZO</h2>
        <p className="text-sm font-medium text-muted-foreground">Booking Hub</p>
        <p className="mt-2 text-xs font-bold uppercase tracking-widest text-primary">Version {typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.0.0'}</p>
        
        <div className="mx-auto mt-6 max-w-xs text-sm text-muted-foreground leading-relaxed">
          CUTZO simplifies barber shop bookings. Our mission is to connect customers with the best grooming professionals seamlessly.
        </div>

        <div className="mx-auto mt-6 max-w-xs p-4 rounded-xl bg-card border border-border text-left">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Cutzo Team</h3>
          <p className="text-xs text-muted-foreground mb-2">Co-Founders: Pavan U G & Mohammed Nadeem</p>
          <a
            href="https://cutzolife.in/team"
            onClick={(e) => {
              if (onOpenTeam) {
                e.preventDefault();
                onOpenTeam();
              }
            }}
            className="text-xs font-bold text-primary hover:underline"
          >
            Meet the Founders →
          </a>
        </div>
        
        <div className="mt-6 flex flex-col gap-2">
          <button onClick={() => onOpenTerms ? onOpenTerms() : openExternalUrl("https://cutzolife.in/terms")} className="text-sm font-semibold text-primary scale-tap">Terms & Conditions</button>
          <button onClick={() => onOpenPrivacy ? onOpenPrivacy() : openExternalUrl("https://cutzolife.in/privacy")} className="text-sm font-semibold text-primary scale-tap">Privacy Policy</button>
        </div>
      </div>
    </div>
  );
}

export function TeamScreen({ onBack, onSelectFounder }: { onBack: () => void; onSelectFounder?: (founder: "pavan" | "nadeem") => void }) {
  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <ScreenHeader title="Cutzo Team" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-24 max-w-lg mx-auto w-full">
        <div className="text-center mb-6">
          <h2 className="text-xl font-black text-foreground">Meet the Founders</h2>
          <p className="text-xs text-muted-foreground mt-1">The leadership driving Cutzo Life</p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
                P
              </div>
              <div>
                <h3 className="font-extrabold text-foreground text-base">Pavan U G</h3>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">Co-Founder of Cutzo</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              Pavan U G is a Co-Founder of Cutzo, a salon booking platform focused on helping users discover nearby barber shops, explore services and prices, and book appointments.
            </p>
            <a
              href="https://cutzolife.in/team/pavan-u-g"
              onClick={(e) => {
                if (onSelectFounder) {
                  e.preventDefault();
                  onSelectFounder("pavan");
                }
              }}
              className="inline-flex items-center justify-center w-full py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors"
            >
              View Full Profile →
            </a>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
                M
              </div>
              <div>
                <h3 className="font-extrabold text-foreground text-base">Mohammed Nadeem</h3>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">Co-Founder of Cutzo</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              Mohammed Nadeem is a Co-Founder of Cutzo, a salon booking platform focused on helping users discover nearby barber shops, explore services and prices, and book appointments.
            </p>
            <a
              href="https://cutzolife.in/team/mohammed-nadeem"
              onClick={(e) => {
                if (onSelectFounder) {
                  e.preventDefault();
                  onSelectFounder("nadeem");
                }
              }}
              className="inline-flex items-center justify-center w-full py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors"
            >
              View Full Profile →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PavanProfileScreen({ onBack, onOpenNadeem }: { onBack: () => void; onOpenNadeem?: () => void }) {
  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <ScreenHeader title="Pavan U G" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-24 max-w-lg mx-auto w-full">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white font-bold text-2xl mb-4 shadow-md">
            P
          </div>
          <h1 className="text-2xl font-black text-foreground">Pavan U G</h1>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mt-1 mb-4">Co-Founder of Cutzo</p>
          
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Pavan U G is a Co-Founder of Cutzo, a salon booking platform focused on helping users discover nearby barber shops, explore services and prices, and book appointments.
          </p>

          <div className="pt-4 border-t border-border flex flex-col gap-3">
            <a
              href="https://cutzolife.in/team/pavan-u-g"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-primary hover:underline"
            >
              https://cutzolife.in/team/pavan-u-g
            </a>
            {onOpenNadeem && (
              <button
                onClick={onOpenNadeem}
                className="text-xs text-muted-foreground hover:text-foreground text-left"
              >
                Co-Founder: Mohammed Nadeem →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function NadeemProfileScreen({ onBack, onOpenPavan }: { onBack: () => void; onOpenPavan?: () => void }) {
  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <ScreenHeader title="Mohammed Nadeem" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-24 max-w-lg mx-auto w-full">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white font-bold text-2xl mb-4 shadow-md">
            M
          </div>
          <h1 className="text-2xl font-black text-foreground">Mohammed Nadeem</h1>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mt-1 mb-4">Co-Founder of Cutzo</p>
          
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Mohammed Nadeem is a Co-Founder of Cutzo, a salon booking platform focused on helping users discover nearby barber shops, explore services and prices, and book appointments.
          </p>

          <div className="pt-4 border-t border-border flex flex-col gap-3">
            <a
              href="https://cutzolife.in/team/mohammed-nadeem"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-primary hover:underline"
            >
              https://cutzolife.in/team/mohammed-nadeem
            </a>
            {onOpenPavan && (
              <button
                onClick={onOpenPavan}
                className="text-xs text-muted-foreground hover:text-foreground text-left"
              >
                Co-Founder: Pavan U G →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

