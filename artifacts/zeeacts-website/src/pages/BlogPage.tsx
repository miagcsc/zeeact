import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  tags: string | null;
  status: string;
  publishedAt: string | null;
  createdAt: string;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

async function fetchPublishedPosts(): Promise<BlogPost[]> {
  const res = await fetch(`${BASE}/api/blog`);
  if (!res.ok) throw new Error("Failed to fetch blog posts");
  return res.json() as Promise<BlogPost[]>;
}

export default function BlogPage() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts-public"],
    queryFn: fetchPublishedPosts,
  });

  useEffect(() => {
    document.title = "Blog — ZeeActs";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Insights on software development, AI, automation and business growth from the ZeeActs team.");
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">
          <Link href="/">
            <span className="font-display font-extrabold text-2xl text-[#0A0A0F] cursor-pointer">
              Zee<span className="text-[#E63950]">Acts</span>
            </span>
          </Link>
          <Link href="/">
            <span className="text-sm font-medium text-black/60 hover:text-black transition-colors cursor-pointer">← Back to site</span>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-[#fff0f2] to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#E63950] bg-[#E63950]/10 px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E63950] animate-pulse" />
            INSIGHTS & ARTICLES
          </div>
          <h1 className="font-display font-extrabold text-5xl md:text-6xl text-[#0A0A0F] mb-4">
            The ZeeActs Blog
          </h1>
          <p className="text-lg text-black/50 max-w-2xl mx-auto">
            Practical guides on software, AI, automation, and building businesses that scale without burning out.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {isLoading && (
            <div className="grid gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-zinc-100 rounded-2xl h-48 animate-pulse" />
              ))}
            </div>
          )}

          {!isLoading && posts?.length === 0 && (
            <div className="text-center py-24 text-black/40">
              <p className="text-lg">No posts published yet. Check back soon.</p>
            </div>
          )}

          <div className="grid gap-8">
            {posts?.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <article className="group bg-white border border-black/8 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-[#E63950]/5 hover:border-[#E63950]/20 transition-all duration-300 cursor-pointer">
                  {post.coverImage && (
                    <div className="h-56 overflow-hidden bg-zinc-100">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      {post.publishedAt && (
                        <span className="flex items-center gap-1.5 text-xs text-black/40">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(new Date(post.publishedAt), "MMMM d, yyyy")}
                        </span>
                      )}
                      {post.tags && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Tag className="w-3.5 h-3.5 text-black/40" />
                          {post.tags.split(",").filter(Boolean).map((tag) => (
                            <span
                              key={tag.trim()}
                              className="text-xs bg-[#E63950]/8 text-[#E63950] px-2 py-0.5 rounded-full font-medium"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <h2 className="font-display font-bold text-2xl text-[#0A0A0F] mb-3 group-hover:text-[#E63950] transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-black/55 leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                    )}
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#E63950] group-hover:gap-3 transition-all">
                      Read article <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/8 py-10 px-6 text-center text-sm text-black/40">
        © {new Date().getFullYear()} ZeeActs. All rights reserved.{" "}
        <Link href="/"><span className="hover:text-[#E63950] cursor-pointer">← Back to site</span></Link>
      </footer>
    </div>
  );
}
