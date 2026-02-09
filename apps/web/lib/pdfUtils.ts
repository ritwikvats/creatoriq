import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}

/**
 * Generates a professional PDF tax report for Indian Creators
 */
export const generateTaxPDF = (summary: any, revenueEntries: any[]) => {
    if (!summary) {
        alert('No tax data available to generate report.');
        return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235); // Primary 600
    doc.text('CreatorIQ - Tax Report', 14, 22);

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Financial Year: ${summary.financialYear || 'N/A'}`, 14, 32);
    doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 14, 38);

    // Summary Cards
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(14, 50, pageWidth - 28, 40, 3, 3, 'F');

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Gross Income', 20, 60);
    doc.text('GST Payable', 70, 60);
    doc.text('TDS Claimable', 120, 60);
    doc.text('Net Income', 170, 60);

    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.text(`INR ${(summary.totalIncome || 0).toLocaleString()}`, 20, 75);
    doc.text(`INR ${(summary.totalGst || 0).toLocaleString()}`, 70, 75);
    doc.text(`INR ${(summary.totalTds || 0).toLocaleString()}`, 120, 75);
    doc.text(`INR ${(summary.netIncome || 0).toLocaleString()}`, 170, 75);

    // Revenue Table
    doc.setFontSize(16);
    doc.text('Revenue Breakdown', 14, 110);

    const tableData = (revenueEntries || []).map(entry => [
        entry.date ? new Date(entry.date).toLocaleDateString() : 'N/A',
        (entry.source || 'unknown').replace('_', ' ').toUpperCase(),
        (entry.platform || 'unknown').toUpperCase(),
        `INR ${parseFloat(entry.amount || 0).toLocaleString()}`,
        `INR ${parseFloat(entry.gst_amount || 0).toLocaleString()}`,
        `INR ${parseFloat(entry.tds_deducted || 0).toLocaleString()}`
    ]);

    doc.autoTable({
        startY: 120,
        head: [['Date', 'Source', 'Platform', 'Amount', 'GST', 'TDS']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] },
        styles: { fontSize: 9 }
    });

    // AI Tips Section
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(16);
    doc.text('AI Tax Strategy Insights', 14, finalY);

    doc.setFontSize(10);
    doc.setTextColor(60);
    let currentY = finalY + 10;
    (summary.taxSavingTips || []).forEach((tip: string, index: number) => {
        const splitTip = doc.splitTextToSize(`${index + 1}. ${tip}`, pageWidth - 28);
        doc.text(splitTip, 14, currentY);
        currentY += splitTip.length * 5 + 2;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('This is an AI-generated summary report for estimation purposes only. Please consult a qualified Chartered Accountant (CA) for official filings.', 14, 285);

    doc.save(`CreatorIQ_Tax_Report_${summary.financialYear}.pdf`);
};
