"use client";
import { forwardRef } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;
export const SelectTrigger = forwardRef(function SelectTrigger(
  { className, children, ...props },
  ref,
) {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex min-h-12 w-full items-center justify-between gap-2 rounded-xl border border-input bg-[#fbfcff] dark:bg-background px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring disabled:opacity-50 aria-invalid:border-destructive [&>span]:truncate",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});
export function SelectContent({ className, children, ...props }) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position="popper"
        sideOffset={5}
        className={cn(
          "relative z-50 max-h-[min(320px,var(--radix-select-content-available-height))] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-xl animate-in fade-in-0 zoom-in-95",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="flex justify-center py-1">
          <ChevronUp className="size-4" />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex justify-center py-1">
          <ChevronDown className="size-4" />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}
export function SelectItem({ children, className, ...props }) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex min-h-11 cursor-default select-none items-center rounded-lg py-2 pl-9 pr-3 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute left-3 flex size-4 items-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
