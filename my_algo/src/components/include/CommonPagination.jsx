import ReactPaginate from "react-paginate";

const CommonPagination = ({ page, totalPage, pagginationHandler }) => {
  if (!totalPage) return null;

  return (
    <div className="row mt-3 paginationBox">
      <ReactPaginate
        breakLabel={"..."}
        nextLabel={<i className="fa fa-angle-right"></i>}
        previousLabel={<i className="fa fa-angle-left"></i>}
        pageRangeDisplayed={5}
        activeClassName={"active"}
        containerClassName={
          "pagination pagination-sm pagination-gutter justify-content-end"
        }
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        forcePage={page}
        pageCount={totalPage}
        onPageChange={pagginationHandler}
      />
    </div>
  );
};

export default CommonPagination;
