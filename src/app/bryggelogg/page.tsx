import { getAllBrewLogs } from "@/lib/sanity";
import { BrewLogCard } from "@/components/brew-log-card";

export const revalidate = 60;

export const metadata = {
  title: "Bryggelogg — Uranus Garage",
  description: "Bryggelogger fra Uranus Garage — våre bryggesesjoner dokumentert.",
};

export default async function BrewLogListPage() {
  const logs = await getAllBrewLogs();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Bryggelogg</h1>
      <p className="text-muted-foreground mb-8">
        Våre bryggesesjoner, dokumentert fra mashing til tapping.
      </p>
      {logs.length === 0 ? (
        <p className="text-muted-foreground">Ingen bryggelogger ennå.</p>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <BrewLogCard key={log._id} log={log} />
          ))}
        </div>
      )}
    </div>
  );
}
