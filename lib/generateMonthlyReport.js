import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { drawLetterheadHeader, drawLetterheadFooter, drawWatermark } from './letterhead';

export async function generateMonthlyReport(visits, monthLabel) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 40;

  let y = drawLetterheadHeader(doc);
  const contentTopY = y;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(196, 30, 96);
  doc.text('Monthly Report', marginX, y);

  y += 20;
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text(monthLabel, marginX, y);
  doc.setTextColor(0, 0, 0);

  const rows = visits.map((v) => [
    v.patient_name || '-',
    v.visit_date
      ? new Date(v.visit_date).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : '-',
    v.treatment_done || '-',
    v.payment_mode || '-',
    'Rs. ' + Number(v.amount_paid || 0).toFixed(2),
  ]);

  const totalPaid = visits.reduce((sum, v) => sum + Number(v.amount_paid || 0), 0);

  autoTable(doc, {
    startY: y + 20,
    head: [['Patient Name', 'Date', 'Treatment Done', 'Payment Mode', 'Amount Paid']],
    body: rows,
    foot: [['', '', '', 'Total', 'Rs. ' + totalPaid.toFixed(2)]],
    styles: { fontSize: 9, cellPadding: 6 },
    headStyles: { fillColor: [196, 30, 96], textColor: 255, fontStyle: 'bold' },
    footStyles: { fillColor: [252, 235, 243], textColor: 20, fontStyle: 'bold' },
    columnStyles: {
      4: { halign: 'right' },
    },
    margin: { left: marginX, right: marginX, bottom: 70 },
  });

  const finalY = doc.lastAutoTable.finalY + 30;
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text('This is a computer-generated report.', marginX, finalY);

  await drawWatermark(doc, contentTopY, doc.internal.pageSize.getHeight() - 60);
  drawLetterheadFooter(doc);

  const fileName = 'Monthly_Report-' + monthLabel.replace(/\s+/g, '_') + '.pdf';
  doc.save(fileName);
}
