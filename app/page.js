import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container">
      <div className="hero">
        <h1>Penseum Link Shortener</h1>
        <p>
          Create short, trackable links for Penseum shared course URLs with
          automatic UTM parameters and click tracking.
        </p>
      </div>

      <div className="features">
        <div className="feature-card">
          <h2>Create Links</h2>
          <p>Generate short links with custom UTM parameters and tags.</p>
          <Link href="/create" className="btn-primary">
            Get Started
          </Link>
        </div>

        <div className="feature-card">
          <h2>Track Performance</h2>
          <p>View click statistics and filter by tags.</p>
          <Link href="/stats" className="btn-primary">
            View Stats
          </Link>
        </div>

        <div className="feature-card">
          <h2>Browse Tags</h2>
          <p>Organize and filter links by category.</p>
          <Link href="/tags" className="btn-primary">
            Browse Tags
          </Link>
        </div>
      </div>
    </div>
  );
}
