import { create } from 'zustand';

export interface Document {
  id: string;
  title: string;
  content: string;
  isDirty: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TextEditorStore {
  documents: Document[];
  activeDocumentId: string | null;
  
  createDocument: () => void;
  updateDocument: (id: string, content: string) => void;
  updateDocumentTitle: (id: string, title: string) => void;
  deleteDocument: (id: string) => void;
  setActiveDocument: (id: string) => void;
  markDocumentClean: (id: string) => void;
  hasUnsavedChanges: () => boolean;
  getActiveDocument: () => Document | undefined;
}

export const useTextEditorStore = create<TextEditorStore>((set, get) => ({
  documents: [],
  activeDocumentId: null,
  
  createDocument: () => {
    const newDoc: Document = {
      id: Date.now().toString(),
      title: 'Untitled Document',
      content: '',
      isDirty: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      documents: [...state.documents, newDoc],
      activeDocumentId: newDoc.id,
    }));
  },
  
  updateDocument: (id, content) => {
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id
          ? { ...doc, content, isDirty: true, updatedAt: new Date() }
          : doc
      ),
    }));
  },
  
  updateDocumentTitle: (id, title) => {
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id
          ? { ...doc, title, isDirty: true, updatedAt: new Date() }
          : doc
      ),
    }));
  },
  
  deleteDocument: (id) => {
    set((state) => {
      const newDocs = state.documents.filter((doc) => doc.id !== id);
      const wasActive = state.activeDocumentId === id;
      const newActiveId = wasActive && newDocs.length > 0 ? newDocs[0].id : state.activeDocumentId;
      
      return {
        documents: newDocs,
        activeDocumentId: newActiveId,
      };
    });
  },
  
  setActiveDocument: (id) => {
    set({ activeDocumentId: id });
  },
  
  markDocumentClean: (id) => {
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, isDirty: false } : doc
      ),
    }));
  },
  
  hasUnsavedChanges: () => {
    return get().documents.some((doc) => doc.isDirty);
  },
  
  getActiveDocument: () => {
    const state = get();
    return state.documents.find((doc) => doc.id === state.activeDocumentId);
  },
}));