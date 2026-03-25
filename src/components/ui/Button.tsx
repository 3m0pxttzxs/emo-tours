import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#4cbb17] text-[#1c1b1b] rounded-full font-heading font-bold hover:bg-[#3a960e]",
  secondary:
    "bg-[#1c1b1b] text-white rounded-full font-heading font-bold hover:bg-[#313030]",
  outline:
    "border border-[#1c1b1b] text-[#1c1b1b] rounded-full font-heading font-bold hover:bg-[#1c1b1b] hover:text-white",
  ghost: "text-[#4cbb17] font-heading font-bold hover:underline",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  children,
  className = "",
  type = "button",
  onClick,
  href,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const classes = [
    variantStyles[variant],
    sizeStyles[size],
    "inline-flex items-center justify-center gap-2 transition-colors active:scale-95 transition-transform",
    isDisabled ? "opacity-50 cursor-not-allowed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </>
  );

  if (href && !isDisabled) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
    >
      {content}
    </button>
  );
}
