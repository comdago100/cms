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
  getSupportConfig,
  defaultSupportConfig,
  SupportConfig,
  triggerBrowserDownload,
} from "@/lib/cms";
import { CustomPageBlocks } from "@/components/CustomPageBlocks";

export default function SupportPage() {
  const { locale, t } = useLanguage();
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [supportConfig, setSupportConfig] = useState<SupportConfig>(defaultSupportConfig);
  const [activeSubTab, setActiveSubTab] = useState<string>("inquiry");
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
      const supCfg = getSupportConfig("noksan");
      setSupportConfig(supCfg);
      setHiddenSections(getHiddenSkeletonSections("noksan"));
      setActiveSubTab((prev) =>
        supCfg.tabs.some((tab) => tab.id === prev)
          ? prev
          : supCfg.tabs[0]?.id || "inquiry"
      );
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

      {/* 회사소개 스타일 고객지원 상단 서브 탭 네비게이션 */}
      {!hiddenSections.includes("sup_subtabs") && supportConfig.tabs.length > 0 && (
        <div className="sticky top-16 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-xs">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <nav className="-mb-px flex space-x-2 overflow-x-auto" aria-label="고객지원 탭">
              {supportConfig.tabs.map((tab) => {
                const isActive = activeSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveSubTab(tab.id)}
                    className={`relative whitespace-nowrap px-5 py-4 text-sm font-bold transition-colors cursor-pointer ${
                      isActive
                        ? "text-blue-700"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* 상단 커스텀 블록 (선택한 고객지원 하위 탭 연동) */}
      <CustomPageBlocks page="support" position="top" subTab={activeSubTab} />

      {/* (1) 온라인 견적·상담 문의 탭 */}
      {activeSubTab === "inquiry" &&
        (!hiddenSections.includes("sup_contact") || !hiddenSections.includes("sup_form")) && (
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

      {/* (2) 자료실 · 양식 다운로드 탭 (이력서 양식, 참고자료 등 첨부파일 다운로드) */}
      {activeSubTab === "downloads" && !hiddenSections.includes("sup_downloads") && (
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="border-b border-slate-100 pb-5 mb-6">
              <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 mb-2">
                DOWNLOAD ARCHIVE
              </span>
              <h2 className="text-2xl font-bold text-slate-900">
                이력서 양식 및 주요 참고자료 다운로드
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                입사지원서(이력서) 양식, 회사소개서, 설비 및 제품 참고자료를 클릭하여 바로 다운로드하실 수 있습니다.
              </p>
            </div>

            {supportConfig.attachments.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-500">
                등록된 첨부파일 자료가 없습니다.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {supportConfig.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 transition-all hover:border-blue-300 hover:bg-white hover:shadow-md sm:flex-row sm:items-center"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {att.category && (
                          <span className="inline-block rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-extrabold text-blue-800">
                            {att.category}
                          </span>
                        )}
                        {att.date && (
                          <span className="text-xs text-slate-400">{att.date}</span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 break-words">
                        {att.title}
                      </h3>
                      {att.desc && (
                        <p className="text-xs leading-relaxed text-slate-600">
                          {att.desc}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-semibold text-slate-500">
                        <span>📎 {att.fileName || "첨부파일"}</span>
                        {att.fileSize && <span>({att.fileSize})</span>}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        triggerBrowserDownload(
                          att.fileUrl,
                          att.fileName || att.title || "첨부파일"
                        )
                      }
                      className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-3 text-xs font-extrabold text-white shadow-xs transition-colors hover:bg-blue-500 cursor-pointer"
                    >
                      <span>📥 다운로드</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 하단 커스텀 블록 (선택한 고객지원 하위 탭 연동) */}
      <CustomPageBlocks page="support" position="bottom" subTab={activeSubTab} />
    </div>
  );
}
