import { NextResponse } from 'next/server';
import { check_admin_login } from '../../../utils/backend';
import { draftMode } from 'next/headers'
import { sql_query } from '../../../utils/dbconnect';


export async function GET(req, res) {
    draftMode().enable()
    try {
        let adm = await check_admin_login(req)
        if (!adm.status || !adm.data.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
        }

        const usersData = await sql_query(`SELECT COUNT(*) AS totalUsers,
             COUNT(CASE WHEN status = ? THEN 1 END) AS activeUsers ,
             COUNT(CASE WHEN status = ? THEN 1 END) AS deactiveUsers
             FROM tbluser`, [1, 0], )
        const vouchersData = await sql_query(`SELECT COUNT(*) AS totalVouchers,
             COUNT(CASE WHEN isRedeem = ? THEN 1 END) AS totalRedeem ,
             COUNT(CASE WHEN createdFrom = ? THEN 1 END) AS totalNFT21 ,
             COUNT(CASE WHEN createdFrom = ? THEN 1 END) AS totalSolaresPreReg ,
             COUNT(CASE WHEN createdFrom = ? THEN 1 END) AS totalSolaresAdmin
            FROM tblvoucher`, [1, 0, 1, 2], )

        const membershipData = await sql_query(`SELECT COUNT (*) AS totalMemberships,
            SUM(CASE WHEN coinType=? THEN coinAmount END) as totalUSDT,
            SUM(CASE WHEN coinType=? THEN coinAmount END) as totalBXN
            FROM tblslr_userMembershipPlan`, [0, 1], )


        let data = { usersData , vouchersData, membershipData }
        return NextResponse.json({ data }, { status: 200 })
    } catch (e) {
        console.log("Dashboard----->", e)
        return NextResponse.json({ message: "Something went wrong" }, { status: 400 })
    }

}