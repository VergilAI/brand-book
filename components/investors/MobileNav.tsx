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
}

export function MobileNav({ user, onLogout }: MobileNavProps) {
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
        <div className="flex items-center gap-3">
          <VergilLogo variant="logo" size="md" animated />
          <div>
            <h1 className="text-lg font-display font-bold text-pure-light">
              Financial Panel
            </h1>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="text-pure-light"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-deep-space/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Slide-out */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-deep-space to-deep-space/95 border-l border-stone-gray/20 z-50 lg:hidden transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-stone-gray/20">
            <h2 className="text-xl font-display font-bold text-pure-light">Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-pure-light"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-6 border-b border-stone-gray/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cosmic-purple to-electric-violet flex items-center justify-center">
                  <User className="w-6 h-6 text-pure-light" />
                </div>
                <div>
                  <p className="text-sm font-medium text-pure-light">{user.name}</p>
                  <p className="text-xs text-stone-gray">{user.email}</p>
                  <p className="text-xs text-consciousness-cyan mt-1">
                    {user.role === 'admin' ? 'Administrator' : 'Investor'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <div className="flex-1 p-6">
            <nav className="space-y-2">
              {isAdminPage ? (
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => handleNavigate('/investors')}
                  className="w-full justify-start text-left text-pure-light hover:bg-cosmic-purple/20"
                >
                  <BarChart3 className="w-5 h-5 mr-3" />
                  View Dashboard
                </Button>
              ) : (
                user?.role === 'admin' && (
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => handleNavigate('/investors/admin')}
                    className="w-full justify-start text-left text-pure-light hover:bg-cosmic-purple/20"
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    Admin Panel
                  </Button>
                )
              )}
            </nav>
          </div>

          {/* Logout Button */}
          <div className="p-6 border-t border-stone-gray/20">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full justify-start text-left text-neural-pink hover:bg-neural-pink/20"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}