import { signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import Modal from 'react-bootstrap/Modal';
import Loader from "./Loader"



// menuConfig.js

export const menuConfig = [
    {
        title: "Navigation",
        items: [
            {
                path: "/dashboard",
                label: "Dashboard",
                icon: "mdi mdi-view-dashboard",
            },
        ],
    },
    {
        title: "Orders",
        items: [
            {
                path: "/algo/pendingOrderList",
                label: "Pending Order",
                icon: "mdi mdi-account-box-multiple",
            },
        ],
    },
    {
        title: "Orders",
        items: [
            {
                path: "/algo/currentOrderList",
                label: "Current Order",
                icon: "mdi mdi-account-box-multiple",
            },
        ],
    },
    {
        title: "Orders",
        items: [
            {
                path: "/algo/closeOrderList",
                label: "Close Order",
                icon: "mdi mdi-account-box-multiple",
            },
        ],
    },
    {
        title: "Membership",
        items: [
            {
                path: "/membership-plan-list",
                label: "Membership Plan List",
                icon: "mdi mdi-package",
            },
            {
                path: "/user-membership-plan",
                label: "User Membership Plan",
                icon: "mdi mdi-account-box",
            },
        ],
    },
    {
        title: "History",
        items: [
            {
                path: "/notify-email-list",
                label: "Notify Email List",
                icon: "mdi mdi-email",
            },
            {
                path: "/contactus-list",
                label: "Contact List",
                icon: "mdi mdi-phone",
            },
            {
                path: "/voucher-list",
                label: "Voucher List",
                icon: "fa fa-list",
            },
        ],
    },
    {
        title: "Settings",
        items: [
            {
                path: "/faq-list",
                label: "FAQ List",
                icon: "mdi mdi-comment-question-outline",
            },
            {
                path: "/term-and-condition",
                label: "Terms And Condition",
                icon: "mdi mdi-file-document-outline",
            },
            {
                path: "/privacy-policy",
                label: "Privacy Policy",
                icon: "fa fa-user-secret",
            },
            {
                path: "/configuration",
                label: "Configuration",
                icon: "fe-settings",
            },
        ],
    },
]

const groupedMenuConfig = Object.values(
    menuConfig.reduce((acc, curr) => {
        if (!acc[curr.title]) {
            acc[curr.title] = {
                title: curr.title,
                items: [],
            }
        }
        acc[curr.title].items.push(...curr.items)
        return acc
    }, {})
)

const SidebarItem = ({ item, activePath, adminFolder }) => {
    const isActive = activePath === item.path

    return (
        <li className={isActive ? "mm-active" : ""}>
            <Link
                href={`/${adminFolder}${item.path}`}
                className={isActive ? "active" : ""}
            >
                <i className={item.icon}></i>
                <span> {item.label} </span>
            </Link>
        </li>
    )
}

const SidebarMenu = ({ title, items, activePath, adminFolder }) => {
    return (
        <>
            <li className="menu-title">{title}</li>
            {items.map((item, index) => (
                <SidebarItem
                    key={index}
                    item={item}
                    activePath={activePath}
                    adminFolder={adminFolder}
                />
            ))}
        </>
    )
}



const Sidebar = () => {
    const router = useRouter()
    const path_ = usePathname()
    const path = path_.split("/admsolspnl")[1]

    const [show, setShow] = useState(false)
    const [showLoader, setShowLoader] = useState(false)

    const logout = async () => {
        setShowLoader(true)
        await signOut({ redirect: false, callbackUrl: "/" + process.env.ADMFLDR })
        router.push("/" + process.env.ADMFLDR)
    }

    return (
        <>
            <div className="left-side-menu">
                <div className="slimscroll-menu">
                    <div className="user-box text-center">
                        <img
                            src="/assets/images/profile.png"
                            alt="user-img"
                            className="rounded-circle img-thumbnail avatar-md"
                        />
                        <p className="text-muted mt-2">Admin</p>
                        <ul className="list-inline">
                            <li className="list-inline-item">
                                <Link
                                    href={`/${process.env.ADMFLDR}/configuration`}
                                    className="text-muted"
                                >
                                    <i className="mdi mdi-cog"></i>
                                </Link>
                            </li>
                            <li className="list-inline-item">
                                <div
                                    className="cursor-pointer text-logo"
                                    onClick={() => setShow(true)}
                                >
                                    <i className="mdi mdi-power"></i>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div id="sidebar-menu">
                        <ul className="metismenu" id="side-menu">
                            {groupedMenuConfig.map((menu, index) => (
                                <SidebarMenu
                                    key={index}
                                    title={menu.title}
                                    items={menu.items}
                                    activePath={path}
                                    adminFolder={process.env.ADMFLDR}
                                />
                            ))}

                        </ul>
                    </div>

                    <div className="clearfix"></div>
                </div>
            </div>

            <Modal show={show} size="sm">
                <Modal.Body className="text-center">
                    <p className="text-white mb-0">
                        Are you sure you want to logout?
                    </p>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center py-1">
                    <button
                        className="btn btn-bordered-light btn-sm"
                        onClick={() => setShow(false)}
                    >
                        No
                    </button>
                    <button
                        className="btn btn-bordered-primary btn-sm"
                        onClick={logout}
                    >
                        {showLoader ? <Loader /> : ""} Yes
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Sidebar


