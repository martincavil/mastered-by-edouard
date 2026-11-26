import { defineType, defineField } from "sanity";

export const artist = defineType({
  name: "artist",
  title: "Artiste",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nom", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "picture",
      title: "Photo au survol (URL Dropbox)",
      type: "url",
      description: "URL d'image (ex: lien Dropbox direct). Laisser vide si pas de photo.",
    }),
    defineField({ name: "link", title: "Lien (ex: Qobuz)", type: "url" }),
    defineField({
      name: "order",
      title: "Ordre",
      type: "number",
      description: "Ordre d'affichage dans le name dropping sur /listen",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "featured",
      title: "Affiché en image (constellation)",
      type: "boolean",
      // Not used since the /listen redesign: every artist is in the name drop
      hidden: true,
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Ordre",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "order" },
    prepare: ({ title, subtitle }) => ({ title, subtitle: `#${subtitle}` }),
  },
});
