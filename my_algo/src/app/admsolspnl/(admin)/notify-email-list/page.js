"use client"
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import "flatpickr/dist/flatpickr.css"
const moment = require('moment')
moment.suppressDeprecationWarnings = true
import ReactPaginate from 'react-paginate'
import Table_Loader from '../../../../components/include/TableLoader'
import { convert_date } from '../../../../utils/common'
import { fetchApi } from '../../../../utils/frondend'
import { useAuthContext } from '../../../../context/auth'
import Loader from '../../../../components/include/Loader'
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/flatpickr.css"
const UserList = () => {

    const { setAuthTkn, setPageLoader } = useAuthContext();
    const [page, setPage] = useState(0)
    const [totalPage, setTotalPage] = useState(0)
    const [order, setOrder] = useState(1)
    const [orderClm, setOrderClm] = useState(2)
    const [loader, setLoader] = useState(false)
    const [searchLdr, setSearchLdr] = useState(false)
    const [notifyEmailList, setNotifyEmailList] = useState([])
    const date = moment(new Date()).subtract(process.env.FILTERDAYS, "days")
    const [startDate, setStartDate] = useState(date['_d'])
    const [endDate, setEndDate] = useState(date['_i'])
    const [search, setSearch] = useState("")
    const [dateRange, setDateRange] = useState(true)
    let st = new Date(moment(startDate).format('MM/DD/YYYY')).getTime() / 1000
    let ed = endDate ? new Date(moment(moment(endDate).format('MM/DD/YYYY')).add(23, 'h').add(59, 'm').add(59, 's')).getTime() / 1000 : 0


    const pagginationHandler = (page) => {
        var p = page.selected
        setPage(p)
    }



    const GetNotifyEmailList = async () => {

        if (!loader) {
            setLoader(true)
            const userData = JSON.stringify({
                page: page,
                order: order,
                orderColumn: orderClm,
                startDate: st,
                endDate: ed,
                search: search,
            })

            const getNotifyEmailList = await fetchApi("notify-email-list", userData, "GET")
            if (getNotifyEmailList.statusCode == 200) {
                setLoader(false)
                setSearchLdr(false)
                setTotalPage(getNotifyEmailList.data.total)
                setNotifyEmailList(getNotifyEmailList.data.data);
                setPageLoader(false)
            } else {
                setLoader(false)
                setSearchLdr(false)
                if (getNotifyEmailList.data.message == "Unauthorized") {
                    setAuthTkn(getNotifyEmailList.data.message)
                } else {
                    setPageLoader(false)
                    toast.error(getNotifyEmailList.data.message)
                }
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

    const serachList = () => {
        if (!dateRange) {
            toast.error("Please select both start and end dates.")
            return false
        }
        if (page >= 1) {
            setPage(0)
        } else {
            setSearchLdr(true)
            GetNotifyEmailList()
        }
    }



    useEffect(() => {

        GetNotifyEmailList()

    }, [page, order, orderClm])

    return (
        <div className="content-body btn-page">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="container-fluid p-4">
                <div className="row">

                    <h3 className="page-title-main">Notify Email List</h3>

                    <div className="col-lg-12">

                        <div className="card mt-4 mb-4">
                            <div className="card-header d-block">

                                <div className="row">
                                    <div className='col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2 custom'>
                                        <label className='form-label'>Subscribe On</label>
                                        <Flatpickr
                                            className='form-control'
                                            options={{
                                                defaultDate: [startDate, endDate],
                                                altInput: true,
                                                altFormat: "j, M Y",
                                                dateFormat: "Y-m-d",
                                                showMonths: 1,
                                                mode: "range",
                                            }}
                                            onChange={(update) => {
                                                (!update[0] || !update[1]) ? setDateRange(false) : setDateRange(true)
                                                setStartDate(update[0])
                                                update[1] ? setEndDate(update[1]) : ""
                                            }}
                                        />
                                    </div>

                                    <div className='col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2'>
                                        <label className='form-label'>Email</label>
                                        <input type="text" placeholder="Search" className="form-control search-placeholder" value={search} onChange={(e) => setSearch(e.target.value)} />
                                    </div>
                                    <div className='col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6  my-2' style={{ marginTop: "11px" }}>
                                        <label className='form-label text-white'>&nbsp;</label><br />
                                        <button className='loaderStyle btn btn-bordered-primary waves-effect search-btn waves-light' onClick={() => { serachList() }} >
                                            {searchLdr ? < Loader /> : <i className='bx bx-search'></i>} Search
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className={"card-body"}>

                                <div className="table-responsive position-relative">

                                    <table className={`table table-striped ${ loader   && 'tbl-overly'}   `} >

                                        <thead>
                                            <tr >
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => sortData(0, order == 0 ? 1 : 0)}>
                                                    #
                                                    <span className="iconPosition">
                                                        <i className="fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-0"></i>
                                                        <i className="fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-0"></i>
                                                    </span>
                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => sortData(1, order == 0 ? 1 : 0)}>
                                                    Email
                                                    <span className="iconPosition">
                                                        <i className="fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-1"></i>
                                                        <i className="fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-1"></i>
                                                    </span>
                                                </th>

                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => sortData(2, order == 0 ? 1 : 0)}>
                                                    Subscribe On
                                                    <span className="iconPosition">
                                                        <i className="fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-2"></i>
                                                        <i className="fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-2"></i>
                                                    </span>
                                                </th>



                                            </tr>
                                        </thead>

                                        <tbody>
                                            {notifyEmailList?.length > 0 ?
                                                notifyEmailList?.map((d, i) => {
                                                    return (

                                                        <tr key={i}>
                                                            <td className="text-center text-nowrap">{d?.num}</td>
                                                            <td className="text-center text-nowrap">{d?.email ? d?.email : '-'} </td>

                                                            <td className="text-center text-nowrap">{convert_date(d.createdOn)} </td>
                                                        </tr>
                                                    )
                                                }) : ''}


                                            {loader || notifyEmailList?.length <= 0 ?
                                                <tr>
                                                    <td className={`text-center ${notifyEmailList?.length <= 0 ? "tableLoaderBox" : ""}`} colSpan={3}>


                                                        {loader ? <div className={`disableTbl m-auto ${notifyEmailList?.length <= 0 ? "disableTblEmptyList" : ""}`}>
                                                            <Table_Loader /> </div> : <img src="/assets/images/no-data.png" alt="no data" />
                                                        }
                                                    </td>
                                                </tr> : ''}
                                        </tbody>
                                    </table>
                                </div>
                                {notifyEmailList.length ? <div className="row mt-3 paginationBox">
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




        </div >
    )
}


export default UserList;