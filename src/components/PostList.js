import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/PostList.css'; // Importa los estilos CSS
import CommentsModal from './CommentsModal';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://dummyapi.io/data/v1/post?page=${page}&limit=${pageSize}`, {
                    headers: {
                        'app-id': '66395de48ac6e15e5ad6466a' // Reemplaza 'your-app-id' con tu clave de API
                    }
                });
                setPosts(response.data.data);
            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };

        fetchData();
    }, [page, pageSize]);

    const handleNextPage = () => {
        setPage(page + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleTagSelection = (tag) => {
        if (selectedTags.includes(tag)) {
            // Si el tag ya está seleccionado, lo eliminamos
            setSelectedTags(selectedTags.filter(selectedTag => selectedTag !== tag));
        } else {
            // Si el tag no está seleccionado, lo agregamos
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const filteredPosts = selectedTags.length > 0 ? posts.filter(post => {
        return selectedTags.some(tag => post.tags.includes(tag));
    }) : posts;

    // Extraer tags únicos de los posts
    const allTags = posts.reduce((acc, post) => {
        post.tags.forEach(tag => {
            if (!acc.includes(tag)) {
                acc.push(tag);
            }
        });
        return acc;
    }, []);

    const handlePostClick = async (postId) => {
        try {
            const response = await axios.get(`https://dummyapi.io/data/v1/post/${postId}/comment`, {
                headers: {
                    'app-id': '66395de48ac6e15e5ad6466a' // Reemplaza 'your-app-id' con tu clave de API
                }
            });
            setComments(response.data.data);
            setSelectedPost(postId);
            setModalIsOpen(true);
        } catch (error) {
            console.error('Error al obtener comentarios:', error);
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedPost(null);
        setComments([]);
    };

    return (
        <div className="post-list">
            <div className='botones'>
                <button className='boton-1' onClick={handlePrevPage}>Página Anterior</button>
                <button className='boton-1' onClick={handleNextPage}>Página Siguiente</button>
            </div>
            <div className="filtro-perros">
                <h2>Selecciona los tags:</h2>
                <div>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            className={selectedTags.includes(tag) ? 'selected' : ''}
                            onClick={() => handleTagSelection(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                    <button
                        className={selectedTags.length === 0 ? 'selected' : ''}
                        onClick={() => setSelectedTags([])}
                    >
                        Cualquiera
                    </button>
                </div>
            </div>
            {filteredPosts.map(post => (
                <div key={post.id} className="card" onClick={() => handlePostClick(post.id)}>
                    <img src={post.image} alt="Post" className="post-image" />
                    <div className="card-content">
                        <h2>Usuario: {post.owner.firstName} {post.owner.lastName}</h2>
                        <div className="comentarios">
                            <p>
                                Comentario: {post.text}
                                <br></br>
                                <br></br>
                                Tags: {post.tags.join(', ')}
                            </p>
                            <h4 className="mensajemodal">
                                Click para ver los comentarios 
                            </h4>
                        </div>
                    </div>
                </div>
            ))}
            <CommentsModal isOpen={modalIsOpen} closeModal={closeModal} comments={comments} />
        </div>
    );
};

export default PostList;
