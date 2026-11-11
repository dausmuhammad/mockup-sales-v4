"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Banknote, CarFront, LoaderCircle } from "lucide-react";
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
import { moSchema } from "@/lib/validation/schemas";
import { moneyInput, numericMoney } from "@/lib/formatters";
const amountFields = ["incomeMonthly", "incomeAnnual", "otr", "downPayment"];
function Editor({ lead }) {
  const { actions, setDirty } = useApp(),
    router = useRouter(),
    [busy, setBusy] = useState(false);
  const defaults = {
    ...Object.fromEntries(
      amountFields.map((key) => [key, moneyInput(lead[key])]),
    ),
    financeType: lead.financeType,
    vehicleType: lead.vehicleType,
    tenorMonths: String(lead.tenorMonths),
  };
  const form = useForm({
    resolver: zodResolver(moSchema),
    defaultValues: defaults,
  });
  const annualManuallyEdited = useRef(lead.incomeAnnual != null);
  useDirtyForm(form.formState.isDirty);
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeading
        eyebrow={`Data Marketing Officer · ${lead.leadNumber}`}
        title="Lengkapi data pembiayaan"
        description={`Informasi penghasilan dan pembiayaan untuk ${lead.name}.`}
        back={`/leads/${lead.id}`}
      />
      <form
        noValidate
        onSubmit={form.handleSubmit((data) => {
          setBusy(true);
          try {
            actions.saveMO(lead.id, data);
            setDirty(false);
            form.reset({ ...data });
            toast.success(
              "Data MO lengkap. Lead tersedia di antrean Surveyor.",
            );
            router.push(`/leads/${lead.id}`);
          } catch (e) {
            toast.error(`Data belum tersimpan: ${e.message}`);
          } finally {
            setBusy(false);
          }
        })}
        className="space-y-5"
      >
        <Card>
          <CardHeader>
            <div className="mb-2 flex items-center gap-2 text-primary">
              <Banknote className="size-5" />
              <span className="text-xs font-semibold">01 / PENGHASILAN</span>
            </div>
            <CardTitle>Data penghasilan</CardTitle>
            <CardDescription>
              Nominal penghasilan calon konsumen dalam rupiah.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <Field
              form={form}
              name="incomeMonthly"
              label="Pendapatan per bulan"
              money
              placeholder="0"
              onValueChange={(value) => {
                if (!annualManuallyEdited.current) {
                  const monthly = numericMoney(value);
                  if (Number.isFinite(monthly))
                    form.setValue("incomeAnnual", moneyInput(monthly * 12), {
                      shouldDirty: true,
                    });
                }
              }}
            />
            <Field
              form={form}
              name="incomeAnnual"
              label="Pendapatan per tahun"
              onValueChange={() => {
                annualManuallyEdited.current = true;
              }}
              money
              placeholder="0"
              hint="Terisi dari bulanan × 12; dapat disesuaikan."
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="mb-2 flex items-center gap-2 text-primary">
              <CarFront className="size-5" />
              <span className="text-xs font-semibold">02 / PEMBIAYAAN</span>
            </div>
            <CardTitle>Informasi pembiayaan</CardTitle>
            <CardDescription>
              Isi seluruh informasi untuk meneruskan lead ke Surveyor.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <Field
              form={form}
              name="financeType"
              label="Jenis pembiayaan"
              options={["Kendaraan", "Dana Tunai"]}
            />
            <Field
              form={form}
              name="vehicleType"
              label="Jenis kendaraan"
              options={["Motor", "Mobil"]}
            />
            <Field
              form={form}
              name="tenorMonths"
              label="Tenor pembiayaan"
              options={[12, 24, 36, 48].map((n) => ({
                value: String(n),
                label: `${n} bulan`,
              }))}
            />
            <div className="hidden sm:block" />
            <Field
              form={form}
              name="otr"
              label="Harga OTR"
              money
              placeholder="0"
            />
            <Field
              form={form}
              name="downPayment"
              label="DP / uang muka"
              money
              placeholder="0"
              hint="DP boleh nol dan harus lebih kecil dari OTR."
            />
          </CardContent>
        </Card>
        {lead.installmentSchedule && (
          <Notice>
            Mengubah pembiayaan akan membatalkan simulasi angsuran sebelumnya.
            Buat ulang jadwal setelah data tersimpan.
          </Notice>
        )}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" asChild>
            <AppLink href={`/leads/${lead.id}`}>Batal</AppLink>
          </Button>
          <Button type="submit" disabled={busy}>
            {busy ? <LoaderCircle className="animate-spin" /> : null}Simpan &
            teruskan ke Surveyor
            <ArrowRight />
          </Button>
        </div>
      </form>
    </div>
  );
}
export default function MOForm({ id }) {
  const { leads, session } = useApp();
  const lead = leads.find((l) => l.id === id);
  if (session?.role !== "MO")
    return <NotAvailable title="Form hanya tersedia untuk MO" />;
  if (!lead) return <NotAvailable />;
  return <Editor key={lead.id} lead={lead} />;
}
