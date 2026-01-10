

import { draftMode } from "next/headers";
import { NextResponse } from "next/server";  
import {validate_filter_numbers, validate_filter_strings } from "../../../utils/common";
import { check_admin_login } from "../../../utils/backend";
import { sql_query } from "../../../utils/dbconnect";

export async function GET(req, res) {
    draftMode().enable()
    try {
        const params = Object.fromEntries(new URLSearchParams(req.nextUrl.search).entries());
        const {  startDate, endDate, orderColumn, order, page, search   } = params;

        let adm = await check_admin_login(req)
        if (!adm.status || !adm.data.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
        }
        let query = "", filter = [], limit = process.env.PAGELIMIT;
        query += `SELECT p.email, p.createdOn FROM tblslr_emailSubscribtionList as p`

        let fields = [
            "p.createdOn",
            "p.email",
            "p.createdOn"
        ];
        if (validate_filter_numbers([startDate, endDate])) {
            query += ` WHERE p.createdOn >= ? AND p.createdOn<= ?`;
            filter.push(startDate);
            filter.push(endDate);
        }

        if (validate_filter_strings([search])) {
            query += " AND (p.email like ? )";
            filter.push('%' + search.trim() + '%');
        }
        if (validate_filter_numbers([orderColumn, order])) {
            query += " order by " + fields[orderColumn] + " " + (order == 0 ? 'asc' : 'desc')
        } 
        let countData = await sql_query(query, filter, 'Count')
        query += "  limit ? , ?"

        filter.push(page * limit)
        filter.push(parseInt(limit))

        let notifyEmailList = await sql_query(query, filter, "multi")
        let count = Math.ceil(countData / limit), allData = [], ascNum = page * limit, descNum = countData - page * limit;

        const emailLists = JSON.parse(JSON.stringify(notifyEmailList));

        if (emailLists.length > 0) {
            allData = emailLists.map((j, k) => {

                return {
                    num: order == 1 ? ++ascNum : descNum--,
                    email: j.email ? j.email : '',
                    createdOn: j.createdOn,
                }
            })
        }

        return NextResponse.json({ data: allData ? allData : [], total: count ? count : 0 }, { status: 200 });
    } catch (error) {
        console.log("Error==>", error)
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}