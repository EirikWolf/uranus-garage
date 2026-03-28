import Image from "next/image";
import { NewsletterForm } from "./newsletter-form";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <Image
              src="/logo.svg"
              alt="Uranus Garage"
              width={150}
              height={35}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Great beer and no cars!
            </p>
          </div>

          <div>
            <p className="text-sm font-medium mb-3">Nyhetsbrev</p>
            <NewsletterForm />
          </div>

          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Uranus Garage
          </div>
        </div>
      </div>
    </footer>
  );
}
