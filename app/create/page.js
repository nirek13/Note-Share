"use client";

import { useState } from "react";

export default function CreatePage() {
  const [mode, setMode] = useState("single"); // "single" or "batch"
  const [url, setUrl] = useState("");
  const [batchInput, setBatchInput] = useState("");
  const [university, setUniversity] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [batchResults, setBatchResults] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [duplicateUniversity, setDuplicateUniversity] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortUrl("");
    setLoading(true);

    try {
      const response = await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create link");
      }

      setShortUrl(data.shortUrl);
      setUrl("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchSubmit = async (e, confirmDuplicate = false) => {
    e.preventDefault();
    setError("");
    setBatchResults("");
    setLoading(true);

    try {
      const response = await fetch("/api/create-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          input: batchInput, 
          university, 
          confirmDuplicate 
        }),
      });

      const data = await response.json();

      if (response.status === 409 && data.error === "UNIVERSITY_EXISTS") {
        // Show confirmation dialog
        setDuplicateUniversity(data.existingUniversity);
        setShowConfirmDialog(true);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to create links");
      }

      // Format results to match input format
      const formatted = data.results
        .map(result => `${result.title}\n${result.shortUrl}`)
        .join('\n\n');
      
      setBatchResults(formatted);
      setBatchInput("");
      setUniversity("");
      setShowConfirmDialog(false);
      setDuplicateUniversity(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDuplicate = (e) => {
    setShowConfirmDialog(false);
    handleBatchSubmit(e, true);
  };

  const handleCancelDuplicate = () => {
    setShowConfirmDialog(false);
    setDuplicateUniversity(null);
    setLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="container">
      <h1>Create Short Links</h1>

      <div className="mode-selector">
        <button 
          className={`btn-secondary ${mode === "single" ? "active" : ""}`}
          onClick={() => setMode("single")}
        >
          Single URL
        </button>
        <button 
          className={`btn-secondary ${mode === "batch" ? "active" : ""}`}
          onClick={() => setMode("batch")}
        >
          Batch URLs
        </button>
      </div>

      {mode === "single" ? (
        <form onSubmit={handleSingleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="url">Penseum URL *</label>
            <input
              type="text"
              id="url"
              name="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              placeholder="https://app.penseum.com/shared/shared-course/abc123"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Creating..." : "Create Short Link"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleBatchSubmit} className="form">
          <div className="form-group">
            <label htmlFor="university">University (optional)</label>
            <input
              type="text"
              id="university"
              name="university"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="e.g., University of Michigan, Harvard University"
            />
          </div>

          <div className="form-group">
            <label htmlFor="batch">Course List (Title on one line, URL on next) *</label>
            <textarea
              id="batch"
              name="batch"
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              required
              rows={10}
              placeholder={`Fundamental Human Form and Function (ES 207)
https://app.penseum.com/shared/shared-course/raRUW7PUWFaaNuttgVm0jw
Introduction to Sociology (SOC 101DIS)
https://app.penseum.com/shared/shared-course/X0UXDoJbFLqgc15TFH-39w`}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Creating..." : "Create Short Links"}
          </button>
        </form>
      )}

      {error && <div className="error">{error}</div>}

      {/* Duplicate University Confirmation Dialog */}
      {showConfirmDialog && duplicateUniversity && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#DC2626' }}>
              University Already Exists
            </h3>
            <p style={{ marginBottom: '1rem', color: '#6B7280' }}>
              Links for <strong>"{duplicateUniversity.name}"</strong> have already been created. 
              This university currently has <strong>{duplicateUniversity.linkCount || 0} links</strong>.
            </p>
            <p style={{ marginBottom: '1.5rem', color: '#6B7280' }}>
              Do you want to proceed and add more links to this university?
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancelDuplicate}
                className="btn-secondary"
                style={{ minWidth: '100px' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDuplicate}
                className="btn-primary"
                style={{ minWidth: '100px' }}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {shortUrl && (
        <div className="success">
          <h2>Link Created!</h2>
          <div className="url-display">
            <code>{shortUrl}</code>
            <button onClick={() => copyToClipboard(shortUrl)} className="btn-secondary">
              Copy
            </button>
          </div>
        </div>
      )}

      {batchResults && (
        <div className="success">
          <h2>Links Created!</h2>
          <div className="batch-results">
            <textarea
              value={batchResults}
              readOnly
              rows={10}
              style={{ width: '100%', fontFamily: 'monospace' }}
            />
            <button onClick={() => copyToClipboard(batchResults)} className="btn-secondary">
              Copy All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
