import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";
import { ZeeActsLogo } from "../components/ZeeActsLogo";
import { getRuntimeApiBaseUrl } from "../runtime-env";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  tags: string | null;
  status: string;
  metaTitle: string | null;
  metaDescription: string | null;
  publishedAt: string | null;
  createdAt: string;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const apiBaseUrl = getRuntimeApiBaseUrl(BASE);

async function fetchPost(slug: string): Promise<BlogPost> {
  const res = await fetch(`${apiBaseUrl}/api/blog/${slug}`);
  if (!res.ok) throw new Error("Post not found");
  return res.json() as Promise<BlogPost>;
}

function setMeta(name: string, content: string, prop = false) {
  const attr = prop ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => fetchPost(slug),
    enabled: !!slug,
  });

  useEffect(() => {
    if (!post) return;
    const title = post.metaTitle || post.title;
    const desc = post.metaDescription || post.excerpt || "";
    document.title = `${title} — ZeeActs Blog`;
    setMeta("description", desc);
    setMeta("og:title", title, true);
    setMeta("og:description", desc, true);
    if (post.coverImage) setMeta("og:image", post.coverImage, true);
    setMeta("og:type", "article", true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", desc);
  }, [post]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#E63950] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <h1 className="font-display font-bold text-3xl text-[#0A0A0F]">Post not found</h1>
        <Link href="/blog">
          <span className="text-[#E63950] font-medium cursor-pointer hover:underline">← Back to blog</span>
        </Link>
      </div>
    );
  }

  const tags = post.tags ? post.tags.split(",").filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">
          <Link href="/">
            <ZeeActsLogo light />
          </Link>
          <Link href="/blog">
            <span className="flex items-center gap-2 text-sm font-medium text-black/60 hover:text-black transition-colors cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> Blog
            </span>
          </Link>
        </div>
      </nav>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="pt-[68px] h-[420px] overflow-hidden bg-zinc-100">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Article */}
      <article className={`max-w-3xl mx-auto px-6 ${post.coverImage ? "pt-12" : "pt-28"} pb-24`}>
        {/* Meta row */}
        <div className="flex items-center flex-wrap gap-4 mb-6">
          {post.publishedAt && (
            <span className="flex items-center gap-1.5 text-xs text-black/40">
              <Calendar className="w-3.5 h-3.5" />
              {format(new Date(post.publishedAt), "MMMM d, yyyy")}
            </span>
          )}
          {tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Tag className="w-3.5 h-3.5 text-black/40" />
              {tags.map((tag) => (
                <span
                  key={tag.trim()}
                  className="text-xs bg-[#E63950]/8 text-[#E63950] px-2.5 py-0.5 rounded-full font-medium"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="font-display font-extrabold text-4xl md:text-5xl text-[#0A0A0F] leading-tight mb-6">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-black/50 leading-relaxed mb-10 border-l-4 border-[#E63950] pl-5">
            {post.excerpt}
          </p>
        )}

        {/* Content */}
        <div
          className="prose prose-zinc prose-lg max-w-none
            prose-headings:font-display prose-headings:font-bold prose-headings:text-[#0A0A0F]
            prose-a:text-[#E63950] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-[#0A0A0F]
            prose-blockquote:border-[#E63950] prose-blockquote:text-black/60
            prose-code:text-[#E63950] prose-code:bg-[#E63950]/8 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm
            prose-pre:bg-[#0A0A0F] prose-pre:text-white/80
            prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Footer */}
      <div className="border-t border-black/8 py-10 px-6 text-center">
        <Link href="/blog">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#E63950] cursor-pointer hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-4 h-4" /> Back to all articles
          </span>
        </Link>
      </div>
    </div>
  );
}
