import { useState } from "react";

function TransactionFilter({
  onFilterChange
}) {

  const [filters, setFilters] =
    useState({
      startDate: "",
      endDate: "",
      riskLevel: "",
      fraud: "",
    });

  const handleChange = (
    field,
    value
  ) => {

    const updated = {
      ...filters,
      [field]: value,
    };

    setFilters(updated);

    onFilterChange(updated);

  };

  const handleReset = () => {

    const empty = {
      startDate: "",
      endDate: "",
      riskLevel: "",
      fraud: "",
    };

    setFilters(empty);

    onFilterChange(empty);

  };

  return (

    <div className="bg-white p-4 rounded-xl shadow mb-4">

      <h3 className="font-semibold mb-3">
        Filters
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Start Date */}

        <input
          type="date"
          value={filters.startDate}
          onChange={(e) =>
            handleChange(
              "startDate",
              e.target.value
            )
          }
          className="border p-2 rounded"
        />

        {/* End Date */}

        <input
          type="date"
          value={filters.endDate}
          onChange={(e) =>
            handleChange(
              "endDate",
              e.target.value
            )
          }
          className="border p-2 rounded"
        />

        {/* Risk Level */}

        <select
          value={filters.riskLevel}
          onChange={(e) =>
            handleChange(
              "riskLevel",
              e.target.value
            )
          }
          className="border p-2 rounded"
        >
          <option value="">
            All Risk Levels
          </option>

          <option value="LOW">
            LOW
          </option>

          <option value="MEDIUM">
            MEDIUM
          </option>

          <option value="HIGH">
            HIGH
          </option>

        </select>

        {/* Fraud */}

        <select
          value={filters.fraud}
          onChange={(e) =>
            handleChange(
              "fraud",
              e.target.value
            )
          }
          className="border p-2 rounded"
        >
          <option value="">
            All Fraud Status
          </option>

          <option value="true">
            Fraud
          </option>

          <option value="false">
            Not Fraud
          </option>

        </select>

      </div>

      <button
        onClick={handleReset}
        className="mt-3 bg-gray-200 px-4 py-2 rounded"
      >
        Reset Filters
      </button>

    </div>

  );

}

export default TransactionFilter;