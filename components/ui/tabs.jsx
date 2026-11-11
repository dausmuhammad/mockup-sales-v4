"use client";
import * as T from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
export const Tabs = T.Root;
export function TabsList({ className, ...props }) {
  return (
    <T.List
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-xl bg-muted p-1",
        className,
      )}
      {...props}
    />
  );
}
export function TabsTrigger({ className, ...props }) {
  return (
    <T.Trigger
      className={cn(
        "min-h-11 rounded-lg px-3 text-xs font-medium text-muted-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm sm:px-4 sm:text-sm",
        className,
      )}
      {...props}
    />
  );
}
