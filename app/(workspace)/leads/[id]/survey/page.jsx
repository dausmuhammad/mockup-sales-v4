import SurveyForm from "@/components/forms/survey-form";
export const metadata = { title: "Dokumen Survei" };
export default async function Page({ params }) {
  const { id } = await params;
  return <SurveyForm id={id} />;
}
