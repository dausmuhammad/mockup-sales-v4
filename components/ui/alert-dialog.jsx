"use client";
import * as A from "@radix-ui/react-alert-dialog";
import { buttonVariants } from "./button";
export const AlertDialog = A.Root;
export const AlertDialogTrigger = A.Trigger;
export function AlertDialogContent({ children }) {
  return (
    <A.Portal>
      <A.Overlay className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm" />
      <A.Content className="fixed left-1/2 top-1/2 z-50 max-h-[85dvh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border bg-background p-6 shadow-xl">
        {children}
      </A.Content>
    </A.Portal>
  );
}
export function AlertDialogTitle(props) {
  return <A.Title className="text-lg font-semibold" {...props} />;
}
export function AlertDialogDescription(props) {
  return (
    <A.Description
      className="mt-2 text-sm leading-relaxed text-muted-foreground"
      {...props}
    />
  );
}
export function AlertDialogCancel(props) {
  return (
    <A.Cancel className={buttonVariants({ variant: "outline" })} {...props} />
  );
}
export function AlertDialogAction({ variant = "default", ...props }) {
  return <A.Action className={buttonVariants({ variant })} {...props} />;
}
