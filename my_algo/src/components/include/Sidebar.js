import { signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import Modal from 'react-bootstrap/Modal';
import Loader from "./Loader"


const Sidebar = () => {
    const router = useRouter()
    const path_ = usePathname()
    const path = path_.split('/admsolspnl')[1];

    const [show, setShow] = useState(false);
    const [showLoader, setShowLoader] = useState(false)

    const logout = async () => {
        setShowLoader(true)
        const data = await signOut({ redirect: false, callbackUrl: '/' + process.env.ADMFLDR })
        router.push('/' + process.env.ADMFLDR)
    }
    return (
        <>
            <div className="left-side-menu">
                <div className="slimscroll-menu">
                    <div className="user-box text-center">
                        <img src="/assets/images/profile.png" alt="user-img" title="Mat Helme" className="rounded-circle img-thumbnail avatar-md" />
                        <p className="text-muted mt-2">Admin</p>
                        <ul className="list-inline">
                            <li className="list-inline-item">
                                <Link href={`/${process.env.ADMFLDR}/configuration`} className="text-muted">
                                    <i className="mdi mdi-cog"></i>
                                </Link>
                            </li>
                            <li className="list-inline-item">
                                <div className="cursor-pointer text-logo" onClick={() => { setShow(true) }}>
                                    <i className="mdi mdi-power"></i>
                                </div>
                            </li>
                        </ul>
                    </div>


                    <div id="sidebar-menu">
                        <ul className="metismenu" id="side-menu">

                            <li className="menu-title">Navigation</li>
                            <li className={`${path == "/dashboard" ? "mm-active" : ""}`}>
                                <Link href={`/${process.env.ADMFLDR}/dashboard`} className={`${path == '/dashboard' ? 'active' : ''}`} >
                                    <i className="mdi mdi-view-dashboard"></i>
                                    <span> Dashboard </span>
                                </Link>
                            </li>


                            <li className="menu-title">Manage User</li>
                            <li className={`${path == "/userlist" ? "mm-active" : ""}`}>
                                <Link href={`/${process.env.ADMFLDR}/userlist`} className={`${path == '/userlist' ? 'active' : ''}`} >
                                    <i className="mdi mdi-account-box-multiple"></i>
                                    <span> User List </span>
                                </Link>
                            </li>


                            <li className="menu-title">Membership</li>
                            <li className={`${path == "/membership-plan-list" ? "mm-active" : ""}`}>
                                <Link href={`/${process.env.ADMFLDR}/membership-plan-list`} className={`${path == '/membership-plan-list' ? 'active' : ''}`} >
                                    <i className="mdi mdi-package"></i>
                                    <span> Membership Plan List </span>
                                </Link>
                            </li>
                            <li className={`${path == "/user-membership-plan" ? "mm-active" : ""}`}>
                                <Link href={`/${process.env.ADMFLDR}/user-membership-plan`} className={`${path == '/user-membership-plan' ? 'active' : ''}`} >
                                    <i className="mdi mdi-account-box"></i>
                                    <span>User Membership Plan </span>
                                </Link>
                            </li>

                            <li className="menu-title">History</li>
                            <li className={`${path == "/notify-email-list" ? "mm-active" : ""}`}>
                                <Link href={`/${process.env.ADMFLDR}/notify-email-list`} className={`${path == '/notify-email-list' ? 'active' : ''}`} >
                                    <i className="mdi mdi-email"></i>
                                    <span>  Notify Email List </span>
                                </Link>
                            </li>
                            <li className={`${path == "/contactus-list" ? "mm-active" : ""}`}>
                                <Link href={`/${process.env.ADMFLDR}/contactus-list`} className={`${path == '/contactus-list' ? 'active' : ''}`} >
                                    <i className="mdi mdi-phone"></i>
                                    <span>  Contact List </span>
                                </Link>
                            </li>
                            <li className={`${path == "/voucher-list" ? "mm-active" : ""}`}>
                                <Link href={`/${process.env.ADMFLDR}/voucher-list`} className={`${path == '/voucher-list' ? 'active' : ''}`} >
                                    <i className="fa fa-list"></i>
                                    <span>  Voucher List </span>
                                </Link>
                            </li>



                            <li className="menu-title">Settings</li>
                            <li className={`${path == "/faq-list" ? "mm-active" : ""}`}>
                                <Link href={`/${process.env.ADMFLDR}/faq-list`} className={`${path == '/faq-list' ? 'active' : ''}`} >
                                    <i className="mdi mdi-comment-question-outline"></i>
                                    <span>  FAQ List </span>
                                </Link>
                            </li>

                            <li className={`${path == "/term-and-condition" ? "mm-active" : ""}`}>
                                <Link href={`/${process.env.ADMFLDR}/term-and-condition`} className={`${path == '/term-and-condition' ? 'active' : ''}`} >
                                    <i className="mdi mdi-file-document-outline"></i>
                                    <span>  Terms And Condition </span>
                                </Link>
                            </li>

                            <li className={`${path == "/privacy-policy" ? "mm-active" : ""}`}>
                                <Link href={`/${process.env.ADMFLDR}/privacy-policy`} className={`${path == '/privacy-policy' ? 'active' : ''}`} >
                                    <i className="fa fa-user-secret"></i>
                                    <span> Privacy Policy </span>

                                </Link>
                            </li>

                            <li className={`${path == "/configuration" ? "mm-active" : ""}`}>
                                <Link href={`/${process.env.ADMFLDR}/configuration`} className={`${path == '/configuration' ? 'active' : ''}`} >
                                    <i className="fe-settings"></i>
                                    <span>  Configuration </span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="clearfix"></div>
                </div>
            </div>

            <Modal show={show} className='' size="sm">
                <Modal.Body className='text-center'>
                    <p className="text-white mb-0">Are you sure you want to logout?</p>
                </Modal.Body>
                <Modal.Footer className='d-flex justify-content-center py-1'>
                    <button className='btn btn-bordered-light waves-effect btn-sm waves-light' onClick={() => setShow(false)}>No</button>
                    <button className='btn btn-bordered-primary waves-effect btn-sm waves-light' onClick={() => logout()}>{showLoader ? <Loader /> : ''} Yes</button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default Sidebar


