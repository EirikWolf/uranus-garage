import { getArticlesByCategory } from "@/lib/sanity";
import { ArticleCard } from "@/components/article-card";

export const revalidate = 60;

export const metadata = {
  title: "Akademiet — Uranus Garage",
  description: "Guider og artikler for hjemmebryggere. Lær alt fra mesking til gjæring.",
};

export default async function AkademietPage() {
  const articles = await getArticlesByCategory("akademiet");

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Akademiet</h1>
      <p className="text-muted-foreground mb-8">
        &quot;Slik gjør du det&quot; — guider og artikler for hjemmebryggere.
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
