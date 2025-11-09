import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container">
      <div style={{textAlign: 'center', padding: '2rem 0'}}>
        <h1>Penseum Link Shortener</h1>
        <p style={{fontSize: '1.125rem', color: '#6B7280', marginBottom: '3rem'}}>
          Create short links for Penseum courses
        </p>
        
        <Link href="/create" className="btn-primary" style={{fontSize: '1.125rem'}}>
          Create Links
        </Link>
      </div>
    </div>
  );
}
