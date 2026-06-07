import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const API_BASE = process.env.REACT_APP_API_URL || "";
const UPI_ID = "7089185009@paytm";
const MERCHANT_NAME = "TCS NQT Prep";

function generateOrderId() {
  return `TXN${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PaymentModal({ product, onClose, onPurchase }) {
  const [step, setStep] = useState("pay");
  const [utrInput, setUtrInput] = useState("");
  const [orderId] = useState(() => generateOrderId());
  const [loading, setLoading] = useState(false);
  const [razorpayOrderId, setRazorpayOrderId] = useState("");

  if (!product) return null;

  const upiDeepLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${product.price}&cu=INR&tn=${orderId}`;

  const handleRazorpayPay = async () => {
    setLoading(true);
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Please check your connection.");
      setLoading(false);
      return;
    }

    try {
      const orderRes = await fetch(`${API_BASE}/api/razorpay/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: product.price,
          currency: "INR",
          receipt: orderId,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderData.orderId) {
        alert("Failed to create order. Please try again.");
        setLoading(false);
        return;
      }

      setRazorpayOrderId(orderData.orderId);

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: MERCHANT_NAME,
        description: product.name,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API_BASE}/api/razorpay/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                product: product.name,
                price: product.price,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              if (onPurchase) onPurchase();
              setStep("success");
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            alert("Verification error. Please contact support.");
          }
          setLoading(false);
        },
        prefill: {},
        theme: { color: "#2563eb" },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        alert("Payment failed: " + response.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleUtrSubmit = async () => {
    if (!utrInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          product: product.name,
          price: product.price,
          utr: utrInput.trim(),
          date: new Date().toLocaleString("en-IN"),
        }),
      });
      if (res.ok) {
        if (onPurchase) onPurchase();
        setStep("success");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save payment.");
      }
    } catch {
      if (onPurchase) onPurchase();
      setStep("success");
    }
    setLoading(false);
  };

  const handleViewPdf = () => {
    if (product.pdf) {
      window.open(product.pdf, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-sm bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6 text-center animate-fade-slide-in" onClick={(e) => e.stopPropagation()}>

        {step === "pay" && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-white">Pay ₹{product.price}</h3>
            <p className="text-sm text-gray-400 mb-4">{product.name}</p>
            <button onClick={handleRazorpayPay} disabled={loading} className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {loading ? "Processing..." : "Pay with Razorpay"}
            </button>
            <div className="my-4 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-700"></div>
              <span className="text-xs text-gray-500">or</span>
              <div className="flex-1 h-px bg-gray-700"></div>
            </div>
            <button onClick={() => setStep("qr")} className="w-full px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg transition-all border border-gray-700">
              Pay via UPI (Manual)
            </button>
            <p className="mt-3 text-[10px] text-gray-500 font-mono break-all bg-gray-800 rounded px-2 py-1">Order: {orderId}</p>
            <button onClick={onClose} className="mt-3 w-full px-4 py-2 text-gray-400 hover:text-white text-sm rounded-lg transition-all">Cancel</button>
          </>
        )}

        {step === "qr" && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
            </div>
            <h3 className="text-lg font-bold text-white">Pay ₹{product.price}</h3>
            <p className="text-sm text-gray-400 mb-4">Scan with any UPI app</p>
            <div className="bg-white p-3 rounded-xl inline-block mx-auto shadow-md">
              <QRCodeCanvas value={upiDeepLink} size={200} level="H" />
            </div>
            <p className="text-[10px] text-gray-500 mt-3 font-mono break-all bg-gray-800 rounded px-2 py-1">Order: {orderId}</p>
            <button onClick={() => navigator.clipboard.writeText(upiDeepLink)} className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded-lg transition-all border border-gray-700">
              Copy UPI Link
            </button>
            <p className="mt-3 text-[11px] text-gray-500">Open any UPI app on your phone and scan the QR code</p>
            <button onClick={() => setStep("utr")} className="mt-3 w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-emerald-900/40">
              I've Paid — Enter UTR
            </button>
            <button onClick={() => setStep("pay")} className="mt-2 w-full px-4 py-2 text-gray-400 hover:text-white text-sm rounded-lg transition-all">Back</button>
          </>
        )}

        {step === "utr" && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-white">Verify Payment</h3>
            <p className="text-sm text-gray-400 mb-4">Enter the UTR from your transaction</p>
            <input type="text" value={utrInput} onChange={(e) => setUtrInput(e.target.value)} placeholder="e.g. HDFC25012345678" className="w-full px-4 py-3 bg-gray-800 text-white font-mono text-sm text-center rounded-xl border border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all" />
            <button onClick={handleUtrSubmit} disabled={!utrInput.trim() || loading} className="mt-4 w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-emerald-900/40">
              {loading ? "Submitting..." : "Verify & Complete"}
            </button>
            <button onClick={() => setStep("qr")} className="mt-2 w-full px-4 py-2 text-gray-400 hover:text-white text-sm rounded-lg transition-all">Back</button>
          </>
        )}

        {step === "success" && (
          <div className="relative">
            <div className="confetti-container">
              <div className="confetti c1"></div>
              <div className="confetti c2"></div>
              <div className="confetti c3"></div>
              <div className="confetti c4"></div>
              <div className="confetti c5"></div>
              <div className="confetti c6"></div>
            </div>
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-emerald-400">Payment Successful!</h3>
            <p className="text-sm text-gray-300 mt-2">{product.name}</p>
            <p className="text-xs text-gray-400 mt-1">Amount: ₹{product.price}</p>
            {utrInput && <p className="text-xs text-gray-400 mt-2 font-mono">UTR: {utrInput}</p>}
            {razorpayOrderId && <p className="text-[10px] text-gray-500 font-mono">Order: {razorpayOrderId}</p>}
            <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <p className="text-xs text-emerald-300">✅ Your PDF is ready to view!</p>
            </div>
            <button onClick={handleViewPdf} className="mt-5 w-full px-4 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 animate-pulse-slow">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              View PDF Now
            </button>
            <button onClick={() => { window.open(product.form, "_blank"); onClose(); }} className="mt-2 w-full px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-sm font-medium rounded-lg transition-all border border-blue-500/30">
              Fill Google Form
            </button>
            <button onClick={onClose} className="mt-2 w-full px-4 py-2 text-gray-400 hover:text-white text-sm rounded-lg transition-all">Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
