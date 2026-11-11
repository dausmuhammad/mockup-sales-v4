"use client";
import { ArrowUpRight, CheckCheck, Clock3 } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { NewLeadButton, AppLink, EmptyState } from "@/components/shared";
import { MetricCards } from "./metrics";
import { LeadList } from "@/components/leads/lead-list";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { metrics, selectLeads } from "@/lib/lead-selectors";
export default function Dashboard() {
  const { leads, session } = useApp();
  if (!session) return null;
  const stats = metrics(leads, session.role),
    priority = selectLeads(leads, session.role, "pending")
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(0, 2),
    hour = new Date().getHours(),
    greeting =
      hour < 11
        ? "Selamat pagi"
        : hour < 15
          ? "Selamat siang"
          : hour < 18
            ? "Selamat sore"
            : "Selamat malam";
  return (
    <>
      <h1 className="sr-only">
        {greeting}, {session.name}
      </h1>
      {session.role === "MO" && (
        <div className="mb-4">
          <NewLeadButton className="w-full sm:w-auto" />
          <p className="mt-2 text-[10px] text-muted-foreground">
            Input data awal beberapa lead terlebih dahulu, lalu lengkapi satu
            per satu melalui To Do List.
          </p>
        </div>
      )}
      {stats.pending > 0 && (
        <div
          role="status"
          className="mb-6 flex items-start gap-3 rounded-xl border border-[#ffe3b5] bg-[#fff7e9] dark:border-amber-500/20 dark:bg-amber-500/5 p-4"
        >
          <Clock3 className="mt-0.5 size-4 shrink-0 text-amber-600" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-[#895a12] dark:text-amber-200">
              Ada pekerjaan yang perlu diselesaikan
            </p>
            <p className="mt-1 text-xs text-[#895a12] dark:text-amber-300">
              {stats.pending} lead membutuhkan kelengkapan{" "}
              {session.role === "MO" ? "data MO" : "dokumen survei"}.
            </p>
          </div>
        </div>
      )}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold">Ringkasan pekerjaan</h2>
        <span className="text-xs text-muted-foreground">Seluruh periode</span>
      </div>
      <MetricCards cards={stats.cards} />
      <div className="mt-7 grid items-start gap-5 xl:grid-cols-[1fr_1.35fr]">
        <section>
          <h2 className="mb-3 text-base font-semibold">Progress pekerjaan</h2>
          <Card className="p-4">
            <div className="mb-2.5 flex items-center justify-between text-xs">
              <b>Lead {session.role} diselesaikan</b>
              <strong>{stats.percent}%</strong>
            </div>
            <Progress
              value={stats.percent}
              aria-label="Progres penyelesaian lead"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {stats.done} dari {stats.total} lead selesai pada tahap{" "}
              {session.role}
            </p>
          </Card>
        </section>
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Prioritas hari ini</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Lead tertunda paling awal didaftarkan
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <AppLink href="/tasks">
                Lihat semua
                <ArrowUpRight />
              </AppLink>
            </Button>
          </div>
          {priority.length ? (
            <LeadList leads={priority} role={session.role} table={false} />
          ) : (
            <div className="py-7 text-center text-xs text-muted-foreground">
              <h3 className="font-medium">
                {stats.total
                  ? "Semua pekerjaan selesai"
                  : "Belum ada pekerjaan"}
              </h3>
              <p className="mt-2">
                {stats.total
                  ? "Semua pekerjaan telah selesai. Mantap!"
                  : session.role === "MO"
                    ? "Daftarkan lead pertama untuk memulai."
                    : "Lead akan muncul setelah data MO lengkap."}
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
