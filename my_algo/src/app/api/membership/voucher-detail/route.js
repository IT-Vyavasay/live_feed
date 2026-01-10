import { NextResponse } from 'next/server';
import { draftMode } from "next/headers";
import { check_admin_login } from '../../../../utils/backend';
import { sql_query } from '../../../../utils/dbconnect';
import { dec, encryption_key } from '../../../../utils/common';

export async function GET(req, res) {
    draftMode().enable()
    try {
        let adm = await check_admin_login(req)
        if (!adm.status || !adm.data.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
        }
        const params = Object.fromEntries(new URLSearchParams(req.nextUrl.search).entries());
        const { v_id } = params

        let voucherId = v_id != 0 ? dec(v_id, encryption_key("voucherId")) : v_id
        let voucherDetail = [], voucherDetailList = []
        if (voucherId > 0) {
            voucherDetail = await sql_query(`SELECT voucherId,totalCards,totalRedeemCard,discount,euroAmount,validUpto FROM tblvoucher where voucherId = ?`, [voucherId])
            voucherDetailList = await sql_query(`SELECT serialId,cardId,serialType,createdOn FROM tbluserVoucherDetail where voucherId = ?`, [voucherDetail.voucherId], "Multi")
            delete voucherDetail.voucherId;
            if (voucherDetailList.length) {
                let getSerialName = await sql_query(`SELECT name, serialId FROM tblserial`, [], "Multi")
                let getcardName = await sql_query(`SELECT serialCardDetailsId, cardName FROM tblserialCardDetails`, [], "Multi")
                let getJockerCardName = await sql_query(`SELECT jockerSerialCardDetailId, cardName FROM tbljockerSerialCardDetail`, [], "Multi")
                voucherDetailList = voucherDetailList.map((j, k) => {
                    let serialIndex = getSerialName && getSerialName.findIndex((x) => x.serialId == j.serialId)
                    let cardIndex = j.serialType == 2 ? getJockerCardName && getJockerCardName.findIndex((x) => x.jockerSerialCardDetailId == j.cardId) : getcardName && getcardName.findIndex((x) => x.serialCardDetailsId == j.cardId);
                    let newData = {
                        ...j,
                        serialName: serialIndex != -1 ? getSerialName[serialIndex]['name'] : "-",
                        cardName: cardIndex != -1 ? j.serialType == 2 ? getJockerCardName[cardIndex]['cardName'] : getcardName[cardIndex]['cardName'] : "-",
                        num: ++k,
                    }
                    delete newData.serialId
                    delete newData.cardId
                    return newData
                })
            }
        }
        return NextResponse.json({ data: { voucherDetail, voucherDetailList }, }, { status: 200 })
    } catch (e) {
        console.log("error user package list->", e)
        return NextResponse.json({ message: "Something went wrong" }, { status: 400 })
    }
}