import { NextResponse } from 'next/server'; 
import { sql_query } from '../../../../../utils/dbconnect'; 
import { draftMode } from 'next/headers';
export async function GET(req, res) {
    draftMode().enable()
    try {
        let data = await sql_query("SELECT metaValue FROM tblslr_config WHERE metaKey = ?", ['terms_condition']) 
        return NextResponse.json({content: data.metaValue  }, { status: 200 })

    } catch (e) {
        console.log(e)
        return NextResponse.json({ message: 'Internal server error' }, { status: 400 })
    }
}


