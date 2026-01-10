import { NextResponse } from "next/server";
import { check_admin_login } from "../../../../utils/backend";
import { validate_filter_numbers, validate_string } from "../../../../utils/common";
import { sql_query } from "../../../../utils/dbconnect";

export async function POST(req, res) {
    try {
        let adm = await check_admin_login(req)
        if (!adm.status || !adm.data.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
        }
        let { question, answer, faq_id, status } = await req.json()

        if (!faq_id) {
            return NextResponse.json({ message: 'Something went to wrong, Please refresh page' }, { status: 500 })
        }

        let query = '', filter = []
        if (validate_filter_numbers([status])) {
            query = "UPDATE tblslr_faq SET status = ? "
            filter.push(status)
        }
        else {
            try {
                validate_string(question, "Question")
                validate_string(answer, "Answer")
            } catch (e) {
                return NextResponse.json({ message: e }, { status: 400 })
            }
            query = "UPDATE tblslr_faq SET question = ? , answer = ? "
            filter.push(question)
            filter.push(answer)

        }
        filter.push(faq_id)
        await sql_query(`${query} WHERE md5(slr_faqId) = ?`, filter)
        return NextResponse.json({ message: "FAQ updated successfully" }, { status: 200 })
    } catch (error) {
        console.log("update Faq error->", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 400 })

    }
}