import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient, isSupabaseConfiguredServer } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { FabCreatePlan } from "@/components/layout/FabCreatePlan";
import { InteractivePartyBackground } from "@/components/layout/InteractivePartyBackground";
import { PlansProvider, CreatePlanModal } from "@/features/plans";
import { PendingFriendInviteSync } from "@/features/friends";

export const instant = false;

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();

  if (isSupabaseConfiguredServer()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }
  }

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
          {/* Sincronizador de invitación de amistad tras registro/onboarding */}
          <Suspense fallback={null}>
            <PendingFriendInviteSync />
          </Suspense>
        </div>
      </div>
    </PlansProvider>
  );
}
