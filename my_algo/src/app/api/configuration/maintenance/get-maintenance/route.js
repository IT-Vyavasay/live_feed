

import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { check_admin_login } from "../../../../../utils/backend";
import path from "path";
const fs = require('fs');
export async function GET(req, res) {
    draftMode().enable()
    try { 
        let adm = await check_admin_login(req)
        if (!adm.status || !adm.data.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
        }
        const filePath = path.join(process.env.MAINTENANCE_FILE_PATH, "maintenance-status.json");
        let jsonObject;
        try {
            let getObject = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' })
             jsonObject = getObject ? JSON.parse(getObject) : {}  
        } catch (error) {
            console.log("first error", error);
            return NextResponse.json({ message: `File not exist` }, { status: 400 });
        } 
        return NextResponse.json({maintananceStatus: jsonObject.status }, { status: 200 });
    } catch (error) {
        console.log("Error==>", error)
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}