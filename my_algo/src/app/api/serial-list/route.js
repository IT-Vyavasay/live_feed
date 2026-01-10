import { draftMode } from "next/headers";
import { check_admin_login } from "../../../utils/backend";
import { sql_query } from "../../../utils/dbconnect";
import { NextResponse } from "next/server";


export async function GET(req, res) {
    draftMode().enable()
    try {
        let adm = await check_admin_login(req)
        if (!adm.status || !adm.data.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
        }

        const serialList = await sql_query(`SELECT md5(serialId) as serialId, name FROM tblserial`, [], "Multi")
        return NextResponse.json({ data: serialList, }, { status: 200 })
    } catch (error) {
        console.log("error serial list->", e)
        return NextResponse.json({ message: "Something went wrong" }, { status: 400 })
    }
}