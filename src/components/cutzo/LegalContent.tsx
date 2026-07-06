import React from "react";

export function TermsAndConditions() {
  return (
    <div className="space-y-6 text-sm text-foreground/80 leading-relaxed">
      <div>
        <h1 className="text-xl font-black text-foreground mb-1">TERMS AND CONDITIONS OF USE</h1>
        <p className="text-xs font-bold text-primary">Version 1.0 | Effective Date: July 5, 2026</p>
      </div>

      <hr className="border-border" />

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">1. ACCEPTANCE OF TERMS</h2>
        <p>
          1.1 These Terms and Conditions (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;) and <strong>Cutzo</strong> (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), governing your access to and use of the Cutzo mobile application (&quot;App&quot;) and all related services (collectively, the &quot;Services&quot;).
        </p>
        <p>
          1.2 By downloading, installing, registering for, or using the App in any manner, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy (incorporated herein by reference).
        </p>
        <p>
          1.3 <strong>If you do not agree to these Terms, you must immediately uninstall the App and cease all use of the Services.</strong>
        </p>
        <p>
          1.4 These Terms apply to all Users of the App, including customers who book services (&quot;Customers&quot;) and salon/barbershop owners who list their businesses (&quot;Partners/Shop Owners&quot;).
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">2. ELIGIBILITY</h2>
        <p>
          2.1 <strong>Age Requirement:</strong> You must be at least 18 years of age to use the App. If you are between 13 and 17 years of age, you may only use the App under the direct supervision of a parent or legal guardian who agrees to these Terms on your behalf.
        </p>
        <p>
          2.2 <strong>Capacity:</strong> By accepting these Terms, you represent and warrant that you have the legal capacity to enter into a binding contract under applicable Indian law (Indian Contract Act, 1872).
        </p>
        <p>
          2.3 <strong>Geographic Scope:</strong> The App is primarily intended for users located in India. We make no representation that the Services are appropriate or available for use in other jurisdictions.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">3. ACCOUNT REGISTRATION AND SECURITY</h2>
        <p>
          3.1 <strong>Account Creation:</strong> To access most features of the App, you must create an account using Google Sign-In (via Firebase Authentication) or a mobile number with OTP verification.
        </p>
        <p>
          3.2 <strong>Accurate Information:</strong> You agree to provide true, accurate, current, and complete information during registration and to update such information to keep it accurate and current.
        </p>
        <p>
          3.3 <strong>Account Security:</strong> You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Notify us immediately at <a href="mailto:cutzosaloon@gmail.com" className="text-primary hover:underline font-semibold">cutzosaloon@gmail.com</a> of any unauthorized use of your account.</li>
          <li>Ensure you log out from your account at the end of each session on shared devices.</li>
        </ul>
        <p>
          3.4 <strong>One Account Per User:</strong> Each user may maintain only one active customer account. Shop owners maintain a separate shop management account.
        </p>
        <p>
          3.5 <strong>Account Suspension:</strong> We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent behavior, or harm the community.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">4. DESCRIPTION OF SERVICES</h2>
        <p>
          4.1 <strong>Platform Nature:</strong> Cutzo is a technology platform that connects customers with local barber shops and salons (&quot;Partner Shops&quot;). Cutzo is a marketplace facilitator — we do not directly provide grooming or salon services.
        </p>
        <p>
          4.2 <strong>Services Provided to Customers:</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Discovery of nearby Partner Shops based on your GPS location.</li>
          <li>Viewing shop profiles, services, pricing, ratings, and reviews.</li>
          <li>Real-time booking of time slots for grooming services.</li>
          <li>OTP-secured booking confirmations.</li>
          <li>Push notification reminders for upcoming appointments.</li>
          <li>WhatsApp message reminders (where you have provided your phone number).</li>
          <li>Ability to reschedule or cancel bookings within permitted timeframes.</li>
          <li>Submission of reviews and ratings after a completed booking.</li>
          <li>Access to saved shops and booking history.</li>
        </ul>
        <p>
          4.3 <strong>Services Provided to Partners (Shop Owners):</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Business listing and profile creation on the platform.</li>
          <li>Management of service catalogue and pricing.</li>
          <li>Real-time dashboard for booking management.</li>
          <li>Customer notifications for bookings, delays, and cancellations.</li>
          <li>Access to walk-in queue management tools.</li>
          <li>Rating and review visibility.</li>
        </ul>
        <p>
          4.4 <strong>Availability:</strong> We strive for 24/7 availability but do not guarantee uninterrupted access. Scheduled maintenance, technical issues, or circumstances beyond our control may cause temporary downtime.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">5. BOOKING POLICY</h2>
        <p>
          5.1 <strong>Booking Confirmation:</strong> A booking is confirmed only when you receive an on-screen confirmation and/or a push notification from the App. A pending booking is not a confirmed booking.
        </p>
        <p>
          5.2 <strong>OTP Verification:</strong> Certain booking or check-in flows require OTP verification. OTPs are time-limited and must not be shared with third parties. Cutzo will never ask for your OTP over a call.
        </p>
        <p>
          5.3 <strong>Cancellation by Customer:</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>You may cancel a booking through the App before the scheduled appointment time.</li>
          <li>Cancellation policies, including any cancellation fees, are determined by the Partner Shop and will be displayed at the time of booking.</li>
          <li>Cutzo is not liable for any cancellation fees charged by the Partner Shop.</li>
        </ul>
        <p>
          5.4 <strong>Reschedule Policy:</strong> Rescheduling is subject to slot availability at the Partner Shop. We cannot guarantee availability when rescheduling.
        </p>
        <p>
          5.5 <strong>No-Shows and Strikes:</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Repeated no-shows without cancellation will result in &quot;no-show strikes&quot; on your account.</li>
          <li><strong>Three (3) or more no-show strikes may result in a temporary booking ban</strong> as detailed in the App. The duration of the ban will be communicated to you.</li>
          <li>Cutzo reserves the right to modify this policy at any time with reasonable notice.</li>
        </ul>
        <p>
          5.6 <strong>Pricing:</strong> All prices displayed on the App are in Indian Rupees (INR). Prices are set solely by the Partner Shop. Cutzo does not guarantee that the price displayed in the App matches the price charged at the shop.
        </p>
        <p>
          5.7 <strong>Payment:</strong> At this time, the App facilitates booking only; payment is made directly at the Partner Shop. Any future in-app payment features will be covered by an updated version of these Terms.
        </p>
        <p>
          5.8 <strong>Delays:</strong> Shop Owners may report service delays through the App. You will receive a notification of any reported delays. Cutzo is not responsible for delays caused by the Partner Shop.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">6. REVIEWS AND RATINGS</h2>
        <p>
          6.1 Users may submit reviews and star ratings for Partner Shops after completing a booking.
        </p>
        <p>
          6.2 By submitting a review, you grant Cutzo a worldwide, royalty-free, perpetual, irrevocable license to display, reproduce, and use that review on the App and in marketing materials.
        </p>
        <p>
          6.3 Reviews must be honest, accurate, and based on your genuine personal experience. You agree not to post:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>False, misleading, or defamatory content.</li>
          <li>Content that violates any applicable law.</li>
          <li>Spam, promotional content, or content posted for commercial gain.</li>
          <li>Content that harasses, abuses, or threatens any individual.</li>
        </ul>
        <p>
          6.4 Cutzo reserves the right to remove reviews that violate these guidelines without notice.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">7. PARTNER SHOP TERMS</h2>
        <p>
          7.1 <strong>Enrollment:</strong> Partner Shops must submit accurate business information and are subject to an approval process by Cutzo before their listing becomes active on the platform.
        </p>
        <p>
          7.2 <strong>Accuracy of Information:</strong> Partners are solely responsible for ensuring the accuracy of their listed services, pricing, operating hours, location, and any other business information.
        </p>
        <p>
          7.3 <strong>Service Delivery:</strong> Partners are solely responsible for delivering the services booked by Customers. Cutzo is not a party to the service contract between the Customer and the Partner Shop.
        </p>
        <p>
          7.4 <strong>Compliance:</strong> Partners must comply with all applicable Indian laws and regulations, including consumer protection laws, food and safety standards (if applicable), and local municipal regulations.
        </p>
        <p>
          7.5 <strong>Commission and Fees:</strong> Current listing on Cutzo is provided free of charge. Any applicable commission or subscription fees will be communicated via a separate Partner Agreement.
        </p>
        <p>
          7.6 <strong>Termination of Partnership:</strong> Cutzo reserves the right to remove a Partner Shop's listing for violations of these Terms, failure to maintain service quality, or any conduct harmful to customers.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">8. PROHIBITED CONDUCT</h2>
        <p>You agree NOT to:</p>
        <ul className="list-decimal pl-5 space-y-1">
          <li>Use the App for any unlawful purpose or in violation of any applicable Indian laws, including but not limited to the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023.</li>
          <li>Submit false, misleading, or fraudulent information during registration or in bookings.</li>
          <li>Impersonate any person or entity or falsely claim an affiliation with any person or entity.</li>
          <li>Attempt to gain unauthorized access to any part of the App, its servers, or any related systems.</li>
          <li>Reverse engineer, decompile, disassemble, or otherwise attempt to extract source code from the App.</li>
          <li>Engage in any activity that interferes with or disrupts the App's infrastructure or other users' access to the Services.</li>
          <li>Use bots, scrapers, crawlers, or other automated tools to access the App.</li>
          <li>Post or transmit any content that is defamatory, obscene, pornographic, offensive, or otherwise unlawful under Indian law.</li>
          <li>Use the App to send unsolicited communications (spam) to any other user.</li>
          <li>Engage in any fraudulent booking activity, including making bookings with no intention to appear.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">9. INTELLECTUAL PROPERTY</h2>
        <p>
          9.1 All content on the App, including but not limited to the Cutzo name, logo, wordmark, design, text, graphics, software, and source code (&quot;Cutzo IP&quot;), is owned by or licensed to Cutzo and is protected under applicable intellectual property laws of India and international treaties.
        </p>
        <p>
          9.2 These Terms do not grant you any right, title, or interest in or to the Cutzo IP. You are granted a limited, non-exclusive, non-transferable, revocable license to use the App solely for your personal, non-commercial use in accordance with these Terms.
        </p>
        <p>
          9.3 <strong>User Content:</strong> You retain ownership of content you submit to the App (such as reviews and profile information). By submitting content, you grant Cutzo the license described in Section 6.2.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">10. DISCLAIMER OF WARRANTIES</h2>
        <p>
          10.1 THE APP AND SERVICES ARE PROVIDED ON AN <strong>&quot;AS IS&quot;</strong> AND <strong>&quot;AS AVAILABLE&quot;</strong> BASIS WITHOUT ANY WARRANTIES, EXPRESS OR IMPLIED.
        </p>
        <p>
          10.2 CUTZO EXPRESSLY DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Merchantability:</strong> We do not warrant that the App is of satisfactory quality.</li>
          <li><strong>Fitness for a Particular Purpose:</strong> We do not warrant that the App meets your specific needs.</li>
          <li><strong>Accuracy:</strong> We do not warrant the accuracy of information provided by Partner Shops.</li>
          <li><strong>Uninterrupted Service:</strong> We do not warrant that the App will be error-free or continuously available.</li>
        </ul>
        <p>
          10.3 Cutzo acts as a booking platform only and is NOT responsible for the quality, safety, legality, or any aspect of the grooming services provided by Partner Shops.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">11. LIMITATION OF LIABILITY</h2>
        <p>
          11.1 TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE INDIAN LAW, CUTZO, ITS DIRECTORS, OFFICERS, EMPLOYEES, AFFILIATES, AGENTS, AND LICENSORS SHALL NOT BE LIABLE FOR ANY:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Indirect, incidental, special, consequential, or punitive damages.</li>
          <li>Loss of profits, goodwill, data, or other intangible losses.</li>
          <li>Damages arising from your use of or inability to use the App.</li>
          <li>Damages arising from unauthorized access to your account.</li>
          <li>Damages arising from the conduct or services of any Partner Shop.</li>
        </ul>
        <p>
          11.2 In any event, Cutzo's total aggregate liability to you for all claims arising under or in connection with these Terms shall not exceed INR <strong>1,000</strong> (One Thousand Rupees) or the amount paid by you (if any) to Cutzo in the six (6) months preceding the claim, whichever is higher.
        </p>
        <p>
          11.3 Nothing in these Terms shall limit or exclude liability for death or personal injury caused by Cutzo's gross negligence or for fraudulent misrepresentation.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">12. INDEMNIFICATION</h2>
        <p>
          You agree to defend, indemnify, and hold harmless Cutzo and its officers, directors, employees, and agents from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Your violation of these Terms.</li>
          <li>Your use of the Services.</li>
          <li>Your User Content.</li>
          <li>Your violation of any rights of a third party, including any Partner Shop.</li>
          <li>Your violation of any applicable Indian law or regulation.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">13. THIRD-PARTY SERVICES</h2>
        <p>
          13.1 The App integrates with the following third-party services:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Google Firebase:</strong> For authentication and cloud messaging (push notifications). Subject to Google's Terms of Service.</li>
          <li><strong>Convex:</strong> For real-time backend data services.</li>
          <li><strong>Meta WhatsApp Business API / Twilio:</strong> For WhatsApp appointment reminder messages.</li>
          <li><strong>Device GPS / Location Services:</strong> For shop discovery.</li>
        </ul>
        <p>
          13.2 We are not responsible for the practices, content, or availability of any third-party services. Your use of third-party services is at your own risk and subject to those services' own terms and privacy policies.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">14. GOVERNING LAW AND DISPUTE RESOLUTION</h2>
        <p>
          14.1 <strong>Governing Law:</strong> These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles.
        </p>
        <p>
          14.2 <strong>Jurisdiction:</strong> Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in <strong>India</strong>.
        </p>
        <p>
          14.3 <strong>Informal Resolution:</strong> Before initiating any formal legal proceeding, you agree to contact us at <a href="mailto:cutzosaloon@gmail.com" className="text-primary hover:underline font-semibold">cutzosaloon@gmail.com</a> and attempt to resolve the dispute informally for a period of thirty (30) days.
        </p>
        <p>
          14.4 <strong>Consumer Disputes:</strong> Nothing in these Terms shall affect your statutory rights as a consumer under the Consumer Protection Act, 2019 (India).
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">15. TERMINATION</h2>
        <p>
          15.1 You may terminate your account at any time by deleting the App and contacting us at <a href="mailto:cutzosaloon@gmail.com" className="text-primary hover:underline font-semibold">cutzosaloon@gmail.com</a> to request account deletion.
        </p>
        <p>
          15.2 Cutzo may suspend or permanently terminate your access to the Services at any time, with or without notice, if:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>You violate these Terms.</li>
          <li>Your conduct is harmful to other users, partners, or the platform.</li>
          <li>Required by applicable law.</li>
        </ul>
        <p>
          15.3 Upon termination, your right to use the App immediately ceases. Sections 9, 10, 11, 12, 14, and 16 of these Terms shall survive termination.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">16. CHANGES TO TERMS</h2>
        <p>
          16.1 Cutzo reserves the right to modify or update these Terms at any time at its sole discretion.
        </p>
        <p>
          16.2 We will notify you of material changes by updating the &quot;Effective Date&quot; at the top of this document, posting a notice within the App, and/or sending a notification to your registered email or device.
        </p>
        <p>
          16.3 Your continued use of the App after the effective date of any changes constitutes your acceptance of the revised Terms.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">17. GENERAL PROVISIONS</h2>
        <p>
          17.1 <strong>Entire Agreement:</strong> These Terms, together with the Privacy Policy, constitute the entire agreement between you and Cutzo regarding the Services.
        </p>
        <p>
          17.2 <strong>Severability:</strong> If any provision of these Terms is found to be invalid or unenforceable under applicable law, such provision shall be modified to the minimum extent necessary to make it enforceable, and the remaining provisions shall continue in full force.
        </p>
        <p>
          17.3 <strong>Waiver:</strong> Cutzo's failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision.
        </p>
        <p>
          17.4 <strong>Assignment:</strong> Cutzo may assign its rights and obligations under these Terms without restriction. You may not assign your rights under these Terms without Cutzo's prior written consent.
        </p>
        <p>
          17.5 <strong>Language:</strong> These Terms are in the English language. In case of any discrepancy with a translated version, the English version shall prevail.
        </p>
      </section>

      <section className="space-y-2 border-t border-border pt-4">
        <h2 className="text-base font-extrabold text-foreground mb-3">18. CONTACT INFORMATION</h2>
        <p className="text-xs text-muted-foreground mb-4">
          For any questions, concerns, or grievances regarding these Terms, please contact us:
        </p>
        <div className="overflow-x-auto rounded-xl border border-border bg-muted/30">
          <table className="min-w-full divide-y divide-border text-xs">
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-3 py-2 font-bold text-foreground bg-muted/50 w-1/3">App Name</td>
                <td className="px-3 py-2">Cutzo</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-bold text-foreground bg-muted/50">Developer</td>
                <td className="px-3 py-2">Cutzo</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-bold text-foreground bg-muted/50">Email</td>
                <td className="px-3 py-2"><a href="mailto:cutzosaloon@gmail.com" className="text-primary hover:underline">cutzosaloon@gmail.com</a></td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-bold text-foreground bg-muted/50">Grievance Officer</td>
                <td className="px-3 py-2">Grievance Officer</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-bold text-foreground bg-muted/50">Grievance Email</td>
                <td className="px-3 py-2"><a href="mailto:cutzosaloon@gmail.com" className="text-primary hover:underline">cutzosaloon@gmail.com</a></td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-bold text-foreground bg-muted/50">Registered Address</td>
                <td className="px-3 py-2">Cutzo, India</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-3 rounded-lg bg-primary/5 p-3 text-xs border border-primary/10">
          <p className="font-semibold text-primary">Grievance Redressal:</p>
          <p className="mt-1 text-muted-foreground">
            In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, any grievances may be submitted to the Grievance Officer above and shall be acknowledged within 24 hours and resolved within 15 days of receipt.
          </p>
        </div>
      </section>
    </div>
  );
}

