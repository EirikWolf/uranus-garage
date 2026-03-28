import { defineField, defineType, defineArrayMember } from "sanity";

export const brewLabEntry = defineType({
  name: "brewLabEntry",
  title: "Bryggelab-data",
  type: "document",
  fields: [
    defineField({
      name: "brewLog",
      title: "Tilhørende bryggelogg",
      type: "reference",
      to: [{ type: "brewLog" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "measurements",
      title: "Målinger",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "timestamp", title: "Tidspunkt", type: "datetime" }),
            defineField({
              name: "type",
              title: "Type",
              type: "string",
              options: {
                list: [
                  { title: "Temperatur", value: "temperature" },
                  { title: "Gravity", value: "gravity" },
                  { title: "pH", value: "ph" },
                ],
              },
            }),
            defineField({ name: "value", title: "Verdi", type: "number" }),
            defineField({ name: "unit", title: "Enhet", type: "string" }),
          ],
          preview: {
            select: { type: "type", value: "value", unit: "unit", timestamp: "timestamp" },
            prepare({ type, value, unit, timestamp }) {
              return {
                title: `${type}: ${value} ${unit || ""}`,
                subtitle: timestamp ? new Date(timestamp).toLocaleString("no") : "",
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { brewLogTitle: "brewLog.title" },
    prepare({ brewLogTitle }) {
      return { title: `Lab-data: ${brewLogTitle || "Ukjent brygg"}` };
    },
  },
});
