import { NextResponse } from 'next/server';
import { check_admin_login } from "../../../../utils/backend";
import { chk_otp, chk_password, encryption_key, get_timestemp, passDec, passEnc, validate_string } from "../../../../utils/common";
import { sql_query } from "../../../../utils/dbconnect";
import speakeasy from "speakeasy"
export async function POST(req, res) {
    try {

        let adm = await check_admin_login(req)
        if (!adm.status || !adm.data.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 400 })
        } 
        let {  newPassword, currentPassword,otp } = await req.json()

        try { 
            validate_string(currentPassword, "current password")
            chk_password(currentPassword) 
            validate_string(newPassword, "new password")
            chk_password(newPassword)
            chk_otp(otp)
        } catch (e) {
            return NextResponse.json({ message: e }, { status: 400 })
        }

     
        let admin = await sql_query("select password, twoFaCode from tblslr_admin where slrAdminId = ? ", [adm.data.id])
        if (admin && passDec(admin.password, encryption_key("passwordKey")) === currentPassword) {
          
            const EncryptedPassword =  passEnc(newPassword, encryption_key("passwordKey")) 
            let now = get_timestemp()  
        
            let twofa = speakeasy.totp.verify({
                secret: passDec(admin.twoFaCode, encryption_key("twofaKey")),
                encoding: "base32",
                token: otp
            })
            if (twofa) { 
                await sql_query(`update tblslr_admin set password=?, updatedOn=? where slrAdminId =? `, [EncryptedPassword, now, adm.data.id])
                return NextResponse.json({ message: 'Password changed successfully'  }, { status: 200 })
            } else {
                return NextResponse.json({ message: 'Google authentication failed' }, { status: 400 })
            } 
        } else {
            return NextResponse.json({ message: 'Invalid current password' }, { status: 400 })
        } 

    } catch (e) {
        console.log(e)
        return NextResponse.json({ message: 'Internal server error' }, { status: 400 })
    }
}