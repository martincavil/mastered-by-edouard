import { defineType, defineField } from "sanity";

export const termsAndConditions = defineType({
  name: "termsAndConditions",
  title: "Conditions générales",
  type: "document",
  fields: [
    defineField({
      name: "ratesPayments",
      title: "Tarifs & paiements",
      type: "object",
      fields: [
        defineField({ name: "quotationTitle", title: "Titre - devis", type: "localeString" }),
        defineField({ name: "quotationContent", title: "Contenu - devis", type: "localeText" }),
        defineField({ name: "adjustmentsTitle", title: "Titre - ajustements", type: "localeString" }),
        defineField({ name: "adjustmentsContent", title: "Contenu - ajustements", type: "localeText" }),
        defineField({ name: "paymentTitle", title: "Titre - paiement", type: "localeString" }),
        defineField({ name: "paymentContent", title: "Contenu - paiement", type: "localeText" }),
        defineField({ name: "paymentContent2", title: "Contenu - paiement (suite)", type: "localeText" }),
      ],
    }),
    defineField({
      name: "revisionsVersions",
      title: "Révisions & versions",
      type: "object",
      fields: [
        defineField({ name: "includedTitle", title: "Titre - révisions incluses", type: "localeString" }),
        defineField({ name: "includedContent", title: "Contenu - révisions incluses", type: "localeText" }),
        defineField({ name: "newMixTitle", title: "Titre - nouveau mix", type: "localeString" }),
        defineField({ name: "newMixContent", title: "Contenu - nouveau mix", type: "localeText" }),
        defineField({ name: "additionalTitle", title: "Titre - versions supplémentaires", type: "localeString" }),
        defineField({ name: "additionalContent", title: "Contenu - versions supplémentaires", type: "localeText" }),
        defineField({ name: "masterRequestsTitle", title: "Titre - masters supplémentaires", type: "localeString" }),
        defineField({ name: "masterRequestsContent", title: "Contenu - masters supplémentaires", type: "localeText" }),
      ],
    }),
    defineField({
      name: "dataFiles",
      title: "Gestion des données",
      type: "object",
      fields: [
        defineField({ name: "transferTitle", title: "Titre - transfert", type: "localeString" }),
        defineField({ name: "transferContent", title: "Contenu - transfert", type: "localeText" }),
        defineField({ name: "retentionTitle", title: "Titre - conservation", type: "localeString" }),
        defineField({ name: "retentionContent", title: "Contenu - conservation", type: "localeText" }),
        defineField({ name: "securityTitle", title: "Titre - sécurité", type: "localeString" }),
        defineField({ name: "securityContent", title: "Contenu - sécurité", type: "localeText" }),
        defineField({ name: "finalNote", title: "Note finale", type: "localeText" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Conditions générales" }),
  },
});
