"use client";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  FolderOpen,
  LoaderCircle,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
export function Brand({ light = false }) {
  return (
    <div
      className={cn(
        "font-extrabold text-[17px] tracking-[.3px]",
        light && "text-white",
      )}
    >
      triple X
      <small
        className={cn(
          "mt-0.5 block text-[10px] font-semibold tracking-[2px]",
          light ? "text-[#aab9e6]" : "text-muted-foreground",
        )}
      >
        SALESFLOW
      </small>
    </div>
  );
}
export function AppLink({
  href,
  children,
  className,
  disabled = false,
  ...props
}) {
  const router = useRouter();
  const { dirty, setPendingNavigation } = useApp();
  return (
    <a
      href={href}
      className={className}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      {...props}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
          return;
        event.preventDefault();
        const go = () => router.push(href);
        if (dirty) setPendingNavigation(() => go);
        else go();
      }}
    >
      {children}
    </a>
  );
}
export function NavigationConfirmation() {
  const { pendingNavigation, setPendingNavigation, setDirty } = useApp();
  return (
    <AlertDialog
      open={Boolean(pendingNavigation)}
      onOpenChange={(open) => {
        if (!open) setPendingNavigation(null);
      }}
    >
      <AlertDialogContent>
        <AlertDialogTitle>Tinggalkan perubahan?</AlertDialogTitle>
        <AlertDialogDescription>
          Perubahan pada form belum disimpan. Tetap di sini untuk melanjutkan
          pengisian, atau tinggalkan halaman.
        </AlertDialogDescription>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <AlertDialogCancel>Tetap mengisi</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              const go = pendingNavigation;
              setDirty(false);
              setPendingNavigation(null);
              go?.();
            }}
          >
            Tinggalkan
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export function PageHeading({ eyebrow, title, description, action, back }) {
  return (
    <div className="mb-7">
      {back && (
        <AppLink
          href={back}
          className="mb-4 inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Kembali
        </AppLink>
      )}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          {eyebrow && (
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[2px] text-primary">
              {eyebrow}
            </p>
          )}
          <h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
export function NewLeadButton({ className }) {
  return (
    <Button asChild className={className}>
      <AppLink href="/leads/new">
        <Plus />
        Registrasi lead baru
      </AppLink>
    </Button>
  );
}
export function EmptyState({
  title = "Belum ada lead",
  description = "Mulai dengan mendaftarkan calon konsumen pertama Anda.",
  action,
  icon: Icon = FolderOpen,
}) {
  return (
    <div className="flex flex-col items-center px-5 py-12 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-secondary text-primary">
        <Icon className="size-7" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
export function Loading({ label = "Memuat ruang kerja…" }) {
  return (
    <div
      className="flex min-h-[50vh] items-center justify-center gap-3 text-sm text-muted-foreground"
      role="status"
    >
      <LoaderCircle className="size-5 animate-spin text-primary" />
      {label}
    </div>
  );
}
export function StatusBadge({ lead, role }) {
  const done = role === "MO" ? lead.moCompletedAt : lead.soCompletedAt;
  return (
    <Badge variant={done ? "success" : "warning"}>
      {done ? (
        <Check className="size-3" />
      ) : (
        <span className="size-1.5 rounded-full bg-current" />
      )}
      {done ? "Selesai" : "Perlu aksi"}
    </Badge>
  );
}
export function Choice({
  id,
  value,
  onChange,
  options,
  placeholder = "Pilih opsi",
  invalid = false,
  describedBy,
  onBlur,
  triggerRef,
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        id={id}
        ref={triggerRef}
        onBlur={onBlur}
        aria-invalid={invalid}
        aria-describedby={describedBy}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => {
          const item =
            typeof option === "string"
              ? { value: option, label: option }
              : option;
          return (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
export function InfoItem({ label, children }) {
  return (
    <div className="min-w-0">
      <dt className="mb-1.5 text-xs text-muted-foreground">{label}</dt>
      <dd className="break-words text-sm font-medium leading-relaxed">
        {children ?? "Belum diisi"}
      </dd>
    </div>
  );
}
export function Notice({ children }) {
  return (
    <div className="flex gap-3 rounded-xl border border-primary/15 bg-secondary/50 p-4 text-xs leading-relaxed text-secondary-foreground">
      <CircleHelp className="mt-0.5 size-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
export function NotAvailable({
  title = "Lead tidak ditemukan",
  description = "Lead mungkin sudah dihapus atau belum tersedia untuk peran Anda.",
}) {
  return (
    <Card>
      <EmptyState
        title={title}
        description={description}
        action={
          <Button asChild variant="outline">
            <AppLink href="/tasks">
              Buka To Do List
              <ArrowRight />
            </AppLink>
          </Button>
        }
      />
    </Card>
  );
}
