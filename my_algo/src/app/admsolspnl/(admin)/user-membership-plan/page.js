"use client"
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/flatpickr.css"
import ReactPaginate from 'react-paginate'
import Loader from '../../../../components/include/Loader'
import { useAuthContext } from '../../../../context/auth'
import { convert_date, trunc } from '../../../../utils/common'
import Table_Loader from '../../../../components/include/TableLoader'
import Select from 'react-select';
import { fetchApi } from '../../../../utils/frondend'
import { EXPLORER_URL } from '../../../../utils/config';
import Link from 'next/link'
import Modal from 'react-bootstrap/Modal';


const moment = require('moment')
moment.suppressDeprecationWarnings = true

const User_Package_List = () => {
    const { setAuthTkn, setPageLoader } = useAuthContext();
    const [order, setOrder] = useState(1)
    const [orderClm, setOrderClm] = useState(0)
    const [coinType, setCoinType] = useState("")
    const [status, setStatus] = useState("")
    const [payStatus, setPayStatus] = useState("")
    const [searchLdr, setSearchLdr] = useState(false)
    const [page, setPage] = useState(0)
    const [totalPage, setTotalPage] = useState(0)
    const [userMembershipList, setUserMembershipList] = useState([])
    const [search, setSearch] = useState("")
    let date = moment(new Date()).subtract(process.env.FILTER_MONTH, "month")
    const [dateRange, setDateRange] = useState([date['_d'], date['_i']])
    let _dateRange = [
        Math.floor(new Date(moment(moment(dateRange[0]).format('MM/DD/YYYY')).add(0, 'h').add(0, 'm').add(0, 's')).getTime() / 1000),
        Math.floor(new Date(moment(moment(dateRange[1]).format('MM/DD/YYYY')).add(23, 'h').add(59, 'm').add(59, 's')).getTime() / 1000)
    ]
    const statusOptions = [{ label: 'All', value: '' }, { label: 'Pending', value: '0' }, { label: 'Active', value: '1' }, { label: 'Deactive', value: '2' }];
    const payStatusOptions = [{ label: 'All', value: '' }, { label: 'Pending', value: '0' }, { label: 'Confirm', value: '1' }, { label: 'Cancel', value: '2' }];
    const coinTypeOption = [{ label: 'All', value: '' }, { label: 'USDT', value: '0' }, { label: 'BXN', value: '1' }];
    const [mdlLdr, setMdlLdr] = useState(false)
    const [modalIndex, setModalIndex] = useState(-1)
    const [voucherDetail, setVoucherDetail] = useState([])
    const [show, setShow] = useState(false)

    const get_membership_data = async () => {
        if (!searchLdr) {
            setSearchLdr(true)
            const body = JSON.stringify({
                page: page,
                order: order,
                orderColumn: orderClm,
                startDate: _dateRange[0],
                endDate: _dateRange[1],
                coinType: coinType,
                status: status,
                payStatus: payStatus,
                search: search
            })
            const response = await fetchApi("membership/user-membership-plan", body, "GET")
            setPageLoader(false)
            if (response.statusCode == 200) {
                setSearchLdr(false)
                setUserMembershipList(response.data.data)
                setTotalPage(response.data.total)
            } else {
                setSearchLdr(false)
                if (response.data.message == "Unauthorized") {
                    setAuthTkn(response.data.message)
                } else {
                    toast.error(response.data.message)
                }
            }
        }
    }

    const pagginationHandler = (page) => {
        var p = page.selected
        setPage(p)
    }

    const searchList = () => {
        if (!dateRange[0] || !dateRange[1]) {
            toast.error("Please select both start and end dates.")
            return false
        }
        if (page >= 1) {
            setPage(0)
        } else {
            get_membership_data()
        }
    }

    useEffect(() => { get_membership_data() }, [page, order, orderClm])

    const getVoucherDetail = async (voucherId, index) => {
        setModalIndex(index)
        if (!mdlLdr) {
            setMdlLdr(true)
            const body = JSON.stringify({
                v_id: voucherId,
            })
            const response = await fetchApi("membership/voucher-detail", body, "GET")
            setMdlLdr(false)
            setShow(true)
            setModalIndex(-1)
            if (response.statusCode == 200) {
                setVoucherDetail(response.data.data)
            } else {
                if (response.data.message == "Unauthorized") {
                    setAuthTkn(response.data.message)
                } else {
                    toast.error(response.data.message)
                }
            }
        }
    }
    return (
        <div className="content-body btn-page">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="container-fluid p-4">
                <div className="row">

                    <h3 className="page-title-main">Manage User Membership Plan</h3>

                    <div className="col-lg-12">
                        <div className="card mt-4 mb-4">
                            <div className="card-header d-block">

                                <div className="row">
                                    <div className='col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2 custom'>
                                        <label className='form-label'>Date</label>
                                        <Flatpickr
                                            className='form-control'
                                            options={{
                                                defaultDate: [dateRange[0], dateRange[1]],
                                                altInput: true,
                                                altFormat: "j, M Y",
                                                dateFormat: "Y-m-d",
                                                showMonths: 1,
                                                mode: "range",
                                            }}
                                            onChange={(update) => {
                                                setDateRange([update[0], update[1] || ""])
                                            }}
                                        />
                                    </div>
                                    <div className='col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2'>
                                        <label className='form-label'>Coin Type</label>
                                        <Select options={coinTypeOption}
                                            value={coinTypeOption.find(option => option.value === coinType)}
                                            onChange={(selectedOption) => { setCoinType(selectedOption.value); }} />
                                    </div>
                                    <div className='col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2'>
                                        <label className='form-label'>Pay Status</label>
                                        <Select options={payStatusOptions}
                                            value={payStatusOptions.find(option => option.value === payStatus)}
                                            onChange={(selectedOption) => { setPayStatus(selectedOption.value); }} />
                                    </div>
                                    <div className='col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2'>
                                        <label className='form-label'>Status</label>
                                        <Select options={statusOptions}
                                            value={statusOptions.find(option => option.value === status)}
                                            onChange={(selectedOption) => { setStatus(selectedOption.value); }} />
                                    </div>
                                    <div className='col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2'>
                                        <label className='form-label'>Username/Hash</label>
                                        <input type="text" placeholder="Search" className="form-control search-placeholder" value={search} onChange={(e) => setSearch(e.target.value)} />
                                    </div>
                                    <div className='col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6  my-2' style={{ marginTop: "11px" }}>
                                        <label className='form-label text-white'>&nbsp;</label><br />
                                        <button className='loaderStyle btn btn-bordered-primary waves-effect search-btn waves-light' onClick={() => { searchList() }} >
                                            {searchLdr ? < Loader /> : <i className='bx bx-search'></i>} Search
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive position-relative">
                                    <table className={`table table-striped  ${searchLdr && 'tbl-overly'}`}>
                                        <thead>
                                            <tr>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => { setOrder(order == 0 ? 1 : 0); setOrderClm(0) }}>
                                                    <div className='d-flex justify-content-center'>
                                                        <div>  #  </div>
                                                        <div className="sort-icons-position">
                                                            <i className={`fa fa-sort-down position-absolute ${order === 1 && orderClm == 0 ? `sort-desable` : "sort-enable'"} `}></i>
                                                            <i className={`fa fa-sort-up position-absolute ${order === 0 && orderClm == 0 ? `sort-desable` : "sort-enable'"} `}></i>
                                                        </div>
                                                    </div>
                                                </th>
                                                <th scope="col" className="text-center text-nowrap">
                                                    User Name
                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => { setOrder(order == 0 ? 1 : 0); setOrderClm(1) }}>
                                                    <div className='d-flex justify-content-center'>
                                                        <div>Price</div>
                                                        <div className="sort-icons-position">
                                                            <i className={`fa fa-sort-down position-absolute ${order === 1 && orderClm == 1 ? `sort-desable` : "sort-enable'"} `}></i>
                                                            <i className={`fa fa-sort-up position-absolute ${order === 0 && orderClm == 1 ? `sort-desable` : "sort-enable'"} `}></i>
                                                        </div>
                                                    </div>
                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => { setOrder(order == 0 ? 1 : 0); setOrderClm(8) }}>
                                                    <div className='d-flex justify-content-center'>
                                                        Purchase Amount
                                                        <div className="sort-icons-position">
                                                            <i className={`fa fa-sort-down position-absolute ${order === 1 && orderClm == 8 ? `sort-desable` : "sort-enable'"} `}></i>
                                                            <i className={`fa fa-sort-up position-absolute ${order === 0 && orderClm == 8 ? `sort-desable` : "sort-enable'"} `}></i>
                                                        </div>
                                                    </div>
                                                </th>

                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => { setOrder(order == 0 ? 1 : 0); setOrderClm(2) }}>
                                                    <div className='d-flex justify-content-center'>
                                                        Total Months
                                                        <div className="sort-icons-position">
                                                            <i className={`fa fa-sort-down position-absolute ${order === 1 && orderClm == 2 ? `sort-desable` : "sort-enable'"} `}></i>
                                                            <i className={`fa fa-sort-up position-absolute ${order === 0 && orderClm == 2 ? `sort-desable` : "sort-enable'"} `}></i>
                                                        </div>
                                                    </div>
                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => { setOrder(order == 0 ? 1 : 0); setOrderClm(3) }}>
                                                    <div className='d-flex justify-content-center'>
                                                        Membership Expires On
                                                        <div className="sort-icons-position">
                                                            <i className={`fa fa-sort-down position-absolute ${order === 1 && orderClm == 3 ? `sort-desable` : "sort-enable'"} `}></i>
                                                            <i className={`fa fa-sort-up position-absolute ${order === 0 && orderClm == 3 ? `sort-desable` : "sort-enable'"} `}></i>
                                                        </div>
                                                    </div>
                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => { setOrder(order == 0 ? 1 : 0); setOrderClm(4) }}>
                                                    <div className='d-flex justify-content-center'>
                                                        Hash
                                                        <div className="sort-icons-position">
                                                            <i className={`fa fa-sort-down position-absolute ${order === 1 && orderClm == 4 ? `sort-desable` : "sort-enable'"} `}></i>
                                                            <i className={`fa fa-sort-up position-absolute ${order === 0 && orderClm == 4 ? `sort-desable` : "sort-enable'"} `}></i>
                                                        </div>
                                                    </div>
                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => { setOrder(order == 0 ? 1 : 0); setOrderClm(5) }}>
                                                    <div className='d-flex justify-content-center'>
                                                        Pay Status
                                                        <div className="sort-icons-position">
                                                            <i className={`fa fa-sort-down position-absolute ${order === 1 && orderClm == 5 ? `sort-desable` : "sort-enable'"} `}></i>
                                                            <i className={`fa fa-sort-up position-absolute ${order === 0 && orderClm == 5 ? `sort-desable` : "sort-enable'"} `}></i>
                                                        </div>
                                                    </div>
                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => { setOrder(order == 0 ? 1 : 0); setOrderClm(6) }}>
                                                    <div className='d-flex justify-content-center'>
                                                        Status
                                                        <div className="sort-icons-position">
                                                            <i className={`fa fa-sort-down position-absolute ${order === 1 && orderClm == 6 ? `sort-desable` : "sort-enable'"} `}></i>
                                                            <i className={`fa fa-sort-up position-absolute ${order === 0 && orderClm == 6 ? `sort-desable` : "sort-enable'"} `}></i>
                                                        </div>
                                                    </div>
                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => { setOrder(order == 0 ? 1 : 0); setOrderClm(7) }}>
                                                    <div className='d-flex justify-content-center'>
                                                        Created On
                                                        <div className="sort-icons-position">
                                                            <i className={`fa fa-sort-down position-absolute ${order === 1 && orderClm == 7 ? `sort-desable` : "sort-enable'"} `}></i>
                                                            <i className={`fa fa-sort-up position-absolute ${order === 0 && orderClm == 7 ? `sort-desable` : "sort-enable'"} `}></i>
                                                        </div>
                                                    </div>
                                                </th>
                                                <th scope="col" className="text-center text-nowrap">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userMembershipList?.length > 0 ?
                                                userMembershipList?.map((d, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td className="text-center text-nowrap">{d.num}</td>
                                                            <td className="text-center text-nowrap">{d.userName}</td>
                                                            <td className="text-center text-nowrap">{d.offerPrice + " USDT"}</td>
                                                            <td className="text-center text-nowrap">{d.coinAmount}{d.coinType == 0 ? " USDT" : " BXN"}</td>
                                                            <td className="text-center text-nowrap">{d.totalActivityMonth == 0 ? "Lifetime" : d.totalActivityMonth + " Month"}</td>
                                                            <td className="text-center text-nowrap">{d.endOn > 0 ? convert_date(d.endOn) : "-"}</td>
                                                            <td className='text-center text-nowrap'>
                                                                {d.hash ? <Link target='_blank' href={EXPLORER_URL + 'tx/' + d.hash}>{trunc(d.hash)}</Link> : '-'}
                                                            </td>
                                                            <td className='text-center text-nowrap'>
                                                                <span className={` ${d.payStatus == 0 ? 'badge-warning ' : d.payStatus == 1 ? "badge-success" : "badge-danger"}`}>
                                                                    {d.payStatus == 0 ? "Pending" : d.payStatus == 1 ? "Confirm" : "Cancel"}
                                                                </span>
                                                            </td>
                                                            <td className='text-center text-nowrap'>
                                                                <span className={` ${d.status == 0 ? 'badge-warning ' : d.status == 1 ? "badge-success" : "badge-danger"}`}>
                                                                    {d.status == 0 ? "Pending" : d.status == 1 ? "Active" : "Deactive"}
                                                                </span>
                                                            </td>
                                                            <td className="text-center text-nowrap">{convert_date(d.createdOn)}</td>
                                                            <td className='text-nowrap'>
                                                                <button className='btn btn-sm btn-bordered-info mx-1' onClick={() => { getVoucherDetail(d.voucherId, i) }}>
                                                                    {modalIndex == i && mdlLdr ? <Loader /> : ''}
                                                                    <i className='fa fa-eye' />
                                                                </button>
                                                            </td>

                                                        </tr>
                                                    )
                                                }) : ''}


                                            {searchLdr || userMembershipList?.length <= 0 ?
                                                <tr>
                                                    <td className={`text-center ${userMembershipList?.length <= 0 ? "tableLoaderBox" : ""}`} colSpan={11}>


                                                        {searchLdr ? <div className={`disableTbl m-auto ${userMembershipList?.length <= 0 ? "disableTblEmptyList" : ""}`}>
                                                            <Table_Loader /> </div> : <img src="/assets/images/no-data.png" alt="no data" />
                                                        }
                                                    </td>
                                                </tr> : ''}
                                        </tbody>
                                    </table>
                                </div>
                                {userMembershipList.length ? <div className="row mt-3 paginationBox">
                                    <ReactPaginate
                                        breakLabel={'...'}
                                        nextLabel={<i className="fa fa-angle-right"></i>}
                                        previousLabel={<i className="fa fa-angle-left"></i>}
                                        pageRangeDisplayed={5}
                                        renderOnZeroPageCount={null}
                                        activeClassName={'active'}
                                        containerClassName={'pagination pagination-sm pagination-gutter justify-content-end '}
                                        pageClassName={'page-item'}
                                        pageLinkClassName={'page-link'}
                                        previousClassName={'page-item page-indicator'}
                                        previousLinkClassName={'page-link'}
                                        nextClassName={'page-item page-indicator'}
                                        nextLinkClassName={'page-link'}
                                        breakClassName={'page-item'}
                                        breakLinkClassName={'page-link'}
                                        forcePage={page}
                                        pageCount={totalPage}
                                        onPageChange={(page) => pagginationHandler(page)}
                                    />
                                </div> : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <Modal show={show} className='' centered size="xl">
                <Modal.Header >
                    <Modal.Title>Voucher Detail</Modal.Title>
                    <span className='modalCloseBtn' onClick={() => {
                        setShow(false), setModalIndex(-1)
                    }}>
                        <i className="mdi mdi-close"></i>
                    </span>
                </Modal.Header>
                <Modal.Body className='text-center'>
                    <div className='card mb-1'>
                        <div className='card-header'>
                            <div className='row'>
                                <div className='col-12 col-md-4 col-lg-2 border-right'>
                                    <div className="text-center font-16">
                                        <div className='text-dull'>
                                            Total Cards
                                        </div>
                                        <div className='text-dark'>
                                            {voucherDetail?.voucherDetail?.totalCards || 0}
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 col-md-4 col-lg-2 border-right'>
                                    <div className="text-center font-16">
                                        <div className='text-dull'>
                                            Total Redeem Cards
                                        </div>
                                        <div className='text-dark'>
                                            {voucherDetail?.voucherDetail?.totalRedeemCard || 0}
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 col-md-4 col-lg-2 border-right'>
                                    <div className="text-center font-16">
                                        <div className='text-dull'>
                                            Discount
                                        </div>
                                        <div className='text-dark'>
                                            {voucherDetail?.voucherDetail?.discount || 0}%
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 col-md-4 col-lg-2 border-right'>
                                    <div className="text-center font-16">
                                        <div className='text-dull'>
                                            EURO Amount
                                        </div>
                                        <div className='text-dark'>
                                            {voucherDetail?.voucherDetail?.euroAmount || 0} EURO
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 col-md-4 col-lg-3'>
                                    <div className="text-center font-16">
                                        <div className='text-dull'>
                                            Valid Up To
                                        </div>
                                        <div className='text-dark'>
                                            {voucherDetail?.voucherDetail?.validUpto > 0 ? convert_date(voucherDetail?.voucherDetail?.validUpto) : '-'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {voucherDetail?.voucherDetailList?.length > 0 ? <div className='card-body'>
                            <div className='font-20 mb-2 text-dark text-left'>Redeem Details</div>
                            <div className="table-responsive position-relative">
                                <table className={`table table-striped  ${searchLdr && 'tbl-overly'}`}>
                                    <thead>
                                        <tr>
                                            <th scope="col" className="text-center cursor-pointer text-nowrap">
                                                #
                                            </th>
                                            <th scope="col" className="text-center text-nowrap">
                                                Serial Name
                                            </th>
                                            <th scope="col" className="text-center text-nowrap">
                                                Card Name
                                            </th>
                                            <th scope="col" className="text-center text-nowrap">
                                                Redeem On
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {voucherDetail?.voucherDetailList?.length > 0 ?
                                            voucherDetail?.voucherDetailList?.map((d, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td className="text-center text-nowrap">{d.num}</td>
                                                        <td className="text-center text-nowrap">{d.serialName}</td>
                                                        <td className="text-center text-nowrap">{d.cardName}</td>
                                                        <td className="text-center text-nowrap">{convert_date(d.createdOn)}</td>
                                                    </tr>
                                                )
                                            }) : ''}
                                    </tbody>
                                </table>
                            </div>
                        </div> : ""}
                    </div>
                </Modal.Body>
            </Modal>

        </div>
    )
}


export default User_Package_List;