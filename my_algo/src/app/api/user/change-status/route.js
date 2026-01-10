import { NextResponse } from 'next/server';
import { check_admin_login } from "../../../../utils/backend";
import { dec, encryption_key, get_timestemp, validate_input_number_zero_or_one } from "../../../../utils/common";
import { sql_query } from "../../../../utils/dbconnect";
export async function POST(req, res) {
    try {

        let adm = await check_admin_login(req)
        if (!adm.status || !adm.data.id) {

            return NextResponse.json({ message: "Unauthorized" }, { status: 400 })
        }


        let { userId, status } = await req.json()

        try {
            validate_input_number_zero_or_one(`${status}`, `status`)
        } catch (e) {
            return NextResponse.json({ message: e }, { status: 400 })
        }
        const user_Id = dec(userId, encryption_key('userId'));



        let user_data = await sql_query(`select userId,status from tbluser where userId = ? `, [user_Id])

        if (user_data) {
            if (status === 0 && user_data.status === 0) {
                return NextResponse.json({ message: "User already deactivated" }, { status: 400 })
            } else if (status === 1 && user_data.status === 1) {
                return NextResponse.json({ message: "User already activated" }, { status: 400 })
            } else if (status === 2 && user_data.status === 2) {
                return NextResponse.json({ message: "User already blocked" }, { status: 400 })
            } else {
                let now = get_timestemp()
                await sql_query(`update tbluser set status=?, updatedOn=? where userId =? `, [status, now, user_data.userId])
                return NextResponse.json({ message: `User ${status == 1 ? 'activated' : 'deactivated'} successfully` }, { status: 200 })
            }
        }

        return NextResponse.json({ message: 'Service temporary unavailable' }, { status: 400 })
    } catch (e) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 400 })
    }
}