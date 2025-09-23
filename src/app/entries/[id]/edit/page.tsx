import EntryEditPageView from "@/components/pages/entries/edit";

export default async function EntryEditPage(props: PageProps<'/entries/[id]/edit'>) {
  const { id } = await props.params;
  return <EntryEditPageView id={id} />;
}
