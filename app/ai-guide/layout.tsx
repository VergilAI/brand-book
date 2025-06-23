import { DocsLayout } from "@/components/docs/docs-layout"

export default function AIGuideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DocsLayout>{children}</DocsLayout>
}