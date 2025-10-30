import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronUp, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
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
      <motion.div 
        initial={{ x: -256, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
            className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-card-background border-r border-primary/50 z-30"
      >
        <div className="px-6 py-24">
          <nav className="space-y-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.2, 
                    delay: index * 0.05,
                    ease: "easeOut"
                  }}
                >
                  <Link
                    to={item.href}
                    className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 text-smoky-white font-medium group relative overflow-hidden",
                          isActive
                            ? "text-primary border-l-2 border-primary shadow-lg "
                            : " hover:shadow-md  hover:scale-[1.02] hover:text-primary/90"
                    )}
                  >
                    {/* Smooth background hover effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary/25 rounded-lg opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                    
                    {/* Ripple effect background */}
                    <motion.div
                      className="absolute inset-0 bg-primary/50 rounded-lg"
                      initial={{ scale: 0, opacity: 0 }}
                      whileTap={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.15 }}
                    />
                    
                    {/* Icon with smooth hover animation */}
                    <motion.div
                      whileHover={{ 
                        scale: 1.15,
                        rotate: 5,
                        color: "var(--primary)"
                      }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ 
                        duration: 0.2, 
                        ease: "easeOut",
                        type: "spring",
                        stiffness: 300
                      }}
                      className="relative z-10"
                    >
                      <Icon size={18} />
                    </motion.div>
                    
                    {/* Text with smooth slide animation */}
                    <motion.span
                      initial={{ x: -10 }}
                      animate={{ x: 0 }}
                      whileHover={{ 
                        x: 2,
                        color: "var(--primary)"
                      }}
                      transition={{ 
                        duration: 0.2, 
                        delay: index * 0.05,
                        ease: "easeOut"
                      }}
                      className="relative z-10 flex-1"
                    >
                      {item.name}
                    </motion.span>
                    {/* Badge */}
                    {item.badge && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          duration: 0.2, 
                          delay: index * 0.05 + 0.1,
                          type: "spring",
                          stiffness: 300
                        }}
                        className="relative z-10 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full"
                      >
                        {item.badge}
                      </motion.span>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>
      </motion.div>

      {/* Mobile Bottom Navigation */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
            className="lg:hidden fixed bottom-0 left-0 right-0 bg-card-background border-t border-primary/50 z-40"
      >
        <div className="px-4 py-2">
          {/* Visible Navigation Items */}
          <div className="flex items-center justify-around">
            {visibleItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.2, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <Link
                    to={item.href}
                    className={cn(
                          "flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-300 min-w-0 flex-1 relative overflow-hidden",
                          isActive
                            ? "text-primary bg-primary/10 shadow-lg shadow-primary/50"
                            : "text-gray-400 hover:text-smoky-white hover:bg-primary/5 hover:shadow-md hover:shadow-primary/50 hover:scale-105"
                    )}
                  >
                    {/* Smooth background hover effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-b from-primary/50 to-primary/25 rounded-lg opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                    
                    {/* Ripple effect */}
                    <motion.div
                      className="absolute inset-0 bg-primary/50 rounded-lg"
                      initial={{ scale: 0, opacity: 0 }}
                      whileTap={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.15 }}
                    />
                    
                    {/* Icon with smooth hover animation */}
                    <motion.div
                      whileHover={{ 
                        scale: 1.2,
                        rotate: 3,
                        color: "var(--primary)"
                      }}
                      whileTap={{ scale: 0.85 }}
                      transition={{ 
                        duration: 0.2, 
                        ease: "easeOut",
                        type: "spring",
                        stiffness: 400
                      }}
                      className="relative z-10"
                    >
                      <Icon size={20} />
                    </motion.div>
                    
                    {/* Text with smooth animation */}
                    <motion.span 
                      className="text-xs font-medium truncate w-full text-center relative z-10"
                      whileHover={{ 
                        scale: 1.1,
                        color: "var(--primary)"
                      }}
                      transition={{ 
                        duration: 0.2, 
                        ease: "easeOut"
                      }}
                    >
                      {item.name.split(' ')[0]}
                    </motion.span>
                    {/* Badge for mobile */}
                    {item.badge && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center"
                      >
                        {item.badge}
                      </motion.span>
                    )}
                  </Link>
                </motion.div>
              );
            })}
            
            {/* See More Button */}
            {hiddenItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.2, 
                  delay: visibleItems.length * 0.1,
                  ease: "easeOut"
                }}
              >
                <motion.button
                  onClick={() => setShowMore(!showMore)}
                      className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-300 text-gray-400 hover:text-smoky-white hover:bg-primary/5 hover:shadow-md hover:shadow-primary/50 hover:scale-105 relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.05,
                    color: "var(--primary)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Smooth background hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-primary/15 to-primary/5 rounded-lg opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                  
                  {/* Ripple effect */}
                  <motion.div
                              className="absolute inset-0 bg-primary/50 rounded-lg"
                    initial={{ scale: 0, opacity: 0 }}
                    whileTap={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.15 }}
                  />
                  
                  <motion.div
                    animate={{ rotate: showMore ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: showMore ? 180 : 5
                    }}
                    className="relative z-10"
                  >
                    <MoreHorizontal size={20} />
                  </motion.div>
                  
                  <motion.span 
                    className="text-xs font-medium relative z-10"
                    whileHover={{ 
                      scale: 1.1,
                      color: "var(--primary)"
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    More
                  </motion.span>
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Expanded Menu */}
          <AnimatePresence>
            {showMore && hiddenItems.length > 0 && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                    <div className="mt-2 pt-2 border-t border-primary/50">
                  <motion.div 
                    className="grid grid-cols-2 gap-2"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    {hiddenItems.map((item, index) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.href;
                      
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            duration: 0.2, 
                            delay: index * 0.05,
                            ease: "easeOut"
                          }}
                        >
                          <Link
                            to={item.href}
                            onClick={() => setShowMore(false)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 text-sm relative overflow-hidden",
                                isActive
                                  ? "text-primary bg-primary/10 shadow-lg shadow-primary/50"
                                  : "text-gray-400 hover:text-smoky-white hover:bg-primary/5 hover:shadow-md hover:shadow-primary/50 hover:scale-[1.02]"
                            )}
                          >
                            {/* Smooth background hover effect */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary/25 rounded-lg opacity-0"
                              whileHover={{ opacity: 1 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                            />
                            
                            {/* Ripple effect */}
                            <motion.div
                              className="absolute inset-0 bg-primary/50 rounded-lg"
                              initial={{ scale: 0, opacity: 0 }}
                              whileTap={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.15 }}
                            />
                            
                            <motion.div
                              whileHover={{ 
                                scale: 1.15,
                                rotate: 3,
                                color: "var(--primary)"
                              }}
                              whileTap={{ scale: 0.9 }}
                              transition={{ 
                                duration: 0.2, 
                                ease: "easeOut",
                                type: "spring",
                                stiffness: 300
                              }}
                              className="relative z-10"
                            >
                              <Icon size={16} />
                            </motion.div>
                            
                            <motion.span 
                              className="truncate relative z-10 flex-1"
                              whileHover={{ 
                                x: 2,
                                color: "var(--primary)"
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              {item.name}
                            </motion.span>
                            {/* Badge in expanded menu */}
                            {item.badge && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full"
                              >
                                {item.badge}
                              </motion.span>
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                  
                  <motion.button
                    onClick={() => setShowMore(false)}
                        className="w-full flex items-center justify-center gap-1 mt-2 py-1 text-xs text-gray-500 hover:text-gray-400 transition-all duration-300 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/50 hover:scale-[1.02] rounded-lg relative overflow-hidden"
                    whileHover={{ 
                      scale: 1.02,
                      color: "var(--primary)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                  >
                    {/* Smooth background hover effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary/25 rounded-lg opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                    
                    <motion.div
                      animate={{ rotate: showMore ? 0 : 180 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: showMore ? 5 : 175
                      }}
                      className="relative z-10"
                    >
                      <ChevronUp size={14} />
                    </motion.div>
                    <motion.span 
                      className="relative z-10"
                      whileHover={{ 
                        scale: 1.05,
                        color: "var(--primary)"
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      Show Less
                    </motion.span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
