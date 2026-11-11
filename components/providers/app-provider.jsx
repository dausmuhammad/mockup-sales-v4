"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ThemeProvider } from "next-themes";
import { Toaster, toast } from "sonner";
import {
  DATA_KEY,
  LEGACY_KEY,
  SESSION_KEY,
  loadMetadata,
  loadSession,
  saveMetadata,
} from "@/lib/storage/metadata";
import {
  clearPhotos,
  deletePhoto,
  getPhoto,
  putPhoto,
} from "@/lib/storage/photos";
import { createLead, completeMO, updateDocuments } from "@/lib/lead-actions";
import { sessionSchema } from "@/lib/validation/schemas";
const Context = createContext(null);
export function useApp() {
  const value = useContext(Context);
  if (!value) throw new Error("AppProvider diperlukan.");
  return value;
}
export function AppProvider({ children }) {
  const [leads, setLeads] = useState([]),
    [session, setSession] = useState(null),
    [ready, setReady] = useState(false),
    [error, setError] = useState("");
  const current = useRef([]),
    busy = useRef(false),
    [dirty, setDirty] = useState(false),
    [pendingNavigation, setPendingNavigation] = useState(null);
  useEffect(() => {
    try {
      const result = loadMetadata(localStorage);
      current.current = result.leads;
      setLeads(result.leads);
      setSession(loadSession(localStorage));
      if (result.migrated)
        toast.info(
          "Data lama dipulihkan. Foto survei perlu diunggah kembali; aktivitas historis tidak direka.",
        );
    } catch (e) {
      setError(e.message);
    } finally {
      setReady(true);
    }
  }, []);
  const commit = useCallback((next) => {
    saveMetadata(localStorage, next);
    current.current = next;
    setLeads(next);
  }, []);
  const patch = useCallback(
    (id, update) => {
      const found = current.current.find((l) => l.id === id);
      if (!found) throw new Error("Lead tidak ditemukan.");
      const next = update(found);
      commit(current.current.map((l) => (l.id === id ? next : l)));
      return next;
    },
    [commit],
  );
  const requireRole = useCallback(
    (role) => {
      if (session?.role !== role || error)
        throw new Error("Aksi tidak tersedia untuk sesi ini.");
    },
    [session, error],
  );
  const actions = {
    login(data) {
      if (error) throw new Error(error);
      const parsed = sessionSchema.parse(data);
      localStorage.setItem(SESSION_KEY, JSON.stringify(parsed));
      setSession(parsed);
    },
    logout() {
      localStorage.removeItem(SESSION_KEY);
      setSession(null);
      setDirty(false);
    },
    async reset() {
      if (busy.current) throw new Error("Tunggu penyimpanan dokumen selesai.");
      await clearPhotos();
      localStorage.removeItem(DATA_KEY);
      localStorage.removeItem(LEGACY_KEY);
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem("salesflow-theme");
      localStorage.removeItem("salesflow-theme-reference-v1");
      current.current = [];
      setLeads([]);
      setSession(null);
      setError("");
      setDirty(false);
    },
    addLead(data) {
      requireRole("MO");
      const lead = createLead(data, current.current);
      commit([lead, ...current.current]);
      return lead;
    },
    saveMO(id, data) {
      requireRole("MO");
      return patch(id, (lead) => completeMO(lead, data));
    },
    saveSchedule(id, schedule) {
      requireRole("MO");
      patch(id, (l) => {
        if (
          l.otr !== schedule.otr ||
          l.downPayment !== schedule.downPayment ||
          l.tenorMonths !== schedule.tenorMonths
        )
          throw new Error("Data pembiayaan berubah. Buat ulang simulasi.");
        return {
          ...l,
          installmentSchedule: schedule,
          updatedAt: new Date().toISOString(),
        };
      });
    },
    async savePhoto(id, key, file) {
      requireRole("SO");
      if (busy.current) throw new Error("Tunggu penyimpanan dokumen selesai.");
      busy.current = true;
      const photoId = crypto.randomUUID();
      try {
        const lead = current.current.find((l) => l.id === id);
        if (!lead?.moCompletedAt)
          throw new Error("Lead belum tersedia untuk survei.");
        await putPhoto(photoId, file);
        const old = lead.documents[key];
        try {
          patch(id, (l) =>
            updateDocuments(l, {
              ...l.documents,
              [key]: {
                id: photoId,
                name: file.name,
                size: file.size,
                type: file.type,
              },
            }),
          );
        } catch (e) {
          await deletePhoto(photoId);
          throw e;
        }
        if (old?.id) await deletePhoto(old.id).catch(() => {});
      } finally {
        busy.current = false;
      }
    },
    async removePhoto(id, key) {
      requireRole("SO");
      if (busy.current) throw new Error("Tunggu penyimpanan dokumen selesai.");
      const old = current.current.find((l) => l.id === id)?.documents[key];
      patch(id, (l) => updateDocuments(l, { ...l.documents, [key]: null }));
      if (old?.id) await deletePhoto(old.id).catch(() => {});
    },
    async saveSurvey(id) {
      requireRole("SO");
      if (busy.current) throw new Error("Tunggu penyimpanan foto selesai.");
      const lead = current.current.find((l) => l.id === id);
      if (!lead?.moCompletedAt) throw new Error("Data MO belum lengkap.");
      const files = await Promise.all([
        getPhoto(lead.documents.house?.id),
        getPhoto(lead.documents.salarySlip?.id),
      ]);
      if (files.some((f) => !f))
        throw new Error(
          "Kedua file foto wajib tersedia. Unggah kembali dokumen yang hilang.",
        );
      patch(id, (l) => updateDocuments(l, l.documents, true));
    },
  };
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      storageKey="salesflow-theme-reference-v1"
    >
      <Context.Provider
        value={{
          leads,
          session,
          ready,
          error,
          actions,
          dirty,
          setDirty,
          pendingNavigation,
          setPendingNavigation,
        }}
      >
        {children}
        <Toaster
          richColors
          closeButton
          position="top-center"
          toastOptions={{ className: "font-sans" }}
        />
      </Context.Provider>
    </ThemeProvider>
  );
}
