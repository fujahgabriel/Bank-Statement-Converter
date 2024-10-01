import * as XLSX from 'xlsx';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
    try {
       
        const {  transactions } = await request.json()


        const worksheet = XLSX.utils.json_to_sheet(transactions);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Bank Statement');

        // Generate buffer
        const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        return new NextResponse(excelBuffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename=bank_statement.xlsx'
            }
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Conversion failed' }, { status: 500 });
    }
}
