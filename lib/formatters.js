export const roleName = (role) =>
  role === "MO" ? "Marketing Officer" : "Surveyor Officer";
export const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0] || "")
    .join("")
    .toUpperCase();
export const rupiah = (n) =>
  n == null
    ? "Belum diisi"
    : new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(n);
export const dateLabel = (value) =>
  value
    ? new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(value))
    : "Belum tersedia";
export const moneyInput = (value) =>
  value === "" || value == null
    ? ""
    : new Intl.NumberFormat("id-ID").format(
        Number(String(value).replace(/\D/g, "")),
      );
export const numericMoney = (value) =>
  value === "" || value == null
    ? NaN
    : Number(String(value).replace(/\./g, ""));
export function normalizePhone(value) {
  const clean = value.replace(/[\s()-]/g, "");
  return clean.startsWith("08") ? `+62${clean.slice(1)}` : clean;
}
