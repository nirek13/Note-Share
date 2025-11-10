"use client";

import Navigation from "@/components/Navigation";
import { AuthProvider } from "@/lib/auth-context";

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <Navigation />
      <main>{children}</main>
      <footer className="footer">
        <p>Penseum Link Shortener</p>
      </footer>
    </AuthProvider>
  );
}
