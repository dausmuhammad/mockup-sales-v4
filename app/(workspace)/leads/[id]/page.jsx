import LeadDetail from "@/components/leads/lead-detail";
export const metadata = { title: "Detail Lead" };
export default async function Page({ params }) {
  const { id } = await params;
  return <LeadDetail id={id} />;
}
