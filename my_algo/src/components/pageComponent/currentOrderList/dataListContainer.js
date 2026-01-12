"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "flatpickr/dist/flatpickr.css";
const moment = require("moment");
moment.suppressDeprecationWarnings = true;
import { fetchApi, sortData } from "../../../utils/frondend";
import { useAuthContext } from "../../../context/auth";
import { useTradeWS } from "../../../hook/useSocket";

const dataListContainer = () => {
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
                page: page,
                order: order,
                orderColumn: orderClm,
                startDate: st,
                endDate: ed,
                status: status,
                search: search,
                verify: verify,
                siteType: siteType,
            });

            const getUserList = await fetchApi("close-order", userData, "GET");
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
    return {
        show,
        setShow,
        page,
        setPage,
        totalPage,
        order,
        setOrder,
        orderClm,
        setOrderClm,
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
        serachList,
    }
}

export default dataListContainer