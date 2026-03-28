import { client } from "../../sanity/lib/client";
import type { Beer, BrewLog, Recipe, Brewer } from "./types";

export async function getAllBeers(): Promise<Beer[]> {
  return client.fetch(`
    *[_type == "beer"] | order(name asc) {
      _id, name, slug, style, description, image,
      abv, ibu, srm, flavorTags, difficulty, status
    }
  `);
}

export async function getBeerBySlug(slug: string): Promise<Beer | null> {
  return client.fetch(
    `
    *[_type == "beer" && slug.current == $slug][0] {
      _id, name, slug, style, description, image,
      abv, ibu, srm, flavorTags, difficulty, status,
      recipe->{_id, name, slug, style, difficulty, batchSize},
      "brewLogs": *[_type == "brewLog" && references(^._id)] | order(date desc) {
        _id, title, slug, date
      }
    }
  `,
    { slug },
  );
}

export async function getAllBrewLogs(): Promise<BrewLog[]> {
  return client.fetch(`
    *[_type == "brewLog"] | order(date desc) {
      _id, title, slug, date, og, fg, tempNotes,
      brewers[]->{_id, name, slug, image},
      beer->{_id, name, slug, style, image}
    }
  `);
}

export async function getBrewLogBySlug(slug: string): Promise<BrewLog | null> {
  return client.fetch(
    `
    *[_type == "brewLog" && slug.current == $slug][0] {
      _id, title, slug, date, body, og, fg, tempNotes,
      brewers[]->{_id, name, slug, bio, image, role},
      beer->{_id, name, slug, style, image},
      recipe->{_id, name, slug}
    }
  `,
    { slug },
  );
}

export async function getAllRecipes(): Promise<Recipe[]> {
  return client.fetch(`
    *[_type == "recipe"] | order(name asc) {
      _id, name, slug, style, description, difficulty, batchSize,
      beer->{_id, name, slug, image}
    }
  `);
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  return client.fetch(
    `
    *[_type == "recipe" && slug.current == $slug][0] {
      _id, name, slug, style, description, difficulty, batchSize,
      grains, hops, yeast, additions, process,
      beer->{_id, name, slug, style, image}
    }
  `,
    { slug },
  );
}

export async function getAllBrewers(): Promise<Brewer[]> {
  return client.fetch(`
    *[_type == "brewer"] | order(name asc) {
      _id, name, slug, bio, image, role
    }
  `);
}

export async function getLatestBrewLog(): Promise<BrewLog | null> {
  return client.fetch(`
    *[_type == "brewLog"] | order(date desc) [0] {
      _id, title, slug, date,
      beer->{_id, name, slug, style, image}
    }
  `);
}

export async function getFeaturedBeers(): Promise<Beer[]> {
  return client.fetch(`
    *[_type == "beer" && status == "ferdig"] | order(_createdAt desc) [0...3] {
      _id, name, slug, style, image, abv, flavorTags
    }
  `);
}
