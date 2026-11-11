"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  ContactRound,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/components/providers/app-provider";
import {
  PageHeading,
  NotAvailable,
  Notice,
  AppLink,
} from "@/components/shared";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field } from "./fields";
import { useDirtyForm } from "./use-dirty-form";
import { leadSchema } from "@/lib/validation/schemas";
export default function LeadForm() {
  const { session, actions, setDirty } = useApp(),
    [busy, setBusy] = useState(false),
    [created, setCreated] = useState(null);
  const form = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: { nik: "", name: "", phone: "", address: "" },
  });
  useDirtyForm(form.formState.isDirty);
  if (session?.role !== "MO")
    return <NotAvailable title="Registrasi hanya tersedia untuk MO" />;
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeading
        eyebrow="Lead baru"
        title="Registrasi calon konsumen"
        description="Mulai dari data identitas. Informasi pembiayaan dapat dilengkapi setelah registrasi."
        back="/tasks"
      />
      {created && (
        <div
          role="status"
          className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4"
        >
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            {created.name} berhasil didaftarkan. Siap registrasi lead
            berikutnya.
          </p>
          <Button variant="outline" size="sm" asChild>
            <AppLink href={`/leads/${created.id}`}>
              Lengkapi lead
              <ArrowRight />
            </AppLink>
          </Button>
        </div>
      )}
      <div className="grid items-start gap-5 lg:grid-cols-[1fr_240px]">
        <form
          noValidate
          onSubmit={form.handleSubmit((data) => {
            setBusy(true);
            try {
              const lead = actions.addLead(data);
              setCreated(lead);
              form.reset();
              setDirty(false);
              toast.success("Lead tersimpan di MO To Do List.");
            } catch (e) {
              if (e.message.includes("NIK")) {
                form.setError(
                  "nik",
                  { message: e.message },
                  { shouldFocus: true },
                );
              } else toast.error(`Gagal menyimpan lead: ${e.message}`);
            } finally {
              setBusy(false);
            }
          })}
        >
          <Card>
            <CardHeader>
              <span className="mb-4 flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
                <ContactRound className="size-5" />
              </span>
              <CardTitle>Data awal calon konsumen</CardTitle>
              <CardDescription>
                Isi sesuai identitas dan informasi kontak konsumen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <Field
                form={form}
                name="nik"
                label="NIK / Nomor KTP"
                inputMode="numeric"
                maxLength={16}
                placeholder="16 digit NIK"
                hint="NIK unik untuk setiap calon konsumen."
              />
              <Field
                form={form}
                name="name"
                label="Nama sesuai KTP"
                autoComplete="name"
                placeholder="Nama lengkap calon konsumen"
              />
              <Field
                form={form}
                name="phone"
                label="Nomor telepon"
                inputMode="tel"
                autoComplete="tel"
                placeholder="08xxxxxxxxxx"
                hint="Gunakan nomor aktif dalam format 08… atau +628…."
              />
              <Field
                form={form}
                name="address"
                label="Alamat sesuai KTP"
                multiline
                autoComplete="street-address"
                placeholder="Jalan, nomor rumah, kelurahan, kecamatan, kota…"
              />
            </CardContent>
          </Card>
          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" asChild>
              <AppLink href="/tasks">Kembali ke daftar</AppLink>
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? <LoaderCircle className="animate-spin" /> : null}Simpan
              data awal
              <ArrowRight />
            </Button>
          </div>
        </form>
        <div className="space-y-4">
          <Notice>
            Setelah disimpan, Anda dapat mendaftarkan lead berikutnya atau
            melengkapi data pembiayaan dari To Do List.
          </Notice>
          <div className="flex items-start gap-2 px-1 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0" />
            Gunakan data simulasi. Informasi tersimpan secara lokal di perangkat
            ini.
          </div>
        </div>
      </div>
    </div>
  );
}
