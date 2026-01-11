"use client";
import ReactPaginate from "react-paginate";

const CommonTable = ({
  columns = [],
  data = [],
  loader = false,
  colSpan = 1,
  loaderComponent = null,
  noDataImage = "/assets/images/no-data.png",
  page,
  totalPage,
  onPageChange,
}) => {
  return (
    <>
      <div className="table-responsive position-relative">
        <table className={`table table-striped ${loader && "tbl-overly"}`}>
          {/* ================= THEAD ================= */}
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={col.className}
                  onClick={col.onSort ? col.onSort : undefined}
                >
                  {col.label}

                  {col.sortable && (
                    <span className="iconPosition">
                      <i
                        className={`fa fa-sort-up position-absolute mx-1 mt-1 text-dull asc-${col.sortIndex}`}
                      ></i>
                      <i
                        className={`fa fa-sort-down position-absolute mx-1 mt-1 text-dull desc-${col.sortIndex}`}
                      ></i>
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {/* ================= TBODY ================= */}
          <tbody>
            {data?.length > 0 &&
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={col.tdClassName || col.className}
                    >
                      {col.render
                        ? col.render(row, rowIndex)
                        : row[col.key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))}

            {(loader || data?.length === 0) && (
              <tr>
                <td colSpan={colSpan} className="text-center tableLoaderBox">
                  {loader ? (
                    <div className="disableTbl m-auto">{loaderComponent}</div>
                  ) : (
                    <img src={noDataImage} alt="no data" />
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data.length ? (
        <div className="row mt-3 paginationBox">
          <ReactPaginate
            breakLabel={"..."}
            nextLabel={<i className="fa fa-angle-right"></i>}
            previousLabel={<i className="fa fa-angle-left"></i>}
            pageRangeDisplayed={5}
            renderOnZeroPageCount={null}
            activeClassName={"active"}
            containerClassName={
              "pagination pagination-sm pagination-gutter justify-content-end"
            }
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item page-indicator"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item page-indicator"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            forcePage={page}
            pageCount={totalPage}
            onPageChange={(page) => onPageChange(page)}
          />
        </div>
      ) : null}
    </>
  );
};

export default CommonTable;
