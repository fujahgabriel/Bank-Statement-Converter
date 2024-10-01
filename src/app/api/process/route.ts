import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server';
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})

const transactionExtraction = z.object({
    account_holder: z.object({
        name: z.string(),
        address: z.string(),
        phone_number: z.string(),
        email: z.string(),
    }),
    statement_period: z.object({
        start_date: z.string(),
        end_date: z.string(),
    }),
    balances: z.object({
        opening_balance: z.string(),
        closing_balance: z.string(),
        money_out: z.string(),
        money_in: z.string(),
    }),
    transactions: z.array(z.object({
        date: z.string(),
        description: z.string(),
        debit: z.string(),
        credit: z.string(),
        balance: z.string(),
    })),
});

export async function POST(request: NextRequest) {
    let responseContent = {};
    const transactions = [];
    try {
        const { contents } = await request.json()


        for (const content of contents) {
            // Process the data using OpenAI
            const prompt = `You are an expert in parsing bank statements.
            You will be given unstructured text from a bank statement, extract and structure the data properly into a JSON format.
            Include fields like date, description, debit, credit and balance.
            The date should be in the format of d/m/Y hh:mm.
            Text: ${content}.

            The output should be in the following JSON format only, validate that output is a valid javascript JSON format to be parsed {} remove unnecessary text, backtick and characters`;

            const completion = await openai.beta.chat.completions.parse({
                model: "gpt-4o-mini",
                messages: [{ role: "system", content: prompt }],
                response_format:  zodResponseFormat(transactionExtraction, "transactionExtraction"),
            })

            responseContent = completion.choices[0].message?.parsed || {}
         
            if ('transactions' in responseContent) {
                transactions.push(responseContent.transactions);
            }
            
        }

        const mergedTransactions = transactions.flat();

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
