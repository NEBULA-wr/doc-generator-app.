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
      const response = await axios.post('http://localhost:5001/api/generate-pdf', {...formData, lang}, { responseType: 'blob' });
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const fileName = `invoice_${formData.invoiceNumber}.pdf`;
      const { error: insertError } = await supabase.from('documentos').insert({ user_id: user.id, file_name: fileName, form_data: formData });
      if (insertError) throw insertError;
      saveAs(pdfBlob, fileName);
      setNotification({ message: '¡Documento generado y guardado con éxito!', type: 'success' });
      await fetchDocuments();
    } catch (error) {
      console.error('Error in generation process:', error);
      setNotification({ message: `Error en la generación: ${error.message}`, type: 'error' });
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
        title="Confirmar Borrado"
        message="¿Estás seguro de que quieres borrar este documento? Esta acción no se puede deshacer."
        onConfirm={confirmDeleteDocument}
        onCancel={() => setIsModalOpen(false)}
        confirmText="Sí, borrar"
        cancelText="Cancelar"
      />
    </>
  );
};

export default DashboardPage;