"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  ListTodo,
  ChartNoAxesCombined,
  UserRound,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import {
  AppLink,
  Brand,
  Loading,
  NavigationConfirmation,
} from "@/components/shared";
import { useApp } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { initials, roleName } from "@/lib/formatters";
import { cn } from "@/lib/utils";
const navigation = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/tasks", label: "To Do List", icon: ListTodo },
  { href: "/performance", label: "Performa", icon: ChartNoAxesCombined },
  { href: "/profile", label: "Profil", icon: UserRound },
];
export default function WorkspaceShell({ children }) {
  const { ready, session, actions, error, dirty, setPendingNavigation } =
      useApp(),
    path = usePathname(),
    router = useRouter();
  useEffect(() => {
    if (ready && !session) router.replace("/login");
  }, [ready, session, router]);
  if (!ready || !session) return <Loading />;
  const active = (href) =>
    href === "/"
      ? path === "/"
      : href === "/tasks"
        ? path.startsWith("/tasks") || path.startsWith("/leads")
        : path.startsWith(href);
  const logout = () => {
    const go = () => {
      try {
        actions.logout();
        router.replace("/login");
      } catch {
        toast.error("Sesi tidak dapat dihapus. Coba lagi.");
      }
    };
    if (dirty) setPendingNavigation(() => go);
    else go();
  };
  return (
    <div className="min-h-dvh">
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-50 rounded-xl bg-primary px-4 py-3 text-white focus:not-sr-only"
      >
        Lewati ke konten
      </a>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r bg-card lg:flex">
        <div className="px-7 pb-10 pt-8">
          <Brand />
        </div>
        <div className="px-7 text-[10px] font-semibold uppercase tracking-[2px] text-muted-foreground">
          Ruang kerja
        </div>
        <nav aria-label="Navigasi utama" className="mt-4 space-y-1.5 px-4">
          {navigation.map(({ href, label, icon: Icon }) => (
            <AppLink
              key={href}
              href={href}
              aria-current={active(href) ? "page" : undefined}
              className={cn(
                "flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-medium transition-colors",
                active(href)
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-[19px]" />
              {label}
              {active(href) && (
                <span className="ml-auto size-1.5 rounded-full bg-primary" />
              )}
            </AppLink>
          ))}
        </nav>
        <div className="mt-auto border-t p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-primary">
              {initials(session.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{session.name}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {roleName(session.role)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="mt-3 w-full justify-start text-muted-foreground"
            onClick={logout}
          >
            <LogOut />
            Keluar
          </Button>
        </div>
      </aside>
      <div className="lg:pl-[248px]">
        <header className="rounded-b-[26px] bg-[linear-gradient(145deg,#101b3d,#1d3470)] px-5 pt-[22px] pb-[26px] text-white sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1400px]">
            <div className="flex items-center justify-between">
              <Brand light />
              <AppLink
                href="/profile"
                aria-label="Buka profil"
                className="flex size-[38px] items-center justify-center rounded-[14px] border border-white/20 bg-white/12 text-sm font-extrabold"
              >
                {initials(session.name)}
              </AppLink>
            </div>
            <div className="mt-6 text-[13px] text-[#bdc9e9]">
              {new Date().getHours() < 11
                ? "Selamat pagi"
                : new Date().getHours() < 15
                  ? "Selamat siang"
                  : new Date().getHours() < 18
                    ? "Selamat sore"
                    : "Selamat malam"}
              ,
              <strong className="mt-1 block text-[23px] text-white">
                {session.name}
              </strong>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-[#d1dcf7]">
              <span className="rounded-full bg-white/10 px-2.5 py-1.5">
                {roleName(session.role)}
              </span>
              <span>•</span>
              <span>{session.branch}</span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto text-[#d8e2ff] hover:bg-white/10 hover:text-white"
                onClick={logout}
              >
                Keluar
              </Button>
            </div>
          </div>
        </header>
        <main
          id="main-content"
          className="mx-auto max-w-[1480px] px-[18px] pb-[calc(108px+env(safe-area-inset-bottom))] pt-[18px] sm:px-8 sm:pt-8 lg:px-10 lg:pb-10"
        >
          {error ? (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-destructive/30 p-4 text-sm text-destructive"
            >
              {error}
            </div>
          ) : null}
          <div className="page-enter" key={path}>
            {children}
          </div>
          <footer className="mt-10 flex flex-wrap items-center justify-between gap-2 border-t pt-5 text-[10px] text-muted-foreground">
            <span>© {new Date().getFullYear()} triple X · SalesFlow</span>
            <span>Prototipe demo · Data tersimpan di perangkat ini</span>
          </footer>
        </main>
      </div>
      <nav
        aria-label="Navigasi seluler"
        className="nav-safe fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t bg-card/95 px-2 pt-2 backdrop-blur-lg lg:hidden"
      >
        {navigation.map(({ href, label, icon: Icon }) => (
          <AppLink
            key={href}
            href={href}
            aria-current={active(href) ? "page" : undefined}
            className={cn(
              "flex min-h-12 flex-col items-center justify-center gap-1.5 rounded-xl text-[10px] font-medium",
              active(href) ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className={cn("size-5", active(href) && "fill-primary/10")} />
            {label}
          </AppLink>
        ))}
      </nav>
      <NavigationConfirmation />
    </div>
  );
}
