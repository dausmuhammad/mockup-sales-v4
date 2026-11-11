"use client";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/components/providers/app-provider";
import {
  PageHeading,
  NotAvailable,
  Notice,
  AppLink,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { PhotoCard } from "@/components/leads/photo-card";
export default function SurveyForm({ id }) {
  const { leads, session, actions } = useApp(),
    router = useRouter(),
    [busy, setBusy] = useState(false),
    [uploadCount, setUploadCount] = useState(0);
  const onUploadBusy = useCallback(
    (value) => setUploadCount((n) => Math.max(0, n + (value ? 1 : -1))),
    [],
  );
  const uploading = uploadCount > 0;
  const lead = leads.find((l) => l.id === id);
  if (session?.role !== "SO" || !lead?.moCompletedAt)
    return <NotAvailable title="Survei belum tersedia" />;
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeading
        eyebrow={`Dokumen Surveyor · ${lead.leadNumber}`}
        title="Lengkapi dokumen survei"
        description={`Ambil foto atau unggah dokumen survei untuk ${lead.name}.`}
        back={`/leads/${id}`}
      />
      <Notice>
        Foto langsung disimpan saat unggahan berhasil. Lengkapi kedua dokumen,
        lalu pilih Simpan & selesaikan survei untuk menandai tugas selesai.
      </Notice>
      <div className="mt-5 grid items-start gap-5 md:grid-cols-2">
        <PhotoCard
          lead={lead}
          documentKey="house"
          label="Foto rumah"
          editable
          onBusyChange={onUploadBusy}
        />
        <PhotoCard
          lead={lead}
          documentKey="salarySlip"
          label="Foto slip gaji"
          editable
          onBusyChange={onUploadBusy}
        />
      </div>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" disabled={busy || uploading} asChild>
          <AppLink href={`/leads/${id}`}>Kembali ke detail</AppLink>
        </Button>
        <Button
          disabled={busy || uploading}
          onClick={async () => {
            setBusy(true);
            try {
              await actions.saveSurvey(id);
              toast.success("Dokumen lengkap. Survei berhasil diselesaikan.");
              router.push(`/leads/${id}`);
            } catch (e) {
              toast.error(e.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? <LoaderCircle className="animate-spin" /> : null}Simpan &
          selesaikan survei
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
