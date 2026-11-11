"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
export function ResetDemo({ className }) {
  const { actions } = useApp(),
    router = useRouter(),
    { setTheme } = useTheme(),
    [busy, setBusy] = useState(false),
    [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className={className}>
          <RotateCcw />
          Reset data demo
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Hapus seluruh data demo?</AlertDialogTitle>
        <AlertDialogDescription>
          Seluruh lead, foto survei, jadwal angsuran, preferensi, dan sesi demo
          pada browser ini akan dihapus. Tindakan ini tidak dapat dibatalkan.
        </AlertDialogDescription>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <AlertDialogCancel disabled={busy}>Batal</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={busy}
            onClick={async (e) => {
              e.preventDefault();
              setBusy(true);
              try {
                await actions.reset();
                setTheme("light");
                setOpen(false);
                toast.success("Seluruh data demo berhasil dihapus.");
                router.replace("/login");
              } catch {
                toast.error(
                  "Reset belum selesai. Sebagian data mungkin telah terhapus. Coba ulangi.",
                );
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Menghapus…" : "Ya, hapus data"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
