import "./globals.css";
import { Fraunces, Manrope } from "next/font/google";
import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";
import AuthProvider from "./providers";
import ClientErrorTrap from "@/app/components/ClientErrorTrap/ClientErrorTrap";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata = {
  title: "PetPass | Pet records with real travel readiness",
  description: "PetPass keeps vaccinations, identity details, and travel paperwork ready in one calm, reliable place.",
  icons: { icon: "/icons/favicon.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${manrope.variable}`}>
        <AuthProvider>
          <ClientErrorTrap />
          <div className="siteShell">
            <Navbar />
            <main className="siteMain">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
