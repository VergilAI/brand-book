import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import { useTextEditorStore } from '@/stores/text-editor-store';

export function useTextEditor() {
  const { getActiveDocument, updateDocument, activeDocumentId } = useTextEditorStore();
  const activeDocument = getActiveDocument();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: {
          depth: 100,
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: 'tiptap-bullet-list',
          },
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: 'tiptap-ordered-list',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'tiptap-list-item',
          },
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      CharacterCount,
      Placeholder.configure({
        placeholder: 'Start typing...',
      }),
    ],
    content: activeDocument?.content || '',
    onUpdate: ({ editor }) => {
      if (activeDocumentId) {
        updateDocument(activeDocumentId, editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-full px-8 py-8',
      },
    },
  });

  return editor;
}