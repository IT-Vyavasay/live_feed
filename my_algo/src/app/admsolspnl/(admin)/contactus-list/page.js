'use client'
import React, { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/flatpickr.css"
import Loader from '../../../../components/include/Loader'
import Table_Loader from '../../../../components/include/TableLoader'
import ReactPaginate from 'react-paginate'
import moment from 'moment'
import { useAuthContext } from '../../../../context/auth'
import { fetchApi } from '../../../../utils/frondend'
import { convert_date } from '../../../../utils/common'
const page = () => {
    const { setAuthTkn, setPageLoader } = useAuthContext();
    const [page, setPage] = useState(0)
    const [totalPage, setTotalPage] = useState(0)
    const [loader, setLoader] = useState(false)
    const date = moment(new Date()).subtract(process.env.FILTERDAYS, "days")
    const [startDate, setStartDate] = useState(date['_d'])
    const [endDate, setEndDate] = useState(date['_i'])
    const [searchLdr, setSearchLdr] = useState(false)
    const [dateRange, setDateRange] = useState(true)
    const [order, setOrder] = useState(1)
    const [orderClm, setOrderClm] = useState(1)
    const [contactusList, setContactusList] = useState([])
    let st = new Date(moment(startDate).format('MM/DD/YYYY')).getTime() / 1000
    let ed = endDate ? new Date(moment(moment(endDate).format('MM/DD/YYYY')).add(23, 'h').add(59, 'm').add(59, 's')).getTime() / 1000 : 0



    const pagginationHandler = (page) => {
        var p = page.selected
        setPage(p)
    }

    const searchList = () => {
        if (!dateRange) {
            toast.error("Please select both start and end dates.")
            return false
        }
        if (page >= 1) {
            setPage(0)
        } else {
            setSearchLdr(true)
            getContactusList()
        }
    }

    const getContactusList = async () => {
        if (!loader) {
            setLoader(true)
            const userData = JSON.stringify({
                page: page,
                order: order,
                orderColumn: orderClm,
                startDate: st,
                endDate: ed,
            })
            const getContactusList = await fetchApi("contactus-list", userData, "GET")
            if (getContactusList.statusCode === 200) {
                setLoader(false)
                setSearchLdr(false)
                setTotalPage(getContactusList.data.total)
                setContactusList(getContactusList.data.data);
                setPageLoader(false)
            }
            else {
                setLoader(false)
                setSearchLdr(false)
                if (getContactusList.data.message == "Unauthorized") {
                    setAuthTkn(getContactusList.data.message)
                } else {
                    setPageLoader(false)
                    toast.error(getContactusList.data.message)
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

    useEffect(() => {
        getContactusList()
    }, [page, order, orderClm])


    return (
        <div className="content-body btn-page">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="container-fluid p-4">
                <div className="row">

                    <h3 className="page-title-main">Contact Us List</h3>

                    <div className="col-lg-12">

                        <div className="card mt-4 mb-4">
                            <div className="card-header d-block">

                                <div className="row">
                                    <div className='col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2 custom'>
                                        <label className='form-label'>Created On</label>
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

                                    {/* <div className='col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2'>
                                        <label className='form-label'>Email</label>
                                        <input type="text" placeholder="Search" className="form-control search-placeholder" value={search} onChange={(e) => setSearch(e.target.value)} />
                                    </div> */}
                                    <div className='col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6  my-2' style={{ marginTop: "11px" }}>
                                        <label className='form-label text-white'>&nbsp;</label><br />
                                        <button className='loaderStyle btn btn-bordered-primary waves-effect search-btn waves-light' onClick={() => { searchList() }} >
                                            {searchLdr ? < Loader /> : <i className='bx bx-search'></i>} Search
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className={"card-body"}>

                                <div className="table-responsive position-relative">

                                    <table className={`table table-striped ${loader && 'tbl-overly'}   `} >

                                        <thead>
                                            <tr >
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => sortData(0, order == 0 ? 1 : 0)}>
                                                    #
                                                    <span className="iconPosition">
                                                        <i className="fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-0"></i>
                                                        <i className="fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-0"></i>
                                                    </span>
                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" >
                                                    Subject
                                                </th>
                                                <th scope="col" className="text-center cursor-pointer text-nowrap" >
                                                    Message
                                                </th>

                                                <th scope="col" className="text-center cursor-pointer text-nowrap" onClick={() => sortData(1, order == 0 ? 1 : 0)}>
                                                    Created On
                                                    <span className="iconPosition">
                                                        <i className="fa fa-solid fa-sort-up position-absolute mx-1 mt-1 text-dull asc-1"></i>
                                                        <i className="fa fa-solid fa-sort-down position-absolute mx-1 mt-1 text-dull desc-1"></i>
                                                    </span>
                                                </th>



                                            </tr>
                                        </thead>

                                        <tbody>
                                            {contactusList?.length > 0 ?
                                                contactusList?.map((d, i) => {
                                                    return (

                                                        <tr key={i}>
                                                            <td className="text-center text-nowrap">{d?.num}</td>
                                                            <td className="text-center text-nowrap">{d?.subject ? d?.subject : '-'} </td>
                                                            <td className="text-center text-nowrap">{d?.message ? d?.message : '-'} </td>
                                                            <td className="text-center text-nowrap">{convert_date(d.createdOn)} </td>
                                                        </tr>
                                                    )
                                                }) : ''}


                                            {loader || contactusList?.length <= 0 ?
                                                <tr>
                                                    <td className={`text-center ${contactusList?.length <= 0 ? "tableLoaderBox" : ""}`} colSpan={4}>


                                                        {loader ? <div className={`disableTbl m-auto ${contactusList?.length <= 0 ? "disableTblEmptyList" : ""}`}>
                                                            <Table_Loader /> </div> : <img src="/assets/images/no-data.png" alt="no data" />
                                                        }
                                                    </td>
                                                </tr> : ''}
                                        </tbody>
                                    </table>
                                </div>
                                {contactusList.length ? <div className="row mt-3 paginationBox">
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

export default page