import { client, SANITY_REVALIDATE } from "../../sanity/lib/client";
import type { Beer, BrewLog, Recipe, Brewer, Article, ArticleCategory, BrewLabEntry } from "./types";

const revalidate = { next: { revalidate: SANITY_REVALIDATE } };

export async function getAllBeers(): Promise<Beer[]> {
  return client.fetch(
    `*[_type == "beer"] | order(name asc) {
      _id, name, slug, style, description, image,
      abv, ibu, srm, flavorTags, difficulty, status
    }`,
    {},
    revalidate,
  );
}

export async function getBeerBySlug(slug: string): Promise<Beer | null> {
  return client.fetch(
    `*[_type == "beer" && slug.current == $slug][0] {
      _id, name, slug, style, description, image,
      abv, ibu, srm, flavorTags, difficulty, status,
      recipe->{
        _id, name, slug, style, difficulty, batchSize,
        grains[]{ name, amount, unit },
        hops[]{ name, amount, time, alphaAcid },
        yeast{ name, amount, type },
        additions[]{ name, amount, time },
        process[]{ step, description, temp, duration },
        waterProfile{ calcium, magnesium, sodium, chloride, sulfate, bicarbonate, ph, notes },
        fermentationProfile[]{ day, temp, description }
      },
      "brewLogs": *[_type == "brewLog" && references(^._id)] | order(date desc) {
        _id, title, slug, date
      }
    }`,
    { slug },
    revalidate,
  );
}

export async function getAllBrewLogs(): Promise<BrewLog[]> {
  return client.fetch(
    `*[_type == "brewLog"] | order(date desc) {
      _id, title, slug, date, og, fg, tempNotes,
      brewers[]->{_id, name, slug, image},
      beer->{_id, name, slug, style, image}
    }`,
    {},
    revalidate,
  );
}

export async function getBrewLogBySlug(slug: string): Promise<BrewLog | null> {
  return client.fetch(
    `*[_type == "brewLog" && slug.current == $slug][0] {
      _id, title, slug, date, body, og, fg, tempNotes,
      brewers[]->{_id, name, slug, bio, image, role},
      beer->{_id, name, slug, style, image},
      recipe->{_id, name, slug}
    }`,
    { slug },
    revalidate,
  );
}

export async function getAllRecipes(): Promise<Recipe[]> {
  return client.fetch(
    `*[_type == "recipe"] | order(name asc) {
      _id, name, slug, style, description, difficulty, batchSize,
      isClassic, sourceAuthor,
      beer->{_id, name, slug, image}
    }`,
    {},
    revalidate,
  );
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  return client.fetch(
    `*[_type == "recipe" && slug.current == $slug][0] {
      _id, name, slug, style, description, difficulty, batchSize,
      grains, hops, yeast, additions, process,
      isClassic, sourceAuthor, sourceBook, sourceUrl, sourceNote,
      beer->{_id, name, slug, style, image}
    }`,
    { slug },
    revalidate,
  );
}

export async function getAllBrewers(): Promise<Brewer[]> {
  return client.fetch(
    `*[_type == "brewer"] | order(name asc) {
      _id, name, slug, bio, image, role
    }`,
    {},
    revalidate,
  );
}

export async function getLatestBrewLog(): Promise<BrewLog | null> {
  return client.fetch(
    `*[_type == "brewLog"] | order(date desc) [0] {
      _id, title, slug, date,
      beer->{_id, name, slug, style, image}
    }`,
    {},
    revalidate,
  );
}

export async function getFeaturedBeers(): Promise<Beer[]> {
  return client.fetch(
    `*[_type == "beer" && status == "ferdig"] | order(_createdAt desc) [0...3] {
      _id, name, slug, style, image, abv, flavorTags
    }`,
    {},
    revalidate,
  );
}

export async function getArticlesByCategory(category: ArticleCategory): Promise<Article[]> {
  return client.fetch(
    `*[_type == "article" && category == $category] | order(publishedAt desc) {
      _id, title, slug, category, publishedAt, tags, seoDescription,
      author->{_id, name, slug, image}
    }`,
    { category },
    revalidate,
  );
}

export async function getArticleBySlug(category: ArticleCategory, slug: string): Promise<Article | null> {
  return client.fetch(
    `*[_type == "article" && category == $category && slug.current == $slug][0] {
      _id, title, slug, category, publishedAt, body, tags, seoDescription,
      author->{_id, name, slug, bio, image, role},
      "readTimeMinutes": round(length(pt::text(body)) / 1000)
    }`,
    { category, slug },
    revalidate,
  );
}

export async function getAllArticleSlugs(category: ArticleCategory): Promise<{ slug: string }[]> {
  return client.fetch(
    `*[_type == "article" && category == $category] { "slug": slug.current }`,
    { category },
    revalidate,
  );
}

export async function getRelatedArticles(
  slug: string,
  tags: string[],
  category: ArticleCategory,
): Promise<Article[]> {
  return client.fetch(
    `*[_type == "article" && slug.current != $slug && category == $category && count(tags[@ in $tags]) > 0]
    | order(publishedAt desc)[0...3] {
      _id, title, slug, category, tags, publishedAt, seoDescription,
      author->{_id, name, slug, image}
    }`,
    { slug, tags, category },
    revalidate,
  );
}

export async function getBrewLabEntries(): Promise<BrewLabEntry[]> {
  return client.fetch(
    `*[_type == "brewLabEntry"] | order(brewLog->date desc) {
      _id,
      brewLog->{_id, title, slug, date, beer->{_id, name, slug}},
      "measurementCount": count(measurements)
    }`,
    {},
    revalidate,
  );
}

export async function getBrewLabEntry(brewLogSlug: string): Promise<BrewLabEntry | null> {
  return client.fetch(
    `*[_type == "brewLabEntry" && brewLog->slug.current == $slug][0] {
      _id,
      brewLog->{_id, title, slug, date, og, fg, beer->{_id, name, slug, style}},
      measurements
    }`,
    { slug: brewLogSlug },
    revalidate,
  );
}
