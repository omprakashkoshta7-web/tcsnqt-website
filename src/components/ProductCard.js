import React from "react";

const colorStyles = {
  indigo: { border: "border-indigo-500", badge: "bg-indigo-500/15 text-indigo-300", dot: "bg-indigo-500", btn: "bg-indigo-600 hover:bg-indigo-500" },
  pink: { border: "border-pink-500", badge: "bg-pink-500/15 text-pink-300", dot: "bg-pink-500", btn: "bg-pink-600 hover:bg-pink-500" },
  green: { border: "border-emerald-500", badge: "bg-emerald-500/15 text-emerald-300", dot: "bg-emerald-500", btn: "bg-emerald-600 hover:bg-emerald-500" },
  yellow: { border: "border-amber-500", badge: "bg-amber-500/15 text-amber-300", dot: "bg-amber-500", btn: "bg-amber-600 hover:bg-amber-500" },
};

export default function ProductCard({ product, onBuy, onJoinGroup, onCopyForm, copied }) {
  const cs = colorStyles[product.color];

  return (
    <div className={`group relative bg-gray-900/70 border border-gray-800 border-l-4 ${cs.border} rounded-xl p-4 sm:p-6 transition-all duration-300 hover:border-l-[6px] hover:bg-gray-900/90 hover:shadow-lg hover:shadow-blue-900/20`}>
      <div className="flex justify-between flex-wrap items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-white">{product.name}</h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">{product.description}</p>
        </div>
        <span className={`shrink-0 ${cs.badge} px-3 py-1 rounded-full text-xs sm:text-sm font-semibold`}>
          ₹{product.price}
        </span>
      </div>

      <ul className="mt-3 space-y-1">
        {product.features.map((f, i) => (
          <li key={i} className="text-xs sm:text-sm text-gray-500 flex items-start gap-2">
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${cs.dot}`} />
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => onJoinGroup(product)} className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs sm:text-sm font-medium rounded-lg transition-all shadow-lg shadow-emerald-900/30">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
          Join WhatsApp
        </button>
        <button onClick={() => onBuy(product)} className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 ${cs.btn} text-white text-xs sm:text-sm font-medium rounded-lg transition-all shadow-lg`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          Buy Now
        </button>
        <button onClick={() => onCopyForm(product.form)} className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 text-xs sm:text-sm font-medium rounded-lg transition-all border border-gray-700/50">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          Copy Form
        </button>
      </div>

      {copied && <p className="mt-2 text-xs text-emerald-400 animate-fade-in">Form link copied!</p>}
    </div>
  );
}
