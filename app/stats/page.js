import Link from "next/link";

async function getStats(tag) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const url = tag
    ? `${baseUrl}/api/stats/by-tag?tag=${encodeURIComponent(tag)}`
    : `${baseUrl}/api/stats`;

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export default async function StatsPage({ searchParams }) {
  const params = await searchParams;
  const tag = params?.tag;
  const links = await getStats(tag);

  return (
    <div className="container">
      <h1>Link Statistics</h1>

      {tag && (
        <div className="filter-info">
          <p>
            Showing links tagged with: <strong>{tag}</strong>
          </p>
          <Link href="/stats" className="btn-secondary">
            Clear Filter
          </Link>
        </div>
      )}

      {links.length === 0 ? (
        <p>No links found.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Short URL</th>
                <th>Penseum URL</th>
                <th>Clicks</th>
                <th>Tags</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => {
                const shortLink = `${process.env.NEXT_PUBLIC_BASE_URL || "https://mydomain.com"}/${link.id}`;

                return (
                  <tr key={link.id}>
                    <td>
                      <code>{link.id}</code>
                    </td>
                    <td>
                      <a href={shortLink} target="_blank" rel="noopener noreferrer">
                        {shortLink}
                      </a>
                    </td>
                    <td className="url-cell">
                      <a href={link.targetUrl} target="_blank" rel="noopener noreferrer">
                        {link.targetUrl}
                      </a>
                    </td>
                    <td>{link.clicks}</td>
                    <td>
                      <span className="text-muted">—</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
