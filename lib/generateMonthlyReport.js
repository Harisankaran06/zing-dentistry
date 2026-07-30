import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const CLINIC_NAME = 'SmileCare Dental Clinic';
const CLINIC_ADDRESS = 'Your Clinic Address Here, City, State - PIN';
const CLINIC_PHONE = 'Phone: +91 XXXXXXXXXX';

export function generateMonthlyReport(visits, monthLabel) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 40;
  let y = 50;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(CLINIC_NAME, marginX, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  y += 16;
  doc.text(CLINIC_ADDRESS, marginX, y);
  y += 12;
  doc.text(CLINIC_PHONE, marginX, y);

  y += 10;
  doc.setLineWidth(0.5);
  doc.line(marginX, y, pageWidth - marginX, y);

  y += 30;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(124, 58, 237);
  doc.text('Monthly Report', marginX, y);

  y += 22;
  doc.setFontSize(13);
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
    headStyles: { fillColor: [124, 58, 237], textColor: 255, fontStyle: 'bold' },
    footStyles: { fillColor: [245, 243, 255], textColor: 20, fontStyle: 'bold' },
    columnStyles: {
      4: { halign: 'right' },
    },
    margin: { left: marginX, right: marginX },
  });

  const finalY = doc.lastAutoTable.finalY + 30;
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text('This is a computer-generated report.', marginX, finalY);

  const fileName = 'Monthly_Report-' + monthLabel.replace(/\s+/g, '_') + '.pdf';
  doc.save(fileName);
}
