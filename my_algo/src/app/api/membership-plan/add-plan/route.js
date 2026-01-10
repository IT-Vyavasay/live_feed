import { NextRequest, NextResponse } from 'next/server';
import { chk_voucher_per, dec, encryption_key, get_timestemp, validate_input_number, validate_input_number_zero } from '../../../../utils/common'
import { check_admin_login } from '../../../../utils/backend'
import { sql_query } from '../../../../utils/dbconnect'

export async function POST(req, res) {
    try {

        let adm = await check_admin_login(req)
        if (!adm.status || !adm.data.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
        }
        let { price, offerPrice, voucherDiscount, totalVoucherCard, totalActivityMonth, voucherValidateTill, serialId, isOffer } = await req.json()
        let nftSerialId = serialId != 0 ? dec(serialId, encryption_key("serialId")) : serialId
        try {
            validate_input_number(price, "price", "Price")
            validate_input_number_zero(offerPrice, "offer price")
            if (Number(offerPrice) >= Number(price)) {
                return NextResponse.json({ message: "Offer price must be less than price" }, { status: 400 })
            }
            if (voucherDiscount || totalVoucherCard) {
                validate_input_number(totalVoucherCard, "total voucher cards", "Total voucher cards")
                chk_voucher_per(voucherDiscount, "voucher discount")
            }

            validate_input_number(totalActivityMonth, "total month", "Total month")
            validate_input_number(voucherValidateTill, "voucher valid till", "Voucher valid till", 1)

            let date = new Date();
            date.setUTCHours(0, 0, 0, 0);
            let today = Math.floor(date.getTime() / 1000)
            if (voucherValidateTill < today) {
                return NextResponse.json({ message: "Voucher valid till date must be future date" }, { status: 400 })
            }

            validate_input_number_zero(nftSerialId, "serial")
            validate_input_number_zero(isOffer, "is offer value", "is offer value")

            if (offerPrice <= 0 && isOffer == 1) {
                toast.error('Enter offer price')
                return false
            }
        } catch (e) {
            return NextResponse.json({ message: e }, { status: 400 })
        }
        const now = get_timestemp()
        await sql_query("INSERT INTO tblslr_membershipPlan (price, offerPrice, voucherDiscount, totalActivityMonth, totalVoucherCard,voucherValidateTill,nftSerialId,isOffer,createdOn,updatedOn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [price, offerPrice, voucherDiscount, totalVoucherCard, totalActivityMonth, voucherValidateTill, nftSerialId, isOffer, now, now]);
        return NextResponse.json({ message: "Membership plan has been added successfully." }, { status: 200 })
    } catch (error) {
        console.log("add plan error->", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 400 })

    }
}