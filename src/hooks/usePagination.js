import { useMemo, useState, useEffect } from "react";

export default function usePagination(data = [], pageSize = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = data.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize)
  );

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    return data.slice(start, end);
  }, [data, currentPage, pageSize]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const nextPage = () => {
    setCurrentPage((prev) =>
      Math.min(prev + 1, totalPages)
    );
  };

  const prevPage = () => {
    setCurrentPage((prev) =>
      Math.max(prev - 1, 1)
    );
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  return {
    currentPage,
    totalPages,
    totalItems,
    paginatedData,
    goToPage,
    nextPage,
    prevPage,
    setCurrentPage,
  };
}