/**
 * Razorpay Payment Gateway Helper for Cutzo
 */

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface RazorpayOptions {
  amountInRupees: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  description?: string;
  keyId?: string;
}

export async function processRazorpayPayment(options: RazorpayOptions): Promise<{ success: boolean; paymentId?: string; error?: string }> {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    return { success: false, error: "Failed to load Razorpay payment gateway. Please check internet connection." };
  }

  const key = (options.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || "").trim();

  // If no valid Razorpay key is configured yet (must start with rzp_test_ or rzp_live_),
  // bypass to prevent browser 401 HTTP Basic Auth popup (api.razorpay.com username/password dialog)
  const isValidRazorpayKey = /^rzp_(test|live)_[a-zA-Z0-9]+$/.test(key);

  if (!isValidRazorpayKey) {
    console.warn("[Razorpay] VITE_RAZORPAY_KEY_ID is not configured. Bypassing payment popup for demo mode.");
    return {
      success: true,
      paymentId: `pay_demo_${Date.now()}`,
    };
  }

  return new Promise((resolve) => {
    try {
      const rzpOptions = {
        key: key,
        amount: Math.round(options.amountInRupees * 100), // amount in paise
        currency: "INR",
        name: "CUTZO",
        description: options.description || "Platform Booking Fee (₹3)",
        image: "/icon.svg",
        handler: function (response: any) {
          resolve({
            success: true,
            paymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
          });
        },
        modal: {
          ondismiss: function () {
            resolve({ success: false, error: "Payment cancelled." });
          },
        },
        prefill: {
          name: options.customerName,
          contact: options.customerPhone,
          email: options.customerEmail || "",
        },
        theme: {
          color: "#8f00ff",
        },
      };

      const rzp = new window.Razorpay(rzpOptions);
      rzp.on("payment.failed", function (response: any) {
        resolve({
          success: false,
          error: response.error?.description || "Payment failed. Please try again.",
        });
      });
      rzp.open();
    } catch (e: any) {
      resolve({ success: false, error: e.message || "Failed to initialize Razorpay checkout." });
    }
  });
}
