"use client";

import React, { useEffect, useRef } from "react";

/**
 * ===================================================================
 * InteractivePartyBackground - Fondo Abstracto 3D con Parallax
 * ===================================================================
 * Representa la fiesta y "el parche" mediante:
 * 1. Cintas fluidas 3D con gradientes dinámicos (Azul eléctrico, Magenta, Ámbar).
 * 2. Formas geométricas suaves 3D (esferas volumétricas, aros/toros de neón,
 *    gemas poliédricas y confeti bokeh flotante).
 * 3. Parallax multi-capa sensible a mouse, scroll, touch y orientación de dispositivo.
 * 4. Transición suave de 0.3s entre Modo Noche (#0A1128) y Modo Día (#E2E8F0).
 * 5. Adaptativo y responsive para móviles, tablets y monitores ultrawide.
 */

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface GeometricShape {
  type: "sphere" | "ring" | "diamond" | "spark";
  x: number;
  y: number;
  z: number;
  size: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  speedRot: number;
  colorType: "primary" | "warning" | "magenta" | "cyan";
  pulseOffset: number;
}

export function InteractivePartyBackground({
  variant = "auth",
}: {
  variant?: "auth" | "ambient";
} = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Parallax Coordinates (Smooth Lerp)
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let targetScrollY = 0;
    let currentScrollY = 0;

    // Theme transition progress: 0 = Dark (#0A1128), 1 = Light (#E2E8F0)
    let currentTheme: "dark" | "light" =
      (document.documentElement.getAttribute("data-theme") as "light" | "dark") || "dark";
    let targetThemeProgress = currentTheme === "light" ? 1 : 0;
    let currentThemeProgress = targetThemeProgress;

    // Handle Resize with Device Pixel Ratio for Retina displays
    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Mouse & Touch Move Handlers
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ("touches" in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ("clientX" in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      targetMouseX = (clientX / width - 0.5) * 2; // -1 a 1
      targetMouseY = (clientY / height - 0.5) * 2; // -1 a 1
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY || window.pageYOffset || 0;
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        targetMouseX = Math.max(-1, Math.min(1, e.gamma / 30));
        targetMouseY = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
      }
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation, { passive: true });
    }

    // Observer for Theme Changes
    const updateThemeState = () => {
      const themeAttr = document.documentElement.getAttribute("data-theme");
      const isLight = themeAttr === "light";
      targetThemeProgress = isLight ? 1 : 0;
    };

    const observer = new MutationObserver(updateThemeState);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const handleCustomThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      targetThemeProgress = customEvent.detail === "light" ? 1 : 0;
    };
    window.addEventListener("apparchar:theme-change", handleCustomThemeChange);

    // Initial Geometric Shapes Population
    const shapes: GeometricShape[] = [
      // Esferas 3D Volumétricas
      {
        type: "sphere",
        x: -0.38,
        y: -0.32,
        z: 0.45,
        size: 55,
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        speedRot: 0.008,
        colorType: "primary",
        pulseOffset: 0,
      },
      {
        type: "sphere",
        x: 0.42,
        y: 0.35,
        z: 0.7,
        size: 70,
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        speedRot: 0.006,
        colorType: "warning",
        pulseOffset: 2.1,
      },
      {
        type: "sphere",
        x: 0.36,
        y: -0.4,
        z: 0.3,
        size: 38,
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        speedRot: 0.012,
        colorType: "magenta",
        pulseOffset: 4.2,
      },
      // Aros / Toros de Neón 3D
      {
        type: "ring",
        x: -0.42,
        y: 0.28,
        z: 0.6,
        size: 65,
        rotX: 0.4,
        rotY: 0.2,
        rotZ: 0.1,
        speedRot: 0.015,
        colorType: "warning",
        pulseOffset: 1.2,
      },
      {
        type: "ring",
        x: 0.45,
        y: -0.22,
        z: 0.5,
        size: 50,
        rotX: 0.6,
        rotY: -0.4,
        rotZ: 0.3,
        speedRot: 0.018,
        colorType: "primary",
        pulseOffset: 3.4,
      },
      // Gemas / Poliedros Diamante 3D
      {
        type: "diamond",
        x: -0.22,
        y: -0.42,
        z: 0.8,
        size: 32,
        rotX: 0.1,
        rotY: 0.3,
        rotZ: 0,
        speedRot: 0.02,
        colorType: "cyan",
        pulseOffset: 0.8,
      },
      {
        type: "diamond",
        x: 0.25,
        y: 0.42,
        z: 0.75,
        size: 28,
        rotX: 0.5,
        rotY: 0.1,
        rotZ: 0.2,
        speedRot: 0.022,
        colorType: "magenta",
        pulseOffset: 2.7,
      },
    ];

    // Partículas de Confeti Bokeh / Chispas del Parche
    const confettiCount = 28;
    for (let i = 0; i < confettiCount; i++) {
      shapes.push({
        type: "spark",
        x: (Math.random() - 0.5) * 1.8,
        y: (Math.random() - 0.5) * 1.8,
        z: 0.2 + Math.random() * 0.8,
        size: 3 + Math.random() * 6,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        speedRot: 0.01 + Math.random() * 0.02,
        colorType: i % 3 === 0 ? "warning" : i % 3 === 1 ? "primary" : "magenta",
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    // Color Interpolation Helper
    const lerpColor = (
      c1: [number, number, number],
      c2: [number, number, number],
      factor: number
    ): string => {
      const r = Math.round(c1[0] + (c2[0] - c1[0]) * factor);
      const g = Math.round(c1[1] + (c2[1] - c1[1]) * factor);
      const b = Math.round(c1[2] + (c2[2] - c1[2]) * factor);
      return `rgb(${r}, ${g}, ${b})`;
    };

    let time = 0;

    // Render Loop
    const render = () => {
      time += 0.012;

      // Smooth Lerp of mouse & scroll
      currentMouseX += (targetMouseX - currentMouseX) * 0.055;
      currentMouseY += (targetMouseY - currentMouseY) * 0.055;
      currentScrollY += (targetScrollY - currentScrollY) * 0.08;

      // Smooth 0.3s transition for theme progress
      currentThemeProgress += (targetThemeProgress - currentThemeProgress) * 0.12;

      ctx.clearRect(0, 0, width, height);

      // 1. Fondos Dinámicos de Iluminación Ambiental (Atmósfera)
      // Noche: #0A1128 -> Día: #E2E8F0
      const bgColor = lerpColor([10, 17, 40], [226, 232, 240], currentThemeProgress);
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // Aura Ambiental Superior Izquierda (Azul Eléctrico / Violeta)
      const aura1X = width * 0.25 + currentMouseX * 45;
      const aura1Y = height * 0.25 + currentMouseY * 45;
      const aura1Radius = Math.max(width, height) * 0.55;
      const gradAura1 = ctx.createRadialGradient(aura1X, aura1Y, 10, aura1X, aura1Y, aura1Radius);

      if (currentThemeProgress < 0.5) {
        gradAura1.addColorStop(0, "rgba(79, 70, 229, 0.28)");
        gradAura1.addColorStop(0.5, "rgba(124, 58, 237, 0.12)");
        gradAura1.addColorStop(1, "rgba(10, 17, 40, 0)");
      } else {
        gradAura1.addColorStop(0, "rgba(79, 70, 229, 0.18)");
        gradAura1.addColorStop(0.5, "rgba(168, 85, 247, 0.08)");
        gradAura1.addColorStop(1, "rgba(226, 232, 240, 0)");
      }
      ctx.fillStyle = gradAura1;
      ctx.fillRect(0, 0, width, height);

      // Aura Ambiental Inferior Derecha (Ámbar / Magenta de Fiesta)
      const aura2X = width * 0.8 - currentMouseX * 35;
      const aura2Y = height * 0.8 - currentMouseY * 35;
      const aura2Radius = Math.max(width, height) * 0.5;
      const gradAura2 = ctx.createRadialGradient(aura2X, aura2Y, 10, aura2X, aura2Y, aura2Radius);

      if (currentThemeProgress < 0.5) {
        gradAura2.addColorStop(0, "rgba(245, 158, 11, 0.22)");
        gradAura2.addColorStop(0.45, "rgba(217, 70, 239, 0.14)");
        gradAura2.addColorStop(1, "rgba(10, 17, 40, 0)");
      } else {
        gradAura2.addColorStop(0, "rgba(245, 158, 11, 0.16)");
        gradAura2.addColorStop(0.45, "rgba(236, 72, 153, 0.08)");
        gradAura2.addColorStop(1, "rgba(226, 232, 240, 0)");
      }
      ctx.fillStyle = gradAura2;
      ctx.fillRect(0, 0, width, height);

      // 2. Cintas Fluidas 3D (Ribbons del Parche)
      // Función para dibujar una cinta sinuosa 3D con múltiples puntos de control y parallax por profundidad
      const drawFluidRibbon = (
        depth: number,
        baseYRatio: number,
        amplitude: number,
        frequency: number,
        thickness: number,
        colorStart: string,
        colorMid: string,
        colorEnd: string,
        speedOffset: number
      ) => {
        ctx.save();
        const parallaxX = currentMouseX * (depth * 55);
        const parallaxY = currentMouseY * (depth * 45) - (currentScrollY * 0.15 * depth);

        const points: { x: number; y: number }[] = [];
        const steps = 36;
        const stepWidth = (width * 1.3) / steps;
        const startX = -width * 0.15 + parallaxX;

        for (let i = 0; i <= steps; i++) {
          const px = startX + i * stepWidth;
          const normalX = i / steps;
          const wave =
            Math.sin(normalX * Math.PI * frequency + time * speedOffset) * amplitude +
            Math.cos(normalX * Math.PI * 2.5 + time * 0.8) * (amplitude * 0.35);
          const py = height * baseYRatio + wave + parallaxY;
          points.push({ x: px, y: py });
        }

        // Gradiente a lo largo de la cinta
        const ribbonGrad = ctx.createLinearGradient(
          points[0].x,
          points[0].y,
          points[points.length - 1].x,
          points[points.length - 1].y
        );
        ribbonGrad.addColorStop(0, colorStart);
        ribbonGrad.addColorStop(0.5, colorMid);
        ribbonGrad.addColorStop(1, colorEnd);

        // Capa inferior con volumen y luz
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y - thickness * 0.5);
        for (let i = 1; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y + thickness * 0.5);

        for (let i = points.length - 2; i > 0; i--) {
          const xc = (points[i].x + points[i - 1].x) / 2;
          const yc = (points[i].y + points[i - 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y + thickness, xc, yc + thickness);
        }
        ctx.closePath();

        ctx.fillStyle = ribbonGrad;
        if (currentThemeProgress < 0.5) {
          ctx.shadowColor = colorMid;
          ctx.shadowBlur = 18 * depth;
        } else {
          ctx.shadowColor = "rgba(148, 163, 184, 0.3)";
          ctx.shadowBlur = 8 * depth;
        }
        ctx.fill();

        // Línea central de brillo neón
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.strokeStyle = currentThemeProgress < 0.5 ? "rgba(255, 255, 255, 0.45)" : "rgba(255, 255, 255, 0.85)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.restore();
      };

      // Cinta 1: Azul Eléctrico (#4F46E5) / Violeta Profundo (Capa Trasera - Depth 0.35)
      drawFluidRibbon(
        0.35,
        0.28,
        height * 0.09,
        1.6,
        34,
        currentThemeProgress < 0.5 ? "rgba(79, 70, 229, 0.45)" : "rgba(79, 70, 229, 0.28)",
        currentThemeProgress < 0.5 ? "rgba(99, 102, 241, 0.65)" : "rgba(99, 102, 241, 0.45)",
        currentThemeProgress < 0.5 ? "rgba(168, 85, 247, 0.35)" : "rgba(168, 85, 247, 0.22)",
        0.7
      );

      // Cinta 2: Ámbar (#F59E0B) / Miel Dorada de Fiesta (Capa Media - Depth 0.6)
      drawFluidRibbon(
        0.6,
        0.68,
        height * 0.12,
        2.1,
        28,
        currentThemeProgress < 0.5 ? "rgba(245, 158, 11, 0.55)" : "rgba(217, 119, 6, 0.38)",
        currentThemeProgress < 0.5 ? "rgba(251, 191, 36, 0.75)" : "rgba(245, 158, 11, 0.55)",
        currentThemeProgress < 0.5 ? "rgba(249, 115, 22, 0.45)" : "rgba(234, 88, 12, 0.32)",
        -0.85
      );

      // Cinta 3: Magenta Neón / Cian Electrónico (Capa Frontal - Depth 0.85)
      drawFluidRibbon(
        0.85,
        0.48,
        height * 0.07,
        2.6,
        16,
        currentThemeProgress < 0.5 ? "rgba(217, 70, 239, 0.5)" : "rgba(192, 38, 211, 0.32)",
        currentThemeProgress < 0.5 ? "rgba(236, 72, 153, 0.65)" : "rgba(219, 39, 119, 0.42)",
        currentThemeProgress < 0.5 ? "rgba(79, 70, 229, 0.4)" : "rgba(79, 70, 229, 0.25)",
        1.1
      );

      // 3. Renderizado de Formas Geométricas 3D Suaves
      shapes.forEach((shape) => {
        shape.rotX += shape.speedRot;
        shape.rotY += shape.speedRot * 1.3;

        // Proyección de posición con Parallax y ondulación sinusoidal
        const floatY = Math.sin(time + shape.pulseOffset) * 12;
        const floatX = Math.cos(time * 0.8 + shape.pulseOffset) * 8;

        const posX = width * (0.5 + shape.x) + currentMouseX * (shape.z * 70) + floatX;
        const posY =
          height * (0.5 + shape.y) +
          currentMouseY * (shape.z * 60) -
          (currentScrollY * 0.2 * shape.z) +
          floatY;

        ctx.save();
        ctx.translate(posX, posY);

        if (shape.type === "sphere") {
          // Esfera 3D con iluminación especular volumétrica
          const r = shape.size;
          const lightOffsetX = -r * 0.32;
          const lightOffsetY = -r * 0.32;

          const sphereGrad = ctx.createRadialGradient(
            lightOffsetX,
            lightOffsetY,
            r * 0.08,
            0,
            0,
            r
          );

          if (shape.colorType === "primary") {
            if (currentThemeProgress < 0.5) {
              sphereGrad.addColorStop(0, "#C7D2FE");
              sphereGrad.addColorStop(0.35, "#6366F1");
              sphereGrad.addColorStop(0.85, "#312E81");
              sphereGrad.addColorStop(1, "#0A1128");
            } else {
              sphereGrad.addColorStop(0, "#FFFFFF");
              sphereGrad.addColorStop(0.35, "#818CF8");
              sphereGrad.addColorStop(0.85, "#4F46E5");
              sphereGrad.addColorStop(1, "#3730A3");
            }
          } else if (shape.colorType === "warning") {
            if (currentThemeProgress < 0.5) {
              sphereGrad.addColorStop(0, "#FEF3C7");
              sphereGrad.addColorStop(0.35, "#F59E0B");
              sphereGrad.addColorStop(0.85, "#B45309");
              sphereGrad.addColorStop(1, "#131C35");
            } else {
              sphereGrad.addColorStop(0, "#FFFFFF");
              sphereGrad.addColorStop(0.35, "#FBBF24");
              sphereGrad.addColorStop(0.85, "#D97706");
              sphereGrad.addColorStop(1, "#92400E");
            }
          } else {
            // Magenta / Neon
            if (currentThemeProgress < 0.5) {
              sphereGrad.addColorStop(0, "#FBCFE8");
              sphereGrad.addColorStop(0.35, "#D946EF");
              sphereGrad.addColorStop(0.85, "#86198F");
              sphereGrad.addColorStop(1, "#0A1128");
            } else {
              sphereGrad.addColorStop(0, "#FFFFFF");
              sphereGrad.addColorStop(0.35, "#E879F9");
              sphereGrad.addColorStop(0.85, "#A21CAF");
              sphereGrad.addColorStop(1, "#701A75");
            }
          }

          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fillStyle = sphereGrad;

          if (currentThemeProgress < 0.5) {
            ctx.shadowColor = shape.colorType === "warning" ? "rgba(245, 158, 11, 0.4)" : "rgba(79, 70, 229, 0.4)";
            ctx.shadowBlur = 20 * shape.z;
          } else {
            ctx.shadowColor = "rgba(148, 163, 184, 0.35)";
            ctx.shadowBlur = 12 * shape.z;
          }
          ctx.fill();

          // Brillo de reborde sutil
          ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
          ctx.lineWidth = 1;
          ctx.stroke();
        } else if (shape.type === "ring") {
          // Aro / Toroide 3D con perspectiva de inclinación rotacional
          const r = shape.size;
          const tilt = Math.cos(shape.rotX);
          ctx.rotate(shape.rotZ + time * 0.2);
          ctx.scale(1, Math.max(0.2, Math.abs(tilt)));

          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);

          const ringColor =
            shape.colorType === "warning"
              ? currentThemeProgress < 0.5
                ? "#F59E0B"
                : "#D97706"
              : currentThemeProgress < 0.5
              ? "#818CF8"
              : "#4F46E5";

          ctx.strokeStyle = ringColor;
          ctx.lineWidth = 4 * shape.z;
          ctx.shadowColor = ringColor;
          ctx.shadowBlur = currentThemeProgress < 0.5 ? 18 * shape.z : 8 * shape.z;
          ctx.stroke();

          // Brillo metálico en el aro
          ctx.beginPath();
          ctx.arc(0, 0, r, Math.PI * 0.2, Math.PI * 0.7);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
          ctx.lineWidth = 2 * shape.z;
          ctx.stroke();
        } else if (shape.type === "diamond") {
          // Gema Poliédrica 3D rotante (Fiesta / El Parche)
          const s = shape.size;
          ctx.rotate(shape.rotY);

          const diamondGrad = ctx.createLinearGradient(-s, -s, s, s);
          if (shape.colorType === "cyan") {
            diamondGrad.addColorStop(0, "rgba(6, 182, 212, 0.85)");
            diamondGrad.addColorStop(1, "rgba(79, 70, 229, 0.85)");
          } else {
            diamondGrad.addColorStop(0, "rgba(244, 63, 94, 0.85)");
            diamondGrad.addColorStop(1, "rgba(245, 158, 11, 0.85)");
          }

          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.lineTo(s * 0.8, 0);
          ctx.lineTo(0, s);
          ctx.lineTo(-s * 0.8, 0);
          ctx.closePath();

          ctx.fillStyle = diamondGrad;
          ctx.shadowColor = diamondGrad.toString();
          ctx.shadowBlur = 12 * shape.z;
          ctx.fill();

          ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Arista interna de relieve 3D
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.lineTo(0, s);
          ctx.moveTo(-s * 0.8, 0);
          ctx.lineTo(s * 0.8, 0);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
          ctx.stroke();
        } else if (shape.type === "spark") {
          // Chispas de confeti y partículas festivas
          const alpha = 0.35 + Math.sin(time * 3 + shape.pulseOffset) * 0.35;
          ctx.rotate(shape.rotZ);

          const sparkColor =
            shape.colorType === "warning"
              ? `rgba(245, 158, 11, ${alpha})`
              : shape.colorType === "primary"
              ? `rgba(99, 102, 241, ${alpha})`
              : `rgba(217, 70, 239, ${alpha})`;

          ctx.fillStyle = sparkColor;
          ctx.beginPath();
          ctx.arc(0, 0, shape.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("apparchar:theme-change", handleCustomThemeChange);
      if (window.DeviceOrientationEvent) {
        window.removeEventListener("deviceorientation", handleOrientation);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden select-none"
      style={{
        zIndex: 0,
        backgroundColor: "var(--bg-main)",
        transition: "background-color 0.3s ease",
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          opacity: variant === "ambient" ? 0.65 : 1,
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
}
