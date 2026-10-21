import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { FabCreatePlan } from "@/components/layout/FabCreatePlan";
import { InteractivePartyBackground } from "@/components/layout/InteractivePartyBackground";
import { PlansProvider, CreatePlanModal } from "@/features/plans";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PlansProvider>
      <div
        className="relative min-h-screen flex flex-col transition-colors overflow-x-hidden"
        style={{
          backgroundColor: "var(--bg-main)",
          color: "var(--text-primary)",
        }}
      >
        {/* Fondo Abstracto 3D Ambiental con Parallax y Soporte para Tema Día/Noche */}
        <InteractivePartyBackground variant="ambient" />

        {/* Contenido autenticado con z-index superior */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-24 md:pb-8">
            {children}
          </main>
          <FabCreatePlan />
          <Suspense fallback={null}>
            <MobileNav />
          </Suspense>
          {/* Modal de Creación de Parche con Pasos */}
          <CreatePlanModal />
        </div>
      </div>
    </PlansProvider>
  );
}
