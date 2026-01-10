import { NextResponse } from 'next/server';
import { draftMode } from "next/headers";
import { check_admin_login } from '../../../../utils/backend';
import { enc, encryption_key, validate_filter_numbers, validate_filter_strings } from '../../../../utils/common';
import { sql_query } from '../../../../utils/dbconnect';

export async function GET(req, res) {
    draftMode().enable()
    try {
        let adm = await check_admin_login(req)
        if (!adm.status || !adm.data.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
        }
        let query = "", filter = [], limit = process.env.PAGE

        const params = Object.fromEntries(new URLSearchParams(req.nextUrl.search).entries());
        const { page, order, orderColumn, startDate, endDate, search, coinType, status, payStatus } = params

        query += `SELECT slr_userMembershipPlanId,userId,offerPrice,coinAmount,coinType,totalActivityMonth,endOn,hash,payStatus,status,createdOn,voucherId FROM tblslr_userMembershipPlan `

        if (validate_filter_numbers([startDate, endDate])) {
            query += " WHERE createdOn >=? AND createdOn<= ?";
            filter.push(parseInt(startDate));
            filter.push(parseInt(endDate))
        }

        if (coinType != "" && coinType >= 0) {
            query += " AND coinType =?"
            filter.push(coinType)
        }

        if (status != "" && status >= 0) {
            query += " AND status =?"
            filter.push(status)
        }
        if (payStatus != "" && payStatus >= 0) {
            query += " AND payStatus =?"
            filter.push(payStatus)
        }

        if (validate_filter_strings([search])) {
            let searchUserData = await sql_query(`SELECT  userId FROM tbluser WHERE userName like "%${search}%"`, [], "Multi")
            if (searchUserData.length) {
                let userIds = searchUserData.map((u) => u.userId)
                query += " AND (userId in (?) or hash like ?)"
                filter.push(userIds)
                filter.push('%' + search + '%')
            } else {
                query += " AND (hash like ?)"
                filter.push('%' + search.trim() + '%')
            }
        }

        let fields = ["createdOn", "offerPrice", "totalActivityMonth", "endOn", "hash", "payStatus", "status", "createdOn", "coinAmount"]

        if (validate_filter_numbers([orderColumn, order])) {
            query += " order by " + fields[orderColumn] + " " + (order == 0 ? 'asc' : 'desc')
        }
        let countData = await sql_query(query, filter, 'Count')
        query += " limit ?,?"
        filter.push(page * limit)
        filter.push(parseInt(limit))

        let userMembershipList = await sql_query(query, filter, "Multi")
        let ascNum = page * limit, descNum = countData - page * limit

        if (userMembershipList.length) {
            let get_userName = await sql_query(`SELECT userName, userId FROM tbluser`, [], "Multi")
            userMembershipList = userMembershipList.map((j, k) => {
                let userIndex = get_userName && get_userName.findIndex((x) => x.userId == j.userId)
                let newData = {
                    ...j,
                    userName: userIndex != -1 ? get_userName[userIndex]['userName'] : "-",
                    num: order == 1 ? ++ascNum : descNum--,
                    voucherId: j.voucherId != 0 ? enc(j.voucherId.toString(), encryption_key("voucherId")) : j.voucherId
                }
                delete newData.userId
                delete newData.slr_userMembershipPlanId
                return newData
            })
        }
        return NextResponse.json({ data: userMembershipList, total: Math.ceil(countData / limit) ? Math.ceil(countData / limit) : 0 }, { status: 200 })
    } catch (e) {
        console.log("error user package list->", e)
        return NextResponse.json({ message: "Something went wrong" }, { status: 400 })
    }
}