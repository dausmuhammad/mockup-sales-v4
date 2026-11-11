"use client";
import { useEffect } from "react";
import { useApp } from "@/components/providers/app-provider";
export function useDirtyForm(isDirty) {
  const { setDirty } = useApp();
  useEffect(() => {
    setDirty(isDirty);
    return () => setDirty(false);
  }, [isDirty, setDirty]);
}
