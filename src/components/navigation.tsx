"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const brewingLinks = [
  { href: "/bryggelogg", label: "Bryggelogg" },
  { href: "/oppskrifter", label: "Oppskriftsarkiv" },
  { href: "/bryggelaben", label: "Bryggelaben" },
];

const learnLinks = [
  { href: "/laer/akademiet", label: "Akademiet" },
  { href: "/laer/ravarefokus", label: "Råvarefokus" },
  { href: "/laer/diy", label: "DIY-hjørnet" },
];

const toolsLinks = [
  { href: "/verktoy/kalkulatorer", label: "Kalkulatorer" },
  { href: "/verktoy/oppskriftsgenerator", label: "AI Oppskriftsgenerator" },
  { href: "/verktoy/smaksassistent", label: "Smaksassistenten" },
];

const navItems = [
  { href: "/ol", label: "Øl" },
  {
    label: "Brygging",
    children: brewingLinks,
  },
  {
    label: "Lær",
    children: learnLinks,
  },
  {
    label: "Verktøy",
    children: toolsLinks,
  },
  { href: "/om-oss", label: "Om oss" },
];

function DesktopDropdown({
  label,
  children,
}: {
  label: string;
  children: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1 text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors">
        {label.toUpperCase()}
        <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <div className="absolute top-full left-0 pt-2 z-50">
          <div className="bg-card border border-border rounded-md py-2 min-w-[180px] shadow-lg">
            {children.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Uranus Garage"
            width={180}
            height={40}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) =>
            "children" in item && item.children ? (
              <DesktopDropdown
                key={item.label}
                label={item.label}
                children={item.children}
              />
            ) : (
              <Link
                key={item.href}
                href={item.href!}
                className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label.toUpperCase()}
              </Link>
            ),
          )}
        </div>

        {/* Mobile nav */}
        <Sheet>
          <SheetTrigger
            className="md:hidden"
            render={
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            }
          />
          <SheetContent side="right" className="bg-card w-72">
            <div className="flex flex-col gap-4 mt-8">
              {navItems.map((item) =>
                "children" in item && item.children ? (
                  <div key={item.label}>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                      {item.label}
                    </p>
                    {item.children.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block py-2 pl-4 text-foreground hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href!}
                    className="py-2 text-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
