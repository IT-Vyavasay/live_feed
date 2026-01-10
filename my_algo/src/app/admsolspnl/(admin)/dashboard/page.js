"use client"
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useAuthContext } from '../../../../context/auth'
import { fetchApi } from '../../../../utils/frondend'
import Table_Loader from '../../../../components/include/TableLoader'



export default function Dashboard() {
    const { setAuthTkn, setPageLoader } = useAuthContext()
    const [loader, setLoader] = useState(false)
    const [dashData, setDashData] = useState({})
    const getDashboardData = async () => {
        if (!loader) {
            setLoader(true)
            const stakingdata = JSON.stringify({ a: 0 })
            const response = await fetchApi("dashboard", stakingdata, "GET")
            setPageLoader(false)
            if (response.statusCode == 200) {
                setPageLoader(false)
                setDashData(response.data.data)
            } else {
                if (response.data.message == "Unauthorized") {
                    setAuthTkn(response.data.message)
                } else {
                    toast.error(response.data.message)
                }
            }
            setLoader(false)
        }

    }

    useEffect(() => {
        getDashboardData()
    }, [])


    return (<>
        <div className="content-body btn-page">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="container-fluid p-4">
                <div className="row">
                    <h3 className="page-title-main">Dashboard</h3>
                </div>
                {
                    loader ?
                        <div className={`disableTbl m-auto`}>
                            <Table_Loader /> </div> :
                        <>  <div className="mt-4 configuration-card">
                            <div className='row'>
                                <div className='col-12 col-xl-4'>
                                    <div className='card d p-3 '>
                                        <div className='d-flex'>
                                            <div className='mr-3'>
                                                <span className='fa fa-user dashboard-card-icon ' />
                                            </div>
                                            <div>
                                                <h4>All Users</h4>
                                                <h3>{dashData?.usersData?.totalUsers || 0}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 col-md-6 col-xl-4 '>
                                    <div className='card d p-3 '>
                                        <div className='d-flex'>
                                            <div className='mr-3'>
                                                <span className='fa fa-user-check dashboard-card-icon px-1 ' />
                                            </div>
                                            <div>
                                                <h4 className=''>Active Users</h4>
                                                <h3 className='text-success'>{dashData?.usersData?.activeUsers || 0}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 col-md-6 col-xl-4'>
                                    <div className='card d p-3 '>
                                        <div className='d-flex'>
                                            <div className='mr-3'>
                                                <span className='fa fa-user-slash dashboard-card-icon px-1' />
                                            </div>
                                            <div>
                                                <h4 className='text-nowrap'>Deactive Users</h4>
                                                <h3 className='text-danger'>{dashData?.usersData?.deactiveUsers || 0}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>

                            {/* vouchers */}
                            <div className=''>
                                <div className="card mt-2 mb-3 configuration-card">
                                    <div className='card-header d-flex align-items-center '>
                                        <span className='fa fa-money-check  dashboard-voucher-icon' />
                                        <h3>Vouchers</h3>
                                    </div>
                                    <div className='card-body'>
                                        <div className='row'>
                                            <div className='col-12 col-md-6 dashboard-card-main-border'>
                                                <h3 className='dashboard-card-subtitle'>Redeem Details</h3>

                                                <div className='row db-voucher-card'>
                                                    <div className='col-12 col-xl-6 text-start text-xl-center dashboard-card-sub-border'>
                                                        <div>
                                                            <h4 className="">Total Vouchers</h4>
                                                            <h3 className='text-muted'>{dashData?.vouchersData?.totalVouchers || 0}</h3>
                                                        </div>
                                                    </div>
                                                    <div className='col-12 col-xl-6 text-start text-xl-center '>
                                                        <div>
                                                            <h4 className="">Redeem</h4>
                                                            <h3 className='text-muted'>{dashData?.vouchersData?.totalRedeem || 0}</h3>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className='col-12 col-md-6 '>
                                                <h3 className='dashboard-card-subtitle'>Created From</h3>
                                                <div className='row db-voucher-card'>

                                                    <div className='col-12 col-xl-3 text-start text-xl-center dashboard-card-sub-border'>
                                                        <div>
                                                            <h4 className="">NFT 21 Admin</h4>
                                                            <h3 className='text-muted'>{dashData?.vouchersData?.totalNFT21 || 0}</h3>
                                                        </div>
                                                    </div>
                                                    <div className='col-12 col-xl-6 text-start text-xl-center dashboard-card-sub-border'>
                                                        <div>
                                                            <h4 className="">Solares Pre-Registration Package</h4>
                                                            <h3 className='text-muted'>{dashData?.vouchersData?.totalSolaresPreReg || 0}</h3>
                                                        </div>
                                                    </div>
                                                    <div className=' col-12 col-xl-3 text-start text-xl-center '>
                                                        <div>
                                                            <h4 className="">Solares Admin</h4>
                                                            <h3 className='text-muted'>{dashData?.vouchersData?.totalSolaresAdmin || 0}</h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div></div>

                            <div className=" mb-5">
                                <div className=''>
                                    <div className="card mt-4  configuration-card">
                                        <div className='card-header d-flex align-items-center '>
                                            <span className='fa fa-wallet  dashboard-voucher-icon' />
                                            <h3>Purchased Membership Plan</h3>
                                        </div>
                                        <div className='card-body'>
                                            <div className='row '>
                                                <div className='col-12 col-md-4  text-start text-xl-center dashboard-card-sub-border'>
                                                    <div>
                                                        <h4 className="">Total Purchased</h4>
                                                        <h3 className='text-muted'>{dashData?.membershipData?.totalMemberships || 0}</h3>
                                                    </div>
                                                </div>
                                                <div className='col-12 col-md-4  text-start text-xl-center dashboard-card-sub-border'>
                                                    <div>
                                                        <h4 className="">Total USDT</h4>
                                                        <h3 className='text-muted'>{dashData?.membershipData?.totalUSDT || 0} USDT</h3>
                                                    </div>
                                                </div>
                                                <div className=' col-12 col-md-4  text-start text-xl-center '>
                                                    <div>
                                                        <h4 className=""> Total BXN</h4>
                                                        <h3 className='text-muted'>{dashData?.membershipData?.totalBXN || 0} BXN</h3>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </>
                }



            </div>
        </div>
    </>)
}
