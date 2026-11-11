"use client";
import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Check,
  ExternalLink,
  ImagePlus,
  LoaderCircle,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { getPhoto } from "@/lib/storage/photos";
import { validatePhoto } from "@/lib/validation/schemas";
export function PhotoCard({
  lead,
  documentKey,
  label,
  editable = false,
  onBusyChange,
}) {
  const metadata = lead.documents[documentKey],
    { actions } = useApp(),
    [url, setUrl] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    input = useRef(null),
    camera = useRef(null),
    mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    let active = true,
      objectUrl;
    setUrl("");
    setError("");
    if (metadata?.id)
      getPhoto(metadata.id)
        .then((file) => {
          if (!active) return;
          if (!file) {
            setError("Foto tidak ditemukan. Unggah kembali dokumen.");
            return;
          }
          objectUrl = URL.createObjectURL(file);
          setUrl(objectUrl);
        })
        .catch(() => {
          if (active) setError("Foto tidak dapat dimuat. Coba muat ulang.");
        });
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [metadata?.id]);
  async function upload(file) {
    if (!file || busy) return;
    setBusy(true);
    onBusyChange?.(true);
    setError("");
    try {
      await validatePhoto(file);
      await actions.savePhoto(lead.id, documentKey, file);
      toast.success(`${label} berhasil disimpan.`);
    } catch (e) {
      if (mounted.current) setError(e.message);
      toast.error(e.message);
    } finally {
      if (mounted.current) setBusy(false);
      onBusyChange?.(false);
      if (input.current) input.current.value = "";
      if (camera.current) camera.current.value = "";
    }
  }
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>
            {label}
            <span className="ml-1 text-primary">*</span>
          </CardTitle>
          <Badge variant={metadata && url ? "success" : "warning"}>
            {metadata && url ? (
              <>
                <Check className="size-3" />
                Tersimpan
              </>
            ) : (
              "Wajib"
            )}
          </Badge>
        </div>
        <CardDescription>
          {documentKey === "house"
            ? "Dokumentasikan kondisi rumah calon konsumen."
            : "Pastikan informasi penghasilan terbaca jelas."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {url && metadata ? (
          <>
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="group relative block w-full overflow-hidden rounded-xl border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Perbesar ${label}`}
                >
                  <img
                    src={url}
                    alt={label}
                    className="h-44 w-full bg-muted object-cover"
                  />
                  <span className="absolute bottom-2 right-2 rounded-lg bg-slate-950/70 p-2 text-white">
                    <ExternalLink className="size-4" />
                  </span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogTitle>{label}</DialogTitle>
                <DialogDescription>{metadata.name}</DialogDescription>
                <img
                  src={url}
                  alt={`${label} — ${lead.name}`}
                  className="mt-5 max-h-[60dvh] w-full rounded-xl object-contain"
                />
              </DialogContent>
            </Dialog>
            <p className="mt-3 truncate text-xs font-medium">{metadata.name}</p>
            <p className="mt-1 text-[10px] text-muted-foreground">
              {(metadata.size / 1024).toFixed(0)} KB · Tersimpan di perangkat
            </p>
          </>
        ) : (
          <div
            className="flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-primary/25 bg-secondary/25 p-5 text-center"
            onDragOver={
              editable ? (event) => event.preventDefault() : undefined
            }
            onDrop={
              editable
                ? (event) => {
                    event.preventDefault();
                    upload(event.dataTransfer.files[0]);
                  }
                : undefined
            }
          >
            <ImagePlus
              className="mb-3 size-8 text-primary/70"
              strokeWidth={1.5}
            />
            <p className="text-sm font-medium">
              {metadata ? "Foto belum tersedia" : "Belum ada foto"}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {editable
                ? "Pilih file atau tarik gambar ke sini."
                : "Dokumen akan muncul setelah diunggah SO."}
            </p>
          </div>
        )}
        {error && (
          <p
            role="alert"
            className="mt-3 text-xs leading-relaxed text-destructive"
          >
            {error}
          </p>
        )}
        {editable && (
          <>
            <input
              ref={input}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              tabIndex={-1}
              aria-label={`Pilih file ${label}`}
              onChange={(event) => upload(event.target.files?.[0])}
            />
            <input
              ref={camera}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              tabIndex={-1}
              aria-label={`Ambil ${label}`}
              onChange={(event) => upload(event.target.files?.[0])}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={busy}
                onClick={() => input.current?.click()}
              >
                {busy ? <LoaderCircle className="animate-spin" /> : <Upload />}
                {metadata ? "Ganti foto" : "Pilih file"}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={busy}
                onClick={() => camera.current?.click()}
              >
                <Camera />
                Kamera
              </Button>
              {metadata && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={busy}
                      className="ml-auto text-destructive"
                      aria-label={`Hapus ${label}`}
                    >
                      <Trash2 />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogTitle>
                      Hapus {label.toLowerCase()}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Dokumen wajib ini akan dihapus dan status survei kembali
                      belum lengkap. Anda dapat mengunggah foto baru.
                    </AlertDialogDescription>
                    <div className="mt-6 flex justify-end gap-2">
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={async () => {
                          try {
                            await actions.removePhoto(lead.id, documentKey);
                            toast.success("Dokumen dihapus.");
                          } catch (e) {
                            toast.error(e.message);
                          }
                        }}
                      >
                        Hapus foto
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
            <p className="mt-3 text-[10px] text-muted-foreground">
              JPG, PNG, WebP · Maksimal 5 MB per foto
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
