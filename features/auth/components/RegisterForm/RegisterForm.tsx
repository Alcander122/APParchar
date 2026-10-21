"use client";

import Link from "next/link";
import Image from "next/image";
import { UserPlus, Loader2 } from "lucide-react";
import "./RegisterForm.css";
import { useRegisterForm } from "./useRegisterForm";
import { MESSAGES } from "@/lib/constants/messages";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

import { GoogleAuthButton } from "../GoogleAuthButton";

export function RegisterForm() {
  const { state, formAction, isPending, redirectTarget } = useRegisterForm();

  return (
    <div className="register-card">
      {/* Botón de alternar Tema Claro / Oscuro */}
      <div className="flex justify-end mb-2">
        <ThemeToggle />
      </div>

      <header className="register-header">
        <div className="register-icon-badge">
          <Image
            src="/logo.jpg"
            alt={MESSAGES.BRAND.NAME}
            width={64}
            height={64}
            className="register-icon-img"
            priority
          />
        </div>
        <h1 className="register-title">
          {MESSAGES.AUTH.REGISTER_TITLE}{" "}
          <span className="register-gradient-text">{MESSAGES.BRAND.NAME}</span>
        </h1>
        <p className="register-subtitle">{MESSAGES.AUTH.REGISTER_SUBTITLE}</p>
      </header>

      {state?.error && (
        <div className="register-error-alert" role="alert">
          <span>⚠️</span>
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction} className="register-form">
        <input type="hidden" name="redirect" value={redirectTarget} />
        <div className="register-form-group">
          <label htmlFor="fullName" className="register-label">
            {MESSAGES.AUTH.LABEL_FULL_NAME}
          </label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            required
            placeholder={MESSAGES.AUTH.PLACEHOLDER_FULL_NAME}
            className="register-input"
          />
        </div>

        <div className="register-form-group">
          <label htmlFor="email" className="register-label">
            {MESSAGES.AUTH.LABEL_EMAIL}
          </label>
          <input
            id="email"
            type="email"
            name="email"
            required
            placeholder={MESSAGES.AUTH.PLACEHOLDER_EMAIL}
            className="register-input"
          />
        </div>

        <div className="register-form-group">
          <label htmlFor="password" className="register-label">
            {MESSAGES.AUTH.LABEL_PASSWORD}
          </label>
          <input
            id="password"
            type="password"
            name="password"
            required
            minLength={3}
            placeholder={MESSAGES.AUTH.PLACEHOLDER_PASSWORD_HINT}
            className="register-input"
          />
        </div>

        <button type="submit" disabled={isPending} className="register-submit-button">
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{MESSAGES.AUTH.BTN_REGISTER_LOADING}</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>{MESSAGES.AUTH.BTN_REGISTER}</span>
            </>
          )}
        </button>
      </form>

      {/* Separador de opciones de registro */}
      <div className="register-divider">
        <span className="register-divider-line"></span>
        <span className="register-divider-text">{MESSAGES.AUTH.DIVIDER_OR}</span>
        <span className="register-divider-line"></span>
      </div>

      {/* Botón de Registrarse con Google */}
      <GoogleAuthButton mode="register" redirectTarget={redirectTarget} />

      <footer className="register-footer-text">
        {MESSAGES.AUTH.HAVE_ACCOUNT}
        <Link
          href={redirectTarget ? `/login?redirect=${encodeURIComponent(redirectTarget)}` : "/login"}
          className="register-link-login"
        >
          {MESSAGES.AUTH.LINK_LOGIN}
        </Link>
      </footer>
    </div>
  );
}
