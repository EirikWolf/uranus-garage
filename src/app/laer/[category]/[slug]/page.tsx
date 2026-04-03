import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortableTextContent } from "@/components/portable-text";
import { ArticleIllustration } from "@/components/article-illustration";
import { ArticleComments } from "@/components/article-comments";
import { getArticleBySlug, getAllArticleSlugs, getRelatedArticles } from "@/lib/sanity";
import { urlFor } from "../../../../../sanity/lib/client";
import { auth } from "@/lib/auth";
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

  const [related, session] = await Promise.all([
    getRelatedArticles(slug, article.tags ?? [], category as ArticleCategory),
    auth(),
  ]);

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-8">
        <p className="text-xs text-primary font-bold tracking-wider uppercase mb-2">
          {categoryNames[category] || category}
        </p>
        <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {article.publishedAt && (
            <span>
              {new Date(article.publishedAt).toLocaleDateString("no", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
          {article.readTimeMinutes != null && article.readTimeMinutes > 0 && (
            <>
              <span>·</span>
              <span>{article.readTimeMinutes} min lesetid</span>
            </>
          )}
        </div>

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

      {/* Article illustration */}
      <ArticleIllustration category={category} slug={slug} />

      {article.body && (
        <div className="prose-invert max-w-none">
          <PortableTextContent value={article.body} />
        </div>
      )}

      {/* Related articles */}
      {related.length > 0 && (
        <section className="mt-12 pt-8 border-t border-border">
          <h2 className="text-xl font-bold mb-4">Les videre</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((a) => (
              <Link
                key={a._id}
                href={`/laer/${a.category}/${a.slug.current}`}
                className="group block rounded-lg border border-border bg-card p-4 hover:bg-accent transition-colors"
              >
                <p className="text-xs text-primary font-bold tracking-wider uppercase mb-1">
                  {categoryNames[a.category] || a.category}
                </p>
                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors leading-snug">
                  {a.title}
                </h3>
                {a.seoDescription && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.seoDescription}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Comments */}
      <ArticleComments
        articleId={article._id}
        currentUserId={session?.user?.id ?? null}
      />
    </article>
  );
}
