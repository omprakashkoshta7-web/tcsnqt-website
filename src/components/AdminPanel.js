import React, { useState, useEffect } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "";

export default function AdminPanel({ isOpen, onClose, products }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("admin_token") || "");
  const [pdfs, setPdfs] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (loggedIn && token) {
      fetchPdfs();
    }
  }, [loggedIn, token]);

  useEffect(() => {
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        localStorage.setItem("admin_token", data.token);
        setLoggedIn(true);
        setMessage("");
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (err) {
      setMessage("Login failed. Check connection.");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setToken("");
    setLoggedIn(false);
    localStorage.removeItem("admin_token");
    setPdfs({});
  };

  const fetchPdfs = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/pdfs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const pdfMap = {};
        data.forEach((p) => {
          pdfMap[p.product_id] = p.url;
        });
        setPdfs(pdfMap);
      } else {
        handleLogout();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (productId) => {
    const url = pdfs[productId];
    if (!url || !url.trim()) {
      setMessage("Please enter a PDF URL");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/admin/upload-pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, url: url.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`✅ PDF URL saved for product ${productId}`);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "Failed to save");
      }
    } catch (err) {
      setMessage("Failed to save. Check connection.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6 animate-fade-slide-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl">×</button>

        {!loggedIn ? (
          <>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-white text-center mb-4">Admin Login</h3>
            <form onSubmit={handleLogin}>
              <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2.5 bg-gray-800 text-white rounded-lg mb-3 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none" required />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 bg-gray-800 text-white rounded-lg mb-3 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none" required />
              <button type="submit" disabled={loading} className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg disabled:opacity-50">
                {loading ? "Logging in..." : "Login"}
              </button>
              {message && <p className="text-red-400 text-sm mt-3 text-center">{message}</p>}
            </form>
            <p className="text-[10px] text-gray-500 text-center mt-4">Authorized personnel only</p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Upload PDFs</h3>
              <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-white">Logout</button>
            </div>
            {message && <p className={`text-sm mb-3 text-center p-2 rounded ${message.includes("✅") ? "bg-emerald-500/10 text-emerald-300" : "bg-red-500/10 text-red-300"}`}>{message}</p>}
            <p className="text-xs text-gray-400 mb-4">Enter the PDF URL for each product. Users will see a "View PDF" button after purchase.</p>
            <div className="space-y-3">
              {products.map((p) => (
                <div key={p.id} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-center">{p.id}</span>
                    <p className="text-white text-sm font-medium">{p.name}</p>
                  </div>
                  <input type="url" placeholder="https://example.com/file.pdf" value={pdfs[p.id] || ""} onChange={(e) => setPdfs({ ...pdfs, [p.id]: e.target.value })} className="w-full px-3 py-2 bg-gray-700 text-white text-xs rounded mb-2 border border-gray-600 focus:border-emerald-500 outline-none" />
                  <button onClick={() => handleSave(p.id)} className="w-full px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded transition-all">
                    Save PDF URL
                  </button>
                </div>
              ))}
            </div>
            <button onClick={onClose} className="mt-4 w-full px-4 py-2 text-gray-400 hover:text-white text-sm rounded-lg transition-all border border-gray-700">Close</button>
          </>
        )}
      </div>
    </div>
  );
}
