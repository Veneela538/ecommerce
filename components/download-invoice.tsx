"use client";

import downloadInvoice from "@/actions/payment/download-invoice";
import { toast } from "sonner";

type Props = {
  orderNumber: string;
};

export default function DownloadInvoiceButton({ orderNumber }: Props) {
  const handleDownloadInvoice = async () => {
    try {
      const buffer = await downloadInvoice(orderNumber);

      const blob = new Blob([buffer], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${orderNumber}.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download invoice");
    }
  };

  return (
    <button
      className="text-blue-600 hover:underline"
      onClick={handleDownloadInvoice}
    >
      Download Invoice
    </button>
  );
}
