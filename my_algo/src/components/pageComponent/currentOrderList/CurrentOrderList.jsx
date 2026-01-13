"use client";
import { Toaster } from "react-hot-toast";
import "flatpickr/dist/flatpickr.css";
const moment = require("moment");
moment.suppressDeprecationWarnings = true;
import Table_Loader from "../../include/TableLoader";
import { convert_date } from "../../../utils/common";
import Loader from "../../include/Loader";
import CommonTable from "../../include/CommonTable";
import CommonHeader from "../../include/CommonHeader";
import dataListContainer from "./dataListContainer";
import AddTradeModel from "./AddTradeModel";

const CurrentOrderList = ({ listType }) => {
  const {
    show,
    setShow,
    page,
    setPage,
    totalPage,
    order,
    setOrder,
    loader,
    searchLdr,
    userlists,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    status,
    setStatus,
    siteType,
    setSiteType,
    activationLdr,
    setActivationLdr,
    varificationLdr,
    setVarificationLdr,
    twoFaLdr,
    setTwoFaLdr,
    loading,
    setLoading,
    user_id,
    user_email,
    listIndex,
    setListindex,
    showPwd,
    setShowPwd,
    handleShow,
    pagginationHandler,
    statusOptions,
    siteTypeOption,
    verify_Options,
    verify,
    setVerify,
    search,
    setSearch,
    GetUserList,
    setAuthTkn,
    serachList,
    pageTitle,
    handleSort,
  } = dataListContainer({
    listType,
  });

  return (
    <div className="content-body btn-page">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="container-fluid p-4">
        <div className="row">
          <h3 className="page-title-main">{pageTitle}</h3>

          <div className="col-lg-12">
            <div className="card mt-4 mb-4">
              <CommonHeader
                startDate={startDate}
                endDate={endDate}
                onDateChange={(update) => {
                  !update[0] || !update[1]
                    ? setDateRange(false)
                    : setDateRange(true);
                  setStartDate(update[0]);
                  update[1] && setEndDate(update[1]);
                }}
                filters={[
                  {
                    label: "Status",
                    options: statusOptions,
                    value: status,
                    onChange: setStatus,
                  },
                  {
                    label: "Verify",
                    options: verify_Options,
                    value: verify,
                    onChange: setVerify,
                  },
                  {
                    label: "Register From",
                    options: siteTypeOption,
                    value: siteType,
                    onChange: setSiteType,
                  },
                ]}
                searchValue={search}
                onSearchChange={setSearch}
                onSearchClick={() =>
                  handleShow({ user_id: 1, email: "row.email" })
                } //{serachList}
                loading={searchLdr}
                LoaderComponent={Loader}
              />

              <div className="card-body">
                <CommonTable
                  loader={loader}
                  data={userlists}
                  colSpan={10}
                  loaderComponent={<Table_Loader />}
                  columns={[
                    {
                      label: "#",
                      key: "num",
                      className: "text-center cursor-pointer text-nowrap",
                      sortable: true,
                      sortIndex: 0,
                      onSort: () => handleSort(0),
                    },
                    {
                      label: "User Name",
                      key: "userName",
                      className: "text-center cursor-pointer text-nowrap",
                      sortable: true,
                      sortIndex: 1,
                      onSort: () => handleSort(1),
                    },
                    {
                      label: "Email",
                      key: "email",
                      className: "text-center cursor-pointer text-nowrap",
                      sortable: true,
                      sortIndex: 2,
                      onSort: () => handleSort(2),
                    },
                    {
                      label: "Status",
                      className: "text-center text-nowrap",
                      render: (row) =>
                        row.status == 1 ? (
                          <span className="badge badge-success">Active</span>
                        ) : (
                          <span className="badge badge-warning">Deactive</span>
                        ),
                    },
                    {
                      label: "Verify Status",
                      className: "text-center text-nowrap",
                      render: (row) =>
                        row.isVerify == 1 ? (
                          <span className="badge badge-success">Verified</span>
                        ) : (
                          <span className="badge badge-warning">
                            Not Verify
                          </span>
                        ),
                    },
                    {
                      label: "Created On",
                      className: "text-center text-nowrap",
                      render: (row) => convert_date(row.createdOn),
                    },
                    {
                      label: "Action",
                      className: "text-center text-nowrap",
                      render: (row, i) => (
                        <button
                          className="btn btn-light btn-sm"
                          onClick={() =>
                            handleShow({ user_id: row.id, email: row.email })
                          }
                        >
                          Change Password
                        </button>
                      ),
                    },
                  ]}
                  page={page}
                  totalPage={totalPage}
                  onPageChange={(page) => pagginationHandler(page)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddTradeModel
        show={show}
        setShow={setShow}
        showPwd={showPwd}
        loading={loading}
        setShowPwd={setShowPwd}
        setLoading={setLoading}
        user_id={user_id}
        user_email={user_email}
        GetUserList={GetUserList}
        setAuthTkn={setAuthTkn}
        activationLdr={activationLdr}
        setActivationLdr={setActivationLdr}
        varificationLdr={varificationLdr}
        setVarificationLdr={setVarificationLdr}
        twoFaLdr={twoFaLdr}
        setTwoFaLdr={setTwoFaLdr}
        setListindex={setListindex}
      />
    </div>
  );
};

export default CurrentOrderList;
