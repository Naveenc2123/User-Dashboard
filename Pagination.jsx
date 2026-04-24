/**
 * Pagination
 *
 * Props:
 *  currentPage  – active page number (1-based)
 *  totalPages   – total number of pages
 *  onPageChange – (page: number) => void
 *
 * Usage:
 *   <Pagination
 *     currentPage={currentPage}
 *     totalPages={totalPages}
 *     onPageChange={setCurrentPage}
 *   />
 */

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  // Show max 5 page buttons with ellipsis for large sets
  const getPages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages];
    if (currentPage >= totalPages - 2)
      return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const btnBase =
    "h-8 min-w-[2rem] px-2 border rounded-lg text-sm transition flex items-center justify-center";
  const btnDefault = "bg-white border-gray-300 text-gray-600 hover:bg-gray-50";
  const btnActive = "bg-indigo-600 border-indigo-600 text-white";
  const btnDisabled = "opacity-40 cursor-not-allowed pointer-events-none";

  return (
    <div className="flex justify-center flex-wrap gap-1.5 mt-6">

      {/* Prev */}
      <button
        onClick={handlePrev}
        className={[btnBase, btnDefault, currentPage === 1 ? btnDisabled : ""].join(" ")}
      >
        ‹ Prev
      </button>

      {/* Page numbers */}
      {getPages().map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="h-8 w-8 flex items-center justify-center text-gray-400 text-sm"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={[btnBase, page === currentPage ? btnActive : btnDefault].join(" ")}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={handleNext}
        className={[
          btnBase,
          btnDefault,
          currentPage === totalPages ? btnDisabled : "",
        ].join(" ")}
      >
        Next ›
      </button>

    </div>
  );
};

export default Pagination;
