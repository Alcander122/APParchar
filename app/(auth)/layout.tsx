import { InteractivePartyBackground } from "@/components/layout/InteractivePartyBackground";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden flex items-center justify-center">
      {/* Fondo Abstracto 3D Interactivo con Parallax y Soporte para Tema Día/Noche */}
      <InteractivePartyBackground />

      {/* Contenedor Principal de la Interfaz */}
      <div className="relative z-10 w-full flex items-center justify-center p-3 sm:p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
