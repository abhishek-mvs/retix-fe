import EventPage from "./EventsPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) return;

  return <EventPage id={Number(id)} />;
}
