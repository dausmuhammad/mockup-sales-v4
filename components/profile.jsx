"use client";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ChevronRight,
  CircleHelp,
  LogOut,
  MapPin,
  Monitor,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { PageHeading, Choice, Notice } from "@/components/shared";
import { ResetDemo } from "@/components/reset-demo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { initials, roleName } from "@/lib/formatters";
export default function Profile() {
  const { session, actions } = useApp(),
    { theme, setTheme } = useTheme(),
    router = useRouter();
  if (!session) return null;
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeading
        eyebrow="Akun Anda"
        title="Profil & pengaturan"
        description="Informasi sesi demo dan preferensi ruang kerja."
      />
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-[#101b3d] to-[#294d94]" />
        <CardContent>
          <div className="-mt-8 mb-4 flex size-18 items-center justify-center rounded-2xl border-4 border-card bg-secondary text-2xl font-bold text-primary">
            {initials(session.name)}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">{session.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {roleName(session.role)}
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3" />
                {session.branch}
              </p>
            </div>
            <Badge variant="success">
              <ShieldCheck className="size-3" />
              Sesi demo aktif
            </Badge>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-5 divide-y overflow-hidden">
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="flex min-h-24 w-full items-center gap-4 px-5 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
                <Settings2 className="size-5" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">
                  Preferensi aplikasi
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  Tema dan tampilan ruang kerja
                </span>
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Preferensi aplikasi</DialogTitle>
            <DialogDescription>
              Sesuaikan tampilan agar nyaman digunakan. Pilihan tersimpan pada
              browser ini.
            </DialogDescription>
            <div className="mt-6 space-y-3">
              <Label htmlFor="theme">Tema tampilan</Label>
              <Choice
                id="theme"
                value={theme || "system"}
                onChange={setTheme}
                options={[
                  { value: "system", label: "Ikuti sistem" },
                  { value: "light", label: "Terang" },
                  { value: "dark", label: "Gelap" },
                ]}
              />
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Monitor className="size-3.5" />
                Mode sistem mengikuti pengaturan perangkat Anda.
              </p>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="flex min-h-24 w-full items-center gap-4 px-5 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
                <CircleHelp className="size-5" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">
                  Pusat bantuan
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  Panduan singkat SalesFlow
                </span>
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Selangkah lebih mudah</DialogTitle>
            <DialogDescription>
              Panduan alur demo Marketing Officer dan Surveyor Officer.
            </DialogDescription>
            <ol className="mt-6 space-y-5">
              {[
                [
                  "Registrasi sebagai MO",
                  "Buka Registrasi lead baru. Isi NIK, nama, kontak, dan alamat konsumen.",
                ],
                [
                  "Lengkapi data pembiayaan",
                  "Buka lead dari To Do List. Simpan penghasilan, OTR, DP, dan tenor untuk meneruskan ke SO.",
                ],
                [
                  "Lanjutkan sebagai SO",
                  "Logout lalu masuk sebagai Surveyor. Unggah foto rumah dan slip gaji, kemudian selesaikan survei.",
                ],
                [
                  "Pantau hasilnya",
                  "Dashboard dan Performa otomatis mengikuti progres lead Anda.",
                ],
              ].map(([title, description], i) => (
                <li key={title} className="flex gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">{title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-6">
              <Notice>
                Data dan foto hanya tersedia pada browser/perangkat ini.
                Menghapus data browser akan menghapus demo. Login ini bukan
                autentikasi produksi. Cabang hanya menjadi konteks tampilan;
                antrean dibagikan antarperan. Jadwal angsuran merupakan
                simulasi.
              </Notice>
            </div>
          </DialogContent>
        </Dialog>
      </Card>
      <div className="mt-5">
        <Notice>
          Gunakan identitas dan dokumen simulasi. Untuk aplikasi produksi,
          diperlukan backend, autentikasi, otorisasi, dan penyimpanan yang
          sesuai.
        </Notice>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            try {
              actions.logout();
              router.replace("/login");
            } catch {
              toast.error("Sesi tidak dapat dihapus.");
            }
          }}
        >
          <LogOut />
          Keluar dari akun
        </Button>
        <ResetDemo className="flex-1 text-destructive" />
      </div>
    </div>
  );
}
