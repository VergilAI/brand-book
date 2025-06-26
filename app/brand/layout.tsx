import { DocsLayout } from "@/components/docs/docs-layout"

export default function BrandBookLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DocsLayout>{children}</DocsLayout>
}