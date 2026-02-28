import { allPosts } from "content-collections";
import { DATA } from "@/data/resume";
import { notFound } from "next/navigation";
import { CaseStudyModal } from "@/components/case-study-modal";

function getSortedPosts() {
  return [...allPosts].sort((a, b) => {
    if (new Date(a.publishedAt) > new Date(b.publishedAt)) return -1;
    return 1;
  });
}

export default async function CaseStudyModalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sortedPosts = getSortedPosts();
  const currentIndex = sortedPosts.findIndex(
    (p) => p._meta.path.replace(/\.mdx$/, "") === slug
  );
  const post = sortedPosts[currentIndex];

  if (!post) {
    notFound();
  }

  const project = DATA.projects.find(
    (p) => "caseStudySlug" in p && p.caseStudySlug === slug
  );
  const heroMedia = project
    ? project.video || project.image
    : post.image;
  const logo =
    project && "logo" in project && project.logo ? project.logo : undefined;

  const previousPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;

  const getSlug = (p: (typeof sortedPosts)[0]) =>
    p._meta.path.replace(/\.mdx$/, "");

  return (
    <CaseStudyModal
      slug={slug}
      title={post.title}
      publishedAt={post.publishedAt}
      mdxCode={post.mdx}
      heroMedia={heroMedia || undefined}
      logo={logo}
      previousSlug={previousPost ? getSlug(previousPost) : null}
      previousTitle={previousPost?.title ?? null}
      nextSlug={nextPost ? getSlug(nextPost) : null}
      nextTitle={nextPost?.title ?? null}
    />
  );
}
