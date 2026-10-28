import jsPDF from 'jspdf';

export interface ScriptPdfExportOptions {
  title: string;
  hook: string;
  mainBody: string;
  closingCta: string;
  language: string;
  videoLength: string;
  tone: string;
  targetAudience: string;
  businessProfileName?: string;
  creatorName?: string;
  channelName?: string;
}

/**
 * Generates and downloads a beautifully branded, high-contrast creator PDF document
 */
export const exportScriptToPdf = (options: ScriptPdfExportOptions) => {
  const {
    title,
    hook,
    mainBody,
    closingCta,
    language,
    videoLength,
    tone,
    targetAudience,
    businessProfileName = 'Scripter Creator Studio',
    creatorName = 'Rituraj Tomar',
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Helper for adding pages if reaching bottom
  const checkPageOverflow = (requiredHeight: number) => {
    if (y + requiredHeight > pageHeight - 16) {
      doc.addPage();
      y = margin;
      drawHeaderFooter();
    }
  };

  const drawHeaderFooter = () => {
    // Top Brand Accent Line
    doc.setFillColor(37, 99, 235); // Blue 600
    doc.rect(margin, 8, contentWidth, 1.2, 'F');

    // Bottom Running Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text('Scripter AI · Content Creation & Teleprompter Studio', margin, pageHeight - 10);
    doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - margin, pageHeight - 10, {
      align: 'right',
    });
  };

  // Initial Header
  drawHeaderFooter();

  // 1. Brand Logo & Document Type Badge
  doc.setFillColor(241, 245, 249); // Slate 100
  doc.roundedRect(margin, y, 42, 6.5, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(37, 99, 235); // Blue 600
  doc.text('SCRIPTER PRODUCTION SCRIPT', margin + 3, y + 4.5);

  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(dateStr, pageWidth - margin, y + 4.5, { align: 'right' });

  y += 11;

  // 2. Main Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // Slate 900
  const titleLines = doc.splitTextToSize(title, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 7.5 + 2;

  // 3. Metadata Parameters Grid Box
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.roundedRect(margin, y, contentWidth, 15, 3, 3, 'FD');

  doc.setFontSize(8);
  const colW = contentWidth / 4;

  // Col 1: Length
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('TARGET DURATION', margin + 4, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(videoLength, margin + 4, y + 10.5);

  // Col 2: Tone
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('VOICE TONE', margin + colW + 4, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(tone.slice(0, 18), margin + colW + 4, y + 10.5);

  // Col 3: Language
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('LANGUAGE', margin + colW * 2 + 4, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(
    language === 'hi' ? 'Hindi (हिंदी)' : language === 'hinglish' ? 'Hinglish' : 'English',
    margin + colW * 2 + 4,
    y + 10.5
  );

  // Col 4: Channel / Profile
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('CHANNEL PROFILE', margin + colW * 3 + 4, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(businessProfileName.slice(0, 18), margin + colW * 3 + 4, y + 10.5);

  y += 20;

  // 4. Section A: The Retention Hook (0-5s)
  checkPageOverflow(32);
  doc.setFillColor(254, 243, 199); // Amber 100
  doc.setDrawColor(245, 158, 11); // Amber 500
  doc.roundedRect(margin, y, contentWidth, 24, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(180, 83, 9); // Amber 700
  doc.text('SECTION 1: THE RETENTION HOOK (0 - 5 SECONDS)', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  const hookLines = doc.splitTextToSize(`"${hook}"`, contentWidth - 8);
  doc.text(hookLines, margin + 4, y + 13);

  y += 29;

  // 5. Section B: Core Script Body
  checkPageOverflow(40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(37, 99, 235); // Blue 600
  doc.text('SECTION 2: CORE VALUE & BODY SCRIPT', margin, y);
  y += 5;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);

  const bodyParagraphs = mainBody.split('\n\n');
  for (const para of bodyParagraphs) {
    if (!para.trim()) continue;
    const lines = doc.splitTextToSize(para.trim(), contentWidth);
    checkPageOverflow(lines.length * 5 + 4);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 3.5;
  }

  y += 4;

  // 6. Section C: Call To Action
  checkPageOverflow(28);
  doc.setFillColor(236, 253, 245); // Emerald 50
  doc.setDrawColor(16, 185, 129); // Emerald 500
  doc.roundedRect(margin, y, contentWidth, 22, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(4, 120, 87); // Emerald 700
  doc.text('SECTION 3: CONVERSION CALL-TO-ACTION (CTA)', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  const ctaLines = doc.splitTextToSize(closingCta, contentWidth - 8);
  doc.text(ctaLines, margin + 4, y + 13);

  y += 27;

  // 7. Teleprompter Delivery Notes Box
  checkPageOverflow(26);
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('TELEPROMPTER & DELIVERY NOTES', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('• Recommended speaking rate: 125-140 words per minute for vertical video formats.', margin + 4, y + 9.5);
  doc.text('• Maintain direct lens eye contact during the first 3 seconds of the hook.', margin + 4, y + 13.5);

  // Trigger browser download
  const cleanFilename = (title || 'script')
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '_')
    .slice(0, 30);
  doc.save(`${cleanFilename}_scripter.pdf`);
};
