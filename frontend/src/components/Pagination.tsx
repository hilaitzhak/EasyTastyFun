
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
        console.log('Pagination hidden because totalPages <= 1');
        return null;
    }
    return (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-white border border-orange-200 text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-50 transition-colors"
          >
            {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </button>
    
          <div className="flex gap-2">
            {getPageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage === pageNumber
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white border-orange-500'
                    : 'bg-white border-orange-200 text-orange-600 hover:bg-orange-50'
                } transition-colors`}
              >
                {pageNumber}
              </button>
            ))}
          </div>
    
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-white border border-orange-200 text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-50 transition-colors"
          >
            {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
    );
}

export default Pagination;