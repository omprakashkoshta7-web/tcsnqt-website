import React, { useState, useEffect, useCallback } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "";

export default function AdminPanel({ isOpen, onClose }) {
  const [token, setToken] = useState(() => localStorage.getItem("admin_token") || "");
  const [user, setUser] = useState(() => localStorage.getItem("admin_user") || "");
  const [records, setRecords] = useState([]);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");

  const fetchPayments = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/payments`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const d = await res.json(); setRecords(d.payments || []); }
    } catch {}
  }, [token]);

  useEffect(() => { if (isOpen && token) fetchPayments(); }, [isOpen, token, fetchPayments]);

  const login = async () => {
    setLoginError("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: loginUser, password: loginPass }) });
      const data = await res.json();
      if (!res.ok) { setLoginError(data.error || "Login failed"); return; }
      setToken(data.token); setUser(data.username);
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", data.username);
      setLoginUser(""); setLoginPass("");
    } catch { setLoginError("Server unreachable"); }
  };

  const logout = () => { setToken(""); setUser(""); setRecords([]); localStorage.removeItem("admin_token"); localStorage.removeItem("admin_user"); };

  const downloadCSV = () => {
    const h = ["Date", "Product", "Price", "Order ID", "UTR", "Timestamp"];
    const rows = records.map((r) => [r.date, r.product, `Rs.${r.price}`, r.order_id, r.utr, r.timestamp].map((v) => `"${v}"`).join(","));
    const csv = [h.join(","), ...rows].join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "payments.csv"; a.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => !token && onClose()}>
      <div className="relative w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-h-[85vh] flex flex-col animate-fade-slide-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-700 shrink-0">
          <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Admin Panel
          </h3>
          <div className="flex items-center gap-2">
            {user && <span className="text-xs text-gray-500">{user}</span>}
            <button onClick={onClose} className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs font-medium rounded-lg transition-all">Close</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {!token ? (
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
              <input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} placeholder="Password" className="w-full px-4 py-2.5 bg-gray-800 text-white text-sm rounded-xl border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none mb-4 transition-all" />
              <button onClick={login} className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/40">Login</button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300">Payment Records</span>
                  <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{records.length}</span>
                </div>
                <div className="flex gap-2">
                  {records.length > 0 && <button onClick={downloadCSV} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-all">Download CSV</button>}
                  <button onClick={logout} className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs font-medium rounded-lg transition-all">Logout</button>
                </div>
              </div>
              {records.length === 0 ? (
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
                      {records.map((r, i) => (
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
  );
}
