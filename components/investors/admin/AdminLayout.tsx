"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  title: string;
  formTitle?: string;
  editingId?: string | null;
  onCancelEdit?: () => void;
  children: ReactNode;
  form: ReactNode;
  loading?: boolean;
  loadingMessage?: string;
}

export function AdminLayout({
  title,
  formTitle = "Add Item",
  editingId,
  onCancelEdit,
  children,
  form,
  loading,
  loadingMessage = "Loading..."
}: AdminLayoutProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-cosmic-purple">{loadingMessage}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Form Card */}
      <Card variant="gradient" className="border-cosmic-purple/20">
        <CardHeader className="pb-4 lg:pb-6">
          <CardTitle className="text-pure-light text-lg lg:text-xl">
            {editingId ? `Edit ${formTitle}` : formTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 lg:p-6">
          {form}
        </CardContent>
      </Card>

      {/* List Card */}
      <Card variant="default" className="bg-pure-light/10 border-stone-gray/20">
        <CardHeader className="pb-4 lg:pb-6">
          <CardTitle className="text-pure-light text-lg lg:text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 lg:p-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}

// Responsive form wrapper
export function AdminForm({ 
  onSubmit, 
  children, 
  editingId, 
  onCancelEdit,
  submitLabel = "Submit"
}: {
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
  editingId?: string | null;
  onCancelEdit?: () => void;
  submitLabel?: string;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {children}
      
      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <Button 
          type="submit" 
          variant="default" 
          className="bg-cosmic-purple hover:bg-cosmic-purple/80 w-full sm:w-auto"
        >
          {submitLabel}
        </Button>
        {editingId && onCancelEdit && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancelEdit}
            className="border-stone-gray/30 text-stone-gray hover:text-pure-light w-full sm:w-auto"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

// Responsive list item wrapper
export function AdminListItem({
  children,
  badge,
  title,
  subtitle,
  value,
  actions,
  className
}: {
  children?: ReactNode;
  badge?: ReactNode;
  title: string;
  subtitle?: string;
  value?: string;
  actions: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(
      "p-4 rounded-lg bg-pure-light/5 border border-stone-gray/20 hover:border-cosmic-purple/30 transition-colors",
      className
    )}>
      {children || (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {badge}
              <p className="text-pure-light font-medium">{title}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              {subtitle && (
                <p className="text-sm text-stone-gray">{subtitle}</p>
              )}
              {value && (
                <p className="text-xl sm:text-2xl font-bold text-phosphor-cyan font-display">
                  {value}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            {actions}
          </div>
        </div>
      )}
    </div>
  );
}

// Responsive form field wrapper
export function AdminFormField({
  label,
  children,
  className
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-sm text-stone-gray mb-1 block">{label}</label>
      {children}
    </div>
  );
}

// Responsive form grid
export function AdminFormGrid({
  children,
  columns = 2
}: {
  children: ReactNode;
  columns?: 1 | 2 | 3;
}) {
  const gridClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
  }[columns];

  return (
    <div className={`grid ${gridClass} gap-4`}>
      {children}
    </div>
  );
}