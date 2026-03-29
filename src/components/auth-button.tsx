"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { LogIn, LogOut, User } from "lucide-react";
import { useTranslations } from "next-intl";

export function AuthButton() {
  const { data: session, status } = useSession();
  const t = useTranslations("nav");

  if (status === "loading") {
    return <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />;
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn()}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
      >
        <LogIn className="h-4 w-4" />
        {t("login")}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/profil" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        {session.user?.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || t("profile")}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
      </Link>
      <button
        onClick={() => signOut()}
        className="text-muted-foreground hover:text-foreground transition-colors"
        title={t("logout")}
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
