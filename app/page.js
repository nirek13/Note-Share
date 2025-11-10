"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function HomePage() {
  const { user, loading } = useAuth();

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#FAFAFA'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        maxWidth: '480px'
      }}>
        {/* Minimal Logo Mark */}
        <div style={{
          width: '4px',
          height: '60px',
          margin: '0 auto 3rem',
          background: '#111',
          borderRadius: '2px'
        }}></div>

        {/* Title */}
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '600',
          color: '#111',
          marginBottom: '0.75rem',
          letterSpacing: '-0.03em',
          lineHeight: '1.1'
        }}>
          Penseum Links
        </h1>

        <p style={{
          fontSize: '1rem',
          color: '#666',
          marginBottom: '3rem',
          fontWeight: '400',
          letterSpacing: '0.02em'
        }}>
          Link management for creators
        </p>

        {/* CTA Buttons */}
        {loading ? (
          <div style={{
            width: '24px',
            height: '24px',
            border: '2px solid #E5E5E5',
            borderTop: '2px solid #111',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto'
          }}></div>
        ) : user ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            maxWidth: '240px',
            margin: '0 auto'
          }}>
            <Link href="/dashboard" style={{
              padding: '0.875rem 1.5rem',
              fontSize: '0.9375rem',
              fontWeight: '500',
              background: '#111',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              letterSpacing: '0.01em'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#111';
            }}>
              Dashboard
            </Link>
            <Link href="/create" style={{
              padding: '0.875rem 1.5rem',
              fontSize: '0.9375rem',
              fontWeight: '500',
              background: 'transparent',
              color: '#111',
              borderRadius: '8px',
              textDecoration: 'none',
              border: '1px solid #E5E5E5',
              transition: 'all 0.2s ease',
              letterSpacing: '0.01em'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#111';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E5E5E5';
            }}>
              Create
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            maxWidth: '240px',
            margin: '0 auto'
          }}>
            <Link href="/auth/register" style={{
              padding: '0.875rem 1.5rem',
              fontSize: '0.9375rem',
              fontWeight: '500',
              background: '#111',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              letterSpacing: '0.01em'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#111';
            }}>
              Get Started
            </Link>
            <Link href="/auth/login" style={{
              padding: '0.875rem 1.5rem',
              fontSize: '0.9375rem',
              fontWeight: '500',
              background: 'transparent',
              color: '#111',
              borderRadius: '8px',
              textDecoration: 'none',
              border: '1px solid #E5E5E5',
              transition: 'all 0.2s ease',
              letterSpacing: '0.01em'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#111';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E5E5E5';
            }}>
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
