import type { Metadata } from "next";
import { Orbitron, Space_Mono } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "VehicleOS — Dashboard",
  description: "Vehicle data intelligence dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${spaceMono.variable} h-full`}
    >
      <body className="h-full bg-background text-text-primary antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
