import Link from "next/link";
import { kv } from "@/lib/kv";

async function getTags() {
  try {
    const tags = await kv.smembers("tags:all");
    return tags || [];
  } catch (error) {
    return [];
  }
}

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <div className="container">
      <h1>Browse Tags</h1>

      {tags.length === 0 ? (
        <p>No tags found. Create some links to get started!</p>
      ) : (
        <div className="tags-grid">
          {tags.sort().map((tag) => (
            <Link key={tag} href={`/stats?tag=${tag}`} className="tag-chip">
              {tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
