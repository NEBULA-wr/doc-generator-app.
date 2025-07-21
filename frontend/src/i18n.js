import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  // Carga las traducciones desde archivos externos (ej. /locales/es.json)
  .use(HttpApi)
  // Detecta el idioma del navegador del usuario
  .use(LanguageDetector)
  // Pasa la instancia de i18n a react-i18next
  .use(initReactI18next)
  // Inicializa i18next
  .init({
    // Idioma por defecto si el del usuario no está disponible
    fallbackLng: 'en',
    // Habilitar logs en la consola para depuración
    debug: true, 
    
    detection: {
      // Orden y desde dónde detectar el idioma
      order: ['queryString', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      // Claves a buscar en la caché
      caches: ['localStorage', 'cookie'],
    },

    backend: {
      // Ruta para cargar las traducciones.
      // {{lng}} se reemplazará por el código del idioma (en, es, etc.)
      // Este es el cambio clave. Ahora leerá tus archivos .json.
      loadPath: '/locales/{{lng}}.json', 
    },

    interpolation: {
      escapeValue: false, // React ya protege contra XSS
    },

    react: {
      // Desactivamos Suspense si no lo estás usando para la carga de traducciones
      useSuspense: false, 
    },
  });

export default i18n;