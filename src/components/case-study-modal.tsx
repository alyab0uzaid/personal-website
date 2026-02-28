"use client";

import { createPortal } from "react-dom";
import { motion } from "motion/react";
import BlurFade from "@/components/magicui/blur-fade";
import { MDXContent } from "@content-collections/mdx/react";
import { mdxComponents } from "@/mdx-components";
import { formatDate } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useCallback, useEffect } from "react";

const BLUR_FADE_DELAY = 0.04;

interface CaseStudyModalProps {
  slug: string;
  title: string;
  publishedAt: string;
  mdxCode: string;
  heroMedia?: string;
  logo?: string;
  previousSlug: string | null;
  previousTitle: string | null;
  nextSlug: string | null;
  nextTitle: string | null;
  onClose: () => void;
  onOpenSlug: (slug: string) => void;
}

export function CaseStudyModal({
  title,
  publishedAt,
  mdxCode,
  heroMedia,
  logo,
  previousSlug,
  previousTitle,
  nextSlug,
  nextTitle,
  onClose,
  onOpenSlug,
}: CaseStudyModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const closeModal = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
  }, [isClosing]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeModal]);

  const handleAnimationEnd = useCallback(
    (e: React.AnimationEvent) => {
      if (e.animationName === "modal-drop-out") {
        onClose();
      }
    },
    [onClose]
  );

  const modalContent = (
    <>
      <motion.div
        className="fixed inset-0 z-[49] bg-black/10 cursor-pointer"
        onClick={closeModal}
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={{
          duration: isClosing ? 0.2 : 0.4,
          ease: isClosing ? "easeIn" : "easeOut",
        }}
      />

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={closeModal}
      >
        <div
          className={`pointer-events-auto w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-background border border-border rounded-xl shadow-lg ${
            isClosing
              ? "animate-[modal-drop-out_0.2s_ease-in_forwards]"
              : "animate-[modal-drop-in_0.4s_ease-out]"
          }`}
          role="dialog"
          aria-modal
          aria-labelledby="modal-title"
          onAnimationEnd={handleAnimationEnd}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 id="modal-title" className="sr-only">
            {title}
          </h2>
          <BlurFade delay={BLUR_FADE_DELAY} className="overflow-hidden">
            <div className="p-6 max-w-2xl mx-auto">
              <div className="flex flex-col gap-4">
                {logo && (
                  <BlurFade delay={BLUR_FADE_DELAY * 2}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo}
                      alt=""
                      className="w-16 h-16 object-contain self-start drop-shadow-md"
                    />
                  </BlurFade>
                )}
                <BlurFade delay={BLUR_FADE_DELAY * 3}>
                  <h1 className="title font-semibold text-3xl md:text-4xl tracking-tighter leading-tight">
                    {title}
                  </h1>
                </BlurFade>
                <BlurFade delay={BLUR_FADE_DELAY * 4}>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(publishedAt)}
                  </p>
                </BlurFade>
              </div>
              <div className="my-6 flex w-full items-center">
                <div
                  className="flex-1 h-px bg-border"
                  style={{
                    maskImage:
                      "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
                    WebkitMaskImage:
                      "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
                  }}
                />
              </div>
              {heroMedia && (
                <BlurFade delay={BLUR_FADE_DELAY * 5}>
                  <div className="mb-6 rounded-xl overflow-hidden border border-border w-full aspect-video max-h-[400px] bg-muted">
                    {heroMedia.match(/\.(mp4|webm|mov)(\?|$)/i) ? (
                      <video
                        src={heroMedia}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={heroMedia}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </BlurFade>
              )}
              <BlurFade delay={BLUR_FADE_DELAY * 6}>
                <article className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
                  <MDXContent code={mdxCode} components={mdxComponents} />
                </article>
              </BlurFade>
              <nav className="mt-12 pt-8 pb-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  {previousSlug && previousTitle ? (
                    <button
                      type="button"
                      onClick={() => onOpenSlug(previousSlug)}
                      className="group flex-1 flex flex-col gap-1 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors text-left"
                    >
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ChevronLeft className="size-3" />
                        Previous
                      </span>
                      <span className="text-sm font-medium group-hover:text-foreground transition-colors whitespace-normal wrap-break-word">
                        {previousTitle}
                      </span>
                    </button>
                  ) : (
                    <div className="hidden sm:block flex-1" />
                  )}
                  {nextSlug && nextTitle ? (
                    <button
                      type="button"
                      onClick={() => onOpenSlug(nextSlug)}
                      className="group flex-1 flex flex-col gap-1 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors text-right"
                    >
                      <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                        Next
                        <ChevronRight className="size-3" />
                      </span>
                      <span className="text-sm font-medium group-hover:text-foreground transition-colors whitespace-normal wrap-break-word">
                        {nextTitle}
                      </span>
                    </button>
                  ) : (
                    <div className="hidden sm:block flex-1" />
                  )}
                </div>
              </nav>
            </div>
          </BlurFade>
        </div>
      </div>
    </>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
}
