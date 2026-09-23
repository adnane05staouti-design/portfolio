import type { Metadata } from "next";
import { isAdminEnabled } from "@/lib/admin";
import KeystaticApp from "./keystatic";

export const metadata: Metadata = {
  title: "Admin — Portfolio",
  robots: { index: false, follow: false },
};

/** Separate root layout: the admin has its own UI, independent from the site. */
export default function KeystaticLayout() {
  return (
    <html lang="en">
      <body>
        {isAdminEnabled ? (
          <KeystaticApp />
        ) : (
          <main style={{ fontFamily: "system-ui, sans-serif", padding: "4rem 1.5rem", textAlign: "center" }}>
            <h1>404</h1>
            <p>This page could not be found.</p>
          </main>
        )}
      </body>
    </html>
  );
}
