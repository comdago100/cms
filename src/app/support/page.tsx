"use client";

import { siteConfig } from "@/config/site";
import { useLanguage } from "@/context/LanguageContext";

export default function SupportPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t.support.title}</h1>
        <p className="mt-2 text-sm text-slate-600">{t.support.subtitle}</p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        {/* 연락처 안내 */}
        <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t.support.contactTitle}</h2>
            <p className="mt-1 text-xs text-slate-500">{t.support.contactSub}</p>
          </div>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-slate-700">{t.support.labels.phone}</dt>
              <dd className="mt-0.5 text-base font-bold text-blue-700">{siteConfig.phone}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-700">{t.support.labels.fax}</dt>
              <dd className="mt-0.5 text-slate-900">{siteConfig.fax}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-700">{t.support.labels.email}</dt>
              <dd className="mt-0.5 text-slate-900">{siteConfig.email}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-700">{t.support.labels.hours}</dt>
              <dd className="mt-0.5 text-slate-900">{t.company.operatingHours}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-700">{t.support.labels.location}</dt>
              <dd className="mt-0.5 text-slate-900">{t.company.address}</dd>
            </div>
          </dl>
        </div>

        {/* 온라인 문의 폼 */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900">{t.support.formTitle}</h2>
          <form className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  {t.support.form.nameLabel}
                </label>
                <input
                  type="text"
                  placeholder={t.support.form.namePlaceholder}
                  className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  {t.support.form.phoneLabel}
                </label>
                <input
                  type="tel"
                  placeholder={t.support.form.phonePlaceholder}
                  className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                {t.support.form.emailLabel}
              </label>
              <input
                type="email"
                placeholder={t.support.form.emailPlaceholder}
                className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                {t.support.form.subjectLabel}
              </label>
              <input
                type="text"
                placeholder={t.support.form.subjectPlaceholder}
                className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                {t.support.form.messageLabel}
              </label>
              <textarea
                rows={5}
                placeholder={t.support.form.messagePlaceholder}
                className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>

            <button
              type="button"
              className="w-full rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors sm:w-auto"
            >
              {t.support.form.submitBtn}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
