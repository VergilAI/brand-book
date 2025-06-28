"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingAddButtonProps {
  activeTab: string;
  onAdd: () => void;
}

export function FloatingAddButton({ activeTab, onAdd }: FloatingAddButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getLabel = () => {
    switch (activeTab) {
      case "balances":
        return "Add Balance";
      case "revenues":
        return "Add Revenue";
      case "expenses":
        return "Add Expense";
      case "hypotheticals":
        return "Add Scenario";
      case "users":
        return "Add User";
      default:
        return "Add Item";
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-30 lg:hidden">
      <Button
        onClick={() => {
          if (isExpanded) {
            onAdd();
          }
          setIsExpanded(!isExpanded);
        }}
        size="lg"
        className={cn(
          "rounded-full shadow-lg shadow-cosmic-purple/30",
          "bg-cosmic-purple hover:bg-cosmic-purple/90",
          "transition-all duration-300 ease-out",
          isExpanded ? "pl-4 pr-6" : "w-14 h-14 p-0"
        )}
      >
        <Plus className={cn(
          "transition-transform duration-300",
          isExpanded ? "rotate-45 mr-2" : "w-6 h-6"
        )} />
        {isExpanded && (
          <span className="animate-in fade-in slide-in-from-right-2 duration-300">
            {getLabel()}
          </span>
        )}
      </Button>
    </div>
  );
}