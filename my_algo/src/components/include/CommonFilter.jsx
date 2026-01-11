const CommonFilter = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  status,
  setStatus,
  verify,
  setVerify,
  siteType,
  setSiteType,
  search,
  setSearch,
  serachList,
  searchLdr,
  dateRange,
  setDateRange,
  statusOptions,
  verify_Options,
  siteTypeOption,
}) => {
  return (
    <div className="card-header d-block">
      <div className="row">
        {/* DATE */}
        <div className="col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2 custom">
          <label className="form-label">Date</label>
          <Flatpickr
            className="form-control"
            options={{
              defaultDate: [startDate, endDate],
              altInput: true,
              altFormat: "j, M Y",
              dateFormat: "Y-m-d",
              showMonths: 1,
              mode: "range",
            }}
            onChange={(update) => {
              !update[0] || !update[1]
                ? setDateRange(false)
                : setDateRange(true);
              setStartDate(update[0]);
              update[1] ? setEndDate(update[1]) : "";
            }}
          />
        </div>

        {/* STATUS */}
        <div className="col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2">
          <label className="form-label">Status</label>
          <Select
            options={statusOptions}
            value={statusOptions.find((o) => o.value === status)}
            onChange={(o) => setStatus(o.value)}
          />
        </div>

        {/* VERIFY */}
        <div className="col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2">
          <label className="form-label">Verify</label>
          <Select
            options={verify_Options}
            value={verify_Options.find((o) => o.value === verify)}
            onChange={(o) => setVerify(o.value)}
          />
        </div>

        {/* SITE TYPE */}
        <div className="col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2">
          <label className="form-label">Register From</label>
          <Select
            options={siteTypeOption}
            value={siteTypeOption.find((o) => o.value === siteType)}
            onChange={(o) => setSiteType(o.value)}
          />
        </div>

        {/* SEARCH */}
        <div className="col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2">
          <label className="form-label">Username/Email</label>
          <input
            type="text"
            placeholder="Search"
            className="form-control search-placeholder"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* BUTTON */}
        <div
          className="col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2"
          style={{ marginTop: "11px" }}
        >
          <label className="form-label text-white">&nbsp;</label>
          <br />
          <button
            className="btn btn-bordered-primary search-btn"
            onClick={serachList}
          >
            {searchLdr ? <Loader /> : <i className="bx bx-search"></i>} Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommonFilter;
