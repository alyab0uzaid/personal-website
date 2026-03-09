import { allPosts } from "content-collections";
import { DATA } from "@/data/resume";

export type CaseStudyData = {
  slug: string;
  title: string;
  publishedAt: string;
  mdxCode: string;
  heroMedia?: string;
  logo?: string;
  websiteUrl?: string;
  previousSlug: string | null;
  previousTitle: string | null;
  nextSlug: string | null;
  nextTitle: string | null;
};

function getCaseStudySlugs() {
  return new Set<string>(
    DATA.projects
      .filter(
        (p): p is typeof p & { caseStudySlug: string } =>
          "caseStudySlug" in p &&
          typeof (p as { caseStudySlug?: string }).caseStudySlug === "string"
      )
      .map((p) => p.caseStudySlug)
  );
}

export function getCaseStudyDataMap(): Record<string, CaseStudyData> {
  const slugs = getCaseStudySlugs();
  const posts = [...allPosts]
    .filter((p) => slugs.has(p._meta.path.replace(/\.mdx$/, "")))
    .sort((a, b) =>
      new Date(a.publishedAt) > new Date(b.publishedAt) ? -1 : 1
    );

  const map: Record<string, CaseStudyData> = {};

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const slug = post._meta.path.replace(/\.mdx$/, "");
    const project = DATA.projects.find(
      (p) => "caseStudySlug" in p && p.caseStudySlug === slug
    );
    const heroMedia = project
      ? (("video" in project && project.video) || ("image" in project && project.image) || undefined)
      : post.image || undefined;
    const logo =
      project && "logo" in project && project.logo ? project.logo : undefined;
    const websiteUrl =
      project?.href && project.href !== "#" ? project.href : undefined;
    const prev = posts[i - 1];
    const next = posts[i + 1];

    map[slug] = {
      slug,
      title: post.title,
      publishedAt: post.publishedAt,
      mdxCode: post.mdx,
      heroMedia,
      logo,
      websiteUrl,
      previousSlug: prev ? prev._meta.path.replace(/\.mdx$/, "") : null,
      previousTitle: prev?.title ?? null,
      nextSlug: next ? next._meta.path.replace(/\.mdx$/, "") : null,
      nextTitle: next?.title ?? null,
    };
  }

  return map;
}
