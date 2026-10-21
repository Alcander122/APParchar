"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, LogIn, Loader2, Zap, ShieldAlert, MailCheck } from "lucide-react";
import "./LoginForm.css";
import { useLoginForm } from "./useLoginForm";
import { MESSAGES } from "@/lib/constants/messages";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

import { GoogleAuthButton } from "../GoogleAuthButton";

export function LoginForm() {
  const {
    state,
    formAction,
    isPending,
    showPassword,
    togglePasswordVisibility,
    emailInput,
    setEmailInput,
    passwordInput,
    setPasswordInput,
    handleQuickDemo,
    mockCredentials,
    redirectTarget,
    isUnauthorized,
    isInviteFlow,
  } = useLoginForm();

  return (
    <div className="login-card">
      {/* Botón de alternar Tema Claro / Oscuro */}
      <div className="flex justify-end mb-2">
        <ThemeToggle />
      </div>

      {/* Cabecera / Marca */}
      <header className="login-header">
        <div className="login-icon-badge">
          <Image
            src="/logo.jpg"
            alt={MESSAGES.BRAND.NAME}
            width={64}
            height={64}
            className="login-icon-img"
            priority
          />
        </div>
        <h1 className="login-title">
          {MESSAGES.AUTH.LOGIN_TITLE}{" "}
          <span className="login-gradient-text">{MESSAGES.BRAND.NAME}</span>
        </h1>
        <p className="login-subtitle">{MESSAGES.BRAND.SUBTITLE}</p>
      </header>

      {/* Alerta Contextual de Invitación a Parche */}
      {isInviteFlow && (
        <aside
          className="p-3.5 mb-4 rounded-xl border flex items-center gap-3 text-xs leading-relaxed"
          style={{
            backgroundColor: "var(--color-status-info-bg)",
            borderColor: "var(--color-brand-primary)",
            color: "var(--color-text-primary)",
          }}
        >
          <MailCheck className="w-5 h-5 shrink-0 text-indigo-400" />
          <div>
            <strong className="block font-bold">¡Tienes una invitación pendiente!</strong>
            <span>{MESSAGES.AUTH.INVITE_CONTEXT}</span>
          </div>
        </aside>
      )}

      {/* Alerta de Ruta Privada / No Autorizada */}
      {isUnauthorized && !isInviteFlow && (
        <div
          className="p-3 mb-4 rounded-xl border flex items-center gap-2.5 text-xs font-medium"
          style={{
            backgroundColor: "var(--color-status-error-bg)",
            borderColor: "var(--color-status-error)",
            color: "var(--color-status-error)",
          }}
        >
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{MESSAGES.AUTH.UNAUTHORIZED}</span>
        </div>
      )}

      {/* Banner de Credenciales Quemadas */}
      <aside className="login-demo-banner">
        <div>
          🔥 <strong>{MESSAGES.BRAND.DEMO_BANNER.PREFIX}</strong> Usa{" "}
          <code>{mockCredentials.email}</code> / clave:{" "}
          <code>{mockCredentials.password}</code> o entra directo con 1 clic.
        </div>
      </aside>

      {/* Alerta de Error si ocurre */}
      {state?.error && (
        <div className="login-error-alert" role="alert">
          <span>⚠️</span>
          <span>{state.error}</span>
        </div>
      )}

      {/* Formulario HTML */}
      <form action={formAction} className="login-form">
        {/* Input oculto para persistir el destino de retorno tras login */}
        <input type="hidden" name="redirect" value={redirectTarget} />

        <div className="login-form-group">
          <label htmlFor="email" className="login-label">
            {MESSAGES.AUTH.LABEL_EMAIL}
          </label>
          <input
            id="email"
            type="email"
            name="email"
            required
            autoComplete="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder={MESSAGES.AUTH.PLACEHOLDER_EMAIL}
            className="login-input"
          />
        </div>

        <div className="login-form-group">
          <div className="login-label-row">
            <label htmlFor="password" className="login-label">
              {MESSAGES.AUTH.LABEL_PASSWORD}
            </label>
            <Link href="/recuperar" className="login-link-forgot">
              {MESSAGES.AUTH.FORGOT_PASSWORD}
            </Link>
          </div>
          <div className="login-password-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              required
              autoComplete="current-password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder={MESSAGES.AUTH.PLACEHOLDER_PASSWORD}
              className="login-input login-password-input"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="login-eye-button"
              aria-label={showPassword ? "Ocultar clave" : "Mostrar clave"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Botón de Enviar Formulario */}
        <button type="submit" disabled={isPending} className="login-submit-button">
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{MESSAGES.AUTH.BTN_LOGIN_LOADING}</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>{MESSAGES.AUTH.BTN_LOGIN}</span>
            </>
          )}
        </button>
      </form>

      {/* Botón de Acceso Rápido Demo 1-Clic */}
      <button
        type="button"
        onClick={handleQuickDemo}
        className="login-quick-demo-button"
      >
        <Zap className="w-4 h-4" />
        <span>{MESSAGES.AUTH.BTN_QUICK_DEMO}</span>
      </button>

      {/* Separador de opciones de inicio de sesión */}
      <div className="login-divider">
        <span className="login-divider-line"></span>
        <span className="login-divider-text">{MESSAGES.AUTH.DIVIDER_OR}</span>
        <span className="login-divider-line"></span>
      </div>

      {/* Botón de Continuar con Google */}
      <GoogleAuthButton mode="login" redirectTarget={redirectTarget} />

      {/* Pie de Registro con preservación de redirect */}
      <footer className="login-footer-text">
        {MESSAGES.AUTH.NO_ACCOUNT}
        <Link
          href={redirectTarget ? `/register?redirect=${encodeURIComponent(redirectTarget)}` : "/register"}
          className="login-link-register"
        >
          {MESSAGES.AUTH.LINK_REGISTER}
        </Link>
      </footer>
    </div>
  );
}
