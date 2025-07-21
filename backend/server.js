require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { generateInvoice } = require('./services/pdfGenerator');

const app = express();

// --- CONFIGURACIÓN DE MIDDLEWARE ---

// 1. Habilitar CORS para TODAS las peticiones.
//    ¡ESTA LÍNEA ES LA SOLUCIÓN AL "NETWORK ERROR"!
//    Le dice a tu backend en Render que acepte peticiones
//    desde tu frontend en Vercel.
app.use(cors());

// 2. Habilitar el parseo de JSON en el cuerpo de las peticiones.
app.use(express.json());


// --- DEFINICIÓN DE RUTAS ---

// Ruta de prueba para verificar que el servidor está vivo
app.get('/', (req, res) => {
  res.send('PDF Generation Service is running correctly.');
});

// Ruta principal para generar el PDF
app.post('/generate-pdf', async (req, res) => {
  try {
    const { lang, name, amount, date, itemDescription, invoiceNumber } = req.body;
    
    // Validación de campos requeridos
    if (!lang || !name || !amount || !date || !itemDescription || !invoiceNumber) {
      return res.status(400).json({ message: 'Error: Faltan campos requeridos en la petición.' });
    }

    // Llamada a la función que genera el PDF
    const pdfBytes = await generateInvoice(req.body);

    // Configuración de las cabeceras para la respuesta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=generated_document.pdf');
    
    // Envío del PDF como un buffer
    res.send(Buffer.from(pdfBytes));

  } catch (error) {
    // Manejo de errores internos del servidor
    console.error('Error al generar el PDF:', error);
    res.status(500).json({ message: 'Error interno del servidor al generar el documento.' });
  }
});


// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ El servicio de generación de PDF está corriendo en el puerto ${PORT}`);
});