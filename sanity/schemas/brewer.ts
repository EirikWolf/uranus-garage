import { defineField, defineType } from "sanity";

export const brewer = defineType({
  name: "brewer",
  title: "Brygger",
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
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "image",
      title: "Profilbilde",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "role",
      title: "Rolle",
      type: "string",
      description: "Rolle i garasjen",
    }),
  ],
  preview: {
    select: { title: "name", media: "image" },
  },
});
