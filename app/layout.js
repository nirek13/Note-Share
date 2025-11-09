import Link from "next/link";
import Image from "next/image";
import "./globals.css";

export const metadata = {
  title: "Penseum Link Shortener",
  description: "Create beautiful short links for Penseum courses with analytics",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <nav className="nav">
            <Link href="/" className="nav-brand">
              <Image
                src="/penseum-logo.svg"
                alt="Penseum"
                width={32}
                height={32}
                className="nav-logo"
              />
              Penseum Links
            </Link>
            <div className="nav-links">
              <Link href="/create">Create Links</Link>
              <Link href="/stats">Analytics</Link>
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
