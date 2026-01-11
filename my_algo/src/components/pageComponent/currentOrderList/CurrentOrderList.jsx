"use client";
import React, { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import "flatpickr/dist/flatpickr.css";
const moment = require("moment");
moment.suppressDeprecationWarnings = true;
import Swal from "sweetalert2";
import Table_Loader from "../../include/TableLoader";
import {
  chk_password,
  convert_date,
  validate_string,
} from "../../../utils/common";
import { fetchApi } from "../../../utils/frondend";
import Loader from "../../include/Loader";
import CommonTable from "../../include/CommonTable";
import CommonModal from "../../include/CommonModal";
import CommonHeader from "../../include/CommonHeader";
import { useAuthContext } from "../../../context/auth";
import { useTradeWS } from "../../../hook/useSocket";
import ChangePasswordModal from "./ChangePasswordModal";
const CurrentOrderList = () => {
  const { setAuthTkn, setPageLoader } = useAuthContext();
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [order, setOrder] = useState(1);
  const [orderClm, setOrderClm] = useState(7);
  const [loader, setLoader] = useState(false);
  const [searchLdr, setSearchLdr] = useState(false);
  const [userlists, setUserLists] = useState([]);
  const date = moment(new Date()).subtract(process.env.FILTERDAYS, "days");
  const [startDate, setStartDate] = useState(date["_d"]);
  const [endDate, setEndDate] = useState(date["_i"]);
  const [status, setStatus] = useState("");
  const [siteType, setSiteType] = useState("");
  const [activationLdr, setActivationLdr] = useState(false);
  const [varificationLdr, setVarificationLdr] = useState(false);
  const [twoFaLdr, setTwoFaLdr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user_id, set_user_id] = useState("");
  const [user_email, set_user_email] = useState("");
  const [listIndex, setListindex] = useState(-1);
  const [showPwd, setShowPwd] = useState({
    admPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleShow = ({ user_id, email }) => {
    set_user_id(user_id);
    set_user_email(email);
    setShow(true);
  };

  let st = new Date(moment(startDate).format("MM/DD/YYYY")).getTime() / 1000;
  let ed = endDate
    ? new Date(
        moment(moment(endDate).format("MM/DD/YYYY"))
          .add(23, "h")
          .add(59, "m")
          .add(59, "s")
      ).getTime() / 1000
    : 0;

  const [verify, setVerify] = useState("");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState(true);

  const pagginationHandler = (page) => {
    var p = page.selected;
    setPage(p);
  };

  const statusOptions = [
    { label: "All", value: "" },
    { label: "Active", value: "1" },
    { label: "Deactive", value: "0" },
  ];
  const siteTypeOption = [
    { label: "All", value: "" },
    { label: "NFT21", value: "0" },
    { label: "SOLARES", value: "1" },
  ];
  const verify_Options = [
    { label: "All", value: "" },
    { label: "Verified", value: "1" },
    { label: "Not Verify", value: "0" },
  ];

  const GetUserList = async () => {
    if (!loader) {
      setLoader(true);
      const userData = JSON.stringify({
        // page: page,
        // order: order,
        // orderColumn: orderClm,
        // startDate: st,
        // endDate: ed,
        // status: status,
        // search: search,
        // verify: verify,
        // siteType: siteType
        a: 1,
      });

      const getUserList = await fetchApi("close-order", userData, "GET");
      console.log("getUserList", getUserList);
      if (getUserList.statusCode == 200) {
        setLoader(false);
        setTotalPage(getUserList.data.length);
        setUserLists(getUserList.data);
        setPageLoader(false);
        setSearchLdr(false);
      } else {
        setLoader(false);
        setSearchLdr(false);
        if (getUserList?.message == "Unauthorized") {
          setAuthTkn(getUserList?.message);
        } else {
          setPageLoader(false);
          toast.error(getUserList?.message);
        }
      }
    }
  };

  const sortData = (column, sort) => {
    setOrder(sort);
    setOrderClm(column);
    if (sort == 1) {
      $(".fa-sort-down").removeClass("sort-enable");
      $(".fa-sort-up").removeClass("sort-enable");
      $(".fa-sort-up").removeClass("sort-desable");
      $(".fa-sort-down").removeClass("sort-desable");
      $(".asc-" + column).addClass("sort-enable");
    } else {
      $(".fa-sort-down").removeClass("sort-enable");
      $(".fa-sort-up").removeClass("sort-enable");
      $(".desc-" + column).addClass("sort-enable");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      sortData(orderClm, order);
    }, 500);
  }, []);

  useTradeWS((data) => {
    console.log("TRADE EVENT:", data);
  });

  const serachList = () => {
    if (!dateRange) {
      toast.error("Please select both start and end dates.");
      return false;
    }
    if (page >= 1) {
      setPage(0);
    } else {
      setSearchLdr(true);
      GetUserList();
    }
  };

  useEffect(() => {
    GetUserList();
    st = new Date(moment(startDate).format("MM/DD/YYYY")).getTime() / 1000;
    ed = endDate
      ? new Date(
          moment(moment(endDate).format("MM/DD/YYYY"))
            .add(23, "h")
            .add(59, "m")
            .add(59, "s")
        ).getTime() / 1000
      : 0;
  }, [page, order, orderClm]);

  return (
    <div className="content-body btn-page">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="container-fluid p-4">
        <div className="row">
          <h3 className="page-title-main">Manage User</h3>

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
                onSearchClick={serachList}
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
                      onSort: () => sortData(0, order == 0 ? 1 : 0),
                    },
                    {
                      label: "User Name",
                      key: "userName",
                      className: "text-center cursor-pointer text-nowrap",
                      sortable: true,
                      sortIndex: 1,
                      onSort: () => sortData(1, order == 0 ? 1 : 0),
                    },
                    {
                      label: "Email",
                      key: "email",
                      className: "text-center cursor-pointer text-nowrap",
                      sortable: true,
                      sortIndex: 2,
                      onSort: () => sortData(2, order == 0 ? 1 : 0),
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
      <ChangePasswordModal
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
