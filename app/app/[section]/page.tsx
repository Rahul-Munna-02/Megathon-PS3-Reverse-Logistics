import { notFound } from "next/navigation";
import { navigation } from "@/src/lib/navigation";
import { FutureModule } from "@/src/components/layout/WorkspaceWelcome";

export function generateStaticParams() {
  return navigation.filter(item => item.href !== "/app").map(item => ({ section: item.href.split("/").pop()! }));
}

export default async function ReservedPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const destination = navigation.find(item => item.href === `/app/${section}`);
  if (!destination) notFound();
  return <FutureModule title={destination.label} />;
}