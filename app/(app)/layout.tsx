import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { FabCreatePlan } from "@/components/layout/FabCreatePlan";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col transition-colors"
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text-primary)",
      }}
    >
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-24 md:pb-8">
        {children}
      </main>
      <FabCreatePlan />
      <Suspense fallback={null}>
        <MobileNav />
      </Suspense>
    </div>
  );
}
