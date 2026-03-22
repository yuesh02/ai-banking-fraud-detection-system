import { useEffect, useState } from "react";

import TransactionTable from
  "../components/transactions/TransactionTable";

import Pagination from
  "../components/common/Pagination";

import TransactionFilter from
  "../components/transactions/TransactionFilter";

import {
  getTransactions,
  searchTransactions
} from "../services/transactionService";

function Transactions() {

  const [transactions,
    setTransactions] = useState([]);

  const [page,
    setPage] = useState(0);

  const [totalPages,
    setTotalPages] = useState(0);

  // NEW: store all filters
  const [filters,
    setFilters] = useState({});

  useEffect(() => {

    fetchTransactions(page);

  }, [page, filters]);

  const fetchTransactions =
    async (currentPage) => {

    try {

      let data;

      // If any filter is applied
      const hasFilters =
        Object.values(filters)
          .some(value => value);

      if (hasFilters) {

        data =
          await searchTransactions({
            ...filters,
            page: currentPage,
            size: 10
          });

      } else {

        data =
          await getTransactions(
            currentPage,
            10
          );

      }

      setTransactions(
        data.content
      );

      setTotalPages(
        data.totalPages
      );

    } catch (error) {

      console.error(
        "Transaction fetch error:",
        error
      );

    }

  };

  const handlePageChange =
    (newPage) => {

    if (
      newPage >= 0 &&
      newPage < totalPages
    ) {
      setPage(newPage);
    }

  };

  const handleFilterChange =
    (newFilters) => {

    setFilters(newFilters);

    // reset to first page
    setPage(0);

  };

  return (

    <div>

      <h1 className="text-2xl font-bold mb-6">

        Transactions

      </h1>

      <TransactionFilter
        onFilterChange={
          handleFilterChange
        }
      />

      <TransactionTable
        data={transactions}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={
          handlePageChange
        }
      />

    </div>

  );

}

export default Transactions;