import React, { useState, useEffect } from 'react';

export default function Pagination({ totalItems = 10, itemsPerPage = 10, onPageChange, initialPage=1 }) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);
  
  // Hide pagination if no items or only one page
  if (totalItems === 0) {
    // setCurrentPage(1);
    return null;
  }
  
  const goToPage = (page) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };
  
  const goToPrevious = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };
  
  const goToNext = () => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  };
  
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="pagination-container">
      <div className="pagination">
        <button
          className="pagination-btn prev-btn"
          onClick={goToPrevious}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
          Previous
        </button>
        
        <div className="pagination-numbers">
          {getPageNumbers().map((page, index) =>
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                ...
              </span>
            ) : (
              <button
                key={page}
                className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                onClick={() => goToPage(page)}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )
          )}
        </div>
        
        <button
          className="pagination-btn next-btn"
          onClick={goToNext}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
        >
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </button>
      </div>
      
      <div className="pagination-info">
        <span className="pagination-current">Page {currentPage} of {totalPages}</span>
      </div>
    </div>
  );
}