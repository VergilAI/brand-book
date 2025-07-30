"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { TableRelationship } from '@/app/map-editor/types/database-types'

export type RelationshipType = TableRelationship | any; // Allow enhanced relationships

interface RelationshipContextType {
  relationships: RelationshipType[];
  setRelationships: (relationships: RelationshipType[]) => void;
  selectedRelationshipId: string | null;
  setSelectedRelationshipId: (id: string | null) => void;
}

const RelationshipContext = createContext<RelationshipContextType | undefined>(undefined)

export function RelationshipProvider({ children }: { children: ReactNode }) {
  const [relationships, setRelationships] = useState<RelationshipType[]>([])
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string | null>(null)
  
  return (
    <RelationshipContext.Provider value={{
      relationships,
      setRelationships,
      selectedRelationshipId,
      setSelectedRelationshipId
    }}>
      {children}
    </RelationshipContext.Provider>
  )
}

export function useRelationships() {
  const context = useContext(RelationshipContext)
  if (!context) {
    throw new Error('useRelationships must be used within RelationshipProvider')
  }
  return context
}