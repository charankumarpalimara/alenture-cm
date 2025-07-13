import React from "react";
import "./CustomTablePagination.css";

function getRangeLabel({ page, rowsPerPage, count }) {
  const start = count === 0 ? 0 : page * rowsPerPage + 1;
  const end =
    count === 0
      ? 0
      : Math.min(count, (page + 1) * rowsPerPage);
  return `${start}–${end} of ${count}`;
}

export default function CustomTablePagination({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 20, 50, 100],
  labelRowsPerPage = "Rows per page"
}) {
  const totalPages = Math.ceil(count / rowsPerPage);

  return (
    <div className="ctp-root">
      <div className="ctp-inner">
        <div className="ctp-left">
          <span className="ctp-label">{labelRowsPerPage}</span>
          <select
            value={rowsPerPage}
            onChange={e => onRowsPerPageChange(Number(e.target.value))}
            className="ctp-select"
          >
            {rowsPerPageOptions.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="ctp-right">
          <span className="ctp-range">{getRangeLabel({ page, rowsPerPage, count })}</span>
          <div className="ctp-buttons">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0}
              className="ctp-btn"
              aria-label="Previous Page"
            >
              &#60;
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages - 1}
              className="ctp-btn"
              aria-label="Next Page"
            >
              &#62;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}