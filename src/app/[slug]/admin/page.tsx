import AdminClient from './AdminClient'

export function generateStaticParams() {
  return [{ slug: 'noksan' }]
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  return <AdminClient slug={resolvedParams.slug} />
}
