import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
// import { check_admin_login } ;
// import { enc, encryption_key, validate_filter_numbers, validate_filter_strings } from "../../../../utils/common";
import { sql_query } from "../../../../utils/dbconnect";
import { check_admin_login } from "../../../../utils/backend";
import { enc, encryption_key, validate_filter_numbers, validate_filter_strings } from "../../../../utils/common";

export async function GET(req, res) {
    draftMode().enable()
    try {
        const params = Object.fromEntries(new URLSearchParams(req.nextUrl.search).entries());
        const { page, startValidRange, endvalidRange, startCreatedOn, endCreatedOn, orderColumn, order, search, selectedSerial, isRedeem, createdFrom } = params


        let adm = await check_admin_login(req)
        let fields = ["createdOn", "serialName", "totalCards", "totalRedeemCard", "discount", "euroAmount", "validUpto", "redeemBy", "createdOn"]
        if (!adm.status || !adm.data.id) {
            return NextResponse.json({ message: 'Something went to wrong, Please refresh page' }, { status: 500 })
        }
        let query = "", filter = [], limit = process.env.PAGELIMIT
        query += `SELECT voucherId,  serialId, createdFrom,couponCode,totalCards, totalRedeemCard, discount, euroAmount, validUpto, redeemBy,isRedeem, createdOn FROM tblvoucher `

        if (validate_filter_numbers([startCreatedOn, endCreatedOn])) {
            query += ` WHERE createdOn >= ? AND createdOn <= ?`
            filter.push(startCreatedOn)
            filter.push(endCreatedOn)
        }
        if (validate_filter_numbers([startValidRange, endvalidRange])) {
            query += ` AND validUpto >= ? AND validUpto <= ?`
            filter.push(startValidRange)
            filter.push(endvalidRange)
        }
        if (isRedeem != "" && isRedeem >= 0) {
            query += " AND isRedeem like ?";
            filter.push(isRedeem)
        }
        if (createdFrom != "" && createdFrom >= 0) {
            query += " AND createdFrom like ?";
            filter.push(createdFrom)
        }
        if (selectedSerial !== "") {
            if (selectedSerial == "All Serial") {
                query += "AND serialID = ?",
                    filter.push(0)
            }
            else {
                query += " AND md5(serialId) like ?";
                filter.push(selectedSerial)
            }

        }
        if (validate_filter_numbers([orderColumn, order])) {
            query += " ORDER BY " + fields[orderColumn] + " " + (order == 0 ? 'asc' : 'desc')
        }
        let countData = await sql_query(query, filter, 'Count')
        query += " limit ? , ?"
        filter.push(page * limit)
        filter.push(parseInt(limit))
        let vouchers = await sql_query(query, filter, "multi")
        let count = Math.ceil(countData / limit), allData = [], ascNum = page * limit, descNum = countData - page * limit;
        if (vouchers.length > 0) {
            let voucherSerials = vouchers.map((voucher) => voucher.serialId)
            const uniqueVoucherSerials = [...new Set(voucherSerials)]
            let userIds = vouchers.map((voucher) => voucher.redeemBy)
            const uniqueUserIds = [...new Set(userIds)]
            let get_serial_name = await sql_query(`SELECT serialId ,name FROM tblserial WHERE serialId IN (?) `, [uniqueVoucherSerials], "Multi")
            let getUsers = await sql_query(`SELECT userId,username FROM tbluser WHERE userId IN (?) `, [uniqueUserIds], "Multi")
            allData = vouchers.map((x) => {
                let matchedSerial = get_serial_name && get_serial_name.find((y) => y.serialId == x.serialId)
                let matchedUser = getUsers && getUsers.find((u) => u.userId == x.redeemBy)
                return {
                    num: order == 1 ? ++ascNum : descNum--,
                    voucherId: enc(x.voucherId.toString(), encryption_key("voucherId")),
                    serialName: matchedSerial ? matchedSerial?.name : "All Serial",
                    createdFrom: x.createdFrom,
                    couponCode: x.couponCode,
                    totalCards: x.totalCards,
                    totalRedeemCard: x.totalRedeemCard,
                    discount: x.discount,
                    euroDiscount: x.euroAmount,
                    validUpto: x.validUpto,
                    redeemBy: matchedUser ? matchedUser.username : "-",
                    redeem: x.isRedeem,
                    createdOn: x.createdOn
                }

            })
        }

        return NextResponse.json({ data: allData ? allData : [], total: count ? count : 0 }, { status: 200 })

    } catch (error) {
        console.log("Error==>", error)
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}
