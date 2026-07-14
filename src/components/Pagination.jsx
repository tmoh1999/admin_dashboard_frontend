import { useMemo } from "react";

export default function Pagination({ page, pages, setPage }) {

  const paginationRange = useMemo(() => {
    const delta = 2; // how many pages around current page

    const range = [];
    const start = Math.max(1, page - delta);
    const end = Math.min(pages, page + delta);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  }, [page, pages]);

  return (
    <div className="flex justify-center items-center gap-2 mt-4">

      {/* Prev */}
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="mr-6 px-3 py-1 bg-gray-400 rounded-2xl disabled:opacity-60 font-semibold"
      >
        {"<"} Prev
      </button>

      {/* First page */}
      {paginationRange[0] > 1 && (
        <>
          <button
            onClick={() => setPage(1)}
            className="px-3 py-1 bg-gray-400 rounded-2xl font-semibold"
          >
            1
          </button>
          {paginationRange[0] > 2 && <span>...</span>}
        </>
      )}

      {/* Middle pages */}
      {paginationRange.map((p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={`px-3 py-1 rounded-2xl ${
            p === page ? "bg-blue-500 text-white" : "bg-gray-400 font-semibold"
          }`}
        >
          {p}
        </button>
      ))}

      {/* Last page */}
      {paginationRange[paginationRange.length - 1] < pages && (
        <>
          {paginationRange[paginationRange.length - 1] < pages - 1 && (
            <span>...</span>
          )}
          <button
            onClick={() => setPage(pages)}
            className="px-3 py-1 bg-gray-400 rounded-2xl font-semibold"
          >
            {pages}
          </button>
        </>
      )}

      {/* Next */}
      <button
        disabled={page === pages}
        onClick={() => setPage(page + 1)}
        className="ml-6 px-3 py-1 bg-gray-400 rounded-2xl disabled:opacity-60 font-semibold"
      >
        Next {">"}
      </button>

    </div>
  );
}