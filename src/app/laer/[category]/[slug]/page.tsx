import { notFound } from "next/navigation";
import Image from "next/image";
import { PortableTextContent } from "@/components/portable-text";
import { DiyIllustration } from "@/components/diy-illustration";
import { getArticleBySlug, getAllArticleSlugs } from "@/lib/sanity";
import { urlFor } from "../../../../../sanity/lib/client";
import type { ArticleCategory } from "@/lib/types";

export const revalidate = 60;

const validCategories = ["akademiet", "ravarefokus", "diy"] as const;
const categoryNames: Record<string, string> = {
  akademiet: "Akademiet",
  ravarefokus: "Råvarefokus",
  diy: "DIY-hjørnet",
};

export async function generateStaticParams() {
  const params: { category: string; slug: string }[] = [];
  for (const category of validCategories) {
    const slugs = await getAllArticleSlugs(category);
    for (const { slug } of slugs) {
      params.push({ category, slug });
    }
  }
  return params;
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  if (!validCategories.includes(category as ArticleCategory)) notFound();

  const article = await getArticleBySlug(category as ArticleCategory, slug);
  if (!article) notFound();

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-8">
        <p className="text-xs text-primary font-bold tracking-wider uppercase mb-2">
          {categoryNames[category] || category}
        </p>
        <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
        {article.publishedAt && (
          <p className="text-muted-foreground text-sm">
            {new Date(article.publishedAt).toLocaleDateString("no", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}

        {article.author && (
          <div className="flex items-center gap-3 mt-4">
            {article.author.image && (
              <Image
                src={urlFor(article.author.image).width(40).height(40).url()}
                alt={article.author.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <div>
              <p className="text-sm font-medium">{article.author.name}</p>
              {article.author.role && (
                <p className="text-xs text-muted-foreground">{article.author.role}</p>
              )}
            </div>
          </div>
        )}

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {article.tags.map((tag) => (
              <span key={tag} className="text-xs bg-secondary px-2 py-1 rounded">{tag}</span>
            ))}
          </div>
        )}
      </header>

      {/* DIY illustration — shown before article body */}
      {category === "diy" && <DiyIllustration slug={slug} />}

      {article.body && (
        <div className="prose-invert max-w-none">
          <PortableTextContent value={article.body} />
        </div>
      )}
    </article>
  );
}
