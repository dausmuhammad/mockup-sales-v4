import MOForm from "@/components/forms/mo-form";
export const metadata = { title: "Data MO" };
export default async function Page({ params }) {
  const { id } = await params;
  return <MOForm id={id} />;
}
