"use client"
import React, { useState, useEffect } from 'react'
import Flatpickr from "react-flatpickr"
import toast, { Toaster } from 'react-hot-toast'
import { useAuthContext } from '../../../../context/auth'
import moment from 'moment'
import "flatpickr/dist/flatpickr.css"
import Loader from '../../../../components/include/Loader'
import { Modal } from 'react-bootstrap'
import { validate_string } from '../../../../utils/common'
import { fetchApi } from '../../../../utils/frondend'
import Table_Loader from '../../../../components/include/TableLoader'
import Swal from 'sweetalert2'
const page = () => {
    const { setAuthTkn, setPageLoader } = useAuthContext();
    const [faqList, setFaqList] = useState([])
    const [search, setSearch] = useState("")
    const [submitLoder, setSubmitLoder] = useState(false)
    const [searchLdr, setSearchLdr] = useState(false)
    const [dataLoader, setDataLoader] = useState(true)
    const date = moment(new Date()).subtract(process.env.FILTERDAYS, "days")
    const [dateRange, setDateRange] = useState([date['_d'], date['_i']])
    const _dateRange = [
        Math.floor(new Date(moment(moment(dateRange[0]).format('MM/DD/YYYY')).add(0, 'h').add(0, 'm').add(0, 's')).getTime() / 1000),
        Math.floor(new Date(moment(moment(dateRange[1]).format('MM/DD/YYYY')).add(23, 'h').add(59, 'm').add(59, 's')).getTime() / 1000)
    ]
    const [faqFormData, setFaqFormData] = useState({ question: "", answer: "", faq_id: '' })
    const [formAction, setFormAction] = useState(null)
    const { question, answer, faq_id } = faqFormData

    const [show, setShow] = useState(false)

    const getFaqList = async () => {
        setDataLoader(true)
        let data = JSON.stringify({
            search,
            startDate: _dateRange[0],
            endDate: _dateRange[1]
        })
        let response = await fetchApi("faq/faq-list", data, "GET")
        if (response.statusCode == 200) {
            setFaqList(response.data.data)
            setPageLoader(false)
        }
        else {
            if (response.data.message == "Unauthorized") {
                setAuthTkn(response.data.message)
            } else {
                toast.error(response.data.message)
                setPageLoader(false)
            }
        }
        setSearchLdr(false)
        setDataLoader(false)
    }
    useEffect(() => {
        getFaqList()
    }, [])



    const handleFaqForm = async (status, id) => {
        if (formAction !== null) {
            try {
                validate_string(answer, "Answer")
                validate_string(question, "Question")
            } catch (e) {
                toast.error(e)
                return false
            }
        }

        let bodydata = { question, answer }
        if (formAction == "Add") {
            const addFaq = await fetchApi("faq/add-faq", JSON.stringify(bodydata))
            if (addFaq.statusCode == 200) {
                setSubmitLoder(false)
                setShow(false)
                getFaqList()
                setFormAction(null)
                toast.success(addFaq?.data?.message)
            }
            else {
                if (addFaq?.data?.message == "Unauthorized") {
                    setAuthTkn(addFaq?.data?.message);
                } else {
                    toast.error(addFaq?.data?.message);
                }
            }
        }
        else {
            bodydata["faq_id"] = faq_id
            if (formAction == "Update") {
                updateFaq(bodydata)
            }
            else {
                Swal.fire({
                    title: `Are you sure?`,
                    text: `You want to change Question status to ${status == 0 ? "Active" : "Deactive"}.`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#448ec5',
                    confirmButtonText: 'Yes',
                }).then((result) => {
                    if (result.isConfirmed) {
                        bodydata['faq_id'] = id
                        bodydata["status"] = status == 0 ? 1 : 0
                        updateFaq(bodydata)
                    }
                })
            }


        }
    }

    const updateFaq = async (bodyData) => {
        const response = await fetchApi("faq/update-faq", JSON.stringify(bodyData))
        if (response.statusCode == 200) {
            setSubmitLoder(false)
            setShow(false)
            getFaqList()
            setFormAction(null)
            toast.success(response?.data?.message)
        }
        else {
            if (response?.data?.message == "Unauthorized") {
                setAuthTkn(response?.data?.message);
            } else {
                toast.error(response?.data?.message);
            }
        }
    }

    const handleEdit = (faq) => {
        setShow(true)
        setFaqFormData({ question: faq.question, answer: faq.answer, faq_id: faq.slr_faqId })
        setFormAction("Update")
    }
    const searchList = () => {

        setSearchLdr(true)
        if (!dateRange[0] || !dateRange[1]) {
            toast.error("Please select both start and end dates.")
            setSearchLdr(false)
            return false
        } else {
            getFaqList()
        }
    }
    return (
        <div className="content-body btn-page">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="container-fluid p-4">
                <div className="row">
                    <div className='d-flex justify-content-between align-items-center w-100'>
                        <h3 className="page-title-main">FAQ List</h3>
                        <div>
                            <button className=' btn btn-bordered-primary search-btn' onClick={() => { setShow(true); setFormAction("Add") }} >
                                Add
                            </button>
                        </div>
                    </div>

                    <div className="col-lg-12">

                        <div className="card mt-4 mb-4">
                            <div className="card-header d-block">

                                <div className="row">
                                    <div className='col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2 custom'>
                                        <label className='form-label'>Created On</label>
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
                                                setDateRange([update[0], update[1]])
                                            }}
                                        />
                                    </div>
                                    <div className='col-xl-2 col-lg-6 col-md-4 col-12 col-sm-6 my-2'>
                                        <label className='form-label'>Question</label>
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
                            <div className={"card-body"}>
                                {
                                    dataLoader ?
                                        <div className={` m-auto ${faqList?.length <= 0 ? "disableTblEmptyList" : ""}`}>
                                            <Table_Loader /> </div> :
                                        faqList.length > 0 ?
                                            faqList?.map((faq) => {
                                                return (
                                                    <div className='card'>
                                                        <div className='card-header d-block'>

                                                            <div className='d-flex flex-column flex-md-row justify-content-between'>
                                                                <h5 className=" fw-bold fs-18 mb-1 mb-md-0">{faq.question}</h5>
                                                                <div>
                                                                    <button onClick={() => { handleFaqForm(faq.status, faq.slr_faqId) }} className={`badge-${faq.status == 1 ? 'success' : 'danger'} mr-1 py-1`}>{faq.status == 1 ? "Active" : "Deactive"}</button>
                                                                    <button className="btn btn-sm btn-bordered-info mx-1" onClick={() => { handleEdit(faq) }}>
                                                                        <i className="fas fa-pencil-alt" />
                                                                    </button>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='card-body'>
                                                            {faq?.answer}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                            :
                                            <div className='d-flex justify-context-center'>
                                                <img className='m-auto' src="/assets/images/no-data.png" alt="no data" />
                                            </div>
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={show} className='' centered size='lg' >
                <Modal.Header >
                    <Modal.Title>
                        <h5 className="modal-title fw-bold fs-18"> {formAction} Faq</h5>
                    </Modal.Title>
                    <span className='modalCloseBtn' onClick={() => { setShow(false); setSubmitLoder(false); setFormAction(null) }}>
                        <i className="mdi mdi-close"></i>
                    </span>
                </Modal.Header>
                <Modal.Body className=''>
                    <div className="mb-2"  >
                        <div>
                            <label className="col-form-label">Question</label>
                        </div>
                        <div className={`inputContainer form-group d-flex w-100 validationBox`}>

                            <div className="input-group">
                                <input
                                    type="text"
                                    name="question"
                                    value={question}
                                    onChange={(e) => { setFaqFormData({ ...faqFormData, question: e.target.value }) }}
                                    placeholder="Question"
                                    className="form-control"

                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-2"  >
                        <div>
                            <label className="col-form-label">Answer</label>
                        </div>
                        <div className={`inputContainer form-group d-flex w-100 validationBox`}>

                            <div className="input-group">
                                <textarea
                                    name="answer"
                                    value={answer}
                                    onChange={(e) => { setFaqFormData({ ...faqFormData, answer: e.target.value }) }}
                                    placeholder="Answer"
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer className='d-flex justify-content-end'>
                    <button className='btn btn-bordered-primary waves-effect btn-sm waves-light' onClick={() => handleFaqForm()}>
                        {submitLoder ? <Loader /> : ''}
                        Submit
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default page