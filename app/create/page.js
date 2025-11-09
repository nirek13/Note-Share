"use client";

import { useState } from "react";

export default function CreatePage() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
  };

  return (
    <div className="container">
      <h1>Create Short Link</h1>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="url">Penseum Course URL *</label>
          <input
            type="text"
            id="url"
            name="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            placeholder="https://app.penseum.com/course/9c069ce4-8dc6-4f7c-b7ec-67c0d7fc5269"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Creating..." : "Create Short Link"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {shortUrl && (
        <div className="success">
          <h2>Link Created!</h2>
          <div className="url-display">
            <code>{shortUrl}</code>
            <button onClick={copyToClipboard} className="btn-secondary">
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
