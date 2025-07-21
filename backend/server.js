require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Importación de CORS
const { generateInvoice } = require('./services/pdfGenerator');

const app = express();

// --- CONFIGURACIÓN DE MIDDLEWARE ---

// 1. Habilitar CORS para TODAS las peticiones.
//    Esto es crucial para que tu frontend en Vercel pueda hablar con tu backend en Render.
app.use(cors());

// 2. Habilitar el parseo de JSON en el cuerpo de las peticiones.
app.use(express.json());

// --- DEFINICIÓN DE RUTAS ---

// Se mantiene una única ruta para la generación del PDF.
// El endpoint ahora es solo /generate-pdf, es más limpio.
app.post('/generate-pdf', async (req, res) => {
  try {
    const { lang, name, amount, date, itemDescription, invoiceNumber } = req.body;
    
    // Validación de campos requeridos.
    if (!lang || !name || !amount || !date || !itemDescription || !invoiceNumber) {
      // Devolvemos un error 400 (Bad Request) con un mensaje claro.
      return res.status(400).json({ message: 'Error: Faltan campos requeridos en la petición.' });
    }

    // Llamamos a la función que genera el PDF.
    const pdfBytes = await generateInvoice(req.body);

    // Configuramos las cabeceras para que el navegador entienda que es un PDF.
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=generated_document.pdf');
    
    // Enviamos el PDF como un buffer.
    res.send(Buffer.from(pdfBytes));

  } catch (error) {
    // Manejo de errores en el servidor.
    console.error('Error al generar el PDF:', error);
    res.status(500).json({ message: 'Error interno del servidor al generar el documento.' });
  }
});

// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ El servicio de generación de PDF está corriendo en el puerto ${PORT}`);
});