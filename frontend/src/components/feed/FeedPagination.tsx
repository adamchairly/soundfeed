import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useState, useRef } from "react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { button, text } from "@/styles/tailwind";

interface FeedPaginationProps {
  page: number;
  totalPages: number;
  pageSize: number;
  sortDescending: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSortChange: (desc: boolean) => void;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

export const FeedPagination = ({
  page,
  totalPages,
  pageSize,
  sortDescending,
  onPageChange,
  onPageSizeChange,
  onSortChange,
}: FeedPaginationProps) => {
  const [showPageSizeMenu, setShowPageSizeMenu] = useState(false);
  const pageSizeMenuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(
    pageSizeMenuRef,
    () => setShowPageSizeMenu(false),
    showPageSizeMenu
  );

  const getVisiblePages = (): (number | string)[] => {
    if (totalPages <= 1) return [1];

    const DELTA = 2;
    const pages: (number | string)[] = [];
    const left = Math.max(2, page - DELTA);
    const right = Math.min(totalPages - 1, page + DELTA);

    pages.push(1);

    if (left > 2) pages.push("...");

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) pages.push("...");

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const handlePageSizeSelect = (size: number) => {
    onPageSizeChange(size);
    setShowPageSizeMenu(false);
  };

  if (totalPages === 0) return null;

  return (
    <div
      className={`flex items-center justify-between text-sm ${text.muted} mt-6`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => onSortChange(!sortDescending)}
          className={`flex items-center gap-2 ${button.base} ${button.hoverText}`}
          aria-label={sortDescending ? "Sort ascending" : "Sort descending"}
        >
          {sortDescending ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
        </button>

        <div className="relative" ref={pageSizeMenuRef}>
          <button
            onClick={() => setShowPageSizeMenu(!showPageSizeMenu)}
            className={`flex items-center gap-1 ${button.base} ${button.hoverText}`}
            aria-label="Change page size"
            aria-expanded={showPageSizeMenu}
          >
            Show {pageSize}
            <ChevronDown size={14} />
          </button>

          {showPageSizeMenu && (
            <div className="absolute bottom-full left-0 mb-2 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[80px]">
              {PAGE_SIZE_OPTIONS.map((size) => (
                <button
                  key={size}
                  onClick={() => handlePageSizeSelect(size)}
                  className={`w-full px-4 py-2 text-left ${
                    button.base
                  } hover:bg-slate-50 ${
                    size === pageSize
                      ? "bg-slate-100 text-slate-900"
                      : text.secondary
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={`p-1 ${button.base} ${button.hoverText} ${button.disabled}`}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1">
          {getVisiblePages().map((p, idx) =>
            p === "..." ? (
              <span key={`ellipsis-${idx}`} className="px-2">
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p as number)}
                className={`px-2 py-1 min-w-[32px] rounded ${button.base} ${
                  p === page ? button.primary : button.hoverText
                }`}
                aria-label={`Page ${p}`}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={`p-1 ${button.base} ${button.hoverText} ${button.disabled}`}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
