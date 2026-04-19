import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const headingFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata = {
  title: "Richards Property Management",
  description:
    "Land clearing, drainage, tree work, and property services in Central Arkansas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${bodyFont.variable} ${headingFont.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}