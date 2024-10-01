# PDF Bank Statement to Excel Converter

This project is a web application that allows users to convert PDF files to Excel format. It's built using Next.js and OpenAI. It provides a simple interface for uploading PDF files and downloading the converted Excel files.

## Features

- Upload PDF files
- Convert PDF to Excel format
- Download converted Excel files
- User-friendly interface

## Technologies Used

- Next.js
- TailwindCSS
- React
- TypeScript
- OpenAI
- API Routes for backend functionality

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/fujahgabriel/Bank-Statement-Converter.git
   cd Bank-Statement-Converter
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Navigate to the home page.
2. Click on the "Upload PDF" button and select your PDF file.
3. Wait for the conversion process to complete.
4. Download the converted Excel file.

## API

The project includes an API endpoint for PDF to Excel conversion:

- `POST /api/convert`: Accepts a PDF file and returns the converted Excel file.

## Configuration

Check `next.config.mjs` for any specific Next.js configurations.



## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [OpenAI Documentation](https://platform.openai.com/docs)
