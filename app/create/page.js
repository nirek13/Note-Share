"use client";

import { useState } from "react";

const PRESET_TAGS = [
  "psych",
  "history",
  "microecon",
  "macroecon",
  "math",
  "science",
  "english",
  "chem",
  "bio",
  "novelty",
];

export default function CreatePage() {
  const [formData, setFormData] = useState({
    id: "",
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    const trimmed = customTag.trim().toLowerCase();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags([...selectedTags, trimmed]);
      setCustomTag("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortUrl("");
    setLoading(true);

    try {
      const response = await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: formData.id,
          utm_source: formData.utm_source,
          utm_medium: formData.utm_medium,
          utm_campaign: formData.utm_campaign,
          tags: selectedTags,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create link");
      }

      setShortUrl(data.shortUrl);
      // Reset form
      setFormData({
        id: "",
        utm_source: "",
        utm_medium: "",
        utm_campaign: "",
      });
      setSelectedTags([]);
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
          <label htmlFor="id">Penseum Course URL or ID *</label>
          <input
            type="text"
            id="id"
            name="id"
            value={formData.id}
            onChange={handleInputChange}
            required
            placeholder="e.g., https://app.penseum.com/course/9c069ce4-8dc6-4f7c-b7ec-67c0d7fc5269 or abc123"
          />
        </div>

        <div className="form-group">
          <label htmlFor="utm_source">UTM Source *</label>
          <input
            type="text"
            id="utm_source"
            name="utm_source"
            value={formData.utm_source}
            onChange={handleInputChange}
            required
            placeholder="e.g., newsletter"
          />
        </div>

        <div className="form-group">
          <label htmlFor="utm_medium">UTM Medium *</label>
          <input
            type="text"
            id="utm_medium"
            name="utm_medium"
            value={formData.utm_medium}
            onChange={handleInputChange}
            required
            placeholder="e.g., email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="utm_campaign">UTM Campaign *</label>
          <input
            type="text"
            id="utm_campaign"
            name="utm_campaign"
            value={formData.utm_campaign}
            onChange={handleInputChange}
            required
            placeholder="e.g., spring2024"
          />
        </div>

        <div className="form-group">
          <label>Tags</label>
          <div className="tag-selector">
            {PRESET_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`tag ${selectedTags.includes(tag) ? "selected" : ""}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="custom-tag-input">
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              placeholder="Add custom tag"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomTag();
                }
              }}
            />
            <button type="button" onClick={addCustomTag}>
              Add
            </button>
          </div>
          {selectedTags.length > 0 && (
            <div className="selected-tags">
              Selected: {selectedTags.join(", ")}
            </div>
          )}
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
