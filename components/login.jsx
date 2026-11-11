"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/components/providers/app-provider";
import { Brand, Loading } from "@/components/shared";
import { Field } from "@/components/forms/fields";
import { ResetDemo } from "@/components/reset-demo";
import { Button } from "@/components/ui/button";
import { sessionSchema } from "@/lib/validation/schemas";
export default function Login() {
  const { session, ready, error, actions } = useApp(),
    router = useRouter(),
    [busy, setBusy] = useState(false);
  const form = useForm({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      name: "Andi Pratama",
      role: "MO",
      branch: "Jakarta Selatan",
    },
  });
  useEffect(() => {
    if (ready && session) router.replace("/");
  }, [ready, session, router]);
  if (!ready || session) return <Loading />;
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[linear-gradient(155deg,#101b3d,#27499b)] px-[22px] py-[35px] text-white">
      <div className="w-full max-w-[430px]">
        <Brand light />
        <h1 className="mt-11 text-[27px] font-bold leading-tight">
          Selamat datang,
          <br />
          Sales Champion.
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-[#c0cbed]">
          Kelola prospek, lengkapi data, dan pantau progres pekerjaan dalam satu
          aplikasi.
        </p>
        <div className="mt-6 rounded-[18px] border bg-card p-4 text-foreground">
          <h2 className="mb-5 text-sm font-bold">Masuk ke SalesFlow</h2>
          {error && (
            <p role="alert" className="mb-4 text-sm text-destructive">
              {error}
            </p>
          )}{" "}
          <form
            noValidate
            onSubmit={form.handleSubmit(async (data) => {
              setBusy(true);
              try {
                actions.login(data);
                router.replace("/");
                toast.success(`Selamat datang, ${data.name}.`);
              } catch (e) {
                toast.error(e.message);
              } finally {
                setBusy(false);
              }
            })}
            className="space-y-5"
          >
            <Field
              form={form}
              name="role"
              label="Fungsi kerja"
              options={[
                { value: "MO", label: "Marketing Officer" },
                { value: "SO", label: "Surveyor Officer" },
              ]}
            />
            <Field
              form={form}
              name="name"
              label="Nama pengguna"
              autoComplete="name"
              placeholder="Nama lengkap Anda"
            />
            <Field
              form={form}
              name="branch"
              label="Cabang"
              options={["Jakarta Selatan", "Bandung", "Surabaya"]}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={busy || Boolean(error)}
            >
              {busy ? <LoaderCircle className="animate-spin" /> : null}Masuk ke
              aplikasi
              <ArrowRight />
            </Button>
          </form>
          <ResetDemo className="mt-2.5 w-full" />
        </div>
        <p className="mt-6 text-center text-[10px] text-[#aab9e6]">
          DEMO PROTOTYPE · DATA SIMULASI
        </p>
      </div>
    </main>
  );
}
