import { NextResponse } from 'next/server';
import { check_admin_login } from "../../../../utils/backend";
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
        let user_data = await sql_query(`select u.userId,ud.isTwoFa from tbluser as u ,tbluserDetailOfSolares as ud where u.userId=ud.userId and u.userId = ? `, [user_Id])

        if (user_data) {
            if (user_data.isTwoFa == 0) {
                return NextResponse.json({ message: "Two factor already disable for this user" }, { status: 400 })
            } else {
                let now = get_timestemp()
                await sql_query(`update tbluserDetailOfSolares set isTwoFa=?, twoFaCode=?, updatedOn=? where  userId =? `, [0, null, now, user_data?.userId])
                return NextResponse.json({ message: `Google authenticator disabled successfully` }, { status: 200 })
            }
        }

        return NextResponse.json({ message: 'Service temporary unavailable' }, { status: 400 })
    } catch (e) {
        console.log("error", e)
        return NextResponse.json({ message: 'Internal server error' }, { status: 400 })
    }
}