import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
      <p className="text-sm font-bold tracking-widest text-primary">404</p>
      <h1 className="mt-3 text-2xl font-bold">Halaman tidak ditemukan</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Kembali ke ruang kerja untuk melanjutkan pekerjaan.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Kembali ke Beranda</Link>
      </Button>
    </main>
  );
}
