import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Patrick's Bills Mafia HQ",
  description: "Patrick's personal Buffalo football game-day command center.",
  applicationName: "Patrick's Mafia HQ",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/billshq-favicon.png",
    apple: "/billshq-favicon.png"
  }
};

export const viewport: Viewport = {
  themeColor: "#00338D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
