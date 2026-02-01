"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { PageTransition } from "@/components/page-transition";
import { Footer } from "@/components/footer";
import { LoadingSpinner } from "@/components/loading-spinner";
import { ChevronDown, CircleCheckBig } from "lucide-react";
import { ArrowUpRight } from "@/components/icons/ArrowUpRight";

interface FormData {
  name: string;
  familyName: string;
  email: string;
  phone: string;
  artistName: string;
  projectName: string;
  type: string;
  numberOfSongs: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function ContactPage() {
  const t = useTranslations();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    familyName: "",
    email: "",
    phone: "",
    artistName: "",
    projectName: "",
    type: "",
    numberOfSongs: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = t.contact.form.validation.nameRequired;
    }
    if (!formData.familyName.trim()) {
      newErrors.familyName = t.contact.form.validation.familyNameRequired;
    }
    if (!formData.email.trim()) {
      newErrors.email = t.contact.form.validation.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.contact.form.validation.emailInvalid;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t.contact.form.validation.phoneRequired;
    }
    if (!formData.message.trim()) {
      newErrors.message = t.contact.form.validation.messageRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement actual form submission (API route, email service, etc.)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSubmitSuccess(true);
      setFormData({
        name: "",
        familyName: "",
        email: "",
        phone: "",
        artistName: "",
        projectName: "",
        type: "",
        numberOfSongs: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ submit: t.contact.form.validation.submitError });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <main className="h-full flex flex-col bg-black pb-8 md:pb-0 pt-8 md:pt-4 xl:pt-6 2xl:pt-8 px-8 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-y-auto md:overflow-y-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 md:mb-3 xl:mb-5 2xl:mb-10">
            <h1 className="text-4xl md:text-5xl xl:text-6xl 2xl:text-[80px] font-bold text-white">
              {t.contact.title}
            </h1>
            {/* Close button */}
            <Link
              href="/"
              className="text-white hover:text-red transition-all hover:rotate-90 duration-300"
              aria-label="Back to home"
            >
              <svg
                className="w-10 h-10 md:w-12 md:h-12 xl:w-14 xl:h-14 2xl:w-[58px] 2xl:h-[58px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex gap-3 md:gap-3 xl:gap-4 mb-6 md:mb-3 2xl:mb-10">
            <a
              href="https://www.instagram.com/masteredbyedouard/"
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-white rounded-full px-6 py-2 hover:bg-white transition-colors duration-300"
              aria-label="Instagram"
            >
              <Image
                width={28}
                height={28}
                src="/svg/instagram-logo.svg"
                alt="Instagram"
                className="w-5 h-5 md:w-6 md:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 brightness-0 invert group-hover:brightness-0 group-hover:invert-0 transition-all duration-300"
              />
            </a>
            <a
              href="https://www.linkedin.com/in/edouard-carbonne/"
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-white rounded-full px-6 py-2 hover:bg-white transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <Image
                width={28}
                height={28}
                src="/svg/linkedin-logo.svg"
                alt="LinkedIn"
                className="w-5 h-5 md:w-6 md:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 brightness-0 invert group-hover:brightness-0 group-hover:invert-0 transition-all duration-300"
              />
            </a>
            <a
              href="https://www.facebook.com/masteredbyedouard"
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-white rounded-full px-6 py-2 hover:bg-white transition-colors duration-300"
              aria-label="Facebook"
            >
              <Image
                width={28}
                height={28}
                src="/svg/facebook-logo.svg"
                alt="Facebook"
                className="w-5 h-5 md:w-6 md:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 brightness-0 invert group-hover:brightness-0 group-hover:invert-0 transition-all duration-300"
              />
            </a>
            <a
              href="https://wa.me/+33695822071"
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-white rounded-full px-6 py-2 hover:bg-white transition-colors duration-300"
              aria-label="WhatsApp"
            >
              <Image
                width={28}
                height={28}
                src="/svg/whatsapp-logo.svg"
                alt="WhatsApp"
                className="w-5 h-5 md:w-6 md:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 brightness-0 invert group-hover:brightness-0 group-hover:invert-0 transition-all duration-300"
              />
            </a>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 md:gap-6 xl:gap-10 2xl:gap-16 gap-8 flex-1 min-h-0">
            {/* Left Column - Contact Form or Success Message */}
            <div className="overflow-y-auto md:overflow-y-visible">
              {submitSuccess ? (
                <div className="flex flex-col h-full">
                  {/* White success container */}
                  <div className="bg-white rounded-[10px] pt-8 px-8 flex flex-col items-center relative flex-1">
                    <CircleCheckBig
                      size={64}
                      className="text-white bg-red rounded-full p-3"
                      strokeWidth={2}
                    />
                    <p className="text-black text-center md:text-2xl 2xl:text-3xl mt-3">
                      {t.contact.form.successMessage}
                    </p>
                    <div className="mt-auto w-full flex justify-center">
                      <Image
                        src="https://www.dropbox.com/scl/fi/k3q1w44zwfdlpglo9w3gc/sucess-message-contact.webp?rlkey=204sf2iuubp7ndii001ihsoaa&st=boi6c088&dl=1"
                        alt="Success illustration"
                        width={271}
                        height={271}
                        className="object-cover w-full"
                      />
                    </div>
                  </div>
                  <Link
                    href="/"
                    className="bg-red text-black font-bold text-base 2xl:text-lg px-6 xl:px-8 py-2.5 xl:py-3 rounded-[10px] hover:bg-red/90 transition-colors duration-300 flex items-center justify-center gap-2 mt-3"
                  >
                    {t.contact.form.backToHome}
                    <ArrowUpRight size={20} />
                  </Link>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-1 2xl:space-x-5"
                >
                  {/* YOUR INFO Section */}
                  <div>
                    <h2 className="uppercase text-lg 2xl:text-3xl font-extralight text-white mb-2 2xl:mb-6 pl-4">
                      {t.contact.form.sections.yourInfo}
                    </h2>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder={t.contact.form.placeholders.name}
                            className={`w-full bg-white rounded-[10px] px-4 py-2 text-base 2xl:text-lg text-black placeholder-black focus:ring-2 focus:ring-inset focus:ring-red outline-none ${
                              errors.name ? "ring-2 ring-inset ring-red" : ""
                            }`}
                            required
                          />
                          {errors.name && (
                            <p className="text-red text-sm 2xl:text-base mt-1 font-poppins">
                              {errors.name}
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            name="familyName"
                            value={formData.familyName}
                            onChange={handleChange}
                            placeholder={t.contact.form.placeholders.familyName}
                            className={`w-full bg-white rounded-[10px] px-4 py-2 text-base 2xl:text-lg text-black placeholder-black focus:ring-2 focus:ring-inset focus:ring-red outline-none ${
                              errors.familyName
                                ? "ring-2 ring-inset ring-red"
                                : ""
                            }`}
                            required
                          />
                          {errors.familyName && (
                            <p className="text-red text-sm 2xl:text-base mt-1 font-poppins">
                              {errors.familyName}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder={t.contact.form.placeholders.email}
                          className={`w-full bg-white rounded-[10px] px-4 py-2 text-base 2xl:text-lg text-black placeholder-black focus:ring-2 focus:ring-inset focus:ring-red outline-none ${
                            errors.email ? "ring-2 ring-inset ring-red" : ""
                          }`}
                          required
                        />
                        {errors.email && (
                          <p className="text-red text-sm 2xl:text-base mt-1 font-poppins">
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder={t.contact.form.placeholders.phone}
                          className={`w-full bg-white rounded-[10px] px-4 py-2 text-base 2xl:text-lg text-black placeholder-black focus:ring-2 focus:ring-inset focus:ring-red outline-none ${
                            errors.phone ? "ring-2 ring-inset ring-red" : ""
                          }`}
                          required
                        />
                        {errors.phone && (
                          <p className="text-red text-sm 2xl:text-base mt-1 font-poppins">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* PROJECT INFO Section */}
                  <div>
                    <h2 className="uppercase text-lg 2xl:text-3xl font-extralight text-white mb-2 2xl:mb-6 pl-4">
                      {t.contact.form.sections.projectInfo}
                    </h2>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          name="artistName"
                          value={formData.artistName}
                          onChange={handleChange}
                          placeholder={t.contact.form.placeholders.artistName}
                          className="w-full bg-white rounded-[10px] px-4 py-2 text-base 2xl:text-lg text-black placeholder-black focus:ring-2 focus:ring-inset focus:ring-red outline-none"
                        />
                        <input
                          type="text"
                          name="projectName"
                          value={formData.projectName}
                          onChange={handleChange}
                          placeholder={t.contact.form.placeholders.projectName}
                          className="w-full bg-white rounded-[10px] px-4 py-2 text-base 2xl:text-lg text-black placeholder-black focus:ring-2 focus:ring-inset focus:ring-red outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full bg-white rounded-[10px] px-4 py-2 text-base 2xl:text-lg text-black appearance-none focus:ring-2 focus:ring-inset focus:ring-red outline-none"
                          >
                            <option value="">
                              {t.contact.form.placeholders.type}
                            </option>
                            <option value="indie">
                              {t.contact.form.options.indie}
                            </option>
                            <option value="label">
                              {t.contact.form.options.label}
                            </option>
                          </select>
                          <ChevronDown
                            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                            size={20}
                          />
                        </div>
                        <input
                          type="number"
                          name="numberOfSongs"
                          value={formData.numberOfSongs}
                          onChange={handleChange}
                          placeholder={
                            t.contact.form.placeholders.numberOfSongs
                          }
                          className="w-full bg-white rounded-[10px] px-4 py-2 text-base 2xl:text-lg text-black placeholder-black focus:ring-2 focus:ring-inset focus:ring-red outline-none"
                          min="1"
                        />
                      </div>
                      <div>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder={t.contact.form.placeholders.message}
                          className={`w-full bg-white rounded-[10px] px-4 py-2 text-base 2xl:text-lg text-black placeholder-black h-16 resize-none focus:ring-2 focus:ring-inset focus:ring-red outline-none ${
                            errors.message ? "ring-2 ring-inset ring-red" : ""
                          }`}
                          required
                        />
                        {errors.message && (
                          <p className="text-red text-sm 2xl:text-base mt-1 font-poppins">
                            {errors.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Form Footer */}
                  <div className="grid grid-cols-2 items-end gap-x-3">
                    <p className="text-sm 2xl:text-base text-white font-poppins">
                      {t.contact.form.requiredNote}
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-red text-black font-bold text-base 2xl:text-lg px-6 xl:px-8 py-2.5 xl:py-3 rounded-[10px] hover:bg-red/90 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-full"
                    >
                      {isSubmitting
                        ? t.contact.form.sending
                        : t.contact.form.send}
                      <ArrowUpRight size={20} />
                    </button>
                  </div>

                  {/* Submit Error */}
                  {errors.submit && (
                    <div className="bg-red/20 border border-red text-red px-4 py-3 rounded-[10px] text-base 2xl:text-lg font-poppins">
                      {errors.submit}
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* Right Column - Illustration */}
            <div className="hidden md:flex flex-col items-center md:items-end justify-start space-y-4 2xl:space-y-20">
              <div className="text-5xl lg:text-7xl xl:text-[90px] 2xl:text-[100px] font-bold text-white !leading-[0.8]">
                <p>{t.contact.ctaTitle1}</p>
                <p>{t.contact.ctaTitle2}</p>
              </div>
              <Image
                src="https://www.dropbox.com/scl/fi/vcphub2lii62wkgckszn6/contact.webp?rlkey=iff7tnt6qg1gixxxm6rbgtt37&st=0jd4agpq&dl=1"
                alt="Edouard Contact Illustration"
                width={271}
                height={271}
                className="object-cover w-52 h-52 xl:w-60 xl:h-60 2xl:w-[271px] 2xl:h-[271px]"
              />
            </div>
          </div>

          <Footer color="white" hoverColor="red" />
        </div>
      </main>
      {isSubmitting && <LoadingSpinner />}
    </PageTransition>
  );
}
