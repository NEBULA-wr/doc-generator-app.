require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { generateInvoice } = require('./services/pdfGenerator'); // Tu generador de PDF sigue igual

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint público para generar el PDF. 
// La lógica de guardar en la BD ahora se hace desde el frontend.
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { lang, name, amount, date, itemDescription, invoiceNumber } = req.body;
    if (!lang || !name || !amount || !date || !itemDescription || !invoiceNumber) {
      return res.status(400).send({ error: 'Missing required fields' });
    }

    const pdfBytes = await generateInvoice(req.body);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=generated_document.pdf');
    res.send(Buffer.from(pdfBytes));

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send({ error: 'Failed to generate document' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ PDF Generation Service running on http://localhost:${PORT}`);
});