import { defineField, defineType } from "sanity";

export const brewLog = defineType({
  name: "brewLog",
  title: "Bryggelogg",
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
      name: "date",
      title: "Bryggedato",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "brewers",
      title: "Deltakere",
      type: "array",
      of: [{ type: "reference", to: [{ type: "brewer" }] }],
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
      name: "og",
      title: "Original Gravity (OG)",
      type: "number",
      validation: (rule) => rule.min(0.99).max(1.2),
    }),
    defineField({
      name: "fg",
      title: "Final Gravity (FG)",
      type: "number",
      validation: (rule) => rule.min(0.99).max(1.1),
    }),
    defineField({
      name: "tempNotes",
      title: "Temperatur-notater",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "beer",
      title: "Tilhørende øl",
      type: "reference",
      to: [{ type: "beer" }],
    }),
    defineField({
      name: "recipe",
      title: "Brukt oppskrift",
      type: "reference",
      to: [{ type: "recipe" }],
    }),
  ],
  orderings: [
    {
      title: "Bryggedato (nyeste først)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", date: "date" },
    prepare({ title, date }) {
      return { title, subtitle: date };
    },
  },
});
