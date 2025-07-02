'use client';

import { useState } from 'react';
import { Plus, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface TableData {
  rows: number;
  cols: number;
  data: string[][];
}

export function TableBuilder() {
  const [table, setTable] = useState<TableData>({
    rows: 3,
    cols: 3,
    data: Array(3).fill(null).map(() => Array(3).fill('')),
  });

  const updateCell = (row: number, col: number, value: string) => {
    if (row < 0 || row >= table.rows || col < 0 || col >= table.cols) return;
    const newData = [...table.data];
    newData[row][col] = value;
    setTable({ ...table, data: newData });
  };

  const addRow = () => {
    if (table.rows >= 20) return; // Limit max rows
    const newData = [...table.data, Array(table.cols).fill('')];
    setTable({
      ...table,
      rows: table.rows + 1,
      data: newData,
    });
  };

  const addColumn = () => {
    if (table.cols >= 10) return; // Limit max columns
    const newData = table.data.map(row => [...row, '']);
    setTable({
      ...table,
      cols: table.cols + 1,
      data: newData,
    });
  };

  const deleteRow = (index: number) => {
    if (table.rows <= 1) return;
    const newData = table.data.filter((_, i) => i !== index);
    setTable({
      ...table,
      rows: table.rows - 1,
      data: newData,
    });
  };

  const deleteColumn = (index: number) => {
    if (table.cols <= 1) return;
    const newData = table.data.map(row => row.filter((_, i) => i !== index));
    setTable({
      ...table,
      cols: table.cols - 1,
      data: newData,
    });
  };

  const copyAsMarkdown = async () => {
    try {
      const header = `| ${Array(table.cols).fill('Header').join(' | ')} |`;
      const separator = `| ${Array(table.cols).fill('---').join(' | ')} |`;
      const rows = table.data.map(row => `| ${row.join(' | ')} |`).join('\n');
      const markdown = `${header}\n${separator}\n${rows}`;
      await navigator.clipboard.writeText(markdown);
    } catch (err) {
      // Silently fail if clipboard access is denied
    }
  };

  const copyAsHTML = async () => {
    try {
      const rows = table.data.map(row => 
        `  <tr>\n${row.map(cell => `    <td>${cell}</td>`).join('\n')}\n  </tr>`
      ).join('\n');
      const html = `<table>\n${rows}\n</table>`;
      await navigator.clipboard.writeText(html);
    } catch (err) {
      // Silently fail if clipboard access is denied
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Table Builder</h3>
        <p className="text-xs text-stone-gray dark:text-gray-500">
          Create and customize tables for your document
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={addRow}
          className="flex-1"
          disabled={table.rows >= 20}
        >
          <Plus className="h-3 w-3 mr-1" />
          Row
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={addColumn}
          className="flex-1"
          disabled={table.cols >= 10}
        >
          <Plus className="h-3 w-3 mr-1" />
          Column
        </Button>
      </div>

      {/* Table Editor */}
      <div className="overflow-auto border border-mist-gray dark:border-gray-700 rounded-lg">
        <table className="w-full">
          <tbody>
            {table.data.map((row, rowIndex) => (
              <tr key={rowIndex} className="group">
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className="relative border border-mist-gray dark:border-gray-700 p-1"
                  >
                    <Input
                      value={cell}
                      onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                      className="h-8 text-sm border-0 focus:ring-1 focus:ring-cosmic-purple"
                      placeholder="..."
                    />
                    
                    {/* Delete column button */}
                    {rowIndex === 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteColumn(colIndex)}
                        className={cn(
                          "absolute -top-6 left-1/2 -translate-x-1/2 h-5 w-5",
                          "opacity-0 group-hover:opacity-100 transition-opacity",
                          "hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
                        )}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </td>
                ))}
                
                {/* Delete row button */}
                <td className="w-8">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteRow(rowIndex)}
                    className={cn(
                      "h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity",
                      "hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
                    )}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Export Options */}
      <div className="space-y-2">
        <Label className="text-xs">Export as:</Label>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyAsMarkdown}
            className="flex-1"
          >
            <Copy className="h-3 w-3 mr-1" />
            Markdown
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={copyAsHTML}
            className="flex-1"
          >
            <Copy className="h-3 w-3 mr-1" />
            HTML
          </Button>
        </div>
      </div>
    </div>
  );
}