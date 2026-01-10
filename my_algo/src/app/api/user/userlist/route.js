

import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { check_admin_login } from "../../../../utils/backend";
import { enc, encryption_key, validate_filter_numbers, validate_filter_strings } from "../../../../utils/common";
import { sql_query } from "../../../../utils/dbconnect";

export async function GET(req, res) {
    draftMode().enable()
    try {
        const params = Object.fromEntries(new URLSearchParams(req.nextUrl.search).entries());
        const { status, orderColumn, order = 1, page, startDate, endDate, search, verify, siteType } = params;

        let adm = await check_admin_login(req)
        if (!adm.status || !adm.data.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
        }
        let query = "", filter = [], limit = process.env.PAGELIMIT;
        query += `SELECT userId , username, email ,status, isVerify , lastLoginIp , lastLoginDate , createdOn , siteType  from tbluser as u `


        if (validate_filter_numbers([startDate, endDate])) {
            query += ` where createdOn >= ? AND createdOn<= ?`;
            filter.push(startDate);
            filter.push(endDate);
        }

        if (validate_filter_strings([status])) {
            query += " AND status= ? "
            filter.push(status)
        }

        if (validate_filter_strings([siteType])) {
            query += " AND siteType= ? "
            filter.push(siteType)
        }

        if (validate_filter_strings([search])) { query += " AND (email like ? or username like ? )"; filter.push('%' + search.trim() + '%'); filter.push('%' + search.trim() + '%') }

        if (validate_filter_strings([verify])) {
            query += " AND isVerify= ?"
            filter.push(verify)
        }

        let fields = [
            "createdOn",
            "userName",
            "email",
            "lastLoginIp",
            "lastLoginDate",
            "status",
            "isVerify",
            "createdOn",
            "siteType"

        ];
        if (validate_filter_numbers([orderColumn, order])) {
            query += " order by " + fields[orderColumn] + " " + (order == 0 ? 'asc' : 'desc')
        }
        let countData = await sql_query(query, filter, 'Count')
        query += "  limit ? , ?"

        filter.push(page * limit)
        filter.push(parseInt(limit))

        let userList = await sql_query(query, filter, "multi")
        let count = Math.ceil(countData / limit), allData = [], ascNum = page * limit, descNum = countData - page * limit;

        const users = JSON.parse(JSON.stringify(userList));

        if (users.length > 0) {
            let get_userName = await sql_query(`SELECT isTwoFa, userId FROM tbluserDetailOfSolares`, [], "Multi")

            allData = users.map((j, k) => {
                let userIndex = get_userName && get_userName.findIndex((x) => x.userId == j.userId)

                return {
                    num: order == 1 ? ++ascNum : descNum--,
                    id: j.userId ? enc(j.userId.toString(), encryption_key("ids")) : "",
                    userName: j.username ? j.username : '-',
                    email: j.email ? j.email : '-',
                    status: j.status,
                    isTwoFa: userIndex != -1 ? get_userName[userIndex]['isTwoFa'] : "0",
                    isVerify: j.isVerify,
                    createdOn: j.createdOn,
                    lastLoginIp: j.lastLoginIp,
                    lastLoginDate: j.lastLoginDate,
                    siteType: j.siteType
                }
            })
        }

        return NextResponse.json({ data: allData ? allData : [], total: count ? count : 0 }, { status: 200 });
    } catch (error) {
        console.log("Error==>", error)
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}