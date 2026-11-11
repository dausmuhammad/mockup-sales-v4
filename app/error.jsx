"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }) {
  return (
    <div role="alert" className="mx-auto max-w-lg py-20 text-center">
      <h1 className="text-2xl font-bold">Halaman belum dapat dimuat</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Coba muat ulang halaman. Data yang sudah tersimpan tetap tersedia.
      </p>
      <Button className="mt-6" onClick={reset}>
        Coba lagi
      </Button>
    </div>
  );
}
