import { defineType, defineField, defineArrayMember } from "sanity";

export const studioPage = defineType({
  name: "studioPage",
  title: "Page Studio",
  type: "document",
  fields: [
    defineField({
      name: "tabs",
      title: "Onglets",
      type: "object",
      fields: [
        defineField({ name: "edouardLabel", title: "Libellé - edouard", type: "localeString" }),
        defineField({ name: "friendsLabel", title: "Libellé - amis", type: "localeString" }),
        defineField({ name: "servicesLabel", title: "Libellé - services", type: "localeString" }),
        defineField({ name: "gearLabel", title: "Libellé - matériel", type: "localeString" }),
      ],
    }),
    defineField({
      name: "edouard",
      title: "Onglet - edouard",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Titre", type: "localeString" }),
        defineField({ name: "description1", title: "Texte 1", type: "localeText" }),
        defineField({ name: "description2", title: "Texte 2", type: "localeText" }),
        defineField({ name: "fullDiscography", title: "Voir toute la discographie", type: "localeString" }),
        defineField({ name: "portraitImage", title: "Photo portrait (URL)", type: "url" }),
        defineField({ name: "signatureImage", title: "Signature (URL)", type: "url" }),
      ],
    }),
    defineField({
      name: "friends",
      title: "Onglet - amis",
      type: "object",
      fields: [
        defineField({ name: "title1", title: "Titre 1", type: "localeString" }),
        defineField({ name: "description1", title: "Texte 1", type: "localeText" }),
        defineField({ name: "description2", title: "Texte 2", type: "localeText" }),
        defineField({ name: "title2", title: "Titre 2", type: "localeString" }),
        defineField({ name: "description3", title: "Texte 3", type: "localeText" }),
        defineField({ name: "labelsRow1Image", title: "Logos labels - ligne 1 (URL)", type: "url" }),
        defineField({ name: "labelsRow2Image", title: "Logos labels - ligne 2 (URL)", type: "url" }),
      ],
    }),
    defineField({
      name: "services",
      title: "Onglet - services",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "studioService",
          fields: [
            defineField({ name: "title", title: "Titre", type: "localeString" }),
            defineField({ name: "description", title: "Description", type: "localeText" }),
            defineField({ name: "description2", title: "Description (suite, optionnel)", type: "localeText" }),
            defineField({ name: "logo", title: "Logo (URL, optionnel)", type: "url" }),
          ],
          preview: {
            select: { title: "title.fr" },
          },
        }),
      ],
    }),
    defineField({
      name: "servicesImage",
      title: "Photo - onglet services (URL)",
      type: "url",
    }),
    defineField({
      name: "gear",
      title: "Onglet - matériel",
      type: "object",
      fields: [
        defineField({ name: "monitoring", title: "Monitoring", type: "localeString" }),
        defineField({ name: "hardware", title: "Hardware", type: "localeString" }),
        defineField({ name: "converter", title: "Converter", type: "localeString" }),
        defineField({ name: "software", title: "Software", type: "localeString" }),
        defineField({
          name: "images",
          title: "Photos (URLs)",
          type: "array",
          of: [defineArrayMember({ type: "url" })],
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Page Studio" }),
  },
});
