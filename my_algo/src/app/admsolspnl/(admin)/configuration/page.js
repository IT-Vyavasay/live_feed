"use client"
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Swal from 'sweetalert2';
import { fetchApi } from '../../../../utils/frondend'
import { useAuthContext } from '../../../../context/auth'
import { chk_otp, chk_password, compareArrays, compareValue, validate_config_number, validate_input_number_zero_or_one, validate_string, validate_url } from '../../../../utils/common';
import Loader from '../../../../components/include/Loader';
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
const Configuration = () => {

    const { setAuthTkn, setPageLoader } = useAuthContext();
    const [maitenenceLdr, setMaitenenceLdr] = useState(false);
    const [loadMaintenance, setLoadMaintenance] = useState(false);
    const [maintainenceStatus, setMaintainenceStatus] = useState("");
    const [prevMaintainenceStatus, setPrevMaintainenceStatus] = useState("");
    const [twofaOtp, setTwofaOtp] = useState("");
    const [twofaOtp2, setTwofaOtp2] = useState("");
    const [twofaOtp3, setTwofaOtp3] = useState("");
    const [twofaOtp4, setTwofaOtp4] = useState("");
    const [twofaOtp5, setTwofaOtp5] = useState("");
    const [changePwdLdr, setChangePwdLdr] = useState(false); 
    const [showPwd, setShowPwd] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",

    });
    const [fields, setFields] = useState({

        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [preUniqRewardPerc, setPreUniqRewardPerc] = useState([]);

    const [uniqRewardPerc, setUniqRewardPerc] = useState({
        level1: 0,
        level2: 0,
        level3: 0,
        level4: 0,
        level5: 0,
        level6: 0,

    });
    const [preMatrixRewardPerc, setPreMatrixRewardPerc] = useState(0);
    const [matrixRewardPerc, setMatrixRewardPerc] = useState(0);

    const [uniqRewardPercLdr, setUniqRewardPercLdr] = useState(false);
    const [matrixRewardPercLdr, setMatrixRewardPercLdr] = useState(false);
    const [getUniqRewardPercLdr, setGetUniqRewardPercLdr] = useState(false);
    const [getMatrixRewardPercLdr, setGetMatrixRewardPercLdr] = useState(false); 

    const [prewelcomeVideoLink, setPreWelcomeVideoLink] = useState("");
    const [welcomeVideoLink, setWelcomeVideoLink] = useState("");
    const [welcomeVideoLinkLdr, setWelcomeVideoLinkLdr] = useState(false);
    const [getWelcomeVideoLinkLdr, setGetWelcomeVideoLinkLdr] = useState(false);
    const router = useRouter()
    const logout = async () => {
        const data = await signOut({ redirect: false, callbackUrl: '/' + process.env.ADMFLDR })
        router.push('/' + process.env.ADMFLDR)
    }
    const GetMaintaanenceStatus = async () => {
        if (!maitenenceLdr) {
            setLoadMaintenance(true)

            const userData = JSON.stringify({ status: 0 })

            const get_maintaanenceStatus = await fetchApi("configuration/maintenance/get-maintenance", userData, "GET")
            if (get_maintaanenceStatus.statusCode == 200) {
                setMaintainenceStatus(get_maintaanenceStatus?.data?.maintananceStatus)
                setPrevMaintainenceStatus(get_maintaanenceStatus?.data?.maintananceStatus)
                setLoadMaintenance(false)
                setPageLoader(false)
            } else {
                setLoadMaintenance(false)
                if (get_maintaanenceStatus.data.message == "Unauthorized") {
                    setAuthTkn(get_maintaanenceStatus.data.message)
                } else {
                    setPageLoader(false)
                    toast.error(get_maintaanenceStatus.data.message)
                }
            }
        }
    }

    const changeMaintenanceStatus = async () => {
        if (!maitenenceLdr) {
            Swal.fire({
                title: 'Are you sure?',
                text: `You want to change maintenance status.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#448ec5',
                confirmButtonText: 'Yes',
            })
                .then(async (result) => {
                    if (result.isConfirmed) {


                        setMaitenenceLdr(true)
                        const ActivationData = JSON.stringify({
                            status: maintainenceStatus,
                            otp: twofaOtp,
                        })


                        const change_status = await fetchApi("configuration/maintenance/change-maintenance", ActivationData)
                        setMaitenenceLdr(false)

                        if (change_status.statusCode == 200) {
                            setPrevMaintainenceStatus(maintainenceStatus)
                            setTwofaOtp("")
                            toast.success(change_status.data.message)
                        } else {
                            if (change_status.data.message == "Unauthorized") {
                                setAuthTkn(change_status.data.message)
                            } else {
                                toast.error(change_status?.data?.message)
                            }
                        }
                    }
                })
        }
    }

    const onHandleClick = (e) => {
        try {

            if (prevMaintainenceStatus == maintainenceStatus) {
                throw "Please change maintanence status"
            }
            validate_input_number_zero_or_one(`${maintainenceStatus}`, `maintainence status`)
            chk_otp(twofaOtp)
            changeMaintenanceStatus()
        } catch (error) {
            toast.error(error)
        }

    }

    const checkPass = (pass) => {
        const v = pass;
        const digit = /[0-9]/;
        const lower = /[a-z]/;
        const cap = /[A-Z]/;
        const spchar = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (v == "" || v == undefined) {
            $("#er1, #er2, #er3, #er4, #er5")
                .addClass("text-danger fa-circle-xmark")
                .removeClass("text-success fa-check-circle");
        } else {
            const c = v.length;
            $("#er1")
                .addClass(v.match(digit) ? "text-success fa-check-circle" : "text-danger fa-circle-xmark")
                .removeClass(v.match(digit) ? "text-danger fa-circle-xmark" : "text-success fa-check-circle");
            $("#er2")
                .addClass(v.match(lower) ? "text-success fa-check-circle" : "text-danger fa-circle-xmark")
                .removeClass(v.match(lower) ? "text-danger fa-circle-xmark" : "text-success fa-check-circle");
            $("#er3")
                .addClass(v.match(spchar) ? "text-success fa-check-circle" : "text-danger fa-circle-xmark")
                .removeClass(v.match(spchar) ? "text-danger fa-circle-xmark" : "text-success fa-check-circle");
            $("#er4")
                .addClass((c >= 8 && c <= 30) ? "text-success fa-check-circle" : "text-danger fa-circle-xmark")
                .removeClass((c >= 8 && c <= 30) ? "text-danger fa-circle-xmark" : "text-success fa-check-circle");
            $("#er5")
                .addClass(v.match(cap) ? "text-success fa-check-circle" : "text-danger fa-circle-xmark")
                .removeClass(v.match(cap) ? "text-danger fa-circle-xmark" : "text-success fa-check-circle");

        }
    };
    const ClickOnEye = (field) => {
        setShowPwd({ ...showPwd, [field]: !showPwd[field] })
    }
    const RemovePasswordValidationAndValue = () => {
        setShowPwd({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",

        });
        setTwofaOtp2("")
        setFields({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        return null
    }
    const handleChangePwdSubmit = () => {
        if (!changePwdLdr) {
            try {
                validate_string(fields.currentPassword, "current password")
                chk_password(fields.currentPassword)
                validate_string(fields.newPassword, "new password")
                chk_password(fields.newPassword)
                validate_string(fields.confirmPassword, "confirm password")
                if (fields.newPassword !== fields.confirmPassword) {
                    throw `New password and confirm password doesn't match`
                }
                chk_otp(twofaOtp2)
            } catch (e) {
                toast.error(e)
                return false
            }

            Swal.fire({
                title: 'Are you sure?',
                text: `You want to change password.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#448ec5',
                confirmButtonText: 'Yes',
            }).then(async (result) => {
                if (result.isConfirmed) {

                    setChangePwdLdr(true)
                    let bodyData = {
                        currentPassword: fields.currentPassword,
                        newPassword: fields.newPassword,
                        otp: twofaOtp2
                    };
                    const add_user = await fetchApi("configuration/change-password", JSON.stringify(bodyData));
                    setChangePwdLdr(false)
                    if (add_user?.statusCode == 200) {
                        toast.success(add_user?.data?.message);
                        RemovePasswordValidationAndValue()
                        logout()
                    } else {
                        if (add_user.data.message == "Unauthorized") {
                            setAuthTkn(add_user.data.message);
                        } else {
                            toast.error(add_user.data.message);
                        }
                    }
                }
            })


        }

    };

    const GetConfigData = async () => {
        if (!getUniqRewardPercLdr) {
            setGetUniqRewardPercLdr(true)
            const bodyData = JSON.stringify({ a: 0 })
            const get_uniqRewardPercData = await fetchApi("configuration/uni-plan-reward-config/get-config-value", bodyData, "GET")
            if (get_uniqRewardPercData.statusCode == 200) {
                const parseData = get_uniqRewardPercData?.data?.uniPlanRewardPerc ? JSON.parse(get_uniqRewardPercData?.data?.uniPlanRewardPerc) : []

                setUniqRewardPerc({
                    level1: parseData[0] ? parseData[0] : 0,
                    level2: parseData[1] ? parseData[1] : 0,
                    level3: parseData[2] ? parseData[2] : 0,
                    level4: parseData[3] ? parseData[3] : 0,
                    level5: parseData[4] ? parseData[4] : 0,
                    level6: parseData[5] ? parseData[5] : 0,
                })
                setPreUniqRewardPerc([
                    parseData[0] ? parseData[0] : 0,
                    parseData[1] ? parseData[1] : 0,
                    parseData[2] ? parseData[2] : 0,
                    parseData[3] ? parseData[3] : 0,
                    parseData[4] ? parseData[4] : 0,
                    parseData[5] ? parseData[5] : 0,
                ])
                setGetUniqRewardPercLdr(false)
            } else {
                setGetUniqRewardPercLdr(false)
                if (get_uniqRewardPercData.data.message == "Unauthorized") {
                    setAuthTkn(get_uniqRewardPercData.data.message)
                } else {
                    toast.error(get_uniqRewardPercData.data.message)
                }
            }
        }
    }
    const GetMatrixConfigData = async () => {
        if (!getMatrixRewardPercLdr) {
            setGetMatrixRewardPercLdr(true)
            const bodyData = JSON.stringify({ a: 0 })
            const get_matrixRewardPercData = await fetchApi("configuration/matrix-reward-config/get-config-value", bodyData, "GET")
            if (get_matrixRewardPercData.statusCode == 200) {
                const matrixValue = get_matrixRewardPercData?.data?.matrixRewardPerc??0

                setMatrixRewardPerc(matrixValue)
                setPreMatrixRewardPerc( matrixValue)
                setGetMatrixRewardPercLdr(false)
            } else {
                setGetMatrixRewardPercLdr(false)
                if (get_matrixRewardPercData.data.message == "Unauthorized") {
                    setAuthTkn(get_matrixRewardPercData.data.message)
                } else {
                    toast.error(get_matrixRewardPercData.data.message)
                }
            }
        }
    }
    const submitUniPlanRewardConfig = async () => {
        if (!uniqRewardPercLdr) {
            try {
                compareArrays(preUniqRewardPerc, Object.values(uniqRewardPerc) , "No change made.")
                validate_config_number(uniqRewardPerc['level1'], "Level 1")
                validate_config_number(uniqRewardPerc['level2'], "Level 2")
                validate_config_number(uniqRewardPerc['level3'], "Level 3")
                validate_config_number(uniqRewardPerc['level4'], "Level 4")
                validate_config_number(uniqRewardPerc['level5'], "Level 5")
                validate_config_number(uniqRewardPerc['level6'], "Level 6")
                const RewardSum =
                    parseFloat(uniqRewardPerc['level1']).toFixed(2)
                    + parseFloat(uniqRewardPerc['level2']).toFixed(2)
                    + parseFloat(uniqRewardPerc['level3']).toFixed(2)
                    + parseFloat(uniqRewardPerc['level4']).toFixed(2)
                    + parseFloat(uniqRewardPerc['level5']).toFixed(2)
                    + parseFloat(uniqRewardPerc['level6']).toFixed(2)


                if (RewardSum > 100) {
                    throw "Reward Perc(%) should be less than or equal to 100%"
                }
                chk_otp(twofaOtp3)

                Swal.fire({
                    title: 'Are you sure?',
                    text: `You want to submit uniplan reward config.`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#448ec5',
                    confirmButtonText: 'Yes',
                })
                    .then(async (result) => {
                        if (result.isConfirmed) {
                            setUniqRewardPercLdr(true)
                            const ActivationData = JSON.stringify({
                                metaKey: 'uniPlanRewardPerc',
                                // metaValue: JSON.stringify(Object.values(uniqRewardPerc) ),
                                metaValue: JSON.stringify( [parseFloat(uniqRewardPerc.level1).toFixed(2),parseFloat(uniqRewardPerc.level2).toFixed(2),parseFloat(uniqRewardPerc.level3).toFixed(2),parseFloat(uniqRewardPerc.level4).toFixed(2),parseFloat(uniqRewardPerc.level5).toFixed(2),parseFloat(uniqRewardPerc.level6).toFixed(2)]),
                                otp: twofaOtp3
                            })
                            const change_status = await fetchApi("configuration/uni-plan-reward-config/add-update-config-value", ActivationData)
                            setUniqRewardPercLdr(false)

                            if (change_status.statusCode == 200) {
                                setTwofaOtp3("")
                                GetConfigData()
                                toast.success(change_status.data.message)
                            } else {
                                if (change_status.data.message == "Unauthorized") {
                                    setAuthTkn(change_status.data.message)
                                } else {
                                    toast.error(change_status?.data?.message)
                                }
                            }
                        }
                    })
            } catch (error) {
                toast.error(error)
            }
        }
    }
    const submitMatrixRewardConfig = async () => {
        if (!matrixRewardPercLdr) {
            try {
                compareArrays([preMatrixRewardPerc], [matrixRewardPerc], "No change made.")
                validate_config_number(matrixRewardPerc, "matrix reward perc") 
                


                if (parseFloat(matrixRewardPerc) > 100) {
                    throw "Reward Perc(%) should be less than or equal to 100%"
                }
                chk_otp(twofaOtp4)

                Swal.fire({
                    title: 'Are you sure?',
                    text: `You want to submit matrix reward config.`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#448ec5',
                    confirmButtonText: 'Yes',
                })
                    .then(async (result) => {
                        if (result.isConfirmed) {
                            setMatrixRewardPercLdr(true)
                            const ActivationData = JSON.stringify({ 
                                metaValue: parseFloat(matrixRewardPerc).toFixed(2),
                                otp: twofaOtp4
                            })
                            const change_status = await fetchApi("configuration/matrix-reward-config/add-update-config-value", ActivationData)
                            setMatrixRewardPercLdr(false)

                            if (change_status.statusCode == 200) {
                                setTwofaOtp4("")
                                GetMatrixConfigData()
                                toast.success(change_status.data.message)
                            } else {
                                if (change_status.data.message == "Unauthorized") {
                                    setAuthTkn(change_status.data.message)
                                } else {
                                    toast.error(change_status?.data?.message)
                                }
                            }
                        }
                    })
            } catch (error) {
                toast.error(error)
            }
        }
    }


    const GetWelcomeVideoConfigData = async () => {
        if (!getWelcomeVideoLinkLdr) {
            setGetWelcomeVideoLinkLdr(true)
            const bodyData = JSON.stringify({ a: 0 })
            const get_WelcomeVideoRewardPercData = await fetchApi("configuration/welcome-video-config/get-config-value", bodyData, "GET")
            if (get_WelcomeVideoRewardPercData.statusCode == 200) {
                const WelcomeVideoValue = get_WelcomeVideoRewardPercData?.data?.welcomeVideoLink??""

                setWelcomeVideoLink(WelcomeVideoValue)
                setPreWelcomeVideoLink( WelcomeVideoValue)
                setGetWelcomeVideoLinkLdr(false)
            } else {
                setGetWelcomeVideoLinkLdr(false)
                if (get_WelcomeVideoRewardPercData.data.message == "Unauthorized") {
                    setAuthTkn(get_WelcomeVideoRewardPercData.data.message)
                } else {
                    toast.error(get_WelcomeVideoRewardPercData.data.message)
                }
            }
        }
    }

    const submitWelcomeVideoRewardConfig = async () => {
        if (!welcomeVideoLinkLdr) {
            try {
                compareValue([prewelcomeVideoLink], [welcomeVideoLink], "No change made.")
                validate_url(welcomeVideoLink, "welcome videolink")  
                chk_otp(twofaOtp5)

                Swal.fire({
                    title: 'Are you sure?',
                    text: `You want to change welcome video link.`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#448ec5',
                    confirmButtonText: 'Yes',
                })
                    .then(async (result) => {
                        if (result.isConfirmed) {
                            setWelcomeVideoLinkLdr(true)
                            const linkData = JSON.stringify({ 
                                metaValue:welcomeVideoLink,
                                otp: twofaOtp5
                            })
                            const change_status = await fetchApi("configuration/welcome-video-config/add-update-config-value", linkData)
                            setWelcomeVideoLinkLdr(false)

                            if (change_status.statusCode == 200) {
                                setTwofaOtp5("")
                                GetWelcomeVideoConfigData()
                                toast.success(change_status.data.message)
                            } else {
                                if (change_status.data.message == "Unauthorized") {
                                    setAuthTkn(change_status.data.message)
                                } else {
                                    toast.error(change_status?.data?.message)
                                }
                            }
                        }
                    })
            } catch (error) {
                toast.error(error)
            }
        }
    }
    useEffect(() => {
        GetMaintaanenceStatus()
        GetMatrixConfigData()
        GetConfigData()
        GetWelcomeVideoConfigData()
        setPageLoader(false)
    }, [])

    return (
        <div className="content-body btn-page">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="container-fluid p-4">
                <div className="row">

                    <h3 className="page-title-main" >Configuration</h3>
                </div>
                <div className="row">

                    <div className='col-xl-4 col-lg-6 col-md-6 col-12 col-sm-6  my-1'>
                        <div className="card mt-4 mb-4 configuration-card">

                            <div className="card-header d-block ">
                                <h3 className="card-title">Change Password</h3>
                                <div className='d-flex flex-column '>

                                    <div className="mb-2"  >
                                        <div>
                                            <label className="col-form-label">Current Password</label>
                                        </div>
                                        <div className={`inputContainer form-group d-flex w-100`}>

                                            <div className="input-group">

                                                <input

                                                    type={showPwd["currentPassword"] ? "text" : "password"}
                                                    name="currentPassword"
                                                    value={fields["currentPassword"]}
                                                    onChange={(e) => setFields({ ...fields, currentPassword: e.target.value })}
                                                    placeholder={"Current password"}
                                                    className="form-control"
                                                    onKeyUp={(e) => e.keyCode == 13 && handleChangePwdSubmit()}

                                                />
                                                <div className="input-group-append">
                                                    <div className="input-group-text" id="btnGroupAddon" onClick={() => ClickOnEye("currentPassword")}> <i className={`${`hideShow   mdi mdi-eye${showPwd["currentPassword"] ? "" : "-off"} fs-4`}`}></i>  </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-2"  >
                                        <div>
                                            <label className="col-form-label">New Password</label>
                                        </div>
                                        <div className={`inputContainer form-group d-flex w-100 validationBox`}>

                                            <div className="input-group">

                                                <input
                                                    type={showPwd["newPassword"] ? "text" : "password"}
                                                    name="newPassword"
                                                    value={fields["newPassword"]}
                                                    onChange={(e) => { setFields({ ...fields, newPassword: e.target.value }) }}
                                                    placeholder={"New password"}
                                                    className="form-control"
                                                    onKeyUp={(e) => { checkPass(e.target.value), e.keyCode == 13 && handleChangePwdSubmit() }}
                                                />
                                                <div className="input-group-append ">
                                                    <div className="input-group-text" id="btnGroupAddon" onClick={() => ClickOnEye("newPassword")}> <i className={`${`hideShow  mdi mdi-eye${showPwd["newPassword"] ? "" : "-off"} fs-4`}`}></i> </div>
                                                </div>

                                            </div>
                                            <span className='password-validation-span'>
                                                <span><i className='fa fa-circle-xmark' id='er1'></i> 1 Number</span>
                                                <span><i className='fa fa-circle-xmark' id='er5'></i> 1 Uppercase</span>
                                                <span><i className='fa fa-circle-xmark' id='er2'></i> 1 Lowercase</span>
                                                <span><i className='fa fa-circle-xmark' id='er3'></i> 1 Special Character</span>
                                                <span><i className='fa fa-circle-xmark' id='er4'></i> Min 8 - 32 Max Character</span>
                                            </span>

                                        </div>
                                    </div>
                                    <div className="mb-2"  >
                                        <div>
                                            <label className="col-form-label">Confirm Password</label>
                                        </div>
                                        <div className={`inputContainer form-group d-flex w-100`}>

                                            <div className="input-group">

                                                <input

                                                    type={showPwd["confirmPassword"] ? "text" : "password"}
                                                    name="confirmPassword"
                                                    value={fields["confirmPassword"]}
                                                    onChange={(e) => setFields({ ...fields, confirmPassword: e.target.value })}
                                                    placeholder={"Confirm password"}
                                                    className="form-control"
                                                    onKeyUp={(e) => e.keyCode == 13 && handleChangePwdSubmit()}

                                                />
                                                <div className="input-group-append">
                                                    <div className="input-group-text" id="btnGroupAddon" onClick={() => ClickOnEye("confirmPassword")}> <i className={`${`hideShow  mdi mdi-eye${showPwd["confirmPassword"] ? "" : "-off"} fs-4`}`}></i>  </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-2"  >
                                        <div>
                                            <label className="col-form-label"  >Google authenticator OTP</label>
                                        </div>
                                        <div className="form-group  ">
                                            <input placeholder="Enter google authenticator OTP" type="text" className="form-control" value={twofaOtp2} onChange={(e) => { setTwofaOtp2(e.target.value = e.target.value.replace(/[^0-9]/g, "").replace(/(\..*)\./g, "$1")) }} onKeyUp={(e) => e.keyCode == 13 && handleChangePwdSubmit()} maxLength={6} />
                                        </div>
                                    </div>
                                    <div className='d-flex justify-content-end'>
                                        <button type="button" className="btn btn-bordered-primary waves-effect search-btn waves-light loadingButton" onClick={() => handleChangePwdSubmit()}>
                                            {changePwdLdr && <Loader />}  Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-xl-4 col-lg-6 col-md-6 col-12 col-sm-6  my-1'>
                        
                        <div className="card mt-4 mb-3 configuration-card">

                            <div className="card-header d-block ">
                                <h3 className="card-title">Unipaln Reward Config</h3>
                                <div className={getUniqRewardPercLdr ? "d-none" : "row"}>

                                    {/* Level 1 */}
                                    <div className="mb-2 col-lg-6 col-md-6 col-sm-12"  >
                                        <div>
                                            <label className="col-form-label">Level 1</label>
                                        </div>
                                        <div className={`inputContainer form-group d-flex w-100`}>

                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    name="level1"
                                                    value={uniqRewardPerc["level1"]}
                                                    onChange={(e) => { setUniqRewardPerc({ ...uniqRewardPerc, level1: e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1') }) }}
                                                    placeholder={"Level 1"}
                                                    className="form-control"
                                                    onKeyUp={(e) => e.keyCode == 13 && submitUniPlanRewardConfig()}

                                                />
                                                <div className="input-group-append">
                                                    <div className="input-group-text" id="btnGroupAddon"  > <i className="mdi mdi-percent"></i>  </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Level 2 */}
                                    <div className="mb-2 col-lg-6 col-md-6 col-sm-12"  >
                                        <div>
                                            <label className="col-form-label">Level 2</label>
                                        </div>
                                        <div className={`inputContainer form-group d-flex w-100`}>

                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    name="level2"
                                                    value={uniqRewardPerc["level2"]}
                                                    onChange={(e) => { setUniqRewardPerc({ ...uniqRewardPerc, level2: e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1') }) }}
                                                    placeholder={"Level 2"}
                                                    className="form-control"
                                                    onKeyUp={(e) => e.keyCode == 13 && submitUniPlanRewardConfig()}

                                                />
                                                <div className="input-group-append">
                                                    <div className="input-group-text" id="btnGroupAddon"  > <i className="mdi mdi-percent"></i>  </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Level 3 */}
                                    <div className="mb-2 col-lg-6 col-md-6 col-sm-12"  >
                                        <div>
                                            <label className="col-form-label">Level 3</label>
                                        </div>
                                        <div className={`inputContainer form-group d-flex w-100`}>

                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    name="level3"
                                                    value={uniqRewardPerc["level3"]}
                                                    onChange={(e) => { setUniqRewardPerc({ ...uniqRewardPerc, level3: e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1') }) }}
                                                    placeholder={"Level 3"}
                                                    className="form-control"
                                                    onKeyUp={(e) => e.keyCode == 13 && submitUniPlanRewardConfig()}

                                                />
                                                <div className="input-group-append">
                                                    <div className="input-group-text" id="btnGroupAddon"  > <i className="mdi mdi-percent"></i>  </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Level 4 */}
                                    <div className="mb-2 col-lg-6 col-md-6 col-sm-12"  >
                                        <div>
                                            <label className="col-form-label">Level 4</label>
                                        </div>
                                        <div className={`inputContainer form-group d-flex w-100`}>

                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    name="level4"
                                                    value={uniqRewardPerc["level4"]}
                                                    onChange={(e) => { setUniqRewardPerc({ ...uniqRewardPerc, level4: e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1') }) }}
                                                    placeholder={"Level 4"}
                                                    className="form-control"
                                                    onKeyUp={(e) => e.keyCode == 13 && submitUniPlanRewardConfig()}

                                                />
                                                <div className="input-group-append">
                                                    <div className="input-group-text" id="btnGroupAddon"  > <i className="mdi mdi-percent"></i>  </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Level 5 */}
                                    <div className="mb-2 col-lg-6 col-md-6 col-sm-12"  >
                                        <div>
                                            <label className="col-form-label">Level 5</label>
                                        </div>
                                        <div className={`inputContainer form-group d-flex w-100`}>

                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    name="level5"
                                                    value={uniqRewardPerc["level5"]}
                                                    onChange={(e) => { setUniqRewardPerc({ ...uniqRewardPerc, level5: e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1') }) }}
                                                    placeholder={"Level 5"}
                                                    className="form-control"
                                                    onKeyUp={(e) => e.keyCode == 13 && submitUniPlanRewardConfig()}

                                                />
                                                <div className="input-group-append">
                                                    <div className="input-group-text" id="btnGroupAddon"  > <i className="mdi mdi-percent"></i>  </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Level 6 */}
                                    <div className="mb-2 col-lg-6 col-md-6 col-sm-12"  >
                                        <div>
                                            <label className="col-form-label">Level 6</label>
                                        </div>
                                        <div className={`inputContainer form-group d-flex w-100`}>

                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    name="level6"
                                                    value={uniqRewardPerc["level6"]}
                                                    onChange={(e) => { setUniqRewardPerc({ ...uniqRewardPerc, level6: e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1') }) }}
                                                    placeholder={"Level 6"}
                                                    className="form-control"
                                                    onKeyUp={(e) => e.keyCode == 13 && submitUniPlanRewardConfig()}

                                                />
                                                <div className="input-group-append">
                                                    <div className="input-group-text" id="btnGroupAddon"  > <i className="mdi mdi-percent"></i>  </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Google authenticator */}
                                    <div className="mb-2 mb-2 col-12"  >
                                        <div>
                                            <label className="col-form-label">Google Authenticator OTP</label>
                                        </div>
                                        <div className="form-group  ">
                                            <input placeholder="Enter google authenticator OTP" type="text" className="form-control" value={twofaOtp3} onChange={(e) => { setTwofaOtp3(e.target.value = e.target.value.replace(/[^0-9]/g, "").replace(/(\..*)\./g, "$1")) }} onKeyUp={(e) => e.keyCode == 13 && onHandleClick()} maxLength={6} />
                                        </div>
                                    </div>
                                    <div className="mb-2 mb-2 col-12"  >
                                        <div className='d-flex justify-content-end w-100'>
                                            <button type="button" className="btn btn-bordered-primary waves-effect search-btn waves-light loadingButton" onClick={() => submitUniPlanRewardConfig()}>
                                                {uniqRewardPercLdr && <Loader />}  Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className={getUniqRewardPercLdr ? "mb-2 mb-2" : "d-none"}>
                                    <div className='d-flex justify-content-center align-items-center w-100'>
                                        <Loader />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        
                    </div>
                    <div className='col-xl-4 col-lg-6 col-md-6 col-12 col-sm-6  my-1'>
                        <div className="card mt-4 mb-3 configuration-card">

                            <div className="card-header d-block ">
                                <h3 className="card-title">Maintenance Status</h3>
                                <div className='d-flex flex-column '>


                                    <div className="mb-2 d-flex justify-content-between align-items-center"  >
                                        <div>
                                            <label className="col-form-label">Site Maintenance</label>
                                        </div>
                                        {
                                            loadMaintenance ? <Loader /> :

                                                <span className={maintainenceStatus == 1 ? "" : "togggleOff"} onClick={() => setMaintainenceStatus(maintainenceStatus == 1 ? 0 : 1)}>

                                                    <span className="switchery switchery-small"  ><small  ></small></span>
                                                    <input type="checkbox" defaultChecked={false} data-plugin="switchery" data-color="#ff7aa3" className='d-none' data-switchery="true" />

                                                </span>
                                        }

                                    </div>
                                    <div className="mb-2"  >
                                        <div>
                                            <label className="col-form-label">Google Authenticator OTP</label>
                                        </div>
                                        <div className="form-group  ">
                                            <input placeholder="Enter google authenticator OTP" type="text" className="form-control" value={twofaOtp} onChange={(e) => { setTwofaOtp(e.target.value = e.target.value.replace(/[^0-9]/g, "").replace(/(\..*)\./g, "$1")) }} onKeyUp={(e) => e.keyCode == 13 && onHandleClick()} maxLength={6} />
                                        </div>
                                    </div>
                                    <div className='d-flex justify-content-end'>
                                        <button type="button" className="btn btn-bordered-primary waves-effect search-btn waves-light loadingButton" onClick={() => onHandleClick()}>
                                            {maitenenceLdr && <Loader />}  Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card mt-3 mb-3 configuration-card">

                            <div className="card-header d-block ">
                                <h3 className="card-title">Matrix Reward Config</h3>
                                <div className={getUniqRewardPercLdr ? "d-none" : "row"}> 
                                    <div className="mb-2 col-12"  >
                                        <div>
                                            <label className="col-form-label">Matrix Reward Perc</label>
                                        </div>
                                        <div className={`inputContainer form-group d-flex w-100`}>

                                            <div className="input-group">
                                                <input
                                                    type="text" 
                                                    value={matrixRewardPerc} 
                                                    onChange={(e) => { setMatrixRewardPerc( e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')) }}
                                                    placeholder={"Matrix Reward Config"}
                                                    className="form-control"
                                                    onKeyUp={(e) => e.keyCode == 13 && submitMatrixRewardConfig()}

                                                />
                                                <div className="input-group-append">
                                                    <div className="input-group-text" id="btnGroupAddon"  > <i className="mdi mdi-percent"></i>  </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                 
                                    {/* Google authenticator */}
                                    <div className="mb-2  col-12"  >
                                        <div>
                                            <label className="col-form-label">Google Authenticator OTP</label>
                                        </div>
                                        <div className="form-group  ">
                                            <input placeholder="Enter google authenticator OTP" type="text" className="form-control" value={twofaOtp4} onChange={(e) => { setTwofaOtp4(e.target.value = e.target.value.replace(/[^0-9]/g, "").replace(/(\..*)\./g, "$1")) }} onKeyUp={(e) => e.keyCode == 13 && submitMatrixRewardConfig()} maxLength={6} />
                                        </div>
                                    </div>
                                    <div className=" mb-2 col-12"  >
                                        <div className='d-flex justify-content-end w-100'>
                                            <button type="button" className="btn btn-bordered-primary waves-effect search-btn waves-light loadingButton" onClick={() => submitMatrixRewardConfig()}>
                                                {matrixRewardPercLdr && <Loader />}  Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className={getMatrixRewardPercLdr ? "mb-2 mb-2" : "d-none"}>
                                    <div className='d-flex justify-content-center align-items-center w-100'>
                                        <Loader />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card mt-3 mb-4 configuration-card">

                            <div className="card-header d-block ">
                                <h3 className="card-title">Change Welcome Video Link</h3>
                                <div className={getUniqRewardPercLdr ? "d-none" : "row"}> 
                                    <div className="mb-2 col-12"  >
                                        <div>
                                            <label className="col-form-label">Welcome Video Link</label>
                                        </div>
                                        <div className={`inputContainer form-group d-flex w-100`}>

                                            <div className="input-group">
                                                <input
                                                    type="text" 
                                                    value={welcomeVideoLink} 
                                                    onChange={(e) => { setWelcomeVideoLink( e.target.value ) }}
                                                    placeholder={"Welcome Video Link"}
                                                    className="form-control"
                                                    onKeyUp={(e) => e.keyCode == 13 && submitWelcomeVideoRewardConfig()}

                                                />
                                                <div className="input-group-append">
                                                    <div className="input-group-text" id="btnGroupAddon"  > <i className="mdi mdi-link"></i>  </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                 
                                    {/* Google authenticator */}
                                    <div className="mb-2  col-12"  >
                                        <div>
                                            <label className="col-form-label">Google Authenticator OTP</label>
                                        </div>
                                        <div className="form-group  ">
                                            <input placeholder="Enter google authenticator OTP" type="text" className="form-control" value={twofaOtp5} onChange={(e) => { setTwofaOtp5(e.target.value = e.target.value.replace(/[^0-9]/g, "").replace(/(\..*)\./g, "$1")) }} onKeyUp={(e) => e.keyCode == 13 && submitWelcomeVideoRewardConfig()} maxLength={6} />
                                        </div>
                                    </div>
                                    <div className=" mb-2 col-12"  >
                                        <div className='d-flex justify-content-end w-100'>
                                            <button type="button" className="btn btn-bordered-primary waves-effect search-btn waves-light loadingButton" onClick={() => submitWelcomeVideoRewardConfig()}>
                                                {welcomeVideoLinkLdr && <Loader />}  Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className={getWelcomeVideoLinkLdr ? "mb-2 mb-2" : "d-none"}>
                                    <div className='d-flex justify-content-center align-items-center w-100'>
                                        <Loader />
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


export default Configuration;