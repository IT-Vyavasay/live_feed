"use client";
import React from "react";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import "flatpickr/dist/flatpickr.css";

const CommonHeader = ({
  // Date
  showDate = true,
  startDate,
  endDate,
  onDateChange,

  // Dropdowns
  filters = [],

  // Search
  searchValue,
  onSearchChange,
  onSearchClick,
  searchPlaceholder = "Search",

  // Button
  loading = false,
  LoaderComponent = null,
}) => {
  return (
    <div className="card-header d-block">
      <div className="row">
        {/* Date Range */}
        {showDate && (
          <div className="col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2">
            <label className="form-label">Date</label>
            <Flatpickr
              className="form-control"
              options={{
                defaultDate: [startDate, endDate],
                altInput: true,
                altFormat: "j, M Y",
                dateFormat: "Y-m-d",
                mode: "range",
              }}
              onChange={onDateChange}
            />
          </div>
        )}

        {/* Dynamic Select Filters */}
        {filters.map((item, index) => (
          <div
            key={index}
            className="col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2"
          >
            <label className="form-label">{item.label}</label>
            <Select
              options={item.options}
              value={item.options.find((opt) => opt.value === item.value)}
              onChange={(selected) => item.onChange(selected?.value)}
            />
          </div>
        ))}

        {/* Search Input */}
        <div className="col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2">
          <label className="form-label">Username / Email</label>
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="form-control search-placeholder"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Search Button */}
        <div
          className="col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2"
          style={{ marginTop: "11px" }}
        >
          <label className="form-label text-white">&nbsp;</label>
          <br />
          <button
            className="btn btn-bordered-primary waves-effect waves-light"
            onClick={onSearchClick}
          >
            {loading && LoaderComponent ? (
              <LoaderComponent />
            ) : (
              <i className="bx bx-search"></i>
            )}{" "}
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommonHeader;
