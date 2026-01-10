import { draftMode } from "next/headers";
import { check_admin_login } from "../../../../utils/backend";
import { NextResponse } from "next/server";
import { dec, encryption_key } from "../../../../utils/common";
import { sql_query } from "../../../../utils/dbconnect";

export async function GET(req, res) {
    draftMode().enable()
    try {
        let adm = await check_admin_login(req)
        if (!adm.status || !adm.data.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
        }
        const params = Object.fromEntries(new URLSearchParams(req.nextUrl.search).entries());
        const { v_id } = params
        if (!v_id) {
            return NextResponse.json({ message: 'Something went to wrong, Please refresh page' }, { status: 500 })
        }
        let voucherId = v_id != 0 ? dec(v_id, encryption_key("voucherId")) : v_id
        let query = `SELECT serialId,serialType, voucherId,cardId, createdOn from tbluserVoucherDetail`, filter = []

        query += ' WHERE voucherId = ?';
        filter.push(Number(voucherId))

        let userVoucherDetails = await sql_query(query, filter, "Multi")


        let allData = [], ascNum = 0
        if (userVoucherDetails.length > 0) {
            let voucherSerials = userVoucherDetails.map((voucher) => voucher.serialId)
            let uniqueVoucherSerials = [...new Set(voucherSerials)]
            let cardIdsForSerial = userVoucherDetails.filter(x => x.serialType == 0 || x.serialType == 1)
            let uniqueSerialCardIds = [...new Set(cardIdsForSerial.map(x => x.cardId))]
            let cardIdsForJokerSerial = userVoucherDetails.filter(x => x.serialType == 2)
            let uniqueJokerCardIds = [...new Set(cardIdsForJokerSerial.map(y => y.cardId))]
            const getSerials = await sql_query(`SELECT serialId, name  FROM tblserial WHERE serialId IN (?)`, [uniqueVoucherSerials], "Multi")
            const serialCardTableData = await sql_query(`SELECT  serialCardDetailsId,cardName FROM tblserialCardDetails WHERE serialCardDetailsId IN (?) `, [uniqueSerialCardIds], "Multi")
            const jockerCardTableData = await sql_query(`SELECT  jockerSerialCardDetailId,cardName FROM tbljockerSerialCardDetail WHERE jockerSerialCardDetailId IN (?) `, [uniqueJokerCardIds], "Multi")

            userVoucherDetails.map((u) => {
                let matchedSerial = getSerials && getSerials.find(z => z.serialId == u.serialId)
                let dataObj = {
                    num: ++ascNum,
                    serialType: u.serialType,
                    redeemOn: u.createdOn,
                }
                if (u.serialType == 0 || u.serialType == 1) {
                    let matchedSerialCard = serialCardTableData && serialCardTableData.find(y => y.serialCardDetailsId == u.cardId)
                    if (matchedSerialCard) {
                        dataObj["serialName"] = matchedSerial ? matchedSerial?.name : "-";
                        dataObj["cardName"] = matchedSerialCard ? matchedSerialCard?.cardName : ''
                    }
                }
                else {
                    let matchedJockerSerial = jockerCardTableData && jockerCardTableData.find(y => y.jockerSerialCardDetailId == u.cardId)
                    if (matchedJockerSerial) {
                        dataObj["serialName"] = matchedSerial ? matchedSerial?.name : "-";
                        dataObj["cardName"] = matchedJockerSerial ? matchedJockerSerial?.cardName : ''
                    }
                }
                allData.push(dataObj)
            })

        }
        return NextResponse.json({ data: allData }, { status: 200 })

    } catch (error) {
        console.log("error user voucher details->", error)
        return NextResponse.json({ message: "Something went wrong" }, { status: 400 })
    }

}