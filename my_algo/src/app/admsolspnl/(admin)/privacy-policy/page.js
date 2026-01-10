"use client"
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Swal from 'sweetalert2';
import { fetchApi } from '../../../../utils/frondend'
import { useAuthContext } from '../../../../context/auth'
import Loader from '../../../../components/include/Loader';
import TinyMCEEditor from '../../../../components/include/Editor';
import { validate_string } from '../../../../utils/common';
const Terms = () => {

    const { setAuthTkn, setPageLoader } = useAuthContext();
    const [loader, setLoader] = useState(false);
    const [loader2, setLoader2] = useState(false);
    const [data, setData] = useState("")
    const [contentEdited, setContentEdited] = useState(false);
    const handleEditorChange = (content) => {
        setContentEdited(true)
        setData(content)
    };

    const getContent = async () => {
        setLoader2(true)
        const bodyData = JSON.stringify({
            a: 1
        })

        const response = await fetchApi("configuration-content/get-content/privacy-policy", bodyData, "GET")
        if (response.statusCode === 200) {
            setData(response?.data?.content && JSON.parse(response.data.content))
            setLoader2(false)
        }
        else {
            toast.error(response.data.message)
            setLoader2(false)
        }
    }

    const handleSubmit = () => {
        if (!loader) {
            try {
                validate_string(data, "privacy policy")
                if (!contentEdited) {
                    throw 'No changes found'
                }
            } catch (e) {
                toast.error(e)
                return false
            }

            Swal.fire({
                title: 'Are you sure?',
                text: `You want to change privacy policy.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#448ec5',
                confirmButtonText: 'Yes',
            }).then(async (result) => {
                if (result.isConfirmed) {

                    setLoader(true)
                    let bodyData = {
                        newContent: data,
                    };
                    const update_content = await fetchApi("configuration-content/content-update/privacy-policy", JSON.stringify(bodyData));
                    setLoader(false)

                    if (update_content?.statusCode == 200) {
                        setContentEdited(false);
                        getContent()
                        toast.success(update_content?.data?.message);
                    } else {
                        if (update_content.data.message == "Unauthorized") {
                            setAuthTkn(update_content.data.message);
                        } else {
                            toast.error(update_content.data.message);
                        }
                    }
                }
            })


        }

    };


    useEffect(() => {
        getContent()
        setPageLoader(false)
    }, [])

    return (
        <div className="content-body btn-page">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="container-fluid p-4">
                <div className="row">

                    <h3 className="page-title-main" >Privacy Policy</h3>
                </div>
                <div className="row">
                    <div className='col-12   my-1' style={{ marginTop: "11px" }}>
                        <div className="card mt-4 mb-3 configuration-card">

                            <div className="card-header d-block ">
                                <div className='d-flex flex-column '>


                                    <div className="mb-2"  >
                                        <TinyMCEEditor handleEditorChange={handleEditorChange} val={data} isEditorShow={loader2} />
                                    </div>

                                    <div className={`justify-content-end ${loader2 ? "d-none" : "d-flex "}`}>
                                        <button type="button" className="btn btn-bordered-primary waves-effect search-btn waves-light loadingButton" onClick={handleSubmit}>
                                            {loader && <Loader />}  Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>



                </div>
            </div>

        </div >
    )
}


export default Terms;