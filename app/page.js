"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";

export default function HomePage() {
  const { user, loading } = useAuth();

  return (
    <div className="neo-brutal-home">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          {/* Logo and Title */}
          <div className="brand-section">
            <div className="logo-container">
              <Image 
                src="/penseum-logo.svg" 
                alt="Penseum Logo" 
                width={80} 
                height={80}
                className="penseum-logo"
              />
              <h1 className="brand-title">PENSEUM</h1>
            </div>
            <div className="subtitle-container">
              <h2 className="subtitle">LINK SHORTENER</h2>
              <div className="accent-line"></div>
            </div>
          </div>

          {/* Description */}
          <div className="description-card">
            <p className="description-text">
              CREATE POWERFUL SHORT LINKS FOR YOUR PENSEUM COURSES. 
              TRACK ANALYTICS. MANAGE UNIVERSITIES. DOMINATE THE DIGITAL SPACE.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="action-section">
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            ) : user ? (
              <div className="button-grid">
                <Link href="/dashboard" className="neo-btn neo-btn-primary">
                  <span>DASHBOARD</span>
                  <div className="btn-shadow"></div>
                </Link>
                <Link href="/create" className="neo-btn neo-btn-secondary">
                  <span>CREATE LINKS</span>
                  <div className="btn-shadow"></div>
                </Link>
                <Link href="/universities" className="neo-btn neo-btn-tertiary">
                  <span>UNIVERSITIES</span>
                  <div className="btn-shadow"></div>
                </Link>
              </div>
            ) : (
              <div className="button-grid">
                <Link href="/auth/register" className="neo-btn neo-btn-primary">
                  <span>GET STARTED</span>
                  <div className="btn-shadow"></div>
                </Link>
                <Link href="/auth/login" className="neo-btn neo-btn-secondary">
                  <span>SIGN IN</span>
                  <div className="btn-shadow"></div>
                </Link>
              </div>
            )}
          </div>

          {/* Features Grid */}
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>ANALYTICS</h3>
              <p>Track clicks and performance</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎓</div>
              <h3>UNIVERSITIES</h3>
              <p>Manage educational institutions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>FAST LINKS</h3>
              <p>Lightning-fast redirects</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔗</div>
              <h3>BATCH CREATE</h3>
              <p>Create multiple links at once</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>
    </div>
  );
}