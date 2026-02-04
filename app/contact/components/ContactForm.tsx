"use client";

import { useState, FormEvent } from "react";
import { ArrowUpRight } from "@/components/icons/ArrowUpRight";
import { Translations } from "@/lib/i18n/types";
import { FormInput } from "./FormInput";
import { FormTextarea } from "./FormTextarea";
import { FormSelect } from "./FormSelect";

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

interface ContactFormProps {
  t: Translations;
  onSuccess: () => void;
  onSubmitting: (isSubmitting: boolean) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_FORM_DATA: FormData = {
  name: "",
  familyName: "",
  email: "",
  phone: "",
  artistName: "",
  projectName: "",
  type: "",
  numberOfSongs: "",
  message: "",
};

export function ContactForm({ t, onSuccess, onSubmitting }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});

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
    } else if (!EMAIL_REGEX.test(formData.email)) {
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      onSuccess();
      setFormData(INITIAL_FORM_DATA);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ submit: t.contact.form.validation.submitError });
    } finally {
      onSubmitting(false);
    }
  };

  const typeOptions = [
    { value: "indie", label: t.contact.form.options.indie },
    { value: "label", label: t.contact.form.options.label },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-1 2xl:space-x-5">
      {/* YOUR INFO Section */}
      <div>
        <h2 className="uppercase text-lg 2xl:text-3xl font-extralight text-white mb-2 2xl:mb-6 pl-4">
          {t.contact.form.sections.yourInfo}
        </h2>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <FormInput
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t.contact.form.placeholders.name}
              error={errors.name}
              required
            />
            <FormInput
              name="familyName"
              value={formData.familyName}
              onChange={handleChange}
              placeholder={t.contact.form.placeholders.familyName}
              error={errors.familyName}
              required
            />
          </div>
          <FormInput
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t.contact.form.placeholders.email}
            error={errors.email}
            required
          />
          <FormInput
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder={t.contact.form.placeholders.phone}
            error={errors.phone}
            required
          />
        </div>
      </div>

      {/* PROJECT INFO Section */}
      <div>
        <h2 className="uppercase text-lg 2xl:text-3xl font-extralight text-white mb-2 2xl:mb-6 pl-4">
          {t.contact.form.sections.projectInfo}
        </h2>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <FormInput
              name="artistName"
              value={formData.artistName}
              onChange={handleChange}
              placeholder={t.contact.form.placeholders.artistName}
            />
            <FormInput
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              placeholder={t.contact.form.placeholders.projectName}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormSelect
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder={t.contact.form.placeholders.type}
              options={typeOptions}
            />
            <FormInput
              type="number"
              name="numberOfSongs"
              value={formData.numberOfSongs}
              onChange={handleChange}
              placeholder={t.contact.form.placeholders.numberOfSongs}
              min="1"
            />
          </div>
          <FormTextarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={t.contact.form.placeholders.message}
            error={errors.message}
            required
          />
        </div>
      </div>

      {/* Form Footer */}
      <div className="grid grid-cols-2 items-end gap-x-3">
        <p className="text-sm 2xl:text-base text-white font-poppins">
          {t.contact.form.requiredNote}
        </p>
        <button
          type="submit"
          className="bg-red text-black font-bold text-lg px-6 xl:px-8 py-2.5 rounded-[10px] hover:bg-red/90 transition-all duration-500 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-full hover:scale-[1.03]"
        >
          {t.contact.form.send}
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
  );
}
