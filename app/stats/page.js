"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function DeleteButton({ linkId, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this link?")) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/delete/${linkId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete(linkId);
      } else {
        alert("Failed to delete link");
      }
    } catch (error) {
      alert("Error deleting link");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="btn-danger btn-small"
    >
      {deleting ? "..." : "Delete"}
    </button>
  );
}

function LinkTable({ links, onDelete, title }) {
  if (links.length === 0) return null;

  return (
    <div className="table-section">
      <h3>{title}</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Short URL</th>
              <th>Target URL</th>
              <th>Clicks</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => {
              const shortLink = `${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}/${link.id}`;

              return (
                <tr key={link.id}>
                  <td>
                    <strong>{link.title || "Untitled"}</strong>
                    <br />
                    <small><code>{link.id}</code></small>
                  </td>
                  <td>
                    <a href={shortLink} target="_blank" rel="noopener noreferrer">
                      {shortLink}
                    </a>
                  </td>
                  <td className="url-cell">
                    <a href={link.targetUrl} target="_blank" rel="noopener noreferrer">
                      {link.targetUrl.length > 50 
                        ? `${link.targetUrl.substring(0, 50)}...` 
                        : link.targetUrl}
                    </a>
                  </td>
                  <td>{link.clicks}</td>
                  <td>
                    {link.createdAt ? new Date(link.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td>
                    <DeleteButton linkId={link.id} onDelete={onDelete} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function StatsPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats", { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (linkId) => {
    setLinks(prev => prev.filter(link => link.id !== linkId));
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  // Group links by university
  const groupedLinks = links.reduce((groups, link) => {
    const university = link.university || "Other";
    if (!groups[university]) {
      groups[university] = [];
    }
    groups[university].push(link);
    return groups;
  }, {});

  const universities = Object.keys(groupedLinks).sort();

  return (
    <div className="container">
      <h1>Link Statistics</h1>

      {links.length === 0 ? (
        <p>No links found. <Link href="/create">Create your first link</Link>.</p>
      ) : (
        <div className="stats-groups">
          {universities.map((university) => (
            <LinkTable
              key={university}
              title={`${university} (${groupedLinks[university].length} links)`}
              links={groupedLinks[university]}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
