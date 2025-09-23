import EntryDetailPageView from "@/components/pages/entries/detail";

export default async function EntryDetailPage(props: PageProps<'/entries/[id]'>) {
  const { id } = await props.params;
  return <EntryDetailPageView id={id} />;
}
