"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { PageTransition } from "@/components/page-transition";
import { Footer } from "@/components/footer";
import {
  Instagram,
  Linkedin,
  Facebook,
  MessageCircle,
  ChevronDown,
  MoveUpRight,
} from "lucide-react";

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
    >
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

      console.log("Form data:", formData);

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

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ submit: t.contact.form.validation.submitError });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <main className="h-full flex flex-col bg-black px-8 pt-8 pb-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 md:mb-5">
          <h1 className="text-4xl md:text-[80px] font-bold text-white">
            {t.contact.title}
          </h1>
          {/* Close button */}
          <Link
            href="/"
            className="text-white hover:text-red transition-all hover:rotate-90 duration-300"
            aria-label="Back to home"
          >
            <svg
              className="w-10 h-10 md:w-12 md:h-12"
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
        <div className="flex gap-3 md:gap-4 mb-8 md:mb-12">
          <a
            href="https://instagram.com/masteredbyedouard"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white rounded-full p-3 md:p-4 text-white hover:text-red transition-colors duration-300"
            aria-label="Instagram"
          >
            <Instagram size={24} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white rounded-full p-3 md:p-4 text-white hover:text-red transition-colors duration-300"
            aria-label="LinkedIn"
          >
            <Linkedin size={24} />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white rounded-full p-3 md:p-4 text-white hover:text-red transition-colors duration-300"
            aria-label="Facebook"
          >
            <Facebook size={24} />
          </a>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white rounded-full p-3 md:p-4 text-white hover:text-red transition-colors duration-300"
            aria-label="WhatsApp"
          >
            <MessageCircle size={24} />
          </a>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 md:gap-16 gap-8 flex-1">
          {/* Left Column - Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* YOUR INFO Section */}
              <div>
                <h2 className="uppercase text-xl md:text-2xl font-light text-white mb-4">
                  {t.contact.form.sections.yourInfo}
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t.contact.form.placeholders.name}
                        className={`w-full bg-white rounded-lg px-4 py-3 text-black placeholder-black focus:ring-2 focus:ring-red outline-none ${
                          errors.name ? "ring-2 ring-red" : ""
                        }`}
                        required
                      />
                      {errors.name && (
                        <p className="text-red text-sm mt-1">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        name="familyName"
                        value={formData.familyName}
                        onChange={handleChange}
                        placeholder={t.contact.form.placeholders.familyName}
                        className={`w-full bg-white rounded-lg px-4 py-3 text-black placeholder-black focus:ring-2 focus:ring-red outline-none ${
                          errors.familyName ? "ring-2 ring-red" : ""
                        }`}
                        required
                      />
                      {errors.familyName && (
                        <p className="text-red text-sm mt-1">
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
                      className={`w-full bg-white rounded-lg px-4 py-3 text-black placeholder-black focus:ring-2 focus:ring-red outline-none ${
                        errors.email ? "ring-2 ring-red" : ""
                      }`}
                      required
                    />
                    {errors.email && (
                      <p className="text-red text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t.contact.form.placeholders.phone}
                      className={`w-full bg-white rounded-lg px-4 py-3 text-black placeholder-black focus:ring-2 focus:ring-red outline-none ${
                        errors.phone ? "ring-2 ring-red" : ""
                      }`}
                      required
                    />
                    {errors.phone && (
                      <p className="text-red text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* PROJECT INFO Section */}
              <div>
                <h2 className="uppercase text-xl md:text-2xl font-light text-white mb-4">
                  {t.contact.form.sections.projectInfo}
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="artistName"
                      value={formData.artistName}
                      onChange={handleChange}
                      placeholder={t.contact.form.placeholders.artistName}
                      className="w-full bg-white rounded-lg px-4 py-3 text-black placeholder-black focus:ring-2 focus:ring-red outline-none"
                    />
                    <input
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleChange}
                      placeholder={t.contact.form.placeholders.projectName}
                      className="w-full bg-white rounded-lg px-4 py-3 text-black placeholder-black focus:ring-2 focus:ring-red outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full bg-white rounded-lg px-4 py-3 text-black appearance-none focus:ring-2 focus:ring-red outline-none"
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
                      placeholder={t.contact.form.placeholders.numberOfSongs}
                      className="w-full bg-white rounded-lg px-4 py-3 text-black placeholder-black focus:ring-2 focus:ring-red outline-none"
                      min="1"
                    />
                  </div>
                  <div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t.contact.form.placeholders.message}
                      className={`w-full bg-white rounded-lg px-4 py-3 text-black placeholder-black h-32 md:h-40 resize-none focus:ring-2 focus:ring-red outline-none ${
                        errors.message ? "ring-2 ring-red" : ""
                      }`}
                      required
                    />
                    {errors.message && (
                      <p className="text-red text-sm mt-1">{errors.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Footer */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/70">
                  {t.contact.form.requiredNote}
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-red text-white font-bold px-8 py-3 rounded-lg hover:bg-red/90 transition-colors duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t.contact.form.sending : t.contact.form.send}
                  <MoveUpRight size={20} />
                </button>
              </div>

              {/* Success Message */}
              {submitSuccess && (
                <div className="bg-green-500/20 border border-green-500 text-green-500 px-4 py-3 rounded-lg">
                  {t.contact.form.validation.submitSuccess}
                </div>
              )}

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red/20 border border-red text-red px-4 py-3 rounded-lg">
                  {errors.submit}
                </div>
              )}
            </form>
          </div>

          {/* Right Column - Illustration */}
          <div className="hidden md:flex flex-col items-end justify-start space-y-8">
            <h2 className="text-5xl xl:text-[100px] 2xl:text-[120px] font-bold text-white uppercase leading-none text-right">
              {t.contact.ctaTitle}
            </h2>
            <div className="w-64 h-64 xl:w-80 xl:h-80 2xl:w-96 2xl:h-96 bg-white rounded-full flex items-center justify-center overflow-hidden">
              <Image
                src="/images/contact/edouard-phone.png"
                alt="Edouard on phone"
                width={384}
                height={384}
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <Footer color="white" />
      </main>
    </PageTransition>
  );
}
