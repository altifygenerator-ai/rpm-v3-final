"use client";

import { cn } from "@/lib/utils";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const base =
    "px-6 py-3 rounded-md font-medium transition-all duration-200";

  const variants = {
    primary: "bg-[var(--accent)] text-black hover:brightness-110",
    secondary:
      "border border-[var(--border)] text-white hover:bg-[var(--muted)]",
  };

  return (
    <button
      className={cn(base, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}