const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const i18next = require('i18next');
const fs = require('fs');
const path = require('path');

// Variables para las fuentes, se cargarán una vez
let font, boldFont;

// Carga de archivos de traducción y configuración de i18next
const resources = {
  en: JSON.parse(fs.readFileSync(path.join(__dirname, '../locales/en.json'), 'utf8')),
  es: JSON.parse(fs.readFileSync(path.join(__dirname, '../locales/es.json'), 'utf8')),
  pt: JSON.parse(fs.readFileSync(path.join(__dirname, '../locales/pt.json'), 'utf8')),
  fr: JSON.parse(fs.readFileSync(path.join(__dirname, '../locales/fr.json'), 'utf8')),
};

i18next.init({
  resources,
  fallbackLng: 'en',
  ns: ['translation', 'backend'], // Namespaces para separar traducciones de UI y backend
  defaultNS: 'translation',
  interpolation: { escapeValue: false },
});

// --- Constantes de Diseño para el PDF ---
const brandColor = rgb(0.1, 0.5, 0.8);
const headerColor = rgb(0.05, 0.28, 0.48);
const lightGray = rgb(0.9, 0.9, 0.9);
const darkGray = rgb(0.3, 0.3, 0.3);
const textGray = rgb(0.5, 0.5, 0.5);

// --- Funciones de Ayuda para Dibujar Secciones del PDF ---

// Dibuja el encabezado de la empresa
function drawHeader(page, width) {
  // Aquí es donde podrías añadir un logo si tuvieras la imagen
  // page.drawImage(logoImage, { x: 50, y: 750, width: 150, height: 50 });

  page.drawText('ProGen Inc.', { x: 50, y: 790, font: boldFont, size: 24, color: headerColor });
  page.drawText('123 Innovation Drive, Tech City, 12345', { x: 50, y: 770, font: font, size: 10, color: textGray });
  page.drawText('contact@progen.example.com', { x: 50, y: 758, font: font, size: 10, color: textGray });
}

// Dibuja la información de la factura (número, fecha, título)
function drawInvoiceInfo(page, width, data, t) {
  const formattedDate = new Date(data.date + 'T00:00:00').toLocaleDateString(data.lang, { year: 'numeric', month: 'long', day: 'numeric' });
  
  page.drawText(t('title'), { x: width - 250, y: 790, font: boldFont, size: 36, color: brandColor });
  
  page.drawText(`${t('invoice_number')}:`, { x: width - 250, y: 760, font: boldFont, size: 10, color: darkGray });
  page.drawText(data.invoiceNumber, { x: width - 175, y: 760, font: font, size: 10, color: textGray }); // Espaciado ajustado
  
  page.drawText(`${t('issue_date')}:`, { x: width - 250, y: 745, font: boldFont, size: 10, color: darkGray });
  page.drawText(formattedDate, { x: width - 175, y: 745, font: font, size: 10, color: textGray }); // Espaciado ajustado
}

// Dibuja la información del cliente
function drawClientInfo(page, data, t) {
  page.drawRectangle({ x: 50, y: 650, width: 250, height: 80, color: lightGray, opacity: 0.5 });
  page.drawText(t('bill_to').toUpperCase(), { x: 60, y: 710, font: boldFont, size: 10, color: darkGray });
  page.drawText(data.name, { x: 60, y: 690, font: boldFont, size: 12, color: headerColor });
}

// Dibuja la tabla de ítems y totales
function drawTable(page, width, data, t) {
  const tableTop = 600;
  let y = tableTop;

  // Encabezados de la tabla
  page.drawRectangle({ x: 50, y: y - 20, width: width - 100, height: 20, color: headerColor });
  page.drawText(t('table.item'), { x: 60, y: y - 14, font: boldFont, size: 10, color: rgb(1, 1, 1) });
  page.drawText(t('table.price'), { x: width - 120, y: y - 14, font: boldFont, size: 10, color: rgb(1, 1, 1) });
  y -= 20;

  // Contenido de la fila
  const itemDesc = data.itemDescription || t('table.default_item');
  const price = `$${Number(data.amount).toFixed(2)}`;
  
  // Lógica para el ajuste de línea (word wrap)
  const textWidth = width - 200;
  const words = itemDesc.split(' ');
  let line = '';
  const lines = [];
  for (const word of words) {
    const testLine = line + word + ' ';
    if (font.widthOfTextAtSize(testLine, 10) > textWidth && line !== '') {
      lines.push(line);
      line = word + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  const rowHeight = Math.max(30, lines.length * 15);
  y -= rowHeight;
  
  let lineY = y + rowHeight - 12;
  for (const textLine of lines) {
    page.drawText(textLine, { x: 60, y: lineY, font: font, size: 10, color: darkGray });
    lineY -= 15;
  }
  
  page.drawText(price, { x: width - 120, y: y + rowHeight - 12, font: font, size: 10, color: darkGray });
  page.drawLine({ start: { x: 50, y: y }, end: { x: width - 50, y: y }, color: lightGray, thickness: 1 });
  y -= 10;

  // Sección de Totales
  const totalY = y - 40;
  page.drawText(t('table.subtotal'), { x: width - 250, y: totalY, font: font, size: 10, color: darkGray });
  page.drawText(price, { x: width - 120, y: totalY, font: font, size: 10, color: darkGray });
  
  page.drawRectangle({ x: width - 260, y: totalY - 30, width: 210, height: 25, color: brandColor });
  page.drawText(t('table.grand_total'), { x: width - 250, y: totalY - 23, font: boldFont, size: 12, color: rgb(1, 1, 1) });
  page.drawText(price, { x: width - 120, y: totalY - 23, font: boldFont, size: 12, color: rgb(1, 1, 1) });
}

// Dibuja el pie de página
function drawFooter(page, width) {
  page.drawText('Payment is due within 30 days. Thank you for your business!', {
      x: 50, y: 80, font: font, size: 10, color: textGray
  });
  page.drawText('ProGen Inc. | www.progen.example.com', {
      x: width / 2 - 100, y: 40, font: boldFont, size: 10, color: brandColor
  });
}

// --- Función Principal que une todo ---
async function generateInvoice(data) {
  const t = await i18next.changeLanguage(data.lang);
  
  const pdfDoc = await PDFDocument.create();
  font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const page = pdfDoc.addPage();
  const { width } = page.getSize();

  drawHeader(page, width);
  drawInvoiceInfo(page, width, data, t);
  drawClientInfo(page, data, t);
  drawTable(page, width, data, t);
  drawFooter(page, width);

  return await pdfDoc.save();
}

module.exports = { generateInvoice };