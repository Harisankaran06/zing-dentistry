import { jsPDF } from 'jspdf';

const CLINIC_NAME = 'SmileCare Dental Clinic';
const CLINIC_ADDRESS = 'Your Clinic Address Here, City, State - PIN';
const CLINIC_PHONE = 'Phone: +91 XXXXXXXXXX';

export function generateReceipt(patient, visit) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 50;
  let y = 60;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(CLINIC_NAME, marginX, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  y += 20;
  doc.text(CLINIC_ADDRESS, marginX, y);
  y += 14;
  doc.text(CLINIC_PHONE, marginX, y);

  y += 10;
  doc.setLineWidth(0.5);
  doc.line(marginX, y, pageWidth - marginX, y);

  y += 30;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Payment Receipt', marginX, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const visitDate = visit.visit_date
    ? new Date(visit.visit_date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '-';
  doc.text('Date: ' + visitDate, pageWidth - marginX, y, { align: 'right' });

  y += 30;
  doc.setFont('helvetica', 'bold');
  doc.text('Patient Details', marginX, y);
  doc.setFont('helvetica', 'normal');

  y += 18;
  doc.text('Name: ' + (patient.name || '-'), marginX, y);
  y += 16;
  doc.text('Contact: ' + (patient.contact_no || '-'), marginX, y);
  y += 16;
  doc.text('Age: ' + (patient.age || '-'), marginX, y);

  y += 30;
  doc.setFont('helvetica', 'bold');
  doc.text('Treatment Details', marginX, y);
  doc.setFont('helvetica', 'normal');

  y += 18;
  const chiefComplaint = doc.splitTextToSize(
    'Chief Complaint: ' + (visit.chief_complaint || '-'),
    pageWidth - marginX * 2
  );
  doc.text(chiefComplaint, marginX, y);
  y += chiefComplaint.length * 14 + 6;

  const treatmentDone = doc.splitTextToSize(
    'Treatment Done: ' + (visit.treatment_done || '-'),
    pageWidth - marginX * 2
  );
  doc.text(treatmentDone, marginX, y);
  y += treatmentDone.length * 14 + 6;

  y += 20;
  doc.setLineWidth(0.5);
  doc.line(marginX, y, pageWidth - marginX, y);

  y += 24;
  doc.setFont('helvetica', 'bold');
  doc.text('Description', marginX, y);
  doc.text('Amount', pageWidth - marginX, y, { align: 'right' });

  y += 10;
  doc.line(marginX, y, pageWidth - marginX, y);

  y += 24;
  doc.setFont('helvetica', 'normal');
  doc.text('Amount Charged', marginX, y);
  doc.text('Rs. ' + Number(visit.amount_charged || 0).toFixed(2), pageWidth - marginX, y, {
    align: 'right',
  });

  y += 20;
  doc.text('Amount Paid', marginX, y);
  doc.text('Rs. ' + Number(visit.amount_paid || 0).toFixed(2), pageWidth - marginX, y, {
    align: 'right',
  });

  const balance = Number(visit.amount_charged || 0) - Number(visit.amount_paid || 0);
  y += 20;
  doc.setFont('helvetica', 'bold');
  doc.text('Balance Due', marginX, y);
  doc.text('Rs. ' + balance.toFixed(2), pageWidth - marginX, y, { align: 'right' });

  y += 10;
  doc.setLineWidth(0.5);
  doc.line(marginX, y, pageWidth - marginX, y);

  y += 24;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Payment Mode: ' + (visit.payment_mode || '-'), marginX, y);

  y += 60;
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text('This is a computer-generated receipt.', marginX, y);

  const fileName = 'Receipt-' + (patient.name || 'patient').replace(/\s+/g, '_') + '-' + (visit.visit_date || 'visit') + '.pdf';
  doc.save(fileName);
}
