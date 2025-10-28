import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronUp, MoreHorizontal } from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface NavigationProps {
  navItems: NavItem[];
}

export default function Navigation({ navItems }: NavigationProps) {
  const location = useLocation();
  const [showMore, setShowMore] = useState(false);
  
  // Show first 4 items by default on mobile, rest in "see more"
  const visibleItems = navItems.slice(0, 4);
  const hiddenItems = navItems.slice(4);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-card-background border-r border-primary/20 z-30">
        <div className="p-6">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-primary/10 text-smoky-white font-medium",
                    location.pathname === item.href &&
                      "text-primary bg-primary/10 border-l-2 border-primary"
                  )}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card-background border-t border-primary/20 z-40">
        <div className="px-4 py-2">
          {/* Visible Navigation Items */}
          <div className="flex items-center justify-around">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all min-w-0 flex-1",
                    location.pathname === item.href
                      ? "text-primary"
                      : "text-gray-400 hover:text-smoky-white"
                  )}
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium truncate w-full text-center">
                    {item.name.split(' ')[0]}
                  </span>
                </Link>
              );
            })}
            
            {/* See More Button */}
            {hiddenItems.length > 0 && (
              <button
                onClick={() => setShowMore(!showMore)}
                className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all text-gray-400 hover:text-smoky-white"
              >
                <MoreHorizontal size={20} />
                <span className="text-xs font-medium">More</span>
              </button>
            )}
          </div>

          {/* Expanded Menu */}
          {showMore && hiddenItems.length > 0 && (
            <div className="mt-2 pt-2 border-t border-primary/20">
              <div className="grid grid-cols-2 gap-2">
                {hiddenItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setShowMore(false)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm",
                        location.pathname === item.href
                          ? "text-primary bg-primary/10"
                          : "text-gray-400 hover:text-smoky-white hover:bg-primary/5"
                      )}
                    >
                      <Icon size={16} />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
              <button
                onClick={() => setShowMore(false)}
                className="w-full flex items-center justify-center gap-1 mt-2 py-1 text-xs text-gray-500 hover:text-gray-400"
              >
                <ChevronUp size={14} />
                <span>Show Less</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
