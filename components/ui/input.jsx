import { forwardRef } from "react";
import { cn } from "@/lib/utils";
export const Input = forwardRef(function Input(
  { className, type = "text", ...props },
  ref,
) {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex min-h-12 w-full min-w-0 rounded-xl border border-input bg-[#fbfcff] dark:bg-background px-3.5 py-3 text-base shadow-xs outline-none transition-colors placeholder:text-muted-foreground/65 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm",
        className,
      )}
      {...props}
    />
  );
});
export const Textarea = forwardRef(function Textarea(
  { className, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-28 w-full rounded-xl border border-input bg-[#fbfcff] dark:bg-background px-3.5 py-3 text-base outline-none placeholder:text-muted-foreground/65 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 aria-invalid:border-destructive md:text-sm",
        className,
      )}
      {...props}
    />
  );
});
