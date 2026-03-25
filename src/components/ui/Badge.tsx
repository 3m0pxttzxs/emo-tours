type BadgeVariant = "default" | "success" | "warning" | "error" | "info";

interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[#ebe7e7] text-[#1c1b1b]",
  success: "bg-[#4cbb17]/10 text-[#256d00]",
  warning: "bg-amber-100 text-amber-800",
  error: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
};

export default function Badge({ text, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full text-xs font-bold uppercase tracking-wider px-3 py-1 ${variantStyles[variant]}`}
    >
      {text}
    </span>
  );
}
