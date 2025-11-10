import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "Penseum Link Shortener",
  description: "Create beautiful short links for Penseum courses with analytics",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
