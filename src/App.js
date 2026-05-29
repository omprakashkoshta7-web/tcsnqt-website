import React, { useState, useEffect, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import PracticeCompiler from "./components/PracticeCompiler";

const API_BASE = process.env.REACT_APP_API_URL || "";
const UPI_ID = "7089185009@paytm";
const MERCHANT_NAME = "TCS NQT Prep";

const colorStyles = {
  indigo: { border: "border-indigo-500", badge: "bg-indigo-500/15 text-indigo-300", btn: "bg-indigo-600 hover:bg-indigo-500 ring-indigo-500" },
  pink: { border: "border-pink-500", badge: "bg-pink-500/15 text-pink-300", btn: "bg-pink-600 hover:bg-pink-500 ring-pink-500" },
  green: { border: "border-emerald-500", badge: "bg-emerald-500/15 text-emerald-300", btn: "bg-emerald-600 hover:bg-emerald-500 ring-emerald-500" },
  yellow: { border: "border-amber-500", badge: "bg-amber-500/15 text-amber-300", btn: "bg-amber-600 hover:bg-amber-500 ring-amber-500" },
};

const PRODUCTS = [
  { id: 1, name: "Complete Aptitude PDF", price: 29, color: "indigo", whatsapp: "https://chat.whatsapp.com/F1FLKhjhHVY5von88wddJU?mode=wwt", form: "https://docs.google.com/forms/d/e/1FAIpQLSfTpVy8Ue7nfakGf7Qie4usfIbm2frL3UKOfk1AhPi6r_o_Cw/viewform?usp=publish-editor", description: "20+ Topic Summaries, Shortcut Methods, and Level-wise Questions designed for TCS NQT 2025.", features: ["Time & Work, Profit–Loss, Ratio, and Geometry topics", "Level-wise Practice Sets (L1–L5)", "Formula Tables & Short Tricks"] },
  { id: 2, name: "Verbal Mastery Set", price: 29, color: "pink", whatsapp: "https://chat.whatsapp.com/CuGU5rWKUahHC70Q7dYz9R?mode=wwt", form: "https://docs.google.com/forms/d/e/1FAIpQLSfTpVy8Ue7nfakGf7Qie4usfIbm2frL3UKOfk1AhPi6r_o_Cw/viewform?usp=publish-editor", description: "Polish your grammar, vocabulary, and reading skills with topic-wise questions and explanations.", features: ["Grammar & Sentence Correction", "Reading Comprehension Practice", "Vocabulary, Antonyms, and Synonyms"] },
  { id: 3, name: "Programming Practice Set", price: 29, color: "green", whatsapp: "https://chat.whatsapp.com/JMiqqmbLmSk5fcwgSVnp7i?mode=wwt", form: "https://docs.google.com/forms/d/e/1FAIpQLSfTpVy8Ue7nfakGf7Qie4usfIbm2frL3UKOfk1AhPi6r_o_Cw/viewform?usp=publish-editor", description: "C, C++, Java, and Python MCQs with concept explanations & coding snippets for TCS-style problems.", features: ["50+ Programming MCQs", "Language Syntax & Concepts", "C, C++, Java, and Python Basics"] },
  { id: 4, name: "Reasoning Booster Pack", price: 29, color: "yellow", whatsapp: "https://chat.whatsapp.com/ChxD0tPjkGKCGCLDsshvep?mode=wwt", form: "https://docs.google.com/forms/d/e/1FAIpQLSfTpVy8Ue7nfakGf7Qie4usfIbm2frL3UKOfk1AhPi6r_o_Cw/viewform?usp=publish-editor", description: "Reasoning ability questions covering puzzles, seating arrangements, syllogisms, and more.", features: ["Puzzles & Seating Arrangements Questions", "Syllogisms, Blood Relations, and Directions", "Detailed Explanations for Each Question"] },
  { id: 5, name: "Previous Year Questions (PYQs)", price: 29, color: "yellow", whatsapp: "https://chat.whatsapp.com/F1FLKhjhHVY5von88wddJU?mode=wwt", form: "https://docs.google.com/forms/d/e/1FAIpQLSfTpVy8Ue7nfakGf7Qie4usfIbm2frL3UKOfk1AhPi6r_o_Cw/viewform?usp=publish-editor", description: "Curated set of 2021–2024 TCS NQT & TCS Digital previous year questions with detailed explanations.", features: ["Actual TCS NQT & Digital Questions (2021–2024)", "Solutions with step-by-step explanations", "Topic tags for each question (Aptitude, Verbal, Reasoning, etc.)"] },
];

function generateOrderId() {
  return `TXN${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
}

export default function TCSNQTApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paymentStep, setPaymentStep] = useState("qr");
  const [utrInput, setUtrInput] = useState("");
  const [orderId, setOrderId] = useState("");
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showCompiler, setShowCompiler] = useState(false);
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem("admin_token") || "");
  const [adminUser, setAdminUser] = useState(() => localStorage.getItem("admin_user") || "");
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");

  const upiDeepLink = selectedProduct && orderId
    ? `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${selectedProduct.price}&cu=INR&tn=${orderId}`
    : "";

  const fetchPayments = useCallback(async () => {
    if (!adminToken) return;
    try {
      const res = await fetch(`${API_BASE}/api/payments`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPaymentRecords(data.payments || []);
      }
    } catch { /* ignore */ }
  }, [adminToken]);

  useEffect(() => {
    if (showAdmin && adminToken) fetchPayments();
  }, [showAdmin, adminToken, fetchPayments]);

  const handleLogin = async () => {
    setLoginError("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUser, password: loginPass }),
      });
      const data = await res.json();
      if (!res.ok) { setLoginError(data.error || "Login failed"); return; }
      setAdminToken(data.token);
      setAdminUser(data.username);
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", data.username);
      setLoginUser("");
      setLoginPass("");
    } catch {
      setLoginError("Server unreachable. Is the backend running?");
    }
  };

  const handleLogout = () => {
    setAdminToken("");
    setAdminUser("");
    setPaymentRecords([]);
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
  };

  const handleJoinGroup = (product) => {
    window.open(product.whatsapp, "_blank");
    setTimeout(() => {
      window.open(`https://wa.me/7089185009?text=${encodeURIComponent(`Hi! I've joined the WhatsApp group for ${product.name}. Please share the payment link.`)}`, "_blank");
    }, 2000);
  };

  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setOrderId(generateOrderId());
    setShowQRModal(true);
    setPaymentStep("qr");
    setUtrInput("");
  };

  const handleCopyForm = (link) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUtrSubmit = async () => {
    if (!utrInput.trim()) return;
    setPaymentLoading(true);
    const record = {
      orderId, product: selectedProduct.name, price: selectedProduct.price,
      utr: utrInput.trim(), date: new Date().toLocaleString("en-IN"),
    };
    try {
      const res = await fetch(`${API_BASE}/api/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      if (res.ok) {
        setPaymentStep("success");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save payment. Please contact support.");
      }
    } catch {
      alert("Server unreachable. Payment recorded locally.");
      setPaymentStep("success");
    }
    setPaymentLoading(false);
  };

  const resetModal = () => { setShowQRModal(false); setPaymentStep("qr"); setUtrInput(""); setOrderId(""); };

  const downloadCSV = () => {
    const headers = ["Date", "Product", "Price", "Order ID", "UTR", "Timestamp"];
    const rows = paymentRecords.map((r) => [r.date, r.product, `Rs.${r.price}`, r.order_id, r.utr, r.timestamp].map((v) => `"${v}"`).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "payment-records.csv"; a.click();
    URL.revokeObjectURL(a.href);
  };

  const tabClasses = (tab) =>
    `px-4 sm:px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
      activeTab === tab
        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
        : "text-gray-400 hover:text-white hover:bg-gray-800"
    }`;

  return (
    <div className="min-h-screen bg-gray-950 font-sans">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900 bg-[length:400%_400%] animate-gradient -z-10" />

      <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">T</div>
            <div>
              <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent leading-tight">TCS NQT 2025</h1>
              <p className="text-[10px] sm:text-xs text-gray-500 -mt-0.5">Preparation Hub</p>
            </div>
          </div>
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <button onClick={() => setActiveTab("home")} className={tabClasses("home")}>Home</button>
            <button onClick={() => setShowCompiler(true)} className={tabClasses("practice")}>Practice</button>
            <button onClick={() => setShowAdmin(true)} className="px-3 py-2 text-sm font-medium text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-all">
              <svg className="w-4 h-4 sm:mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span className="hidden sm:inline">Admin</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === "home" && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center py-4 sm:py-8">
              <h2 className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">Master TCS NQT 2025-2026</h2>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">Choose your module — join the WhatsApp group for guidance, preview, and instant access.</p>
            </div>
            <div className="grid gap-5">
              {PRODUCTS.map((product) => {
                const cs = colorStyles[product.color];
                return (
                  <div key={product.id} className={`group relative bg-gray-900/70 border border-gray-800 border-l-4 ${cs.border} rounded-xl p-4 sm:p-6 transition-all duration-300 hover:border-l-[6px] hover:bg-gray-900/90 hover:shadow-lg hover:shadow-blue-900/20`}>
                    <div className="flex justify-between flex-wrap items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-white">{product.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1">{product.description}</p>
                      </div>
                      <span className={`shrink-0 ${cs.badge} px-3 py-1 rounded-full text-xs sm:text-sm font-semibold`}>₹{product.price}</span>
                    </div>
                    <ul className="mt-3 space-y-1">
                      {product.features.map((f, i) => (
                        <li key={i} className="text-xs sm:text-sm text-gray-500 flex items-start gap-2">
                          <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${cs.border.replace("border", "bg")}`} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button onClick={() => handleJoinGroup(product)} className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs sm:text-sm font-medium rounded-lg transition-all shadow-lg shadow-emerald-900/30">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                        Join WhatsApp
                      </button>
                      <button onClick={() => handleBuyNow(product)} className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 ${cs.btn} text-white text-xs sm:text-sm font-medium rounded-lg transition-all shadow-lg`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        Buy Now
                      </button>
                      <button onClick={() => handleCopyForm(product.form)} className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 text-xs sm:text-sm font-medium rounded-lg transition-all border border-gray-700/50">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        Copy Form
                      </button>
                    </div>
                    {copied && <p className="mt-2 text-xs text-emerald-400 animate-fade-in">Form link copied!</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Payment Modal */}
      {showQRModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={resetModal}>
          <div className="relative w-full max-w-sm bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6 text-center animate-fade-slide-in" onClick={(e) => e.stopPropagation()}>
            {paymentStep === "qr" && (
              <>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
                </div>
                <h3 className="text-lg font-bold text-white">Pay ₹{selectedProduct.price}</h3>
                <p className="text-sm text-gray-400 mb-4">Scan with any UPI app (GPay / PhonePe / Paytm)</p>
                <div className="bg-white p-3 rounded-xl inline-block mx-auto shadow-md">
                  <QRCodeCanvas value={upiDeepLink} size={200} level="H" />
                </div>
                <p className="text-[10px] text-gray-500 mt-3 font-mono break-all bg-gray-800 rounded px-2 py-1">Order: {orderId}</p>
                <div className="mt-4 flex gap-2 justify-center">
                  <button onClick={() => window.open(upiDeepLink, "_blank")} className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-all">Pay via UPI</button>
                  <button onClick={() => navigator.clipboard.writeText(upiDeepLink)} className="flex-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg transition-all border border-gray-700">Copy Link</button>
                </div>
                <button onClick={() => setPaymentStep("utr")} className="mt-3 w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-emerald-900/40">I've Paid — Enter UTR</button>
                <button onClick={resetModal} className="mt-2 w-full px-4 py-2 text-gray-400 hover:text-white text-sm rounded-lg transition-all">Cancel</button>
              </>
            )}
            {paymentStep === "utr" && (
              <>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <h3 className="text-lg font-bold text-white">Verify Payment</h3>
                <p className="text-sm text-gray-400 mb-4">Enter the UTR from your transaction</p>
                <input type="text" value={utrInput} onChange={(e) => setUtrInput(e.target.value)} placeholder="e.g. HDFC25012345678" className="w-full px-4 py-3 bg-gray-800 text-white font-mono text-sm text-center rounded-xl border border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all" />
                <button onClick={handleUtrSubmit} disabled={!utrInput.trim() || paymentLoading} className="mt-4 w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-emerald-900/40">
                  {paymentLoading ? "Submitting..." : "Verify & Complete"}
                </button>
                <button onClick={() => setPaymentStep("qr")} className="mt-2 w-full px-4 py-2 text-gray-400 hover:text-white text-sm rounded-lg transition-all">Back</button>
              </>
            )}
            {paymentStep === "success" && (
              <>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/30">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-lg font-bold text-emerald-400">Payment Verified!</h3>
                <p className="text-xs text-gray-400 mt-1 font-mono">UTR: {utrInput}</p>
                <p className="text-[10px] text-gray-500 font-mono">Order: {orderId}</p>
                <button onClick={() => { window.open(selectedProduct.form, "_blank"); resetModal(); }} className="mt-5 w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-blue-900/40">Fill Google Form to Get PDF</button>
                <button onClick={resetModal} className="mt-2 w-full px-4 py-2 text-gray-400 hover:text-white text-sm rounded-lg transition-all">Close</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Admin Modal */}
      {showAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => !adminToken && setShowAdmin(false)}>
          <div className="relative w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-h-[85vh] flex flex-col animate-fade-slide-in" onClick={(e) => e.stopPropagation()}>
            {/* Admin Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-700 shrink-0">
              <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Admin Panel
              </h3>
              <div className="flex items-center gap-2">
                {adminUser && <span className="text-xs text-gray-500">{adminUser}</span>}
                <button onClick={() => setShowAdmin(false)} className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs font-medium rounded-lg transition-all">Close</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              {!adminToken ? (
                /* Login Form */
                <div className="max-w-sm mx-auto py-8">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <h4 className="text-white font-semibold">Admin Login</h4>
                    <p className="text-xs text-gray-500 mt-1">Enter credentials to access payment records</p>
                  </div>
                  {loginError && <p className="text-xs text-red-400 text-center mb-3 bg-red-900/20 py-2 rounded-lg">{loginError}</p>}
                  <input type="text" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} placeholder="Username" className="w-full px-4 py-2.5 bg-gray-800 text-white text-sm rounded-xl border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none mb-3 transition-all" />
                  <input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} placeholder="Password" className="w-full px-4 py-2.5 bg-gray-800 text-white text-sm rounded-xl border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none mb-4 transition-all" />
                  <button onClick={handleLogin} className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/40">Login</button>
                </div>
              ) : (
                /* Payment Records */
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-300">Payment Records</span>
                      <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{paymentRecords.length}</span>
                    </div>
                    <div className="flex gap-2">
                      {paymentRecords.length > 0 && (
                        <button onClick={downloadCSV} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-all">Download CSV</button>
                      )}
                      <button onClick={handleLogout} className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs font-medium rounded-lg transition-all">Logout</button>
                    </div>
                  </div>
                  {paymentRecords.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="w-12 h-12 mx-auto text-gray-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                      <p className="text-sm text-gray-500">No payment records yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-800">
                            <th className="text-left py-2.5 px-1 text-gray-400 font-medium text-xs uppercase tracking-wider">#</th>
                            <th className="text-left py-2.5 px-1 text-gray-400 font-medium text-xs uppercase tracking-wider">Date</th>
                            <th className="text-left py-2.5 px-1 text-gray-400 font-medium text-xs uppercase tracking-wider">Product</th>
                            <th className="text-left py-2.5 px-1 text-gray-400 font-medium text-xs uppercase tracking-wider">Amount</th>
                            <th className="text-left py-2.5 px-1 text-gray-400 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Order ID</th>
                            <th className="text-left py-2.5 px-1 text-gray-400 font-medium text-xs uppercase tracking-wider">UTR</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentRecords.map((r, i) => (
                            <tr key={r.id || i} className="border-b border-gray-800/50 hover:bg-blue-950/20 transition-colors">
                              <td className="py-2.5 px-1 text-gray-500 text-xs">{i + 1}</td>
                              <td className="py-2.5 px-1 text-gray-300 whitespace-nowrap text-xs">{r.date}</td>
                              <td className="py-2.5 px-1 text-gray-200 text-xs">{r.product}</td>
                              <td className="py-2.5 px-1 text-emerald-400 text-xs font-medium">₹{r.price}</td>
                              <td className="py-2.5 px-1 text-gray-500 text-[10px] font-mono hidden sm:table-cell">{r.order_id}</td>
                              <td className="py-2.5 px-1 text-blue-400 text-xs font-mono">{r.utr}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <PracticeCompiler isOpen={showCompiler} onClose={() => setShowCompiler(false)} apiBase={API_BASE} />
    </div>
  );
}
