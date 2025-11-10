"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function LeaderboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("performance");

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users/leaderboard");
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to view the leaderboard");
        }
        throw new Error("Failed to fetch leaderboard data");
      }

      const leaderboardData = await response.json();
      setData(leaderboardData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRankIcon = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  if (loading) {
    return (
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 2rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #F3F4F6',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '1rem'
          }}></div>
          <p style={{ color: '#6B7280', fontSize: '1rem' }}>Loading performance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 2rem',
          textAlign: 'center',
          background: '#FEF2F2',
          borderRadius: '12px',
          border: '1px solid #FECACA'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem'
          }}>⚠️</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#991B1B', marginBottom: '0.5rem' }}>
            Unable to Load Leaderboard
          </h1>
          <p style={{ color: '#DC2626', marginBottom: '2rem' }}>{error}</p>
          {error.includes("sign in") && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link href="/auth/login" className="btn-primary">Sign In</Link>
              <Link href="/auth/register" className="btn-secondary">Create Account</Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      {/* Header Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem', fontWeight: 'bold' }}>
          Creator Leaderboard
        </h1>
        <p style={{ color: '#6B7280', fontSize: '1rem' }}>
          Discover the top-performing creators and their engagement metrics
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          color: 'white'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            {data.totalUsers}
          </div>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Total Creators</div>
        </div>
        <div style={{
          background: '#F9FAFB',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem', color: '#111827' }}>
            {data.totalLinks.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>Total Links</div>
        </div>
        <div style={{
          background: '#F9FAFB',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem', color: '#111827' }}>
            {data.totalClicks.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>Total Clicks</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        borderBottom: '2px solid #E5E7EB',
        overflowX: 'auto'
      }}>
        <button
          onClick={() => setActiveTab("performance")}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === "performance" ? '2px solid #667eea' : '2px solid transparent',
            marginBottom: '-2px',
            color: activeTab === "performance" ? '#667eea' : '#6B7280',
            fontWeight: activeTab === "performance" ? '600' : '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
        >
          🏆 Top Performers
        </button>
        <button
          onClick={() => setActiveTab("active")}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === "active" ? '2px solid #667eea' : '2px solid transparent',
            marginBottom: '-2px',
            color: activeTab === "active" ? '#667eea' : '#6B7280',
            fontWeight: activeTab === "active" ? '600' : '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
        >
          🔥 Most Active
        </button>
        <button
          onClick={() => setActiveTab("conversion")}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === "conversion" ? '2px solid #667eea' : '2px solid transparent',
            marginBottom: '-2px',
            color: activeTab === "conversion" ? '#667eea' : '#6B7280',
            fontWeight: activeTab === "conversion" ? '600' : '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
        >
          📈 Best Conversion
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === "performance" && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
              Top Performers by Total Clicks
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.topPerformers.length === 0 ? (
                <div style={{
                  padding: '3rem',
                  textAlign: 'center',
                  background: '#F9FAFB',
                  borderRadius: '12px',
                  color: '#6B7280'
                }}>
                  No creators with clicks yet
                </div>
              ) : (
                data.topPerformers.map((user, index) => (
                  <div key={user.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    background: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  >
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      minWidth: '50px',
                      textAlign: 'center'
                    }}>
                      {getRankIcon(index)}
                    </div>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1rem'
                    }}>
                      {getInitials(user.name)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                        Joined {formatDate(user.createdAt)}
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '2rem',
                      alignItems: 'center'
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22C55E' }}>
                          {user.totalClicks.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase' }}>
                          Clicks
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                          {user.totalLinks}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase' }}>
                          Links
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "active" && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
              Most Active Creators by Links Created
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.mostActive.length === 0 ? (
                <div style={{
                  padding: '3rem',
                  textAlign: 'center',
                  background: '#F9FAFB',
                  borderRadius: '12px',
                  color: '#6B7280'
                }}>
                  No creators with links yet
                </div>
              ) : (
                data.mostActive.map((user, index) => (
                  <div key={user.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    background: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  >
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      minWidth: '50px',
                      textAlign: 'center'
                    }}>
                      {getRankIcon(index)}
                    </div>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1rem'
                    }}>
                      {getInitials(user.name)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                        Joined {formatDate(user.createdAt)}
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '2rem',
                      alignItems: 'center'
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                          {user.totalLinks}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase' }}>
                          Links
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22C55E' }}>
                          {user.totalClicks.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase' }}>
                          Clicks
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "conversion" && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
              Best Conversion Rates (5+ links minimum)
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.bestConversion.length === 0 ? (
                <div style={{
                  padding: '3rem',
                  textAlign: 'center',
                  background: '#F9FAFB',
                  borderRadius: '12px',
                  color: '#6B7280'
                }}>
                  No creators with 5+ links yet
                </div>
              ) : (
                data.bestConversion.map((user, index) => (
                  <div key={user.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    background: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  >
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      minWidth: '50px',
                      textAlign: 'center'
                    }}>
                      {getRankIcon(index)}
                    </div>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1rem'
                    }}>
                      {getInitials(user.name)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                        Joined {formatDate(user.createdAt)}
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '2rem',
                      alignItems: 'center'
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#F59E0B' }}>
                          {user.avgClicksPerLink}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase' }}>
                          Avg/Link
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                          {user.totalLinks}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase' }}>
                          Links
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}