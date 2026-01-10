
import { NextResponse } from "next/server";
import path from "path";
import { check_admin_login } from "../../../../../utils/backend";
import { chk_otp, encryption_key, passDec, validate_input_number_zero_or_one } from "../../../../../utils/common";
const fs = require('fs');
import speakeasy from "speakeasy"
import { sql_query } from "../../../../../utils/dbconnect";
export async function POST(req, res) {
    try {

        let adm = await check_admin_login(req)
        if (!adm.status || !adm.data.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
        }
        let { status, otp } = await req.json()
        try {
            validate_input_number_zero_or_one(`${status}`, `maintainence status`)
            chk_otp(otp)
        } catch (e) {
            return NextResponse.json({ message: e }, { status: 400 })
        }
        let admin = await sql_query("select twoFaCode from tblslr_admin where slrAdminId = ? ", [adm.data.id])
        let twofa = speakeasy.totp.verify({
            secret: passDec(admin.twoFaCode, encryption_key("twofaKey")),
            encoding: "base32",
            token: otp
        })
        if (twofa) {
            const filePath = path.join(process.env.MAINTENANCE_FILE_PATH, "maintenance-status.json"); 
            const content = { status: status };
            const jsonData = JSON.stringify(content, null, 2);
            fs.writeFile(filePath, jsonData, 'utf8', (err) => {
                if (err) {
                    throw err;
                }
            });


            return NextResponse.json({ message: `Maintenance status has been changed successfully` }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Google authentication failed' }, { status: 400 })
        }


    } catch (error) {
        console.log("Error==>", error)
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}