"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartNoAxesCombined, TrendingUp } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { PageHeading, EmptyState } from "@/components/shared";
import { MetricCards } from "@/components/dashboard/metrics";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { metrics, weeklyActivity } from "@/lib/lead-selectors";
import { dateLabel } from "@/lib/formatters";
function ActivityTooltip({ active, payload }) {
  return active && payload?.length ? (
    <div className="rounded-xl border bg-popover p-3 text-xs text-popover-foreground shadow-lg">
      <p className="font-semibold">{dateLabel(payload[0].payload.date)}</p>
      <p className="mt-1 text-muted-foreground">
        {payload[0].value} lead diselesaikan
      </p>
    </div>
  ) : null;
}
export default function Performance() {
  const { leads, session } = useApp();
  if (!session) return null;
  const stats = metrics(leads, session.role),
    activity = weeklyActivity(leads, session.role),
    total = activity.reduce((sum, d) => sum + d.count, 0);
  return (
    <>
      <PageHeading
        eyebrow="Produktivitas Anda"
        title="Performa"
        description="Lihat hasil tindak lanjut dan penyelesaian pekerjaan Anda."
        action={
          <Badge variant="outline">
            <TrendingUp className="size-3" />
            Tahap {session.role}
          </Badge>
        }
      />
      <MetricCards cards={stats.cards} />
      <Card className="mt-6">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>Aktivitas 7 hari terakhir</CardTitle>
              <CardDescription>
                {dateLabel(activity[0].date)} – {dateLabel(activity[6].date)}
              </CardDescription>
            </div>
            <Badge>{total} penyelesaian</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {total ? (
            <>
              <div
                className="mt-4 h-64 w-full sm:h-80"
                role="img"
                aria-label={activity
                  .map((d) => `${d.label}: ${d.count} lead`)
                  .join(", ")}
              >
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart
                    data={activity}
                    margin={{ left: -20, right: 0, top: 10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="4 5"
                      vertical={false}
                      stroke="var(--border)"
                    />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                      dy={10}
                    />
                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    />
                    <Tooltip
                      cursor={{ fill: "var(--muted)" }}
                      content={<ActivityTooltip />}
                    />
                    <Bar
                      dataKey="count"
                      fill="var(--primary)"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={52}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="sr-only">
                {activity
                  .map((d) => `${dateLabel(d.date)}: ${d.count} penyelesaian`)
                  .join("; ")}
              </p>
            </>
          ) : (
            <EmptyState
              icon={ChartNoAxesCombined}
              title="Belum ada aktivitas dalam 7 hari terakhir"
              description={`Penyelesaian tahap ${session.role} pertama akan tercatat di grafik ini.`}
            />
          )}
          <p className="mt-5 border-t pt-4 text-xs leading-relaxed text-muted-foreground">
            Aktivitas dihitung dari penyelesaian pertama tahap {session.role}.
            Mengubah data atau melengkapi ulang dokumen tidak menambah jumlah
            capaian. Data historis hasil migrasi tanpa tanggal asli tidak
            dihitung.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
