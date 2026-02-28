/* eslint-disable @next/next/no-img-element */
"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Markdown from "react-markdown";

function ProjectImage({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return <div className="w-full h-48 bg-muted" />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-48 object-cover"
      onError={() => setImageError(true)}
    />
  );
}

interface Props {
  title: string;
  href?: string;
  caseStudySlug?: string;
  onCaseStudyClick?: (slug: string) => void;
  description: string;
  dates: string;
  tags: readonly string[];
  link?: string;
  image?: string;
  video?: string;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  className?: string;
}

export function ProjectCard({
  title,
  href,
  caseStudySlug,
  onCaseStudyClick,
  description,
  dates,
  tags,
  link,
  image,
  video,
  links,
  className,
}: Props) {
  const mainHref = href || "#";
  const hasCaseStudy = !!caseStudySlug && !!onCaseStudyClick;

  const handleCardClick = (e: React.MouseEvent) => {
    if (hasCaseStudy && caseStudySlug) {
      onCaseStudyClick(caseStudySlug);
    } else if (mainHref !== "#") {
      window.open(mainHref, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick(e as unknown as React.MouseEvent);
        }
      }}
      className={cn(
        "flex flex-col h-full border border-border rounded-xl overflow-hidden hover:ring-2 cursor-pointer hover:ring-muted transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      aria-label={hasCaseStudy ? `View ${title} case study` : `Open ${title}`}
    >
      <div className="relative shrink-0">
        {video ? (
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-48 object-cover"
          />
        ) : image ? (
          <ProjectImage src={image} alt={title} />
        ) : (
          <div className="w-full h-48 bg-muted" />
        )}
        {links && links.length > 0 && (
          <div
            className="absolute top-2 right-2 flex flex-wrap gap-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {links.map((link, idx) => (
              <Link
                href={link.href}
                key={idx}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge
                  className="flex items-center gap-1.5 text-xs bg-black text-white hover:bg-black/90"
                  variant="default"
                >
                  {link.icon}
                  {link.type}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold">{title}</h3>
            <time className="text-xs text-muted-foreground">{dates}</time>
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />
        </div>
        <div className="text-xs flex-1 prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
          <Markdown>{description}</Markdown>
        </div>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {tags.map((tag) => (
              <Badge
                key={tag}
                className="text-[11px] font-medium border border-border h-6 w-fit px-2"
                variant="outline"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
