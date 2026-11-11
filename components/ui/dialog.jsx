"use client";
import * as D from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogClose = D.Close;
export function DialogContent({ children, className, ...props }) {
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm animate-in fade-in-0" />
      <D.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 max-h-[85dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border bg-background p-6 shadow-xl focus:outline-none animate-in fade-in-0 zoom-in-95",
          className,
        )}
        {...props}
      >
        {children}
        <D.Close className="absolute right-3 top-3 flex size-11 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring">
          <X className="size-4" />
          <span className="sr-only">Tutup</span>
        </D.Close>
      </D.Content>
    </D.Portal>
  );
}
export function DialogTitle(props) {
  return (
    <D.Title className="pr-9 text-xl font-semibold tracking-tight" {...props} />
  );
}
export function DialogDescription(props) {
  return (
    <D.Description
      className="mt-2 text-sm leading-relaxed text-muted-foreground"
      {...props}
    />
  );
}
