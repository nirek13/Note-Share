"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function HomePage() {
  const { user, loading } = useAuth();

  return (
    <div className="container">
      <div style={{textAlign: 'center', padding: '4rem 0', maxWidth: '800px', margin: '0 auto'}}>
        <h1 style={{fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
          Penseum Link Shortener
        </h1>
        <p style={{fontSize: '1.25rem', color: '#6B7280', marginBottom: '3rem', lineHeight: '1.6'}}>
          Create short links for Penseum courses, track performance, and see which creators drive the most engagement
        </p>

        {loading ? (
          <div>Loading...</div>
        ) : user ? (
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link href="/dashboard" className="btn-primary" style={{fontSize: '1.125rem', padding: '1rem 2rem'}}>
              Go to Dashboard
            </Link>
            <Link href="/create" className="btn-secondary" style={{fontSize: '1.125rem', padding: '1rem 2rem'}}>
              Create Links
            </Link>
          </div>
        ) : (
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link href="/auth/register" className="btn-primary" style={{fontSize: '1.125rem', padding: '1rem 2rem'}}>
              Get Started
            </Link>
            <Link href="/auth/login" className="btn-secondary" style={{fontSize: '1.125rem', padding: '1rem 2rem'}}>
              Sign In
            </Link>
          </div>
        )}

        <div style={{marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'left'}}>
          <div style={{padding: '1.5rem', background: '#F9FAFB', borderRadius: '12px'}}>
            <h3 style={{marginBottom: '0.5rem', color: '#111827'}}>Track Performance</h3>
            <p style={{color: '#6B7280', fontSize: '0.875rem'}}>Monitor clicks, engagement, and identify your top-performing content creators</p>
          </div>
          <div style={{padding: '1.5rem', background: '#F9FAFB', borderRadius: '12px'}}>
            <h3 style={{marginBottom: '0.5rem', color: '#111827'}}>Simple Analytics</h3>
            <p style={{color: '#6B7280', fontSize: '0.875rem'}}>Get detailed insights into link performance with easy-to-read charts and metrics</p>
          </div>
          <div style={{padding: '1.5rem', background: '#F9FAFB', borderRadius: '12px'}}>
            <h3 style={{marginBottom: '0.5rem', color: '#111827'}}>Creator Leaderboard</h3>
            <p style={{color: '#6B7280', fontSize: '0.875rem'}}>See which creators generate the most engagement and reward top performers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
