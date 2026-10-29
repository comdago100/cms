"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
  getSiteSettings,
  defaultSiteSettings,
  SiteSettings,
  addSupportInquiry,
  getHiddenSkeletonSections,
} from "@/lib/cms";
import { CustomPageBlocks } from "@/components/CustomPageBlocks";

export default function SupportPage() {
  const { locale, t } = useLanguage();
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [hiddenSections, setHiddenSections] = useState<string[]>([]);

  // 문의 폼 상태
  const [companyAndName, setCompanyAndName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = () => {
      setSettings(getSiteSettings("noksan"));
      setHiddenSections(getHiddenSkeletonSections("noksan"));
    };
    load();
    window.addEventListener("cms-updated", load);
    return () => window.removeEventListener("cms-updated", load);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyAndName.trim() || !phone.trim() || !subject.trim()) {
      alert("업체명/성함, 연락처, 문의 제목을 입력해 주세요.");
      return;
    }

    addSupportInquiry("noksan", {
      companyAndName: companyAndName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    alert("문의가 정상적으로 접수되었습니다. 관리자 페이지(고객문의 관리)에서 확인 가능합니다.");
    setCompanyAndName("");
    setPhone("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  const displayAddress = locale === "KR" ? settings.address : t.company.address;
  const displayHours = locale === "KR" ? settings.operatingHours : t.company.operatingHours;

  return (
    <div className="bg-slate-50">
      <section className="bg-slate-900 py-14 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
            CUSTOMER SUPPORT
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {t.support.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            {t.support.subtitle}
          </p>
        </div>
      </section>

      {/* 상단 커스텀 블록 (작은 배너 · 카드# · 이미지) */}
      <CustomPageBlocks page="support" position="top" />

      {(!hiddenSections.includes("sup_contact") || !hiddenSections.includes("sup_form")) && (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* 연락처 안내 */}
          {!hiddenSections.includes("sup_contact") && (
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{t.support.contactTitle}</h2>
              <p className="mt-1 text-xs text-slate-500">{t.support.contactSub}</p>
            </div>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="font-semibold text-slate-700">{t.support.labels.phone}</dt>
                <dd className="mt-0.5 text-base font-bold text-blue-700">{settings.phone}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-700">{t.support.labels.fax}</dt>
                <dd className="mt-0.5 text-slate-900">{settings.fax}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-700">{t.support.labels.email}</dt>
                <dd className="mt-0.5 text-slate-900">{settings.email}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-700">{t.support.labels.hours}</dt>
                <dd className="mt-0.5 text-slate-900">{displayHours}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-700">{t.support.labels.location}</dt>
                <dd className="mt-0.5 text-slate-900">{displayAddress}</dd>
              </div>
            </dl>
          </div>
          )}

          {/* 온라인 문의 폼 */}
          {!hiddenSections.includes("sup_form") && (
          <div
            className={`${
              hiddenSections.includes("sup_contact") ? "lg:col-span-3" : "lg:col-span-2"
            } rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8`}
          >
            <h2 className="text-lg font-bold text-slate-900">{t.support.formTitle}</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    {t.support.form.nameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={companyAndName}
                    onChange={(e) => setCompanyAndName(e.target.value)}
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
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
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
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.support.form.messagePlaceholder}
                  className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors cursor-pointer sm:w-auto"
              >
                {t.support.form.submitBtn}
              </button>
            </form>
          </div>
          )}
        </div>
      </div>
      )}

      {/* 하단 커스텀 블록 (작은 배너 · 카드# · 이미지) */}
      <CustomPageBlocks page="support" position="bottom" />
    </div>
  );
}
