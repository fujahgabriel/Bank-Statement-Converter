'use client';

import { useState } from 'react';
interface Transaction {
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}
export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleConvert = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions);
      } else {
        alert('Conversion failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };
  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactions: transactions }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'bank_statement.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setDownloading(false);
      } else {
        alert('Download failed');
        setDownloading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during download');
      setDownloading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full mx-10">
        <h1 className="text-2xl dark:text-gray-800 font-bold mb-4">PDF Bank Statement to Excel Converter</h1>
        <h2 className="text-xl text-gray-600 mb-4">The most trusted bank statement converter</h2>
        <p className="text-sm text-gray-600 mb-4">Easily convert PDF bank statements from 1000s of banks world wide into clean Excel (XLS) format.</p>


        <form onSubmit={handleConvert}>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="mb-4 p-2 border dark:text-gray-800 "
          />
          <button
            type="submit"
            disabled={loading}
            className={`bg-black text-white px-4 py-3  hover:bg-gray-800 ${loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {loading ? 'Converting...' : 'Convert PDF'}
          </button>
        </form>

        {transactions.length > 0 && (
          <>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full dark:text-gray-800  ">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Date</th>
                    <th className="px-4 py-2 border">Description</th>
                    <th className="px-4 py-2 bordertext-center">Debit</th>
                    <th className="px-4 py-2 border text-center">Credit</th>
                    <th className="px-4 py-2 border text-center">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border text-xs">{transaction.date}</td>
                      <td className="px-4 py-2 border text-xs">{transaction.description}</td>
                      <td className="px-4 py-2 border text-xs text-center">{transaction.debit}</td>
                      <td className="px-4 py-2 border text-xs text-center">{transaction.credit}</td>
                      <td className="px-4 py-2 border text-xs text-center">{transaction.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="bg-black  text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              {downloading ? 'Downloading...' : 'Download as XLSX'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
