'use client';
import { generateReceipt } from '@/lib/generateReceipt';

export default function ReceiptButton({ patient, visit }) {
  const handleDownload = async () => {
    await generateReceipt(patient, visit);
  };

  return (
    <button
      onClick={handleDownload}
      className="text-xs font-semibold text-purple-700 border border-purple-200 rounded-full px-3 py-1 hover:bg-purple-50"
    >
      Download Receipt
    </button>
  );
}
