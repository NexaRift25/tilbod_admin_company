import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showInfo?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showInfo = true,
  totalItems,
  itemsPerPage,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const visiblePages = pages.filter((page) => {
    if (totalPages <= 7) return true;
    if (page === 1 || page === totalPages) return true;
    if (page >= currentPage - 1 && page <= currentPage + 1) return true;
    return false;
  });

  const getPageInfo = () => {
    if (!totalItems || !itemsPerPage) return null;
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    return `Showing ${startItem}-${endItem} of ${totalItems} items`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Page Info */}
      {showInfo && getPageInfo() && (
        <div className="text-sm text-gray-400">
          {getPageInfo()}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* First Page */}
        {showFirstLast && currentPage > 2 && (
          <button
            onClick={() => onPageChange(1)}
                className="p-2 rounded-lg border border-primary/50 text-white hover:bg-primary/10 transition-all"
            title="First page"
          >
            <ChevronsLeft size={18} />
          </button>
        )}

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
              className="p-2 rounded-lg border border-primary/50 text-white hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          title="Previous page"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page Numbers */}
        {visiblePages.map((page, index) => {
          const prevPage = visiblePages[index - 1];
          const showEllipsis = prevPage && page - prevPage > 1;

          return (
            <React.Fragment key={page}>
              {showEllipsis && (
                <span className="px-2 text-gray-400">...</span>
              )}
              <button
                onClick={() => onPageChange(page)}
                className={cn(
                  "min-w-[2.5rem] px-3 py-2 rounded-lg font-medium transition-all",
                  currentPage === page
                    ? "bg-primary text-dark shadow-lg shadow-primary/20"
                        : "border border-primary/50 text-white hover:bg-primary/10 hover:border-primary/60"
                )}
              >
                {page}
              </button>
            </React.Fragment>
          );
        })}

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-primary/50 text-white hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          title="Next page"
        >
          <ChevronRight size={18} />
        </button>

        {/* Last Page */}
        {showFirstLast && currentPage < totalPages - 1 && (
          <button
            onClick={() => onPageChange(totalPages)}
                className="p-2 rounded-lg border border-primary/50 text-white hover:bg-primary/10 transition-all"
            title="Last page"
          >
            <ChevronsRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;

