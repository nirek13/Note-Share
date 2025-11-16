"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function UniversitiesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name"); // name, links, date
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUniversityName, setNewUniversityName] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchUniversities();
    }
  }, [user]);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/universities");

      if (!response.ok) {
        throw new Error("Failed to fetch universities");
      }

      const data = await response.json();
      setUniversities(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addUniversity = async (e) => {
    e.preventDefault();
    if (!newUniversityName.trim() || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/universities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: newUniversityName.trim(),
          password 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add university");
      }

      setSuccessMessage("University added successfully!");
      setNewUniversityName("");
      setPassword("");
      setShowAddForm(false);
      await fetchUniversities();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUniversity = async (universityId, universityName) => {
    const enteredPassword = prompt(`Enter password to delete "${universityName}":`);
    if (!enteredPassword) return;

    try {
      setLoading(true);
      const response = await fetch("/api/universities", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: universityId,
          password: enteredPassword 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete university");
      }

      setSuccessMessage("University deleted successfully!");
      await fetchUniversities();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort universities
  const filteredUniversities = universities
    .filter(uni => {
      const searchLower = searchTerm.toLowerCase();
      return uni.name.toLowerCase().includes(searchLower);
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "links":
          return (b.linkCount || 0) - (a.linkCount || 0);
        case "date":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "name":
        default:
          return a.name.localeCompare(b.name);
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h1>Universities</h1>
            <p style={{ color: "#6B7280" }}>Track universities where links have been created</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#3B82F6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.2s"
            }}
          >
            {showAddForm ? "Cancel" : "Add University"}
          </button>
        </div>
        
        {/* Add University Form */}
        {showAddForm && (
          <div style={{
            padding: "1.5rem",
            background: "#F9FAFB",
            borderRadius: "8px",
            marginBottom: "1rem",
            border: "1px solid #E5E7EB"
          }}>
            <form onSubmit={addUniversity}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                  University Name
                </label>
                <input
                  type="text"
                  value={newUniversityName}
                  onChange={(e) => setNewUniversityName(e.target.value)}
                  placeholder="Enter university name"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #D1D5DB",
                    borderRadius: "6px"
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #D1D5DB",
                    borderRadius: "6px"
                  }}
                  required
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: "0.5rem 1rem",
                  background: "#10B981",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "500",
                  cursor: "pointer"
                }}
              >
                Add University
              </button>
            </form>
          </div>
        )}

        {successMessage && (
          <div style={{
            padding: "1rem",
            background: "#D1FAE5",
            color: "#065F46",
            borderRadius: "8px",
            marginBottom: "1rem"
          }}>
            {successMessage}
          </div>
        )}
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
            Total Universities
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#111827" }}>
            {universities.length}
          </div>
        </div>

        <div style={{
          background: "#F9FAFB",
          padding: "1.5rem",
          borderRadius: "12px",
          border: "1px solid #E5E7EB"
        }}>
          <div style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "0.5rem" }}>
            Total Links Created
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#111827" }}>
            {universities.reduce((sum, uni) => sum + (uni.linkCount || 0), 0)}
          </div>
        </div>

        <div style={{
          background: "#F9FAFB",
          padding: "1.5rem",
          borderRadius: "12px",
          border: "1px solid #E5E7EB"
        }}>
          <div style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "0.5rem" }}>
            Avg Links per University
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#111827" }}>
            {universities.length > 0 ? 
              Math.round(universities.reduce((sum, uni) => sum + (uni.linkCount || 0), 0) / universities.length) 
              : 0}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search universities..."
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
            <option value="name">Sort by Name</option>
            <option value="links">Sort by Links Count</option>
            <option value="date">Sort by Date Added</option>
          </select>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {/* Universities List */}
      {filteredUniversities.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "3rem",
          background: "#F9FAFB",
          borderRadius: "12px"
        }}>
          <p style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>
            {searchTerm ? "No universities found" : "No universities yet"}
          </p>
          <p style={{ color: "#6B7280" }}>
            {searchTerm ? "Try adjusting your search" : "Universities will appear here when you create batch links"}
          </p>
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))"
        }}>
          {filteredUniversities.map((university) => (
            <div
              key={university.id}
              style={{
                background: "white",
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
              }}
            >
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <h3 style={{ 
                    fontSize: "1.125rem", 
                    fontWeight: "600", 
                    color: "#111827",
                    margin: 0
                  }}>
                    {university.name}
                  </h3>
                  {university.isLegacy && (
                    <span style={{
                      padding: "0.25rem 0.5rem",
                      background: "#FEF3C7",
                      color: "#92400E",
                      fontSize: "0.75rem",
                      borderRadius: "4px",
                      fontWeight: "500"
                    }}>
                      Legacy
                    </span>
                  )}
                </div>
                <div style={{ 
                  fontSize: "0.875rem", 
                  color: "#6B7280" 
                }}>
                  Added {new Date(university.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center" 
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem"
                }}>
                  <div style={{ 
                    background: "#EFF6FF", 
                    color: "#1D4ED8", 
                    padding: "0.25rem 0.75rem", 
                    borderRadius: "6px", 
                    fontSize: "0.875rem",
                    fontWeight: "500"
                  }}>
                    {university.linkCount || 0} links
                  </div>
                  
                  <button
                    onClick={() => deleteUniversity(university.id, university.name)}
                    style={{
                      padding: "0.25rem 0.5rem",
                      background: "#DC2626",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      fontWeight: "500"
                    }}
                  >
                    Delete
                  </button>
                </div>
                
                {university.lastLinkCreated && (
                  <div style={{ 
                    fontSize: "0.75rem", 
                    color: "#6B7280" 
                  }}>
                    Last link: {new Date(university.lastLinkCreated).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}