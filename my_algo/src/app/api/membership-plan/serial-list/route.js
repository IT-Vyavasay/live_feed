

import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { check_admin_login } from "../../../../utils/backend";
import { enc, encryption_key } from "../../../../utils/common";
import { sql_query } from "../../../../utils/dbconnect";

export async function GET(req, res) {
    draftMode().enable()

    try {
        let adm = await check_admin_login(req)
        if (!adm.status || !adm.data.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
        }
        let serialdata = await sql_query(`SELECT serialId, name FROM tblserial where status = ? ORDER BY serialId DESC`, [1], "Multi");
        let data = []
        if (serialdata.length > 0) {
            data = serialdata.map((j) => ({
                ...j,
                serialId: enc(String(j.serialId), encryption_key('serialId'))
            }));
        }
        return NextResponse.json({ serial: data ? data : [] }, { status: 200 });
    } catch (error) {
        console.log("Error==>", error)
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}