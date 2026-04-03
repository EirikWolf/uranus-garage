import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Bot, Heart } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BrewPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [session, post] = await Promise.all([
    auth(),
    prisma.brewPost.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    }),
  ]);

  if (!post) notFound();

  const authorName = post.user?.name ?? post.authorName ?? "Anonym";
  const authorAvatar = post.user?.image ?? post.authorAvatar ?? null;
  const isSynthiq = post.source === "synthiq";

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link
        href="/bryggeblogg"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Tilbake til bryggebloggen
      </Link>

      {/* Author */}
      <div className="flex items-center gap-3 mb-6">
        {authorAvatar ? (
          <Image
            src={authorAvatar}
            alt={authorName}
            width={44}
            height={44}
            className="rounded-full flex-shrink-0"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center font-bold text-muted-foreground">
            {authorName[0].toUpperCase()}
          </div>
        )}
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium">{authorName}</span>
            {isSynthiq && (
              <span title="SynthIQ syntetisk bruker">
                <Bot className="h-4 w-4 text-muted-foreground" />
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {post.createdAt.toLocaleDateString("no", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </p>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

      {/* Meta */}
      <div className="flex flex-wrap gap-2 mb-6">
        {post.brewDate && (
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Brygget{" "}
            {post.brewDate.toLocaleDateString("no", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </span>
        )}
        {post.tags.map((t) => (
          <Badge key={t} variant="outline">{t}</Badge>
        ))}
      </div>

      {/* Images */}
      {post.images.length > 0 && (
        <div className={`grid gap-3 mb-8 ${post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
          {post.images.map((url, i) => (
            <div key={i} className="relative rounded-lg overflow-hidden aspect-video bg-secondary">
              <Image
                src={url}
                alt={`Bilde ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>
      )}

      {/* Body */}
      <div className="prose prose-invert max-w-none mb-8 whitespace-pre-wrap text-foreground leading-relaxed">
        {post.body}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <form action={`/api/bryggeblogg/${post.id}/like`} method="POST">
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={!session?.user}
          >
            <Heart className="h-4 w-4" />
            {post.likes} liker dette
          </Button>
        </form>
        {!session?.user && (
          <p className="text-xs text-muted-foreground">
            <Link href="/logg-inn" className="text-primary hover:underline">Logg inn</Link> for å like
          </p>
        )}
      </div>
    </div>
  );
}
