import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  ShieldAlert,
  Trash2,
  CheckCircle2,
  Smartphone,
  Globe,
  Mail,
  AlertTriangle,
  ArrowLeft,
  FileText,
  Clock,
  Database,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DeleteAccount() {
  const navigate = useNavigate();
  const requestDeletion = useMutation(api.users.requestAccountDeletion);

  const [contactInput, setContactInput] = useState("");
  const [reasonInput, setReasonInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInput.trim()) {
      setErrorMessage("Please enter your registered mobile phone number or email address.");
      return;
    }
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      const res = await requestDeletion({
        phoneOrEmail: contactInput.trim(),
        reason: reasonInput.trim() || undefined,
      });
      if (res && res.success) {
        setSubmittedId(res.requestId);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit request. Please email cutzosaloon@gmail.com directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 antialiased selection:bg-purple-500 selection:text-white pb-20">
      {/* Top Banner */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 py-4 sm:px-8">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/20">
              <Trash2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                CUTZO BOOKING HUB
              </h1>
              <p className="text-[11px] font-semibold text-purple-400 uppercase tracking-widest">
                Developer: Cutzo &bull; Account &amp; Data Deletion Portal
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-300 transition-all border border-slate-700/60"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-8 pt-8 sm:pt-12 space-y-10">
        {/* Intro Section */}
        <section className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-900/60 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-bold text-purple-300">
              <Lock className="h-3.5 w-3.5" />
              Google Play Store &amp; DPDP Act 2023 Compliant
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Request Account &amp; Personal Data Deletion
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              At <strong className="text-white">Cutzo</strong>, we respect your privacy and right to erasure under the Digital Personal Data Protection Act, 2023 (DPDP Act) and Google Play Store Developer Data guidelines. If you wish to delete your Cutzo account and permanently erase your personal data, you can do so instantly within our mobile app or by submitting a verified request using the form below.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                <Smartphone className="h-4 w-4 text-purple-400" /> App Name: Cutzo (Cutzo Booking Hub)
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                <Mail className="h-4 w-4 text-purple-400" /> Developer Email: cutzosaloon@gmail.com
              </span>
            </div>
          </div>
        </section>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Method 1: In-App Instant Deletion */}
          <section className="rounded-3xl border border-purple-500/30 bg-slate-900/90 p-6 sm:p-8 space-y-6 shadow-xl relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300 border border-purple-500/30">
                  <Smartphone className="h-3.5 w-3.5" /> Recommended Method
                </span>
                <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Instant Erasure
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Delete Directly Inside the Cutzo App
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                If you currently have the Cutzo Android app installed on your device, you can delete your account instantly without waiting for customer support verification:
              </p>
              <ol className="space-y-3 pt-2 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-600 font-bold text-white text-xs">1</span>
                  <span>Open the <strong>Cutzo</strong> mobile application and ensure you are logged in.</span>
                </li>
                <li className="flex items-start gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-600 font-bold text-white text-xs">2</span>
                  <span>Tap on the <strong>Profile</strong> icon in the bottom navigation bar.</span>
                </li>
                <li className="flex items-start gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-600 font-bold text-white text-xs">3</span>
                  <span>Under <strong>Settings</strong>, select <strong>Privacy &amp; Security</strong> (or tap the <strong>Delete Account</strong> / <strong>Log Out</strong> option).</span>
                </li>
                <li className="flex items-start gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-600 font-bold text-white text-xs">4</span>
                  <span>Tap <strong>Delete My Account &amp; Data</strong> and confirm in the security prompt. All personal records are purged instantly.</span>
                </li>
              </ol>
            </div>
            <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
              <span>Note: Once deleted inside the app, this action cannot be undone.</span>
            </div>
          </section>

          {/* Method 2: Web / Online Deletion Form */}
          <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 border border-blue-500/30">
                  <Globe className="h-3.5 w-3.5" /> Web Request Form
                </span>
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Verified in 24-48 hours
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Request Deletion Online (No App Required)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                If you have uninstalled the Cutzo app or cannot log in, submit your account details below. Our Grievance Officer will verify your ownership via OTP/Email and erase your data from our active databases.
              </p>

              {submittedId ? (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 space-y-3 text-center animate-fade-in">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                    <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h4 className="text-base font-bold text-emerald-300">
                    Deletion Request Submitted
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Your request ID is <strong className="text-white font-mono bg-slate-800 px-2 py-0.5 rounded">{submittedId}</strong>. Our support team will verify your contact details within 24 hours and confirm deletion via email/SMS.
                  </p>
                  <button
                    onClick={() => setSubmittedId(null)}
                    className="text-xs font-bold text-purple-400 hover:text-purple-300 underline pt-2"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitRequest} className="space-y-4 pt-2">
                  {errorMessage && (
                    <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs font-medium text-red-300 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">
                      Registered Mobile Number or Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={contactInput}
                      onChange={(e) => setContactInput(e.target.value)}
                      placeholder="e.g. +91 9876543210 or name@example.com"
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">
                      Reason for Deletion <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <select
                      value={reasonInput}
                      onChange={(e) => setReasonInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                    >
                      <option value="">Select a reason...</option>
                      <option value="No longer using the service">No longer using the service</option>
                      <option value="Privacy concerns">Privacy concerns</option>
                      <option value="Creating a new account">Creating a new account</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-500/25 hover:from-purple-500 hover:to-indigo-500 active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting Request..." : "Submit Deletion Request"}
                  </button>
                </form>
              )}
            </div>
            <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Or email us directly:</span>
              <a
                href="mailto:cutzosaloon@gmail.com?subject=Account%20Deletion%20Request%20-%20Cutzo"
                className="font-bold text-purple-400 hover:underline flex items-center gap-1"
              >
                <Mail className="h-3 w-3" /> cutzosaloon@gmail.com
              </a>
            </div>
          </section>
        </div>

        {/* Data Retention & Deletion Specification Table */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-10 space-y-6 shadow-xl">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <Database className="h-6 w-6 text-purple-400" />
              Data Erasure &amp; Retention Policy Schedule
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              In accordance with Google Play Store Data Policy and Indian DPDP Act 2023, the table below clearly specifies which data categories are immediately deleted, which are anonymized, and which are retained for statutory compliance.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-slate-300">
                  <th className="py-3.5 px-4 font-extrabold text-white w-1/4">Data Category</th>
                  <th className="py-3.5 px-4 font-extrabold text-white w-1/4">Action Taken upon Deletion</th>
                  <th className="py-3.5 px-4 font-extrabold text-white w-1/4">Retention Period</th>
                  <th className="py-3.5 px-4 font-extrabold text-white w-1/4">Reason / Legal Basis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-300">
                <tr className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    Personal Profile &amp; Account Info
                  </td>
                  <td className="py-3.5 px-4 text-red-400 font-semibold">
                    Hard Deleted Instantly
                  </td>
                  <td className="py-3.5 px-4 font-medium">Immediate (0 days)</td>
                  <td className="py-3.5 px-4 text-xs text-slate-400">
                    Includes Full Name, Email, Mobile Number, Profile Photo, and Firebase UID (`users` table). Right to Erasure under DPDP Act.
                  </td>
                </tr>
                <tr className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    Push Notification Tokens &amp; Preferences
                  </td>
                  <td className="py-3.5 px-4 text-red-400 font-semibold">
                    Hard Deleted Instantly
                  </td>
                  <td className="py-3.5 px-4 font-medium">Immediate (0 days)</td>
                  <td className="py-3.5 px-4 text-xs text-slate-400">
                    All FCM device tokens, saved shops bookmarks, and user notification history (`notifications` &amp; `savedShops` tables).
                  </td>
                </tr>
                <tr className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    Location Logs &amp; GPS Requests
                  </td>
                  <td className="py-3.5 px-4 text-red-400 font-semibold">
                    Purged / Deleted
                  </td>
                  <td className="py-3.5 px-4 font-medium">Immediate (auto-purged within 30 days)</td>
                  <td className="py-3.5 px-4 text-xs text-slate-400">
                    GPS coordinates used for nearby barber shop discovery (`locationRequests` table).
                  </td>
                </tr>
                <tr className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    Past Booking &amp; Transaction Records
                  </td>
                  <td className="py-3.5 px-4 text-amber-400 font-semibold">
                    Anonymized (PII Scrubbed)
                  </td>
                  <td className="py-3.5 px-4 font-medium">3 Years</td>
                  <td className="py-3.5 px-4 text-xs text-slate-400">
                    Your Customer Name and Phone Number are replaced with &quot;Deleted User&quot; / null. Anonymous service/price records (`bookings` table) are retained strictly for partner salon accounting, tax compliance, and dispute resolution under Indian financial laws.
                  </td>
                </tr>
                <tr className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    Ratings &amp; Reviews
                  </td>
                  <td className="py-3.5 px-4 text-blue-400 font-semibold">
                    Anonymized or Deleted on Request
                  </td>
                  <td className="py-3.5 px-4 font-medium">Until removed</td>
                  <td className="py-3.5 px-4 text-xs text-slate-400">
                    Customer name on reviews (`reviews` table) is anonymized. To remove review text completely, delete reviews before account deletion or email support.
                  </td>
                </tr>
                <tr className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    Fraud Prevention &amp; No-Show Strikes
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400 font-semibold">
                    Retained (Hashed Identifier)
                  </td>
                  <td className="py-3.5 px-4 font-medium">1 Year from Strike Date</td>
                  <td className="py-3.5 px-4 text-xs text-slate-400">
                    If your account accumulated active booking bans or no-show strikes, a one-way hashed identifier is retained to prevent ban evasion and protect partner shop schedules.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-400 shrink-0" />
              <span>For our complete legal terms and privacy disclosures, please read our formal policies:</span>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <a href="/privacy" className="font-bold text-purple-400 hover:underline">
                Privacy Policy
              </a>
              <span className="text-slate-600">&bull;</span>
              <a href="/terms" className="font-bold text-purple-400 hover:underline">
                Terms &amp; Conditions
              </a>
            </div>
          </div>
        </section>

        {/* Contact / Grievance Redressal Footer Box */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 text-center space-y-3">
          <h4 className="text-base font-bold text-white">Need Personal Assistance?</h4>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
            Our Grievance Officer and customer support team are ready to assist you with any questions regarding data rights, privacy concerns, or manual deletion processing under DPDP Act rules.
          </p>
          <div className="pt-2 flex justify-center">
            <a
              href="mailto:cutzosaloon@gmail.com?subject=Grievance%20Officer%20-%20Data%20Deletion%20Inquiry"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-5 py-2.5 text-xs font-bold text-white border border-slate-700 transition-all shadow-lg"
            >
              <Mail className="h-4 w-4 text-purple-400" />
              Contact Grievance Officer (cutzosaloon@gmail.com)
            </a>
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t border-slate-800/80 px-4 py-8 text-center text-xs text-slate-500">
        <p>
          &copy; {new Date().getFullYear()} Cutzo Booking Hub (&quot;Cutzo&quot;). All rights reserved. Made with precision in India.
        </p>
        <p className="mt-1">
          Registered Address: Cutzo, India &bull; Email: cutzosaloon@gmail.com &bull; Version 1.0
        </p>
      </footer>
    </div>
  );
}
