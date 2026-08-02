async function loadImageAsBase64(url) {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function drawLetterheadHeader(doc) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 40;
  let y = 45;

  // Doctor info - top left
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 60);
  doc.text('Dr. S. Vidya, BDS', marginX, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Certified in Orthodontics', marginX, y + 13);
  doc.text('Chief Dental Surgeon', marginX, y + 24);

  // Clinic name - center
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(196, 30, 96);
  doc.text("— Dr. V's —", pageWidth / 2, y - 10, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(20, 20, 40);
  doc.text('Zing Dentistry', pageWidth / 2, y + 8, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(130, 130, 130);
  doc.text('Where every smile feels at home', pageWidth / 2, y + 22, { align: 'center' });

  // Phone - top right
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 60);
  doc.text('9841584996', pageWidth - marginX, y - 2, { align: 'right' });
  doc.text('9444512414', pageWidth - marginX, y + 10, { align: 'right' });

  y += 46;

  // Address - centered
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(70, 70, 70);
  doc.text('No-81, G-block, Annanagar East, Chennai - 600102.', pageWidth / 2, y, { align: 'center' });

  y += 12;
  doc.setDrawColor(196, 30, 96);
  doc.setLineWidth(0.8);
  doc.line(marginX, y, pageWidth - marginX, y);

  return y + 22; // y-position where body content should start
}

export function drawLetterheadFooter(doc) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const footerHeight = 50;
  const footerTop = pageHeight - footerHeight;

  // Pink accent bar
  doc.setFillColor(196, 30, 96);
  doc.rect(0, footerTop - 4, pageWidth, 4, 'F');

  // Navy footer bar
  doc.setFillColor(30, 27, 75);
  doc.rect(0, footerTop, pageWidth, footerHeight, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('zingdentistry@gmail.com', pageWidth / 2, footerTop + footerHeight / 2 + 3, { align: 'center' });
}

export async function drawWatermark(doc, areaTopY, areaBottomY) {
  try {
    const base64 = await loadImageAsBase64('/logo/zing-logo.png');
    const pageWidth = doc.internal.pageSize.getWidth();
    const wmWidth = 220;
    const wmHeight = 230;
    const x = (pageWidth - wmWidth) / 2;
    const availableHeight = Math.max(areaBottomY - areaTopY, wmHeight);
    const y = areaTopY + (availableHeight - wmHeight) / 2;

    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.06 }));
    doc.addImage(base64, 'PNG', x, y, wmWidth, wmHeight);
    doc.restoreGraphicsState();
  } catch (err) {
    console.error('Watermark load failed:', err);
  }
}
