interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

const events: TimelineEvent[] = [
  { year: "2020", title: "Garasjen åpner", description: "Første brygg i garasjen. Starten på Uranus Garage." },
  { year: "2021", title: "Oppskriftene vokser", description: "Eksperimentering med IPA-er og belgiske stiler." },
  { year: "2022", title: "Flere bryggere", description: "Teamet utvides. Faste bryggekvelder etableres." },
  { year: "2023", title: "Bryggeloggen starter", description: "Dokumentering av hver eneste bryggesesjon begynner." },
  { year: "2024", title: "Utstyr-upgrade", description: "Ny gryte, fermentor, og temperaturstyring." },
  { year: "2025", title: "Community vokser", description: "Smakskvelder og events. Deling av oppskrifter." },
  { year: "2026", title: "Ny nettside", description: "Uranus Garage får sitt eget digitale hjem." },
];

export function Timeline() {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
      <div className="space-y-8">
        {events.map((event) => (
          <div key={event.year} className="relative pl-12">
            <div className="absolute left-2.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
            <p className="text-xs text-primary font-bold tracking-wider">{event.year}</p>
            <h3 className="font-semibold mt-1">{event.title}</h3>
            <p className="text-sm text-muted-foreground">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
