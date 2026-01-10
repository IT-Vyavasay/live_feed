import { NextResponse } from 'next/server';
import { check_admin_login } from "../../../../../utils/backend";
import {  chk_otp, encryption_key, passDec, validate_config_number  } from "../../../../../utils/common";
import { sql_query } from "../../../../../utils/dbconnect";
import speakeasy from "speakeasy"
export async function POST(req, res) {
    try {

        let adm = await check_admin_login(req)
        if (!adm.status || !adm.data.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 400 })
        } 
        let {  metaValue, metaKey,otp } = await req.json()

        try {  
            const parseData =  JSON.parse(metaValue)   
            validate_config_number(parseData[0], "Level 1") 
            validate_config_number(parseData[1], "Level 2")
            validate_config_number(parseData[2], "Level 3")
            validate_config_number(parseData[3], "Level 4")
            validate_config_number(parseData[4], "Level 5")
            validate_config_number(parseData[5], "Level 6")  

            const RewardSum = parseFloat(parseData[0]) + parseFloat(parseData[1]) + parseFloat(parseData[2]) + parseFloat(parseData[3]) + parseFloat(parseData[4]) + parseFloat(parseData[5]) 
            if (RewardSum>100) {
                throw "Reward Perc(%) should be less than or equal to 100%"
            }
            chk_otp(otp)

        } catch (e) {
            console.log("error",e)
            return NextResponse.json({ message: e }, { status: 400 })
        }

     
        let admin = await sql_query("select twoFaCode from tblslr_admin where slrAdminId = ? ", [adm.data.id])  
            
        
            let twofa = speakeasy.totp.verify({
                secret: passDec(admin.twoFaCode, encryption_key("twofaKey")),
                encoding: "base32",
                token: otp
            })
            if (twofa) { 
                
                let isMetakey = await sql_query("select 1 from tblslr_config where metaKey = ? ", [metaKey])  
                if (isMetakey) {
                    await sql_query(`update tblslr_config set metaValue=? where metaKey =? `, [metaValue, metaKey])
                    return NextResponse.json({ message: 'Uniplan reward config updated successfully'  }, { status: 200 })
                } else {
                    await sql_query("insert into tblslr_config (metaKey,metaValue) values (?,?)", [metaKey, metaValue]) 
                    return NextResponse.json({ message: 'Uniplan reward config added successfully'  }, { status: 200 })
                } 
               
            } else {
                return NextResponse.json({ message: 'Google authentication failed' }, { status: 400 })
            } 
         

    } catch (e) {
        console.log(e)
        return NextResponse.json({ message: 'Internal server error' }, { status: 400 })
    }
}

 
