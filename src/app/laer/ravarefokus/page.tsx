import { getArticlesByCategory } from "@/lib/sanity";
import { ArticleCard } from "@/components/article-card";

export const revalidate = 60;

export const metadata = {
  title: "Råvarefokus — Uranus Garage",
  description: "Månedens humle, malt og råvarer. Dybdeartikler om profil og bruksområder.",
};

export default async function RavarefokusPage() {
  const articles = await getArticlesByCategory("ravarefokus");

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Råvarefokus</h1>
      <p className="text-muted-foreground mb-8">
        Månedens humle og malt — profil, bruksområder og anbefalte stiler.
      </p>
      {articles.length === 0 ? (
        <p className="text-muted-foreground">Ingen artikler ennå. Kom tilbake snart!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
