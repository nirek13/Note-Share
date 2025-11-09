import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Penseum Link Shortener",
  description: "Personal link shortener for Penseum shared courses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <nav className="nav">
            <Link href="/" className="nav-brand">
              Penseum Links
            </Link>
            <div className="nav-links">
              <Link href="/create">Create</Link>
              <Link href="/stats">Stats</Link>
              <Link href="/tags">Tags</Link>
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <p>Penseum Link Shortener</p>
        </footer>
      </body>
    </html>
  );
}
