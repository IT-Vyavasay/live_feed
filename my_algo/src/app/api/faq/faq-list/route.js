import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { validate_filter_numbers, validate_filter_strings } from "../../../../utils/common";
import { sql_query } from "../../../../utils/dbconnect";
import { check_admin_login } from "../../../../utils/backend";

export async function GET(req, res) {
    draftMode().enable()
    try {
        const params = Object.fromEntries(new URLSearchParams(req.nextUrl.search).entries());
        const { startDate, endDate, search } = params
        let adm = await check_admin_login(req)
        if (!adm.status || !adm.data.id) {
            return NextResponse.json({ message: 'Something went to wrong, Please refresh page' }, { status: 500 })
        }
        let query = "", filter = []
        query += `SELECT md5(slr_faqId) as slr_faqId ,question , answer, status, createdOn FROM tblslr_faq `

        if (validate_filter_numbers([startDate, endDate])) {
            query += ` WHERE createdOn >= ? AND createdOn <= ?`
            filter.push(startDate)
            filter.push(endDate)
        }
        if (validate_filter_strings([search])) {
            query += " AND (question like ? )";
            filter.push('%' + search.trim() + '%');
        }
        query += " ORDER BY createdOn DESC"


        const getFaqList = await sql_query(query, filter, "Multi")
        return NextResponse.json({ data: getFaqList || [] }, { status: 200 })

    } catch (error) {
        console.log("error while getting faq list==>", error)
        return NextResponse.json({ message: error.message }, { status: 400 });
    }

}