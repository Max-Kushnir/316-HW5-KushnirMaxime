import React from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  if (!isOpen) return null;

  const maxWidth = size === 'large' ? '900px' : '600px';

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={{ ...styles.modal, maxWidth }} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>{title}</h2>
        </div>
        <div style={styles.body}>{children}</div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#90EE90',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    width: '90%',
  },
  header: {
    background: '#228B22',
    padding: '12px 16px',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  },
  headerTitle: {
    color: '#fff',
    margin: 0,
    fontSize: '20px',
  },
  body: {
    padding: '20px',
  },
};

export default Modal;
