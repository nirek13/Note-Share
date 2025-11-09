import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{textAlign: 'center', padding: '4rem 2rem'}}>
      <h1 style={{fontSize: '3rem', fontWeight: '800', color: '#111827', marginBottom: '1.5rem'}}>
        Transform Your Course Links
      </h1>
      <p style={{fontSize: '1.25rem', color: '#6B7280', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: '1.6'}}>
        Create beautiful, trackable short links for your Penseum courses. 
        Perfect for sharing with students, tracking engagement, and organizing your content.
      </p>

      <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem'}}>
        <Link href="/create" className="btn-primary" style={{fontSize: '1.125rem', padding: '1rem 2rem'}}>
          Create Your First Link
        </Link>
        <Link href="/stats" className="btn-secondary" style={{fontSize: '1.125rem', padding: '1rem 2rem'}}>
          View Analytics
        </Link>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto'}}>
        <div style={{background: '#FFFFFF', padding: '2rem', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}}>
          <div style={{width: '48px', height: '48px', background: '#7C3AED', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'}}>
            <span style={{color: 'white', fontSize: '1.5rem'}}>🔗</span>
          </div>
          <h2 style={{color: '#111827', marginBottom: '0.75rem'}}>Simple Link Creation</h2>
          <p style={{color: '#6B7280'}}>Paste any Penseum course URL and get a clean, shareable short link instantly. Works with both individual links and batch processing.</p>
        </div>

        <div style={{background: '#FFFFFF', padding: '2rem', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}}>
          <div style={{width: '48px', height: '48px', background: '#22C55E', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'}}>
            <span style={{color: 'white', fontSize: '1.5rem'}}>📊</span>
          </div>
          <h2 style={{color: '#111827', marginBottom: '0.75rem'}}>Smart Analytics</h2>
          <p style={{color: '#6B7280'}}>Track click performance, organize by university, and get insights into how your students engage with course content.</p>
        </div>

        <div style={{background: '#FFFFFF', padding: '2rem', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}}>
          <div style={{width: '48px', height: '48px', background: '#7C3AED', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'}}>
            <span style={{color: 'white', fontSize: '1.5rem'}}>🎓</span>
          </div>
          <h2 style={{color: '#111827', marginBottom: '0.75rem'}}>Built for Education</h2>
          <p style={{color: '#6B7280'}}>Designed specifically for educators using Penseum. Organize links by university and course for easy management.</p>
        </div>
      </div>
    </div>
  );
}
