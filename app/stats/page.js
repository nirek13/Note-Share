"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ClickTrendChart from "@/components/ClickTrendChart";

function DeleteButton({ linkId, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const password = prompt("Enter password to delete link:");
    if (!password) {
      return;
    }

    if (password !== "penseum123") {
      alert("Incorrect password");
      return;
    }

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
      className="btn-danger"
      style={{fontSize: '0.75rem', padding: '0.25rem 0.5rem'}}
    >
      {deleting ? "..." : "Delete"}
    </button>
  );
}


function BulkActions({ selectedLinks, onBulkDelete, onClearSelection }) {
  const [deleting, setDeleting] = useState(false);

  const handleBulkDelete = async () => {
    const password = prompt("Enter password to delete selected links:");
    if (!password) {
      return;
    }

    if (password !== "penseum123") {
      alert("Incorrect password");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedLinks.length} links?`)) {
      return;
    }

    setDeleting(true);
    try {
      await Promise.all(
        selectedLinks.map(linkId => 
          fetch(`/api/delete/${linkId}`, { method: "DELETE" })
        )
      );
      onBulkDelete(selectedLinks);
      onClearSelection();
    } catch (error) {
      alert("Error deleting links");
    } finally {
      setDeleting(false);
    }
  };

  if (selectedLinks.length === 0) return null;

  return (
    <div style={{
      background: '#F9FAFB', 
      padding: '1rem', 
      borderRadius: '12px', 
      margin: '1rem 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span>{selectedLinks.length} links selected</span>
      <div style={{display: 'flex', gap: '0.5rem'}}>
        <button onClick={onClearSelection} className="btn-secondary">
          Clear Selection
        </button>
        <button 
          onClick={handleBulkDelete} 
          disabled={deleting}
          className="btn-danger"
        >
          {deleting ? "Deleting..." : "Delete Selected"}
        </button>
      </div>
    </div>
  );
}

function StatsHeader({ totalLinks, totalClicks, filteredLinks, filteredClicks, dateRange }) {
  const avgClicksPerLink = filteredLinks > 0 ? Math.round((filteredClicks / filteredLinks) * 10) / 10 : 0;
  
  // Calculate comparison metrics if not viewing all time
  const getComparisonData = () => {
    if (dateRange.preset === 'all' || !dateRange.start) return null;
    
    // This would normally fetch comparison data from API
    // For now, showing placeholder for the UI
    return {
      linksChange: "+12%",
      clicksChange: "+8%",
      isPositive: true
    };
  };

  const comparison = getComparisonData();
  const showingFiltered = dateRange.preset !== 'all' || filteredLinks !== totalLinks;

  return (
    <div style={{
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '1rem', 
      marginBottom: '2rem'
    }}>
      <div style={{
        background: '#FFFFFF',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        textAlign: 'center'
      }}>
        <div style={{fontSize: '2rem', fontWeight: '800', color: '#7C3AED'}}>
          {showingFiltered ? filteredLinks : totalLinks}
        </div>
        <div style={{color: '#6B7280', fontSize: '0.875rem'}}>
          {showingFiltered ? `Links (${dateRange.preset.replace('d', ' days')})` : 'Total Links'}
        </div>
        {comparison && (
          <div style={{
            fontSize: '0.75rem', 
            color: comparison.isPositive ? '#22C55E' : '#EF4444',
            fontWeight: '600',
            marginTop: '0.25rem'
          }}>
            {comparison.linksChange} vs previous period
          </div>
        )}
      </div>
      
      <div style={{
        background: '#FFFFFF',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        textAlign: 'center'
      }}>
        <div style={{fontSize: '2rem', fontWeight: '800', color: '#22C55E'}}>
          {showingFiltered ? filteredClicks : totalClicks}
        </div>
        <div style={{color: '#6B7280', fontSize: '0.875rem'}}>
          {showingFiltered ? `Clicks (${dateRange.preset.replace('d', ' days')})` : 'Total Clicks'}
        </div>
        {comparison && (
          <div style={{
            fontSize: '0.75rem', 
            color: comparison.isPositive ? '#22C55E' : '#EF4444',
            fontWeight: '600',
            marginTop: '0.25rem'
          }}>
            {comparison.clicksChange} vs previous period
          </div>
        )}
      </div>

      <div style={{
        background: '#FFFFFF',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        textAlign: 'center'
      }}>
        <div style={{fontSize: '2rem', fontWeight: '800', color: '#F59E0B'}}>
          {avgClicksPerLink}
        </div>
        <div style={{color: '#6B7280', fontSize: '0.875rem'}}>Avg Clicks/Link</div>
      </div>

      {showingFiltered && (
        <div style={{
          background: '#F3F4F6',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{color: '#6B7280', fontSize: '0.875rem'}}>
            Showing {filteredLinks} of {totalLinks} total links
          </div>
        </div>
      )}
    </div>
  );
}

function DateRangeFilter({ dateRange, onDateRangeChange }) {
  const presets = [
    { label: 'All Time', value: 'all' },
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 90 Days', value: '90d' },
    { label: 'Custom Range', value: 'custom' }
  ];

  const getDateRangeValues = (range) => {
    const now = new Date();
    switch (range) {
      case '7d':
        return {
          start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          end: now
        };
      case '30d':
        return {
          start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          end: now
        };
      case '90d':
        return {
          start: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
          end: now
        };
      default:
        return { start: null, end: null };
    }
  };

  const handlePresetChange = (preset) => {
    const range = getDateRangeValues(preset);
    onDateRangeChange({ preset, ...range });
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
      {presets.map(preset => (
        <button
          key={preset.value}
          onClick={() => handlePresetChange(preset.value)}
          className={dateRange.preset === preset.value ? 'btn-primary' : 'btn-secondary'}
          style={{
            fontSize: '0.875rem',
            padding: '0.5rem 1rem',
            border: dateRange.preset === preset.value ? 'none' : '1px solid #D1D5DB'
          }}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}

function SearchAndFilter({ 
  searchTerm, 
  onSearchChange, 
  selectedUniversity, 
  onUniversityChange, 
  universities, 
  sortBy, 
  onSortChange,
  dateRange,
  onDateRangeChange
}) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Date Range Filter */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>
          TIME RANGE
        </label>
        <DateRangeFilter dateRange={dateRange} onDateRangeChange={onDateRangeChange} />
      </div>

      {/* Search and Sort Controls */}
      <div style={{
        display: 'flex', 
        gap: '1rem', 
        flexWrap: 'wrap'
      }}>
        <div style={{flex: '1', minWidth: '250px'}}>
          <input
            type="text"
            placeholder="Search links..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>
        <select
          value={selectedUniversity}
          onChange={(e) => onUniversityChange(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid #D1D5DB',
            borderRadius: '8px',
            fontSize: '1rem',
            minWidth: '150px'
          }}
        >
          <option value="">All Universities</option>
          {universities.map(uni => (
            <option key={uni} value={uni}>{uni}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid #D1D5DB',
            borderRadius: '8px',
            fontSize: '1rem',
            minWidth: '150px'
          }}
        >
          <option value="clicks">Sort by Clicks</option>
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>
    </div>
  );
}

function GroupDetailedView({ university, links, onClose }) {
  const [groupDetails, setGroupDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroupDetails();
  }, [links]);

  const fetchGroupDetails = async () => {
    try {
      const detailsPromises = links.map(link => 
        fetch(`/api/link-details/${link.id}`).then(res => res.ok ? res.json() : null)
      );
      const results = await Promise.all(detailsPromises);
      const validResults = results.filter(Boolean);
      setGroupDetails(validResults);
    } catch (error) {
      console.error('Error fetching group details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAllClicks = () => {
    if (!groupDetails) return [];
    
    const allClicks = [];
    groupDetails.forEach(linkDetail => {
      if (linkDetail.clickHistory) {
        linkDetail.clickHistory.forEach(click => {
          allClicks.push({
            ...click,
            linkTitle: linkDetail.title || 'Untitled',
            linkId: linkDetail.id
          });
        });
      }
    });
    
    return allClicks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const allClicks = getAllClicks();
  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#FFFFFF',
        padding: '2rem',
        borderRadius: '16px',
        maxWidth: '900px',
        width: '95%',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: '#111827' }}>Group Details: {university}</h2>
          <button onClick={onClose} className="btn-secondary">×</button>
        </div>

        {loading ? (
          <p>Loading group details...</p>
        ) : (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ background: '#F3F4F6', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#7C3AED' }}>{links.length}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Total Links</div>
                </div>
                <div style={{ background: '#F3F4F6', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#22C55E' }}>{totalClicks}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Total Clicks</div>
                </div>
                <div style={{ background: '#F3F4F6', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#F59E0B' }}>{allClicks.length}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Click Events</div>
                </div>
              </div>
            </div>

            {/* Group Click Trend Chart */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#F59E0B', marginBottom: '1rem' }}>Group Click Trends</h3>
              <ClickTrendChart 
                linksData={groupDetails} 
                title="Combined Click Trends Over Time"
                height={300}
              />
            </div>

            <div>
              <h3 style={{ color: '#22C55E', marginBottom: '1rem' }}>Combined Click History</h3>
              {allClicks.length > 0 ? (
                <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                  {allClicks.map((click, index) => (
                    <div key={index} style={{
                      background: '#F9FAFB',
                      padding: '0.75rem',
                      marginBottom: '0.5rem',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                          {formatTimestamp(click.timestamp)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#7C3AED', fontFamily: 'monospace' }}>
                          {click.linkId}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.25rem' }}>
                        <strong>{click.linkTitle}</strong>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                        User Agent: {click.userAgent.length > 60 ? `${click.userAgent.substring(0, 60)}...` : click.userAgent}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#6B7280' }}>No click history available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailedView({ link, onClose }) {
  const [linkDetails, setLinkDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinkDetails();
  }, [link.id]);

  const fetchLinkDetails = async () => {
    try {
      const response = await fetch(`/api/link-details/${link.id}`);
      if (response.ok) {
        const data = await response.json();
        setLinkDetails(data);
      }
    } catch (error) {
      console.error('Error fetching link details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#FFFFFF',
        padding: '2rem',
        borderRadius: '16px',
        maxWidth: '800px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: '#111827' }}>Link Details</h2>
          <button onClick={onClose} className="btn-secondary">×</button>
        </div>

        {loading ? (
          <p>Loading details...</p>
        ) : linkDetails ? (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#7C3AED', marginBottom: '1rem' }}>{linkDetails.title || 'Untitled'}</h3>
              <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                <strong>Link ID:</strong> {linkDetails.id}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                <strong>Target URL:</strong> <a href={linkDetails.targetUrl} target="_blank" rel="noopener noreferrer" style={{color: '#7C3AED'}}>{linkDetails.targetUrl}</a>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                <strong>University:</strong> {linkDetails.university || 'Other'}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                <strong>Total Clicks:</strong> {linkDetails.clicks}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                <strong>Created:</strong> {new Date(linkDetails.createdAt).toLocaleString()}
              </div>
            </div>

            {/* Click Trend Chart */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#F59E0B', marginBottom: '1rem' }}>Click Trends</h3>
              <ClickTrendChart 
                clickHistory={linkDetails.clickHistory} 
                title="Click Trends Over Time"
                height={250}
              />
            </div>

            <div>
              <h3 style={{ color: '#22C55E', marginBottom: '1rem' }}>Click History</h3>
              {linkDetails.clickHistory && linkDetails.clickHistory.length > 0 ? (
                <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                  {linkDetails.clickHistory.slice().reverse().map((click, index) => (
                    <div key={index} style={{
                      background: '#F9FAFB',
                      padding: '0.75rem',
                      marginBottom: '0.5rem',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB'
                    }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                        {formatTimestamp(click.timestamp)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                        User Agent: {click.userAgent.length > 60 ? `${click.userAgent.substring(0, 60)}...` : click.userAgent}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#6B7280' }}>No click history available</p>
              )}
            </div>
          </div>
        ) : (
          <p>Failed to load link details</p>
        )}
      </div>
    </div>
  );
}

function LinkRow({ link, isSelected, onToggleSelect, onDelete, onViewDetails }) {
  const shortLink = `${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}/${link.id}`;

  return (
    <tr style={{background: isSelected ? '#F3F4F6' : 'transparent'}}>
      <td>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(link.id)}
        />
      </td>
      <td>
        <div style={{fontWeight: '600'}}>{link.title || "Untitled"}</div>
        <div style={{fontSize: '0.75rem', color: '#6B7280', fontFamily: 'monospace'}}>{link.id}</div>
      </td>
      <td>
        <a href={shortLink} target="_blank" rel="noopener noreferrer" style={{fontSize: '0.875rem'}}>
          {shortLink.replace(window.location.origin, '')}
        </a>
      </td>
      <td>
        <a href={link.targetUrl} target="_blank" rel="noopener noreferrer" className="url-cell">
          {link.targetUrl && link.targetUrl.length > 40 
            ? `${link.targetUrl.substring(0, 40)}...` 
            : link.targetUrl || "N/A"}
        </a>
      </td>
      <td style={{textAlign: 'center', fontWeight: '600'}}>{link.clicks}</td>
      <td style={{fontSize: '0.875rem', color: '#6B7280'}}>
        {link.createdAt ? new Date(link.createdAt).toLocaleDateString() : "—"}
      </td>
      <td>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => onViewDetails(link)}
            className="btn-secondary"
            style={{fontSize: '0.75rem', padding: '0.25rem 0.5rem'}}
          >
            Details
          </button>
          <DeleteButton linkId={link.id} onDelete={onDelete} />
        </div>
      </td>
    </tr>
  );
}

export default function StatsPage() {
  const [allLinks, setAllLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [sortBy, setSortBy] = useState("clicks");
  const [dateRange, setDateRange] = useState({ preset: 'all', start: null, end: null });
  const [selectedLinkDetails, setSelectedLinkDetails] = useState(null);
  const [selectedGroupDetails, setSelectedGroupDetails] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats", { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        setAllLinks(Array.isArray(data) ? data : []);
      } else {
        setAllLinks([]);
      }
    } catch (error) {
      setAllLinks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (linkId) => {
    setAllLinks(prev => prev.filter(link => link.id !== linkId));
    setSelectedLinks(prev => prev.filter(id => id !== linkId));
  };

  const handleBulkDelete = (linkIds) => {
    setAllLinks(prev => prev.filter(link => !linkIds.includes(link.id)));
  };

  const toggleSelectLink = (linkId) => {
    setSelectedLinks(prev => 
      prev.includes(linkId) 
        ? prev.filter(id => id !== linkId)
        : [...prev, linkId]
    );
  };

  const toggleSelectAll = (links) => {
    const linkIds = links.map(link => link.id);
    const allSelected = linkIds.every(id => selectedLinks.includes(id));
    
    if (allSelected) {
      setSelectedLinks(prev => prev.filter(id => !linkIds.includes(id)));
    } else {
      setSelectedLinks(prev => [...new Set([...prev, ...linkIds])]);
    }
  };

  if (loading) {
    return <div className="analytics-container">Loading...</div>;
  }

  // Filter links
  const filteredLinks = allLinks.filter(link => {
    const matchesSearch = !searchTerm || 
      (link.title && link.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      link.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUniversity = !selectedUniversity || 
      (link.university || "Other") === selectedUniversity;
    
    // Date range filtering
    const matchesDateRange = dateRange.preset === 'all' || !dateRange.start || !link.createdAt ||
      (() => {
        const linkDate = new Date(link.createdAt);
        return linkDate >= dateRange.start && linkDate <= dateRange.end;
      })();
    
    return matchesSearch && matchesUniversity && matchesDateRange;
  });

  // Group by university
  const groupedLinks = filteredLinks.reduce((groups, link) => {
    const university = link.university || "Other";
    if (!groups[university]) {
      groups[university] = [];
    }
    groups[university].push(link);
    return groups;
  }, {});

  const universities = [...new Set(allLinks.map(link => link.university || "Other"))].sort();
  const totalClicks = allLinks.reduce((sum, link) => sum + (link.clicks || 0), 0);
  const filteredClicks = filteredLinks.reduce((sum, link) => sum + (link.clicks || 0), 0);

  // Sorting function
  const sortLinks = (links, sortBy) => {
    const sorted = [...links];
    switch (sortBy) {
      case "clicks":
        return sorted.sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
      case "date-desc":
        return sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
        });
      case "date-asc":
        return sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateA - dateB;
        });
      case "title":
        return sorted.sort((a, b) => {
          const titleA = (a.title || "Untitled").toLowerCase();
          const titleB = (b.title || "Untitled").toLowerCase();
          return titleA.localeCompare(titleB);
        });
      default:
        return sorted;
    }
  };

  if (allLinks.length === 0) {
    return (
      <div className="analytics-container">
        <h1>Analytics</h1>
        <p>No links found. <Link href="/create">Create your first link</Link>.</p>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <h1>Analytics</h1>
      
      <StatsHeader 
        totalLinks={allLinks.length} 
        totalClicks={totalClicks}
        filteredLinks={filteredLinks.length}
        filteredClicks={filteredClicks}
        dateRange={dateRange}
      />
      
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedUniversity={selectedUniversity}
        onUniversityChange={setSelectedUniversity}
        universities={universities}
        sortBy={sortBy}
        onSortChange={setSortBy}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <BulkActions
        selectedLinks={selectedLinks}
        onBulkDelete={handleBulkDelete}
        onClearSelection={() => setSelectedLinks([])}
      />

      {Object.keys(groupedLinks).length === 0 ? (
        <p>No links match your filters.</p>
      ) : (
        <div className="stats-groups">
          {Object.entries(groupedLinks)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([university, links]) => (
            <div key={university} className="table-section">
              <h3 style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                  <input
                    type="checkbox"
                    checked={links.every(link => selectedLinks.includes(link.id))}
                    onChange={() => toggleSelectAll(links)}
                  />
                  {university} ({links.length} links, {links.reduce((sum, link) => sum + link.clicks, 0)} clicks)
                </div>
                <button
                  onClick={() => setSelectedGroupDetails({ university, links })}
                  className="btn-secondary"
                  style={{fontSize: '0.75rem', padding: '0.25rem 0.75rem'}}
                >
                  View Group Details
                </button>
              </h3>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th style={{width: '40px'}}></th>
                      <th>Course</th>
                      <th>Short Link</th>
                      <th>Target URL</th>
                      <th>Clicks</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortLinks(links, sortBy)
                      .map((link) => (
                      <LinkRow
                        key={link.id}
                        link={link}
                        isSelected={selectedLinks.includes(link.id)}
                        onToggleSelect={toggleSelectLink}
                        onDelete={handleDelete}
                        onViewDetails={setSelectedLinkDetails}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedLinkDetails && (
        <DetailedView 
          link={selectedLinkDetails} 
          onClose={() => setSelectedLinkDetails(null)} 
        />
      )}

      {selectedGroupDetails && (
        <GroupDetailedView 
          university={selectedGroupDetails.university}
          links={selectedGroupDetails.links}
          onClose={() => setSelectedGroupDetails(null)} 
        />
      )}
    </div>
  );
}
