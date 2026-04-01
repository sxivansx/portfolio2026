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
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
