import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { format, formatDistanceToNow } from "date-fns";
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  Bookmark,
  Check,
  ChevronRight,
  Loader2,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Scissors,
  Shield,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { TermsAndConditions, PrivacyPolicy } from "./LegalContent";
import { Screen } from "./types";
import { openExternalUrl } from "../../lib/utils";
import { clearCustomerSession, getActiveCustomer, saveCustomer } from "./authStorage";




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
  const shops = useQuery(api.profile.getSavedShops, { userId });
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
  const customerList = useQuery(api.users.getUserByUid, { uid: userId });
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
    { userId },
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

export function DeleteAccountScreen({ onBack }: { onBack: () => void }) {
  const activeCustomer = getActiveCustomer();
  const deleteAccountMutation = useMutation(api.users.deleteUserAccount);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleConfirmDelete = async () => {
    if (!activeCustomer) {
      setErrorMsg("No active session found.");
      return;
    }
    setIsDeleting(true);
    setErrorMsg("");
    try {
      await deleteAccountMutation({ uid: activeCustomer.id });
      clearCustomerSession();
      window.location.href = "/";
    } catch (err: any) {
      setErrorMsg(err.message || "Could not delete account. Please verify your connection or contact support.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-muted">
      <ScreenHeader title="Delete Account & Data" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 pt-4" style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))" }}>
        <div className="space-y-4">
          <div className="rounded-[18px] bg-card p-5 card-shadow space-y-3 border border-destructive/20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-foreground">Right to Erasure</h3>
                <p className="text-xs text-muted-foreground">Permanent Account &amp; Data Deletion</p>
              </div>
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed">
              In compliance with the Digital Personal Data Protection Act, 2023 and Google Play Store data guidelines, you may permanently delete your Cutzo account and erase all associated personal data from our systems.
            </p>
          </div>

          <div className="rounded-[18px] bg-card p-5 card-shadow space-y-3">
            <h4 className="text-sm font-bold text-foreground">What happens when you delete your account:</h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">&bull;</span>
                <span><strong>Instant Deletion:</strong> Your name, phone number, email address, profile photo, and Firebase UID are permanently deleted from our active database.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">&bull;</span>
                <span><strong>Notifications &amp; Saved Shops:</strong> All push notification tokens, reminders, and bookmarked shops are purged.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">&bull;</span>
                <span><strong>Past Bookings:</strong> Your name and contact details on past booking history are anonymized (replaced with &quot;Deleted User&quot;) to maintain necessary financial/tax transaction records for partner salons for 3 years.</span>
              </li>
            </ul>
          </div>

          {errorMsg && (
            <div className="rounded-[14px] bg-destructive/10 p-3 text-xs font-semibold text-destructive flex items-center gap-2 border border-destructive/20">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={!activeCustomer}
              className="w-full rounded-[16px] bg-destructive py-3.5 text-sm font-bold text-white shadow-lg shadow-destructive/20 scale-tap active:scale-[0.98] transition-transform disabled:opacity-50"
            >
              {activeCustomer ? "Delete My Account & Personal Data" : "Please Log In to Delete Account"}
            </button>
          </div>

          <p className="text-center text-[11px] text-muted-foreground pt-2">
            Need manual assistance? Email our Grievance Officer at <a href="mailto:cutzosaloon@gmail.com" className="text-primary font-semibold underline">cutzosaloon@gmail.com</a> or visit our <a href="/delete-account" className="text-primary font-semibold underline">Online Deletion Portal</a>.
          </p>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-[24px] bg-card p-6 shadow-2xl border border-border space-y-4 animate-scale-in">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-extrabold text-foreground">Are you absolutely sure?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This action is irreversible. Your Cutzo profile ({activeCustomer?.name}) and all associated personal records will be immediately erased.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isDeleting}
                className="flex-1 rounded-[14px] bg-muted py-3 text-xs font-bold text-foreground scale-tap"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 rounded-[14px] bg-destructive py-3 text-xs font-bold text-white shadow-md shadow-destructive/25 scale-tap flex items-center justify-center gap-1.5"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PrivacyScreen({ onBack }: { onBack: () => void }) {
  const [showDeleteScreen, setShowDeleteScreen] = useState(false);

  if (showDeleteScreen) {
    return <DeleteAccountScreen onBack={() => setShowDeleteScreen(false)} />;
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-muted">
      <ScreenHeader title="Privacy Policy" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 pt-4" style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))" }}>
        <div className="space-y-4">
          <div className="rounded-[18px] bg-card p-5 card-shadow">
            <PrivacyPolicy />
          </div>
          <div className="rounded-[18px] bg-destructive/5 p-4 card-shadow border border-destructive/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-bold text-destructive">Right to Erasure</p>
                <p className="text-xs text-muted-foreground">Delete your account &amp; personal data</p>
              </div>
            </div>
            <button
              onClick={() => setShowDeleteScreen(true)}
              className="rounded-xl bg-destructive px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-destructive/20 scale-tap"
            >
              Manage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


export function TermsScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex h-[100dvh] flex-col bg-muted">
      <ScreenHeader title="Terms & Conditions" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 pt-4" style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))" }}>
        <div className="rounded-[18px] bg-card p-5 card-shadow">
          <TermsAndConditions />
        </div>
      </div>
    </div>
  );
}

export function HelpScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex h-[100dvh] flex-col bg-muted">
      <ScreenHeader title="Help Center" subtitle="We're here for you" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 pt-4" style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))" }}>
        <div className="flex flex-col gap-3">
          <button className="flex items-center justify-between rounded-[16px] bg-card p-4 card-shadow scale-tap">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">WhatsApp Support</p>
                <p className="text-xs text-muted-foreground">Avg. response: 5 mins</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
          
          <button className="flex items-center justify-between rounded-[16px] bg-card p-4 card-shadow scale-tap">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">Call Us</p>
                <p className="text-xs text-muted-foreground">9 AM to 9 PM daily</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function AboutScreen({ onBack, onNavigate }: { onBack: () => void; onNavigate: (screen: Screen) => void }) {
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
        
        <div className="mx-auto mt-8 max-w-xs text-sm text-muted-foreground leading-relaxed">
          CUTZO simplifies barber shop bookings. Our mission is to connect customers with the best grooming professionals seamlessly.
        </div>
        
        <div className="mt-10 flex flex-col gap-2">
          <button onClick={() => openExternalUrl("https://cutzolife.in/terms")} className="text-sm font-semibold text-primary scale-tap">Terms & Conditions</button>
          <button onClick={() => openExternalUrl("https://cutzolife.in/privacy")} className="text-sm font-semibold text-primary scale-tap">Privacy Policy</button>
        </div>
      </div>
    </div>
  );
}
