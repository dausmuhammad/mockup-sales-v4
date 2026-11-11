"use client";
import { ArrowUpRight, ChevronRight, Phone } from "lucide-react";
import { AppLink, StatusBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { initials, dateLabel } from "@/lib/formatters";
export function LeadCard({ lead, role }) {
  return (
    <Card className="group">
      <AppLink
        href={`/leads/${lead.id}`}
        className="flex min-h-24 items-center gap-3 p-4 focus-visible:rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:gap-4 sm:p-5"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-primary">
          {initials(lead.name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold group-hover:text-primary">
            {lead.name}
          </p>
          <p className="mt-1.5 truncate text-[10px] text-muted-foreground sm:text-xs">
            {lead.leadNumber}
          </p>
        </div>
        <StatusBadge lead={lead} role={role} />
        <ChevronRight className="hidden size-4 shrink-0 text-muted-foreground/60 min-[390px]:block" />
      </AppLink>
    </Card>
  );
}
export function LeadList({ leads, role, table = true }) {
  return (
    <>
      {table && (
        <Card className="hidden overflow-hidden lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Calon konsumen</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Tanggal registrasi</TableHead>
                <TableHead>Status {role}</TableHead>
                <TableHead>
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <AppLink
                      href={`/leads/${lead.id}`}
                      className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-xs font-bold text-primary">
                        {initials(lead.name)}
                      </span>
                      <span>
                        <span className="block font-semibold hover:text-primary">
                          {lead.name}
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {lead.leadNumber}
                        </span>
                      </span>
                    </AppLink>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="size-3" />
                      {lead.phone}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs">
                    {dateLabel(lead.createdAt)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge lead={lead} role={role} />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" asChild>
                      <AppLink
                        href={`/leads/${lead.id}`}
                        aria-label={`Detail ${lead.name}`}
                      >
                        <ArrowUpRight />
                      </AppLink>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
      <div className={table ? "space-y-3 lg:hidden" : "space-y-3"}>
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} role={role} />
        ))}
      </div>
    </>
  );
}
