"use client";
import { useState } from "react";
import {
  ArrowRight,
  Banknote,
  CalendarDays,
  Check,
  CheckCheck,
  ClipboardList,
  ContactRound,
  LoaderCircle,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/components/providers/app-provider";
import {
  AppLink,
  PageHeading,
  NotAvailable,
  InfoItem,
  Notice,
  StatusBadge,
} from "@/components/shared";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PhotoCard } from "./photo-card";
import { dateLabel, initials, rupiah } from "@/lib/formatters";
import { simulateSchedule } from "@/lib/installment-service";
export default function LeadDetail({ id }) {
  const { leads, session, actions } = useApp(),
    [busy, setBusy] = useState(false);
  const lead = leads.find((l) => l.id === id);
  if (!lead || !session || (session.role === "SO" && !lead.moCompletedAt))
    return <NotAvailable />;
  const schedule = lead.installmentSchedule;
  async function makeSchedule() {
    if (busy) return;
    setBusy(true);
    const leadId = lead.id;
    try {
      const result = await simulateSchedule(lead);
      actions.saveSchedule(leadId, result);
      toast.success("Jadwal angsuran simulasi berhasil dibuat.");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeading
        eyebrow={`Detail lead · ${lead.leadNumber}`}
        title={lead.name}
        description={`Terdaftar ${dateLabel(lead.createdAt)} · Terakhir diperbarui ${dateLabel(lead.updatedAt)}`}
        back="/tasks"
        action={<StatusBadge lead={lead} role={session.role} />}
      />
      <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl border bg-card p-4 sm:p-6">
        {[
          ["Terdaftar", true, ContactRound],
          ["Data MO lengkap", lead.moCompletedAt, ClipboardList],
          ["Survei selesai", lead.soCompletedAt, CheckCheck],
        ].map(([label, done, Icon], i) => (
          <div
            key={label}
            className="relative flex flex-col items-center gap-2 text-center"
          >
            {i < 2 && (
              <span className="absolute left-[65%] right-[-35%] top-4 h-px bg-border" />
            )}
            <span
              className={`relative flex size-8 items-center justify-center rounded-full ${done ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
            >
              {done ? (
                <Check className="size-4" />
              ) : (
                <Icon className="size-4" />
              )}
            </span>
            <span
              className={`text-[10px] font-medium sm:text-xs ${done ? "text-foreground" : "text-muted-foreground"}`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="grid items-start gap-5 xl:grid-cols-[1fr_1.15fr]">
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <div className="mb-5 flex items-center gap-3">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-xl font-bold text-primary">
                  {initials(lead.name)}
                </span>
                <div>
                  <CardTitle>Informasi konsumen</CardTitle>
                  <CardDescription>
                    Identitas hasil registrasi lead
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-6 sm:grid-cols-2">
                <InfoItem label="Nama sesuai KTP">{lead.name}</InfoItem>
                <InfoItem label="NIK / Nomor KTP">{lead.nik}</InfoItem>
                <InfoItem label="Nomor telepon">
                  <span className="inline-flex items-center gap-2">
                    <Phone className="size-3.5 text-muted-foreground" />
                    {lead.phone}
                  </span>
                </InfoItem>
                <InfoItem label="Tanggal registrasi">
                  {dateLabel(lead.createdAt)}
                </InfoItem>
                <div className="sm:col-span-2">
                  <InfoItem label="Alamat KTP">
                    <span className="flex items-start gap-2">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      {lead.address}
                    </span>
                  </InfoItem>
                </div>
              </dl>
            </CardContent>
          </Card>
          <Notice>
            Data pada ruang kerja ini merupakan simulasi. Tidak ada proses
            pengajuan atau transfer data ke layanan pembiayaan eksternal.
          </Notice>
        </div>
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Data pembiayaan MO</CardTitle>
                <Badge variant={lead.moCompletedAt ? "success" : "warning"}>
                  {lead.moCompletedAt ? "Lengkap" : "Belum lengkap"}
                </Badge>
              </div>
              <CardDescription>
                Penghasilan dan rencana pembiayaan konsumen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
                <InfoItem label="Pendapatan per bulan">
                  {rupiah(lead.incomeMonthly)}
                </InfoItem>
                <InfoItem label="Pendapatan per tahun">
                  {rupiah(lead.incomeAnnual)}
                </InfoItem>
                <InfoItem label="Jenis pembiayaan">{lead.financeType}</InfoItem>
                <InfoItem label="Kendaraan">{lead.vehicleType}</InfoItem>
                <InfoItem label="Tenor">{lead.tenorMonths} bulan</InfoItem>
                <InfoItem label="Harga OTR">{rupiah(lead.otr)}</InfoItem>
                <InfoItem label="DP / uang muka">
                  {rupiah(lead.downPayment)}
                </InfoItem>
              </dl>
              {session.role === "MO" && (
                <Button className="mt-6 w-full" asChild>
                  <AppLink href={`/leads/${id}/mo`}>
                    {lead.moCompletedAt
                      ? "Lihat / ubah data MO"
                      : "Lengkapi data MO"}
                    <ArrowRight />
                  </AppLink>
                </Button>
              )}
            </CardContent>
          </Card>
          {session.role === "MO" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-primary" />
                  <CardTitle>Simulasi angsuran</CardTitle>
                </div>
                <CardDescription>
                  Estimasi pokok pembiayaan tanpa bunga
                </CardDescription>
              </CardHeader>
              <CardContent>
                {schedule ? (
                  <>
                    <div className="rounded-xl bg-emerald-500/5 p-4">
                      <p className="text-xs text-muted-foreground">
                        Estimasi angsuran per bulan
                      </p>
                      <p className="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                        {rupiah(schedule.monthly)}
                      </p>
                      <dl className="mt-4 grid grid-cols-2 gap-3">
                        <InfoItem label="Pokok pembiayaan">
                          {rupiah(schedule.principal)}
                        </InfoItem>
                        <InfoItem label="Tenor">
                          {schedule.tenorMonths} bulan
                        </InfoItem>
                      </dl>
                      <p className="mt-4 text-[10px] text-muted-foreground">
                        Dibuat {dateLabel(schedule.createdAt)} · Cicilan
                        terakhir {rupiah(schedule.installments.at(-1).amount)}
                      </p>
                    </div>
                    <p className="mb-4 mt-3 text-xs leading-relaxed text-muted-foreground">
                      Estimasi tidak termasuk bunga, biaya, dan asuransi. Bukan
                      penawaran pembiayaan resmi.
                    </p>
                  </>
                ) : (
                  <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                    Lengkapi tahap MO untuk membuat estimasi dari OTR − DP,
                    dibagi tenor. Tidak termasuk bunga, biaya, dan asuransi;
                    bukan penawaran pembiayaan resmi.
                  </p>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={!lead.moCompletedAt || busy}
                  onClick={makeSchedule}
                >
                  {busy ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <Banknote />
                  )}
                  {busy
                    ? "Membuat simulasi…"
                    : schedule
                      ? "Buat ulang simulasi"
                      : "Buat jadwal angsuran"}
                </Button>
              </CardContent>
            </Card>
          )}
          {session.role === "SO" && (
            <Card>
              <CardHeader>
                <CardTitle>Dokumen survei</CardTitle>
                <CardDescription>
                  {lead.soCompletedAt
                    ? "Kedua dokumen telah dilengkapi."
                    : "Foto rumah dan slip gaji wajib dilengkapi."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <AppLink href={`/leads/${id}/survey`}>
                    <Send />
                    {lead.soCompletedAt
                      ? "Lihat / ubah dokumen"
                      : "Lengkapi dokumen survei"}
                    <ArrowRight />
                  </AppLink>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <section className="mt-7">
        <h2 className="mb-4 text-base font-semibold">Dokumentasi survei</h2>
        <div className="grid items-start gap-5 md:grid-cols-2">
          <PhotoCard lead={lead} documentKey="house" label="Foto rumah" />
          <PhotoCard
            lead={lead}
            documentKey="salarySlip"
            label="Foto slip gaji"
          />
        </div>
      </section>
    </>
  );
}
