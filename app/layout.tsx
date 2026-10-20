import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "APParchar | Planea, Vota y Parchea con tus Amigos",
  description: "La app para armar parches, cuadrar planes, votar y gestionar la vaca sin enredos.",
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-theme="dark" suppressHydrationWarning>
      <body className="antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
