import type { StructureResolver } from "sanity/structure";

const SINGLETONS = [
  { id: "studioPage", title: "Page Studio" },
  { id: "termsAndConditions", title: "Conditions générales" },
  { id: "legalNotice", title: "Mentions légales" },
  { id: "faq", title: "FAQ" },
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenu")
    .items([
      S.listItem()
        .title("Artistes")
        .schemaType("artist")
        .child(S.documentTypeList("artist").title("Artistes")),
      S.divider(),
      ...SINGLETONS.map(({ id, title }) =>
        S.listItem()
          .title(title)
          .id(id)
          .child(S.document().schemaType(id).documentId(id).title(title)),
      ),
    ]);
