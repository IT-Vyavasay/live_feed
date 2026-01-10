import { NextResponse } from 'next/server';
import { check_admin_login } from "../../../../../utils/backend";
import { sql_query } from "../../../../../utils/dbconnect";
import { draftMode } from 'next/headers';
export async function GET(req, res) {
    draftMode().enable()
    try {
        let adm = await check_admin_login(req)
        if (!adm.status || !adm.data.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 400 })
        } 
        let configuration_data = await sql_query("select metaValue from tblslr_config where metaKey = ? ", ["welcomeVideoLink"])

        return NextResponse.json({ welcomeVideoLink:configuration_data?.metaValue?configuration_data?.metaValue:"" }, { status: 200 })

    } catch (e) {
        console.log("Error=>", e);
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
}


 