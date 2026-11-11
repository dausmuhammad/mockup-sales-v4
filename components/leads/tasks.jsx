"use client";
import { useState } from "react";
import { Search, SearchX } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { PageHeading, NewLeadButton, EmptyState } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { LeadList } from "./lead-list";
import { selectLeads } from "@/lib/lead-selectors";
export default function Tasks() {
  const { session, leads } = useApp(),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("all");
  if (!session) return null;
  const list = selectLeads(leads, session.role, filter, query);
  return (
    <>
      <PageHeading
        eyebrow="Kelola peluang"
        title={`${session.role} To Do List`}
        description={
          session.role === "MO"
            ? "Lengkapi informasi lead sebelum diteruskan ke Surveyor."
            : "Lengkapi dokumen survei untuk menyelesaikan tugas Anda."
        }
        action={session.role === "MO" ? <NewLeadButton /> : null}
      />
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <Tabs
          value={filter}
          onValueChange={setFilter}
          aria-label="Filter status lead"
        >
          <TabsList>
            {[
              ["all", "Semua"],
              ["pending", "Belum lengkap"],
              ["done", "Selesai"],
            ].map(([value, label]) => (
              <TabsTrigger key={value} value={value}>
                {label}
                <span className="ml-1.5 rounded-md bg-foreground/5 px-1.5 py-0.5 text-[10px]">
                  {selectLeads(leads, session.role, value).length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative xl:w-80">
          <Search className="absolute left-3.5 top-4 size-4 text-muted-foreground" />
          <Input
            aria-label="Cari lead"
            placeholder="Cari nama, ID, NIK, atau telepon…"
            className="pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        Menampilkan{" "}
        <strong className="font-semibold text-foreground">{list.length}</strong>{" "}
        lead{query ? ` untuk “${query}”` : ""}
      </p>
      {list.length ? (
        <LeadList leads={list} role={session.role} />
      ) : (
        <Card>
          <EmptyState
            title={
              query
                ? "Pencarian tidak ditemukan"
                : "Belum ada lead di kategori ini"
            }
            description={
              query
                ? "Coba kata kunci lain atau ubah filter status."
                : session.role === "SO"
                  ? "Lead tersedia setelah data MO dilengkapi."
                  : "Registrasikan lead baru atau pilih kategori lainnya."
            }
            icon={query ? SearchX : undefined}
            action={!query && session.role === "MO" ? <NewLeadButton /> : null}
          />
        </Card>
      )}
    </>
  );
}
