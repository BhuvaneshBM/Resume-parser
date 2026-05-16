import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resume Parser",
  description: "Upload a resume PDF and view parsed structured fields.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-sans">
      <body>
        <main className="min-h-screen bg-slate-50">
          <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-6">
            <header className="mb-10 text-left text-lg font-semibold tracking-normal text-slate-950">
              Resume Parser
            </header>
            <div className="flex flex-1 items-center justify-center">{children}</div>
          </div>
        </main>
      </body>
    </html>
  );
}
