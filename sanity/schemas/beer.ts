import { defineField, defineType } from "sanity";

export const beer = defineType({
  name: "beer",
  title: "Øl",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Navn",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "style",
      title: "Ølstil",
      type: "string",
      options: {
        list: [
          "IPA", "Pale Ale", "Stout", "Porter", "Lager", "Pilsner",
          "Wheat", "Sour", "Belgian", "Brown Ale", "Red Ale", "Saison", "Annet",
        ],
      },
    }),
    defineField({
      name: "description",
      title: "Beskrivelse",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "image",
      title: "Bilde/Etikett",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "abv",
      title: "ABV (%)",
      type: "number",
      validation: (rule) => rule.min(0).max(30),
    }),
    defineField({
      name: "ibu",
      title: "IBU",
      type: "number",
      validation: (rule) => rule.min(0).max(200),
    }),
    defineField({
      name: "srm",
      title: "SRM",
      type: "number",
      validation: (rule) => rule.min(1).max(40),
    }),
    defineField({
      name: "flavorTags",
      title: "Smaksprofil",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "difficulty",
      title: "Vanskelighetsgrad",
      type: "string",
      options: {
        list: [
          { title: "Nybegynner (Kit)", value: "nybegynner" },
          { title: "Middels", value: "middels" },
          { title: "Avansert", value: "avansert" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Planlagt", value: "planlagt" },
          { title: "Gjærer", value: "gjaerer" },
          { title: "Ferdig", value: "ferdig" },
          { title: "Arkivert", value: "arkivert" },
        ],
        layout: "radio",
      },
      initialValue: "planlagt",
    }),
    defineField({
      name: "recipe",
      title: "Oppskrift",
      type: "reference",
      to: [{ type: "recipe" }],
    }),
    defineField({
      name: "brewLogs",
      title: "Bryggelogger",
      type: "array",
      of: [{ type: "reference", to: [{ type: "brewLog" }] }],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "style", media: "image" },
  },
});
