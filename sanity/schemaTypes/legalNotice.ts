import { defineType, defineField } from "sanity";

export const legalNotice = defineType({
  name: "legalNotice",
  title: "Mentions légales",
  type: "document",
  fields: [
    defineField({
      name: "website",
      title: "Site web",
      type: "object",
      fields: [
        defineField({ name: "creditsDesign", title: "Crédits design", type: "localeString" }),
        defineField({ name: "webHosting", title: "Hébergement web", type: "localeString" }),
        defineField({ name: "creditsDevelopmentAuthor", title: "Crédits développement", type: "localeString" }),
        defineField({ name: "creditsPhotographyAuthor", title: "Crédits photographie", type: "localeString" }),
      ],
    }),
    defineField({
      name: "masteredByEdouard",
      title: "Mastered by Edouard",
      type: "object",
      fields: [
        defineField({ name: "companyName", title: "Nom / forme juridique", type: "localeString" }),
        defineField({ name: "startCapital", title: "Capital social", type: "localeString" }),
        defineField({ name: "siretNumber", title: "Numéro SIRET", type: "localeString" }),
        defineField({ name: "vatNumber", title: "Numéro de TVA", type: "localeString" }),
        defineField({ name: "rcsNumber", title: "Numéro RCS", type: "localeString" }),
        defineField({ name: "companyManager", title: "Dirigeant", type: "localeString" }),
        defineField({ name: "contactTitle", title: "Titre contact", type: "localeString" }),
      ],
    }),
    defineField({
      name: "thanks",
      title: "Remerciements",
      type: "object",
      fields: [
        defineField({ name: "description1", title: "Texte 1", type: "localeText" }),
        defineField({ name: "description2", title: "Texte 2", type: "localeText" }),
        defineField({ name: "thankYou", title: "Merci !", type: "localeString" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Mentions légales" }),
  },
});
