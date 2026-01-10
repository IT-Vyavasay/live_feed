import { NextResponse } from 'next/server';
import { check_admin_login } from "../../../../utils/backend";
import { chk_password, dec, encryption_key, get_timestemp, passDec, passEnc, validate_string } from "../../../../utils/common";
import { sql_query } from "../../../../utils/dbconnect";
export async function POST(req, res) {
    try {

        let adm = await check_admin_login(req)
        if (!adm.status || !adm.data.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 400 })
        } 
        let { userId, newPassword, admPassword } = await req.json()

        try { 
            validate_string(newPassword, "new password")
            chk_password(newPassword)
            validate_string(admPassword, "admin password")
            chk_password(admPassword) 
        } catch (e) {
            return NextResponse.json({ message: e }, { status: 400 })
        }

     
        let admin = await sql_query("select password from tblslr_admin where slrAdminId = ? ", [adm.data.id])
        if (admin && passDec(admin.password, encryption_key("passwordKey")) === admPassword) {
            const user_Id = dec(userId, encryption_key('userId'));
            const EncryptedPassword =  passEnc(newPassword, encryption_key("userPasswordKey")) 
            let now = get_timestemp() 
            await sql_query(`update tbluser set password=?, updatedOn=? where userId =? `, [EncryptedPassword, now, user_Id])

            return NextResponse.json({ message: 'Password changed successfully'  }, { status: 200 })
        } else {
            return NextResponse.json({ message: 'Invalid admin password' }, { status: 400 })
        } 

    } catch (e) {
        console.log(e)
        return NextResponse.json({ message: 'Internal server error' }, { status: 400 })
    }
}