export function PrivacyPolicy() {
  return (
    <div className="space-y-6 text-sm text-foreground/80 leading-relaxed">
      <div>
        <h1 className="text-xl font-black text-foreground mb-1">PRIVACY POLICY</h1>
        <p className="text-xs font-bold text-primary">Version 1.0 | Effective Date: July 5, 2026</p>
      </div>

      <hr className="border-border" />

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">1. INTRODUCTION AND SCOPE</h2>
        <p>
          1.1 Cutzo (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, process, share, and safeguard your personal information when you use the Cutzo mobile application (&quot;App&quot;) and related services (&quot;Services&quot;).
        </p>
        <p>
          1.2 This Privacy Policy is formulated in compliance with:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Information Technology Act, 2000</strong> (India)</li>
          <li><strong>Information Technology (Amendment) Act, 2008</strong> (India)</li>
          <li><strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong> (&quot;SPDI Rules&quot;)</li>
          <li><strong>Digital Personal Data Protection Act, 2023</strong> (&quot;DPDP Act&quot;) (India)</li>
          <li><strong>Google Play Store Developer Policy Requirements</strong></li>
        </ul>
        <p>
          1.3 By using the App, you (&quot;Data Principal&quot; under the DPDP Act) consent to the collection and use of your personal data as described in this Privacy Policy.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">2. DATA CONTROLLER INFORMATION</h2>
        <div className="overflow-x-auto rounded-xl border border-border bg-muted/30 text-xs">
          <table className="min-w-full divide-y divide-border">
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-3 py-2 font-bold text-foreground bg-muted/50 w-1/3">Data Fiduciary</td>
                <td className="px-3 py-2">Cutzo</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-bold text-foreground bg-muted/50">App Name</td>
                <td className="px-3 py-2">Cutzo</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-bold text-foreground bg-muted/50">Contact Email</td>
                <td className="px-3 py-2"><a href="mailto:cutzosaloon@gmail.com" className="text-primary hover:underline">cutzosaloon@gmail.com</a></td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-bold text-foreground bg-muted/50">Registered Address</td>
                <td className="px-3 py-2">Cutzo, India</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-extrabold text-foreground">3. INFORMATION WE COLLECT</h2>
        <p>
          We collect only the minimum data necessary to provide our Services (&quot;data minimization principle&quot;). Below is a complete inventory of data we collect:
        </p>

        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">3.1 Information You Provide Directly</h3>
        <div className="overflow-x-auto rounded-xl border border-border bg-muted/30 text-xs">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-3 py-2 font-bold text-foreground">Data Type</th>
                <th className="px-3 py-2 font-bold text-foreground">Why We Collect It</th>
                <th className="px-3 py-2 font-bold text-foreground">Required / Optional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-3 py-2 font-semibold">Full Name</td>
                <td className="px-3 py-2">Account creation, booking display</td>
                <td className="px-3 py-2 text-destructive font-bold">Required</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Email Address</td>
                <td className="px-3 py-2">Account creation, notifications</td>
                <td className="px-3 py-2 text-destructive font-bold">Required</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Mobile / Phone Number</td>
                <td className="px-3 py-2">OTP verification, WhatsApp reminders</td>
                <td className="px-3 py-2 text-destructive font-bold">Required</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Location (City / Area)</td>
                <td className="px-3 py-2">Shop discovery filtering</td>
                <td className="px-3 py-2 text-green-700 font-bold">Optional</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Profile Information</td>
                <td className="px-3 py-2">Personalization</td>
                <td className="px-3 py-2 text-green-700 font-bold">Optional</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">3.2 Information Collected Automatically</h3>
        <div className="overflow-x-auto rounded-xl border border-border bg-muted/30 text-xs">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-3 py-2 font-bold text-foreground">Data Type</th>
                <th className="px-3 py-2 font-bold text-foreground">Why We Collect It</th>
                <th className="px-3 py-2 font-bold text-foreground">How Collected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-3 py-2 font-semibold">Precise GPS Location</td>
                <td className="px-3 py-2">Finding nearby shops, location-based services</td>
                <td className="px-3 py-2">Device GPS (requested at runtime)</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Device Identifier</td>
                <td className="px-3 py-2">Push notification delivery (FCM Token)</td>
                <td className="px-3 py-2">Firebase Cloud Messaging</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Firebase UID</td>
                <td className="px-3 py-2">Unique account identification</td>
                <td className="px-3 py-2">Firebase Authentication</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Usage Data</td>
                <td className="px-3 py-2">App improvement, crash diagnostics</td>
                <td className="px-3 py-2">Automatic</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">IP Address</td>
                <td className="px-3 py-2">Security, fraud prevention</td>
                <td className="px-3 py-2">Automatic</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Device Information</td>
                <td className="px-3 py-2">App optimization (OS version, device model)</td>
                <td className="px-3 py-2">Automatic</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">3.3 Information from Third Parties</h3>
        <div className="overflow-x-auto rounded-xl border border-border bg-muted/30 text-xs">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-3 py-2 font-bold text-foreground">Source</th>
                <th className="px-3 py-2 font-bold text-foreground">Data Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-3 py-2 font-semibold">Google Sign-In (Firebase)</td>
                <td className="px-3 py-2">Name, email address, Google account profile photo URL</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Meta WhatsApp API / Twilio</td>
                <td className="px-3 py-2">Delivery confirmation status of messages sent by us</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">3.4 Sensitive Personal Data or Information (SPDI)</h3>
        <p>
          Under the SPDI Rules, 2011, we do NOT collect the following sensitive personal data: passwords (authentication is handled by Google/Firebase), financial information (no in-app payment at this time), biometric data, medical/health data.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">4. HOW WE USE YOUR INFORMATION</h2>
        <p>We use your personal data for the following specific, lawful purposes:</p>
        <div className="overflow-x-auto rounded-xl border border-border bg-muted/30 text-xs">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-3 py-2 font-bold text-foreground">Purpose</th>
                <th className="px-3 py-2 font-bold text-foreground">Legal Basis (DPDP Act / IT Act)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-3 py-2">Creating and managing your account</td>
                <td className="px-3 py-2">Contract performance / Consent</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Processing and confirming bookings</td>
                <td className="px-3 py-2">Contract performance</td>
              </tr>
              <tr>
                <td className="px-3 py-2">OTP-based identity verification</td>
                <td className="px-3 py-2">Security / Consent</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Displaying your booking history</td>
                <td className="px-3 py-2">Contract performance</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Sending appointment reminder notifications (Push)</td>
                <td className="px-3 py-2">Consent (you opt in via device settings)</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Sending appointment reminders via WhatsApp</td>
                <td className="px-3 py-2">Consent (you provide your phone number)</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Displaying nearby shops based on your GPS location</td>
                <td className="px-3 py-2">Consent (you grant location permission)</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Sending booking confirmation, cancellation, or delay notifications</td>
                <td className="px-3 py-2">Contract performance / Legitimate interest</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Fraud detection and prevention (e.g., no-show strike system)</td>
                <td className="px-3 py-2">Legitimate interest / Legal obligation</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Improving App performance and user experience</td>
                <td className="px-3 py-2">Legitimate interest</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Complying with applicable Indian law and legal orders</td>
                <td className="px-3 py-2">Legal obligation</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Responding to grievances and support requests</td>
                <td className="px-3 py-2">Legal obligation / Legitimate interest</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">5. LOCATION DATA</h2>
        <p>
          5.1 The App requests access to your device's <strong>precise GPS location</strong> to show you barber shops and salons near you.
        </p>
        <p>
          5.2 <strong>Location permission is requested at runtime</strong> and you can grant or deny it at any time via your device's application settings.
        </p>
        <p>
          5.3 If you deny location access, you can still use the App by manually searching for shops by area or city name.
        </p>
        <p>
          5.4 We log location request data (latitude/longitude) for a limited time to improve location accuracy and for debugging purposes. This data is not used for advertising or sold to third parties.
        </p>
        <p>
          5.5 Your GPS location is <strong>never shared with Partner Shops</strong> beyond what is necessary to display distance information.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">6. PUSH NOTIFICATIONS</h2>
        <p>
          6.1 The App uses <strong>Firebase Cloud Messaging (FCM)</strong> to send push notifications, including:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Booking confirmations</li>
          <li>Appointment reminders (30 minutes before your booking)</li>
          <li>Booking status updates (confirmed, cancelled, delayed)</li>
          <li>No-show strike alerts</li>
        </ul>
        <p>
          6.2 To send push notifications, we store your <strong>FCM Token</strong> (a device identifier).
        </p>
        <p>
          6.3 You can opt out of push notifications at any time through your device's notification settings. Opting out will not affect your ability to make bookings.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">7. WHATSAPP MESSAGES</h2>
        <p>
          7.1 If you provide your mobile phone number, the App may send you WhatsApp messages via the <strong>Meta WhatsApp Business API</strong> or <strong>Twilio</strong> for appointment reminders.
        </p>
        <p>
          7.2 These messages are transactional and service-related (not advertising).
        </p>
        <p>
          7.3 You may opt out of WhatsApp reminders by contacting us at <a href="mailto:cutzosaloon@gmail.com" className="text-primary hover:underline font-semibold">cutzosaloon@gmail.com</a> or by removing your phone number from your profile.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">8. SHARING YOUR INFORMATION</h2>
        <p>We do NOT sell your personal data to any third party. We share your information only in the following circumstances:</p>
        
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">8.1 With Partner Shops</h3>
        <p>When you make a booking, we share the following information with the relevant Partner Shop:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Your name</li>
          <li>Your phone number (for contact and OTP verification)</li>
          <li>The services booked, date, and time</li>
        </ul>

        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mt-3">8.2 With Service Providers (Processors)</h3>
        <p>We use the following third-party service providers who process data on our behalf:</p>
        <div className="overflow-x-auto rounded-xl border border-border bg-muted/30 text-xs mt-1">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-3 py-2 font-bold text-foreground">Provider</th>
                <th className="px-3 py-2 font-bold text-foreground">Purpose</th>
                <th className="px-3 py-2 font-bold text-foreground">Data Shared</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-3 py-2 font-semibold">Google Firebase / Firestore</td>
                <td className="px-3 py-2">Authentication, push notifications</td>
                <td className="px-3 py-2">Name, email, FCM token, UID</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Convex</td>
                <td className="px-3 py-2">Real-time backend & database</td>
                <td className="px-3 py-2">All app data stored in Convex</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Meta (WhatsApp Business API)</td>
                <td className="px-3 py-2">WhatsApp reminders</td>
                <td className="px-3 py-2">Phone number, message content</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Twilio</td>
                <td className="px-3 py-2">WhatsApp/SMS reminders</td>
                <td className="px-3 py-2">Phone number, message content</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          All third-party providers are contractually obligated to handle data in compliance with applicable laws.
        </p>

        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mt-3">8.3 Legal Disclosure</h3>
        <p>We may disclose your personal data if required to do so by:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>A court order, subpoena, or legal process.</li>
          <li>A request from a government authority under applicable Indian law.</li>
          <li>To enforce our Terms and Conditions.</li>
          <li>To protect the rights, property, or safety of Cutzo, our users, or the public.</li>
        </ul>

        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mt-3">8.4 Business Transfers</h3>
        <p>
          In the event of a merger, acquisition, or sale of all or substantially all assets, your data may be transferred to the acquiring entity, subject to the same privacy protections.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">9. DATA RETENTION</h2>
        <div className="overflow-x-auto rounded-xl border border-border bg-muted/30 text-xs">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-3 py-2 font-bold text-foreground">Data Category</th>
                <th className="px-3 py-2 font-bold text-foreground">Retention Period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-3 py-2 font-semibold">Account information (name, email, phone)</td>
                <td className="px-3 py-2">Until account deletion + 90 days</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Booking records</td>
                <td className="px-3 py-2">3 years from booking date (for dispute resolution)</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Reviews</td>
                <td className="px-3 py-2">Until deleted by the user or removed by us</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Push notification tokens (FCM)</td>
                <td className="px-3 py-2">Until account deletion or token refresh</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Location logs</td>
                <td className="px-3 py-2">30 days from collection</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">OTP data</td>
                <td className="px-3 py-2">10 minutes from generation (auto-purged)</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Rate limit records</td>
                <td className="px-3 py-2">7 days</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">No-show strike records</td>
                <td className="px-3 py-2">1 year from strike date</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Legal hold / compliance data</td>
                <td className="px-3 py-2">As required by applicable Indian law (typically 5 years)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">10. DATA SECURITY</h2>
        <p>
          10.1 We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, disclosure, alteration, and destruction, including:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Encryption in transit:</strong> All data transmitted between the App and our servers uses HTTPS/TLS encryption.</li>
          <li><strong>Authentication:</strong> Firebase Authentication with OTP and Google Sign-In provides secure, industry-standard authentication.</li>
          <li><strong>Access Controls:</strong> Backend functions (Convex) verify user ownership before allowing data access or modification (IDOR protection).</li>
          <li><strong>Rate Limiting:</strong> API rate limiting is enforced to prevent abuse and brute-force attacks.</li>
        </ul>
        <p>
          10.2 No method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee absolute security.
        </p>
        <p>
          10.3 <strong>Data Breach Notification:</strong> In the event of a data breach that is likely to result in risk to your rights and freedoms, we will notify you and the relevant Indian authorities as required by the DPDP Act, 2023.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">11. YOUR RIGHTS AS A DATA PRINCIPAL</h2>
        <p>
          Under the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, and other applicable Indian laws, you have the following rights:
        </p>
        <div className="overflow-x-auto rounded-xl border border-border bg-muted/30 text-xs">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-3 py-2 font-bold text-foreground">Right</th>
                <th className="px-3 py-2 font-bold text-foreground">Description</th>
                <th className="px-3 py-2 font-bold text-foreground">How to Exercise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-3 py-2 font-semibold">Right to Access</td>
                <td className="px-3 py-2">Request a copy of personal data we hold about you</td>
                <td className="px-3 py-2">Email <a href="mailto:cutzosaloon@gmail.com" className="text-primary hover:underline">cutzosaloon@gmail.com</a></td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Right to Correction</td>
                <td className="px-3 py-2">Request correction of inaccurate or incomplete data</td>
                <td className="px-3 py-2">Update in App profile or email us</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Right to Erasure</td>
                <td className="px-3 py-2">Request deletion of your personal data (&quot;Right to be Forgotten&quot;)</td>
                <td className="px-3 py-2">Email <a href="mailto:cutzosaloon@gmail.com" className="text-primary hover:underline">cutzosaloon@gmail.com</a></td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Right to Withdraw Consent</td>
                <td className="px-3 py-2">Withdraw previously given consent at any time</td>
                <td className="px-3 py-2">App settings or email</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Right to Grievance Redressal</td>
                <td className="px-3 py-2">Lodge a grievance with our Grievance Officer</td>
                <td className="px-3 py-2">See Section 14 below</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">Right to Nominate</td>
                <td className="px-3 py-2">Nominate a person to exercise data rights in case of death/incapacity</td>
                <td className="px-3 py-2">Email us with nomination details</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>11.1 We will respond to all data rights requests within <strong>30 (thirty) days</strong> of receipt.</p>
        <p>11.2 We may need to verify your identity before processing your request.</p>
        <p>11.3 Withdrawing consent may limit your ability to use certain features of the App.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">12. CHILDREN'S PRIVACY</h2>
        <p>
          12.1 The App is <strong>not directed to children under the age of 13</strong>. We do not knowingly collect personal data from children under 13.
        </p>
        <p>
          12.2 If you are a parent or guardian and believe your child has provided us with personal information, please contact us at <a href="mailto:cutzosaloon@gmail.com" className="text-primary hover:underline font-semibold">cutzosaloon@gmail.com</a> and we will delete such information promptly.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">13. COOKIES AND TRACKING</h2>
        <p>
          13.1 The Cutzo App (mobile application) does not use browser cookies.
        </p>
        <p>
          13.2 The App may use local device storage (AsyncStorage / localStorage) to store your session tokens and preferences for functionality purposes (e.g., keeping you logged in). This data is stored locally on your device.
        </p>
        <p>
          13.3 We do not use tracking pixels, web beacons, or third-party advertising trackers.
        </p>
      </section>

      <section className="space-y-2 border-t border-border pt-4">
        <h2 className="text-base font-extrabold text-foreground mb-3">14. GRIEVANCE OFFICER</h2>
        <p className="text-xs text-muted-foreground mb-4">
          In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and the DPDP Act, 2023, we have appointed a Grievance Officer to address any privacy-related complaints:
        </p>
        <div className="overflow-x-auto rounded-xl border border-border bg-muted/30 text-xs">
          <table className="min-w-full divide-y divide-border">
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-3 py-2 font-bold text-foreground bg-muted/50 w-1/3">Name</td>
                <td className="px-3 py-2">Grievance Officer</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-bold text-foreground bg-muted/50">Designation</td>
                <td className="px-3 py-2">Grievance Officer</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-bold text-foreground bg-muted/50">Organization</td>
                <td className="px-3 py-2">Cutzo</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-bold text-foreground bg-muted/50">Email</td>
                <td className="px-3 py-2"><a href="mailto:cutzosaloon@gmail.com" className="text-primary hover:underline">cutzosaloon@gmail.com</a></td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-bold text-foreground bg-muted/50">Address</td>
                <td className="px-3 py-2">Cutzo, India</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-bold text-foreground bg-muted/50">Working Hours</td>
                <td className="px-3 py-2">Monday to Friday, 10:00 AM – 6:00 PM IST</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          <strong>Acknowledgment:</strong> Your grievance will be acknowledged within 24 hours.
          <br />
          <strong>Resolution:</strong> Your grievance will be resolved within 15 days of receipt.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">15. CHANGES TO THIS PRIVACY POLICY</h2>
        <p>
          15.1 We reserve the right to update this Privacy Policy at any time.
        </p>
        <p>
          15.2 We will notify you of material changes by:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Updating the &quot;Effective Date&quot; at the top of this Policy.</li>
          <li>Displaying a prominent notice in the App.</li>
          <li>Sending a notification to your registered email or device (for significant changes).</li>
        </ul>
        <p>
          15.3 Your continued use of the App after the updated policy takes effect constitutes your acceptance of the revised Privacy Policy.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-extrabold text-foreground">16. CROSS-BORDER DATA TRANSFERS</h2>
        <p>
          16.1 Your data may be processed and stored on servers located outside India (e.g., servers operated by Firebase/Google and Convex). Such transfers are conducted in compliance with applicable Indian law, including the DPDP Act, 2023.
        </p>
        <p>
          16.2 We ensure that any cross-border transfer of your personal data is subject to adequate data protection safeguards.
        </p>
      </section>

      <section className="space-y-2 border-t border-border pt-4">
        <h2 className="text-base font-extrabold text-foreground mb-3">17. CONTACT US</h2>
        <p className="text-xs text-muted-foreground mb-4">
          For any privacy-related questions, requests, or grievances, please contact:
        </p>
        <div className="overflow-x-auto rounded-xl border border-border bg-muted/30 text-xs">
          <table className="min-w-full divide-y divide-border">
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-3 py-2 font-bold text-foreground bg-muted/50 w-1/3">App Name</td>
                <td className="px-3 py-2">Cutzo</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-bold text-foreground bg-muted/50">Company</td>
                <td className="px-3 py-2">Cutzo</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-bold text-foreground bg-muted/50">Privacy Email</td>
                <td className="px-3 py-2"><a href="mailto:cutzosaloon@gmail.com" className="text-primary hover:underline">cutzosaloon@gmail.com</a></td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-bold text-foreground bg-muted/50">Support Email</td>
                <td className="px-3 py-2"><a href="mailto:cutzosaloon@gmail.com" className="text-primary hover:underline">cutzosaloon@gmail.com</a></td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-bold text-foreground bg-muted/50">Registered Address</td>
                <td className="px-3 py-2">Cutzo, India</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
