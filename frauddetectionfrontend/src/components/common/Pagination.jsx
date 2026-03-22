function Pagination({
  page,
  totalPages,
  onPageChange
}) {

  return (

    <div className="flex justify-center gap-4 mt-6">

      <button
        onClick={() =>
          onPageChange(page - 1)
        }
        disabled={page === 0}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Previous
      </button>

      <span className="font-semibold">

        Page {page + 1} of {totalPages}

      </span>

      <button
        onClick={() =>
          onPageChange(page + 1)
        }
        disabled={page === totalPages - 1}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Next
      </button>

    </div>

  );

}

export default Pagination;