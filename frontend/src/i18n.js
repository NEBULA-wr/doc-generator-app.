import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to ProGen", "tagline": "Document creation, simplified.", "get_started": "Get Started for Free", "login": "Login", "register": "Register", "dashboard": "Dashboard", "logout": "Logout", "formTitle": "Document Details", "nameLabel": "Client Name", "invoiceNumberLabel": "Invoice Number", "amountLabel": "Amount", "dateLabel": "Date", "itemDescriptionLabel": "Item / Service Description", "generateButton": "Generate & Save Document", "generatingButton": "Generating...", "error_generic": "An error occurred. Please try again.", "my_documents": "My Documents", "searchPlaceholder": "Search by client or file name...", "sortNewest": "Newest First", "sortOldest": "Oldest First", "noDocuments": "You haven't generated any documents yet.", "clientLabel": "Client"
    }
  },
  es: {
    translation: {
      "welcome": "Bienvenido a ProGen", "tagline": "Creación de documentos, simplificada.", "get_started": "Comenzar Gratis", "login": "Iniciar Sesión", "register": "Registrarse", "dashboard": "Panel de Control", "logout": "Cerrar Sesión", "formTitle": "Detalles del Documento", "nameLabel": "Nombre del Cliente", "invoiceNumberLabel": "Número de Factura", "amountLabel": "Cantidad", "dateLabel": "Fecha", "itemDescriptionLabel": "Descripción del Artículo / Servicio", "generateButton": "Generar y Guardar Documento", "generatingButton": "Generando...", "error_generic": "Ocurrió un error. Por favor, inténtelo de nuevo.", "my_documents": "Mis Documentos", "searchPlaceholder": "Buscar por cliente o archivo...", "sortNewest": "Más nuevos primero", "sortOldest": "Más antiguos primero", "noDocuments": "Aún no has generado ningún documento.", "clientLabel": "Cliente"
    }
  },
  fr: {
    translation: {
      "welcome": "Bienvenue chez ProGen", "tagline": "Création de documents, simplifiée.", "get_started": "Commencer gratuitement", "login": "Connexion", "register": "S'inscrire", "dashboard": "Tableau de bord", "logout": "Déconnexion", "formTitle": "Détails du document", "nameLabel": "Nom du client", "invoiceNumberLabel": "Numéro de facture", "amountLabel": "Montant", "dateLabel": "Date", "itemDescriptionLabel": "Description de l'article / service", "generateButton": "Générer et enregistrer", "generatingButton": "Génération...", "error_generic": "Une erreur est survenue. Veuillez réessayer.", "my_documents": "Mes documents", "searchPlaceholder": "Rechercher par client ou nom de fichier...", "sortNewest": "Plus récents d'abord", "sortOldest": "Plus anciens d'abord", "noDocuments": "Vous n'avez pas encore généré de documents.", "clientLabel": "Client"
    }
  },
  pt: {
    translation: {
      "welcome": "Bem-vindo ao ProGen", "tagline": "Criação de documentos, simplificada.", "get_started": "Comece de graça", "login": "Entrar", "register": "Registrar", "dashboard": "Painel", "logout": "Sair", "formTitle": "Detalhes do Documento", "nameLabel": "Nome do Cliente", "invoiceNumberLabel": "Número da Fatura", "amountLabel": "Valor", "dateLabel": "Data", "itemDescriptionLabel": "Descrição do Item / Serviço", "generateButton": "Gerar e Salvar Documento", "generatingButton": "Gerando...", "error_generic": "Ocorreu um erro. Por favor, tente novamente.", "my_documents": "Meus Documentos", "searchPlaceholder": "Pesquisar por cliente ou nome do arquivo...", "sortNewest": "Mais recentes primeiro", "sortOldest": "Mais antigos primeiro", "noDocuments": "Você ainda não gerou nenhum documento.", "clientLabel": "Cliente"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

export default i18n;