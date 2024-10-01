//import { ChatOpenAI, OpenAI } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();

        // Load PDF
        const blob = new Blob([buffer], { type: 'application/pdf' });
        const loader = new PDFLoader(blob);
        const docs = await loader.load();

        const docContent: string[] = [];
        docs.forEach(doc => {
            docContent.push(doc.pageContent);  // Assuming `doc.pageContent` holds text of each page
        });
        
        return NextResponse.json({ contents: docContent }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Conversion failed' }, { status: 500 });
    }
}
