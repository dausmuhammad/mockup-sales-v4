import { cn } from "@/lib/utils";
export function Badge({ className, variant = "secondary", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        {
          secondary: "bg-secondary text-secondary-foreground",
          success:
            "bg-[#e7f8f1] text-[#13815e] dark:bg-emerald-500/10 dark:text-emerald-300",
          warning:
            "bg-[#fff3df] text-[#a66a12] dark:bg-amber-500/10 dark:text-amber-300",
          outline: "border text-muted-foreground",
        }[variant],
        className,
      )}
      {...props}
    />
  );
}
