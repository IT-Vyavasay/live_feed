import { NextRequest, NextResponse } from 'next/server';
import { check_admin_login } from '../../../../utils/backend'
import { sql_query } from '../../../../utils/dbconnect'
import { chk_voucher_per, dec, encryption_key, get_timestemp, validate_filter_strings, validate_input_number, validate_input_number_zero } from '../../../../utils/common';

export async function POST(req, res) {
    try {
        let adm = await check_admin_login(req)
        if (!adm.status || !adm.data.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
        }
        let { voucherDiscount, totalVoucherCard, voucherValidateTill, planId, price, offerPrice, isOffer } = await req.json()
        try {
            validate_input_number(price, "price", "Price")
            validate_input_number_zero(offerPrice, "offer price")
            if (Number(offerPrice) >= Number(price)) {
                return NextResponse.json({ message: "Offer price must be less than price" }, { status: 400 })
            }
            voucherDiscount && validate_input_number(totalVoucherCard, "total voucher cards", "Total voucher cards")
            totalVoucherCard && chk_voucher_per(voucherDiscount, "voucher discount")
            validate_input_number(voucherValidateTill, "voucher valid till", "Voucher valid till", 1)
            let date = new Date();
            date.setUTCHours(0, 0, 0, 0);
            let today = Math.floor(date.getTime() / 1000)
            if (voucherValidateTill < today) {
                return NextResponse.json({ message: "Voucher valid till date must be future date" }, { status: 400 })
            }
            validate_input_number_zero(isOffer, "is offer value", "is offer value")
            if (offerPrice <= 0 && isOffer == 1) {
                toast.error('Enter offer price')
                return false
            }
        } catch (e) {
            return NextResponse.json({ message: e }, { status: 400 })
        }
        if (validate_filter_strings(planId)) {
            let plan_Id = dec(planId, encryption_key("ids"))
            const now = get_timestemp()
            let getPaln = await sql_query("SELECT slr_membershipPlanId from tblslr_membershipPlan where slr_membershipPlanId = ? ", [plan_Id])
            if (getPaln) {
                await sql_query("UPDATE tblslr_membershipPlan SET price = ? , offerPrice = ?, voucherDiscount = ?, totalVoucherCard = ?,voucherValidateTill=?, updatedOn = ?,isOffer=? WHERE slr_membershipPlanId = ?", [price, offerPrice, voucherDiscount || 0, totalVoucherCard || 0, voucherValidateTill, now, isOffer, getPaln.slr_membershipPlanId])
                return NextResponse.json({ message: "Membership plan has been updated successfully." }, { status: 200 })
            }
        }
        return NextResponse.json({ message: 'Service temporary unavailable' }, { status: 400 })
    } catch (error) {
        console.log("update plan error-->", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 400 })
    }
}