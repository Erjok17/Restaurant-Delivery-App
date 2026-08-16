import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  href?: string;
};

const variants = {
  primary: "bg-neutral-900 text-white hover:bg-neutral-700",
  secondary: "bg-gold text-white hover:bg-gold-dark",
  outline: "border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white",
};

export default function Button({
  children,
  variant = "primary",
  href,
  className = "",
  ...props
}: ButtonProps) {
  const classes = `rounded-full px-6 py-3 text-sm font-semibold transition-colors disabled:opacity-50 ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}