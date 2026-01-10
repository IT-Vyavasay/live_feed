

import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { check_admin_login } from "../../../../utils/backend";
import { enc, encryption_key, validate_filter_numbers } from "../../../../utils/common";
import { sql_query } from "../../../../utils/dbconnect";

export async function GET(req, res) {
    draftMode().enable()
    try {
        const params = Object.fromEntries(new URLSearchParams(req.nextUrl.search).entries());
        const { orderColumn, order = 1, page } = params;

        let adm = await check_admin_login(req)
        if (!adm.status || !adm.data.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
        }
        let query = "", filter = [], limit = process.env.PAGELIMIT;
        query += `SELECT m.slr_membershipPlanId,m.price , m.offerPrice, m.voucherDiscount, m.totalActivityMonth ,m.voucherValidateTill, m.totalVoucherCard , m.nftSerialId , m.isOffer , m.createdOn, m.updatedOn from tblslr_membershipPlan as m`


        let fields = [
            "m.createdOn",
            "m.price",
            "m.totalActivityMonth",
            "m.voucherDiscount",
            "m.totalVoucherCard",
            "m.voucherValidateTill",
            "m.isOffer",
            "m.createdOn",
        ];
        if (validate_filter_numbers([orderColumn, order])) {
            query += " order by " + fields[orderColumn] + " " + (order == 0 ? 'asc' : 'desc')
        }
        let countData = await sql_query(query, filter, 'Count')
        query += "  limit ? , ?"

        filter.push(page * limit)
        filter.push(parseInt(limit))

        let packageList = await sql_query(query, filter, "multi")
        let count = Math.ceil(countData / limit), allData = [], ascNum = page * limit, descNum = countData - page * limit;
        const packages = JSON.parse(JSON.stringify(packageList));
        const serialListData = await sql_query("SELECT serialId, name FROM tblserial", [], "multi")
        if (packages.length > 0) {
            allData = packages.map((j, k) => {
                const isSerialExist = serialListData.find(serial => serial.serialId === j.nftSerialId)
                return {
                    num: order == 1 ? ++ascNum : descNum--,
                    id: j.slr_membershipPlanId ? enc(j.slr_membershipPlanId.toString(), encryption_key("ids")) : "",
                    nftSerialId: j.nftSerialId != 0 ? enc(j.nftSerialId.toString(), encryption_key("serialId")) : j.nftSerialId,
                    price: j.price,
                    offerPrice: j.offerPrice,
                    voucherDiscount: j.voucherDiscount,
                    totalActivityMonth: j.totalActivityMonth,
                    voucherValidateTill: j.voucherValidateTill,
                    totalVoucherCard: j.totalVoucherCard,
                    nftSerialName: isSerialExist ? isSerialExist.name : "-",
                    isOffer: j.isOffer,
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