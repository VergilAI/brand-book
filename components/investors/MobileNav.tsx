"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, LogOut, Settings, User, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VergilLogo } from "@/components/vergil/vergil-logo";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  user: {
    id: string;
    email: string;
    role: 'admin' | 'investor';
    name: string;
  } | null;
  onLogout: () => void;
  adminTab?: string;
  onAdminTabChange?: (tab: string) => void;
}

export function MobileNav({ user, onLogout, adminTab, onAdminTabChange }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isAdminPage = pathname === '/investors/admin';

  const handleNavigate = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between">
        <div className="flex items-center gap-2">
          <VergilLogo variant="mark" size="md" animated className="filter invert" />
          <h1 className="text-base font-display font-bold text-dark-900">
            Vergil Finances
          </h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile Menu Push-down */}
      <div
        className={cn(
          "lg:hidden bg-white border-b border-gray-200 shadow-sm transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 py-3">

          {/* User Info */}
          {user && (
            <div className="mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cosmic-purple to-electric-violet flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-dark-900">{user.name}</p>
                  <p className="text-xs text-cosmic-purple">
                    {user.role === 'admin' ? 'Administrator' : 'Investor'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <nav className="space-y-2">
              {isAdminPage ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNavigate('/investors')}
                    className="w-full justify-start text-left text-gray-700 hover:bg-gray-100"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </>
              ) : (
                user?.role === 'admin' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNavigate('/investors/admin')}
                    className="w-full justify-start text-left text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Admin Panel
                  </Button>
                )
              )}
            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full justify-start text-left text-red-600 hover:bg-red-50 mt-4 pt-4 border-t border-gray-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </nav>
        </div>
      </div>
    </>
  );
}