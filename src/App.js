import React, { useState, useEffect } from "react";
import ProductCard from "./components/ProductCard";
import PaymentModal from "./components/PaymentModal";

const API_BASE = process.env.REACT_APP_API_URL || "";

const PRODUCTS = [
  { id: 1, name: "Complete Aptitude PDF", price: 29, color: "indigo", whatsapp: "https://chat.whatsapp.com/F1FLKhjhHVY5von88wddJU?mode=wwt", form: "https://docs.google.com/forms/d/e/1FAIpQLSfTpVy8Ue7nfakGf7Qie4usfIbm2frL3UKOfk1AhPi6r_o_Cw/viewform?usp=publish-editor", pdf: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", description: "20+ Topic Summaries, Shortcut Methods, and Level-wise Questions designed for TCS NQT 2025.", features: ["Time & Work, Profit–Loss, Ratio, and Geometry topics", "Level-wise Practice Sets (L1–L5)", "Formula Tables & Short Tricks"] },
  { id: 2, name: "Verbal Mastery Set", price: 29, color: "pink", whatsapp: "https://chat.whatsapp.com/CuGU5rWKUahHC70Q7dYz9R?mode=wwt", form: "https://docs.google.com/forms/d/e/1FAIpQLSfTpVy8Ue7nfakGf7Qie4usfIbm2frL3UKOfk1AhPi6r_o_Cw/viewform?usp=publish-editor", pdf: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", description: "Polish your grammar, vocabulary, and reading skills with topic-wise questions and explanations.", features: ["Grammar & Sentence Correction", "Reading Comprehension Practice", "Vocabulary, Antonyms, and Synonyms"] },
  { id: 3, name: "Programming Practice Set", price: 29, color: "green", whatsapp: "https://chat.whatsapp.com/JMiqqmbLmSk5fcwgSVnp7i?mode=wwt", form: "https://docs.google.com/forms/d/e/1FAIpQLSfTpVy8Ue7nfakGf7Qie4usfIbm2frL3UKOfk1AhPi6r_o_Cw/viewform?usp=publish-editor", pdf: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", description: "C, C++, Java, and Python MCQs with concept explanations & coding snippets for TCS-style problems.", features: ["50+ Programming MCQs", "Language Syntax & Concepts", "C, C++, Java, and Python Basics"] },
  { id: 4, name: "Reasoning Booster Pack", price: 29, color: "yellow", whatsapp: "https://chat.whatsapp.com/ChxD0tPjkGKCGCLDsshvep?mode=wwt", form: "https://docs.google.com/forms/d/e/1FAIpQLSfTpVy8Ue7nfakGf7Qie4usfIbm2frL3UKOfk1AhPi6r_o_Cw/viewform?usp=publish-editor", pdf: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", description: "Reasoning ability questions covering puzzles, seating arrangements, syllogisms, and more.", features: ["Puzzles & Seating Arrangements Questions", "Syllogisms, Blood Relations, and Directions", "Detailed Explanations for Each Question"] },
  { id: 5, name: "Previous Year Questions (PYQs)", price: 29, color: "yellow", whatsapp: "https://chat.whatsapp.com/F1FLKhjhHVY5von88wddJU?mode=wwt", form: "https://docs.google.com/forms/d/e/1FAIpQLSfTpVy8Ue7nfakGf7Qie4usfIbm2frL3UKOfk1AhPi6r_o_Cw/viewform?usp=publish-editor", pdf: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", description: "Curated set of 2021–2024 TCS NQT & TCS Digital previous year questions with detailed explanations.", features: ["Actual TCS NQT & Digital Questions (2021–2024)", "Solutions with step-by-step explanations", "Topic tags for each question (Aptitude, Verbal, Reasoning, etc.)"] },
];

export default function TCSNQTApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [copied, setCopied] = useState(false);
  const [purchased, setPurchased] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("tcsnqt_purchased");
    if (stored) {
      try {
        setPurchased(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  const handleCopyForm = (link) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinGroup = (product) => {
    window.open(product.whatsapp, "_blank");
    setTimeout(() => {
      window.open(`https://wa.me/7089185009?text=${encodeURIComponent(`Hi! I've joined the WhatsApp group for ${product.name}. Please share the payment link.`)}`, "_blank");
    }, 2000);
  };

  const handlePurchase = (productId) => {
    setPurchased((prev) => {
      const updated = { ...prev, [productId]: true };
      localStorage.setItem("tcsnqt_purchased", JSON.stringify(updated));
      return updated;
    });
  };

  const handleViewPdf = (product) => {
    if (product.pdf) {
      window.open(product.pdf, "_blank");
    }
  };

  const tabCls = (tab) =>
    `px-4 sm:px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
      activeTab === tab ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "text-gray-400 hover:text-white hover:bg-gray-800"
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
            <button onClick={() => setActiveTab("home")} className={tabCls("home")}>Home</button>
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
              {PRODUCTS.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  copied={copied}
                  isPurchased={!!purchased[p.id]}
                  onBuy={setSelectedProduct}
                  onJoinGroup={handleJoinGroup}
                  onCopyForm={handleCopyForm}
                  onViewPdf={handleViewPdf}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {selectedProduct && (
        <PaymentModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onPurchase={() => handlePurchase(selectedProduct.id)}
        />
      )}
    </div>
  );
}
