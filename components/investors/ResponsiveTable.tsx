"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  className?: string;
  mobileOrder?: number;
  hideOnMobile?: boolean;
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  cardClassName?: string;
  mobileCardVariant?: "default" | "outlined" | "interactive";
}

export function ResponsiveTable<T>({
  data,
  columns,
  keyExtractor,
  loading = false,
  emptyMessage = "No data available",
  className,
  cardClassName,
  mobileCardVariant = "default",
}: ResponsiveTableProps<T>) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  // Sort columns by mobile order for card display
  const mobileColumns = [...columns]
    .filter(col => !col.hideOnMobile)
    .sort((a, b) => (a.mobileOrder || 999) - (b.mobileOrder || 999));

  return (
    <>
      {/* Desktop Table View */}
      <div className={cn("hidden lg:block overflow-x-auto", className)}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "text-left py-3 px-4 text-sm font-medium text-gray-700",
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      "py-3 px-4 text-sm",
                      column.className
                    )}
                  >
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {data.map((item) => (
          <div
            key={keyExtractor(item)}
            className={cn(
              "p-4 rounded-lg border transition-all",
              mobileCardVariant === "default" && "bg-gray-50 border-gray-200",
              mobileCardVariant === "outlined" && "bg-transparent border-cosmic-purple/30",
              mobileCardVariant === "interactive" && "bg-gray-50 border-gray-200 hover:bg-cosmic-purple/5 hover:border-cosmic-purple/30",
              cardClassName
            )}
          >
            <div className="space-y-2">
              {mobileColumns.map((column, index) => (
                <div
                  key={column.key}
                  className={cn(
                    "flex justify-between items-start gap-4",
                    index === 0 && "pb-2 border-b border-gray-200"
                  )}
                >
                  <span className="text-xs text-gray-600 font-medium min-w-[80px]">
                    {column.header}:
                  </span>
                  <div className="flex-1 text-right">
                    {column.render(item)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// Example usage for a financial table
export function ResponsiveFinancialTable() {
  const exampleData = [
    { id: 1, date: "2024-01-15", description: "Revenue from Client A", amount: 5000, type: "revenue" },
    { id: 2, date: "2024-01-20", description: "Server costs", amount: -1200, type: "expense" },
  ];

  const columns: Column<typeof exampleData[0]>[] = [
    {
      key: "date",
      header: "Date",
      render: (item) => new Date(item.date).toLocaleDateString(),
      mobileOrder: 2,
    },
    {
      key: "description",
      header: "Description",
      render: (item) => <span className="font-medium">{item.description}</span>,
      mobileOrder: 1,
    },
    {
      key: "amount",
      header: "Amount",
      render: (item) => (
        <span className={cn(
          "font-bold",
          item.amount > 0 ? "text-phosphor-cyan" : "text-neural-pink"
        )}>
          ${Math.abs(item.amount).toLocaleString()}
        </span>
      ),
      mobileOrder: 3,
    },
    {
      key: "type",
      header: "Type",
      render: (item) => (
        <span className={cn(
          "px-2 py-1 rounded-full text-xs",
          item.type === "revenue" 
            ? "bg-phosphor-cyan/10 text-phosphor-cyan" 
            : "bg-neural-pink/10 text-neural-pink"
        )}>
          {item.type}
        </span>
      ),
      mobileOrder: 4,
    },
  ];

  return (
    <ResponsiveTable
      data={exampleData}
      columns={columns}
      keyExtractor={(item) => item.id.toString()}
      mobileCardVariant="interactive"
    />
  );
}