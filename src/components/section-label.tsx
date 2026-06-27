import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  variant?: "light" | "dark";
  className?: string;
}

/**
 * Recurring two-dot marker + uppercase label used to head every section.
 * On light backgrounds the lead dot is royal blue; on dark backgrounds white.
 */
export function SectionLabel({
  children,//Listo XD
  variant = "light",
  className,
}: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="flex items-center gap-1.5">
        <span
          className={cn(
            "h-3 w-3 rounded-full",
            variant === "light" ? "bg-primary" : "bg-white",
          )}
        />
        <span className="h-3 w-3 rounded-full bg-primary" />
      </span>
      <span
        className={cn(
          "text-xs font-extrabold uppercase tracking-[0.22em]",
          variant === "light" ? "text-foreground" : "text-white",
        )}
      >
        {children}
      </span>
    </div>
  );
}
