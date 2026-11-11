import { cn } from "@/lib/utils";
export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card text-card-foreground shadow-[0_3px_18px_-8px_rgba(16,27,61,0.10)]",
        className,
      )}
      {...props}
    />
  );
}
export function CardHeader({ className, ...props }) {
  return (
    <div className={cn("p-5 pb-3 sm:p-6 sm:pb-4", className)} {...props} />
  );
}
export function CardTitle({ className, ...props }) {
  return (
    <h2
      className={cn("text-base font-semibold tracking-tight", className)}
      {...props}
    />
  );
}
export function CardDescription({ className, ...props }) {
  return (
    <p
      className={cn(
        "mt-1 text-sm leading-relaxed text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
export function CardContent({ className, ...props }) {
  return (
    <div className={cn("p-5 pt-0 sm:p-6 sm:pt-0", className)} {...props} />
  );
}
