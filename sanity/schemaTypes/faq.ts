import { defineType, defineField, defineArrayMember } from "sanity";

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({
      name: "questions",
      title: "Questions",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqQuestion",
          fields: [
            defineField({ name: "question", title: "Question", type: "localeString" }),
            defineField({ name: "answer", title: "Réponse", type: "localeText" }),
            defineField({
              name: "credits",
              title: "Crédits (optionnel)",
              type: "object",
              fields: [
                defineField({ name: "engineerName", title: "Label - nom ingénieur", type: "localeString" }),
                defineField({ name: "engineerValue", title: "Valeur - nom ingénieur", type: "localeString" }),
                defineField({ name: "studioName", title: "Label - nom studio", type: "localeString" }),
                defineField({ name: "studioValue", title: "Valeur - nom studio", type: "localeString" }),
                defineField({ name: "email", title: "Label - email", type: "localeString" }),
                defineField({ name: "emailValue", title: "Valeur - email", type: "localeString" }),
              ],
            }),
            defineField({ name: "image", title: "Image (URL, optionnel)", type: "url" }),
          ],
          preview: {
            select: { title: "question.fr" },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "FAQ" }),
  },
});
