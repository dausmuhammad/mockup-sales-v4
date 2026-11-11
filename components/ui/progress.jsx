"use client";
import * as P from "@radix-ui/react-progress";
export function Progress({ value = 0, ...props }) {
  return (
    <P.Root
      value={value}
      className="relative h-[7px] w-full overflow-hidden rounded-full bg-muted"
      {...props}
    >
      <P.Indicator
        className="h-full w-full rounded-full bg-gradient-to-r from-primary to-[#27c4c7] transition-transform duration-500"
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </P.Root>
  );
}
