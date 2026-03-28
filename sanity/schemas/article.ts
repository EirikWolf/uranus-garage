import { defineField, defineType } from "sanity";

export const article = defineType({
  name: "article",
  title: "Artikkel",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      options: {
        list: [
          { title: "Akademiet", value: "akademiet" },
          { title: "Råvarefokus", value: "ravarefokus" },
          { title: "DIY-hjørnet", value: "diy" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Publiseringsdato",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "author",
      title: "Forfatter",
      type: "reference",
      to: [{ type: "brewer" }],
    }),
    defineField({
      name: "body",
      title: "Innhold",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt-tekst", type: "string" }),
          ],
        },
      ],
    }),
    defineField({
      name: "tags",
      title: "Emneknagger",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "seoDescription",
      title: "SEO-beskrivelse",
      type: "text",
      rows: 2,
      description: "Kort beskrivelse for søkemotorer (maks 160 tegn)",
    }),
  ],
  orderings: [
    {
      title: "Publiseringsdato (nyeste først)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", category: "category", date: "publishedAt" },
    prepare({ title, category, date }) {
      const categoryMap: Record<string, string> = {
        akademiet: "Akademiet",
        ravarefokus: "Råvarefokus",
        diy: "DIY-hjørnet",
      };
      return {
        title,
        subtitle: `${categoryMap[category] || category} — ${date ? new Date(date).toLocaleDateString("no") : "Ikke publisert"}`,
      };
    },
  },
});
