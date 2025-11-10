"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header style={{
      borderBottom: '1px solid #E5E7EB',
      position: 'sticky',
      top: 0,
      background: 'white',
      zIndex: 50,
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
    }}>
      <nav style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/" style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: '#111827',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>P</span>
          Penseum Links
        </Link>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>
          {user && (
            <>
              <Link href="/dashboard" style={{
                color: '#6B7280',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.2s'
              }}>Dashboard</Link>
              <Link href="/create" style={{
                color: '#6B7280',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.2s'
              }}>Create</Link>
              <Link href="/stats" style={{
                color: '#6B7280',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.2s'
              }}>Analytics</Link>
              <Link href="/leaderboard" style={{
                color: '#6B7280',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.2s'
              }}>Leaderboard</Link>
            </>
          )}

          {loading ? (
            <div style={{
              width: '100px',
              height: '36px',
              background: '#F3F4F6',
              borderRadius: '8px',
              animation: 'pulse 1.5s infinite'
            }}></div>
          ) : user ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: '#F9FAFB',
                borderRadius: '8px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.875rem'
                }}>
                  {getInitials(user.name)}
                </div>
                <span style={{
                  fontWeight: '500',
                  color: '#111827'
                }}>{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'transparent',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  color: '#6B7280',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <Link href="/auth/login" style={{
                padding: '0.5rem 1rem',
                background: 'transparent',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                color: '#6B7280',
                fontWeight: '500',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}>
                Sign In
              </Link>
              <Link href="/auth/register" style={{
                padding: '0.5rem 1rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '500',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}