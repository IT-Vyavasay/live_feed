'use client'
import Link from "next/link"
import { signOut } from 'next-auth/react'
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Modal from 'react-bootstrap/Modal';
import Loader from "./Loader"

export default function Header() {
  const router = useRouter()
  const [show, setShow] = useState(false);
  const [showLoader, setShowLoader] = useState(false)

  const logout = async () => {
    setShowLoader(true)
    const data = await signOut({ redirect: false, callbackUrl: '/' + process.env.ADMFLDR })
    router.push('/' + process.env.ADMFLDR)
  }

  const _path = usePathname();
  const path = _path.split('/').pop();
  const [pageName, setPageName] = useState("");



  useEffect(() => {
    const pageNames = {
      'dashboard': 'DashBoard',
      'userlist': 'Manage User',
    };
    setPageName(pageNames[path] || "");
  }, [_path]);

  return (
    <>
      <div className="navbar-custom">
        <ul className="list-unstyled topnav-menu float-right mb-0">

          <li className="dropdown notification-list">
            <a className="nav-link dropdown-toggle nav-user mr-0 waves-effect" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
              <img src="/assets/images/profile.png" alt="user-image" className="rounded-circle" />
              <span className="pro-user-name ml-1">
                Admin <i className="mdi mdi-chevron-down"></i>
              </span>
            </a>
            <div className="dropdown-menu dropdown-menu-right profile-dropdown ">

              <Link href="" onClick={() => { setShow(true) }} className="dropdown-item notify-item">
                <i className="fe-log-out"></i>
                <span >Logout</span>
              </Link>

            </div>
          </li>
        </ul>

        <div className="logo-box">
          <Link href={process.env.ADMFLDR + "dashboard"} className="logo logo-dark text-center">
            <span className="logo-lg">
              <img src="/assets/images/logo/logo.svg" alt="logo" className="sidebar-logo" />
            </span>
            <span className="logo-sm">
              <img src="/assets/images/logo/logo.svg" alt="logo" className="sidebar-logo" />
            </span>
          </Link>
          <Link href={process.env.ADMFLDR + "dashboard"} className="logo logo-light text-center">
            <span className="logo-lg">
              <img src="/assets/images/logo/logo.svg" alt="logo" className="sidebar-logo" />
            </span>
            <span className="logo-sm">
              <img src="/assets/images/logo/logo.svg" alt="logo" className="sidebar-logo" />
            </span>
          </Link>
        </div>

        <ul className="list-unstyled topnav-menu topnav-menu-left mb-0">
          <li>
            <button className="button-menu-mobile disable-btn waves-effect">
              <i className="fe-menu"></i>
            </button>
          </li>

          {/* <li>
            <h3 className="page-title-main">{pageName}</h3>
          </li> */}

        </ul>

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