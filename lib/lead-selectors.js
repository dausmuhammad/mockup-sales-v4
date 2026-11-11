export const relevantLeads = (leads, role) =>
  leads.filter((l) => role === "MO" || Boolean(l.moCompletedAt));
export const isDone = (lead, role) =>
  Boolean(role === "MO" ? lead.moCompletedAt : lead.soCompletedAt);
export function selectLeads(leads, role, filter = "all", query = "") {
  const q = query.trim().toLowerCase();
  return relevantLeads(leads, role)
    .filter(
      (l) =>
        (filter === "all" ||
          (filter === "done" ? isDone(l, role) : !isDone(l, role))) &&
        (!q ||
          [
            l.name,
            l.id,
            l.leadNumber,
            l.nik,
            l.phone,
            l.phone?.replace("+62", "0"),
          ].some((s) =>
            String(s || "")
              .toLowerCase()
              .includes(q),
          )),
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
export function metrics(leads, role) {
  const list = relevantLeads(leads, role),
    done = list.filter((l) => isDone(l, role)).length,
    pending = list.length - done;
  const cards =
    role === "MO"
      ? [
          ["Total lead", leads.length],
          ["Perlu dilengkapi", pending],
          ["Selesai MO", done],
          [
            "Menunggu SO",
            leads.filter((l) => l.moCompletedAt && !l.soCompletedAt).length,
          ],
        ]
      : [
          ["Menunggu survei", pending],
          [
            "Dokumen belum lengkap",
            list.filter(
              (l) =>
                !l.soCompletedAt &&
                (!l.documents.house || !l.documents.salarySlip),
            ).length,
          ],
          ["Selesai survei", done],
          ["Total ditangani", list.length],
        ];
  return {
    cards,
    total: list.length,
    done,
    pending,
    percent: list.length ? Math.round((done / list.length) * 100) : 0,
  };
}
export function weeklyActivity(leads, role, now = new Date()) {
  const field = role === "MO" ? "firstMoCompletedAt" : "firstSoCompletedAt";
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(now);
    day.setDate(day.getDate() - 6 + i);
    day.setHours(0, 0, 0, 0);
    const end = new Date(day);
    end.setDate(end.getDate() + 1);
    return {
      label: new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(day),
      date: day.toISOString(),
      count: leads.filter(
        (l) =>
          l[field] && new Date(l[field]) >= day && new Date(l[field]) < end,
      ).length,
    };
  });
}
