"use client";

import "./globals.css";
import Navigation from "@/components/Navigation";
import { AuthProvider } from "@/lib/auth-context";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navigation />
          <main>{children}</main>
          <footer className="footer">
            <p>Penseum Link Shortener</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
