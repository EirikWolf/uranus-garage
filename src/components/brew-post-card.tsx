"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, Bot } from "lucide-react";

interface PostAuthor {
  id: string;
  name: string | null;
  image: string | null;
}

export interface BrewPostData {
  id: string;
  title: string;
  body: string;
  images: string[];
  brewDate: string | null;
  tags: string[];
  source: string;
  likes: number;
  createdAt: string;
  user: PostAuthor | null;
  authorName: string | null;
  authorAvatar: string | null;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "nettopp";
  if (minutes < 60) return `${minutes}m siden`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}t siden`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d siden`;
  return new Date(dateStr).toLocaleDateString("no", { day: "numeric", month: "short", year: "numeric" });
}

export function BrewPostCard({
  post,
  currentUserId,
}: {
  post: BrewPostData;
  currentUserId?: string | null;
}) {
  const [likes, setLikes] = useState(post.likes);
  const [liking, setLiking] = useState(false);

  const authorName = post.user?.name ?? post.authorName ?? "Anonym";
  const authorAvatar = post.user?.image ?? post.authorAvatar ?? null;
  const isSynthiq = post.source === "synthiq";

  async function handleLike() {
    if (!currentUserId || liking) return;
    setLiking(true);
    try {
      const res = await fetch(`/api/bryggeblogg/${post.id}/like`, { method: "POST" });
      if (res.ok) setLikes((l) => l + 1);
    } finally {
      setLiking(false);
    }
  }

  return (
    <Card className="bg-card hover:bg-accent/30 transition-colors">
      <CardContent className="pt-5">
        {/* Author row */}
        <div className="flex items-center gap-2.5 mb-3">
          {authorAvatar ? (
            <Image
              src={authorAvatar}
              alt={authorName}
              width={36}
              height={36}
              className="rounded-full flex-shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center text-sm font-bold text-muted-foreground">
              {authorName[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium truncate">{authorName}</span>
              {isSynthiq && (
                <span title="SynthIQ-bruker">
                  <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</p>
          </div>
        </div>

        {/* Title */}
        <Link href={`/bryggeblogg/${post.id}`}>
          <h3 className="font-bold text-base hover:text-primary transition-colors mb-1">
            {post.title}
          </h3>
        </Link>

        {/* Body preview */}
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{post.body}</p>

        {/* First image thumbnail */}
        {post.images.length > 0 && (
          <div className="relative rounded-md overflow-hidden mb-3 aspect-video bg-secondary">
            <Image
              src={post.images[0]}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {post.images.length > 1 && (
              <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-xs rounded px-1.5 py-0.5">
                +{post.images.length - 1}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {post.brewDate && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(post.brewDate).toLocaleDateString("no", { day: "numeric", month: "short" })}
              </span>
            )}
            {post.tags.slice(0, 3).map((t) => (
              <Badge key={t} variant="outline" className="text-xs py-0">
                {t}
              </Badge>
            ))}
          </div>
          <button
            onClick={handleLike}
            disabled={!currentUserId || liking}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Heart className="h-3.5 w-3.5" />
            {likes}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
