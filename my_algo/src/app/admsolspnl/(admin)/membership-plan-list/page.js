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



    useEffect(() => {
        GetPackageList()
    }, [page, order, orderClm])



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