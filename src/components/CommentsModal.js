import React from 'react';
import Modal from 'react-modal';
import '../css/modal.css';
const CommentsModal = ({ isOpen, closeModal, comments }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Comentarios Modal"
        >
            <h2>Comentarios</h2>
            {comments.length === 0 ? (
                <p>Sin comentarios</p>
            ) : (
                <ul>
                    {comments.map(comment => (
                        <li key={comment.id}>
                            <strong>{comment.owner.firstName}:</strong> {comment.message}
                        </li>
                    ))}
                </ul>
            )}
            <div className='botones'>
            <button className='boton-modal' onClick={closeModal}>Volver</button>
            </div>
        </Modal>
    );
};

export default CommentsModal;
