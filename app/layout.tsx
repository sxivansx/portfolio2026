import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shivansh Pandey's Portfolio",
  description: "Portfolio website showcasing my work as a Brand, UI/UX, and Graphic Designer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 767px) {
            .mobile-gate-screen { display: flex !important; }
            .desktop-app { display: none !important; }
          }
          @media (min-width: 768px) {
            .mobile-gate-screen { display: none !important; }
            .desktop-app { display: contents !important; }
          }
        `}} />
      </head>
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
