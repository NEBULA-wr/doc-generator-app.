import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { saveAs } from 'file-saver';
import styles from './DocumentList.module.css';

// --- Icon Components ---
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

// --- Main Component ---
const DocumentList = ({ documents, onActionStart, onActionEnd, loadingDocId, onDelete, onError }) => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleDocumentAction = async (doc, view = false) => {
    if (!doc || !doc.id) {
      console.error("Invalid document object passed to handleDocumentAction");
      onError(t('error_invalid_doc'));
      return;
    }
  
    onActionStart(doc.id);
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      
      const response = await axios.post(
        `${API_URL}/generate-pdf`,
        { ...doc.form_data, lang: i18n.language },
        { responseType: 'blob' }
      );
      
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      
      if (view) {
        const fileURL = URL.createObjectURL(pdfBlob);
        window.open(fileURL, '_blank');
      } else {
        saveAs(pdfBlob, doc.file_name);
      }

    } catch (error) {
      console.error("Error regenerating document:", error);
      const errorMessage = error.response?.data?.message || error.message || t('error_generic');
      onError(errorMessage);
    } finally {
      onActionEnd();
    }
  };

  const filteredAndSortedDocuments = useMemo(() => {
    if (!documents) return [];
    
    return [...documents]
      .filter(doc => 
        (doc.file_name && doc.file_name.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (doc.form_data?.name && doc.form_data.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [documents, searchTerm, sortOrder]);

  if (!documents || documents.length === 0) {
    return <p className={styles.emptyMessage}>{t('noDocuments')}</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <input 
          type="text" 
          placeholder={t('searchPlaceholder')}
          className={styles.searchInput}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select 
          className={styles.sortSelect} 
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
        >
          <option value="desc">{t('sortNewest')}</option>
          <option value="asc">{t('sortOldest')}</option>
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('clientLabel')}</th>
              <th className={styles.hideOnMobile}>{t('invoiceNumberLabel')}</th>
              <th className={styles.hideOnMobile}>{t('dateLabel')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedDocuments.map((doc) => (
              <tr key={doc.id}>
                <td>
                  <div className={styles.clientCell}>
                    {doc.form_data?.name || 'N/A'}
                    <div className={styles.mobileDetails}>
                      <span>{doc.form_data?.invoiceNumber || 'N/A'}</span>
                      <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </td>
                <td className={styles.hideOnMobile}>{doc.form_data?.invoiceNumber || 'N/A'}</td>
                <td className={styles.hideOnMobile}>{new Date(doc.created_at).toLocaleDateString()}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.actionButton} title={t('viewAction')} onClick={() => handleDocumentAction(doc, true)} disabled={loadingDocId === doc.id}>
                      {loadingDocId === doc.id ? '...' : <EyeIcon />}
                    </button>
                    <button className={styles.actionButton} title={t('downloadAction')} onClick={() => handleDocumentAction(doc, false)} disabled={loadingDocId === doc.id}>
                      {loadingDocId === doc.id ? '...' : <DownloadIcon />}
                    </button>
                    <button className={`${styles.actionButton} ${styles.deleteButton}`} title={t('deleteAction')} onClick={() => onDelete(doc.id)} disabled={loadingDocId === doc.id}>
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentList;