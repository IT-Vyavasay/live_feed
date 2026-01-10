"use client"
import React, { useEffect, useState } from 'react'
import { fetchApi } from '../../../../utils/frondend'
import "flatpickr/dist/flatpickr.css"
import { useAuthContext } from '../../../../context/auth';
import ReactPaginate from 'react-paginate';
import Table_Loader from '../../../../components/include/TableLoader';
import Loader from '../../../../components/include/Loader';
import toast, { Toaster } from 'react-hot-toast';
import Flatpickr from "react-flatpickr"
import Select from 'react-select';
import { convert_date } from '../../../../utils/common';
import moment from 'moment';
import { Modal } from 'react-bootstrap';

const page = () => {
    const { setAuthTkn, setPageLoader } = useAuthContext();
    const [order, setOrder] = useState(1)
    const [orderClm, setOrderClm] = useState(8)
    const [searchLdr, setSearchLdr] = useState(false)
    const [voucherList, setVoucherList] = useState([])
    const [page, setPage] = useState(0)
    const [totalPage, setTotalPage] = useState(0)
    const [modalIndex, setModalIndex] = useState(-1)
    const [modalTableLoader, setModalTableLoader] = useState(false)
    let date = moment(new Date()).subtract(process.env.FILTER_MONTH, "month")
    const [validUptoRange, setValidUptoRange] = useState([date['_d'], date['_i']])
    const [createdOnRange, setCreatedOnRange] = useState([date['_d'], date['_i']])
    let _validaUpto = [
        Math.floor(new Date(moment(moment(validUptoRange[0]).format('MM/DD/YYYY')).add(0, 'h').add(0, 'm').add(0, 's')).getTime() / 1000),
        Math.floor(new Date(moment(moment(validUptoRange[1]).format('MM/DD/YYYY')).add(23, 'h').add(59, 'm').add(59, 's')).getTime() / 1000)
    ]
    let _createdOn = [
        Math.floor(new Date(moment(moment(createdOnRange[0]).format('MM/DD/YYYY')).add(0, 'h').add(0, 'm').add(0, 's')).getTime() / 1000),
        Math.floor(new Date(moment(moment(createdOnRange[1]).format('MM/DD/YYYY')).add(23, 'h').add(59, 'm').add(59, 's')).getTime() / 1000)
    ]
    const [isRedeem, setIsRedeem] = useState('')
    const [createdFrom, setCreatedFrom] = useState('')
    const redeemOption = [{ label: 'All', value: '' }, { label: 'Yes', value: 1 }, { label: 'No', value: 0 }];
    const createdFromOptions = [{ label: 'All', value: '' }, { label: 'NFT21 Admin', value: 0 }, { label: 'Solares Pre-Registration Package', value: 1 }, { label: 'Solares Admin', value: 2 }];
    const [selectedSerial, setSelectedSerial] = useState('')
    const [serialListOptions, setSerialListOptions] = useState([])
    const [voucherDetail, setVoucherDetail] = useState([])
    const [show, setShow] = useState(false)
    const [mdlLdr, setMdlLdr] = useState(false)



    const pagginationHandler = (page) => {
        setPage(page.selected)
    }
    const getSerialList = async () => {
        const response = await fetchApi("serial-list", JSON.stringify({ a: 1 }), "GET")
        if (response.statusCode == 200) {
            let serialListUpdate = response.data.data.map(x => { return { label: x.name, value: x.serialId || "-" } })
            setSerialListOptions([{ label: "Select All", value: "" }, { label: "All Serial", value: "All Serial" }, ...serialListUpdate])
            setPageLoader(false)
        }
        else {
            if (response.data.message == "Unauthorized") {
                setAuthTkn(response.data.message)
            } else {
                toast.error(response.data.message)
            }
        }


    }


    const sortData = (column, sort) => {
        setOrder(sort)
        setOrderClm(column)
        if (sort == 1) {
            $('.fa-sort-down').removeClass('sort-enable')
            $('.fa-sort-up').removeClass('sort-enable')
            $('.fa-sort-up').removeClass('sort-desable')
            $('.fa-sort-down').removeClass('sort-desable')
            $('.asc-' + column).addClass('sort-enable')
        } else {
            $('.fa-sort-down').removeClass('sort-enable')
            $('.fa-sort-up').removeClass('sort-enable')
            $('.desc-' + column).addClass('sort-enable')
        }
    }

    const searchList = () => {
        if (!validUptoRange[0] || !validUptoRange[1] || !createdOnRange[0] || !createdOnRange[1]) {
            toast.error("Please select both start and end dates.")
            return false
        }
        if (page >= 1) {
            setPage(0)
        } else {
            getVoucherList()
        }
    }

    const getVoucherDetail = async (voucherId, createdFrom, index) => {
        setModalIndex(index)
        setShow(true)
        setMdlLdr(true)
        setModalTableLoader(true)

        let data = JSON.stringify({
            v_id: voucherId,
            createdFrom: createdFrom
        })
        let response = await fetchApi("voucher/uservoucher-detail", data, "GET")
        if (response.statusCode == 200) {
            setMdlLdr(false)
            setVoucherDetail(response.data.data)
            setModalTableLoader(false)
        }
        else {
            setModalTableLoader(false)
            if (response.data.message == "Unauthorized") {
                setAuthTkn(response.data.message)
            } else {
                toast.error(response.data.message)
            }
        }
    }


    const getVoucherList = async () => {
        if (!searchLdr) {
            setSearchLdr(true)
            let data = JSON.stringify({
                page: page,
                startValidRange: _validaUpto[0],
                endvalidRange: _validaUpto[1],
                startCreatedOn: _createdOn[0],
                endCreatedOn: _createdOn[1],
                orderColumn: orderClm,
                order,
                // search,
                isRedeem: isRedeem,
                createdFrom,
                selectedSerial,

            })

            let response = await fetchApi("voucher/voucher-list", data, "GET")
            if (response.statusCode == 200) {
                setSearchLdr(false)
                setVoucherList(response.data.data)
                setTotalPage(response.data.total)
            }
            else {
                setSearchLdr(false)
                if (response.data.message == "Unauthorized") {
                    setAuthTkn(response.data.message)
                } else {
                    toast.error(response.data.message)
                }
            }
        }

    }


    useEffect(() => {
        getSerialList()
    }, [])
    useEffect(() => {
        setTimeout(() => {
            sortData(orderClm, order)
        }, 500)
    }, [])
    useEffect(() => {
        getVoucherList()
    }, [page, orderClm, order])
    return (
        <div className="content-body btn-page">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="container-fluid p-4">
                <div className="row">

                    <h3 className="page-title-main">Voucher List</h3>

                    <div className="col-lg-12">
                        <div className="card mt-4 mb-4">
                            <div className="card-header d-block">

                                <div className="row">
                                    <div className='col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2 custom'>
                                        <label className='form-label'>Created On</label>
                                        <Flatpickr
                                            className='form-control'
                                            options={{
                                                defaultDate: [createdOnRange[0], createdOnRange[1]],
                                                altInput: true,
                                                altFormat: "j, M Y",
                                                dateFormat: "Y-m-d",
                                                showMonths: 1,
                                                mode: "range",
                                            }}
                                            onChange={(update) => {
                                                setCreatedOnRange([update[0], update[1] || ""])
                                            }}
                                        />
                                    </div>
                                    <div className='col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2 custom'>
                                        <label className='form-label'>Valid Upto</label>
                                        <Flatpickr
                                            className='form-control'
                                            options={{
                                                defaultDate: [validUptoRange[0], validUptoRange[1]],
                                                altInput: true,
                                                altFormat: "j, M Y",
                                                dateFormat: "Y-m-d",
                                                showMonths: 1,
                                                mode: "range",
                                            }}
                                            onChange={(update) => {
                                                setValidUptoRange([update[0], update[1] || ""])
                                            }}
                                        />
                                    </div>
                                    <div className='col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2'>
                                        <label className='form-label'>Redeem</label>
                                        <Select options={redeemOption}
                                            value={redeemOption.find(option => option.value === isRedeem)}
                                            onChange={(selectedOption) => { setIsRedeem(selectedOption.value); }} />
                                    </div>
                                    <div className='col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2'>
                                        <label className='form-label'>Created From</label>
                                        <Select options={createdFromOptions}
                                            value={createdFromOptions.find(option => option.value === createdFrom)}
                                            onChange={(selectedOption) => { setCreatedFrom(selectedOption.value); }} />
                                    </div>
                                    <div className='col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2'>
                                        <label className='form-label'>Serial Name</label>
                                        <Select options={serialListOptions}
                                            value={serialListOptions.find(option => option.value === selectedSerial)}
                                            onChange={(selectedOption) => { setSelectedSerial(selectedOption.value); }} />
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
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => sortData(0, order == 0 ? 1 : 0)}>
                                                    #
                                                    <span className="iconPosition">
                                                        <i className="fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-0"></i>
                                                        <i className="fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-0"></i>
                                                    </span>
                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" >
                                                    Serial Name

                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" >
                                                    Created From
                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" >
                                                    Coupon Code
                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => sortData(2, order == 0 ? 1 : 0)}>
                                                    Total Cards
                                                    <span className="iconPosition">
                                                        <i className="fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-2"></i>
                                                        <i className="fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-2"></i>
                                                    </span>
                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => sortData(3, order == 0 ? 1 : 0)}>
                                                    Total Redeem Cards
                                                    <span className="iconPosition">
                                                        <i className="fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-3"></i>
                                                        <i className="fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-3"></i>
                                                    </span>
                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => sortData(4, order == 0 ? 1 : 0)}>
                                                    Discount(%)
                                                    <span className="iconPosition">
                                                        <i className="fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-4"></i>
                                                        <i className="fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-4"></i>
                                                    </span>
                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => sortData(5, order == 0 ? 1 : 0)}>
                                                    Discount(EURO)
                                                    <span className="iconPosition">
                                                        <i className="fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-5"></i>
                                                        <i className="fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-5"></i>
                                                    </span>
                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => sortData(6, order == 0 ? 1 : 0)}>
                                                    Valid Upto
                                                    <span className="iconPosition">
                                                        <i className="fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-6"></i>
                                                        <i className="fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-6"></i>
                                                    </span>
                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" >
                                                    Redeem
                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => sortData(7, order == 0 ? 1 : 0)}>
                                                    Redeem By
                                                    <span className="iconPosition">
                                                        <i className="fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-7"></i>
                                                        <i className="fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-7"></i>
                                                    </span>
                                                </th>

                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => sortData(8, order == 0 ? 1 : 0)}>
                                                    Created On
                                                    <span className="iconPosition">
                                                        <i className="fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-8"></i>
                                                        <i className="fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-8"></i>
                                                    </span>
                                                </th>

                                                <th scope="col" className="text-center text-nowrap">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {voucherList?.length > 0 ?
                                                voucherList?.map((d, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td className="text-center text-nowrap">{d.num}</td>
                                                            <td className="text-center text-nowrap">{d.serialName}</td>
                                                            <td className="text-center text-nowrap">{createdFromOptions.find(x => x.value == String(d.createdFrom)).label || "-"}</td>
                                                            <td className="text-center text-nowrap">{d.couponCode}</td>
                                                            <td className="text-center text-nowrap">{`${d.totalCards} ${d.totalCards > 1 ? "Cards" : "Card"}`}</td>
                                                            <td className="text-center text-nowrap">{d.totalRedeemCard || "-"}</td>
                                                            <td className="text-center text-nowrap">{d.discount != 0 ? <>{d.discount}%</> : "-"}</td>
                                                            <td className="text-center text-nowrap">{d.euroDiscount != 0 ? <>{d.euroDiscount} EURO</> : "-"}</td>
                                                            <td className="text-center text-nowrap">{d.validUpto > 0 ? convert_date(d.validUpto) : "-"}</td>
                                                            <td className='text-center text-nowrap'>
                                                                <span className={` ${d.redeem == 0 ? 'badge-danger ' : "badge-success"}`}>
                                                                    {redeemOption.find(x => x.value == String(d.redeem)).label || "-"}
                                                                </span>
                                                            </td>
                                                            <td className="text-center text-nowrap">{d.redeemBy}</td>
                                                            <td className="text-center text-nowrap">{convert_date(d.createdOn)}</td>
                                                            <td className='text-nowrap'>
                                                                <button className='btn btn-sm btn-bordered-info mx-1' onClick={() => { getVoucherDetail(d.voucherId, d.createdFrom, i) }}>
                                                                    {modalIndex == i && mdlLdr ? <Loader /> : ''}
                                                                    <i className='fa fa-eye' />
                                                                </button>
                                                            </td>

                                                        </tr>
                                                    )
                                                }) : ''}


                                            {searchLdr || voucherList?.length <= 0 ?
                                                <tr>
                                                    <td className={`text-center ${voucherList?.length <= 0 ? "tableLoaderBox" : ""}`} colSpan={13}>


                                                        {searchLdr ? <div className={`disableTbl m-auto ${voucherList?.length <= 0 ? "disableTblEmptyList" : ""}`}>
                                                            <Table_Loader /> </div> : <img src="/assets/images/no-data.png" alt="no data" />
                                                        }
                                                    </td>
                                                </tr> : ''}

                                        </tbody>
                                    </table>
                                </div>
                                {voucherList?.length ? <div className="row mt-3 paginationBox">
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
                    <Modal.Title>Redeem Detail</Modal.Title>
                    <span className='modalCloseBtn' onClick={() => {
                        setShow(false), setModalIndex(-1), setVoucherDetail([])
                    }}>
                        <i className="mdi mdi-close"></i>
                    </span>
                </Modal.Header>
                <Modal.Body className='text-center'>
                    <div className='card mb-1'>
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
                                            Serial Type
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
                                    {voucherDetail?.length > 0 ?
                                        voucherDetail?.map((d, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td className="text-center text-nowrap">{d.num}</td>
                                                    <td className="text-center text-nowrap">{d.serialName}</td>
                                                    <td className="text-center text-nowrap">{d.serialType == 0 ? "BTC Serial" : d.serialType == 1 ? "SCH Serial" : d.serialType == 2 ? "Joker Serial" : "-"}</td>
                                                    <td className="text-center text-nowrap">{d.cardName}</td>
                                                    <td className="text-center text-nowrap">{convert_date(d.redeemOn)}</td>
                                                </tr>
                                            )
                                        }) : <tr>
                                            <td className={`text-center ${voucherList?.length <= 0 ? "tableLoaderBox" : ""}`} colSpan={5}>
                                                {modalTableLoader ? <Table_Loader /> : <img src="/assets/images/no-data.png" alt="no data" />}
                                            </td>
                                        </tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </Modal.Body>
            </Modal>
        </div >
    )
}

export default page