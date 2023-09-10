import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Genius",
  description: "AI SAAS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <div>
        <body className={inter.className}>
          <div>
            {/* <div className=" hidden md:block bg-[#2b2e3a] h-screen w-[17%] top-0 left-0">
              <Navbar />
            </div> */}
            <div>{children}</div>
          </div>
        </body>
      </div>
    </html>
  );
}
