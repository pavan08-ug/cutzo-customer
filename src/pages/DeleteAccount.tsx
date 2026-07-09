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
  ChevronRight,
  ShieldCheck,
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
      setErrorMessage("Please enter your registered mobile number or email address.");
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
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased selection:bg-[#8F00FF] selection:text-white pb-24 font-sans">
      {/* Top Banner Header */}
      <header className="sticky top-0 z-50 border-b border-[#e2e8f0] bg-white/90 backdrop-blur-md px-4 py-4 sm:px-8 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-gradient-to-br from-[#8F00FF] to-[#6b00ff] shadow-md shadow-[#8F00FF]/25 text-white font-extrabold text-xl">
              C
            </div>
            <div>
              <h1 className="font-montserrat text-lg sm:text-xl font-extrabold tracking-tight text-[#1e3a8a] leading-tight">
                CUTZO BOOKING HUB
              </h1>
              <p className="text-[11px] font-bold text-[#8F00FF] uppercase tracking-wider">
                Developer: Cutzo &bull; Data Safety &amp; Erasure Portal
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 rounded-xl bg-[#f1f5f9] hover:bg-[#e2e8f0] px-4 py-2.5 text-xs font-bold text-[#334155] transition-all border border-[#cbd5e1]/60"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-8 pt-8 sm:pt-12 space-y-10">
        {/* Intro Section */}
        <section className="rounded-[28px] border border-[#e2e8f0] bg-white p-6 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#8F00FF]/5 blur-3xl pointer-events-none" />
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8F00FF]/20 bg-[#8F00FF]/10 px-3.5 py-1.5 text-xs font-bold text-[#8F00FF]">
              <ShieldCheck className="h-4 w-4 text-[#8F00FF]" />
              Google Play Store &amp; DPDP Act 2023 Compliant
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#0f172a] leading-tight">
              Request Account &amp; Personal Data Deletion
            </h2>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              At <strong className="text-[#0f172a]">Cutzo</strong>, we strictly protect your privacy and uphold your right to data erasure under the Digital Personal Data Protection Act, 2023 and Google Play Store safety guidelines. If you wish to delete your Cutzo profile and permanently erase your personal records, you may do so instantly inside our mobile app or via verified online submission below.
            </p>
            <div className="pt-2 flex flex-wrap gap-3 text-xs font-bold text-[#475569]">
              <span className="flex items-center gap-1.5 bg-[#f8fafc] px-3.5 py-2 rounded-xl border border-[#e2e8f0]">
                <Smartphone className="h-4 w-4 text-[#8F00FF]" /> App Name: Cutzo (Cutzo Booking Hub)
              </span>
              <span className="flex items-center gap-1.5 bg-[#f8fafc] px-3.5 py-2 rounded-xl border border-[#e2e8f0]">
                <Mail className="h-4 w-4 text-[#8F00FF]" /> Official Support: cutzosaloon@gmail.com
              </span>
            </div>
          </div>
        </section>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Method 1: In-App Instant Deletion */}
          <section className="rounded-[28px] border border-[#8F00FF]/30 bg-white p-6 sm:p-8 space-y-6 shadow-[0_8px_30px_rgba(143,0,255,0.06)] relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#8F00FF]/10 px-3 py-1.5 text-xs font-bold text-[#8F00FF]">
                  <Smartphone className="h-3.5 w-3.5" /> Recommended Method
                </span>
                <span className="text-xs font-extrabold text-[#16a34a] flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-lg border border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-[#16a34a]" /> Instant Erasure
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#0f172a]">
                Delete Directly Inside the Cutzo App
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                If you currently have the Cutzo mobile app installed on your device, you can permanently delete your account right now without waiting:
              </p>
              <ol className="space-y-3 pt-2 text-xs sm:text-sm text-[#334155]">
                <li className="flex items-start gap-3 bg-[#f8fafc] p-3.5 rounded-2xl border border-[#f1f5f9]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#8F00FF] font-bold text-white text-xs">1</span>
                  <span>Open the <strong>Cutzo</strong> application on your device and make sure you are logged in.</span>
                </li>
                <li className="flex items-start gap-3 bg-[#f8fafc] p-3.5 rounded-2xl border border-[#f1f5f9]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#8F00FF] font-bold text-white text-xs">2</span>
                  <span>Tap on the <strong>Profile</strong> icon located in the bottom navigation bar.</span>
                </li>
                <li className="flex items-start gap-3 bg-[#f8fafc] p-3.5 rounded-2xl border border-[#f1f5f9]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#8F00FF] font-bold text-white text-xs">3</span>
                  <span>Under the <strong>Settings</strong> section, tap <strong>Delete Account &amp; Data</strong> (or navigate via Privacy &amp; Security).</span>
                </li>
                <li className="flex items-start gap-3 bg-[#f8fafc] p-3.5 rounded-2xl border border-[#f1f5f9]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#8F00FF] font-bold text-white text-xs">4</span>
                  <span>Confirm by tapping <strong>Delete My Account &amp; Personal Data</strong>. All personal records are purged instantly.</span>
                </li>
              </ol>
            </div>
            <div className="pt-4 border-t border-[#f1f5f9] text-[11px] font-semibold text-[#dc2626] flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>Please note: Once completed, account deletion cannot be reversed.</span>
            </div>
          </section>

          {/* Method 2: Web / Online Deletion Form */}
          <section className="rounded-[28px] border border-[#e2e8f0] bg-white p-6 sm:p-8 space-y-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 border border-blue-200">
                  <Globe className="h-3.5 w-3.5 text-blue-600" /> Online Submission
                </span>
                <span className="text-xs font-bold text-[#64748b] flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Processed within 24-48 hours
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#0f172a]">
                Request Deletion Online (No App Required)
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                If you have uninstalled the Cutzo app or cannot access your phone, enter your registered contact details below. Our official Grievance Officer will verify account ownership and erase your personal records from active databases.
              </p>

              {submittedId ? (
                <div className="rounded-2xl border border-green-300 bg-green-50 p-5 space-y-3 text-center animate-fade-in">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="text-base font-bold text-green-900">
                    Deletion Request Successfully Logged
                  </h4>
                  <p className="text-xs text-green-800 leading-relaxed">
                    Your request ID is <strong className="font-mono bg-white px-2 py-0.5 rounded border border-green-200">{submittedId}</strong>. Our support team will verify your contact details and notify you upon final erasure.
                  </p>
                  <button
                    onClick={() => setSubmittedId(null)}
                    className="text-xs font-bold text-[#8F00FF] hover:underline pt-2 block mx-auto"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitRequest} className="space-y-4 pt-2">
                  {errorMessage && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#0f172a] block">
                      Registered Mobile Number or Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={contactInput}
                      onChange={(e) => setContactInput(e.target.value)}
                      placeholder="Enter your registered mobile number or email address..."
                      required
                      className="w-full rounded-2xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-sm font-medium text-[#0f172a] placeholder-[#94a3b8] focus:border-[#8F00FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8F00FF]/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#0f172a] block">
                      Reason for Deletion <span className="text-[#64748b] font-normal">(Optional)</span>
                    </label>
                    <select
                      value={reasonInput}
                      onChange={(e) => setReasonInput(e.target.value)}
                      className="w-full rounded-2xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-sm font-medium text-[#0f172a] focus:border-[#8F00FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8F00FF]/20 transition-all"
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
                    className="w-full rounded-2xl bg-gradient-to-r from-[#8F00FF] to-[#6b00ff] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#8F00FF]/25 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Logging Deletion Request..." : "Submit Deletion Request"}
                  </button>
                </form>
              )}
            </div>
            <div className="pt-4 border-t border-[#f1f5f9] text-[11px] text-[#64748b] flex items-center justify-between">
              <span>Need help? Direct support email:</span>
              <a
                href="mailto:cutzosaloon@gmail.com?subject=Account%20Deletion%20Request%20-%20Cutzo"
                className="font-bold text-[#8F00FF] hover:underline flex items-center gap-1"
              >
                <Mail className="h-3 w-3" /> cutzosaloon@gmail.com
              </a>
            </div>
          </section>
        </div>

        {/* Data Retention & Deletion Specification Table */}
        <section className="rounded-[28px] border border-[#e2e8f0] bg-white p-6 sm:p-10 space-y-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-[#0f172a] flex items-center gap-2.5">
              <Database className="h-6 w-6 text-[#8F00FF]" />
              Data Erasure &amp; Retention Policy Schedule
            </h3>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              In accordance with Google Play Store Developer Data requirements and the Indian Digital Personal Data Protection Act (DPDP Act 2023), the schedule below outlines exactly which personal records are deleted immediately versus any anonymized records retained for statutory compliance.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#e2e8f0]">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[#334155]">
                  <th className="py-4 px-4 font-extrabold w-1/4">Data Category</th>
                  <th className="py-4 px-4 font-extrabold w-1/4">Action Taken upon Deletion</th>
                  <th className="py-4 px-4 font-extrabold w-1/4">Retention Period</th>
                  <th className="py-4 px-4 font-extrabold w-1/4">Reason / Legal Basis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9] text-[#334155]">
                <tr className="hover:bg-[#f8fafc] transition-colors">
                  <td className="py-4 px-4 font-bold text-[#0f172a]">
                    Personal Profile &amp; Account Info
                  </td>
                  <td className="py-4 px-4 text-[#dc2626] font-bold">
                    Hard Deleted Instantly
                  </td>
                  <td className="py-4 px-4 font-semibold">Immediate (0 days)</td>
                  <td className="py-4 px-4 text-xs text-[#64748b]">
                    Includes Full Name, Email Address, Mobile Phone Number, Profile Photo, and Firebase UID (`users` table). Right to Erasure under DPDP Act.
                  </td>
                </tr>
                <tr className="hover:bg-[#f8fafc] transition-colors">
                  <td className="py-4 px-4 font-bold text-[#0f172a]">
                    Push Notification Tokens &amp; Preferences
                  </td>
                  <td className="py-4 px-4 text-[#dc2626] font-bold">
                    Hard Deleted Instantly
                  </td>
                  <td className="py-4 px-4 font-semibold">Immediate (0 days)</td>
                  <td className="py-4 px-4 text-xs text-[#64748b]">
                    All FCM device tokens, bookmarked shops, and notification logs (`notifications` &amp; `savedShops` tables).
                  </td>
                </tr>
                <tr className="hover:bg-[#f8fafc] transition-colors">
                  <td className="py-4 px-4 font-bold text-[#0f172a]">
                    Location Logs &amp; GPS Requests
                  </td>
                  <td className="py-4 px-4 text-[#dc2626] font-bold">
                    Purged / Deleted
                  </td>
                  <td className="py-4 px-4 font-semibold">Immediate (auto-purged within 30 days)</td>
                  <td className="py-4 px-4 text-xs text-[#64748b]">
                    Temporary GPS coordinates used for nearby barber shop discovery (`locationRequests` table).
                  </td>
                </tr>
                <tr className="hover:bg-[#f8fafc] transition-colors">
                  <td className="py-4 px-4 font-bold text-[#0f172a]">
                    Past Booking &amp; Transaction Records
                  </td>
                  <td className="py-4 px-4 text-[#d97706] font-bold">
                    Anonymized (PII Scrubbed)
                  </td>
                  <td className="py-4 px-4 font-semibold">3 Years</td>
                  <td className="py-4 px-4 text-xs text-[#64748b]">
                    Customer Name and Phone Number are scrubbed/replaced with &quot;Deleted User&quot;. Anonymous service/price records (`bookings` table) are retained strictly for partner salon accounting, settlement verification, and Indian tax law compliance.
                  </td>
                </tr>
                <tr className="hover:bg-[#f8fafc] transition-colors">
                  <td className="py-4 px-4 font-bold text-[#0f172a]">
                    Ratings &amp; Reviews
                  </td>
                  <td className="py-4 px-4 text-[#2563eb] font-bold">
                    Anonymized or Deleted on Request
                  </td>
                  <td className="py-4 px-4 font-semibold">Until removed</td>
                  <td className="py-4 px-4 text-xs text-[#64748b]">
                    Customer name on reviews (`reviews` table) is anonymized. To remove review text completely, delete reviews in-app before account deletion or contact support.
                  </td>
                </tr>
                <tr className="hover:bg-[#f8fafc] transition-colors">
                  <td className="py-4 px-4 font-bold text-[#0f172a]">
                    Fraud Prevention &amp; No-Show Strikes
                  </td>
                  <td className="py-4 px-4 text-[#16a34a] font-bold">
                    Retained (Hashed Identifier)
                  </td>
                  <td className="py-4 px-4 font-semibold">1 Year from Strike Date</td>
                  <td className="py-4 px-4 text-xs text-[#64748b]">
                    If your account accumulated active booking bans or no-show strikes, a one-way hashed identifier is retained solely to prevent ban evasion and protect partner salon schedules.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4 text-xs text-[#475569] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#8F00FF] shrink-0" />
              <span>For full legal terms and formal disclosures, please review our standard policies:</span>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <a href="/privacy" className="font-bold text-[#8F00FF] hover:underline">
                Privacy Policy
              </a>
              <span className="text-[#cbd5e1]">&bull;</span>
              <a href="/terms" className="font-bold text-[#8F00FF] hover:underline">
                Terms &amp; Conditions
              </a>
            </div>
          </div>
        </section>

        {/* Contact / Grievance Redressal Footer Box */}
        <section className="rounded-[28px] border border-[#e2e8f0] bg-white p-6 sm:p-8 text-center space-y-3 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <h4 className="text-base font-bold text-[#0f172a]">Need Personal Assistance?</h4>
          <p className="text-xs sm:text-sm text-[#475569] max-w-2xl mx-auto">
            Our official Grievance Officer and customer support team are available to assist you with any questions regarding data privacy rights, manual deletion requests, or DPDP Act compliance.
          </p>
          <div className="pt-2 flex justify-center">
            <a
              href="mailto:cutzosaloon@gmail.com?subject=Grievance%20Officer%20-%20Data%20Deletion%20Inquiry"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#0f172a] hover:bg-[#1e293b] px-6 py-3 text-xs font-bold text-white transition-all shadow-md"
            >
              <Mail className="h-4 w-4 text-[#8F00FF]" />
              Contact Grievance Officer (cutzosaloon@gmail.com)
            </a>
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t border-[#e2e8f0] px-4 py-8 text-center text-xs text-[#64748b]">
        <p>
          &copy; {new Date().getFullYear()} Cutzo Booking Hub (&quot;Cutzo&quot;). All rights reserved. Made with precision in India.
        </p>
        <p className="mt-1">
          Registered Address: Cutzo, India &bull; Official Email: cutzosaloon@gmail.com &bull; Version 1.0
        </p>
      </footer>
    </div>
  );
}
