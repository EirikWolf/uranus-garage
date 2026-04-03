import { defineField, defineType, defineArrayMember } from "sanity";

export const recipe = defineType({
  name: "recipe",
  title: "Oppskrift",
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
    defineField({ name: "style", title: "Ølstil", type: "string" }),
    defineField({ name: "description", title: "Beskrivelse", type: "text", rows: 3 }),
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
      name: "batchSize",
      title: "Batchstørrelse (liter)",
      type: "number",
      initialValue: 20,
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "grains",
      title: "Malt",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Navn", type: "string" }),
            defineField({ name: "amount", title: "Mengde", type: "number" }),
            defineField({
              name: "unit",
              title: "Enhet",
              type: "string",
              options: { list: ["kg", "g"] },
              initialValue: "kg",
            }),
          ],
          preview: {
            select: { name: "name", amount: "amount", unit: "unit" },
            prepare({ name, amount, unit }) {
              return { title: `${name} — ${amount} ${unit}` };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "hops",
      title: "Humle",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Navn", type: "string" }),
            defineField({ name: "amount", title: "Mengde (g)", type: "number" }),
            defineField({ name: "time", title: "Tid (min)", type: "number" }),
            defineField({ name: "alphaAcid", title: "Alfa-syre (%)", type: "number" }),
          ],
          preview: {
            select: { name: "name", amount: "amount", time: "time" },
            prepare({ name, amount, time }) {
              return { title: `${name} — ${amount}g @ ${time} min` };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "yeast",
      title: "Gjær",
      type: "object",
      fields: [
        defineField({ name: "name", title: "Navn", type: "string" }),
        defineField({ name: "amount", title: "Mengde", type: "string" }),
        defineField({ name: "type", title: "Type", type: "string" }),
      ],
    }),
    defineField({
      name: "additions",
      title: "Tilsetninger",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Navn", type: "string" }),
            defineField({ name: "amount", title: "Mengde", type: "string" }),
            defineField({ name: "time", title: "Tid (min)", type: "number" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "process",
      title: "Prosess",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "step", title: "Steg", type: "string" }),
            defineField({ name: "description", title: "Beskrivelse", type: "text", rows: 2 }),
            defineField({ name: "temp", title: "Temperatur (°C)", type: "number" }),
            defineField({ name: "duration", title: "Varighet (min)", type: "number" }),
          ],
          preview: {
            select: { step: "step", temp: "temp", duration: "duration" },
            prepare({ step, temp, duration }) {
              return { title: step, subtitle: `${temp}°C — ${duration} min` };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "waterProfile",
      title: "Vannprofil",
      type: "object",
      fields: [
        defineField({ name: "calcium", title: "Kalsium Ca²⁺ (ppm)", type: "number" }),
        defineField({ name: "magnesium", title: "Magnesium Mg²⁺ (ppm)", type: "number" }),
        defineField({ name: "sodium", title: "Natrium Na⁺ (ppm)", type: "number" }),
        defineField({ name: "chloride", title: "Klorid Cl⁻ (ppm)", type: "number" }),
        defineField({ name: "sulfate", title: "Sulfat SO₄²⁻ (ppm)", type: "number" }),
        defineField({ name: "bicarbonate", title: "Bikarbonat HCO₃⁻ (ppm)", type: "number" }),
        defineField({ name: "ph", title: "Meskevann pH", type: "number" }),
        defineField({ name: "notes", title: "Merknad", type: "string" }),
      ],
    }),
    defineField({
      name: "fermentationProfile",
      title: "Gjæringsprofil",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "day", title: "Dag", type: "number" }),
            defineField({ name: "temp", title: "Temperatur (°C)", type: "number" }),
            defineField({ name: "description", title: "Beskrivelse", type: "string" }),
          ],
          preview: {
            select: { day: "day", temp: "temp", description: "description" },
            prepare({ day, temp, description }) {
              return { title: `Dag ${day}: ${temp}°C`, subtitle: description };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "beer",
      title: "Tilhørende øl",
      type: "reference",
      to: [{ type: "beer" }],
    }),
    defineField({
      name: "isClassic",
      title: "Klassiker-oppskrift",
      type: "boolean",
      description: "Er dette en klassiker/inspirasjonsoppskrift?",
      initialValue: false,
    }),
    defineField({
      name: "sourceAuthor",
      title: "Kilde — Forfatter",
      type: "string",
      description: "F.eks: Jamil Zainasheff, Charlie Papazian",
      hidden: ({ document }) => !document?.isClassic,
    }),
    defineField({
      name: "sourceBook",
      title: "Kilde — Bok/Publikasjon",
      type: "string",
      description: "F.eks: Brewing Classic Styles, The Complete Joy of Homebrewing",
      hidden: ({ document }) => !document?.isClassic,
    }),
    defineField({
      name: "sourceUrl",
      title: "Kilde — URL",
      type: "url",
      description: "Lenke til original kilde (valgfritt)",
      hidden: ({ document }) => !document?.isClassic,
    }),
    defineField({
      name: "sourceNote",
      title: "Kilde — Merknad",
      type: "text",
      rows: 2,
      description: "Ekstra info om kreditering, f.eks. 'Tilpasset for 20L batch'",
      hidden: ({ document }) => !document?.isClassic,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "style", isClassic: "isClassic" },
    prepare({ title, subtitle, isClassic }) {
      return {
        title: `${isClassic ? "⭐ " : ""}${title}`,
        subtitle: `${subtitle || ""}${isClassic ? " — Klassiker" : ""}`,
      };
    },
  },
});
