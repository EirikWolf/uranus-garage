import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { urlFor } from "../../sanity/lib/client";
import type { Article } from "@/lib/types";

const categoryPaths: Record<string, string> = {
  akademiet: "akademiet",
  ravarefokus: "ravarefokus",
  diy: "diy",
};

function ArticleThumb({ slug }: { slug: string }) {
  // Try to load a thumbnail SVG — falls back gracefully if missing
  const src = `/articles/thumbs/${slug}.svg`;
  return (
    <div className="w-full h-32 rounded-t-lg overflow-hidden bg-secondary flex items-center justify-center">
      <Image
        src={src}
        alt=""
        width={200}
        height={140}
        className="w-full h-full object-cover"
        onError={() => {}} // Silently fail if thumbnail doesn't exist
      />
    </div>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  const path = categoryPaths[article.category] || article.category;
  return (
    <Link href={`/laer/${path}/${article.slug.current}`}>
      <Card className="bg-card hover:bg-accent transition-colors h-full overflow-hidden">
        <ArticleThumb slug={article.slug.current} />
        <CardContent className="pt-4">
          <h3 className="font-bold text-lg mb-1">{article.title}</h3>
          {article.publishedAt && (
            <p className="text-xs text-muted-foreground mb-2">
              {new Date(article.publishedAt).toLocaleDateString("no")}
            </p>
          )}
          {article.seoDescription && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {article.seoDescription}
            </p>
          )}
          {article.author && (
            <div className="flex items-center gap-2 mt-3">
              {article.author.image && (
                <Image
                  src={urlFor(article.author.image).width(24).height(24).url()}
                  alt={article.author.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
              <span className="text-xs text-muted-foreground">{article.author.name}</span>
            </div>
          )}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {article.tags.map((tag) => (
                <span key={tag} className="text-xs bg-secondary px-2 py-0.5 rounded">{tag}</span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
