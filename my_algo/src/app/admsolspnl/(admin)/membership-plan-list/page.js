"use client"
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import "flatpickr/dist/flatpickr.css"
const moment = require('moment')
moment.suppressDeprecationWarnings = true
import ReactPaginate from 'react-paginate'
import Table_Loader from '../../../../components/include/TableLoader'
import Loader from '../../../../components/include/Loader'
import { chk_voucher_per, convert_date, convert_date_only, validate_input_number, validate_input_number_zero } from '../../../../utils/common'
import { fetchApi } from '../../../../utils/frondend'
import { useAuthContext } from '../../../../context/auth'
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



const UserList = () => {

    const { setAuthTkn, setPageLoader } = useAuthContext();
    const [page, setPage] = useState(0)
    const [totalPage, setTotalPage] = useState(0)
    const [order, setOrder] = useState(1)
    const [orderClm, setOrderClm] = useState(7)
    const [searchLdr, setSearchLdr] = useState(false)
    const [packagesList, setPackagesList] = useState([])

    const [show, setShow] = useState(false)
    const [planData, setPlanData] = useState({ price: "", offerPrice: "", voucherDiscount: "", totalActivityMonth: "", voucherValidateTill: "", totalVoucherCard: "", serialId: 0, isOffer: 1, planId: "" })
    const [serialList, setSerialList] = useState([])
    let serialFilter = [{ label: 'Select Serial', value: '0' }, ...serialList.map((i) => ({ label: i.name, value: i.serialId }))];
    const [submitLoder, setSubmitLoder] = useState(false)

    const pagginationHandler = (page) => {
        var p = page.selected
        setPage(p)
    }

    const mdlClose = () => {
        setPlanData({ price: "", offerPrice: "", voucherDiscount: "", totalActivityMonth: "", voucherValidateTill: "", totalVoucherCard: "", serialId: 0, isOffer: 1, planId: "" })
        setShow(false)
    }

    const GetPackageList = async () => {

        if (!searchLdr) {
            setSearchLdr(true)
            const userData = JSON.stringify({
                page: page,
                order: order,
                orderColumn: orderClm,
            })

            const getPackageList = await fetchApi("membership-plan/list", userData, "GET")
            if (getPackageList.statusCode == 200) {
                setSearchLdr(false)
                setTotalPage(getPackageList.data.total)
                setPackagesList(getPackageList.data.data);
                setPageLoader(false)
            } else {
                setSearchLdr(false)
                if (getPackageList.data.message == "Unauthorized") {
                    setAuthTkn(getPackageList.data.message)
                } else {
                    setPageLoader(false)
                    toast.error(getPackageList.data.message)
                }
            }
        }
    }

    const getSerialList = async () => {
        const body = JSON.stringify({ a: 0 })
        const response = await fetchApi("membership-plan/serial-list", body, "GET")
        if (response.statusCode == 200) {
            setSerialList(response.data.serial)
        } else {
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

    useEffect(() => {
        setTimeout(() => {
            sortData(orderClm, order)
        }, 500)
    }, [])

    useEffect(() => {
        GetPackageList()
    }, [page, order, orderClm])

    const edit_plan = async (data) => {
        await getSerialList();
        setShow(true)
        setPlanData({ price: data.price, offerPrice: data.offerPrice, voucherDiscount: data.voucherDiscount, totalActivityMonth: data.totalActivityMonth, voucherValidateTill: new Date(data.voucherValidateTill * 1000), totalVoucherCard: data.totalVoucherCard, serialId: data.nftSerialId, isOffer: data.isOffer, planId: data.id })
    }

    const handleAddUpdatePackage = async () => {
        toast.dismiss()
        try {
            validate_input_number(planData.price, "price", "Price")
            validate_input_number_zero(planData.offerPrice, "offer price")
            if (parseFloat(planData.price) <= parseFloat(planData.offerPrice)) {
                toast.error("Offer price must be less than price")
                return false
            }
            if (planData.voucherDiscount || planData.totalVoucherCard) {
                validate_input_number(planData.totalVoucherCard, "total voucher cards", "Total voucher cards")
                chk_voucher_per(planData.voucherDiscount, "voucher discount")
            }
            validate_input_number(planData.totalActivityMonth, "total month", "Total month")
            validate_input_number(planData.voucherValidateTill, "voucher valid till", "Voucher valid till", 1)
            let selectDate = new Date(moment(moment(planData.voucherValidateTill).format('MM/DD/YYYY')).add(23, 'h').add(59, 'm').add(59, 's')).getTime() / 1000
            let date = new Date();
            date.setUTCHours(0, 0, 0, 0);
            let today = Math.floor(date.getTime() / 1000)
            if (selectDate < today) {
                toast.error('Voucher valid till date must be future date')
                return false
            }

            if (planData.offerPrice <= 0 && planData.isOffer == 1) {
                toast.error('Enter offer price')
                return false
            }
        } catch (error) {
            toast.error(error)
            return false
        }
        if (!submitLoder) {
            setSubmitLoder(true)
            const data = JSON.stringify({
                price: planData.price,
                offerPrice: planData.offerPrice,
                voucherDiscount: planData.voucherDiscount,
                totalVoucherCard: planData.totalVoucherCard,
                totalActivityMonth: planData.totalActivityMonth,
                voucherValidateTill: new Date(moment(moment(planData.voucherValidateTill).format('MM/DD/YYYY')).add(23, 'h').add(59, 'm').add(59, 's')).getTime() / 1000,
                serialId: planData.serialId,
                isOffer: planData.isOffer,
                planId: planData.planId
            })
            const response = await fetchApi(`membership-plan/${planData.planId ? "update-plan" : "add-plan"}`, data)
            setSubmitLoder(false)
            if (response.statusCode == 200) {
                toast.success(response.data.message)
                GetPackageList()
                mdlClose()
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
                    <div className='d-flex justify-content-between w-100'>
                        <h3 className="page-title-main">Manage Membership Plan</h3>
                        <div>
                            <button className=' btn btn-bordered-primary search-btn' onClick={() => { setShow(true), getSerialList() }} >
                                Add
                            </button>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="card mt-4 mb-4">
                            <div className="card-body">
                                <div className="table-responsive position-relative">
                                    <table className={`table table-striped  ${searchLdr && 'tbl-overly'}   `}>
                                        <thead>
                                            <tr>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => sortData(0, order == 0 ? 1 : 0)}>
                                                    #
                                                    <span className="iconPosition">
                                                        <i className="fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-0"></i>
                                                        <i className="fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-0"></i>
                                                    </span>
                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => sortData(1, order == 0 ? 1 : 0)}>
                                                    Price/Offer Price
                                                    <span className="iconPosition">
                                                        <i className="fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-1"></i>
                                                        <i className="fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-1"></i>
                                                    </span>
                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => sortData(2, order == 0 ? 1 : 0)}>
                                                    Total Month
                                                    <span className="iconPosition">
                                                        <i className="fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-2"></i>
                                                        <i className="fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-2"></i>
                                                    </span>
                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => sortData(3, order == 0 ? 1 : 0)}>
                                                    Voucher Discount
                                                    <span className="iconPosition">
                                                        <i className="fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-3"></i>
                                                        <i className="fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-3"></i>
                                                    </span>
                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => sortData(4, order == 0 ? 1 : 0)}>
                                                    Total Voucher Cards
                                                    <span className="iconPosition">
                                                        <i className="fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-4"></i>
                                                        <i className="fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-4"></i>
                                                    </span>
                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => sortData(5, order == 0 ? 1 : 0)}>
                                                    Voucher Validate Till
                                                    <span className="iconPosition">
                                                        <i className="fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-5"></i>
                                                        <i className="fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-5"></i>
                                                    </span>
                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap"  >
                                                    NFT Serial

                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => sortData(6, order == 0 ? 1 : 0)}>
                                                    In Offer
                                                    <span className="iconPosition">
                                                        <i className="fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-6"></i>
                                                        <i className="fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-6"></i>
                                                    </span>
                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => sortData(7, order == 0 ? 1 : 0)}>
                                                    Created On
                                                    <span className="iconPosition">
                                                        <i className="fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-7"></i>
                                                        <i className="fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-7"></i>
                                                    </span>
                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {packagesList?.length > 0 ?
                                                packagesList?.map((d, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td className="text-center text-nowrap">{d?.num}</td>
                                                            <td className="text-center text-nowrap">{`${`${d.price} USDT`} /${`${d.offerPrice} USDT`}`} </td>
                                                            <td className="text-center text-nowrap">{d?.totalActivityMonth && d?.totalActivityMonth > 0 ? `${d?.totalActivityMonth} Month` : 'Life time'} </td>
                                                            <td className="text-center text-nowrap">{`${d?.voucherDiscount} %`} </td>
                                                            <td className="text-center text-nowrap">{`${d?.totalVoucherCard} Card`} </td>
                                                            <td className="text-center text-nowrap">{convert_date_only(d?.voucherValidateTill)} </td>
                                                            <td className="text-center text-nowrap">{d?.nftSerialName ? d?.nftSerialName : '-'} </td>
                                                            <td className="text-center text-nowrap">
                                                                {d.isOffer == 1 && <span className="badge badge-success">Yes</span>}
                                                                {d.isOffer == 0 && <span className=" badge badge-warning  ">No</span>}
                                                            </td>
                                                            <td className="text-center text-nowrap">{convert_date(d.createdOn)} </td>
                                                            <td>
                                                                <button className="btn btn-sm btn-bordered-info mx-1" onClick={() => { edit_plan(d) }}>
                                                                    <i className="fas fa-pencil-alt" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                }) : ''}
                                            {searchLdr || packagesList?.length <= 0 ?
                                                <tr>
                                                    <td className={`text-center ${packagesList?.length <= 0 ? "tableLoaderBox" : ""}`} colSpan={10}>


                                                        {searchLdr ? <div className={`disableTbl m-auto ${packagesList?.length <= 0 ? "disableTblEmptyList" : ""}`}>
                                                            <Table_Loader /> </div> : <img src="/assets/images/no-data.png" alt="no data" />
                                                        }
                                                    </td>
                                                </tr> : ''}
                                        </tbody>
                                    </table>
                                </div>
                                {packagesList.length ? <div className="row mt-3 paginationBox">
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



            <Modal show={show} className='' centered size='lg' >
                <Modal.Header >
                    <Modal.Title>
                        <h5 className="modal-title fw-bold fs-18">{planData.planId ? "Update" : "Add"} Membership Plan</h5>
                    </Modal.Title>
                    <span className='modalCloseBtn' onClick={() => { mdlClose() }}>
                        <i className="mdi mdi-close"></i>
                    </span>
                </Modal.Header>
                <Modal.Body className='text-center'>
                    <div className='row'>
                        <div className='col-12 col-md-6 mb-2'>
                            <label className="col-form-label modalLabel">Price</label>
                            <div className="input-group">
                                <input
                                    type='text'
                                    value={planData.price}
                                    onChange={(e) => {
                                        setPlanData({
                                            ...planData, price: e.target.value = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1")
                                        })
                                    }}
                                    placeholder="Enter price"
                                    className="form-control"
                                    onKeyUp={(e) => { e.keyCode == 13 && handleAddUpdatePackage() }}
                                />
                                <div className={`input-group-append`}>
                                    <div className="input-group-text">USDT</div>
                                </div>
                            </div>
                        </div>
                        <div className='col-12 col-md-6 mb-2'>
                            <label className="col-form-label modalLabel">Offer price</label>
                            <div className="input-group">
                                <input
                                    type='text'
                                    value={planData.offerPrice}
                                    onChange={(e) => {
                                        setPlanData({
                                            ...planData, offerPrice: e.target.value = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"),
                                            isOffer: e.target.value == 0 ? 0 : 1
                                        })
                                    }}
                                    placeholder="Enter offer price"
                                    className="form-control"
                                    onKeyUp={(e) => { e.keyCode == 13 && handleAddUpdatePackage() }}
                                />
                                <div className={`input-group-append`}>
                                    <div className="input-group-text">USDT</div>
                                </div>

                            </div>
                        </div>
                        <div className='col-12 col-md-6 mb-2'>
                            <label className="col-form-label modalLabel">Total voucher cards</label>
                            <input placeholder="Enter total voucher cards" type="text" className="form-control" value={planData.totalVoucherCard}
                                onChange={(e) => {
                                    setPlanData({
                                        ...planData, totalVoucherCard: e.target.value = e.target.value.replace(/[^0-9]/g, "").replace(/(\..*)\./g, "$1")
                                    })
                                }}
                                onKeyUp={(e) => { e.keyCode == 13 && handleAddUpdatePackage() }}
                            />
                        </div>
                        <div className='col-12 col-md-6 mb-2'>
                            <label className="col-form-label modalLabel">Voucher discount</label>
                            <div className="input-group">
                                <input
                                    type='text'
                                    value={planData.voucherDiscount}
                                    onChange={(e) => {
                                        setPlanData({
                                            ...planData, voucherDiscount: e.target.value = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1")
                                        })
                                    }}
                                    maxLength={6}
                                    placeholder="Enter voucher discount"
                                    className="form-control"
                                    onKeyUp={(e) => { e.keyCode == 13 && handleAddUpdatePackage() }}
                                />
                                <div className={`input-group-append`}>
                                    <div className="input-group-text">
                                        <i className="fa fa-percentage"></i>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className='col-12 col-md-6 mb-2'>
                            <label className="col-form-label modalLabel">Total month</label>
                            <div className="input-group">
                                <input
                                    type='text'
                                    disabled={planData.planId}
                                    value={planData.totalActivityMonth}
                                    onChange={(e) => {
                                        setPlanData({
                                            ...planData, totalActivityMonth: e.target.value = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1")
                                        })
                                    }}
                                    placeholder="Enter total month"
                                    className="form-control"
                                    onKeyUp={(e) => { e.keyCode == 13 && handleAddUpdatePackage() }}
                                />
                                <div className={`input-group-append ${planData.planId ? "groupIconDisable" : ""}`}>
                                    <div className="input-group-text">
                                        Month
                                    </div>
                                </div>
                            </div>
                        </div>
                        {!planData.planId || (planData.planId && planData.serialId != "0") ?
                            <div className='col-12 col-md-6 mb-2'>
                                <label className="col-form-label modalLabel">Select serial</label>
                                {planData.planId ?
                                    planData.serialId ? <input placeholder="Select serial" type="text" className="form-control" value={serialFilter.filter(option => option.value == planData.serialId)[0]?.label || 'All Serial'} disabled />
                                        : "" : <Select options={serialFilter}
                                            placeholder="Select serial"
                                            value={serialFilter.filter(option => option.value == planData.serialId)}
                                            onChange={(selectedOption) => { setPlanData({ ...planData, serialId: selectedOption.value }); }} />
                                }
                            </div> : ""}
                        <div className='col-12 col-md-6 mb-2 custom'>
                            <label className="col-form-label modalLabel">Voucher valid till</label>
                            <DatePicker
                                placeholderText="Select voucher valid till"
                                className="form-control"
                                dateFormat="dd/MM/yyyy"
                                selected={planData.voucherValidateTill}
                                onChange={(date) => setPlanData({ ...planData, voucherValidateTill: date })}
                                // minDate={moment().toDate()}
                                minDate={moment().add(1, 'days').toDate()} // Disable today and past dates

                            />
                        </div>
                        <div className='col-12 col-md-6 mb-2'>
                            <label className='col-form-label modalLabel'>Is offer</label>
                            <div className="d-flex">
                                <div className="custom-control custom-radio">
                                    <input
                                        type="radio"
                                        id="customRadio1"
                                        name="offer"
                                        className="custom-control-input"
                                        onChange={() => setPlanData({ ...planData, isOffer: 1 })}
                                        checked={planData.isOffer == 1}
                                    />
                                    <label className="custom-control-label cursor-pointer" htmlFor="customRadio1">
                                        Yes
                                    </label>
                                </div>
                                <div className="custom-control custom-radio mx-1">
                                    <input
                                        type="radio"
                                        id="customRadio2"
                                        name="offer"
                                        className="custom-control-input"
                                        onChange={() => setPlanData({ ...planData, isOffer: 0 })}
                                        checked={planData.isOffer == 0}
                                    />
                                    <label className="custom-control-label cursor-pointer" htmlFor="customRadio2">
                                        No
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer className='d-flex justify-content-end'>
                    <button className='btn btn-bordered-primary waves-effect btn-sm waves-light' onClick={() => handleAddUpdatePackage()}>
                        {submitLoder ? <Loader /> : ''}
                        Submit
                    </button>
                </Modal.Footer>
            </Modal>



        </div>
    )
}


export default UserList;