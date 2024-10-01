import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})
export async function POST(request: NextRequest) {
    let responseContent = '';
    let transactions = [];
    try {
        const { contents } = await request.json()


        for (const content of contents) {
            // Process the data using OpenAI
            const prompt = `You are an expert in parsing bank statements.
            Given the following text from a bank statement, extract and structure the data properly into a JSON format.
            Include fields like date, description, debit, credit and balance.
            The date should be in the format of d/m/Y hh:mm.
            Text: ${content}.

            The output should be in the following JSON format only, validate that output is a valid javascript JSON format to be parsed {} remove unnecessary text such as "Based on the provided bank statement, here's the extracted data in a structured JSON format:" and backtick characters: \n\n
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
                "closing_balance": "",
                "money_out": "",
                "money_in": "",
            },
            "transactions": [
                {
                    "date": "",
                    "description": "",
                    "debit": "",
                    "credit": "",
                    "balance": ""
                }
            ]
        }`;

            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo-1106",
                messages: [{ role: "user", content: prompt }],
            })

            responseContent = completion.choices[0].message.content || ''

            //console.log(responseContent)
            // Clean up the response content
            const chars = ['```sql', '```', '```json', 'json'];
            chars.forEach(char => {
                responseContent = responseContent.replace(char, '');
            });

            responseContent = responseContent.replace(/```(json|sql)?|json/g, '');
            console.log(responseContent)
            // Attempt to parse the JSON, with error handling
            let processedData;
            try {
                processedData = JSON.parse(responseContent.trim());
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                // If parsing fails, attempt to format the data
                processedData = formatData(responseContent);
            }

            if (processedData && processedData.transactions) {
                transactions.push(processedData.transactions);
            } else {
                console.warn('No transactions found in processed data');
            }
        }

        const mergedTransactions = transactions.flat();

        //console.log(mergedTransactions);

        return NextResponse.json({ transactions: mergedTransactions }, { status: 200 });
    } catch (error) {
        console.error('Processing error:', error);
        return NextResponse.json({ error: 'Conversion failed', content: responseContent }, { status: 500 });
    }
}

function formatData(data: string): any {
    // Attempt to format the data if it's not valid JSON
    // This is a basic example and may need to be adjusted based on your specific data structure
    try {
        // Remove any non-JSON characters
        const cleanedData = data.replace(/[^\x20-\x7E]/g, '');
        // Attempt to parse again after cleaning
        return JSON.parse(cleanedData);
    } catch (formatError) {
        console.error('Error formatting data:', formatError);
        // If all else fails, return an object with an empty transactions array
        return { transactions: [] };
    }
}
