"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function FacilitiesPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t.facilities.title}</h1>
        <p className="mt-2 text-sm text-slate-600">{t.facilities.subtitle}</p>
      </div>

      <div className="mt-10 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-100 text-slate-700">
            <tr>
              <th className="px-6 py-3.5 font-semibold">{t.facilities.headers.category}</th>
              <th className="px-6 py-3.5 font-semibold">{t.facilities.headers.name}</th>
              <th className="px-6 py-3.5 font-semibold">{t.facilities.headers.spec}</th>
              <th className="px-6 py-3.5 font-semibold">{t.facilities.headers.qty}</th>
              <th className="px-6 py-3.5 font-semibold">{t.facilities.headers.maker}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {t.facilities.items.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-blue-700">{item.category}</td>
                <td className="px-6 py-4 font-semibold text-slate-900">{item.name}</td>
                <td className="px-6 py-4 text-slate-600">{item.spec}</td>
                <td className="px-6 py-4 text-slate-900">{item.qty}</td>
                <td className="px-6 py-4 text-slate-600">{item.maker}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
