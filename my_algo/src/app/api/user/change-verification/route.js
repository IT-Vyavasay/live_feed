import { NextResponse } from 'next/server';
import { check_admin_login, sendVarificationMail } from "../../../../utils/backend";
import { dec, encryption_key, get_timestemp } from "../../../../utils/common";
import { sql_query } from "../../../../utils/dbconnect";
export async function POST(req, res) {

    try {

        let adm = await check_admin_login(req)
        if (!adm?.status || !adm?.data?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 400 })
        }


        let { userId } = await req.json()

        const user_Id = dec(userId, encryption_key('userId'));

        let user_data = await sql_query(`select userId,email,isVerify from tbluser where userId = ? `, [user_Id])

        if (user_data) {

            let now = get_timestemp()
            await sql_query(`update tbluser set isVerify=?, updatedOn=? where userId =? `, [1, now, user_data?.userId])
            
            await sendVarificationMail(user_data?.email, 'Account Verification');

            return NextResponse.json({ message: `User verified successfully` }, { status: 200 })

        }

        return NextResponse.json({ message: 'Service temporary unavailable' }, { status: 400 })
    } catch (e) {
        console.log("error", e)
        return NextResponse.json({ message: 'Internal server error' }, { status: 400 })
    }
}