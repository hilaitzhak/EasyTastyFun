
import { ArrowLeft, ArrowRight } from "lucide-react";
import i18n from "../i18n/i18n";
import { PaginationProps } from "../interfaces/Recipe";

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {

    const isRTL = i18n.language === 'he';

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
          for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          if (currentPage <= 3) {
            for (let i = 1; i <= 5; i++) {
              pages.push(i);
            }
          } else if (currentPage >= totalPages - 2) {
            for (let i = totalPages - 4; i <= totalPages; i++) {
              pages.push(i);
            }
          } else {
            for (let i = currentPage - 2; i <= currentPage + 2; i++) {
              pages.push(i);
            }
          }
        }
        
        return pages;
    };

    const handlePageChange = (pageNumber: number) => {
        onPageChange(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (totalPages <= 1) {
        return null;
    }
    return (
        <div className="flex justify-center items-center gap-1.5 mt-10">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            data-tooltip={i18n.t('common.previous')}
            aria-label={i18n.t('common.previous')}
            className="px-4 py-2 rounded-lg bg-surface border border-line text-ink-soft disabled:opacity-50 disabled:cursor-not-allowed hover:border-terracotta hover:text-terracotta-dark transition-colors"
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          </button>

          <div className="flex gap-1.5">
            {getPageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`w-9 h-9 rounded-xl text-sm font-medium border transition-all ${
                  currentPage === pageNumber
                    ? 'bg-terracotta text-white border-terracotta'
                    : 'bg-surface border-line text-ink-soft hover:border-terracotta hover:text-terracotta-dark'
                } transition-colors`}
              >
                {pageNumber}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            data-tooltip={i18n.t('common.next')}
            aria-label={i18n.t('common.next')}
            className="px-4 py-2 rounded-lg bg-surface border border-line text-ink-soft disabled:opacity-50 disabled:cursor-not-allowed hover:border-terracotta hover:text-terracotta-dark transition-colors"
          >
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
    );
}

export default Pagination;