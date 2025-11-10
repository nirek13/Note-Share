"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date"); // date, clicks, title

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchMyLinks();
    }
  }, [user]);

  const fetchMyLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/my-links");

      if (!response.ok) {
        throw new Error("Failed to fetch your links");
      }

      const data = await response.json();
      setLinks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Calculate stats
  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
  const avgClicksPerLink = totalLinks > 0 ? (totalClicks / totalLinks).toFixed(1) : 0;

  // Filter and sort links
  const filteredLinks = links
    .filter(link => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (link.title || "").toLowerCase().includes(searchLower) ||
        (link.university || "").toLowerCase().includes(searchLower) ||
        link.id.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "clicks":
          return b.clicks - a.clicks;
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        case "date":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  if (authLoading || loading) {
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container">
      <div style={{ marginBottom: "2rem" }}>
        <h1>My Dashboard</h1>
        <p style={{ color: "#6B7280" }}>Welcome back, {user.name}!</p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
        marginBottom: "2rem"
      }}>
        <div style={{
          background: "#F9FAFB",
          padding: "1.5rem",
          borderRadius: "12px",
          border: "1px solid #E5E7EB"
        }}>
          <div style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "0.5rem" }}>
            Total Links
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#111827" }}>
            {totalLinks}
          </div>
        </div>

        <div style={{
          background: "#F9FAFB",
          padding: "1.5rem",
          borderRadius: "12px",
          border: "1px solid #E5E7EB"
        }}>
          <div style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "0.5rem" }}>
            Total Clicks
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#111827" }}>
            {totalClicks}
          </div>
        </div>

        <div style={{
          background: "#F9FAFB",
          padding: "1.5rem",
          borderRadius: "12px",
          border: "1px solid #E5E7EB"
        }}>
          <div style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "0.5rem" }}>
            Avg Clicks/Link
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#111827" }}>
            {avgClicksPerLink}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search by title, university, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: "1",
              minWidth: "200px",
              padding: "0.5rem 1rem",
              border: "1px solid #D1D5DB",
              borderRadius: "8px"
            }}
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #D1D5DB",
              borderRadius: "8px"
            }}
          >
            <option value="date">Sort by Date</option>
            <option value="clicks">Sort by Clicks</option>
            <option value="title">Sort by Title</option>
          </select>

          <Link href="/create" className="btn-primary">
            Create New Link
          </Link>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {/* Links List */}
      {filteredLinks.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "3rem",
          background: "#F9FAFB",
          borderRadius: "12px"
        }}>
          <p style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>
            {searchTerm ? "No links found" : "No links yet"}
          </p>
          <p style={{ color: "#6B7280" }}>
            {searchTerm ? "Try adjusting your search" : "Create your first link to get started"}
          </p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "white",
            borderRadius: "12px",
            overflow: "hidden"
          }}>
            <thead style={{ background: "#F9FAFB" }}>
              <tr>
                <th style={{ padding: "1rem", textAlign: "left" }}>Title</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>University</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>Short URL</th>
                <th style={{ padding: "1rem", textAlign: "center" }}>Clicks</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>Created</th>
                <th style={{ padding: "1rem", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLinks.map((link, index) => (
                <tr
                  key={link.id}
                  style={{
                    borderTop: index > 0 ? "1px solid #E5E7EB" : "none"
                  }}
                >
                  <td style={{ padding: "1rem" }}>
                    {link.title || <span style={{ color: "#9CA3AF" }}>Untitled</span>}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {link.university || <span style={{ color: "#9CA3AF" }}>—</span>}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <code style={{
                      background: "#F3F4F6",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.875rem"
                    }}>
                      {link.id}
                    </code>
                  </td>
                  <td style={{ padding: "1rem", textAlign: "center", fontWeight: "bold" }}>
                    {link.clicks}
                  </td>
                  <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6B7280" }}>
                    {new Date(link.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    <button
                      onClick={() => copyToClipboard(`${window.location.origin}/${link.id}`)}
                      className="btn-secondary"
                      style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
                    >
                      Copy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <Link href="/leaderboard" style={{ color: "#0D6EFD" }}>
          View Global Leaderboard →
        </Link>
      </div>
    </div>
  );
}
