
import { NextResponse } from "next/server";
import { check_admin_login } from "../../../../utils/backend";
import { get_timestemp, validate_string } from "../../../../utils/common";
import { sql_query } from "../../../../utils/dbconnect";

export async function POST(req, res) {
    try {
        let adm = await check_admin_login(req)
        if (!adm.status || !adm.data.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
        }
        let { question, answer } = await req.json()
        try {
            validate_string(question, "Question")
            validate_string(answer, "Answer")
        } catch (e) {
            return NextResponse.json({ message: e }, { status: 400 })
        }
        const now = get_timestemp()
        await sql_query(`INSERT INTO tblslr_faq (question, answer, createdOn) VALUES (?, ?, ?)`, [question, answer, now])
        return NextResponse.json({ message: "FAQ added successfully" }, { status: 200 })

    } catch (error) {
        console.log("add Faq error->", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 400 })

    }
}