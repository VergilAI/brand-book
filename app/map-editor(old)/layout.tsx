import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Map Editor - Vergil Design System',
  description: 'Visual editor for territory-based maps',
}

export default function MapEditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}