import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../hooks/useAuth';
import DocumentForm from '../components/DocumentForm';
import DocumentList from '../components/DocumentList';
import Spinner from '../components/ui/Spinner';
import Notification from '../components/ui/Notification';
import ConfirmModal from '../components/ui/Modal/ConfirmModal';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { useTranslation } from 'react-i18next';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [documents, setDocuments] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [loadingDocId, setLoadingDocId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);

  const fetchDocuments = useCallback(async () => {
    if (!user?.id) return;
    setIsFetching(true);
    try {
      const { data, error: fetchError } = await supabase.from('documentos').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (fetchError) throw fetchError;
      setDocuments(data);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setNotification({ message: `Error al cargar documentos: ${err.message}`, type: 'error' });
    } finally {
      setIsFetching(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);
  
  const handleGenerateDocument = async (formData) => {
    const lang = i18n.language.split('-')[0];
    try {
      const API_URL = process.env.REACT_APP_API_URL;

      // Si la URL no existe, mostramos un error claro.
      if (!API_URL) {
        throw new Error("La variable de entorno REACT_APP_API_URL no está configurada.");
      }

      const response = await axios.post(`${API_URL}/generate-pdf`, {...formData, lang}, { responseType: 'blob' });
      
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const fileName = `invoice_${formData.invoiceNumber}.pdf`;
      
      const { error: insertError } = await supabase.from('documentos').insert({ user_id: user.id, file_name: fileName, form_data: formData });
      if (insertError) throw insertError;

      saveAs(pdfBlob, fileName);
      setNotification({ message: '¡Documento generado y guardado con éxito!', type: 'success' });
      await fetchDocuments();

    } catch (error) {
      console.error('Error in generation process:', error);
      const errorMessage = error.response?.data?.message || error.message || t('error_generic');
      setNotification({ message: `Error en la generación: ${errorMessage}`, type: 'error' });
    }
  };

  const promptDeleteDocument = (docId) => {
    setDocToDelete(docId);
    setIsModalOpen(true);
  };

  const confirmDeleteDocument = async () => {
    if (!docToDelete) return;
    try {
      const { error } = await supabase.from('documentos').delete().eq('id', docToDelete);
      if (error) throw error;
      setNotification({ message: 'Documento borrado con éxito.', type: 'success' });
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      setNotification({ message: `Error al borrar el documento: ${error.message}`, type: 'error' });
    } finally {
      setIsModalOpen(false);
      setDocToDelete(null);
    }
  };

  const handleActionError = (errorMessage) => {
    setNotification({ message: errorMessage, type: 'error' });
  };

  return (
    <>
      <div className={styles.dashboardContainer}>
        <div className={styles.formSection}>
          <Notification message={notification.message} type={notification.type} onDismiss={() => setNotification({ message: '', type: '' })} />
          <DocumentForm onGenerate={handleGenerateDocument} />
        </div>
        <div className={styles.listSection}>
          <h2>{t('my_documents')}</h2>
          
          {/* ===== LÍNEA DE DEPURACIÓN VISUAL ===== */}
          <div style={{ background: '#333', color: 'white', padding: '1rem', margin: '1rem 0', borderRadius: '8px', fontFamily: 'monospace' }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>--- DEBUG INFO ---</p>
            <p style={{ margin: '5px 0 0 0' }}>API URL: <span style={{ color: process.env.REACT_APP_API_URL ? 'lightgreen' : 'red', fontWeight: 'bold' }}>{process.env.REACT_APP_API_URL || "VARIABLE NO ENCONTRADA"}</span></p>
          </div>
          {/* ======================================= */}
          
          {isFetching ? (
            <Spinner /> 
          ) : (
            <DocumentList 
              documents={documents} 
              onActionStart={(id) => setLoadingDocId(id)}
              onActionEnd={() => setLoadingDocId(null)}
              loadingDocId={loadingDocId}
              onDelete={promptDeleteDocument}
              onError={handleActionError} 
            />
          )}
        </div>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        title={t('confirm_delete_title')}
        message={t('confirm_delete_message')}
        onConfirm={confirmDeleteDocument}
        onCancel={() => setIsModalOpen(false)}
        confirmText={t('confirm_delete_button')}
        cancelText={t('cancel_button')}
      />
    </>
  );
};

export default DashboardPage;