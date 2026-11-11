"use client";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input, Textarea } from "@/components/ui/input";
import { Choice } from "@/components/shared";
import { moneyInput } from "@/lib/formatters";
export function Field({
  form,
  name,
  label,
  hint,
  options,
  money = false,
  multiline = false,
  onValueChange,
  ...props
}) {
  const error = form.formState.errors[name];
  return (
    <div className="space-y-2.5">
      <Label htmlFor={name}>
        {label}
        <span className="ml-1 text-primary" aria-hidden="true">
          *
        </span>
      </Label>
      <Controller
        name={name}
        control={form.control}
        render={({ field }) =>
          options ? (
            <Choice
              id={name}
              value={String(field.value)}
              onChange={field.onChange}
              triggerRef={field.ref}
              onBlur={field.onBlur}
              options={options}
              invalid={Boolean(error)}
              describedBy={`${name}-hint ${name}-error`}
            />
          ) : multiline ? (
            <Textarea
              {...field}
              id={name}
              aria-invalid={Boolean(error)}
              aria-describedby={`${name}-hint ${name}-error`}
              {...props}
            />
          ) : (
            <div className="relative">
              {money && (
                <span className="pointer-events-none absolute left-3.5 top-4 text-sm text-muted-foreground">
                  Rp
                </span>
              )}
              <Input
                {...field}
                id={name}
                className={money ? "pl-11" : undefined}
                value={field.value ?? ""}
                inputMode={money ? "numeric" : undefined}
                onChange={(e) => {
                  const value = money
                    ? moneyInput(e.target.value)
                    : e.target.value;
                  field.onChange(value);
                  onValueChange?.(value);
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={`${name}-hint ${name}-error`}
                {...props}
              />
            </div>
          )
        }
      />
      <p
        id={`${name}-hint`}
        className="text-xs leading-relaxed text-muted-foreground"
      >
        {hint}
      </p>
      <p
        id={`${name}-error`}
        role={error ? "alert" : undefined}
        className="text-xs text-destructive"
      >
        {error?.message}
      </p>
    </div>
  );
}
