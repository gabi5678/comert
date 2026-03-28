const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoicePDF = (order, orderId) => {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `invoice-${orderId}.pdf`;
      const filePath = path.join(__dirname, '../../invoices', fileName);

      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // HEADER
      doc.fontSize(20).text('FACTURA', { align: 'center' });
      doc.moveDown();

      doc.fontSize(12).text(`Numar comanda: ${order.orderNumber}`);
      doc.text(`Data: ${new Date().toLocaleDateString()}`);
      doc.moveDown();

      // CLIENT
      doc.text('Client:');
      doc.text(order.shippingAddress.fullName);
      doc.text(order.shippingAddress.street);
      doc.text(order.shippingAddress.city);
      doc.text(order.shippingAddress.postalCode);
      doc.moveDown();

      // PRODUSE
      doc.text('Produse:', { underline: true });
      doc.moveDown();

      order.items.forEach(item => {
        doc.text(
          `${item.name} | ${item.quantity} x ${item.price} RON = ${(item.quantity * item.price).toFixed(2)} RON`
        );
      });

      doc.moveDown();

      // TOTAL
      doc.text(`Subtotal: ${order.subtotal} RON`);
      doc.text(`Transport: ${order.shippingCost} RON`);
      doc.text(`TOTAL: ${order.total} RON`, { bold: true });

      doc.end();

      stream.on('finish', () => {
        resolve({
          filePath,
          fileName
        });
      });

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateInvoicePDF
};