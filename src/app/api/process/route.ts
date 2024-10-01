import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})
export async function POST(request: NextRequest) {
    let responseContent = '';

    try {
        const {  content } = await request.json()
        // Process the data using OpenAI
        const prompt = `
      You are an expert in parsing bank statements. 
      Given the following text from a bank statement, extract and structure the data into a JSON format.
      Include fields like date, description, debit, credit, and balance.
      Text: ${content}.

     The output should be in the following JSON format only,validate that output is a valid javascript JSON format to be parsed {} remove unnecessary characters:\n\n
      {
        "account_holder": {
            "name": "",
            "address": "",
            "phone_number": "",
            "email": ""
        },
        "statement_period": {
            "start_date": "",
            "end_date": ""
        },
        "balances": {
            "opening_balance": "",
            "money_out": "",
            "money_in": "",
            "closing_balance": ""
        },
        "transactions": []
      }
     `;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        })

         responseContent = completion.choices[0].message.content || ''
        //console.log(responseContent)

        const chars = ['```sql', '```', '```json','json'];

        chars.forEach(char => {
            responseContent = responseContent.replace(char, '');
        });

        //console.log('########## LOG START ##########')
        //console.log(responseContent)
        //console.log('########## LOG END ##########')

        if (responseContent === '' || responseContent === null || responseContent === undefined) {
            return NextResponse.json({ error: 'Conversion failed, missing data' }, { status: 400 });
        }
        const processedData = JSON.parse(responseContent.replace(/```\n/g, '').trim());

        return NextResponse.json({ transactions: processedData?.transactions }, { status: 200 });
    } catch (error) {
        console.error(error);
        console.log(responseContent)
        return NextResponse.json({ error: 'Conversion failed', content: responseContent }, { status: 500 });
    }
}
