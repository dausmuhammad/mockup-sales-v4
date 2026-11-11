export function calculateSchedule(lead, now = new Date().toISOString()) {
  if (
    !lead.moCompletedAt ||
    !(lead.otr > lead.downPayment) ||
    ![12, 24, 36, 48].includes(lead.tenorMonths)
  )
    throw new Error("Lengkapi data MO sebelum membuat jadwal angsuran.");
  const principal = lead.otr - lead.downPayment,
    monthly = Math.floor(principal / lead.tenorMonths);
  return {
    principal,
    monthly,
    tenorMonths: lead.tenorMonths,
    otr: lead.otr,
    downPayment: lead.downPayment,
    createdAt: now,
    installments: Array.from({ length: lead.tenorMonths }, (_, i) => ({
      number: i + 1,
      amount:
        i === lead.tenorMonths - 1
          ? principal - monthly * (lead.tenorMonths - 1)
          : monthly,
    })),
  };
}
export async function simulateSchedule(lead) {
  const snapshot = { ...lead };
  await new Promise((resolve) => setTimeout(resolve, 900));
  return calculateSchedule(snapshot);
}
