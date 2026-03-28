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
      name: "beer",
      title: "Tilhørende øl",
      type: "reference",
      to: [{ type: "beer" }],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "style" },
  },
});
