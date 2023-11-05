import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../NavBar';
import { useRef } from 'react';
import Swal from 'sweetalert2';



const EditProductScreen = () => {
    const { id } = useParams(); // pegue o ID do produto da URL
    const navigate = useNavigate();
    const inputFileRef = useRef();
    const [product, setProduct] = useState({
        nome: '',
        descricao: '',
        preco: '',
        imagem: '',
        promocional: false,
        ativo: true,
        storeId: ''
    });

    const maskPrice = (value) => {
        let v = value.replace(/\D/g,''); 
        v = (v / 100).toFixed(2) + ''; 
        v = v.replace(".", ",");
        return v;
    }
    
    
    


    // Função para buscar o produto quando a página for carregada
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Erro ao buscar produto:", error);
            }
        };

        fetchProduct();
    }, [id]);

    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setProduct(prevState => ({ ...prevState, [name]: value }));
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/products/${id}`, product);
            Swal.fire(
                'Sucesso!',
                'Produto atualizado com sucesso!',
                'success'
            ).then(() => navigate('/admin')); // redirecionar para a página de administração após atualização
        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
            Swal.fire(
                'Erro!',
                'Não foi possível atualizar o produto. Por favor, tente novamente.',
                'error'
            );
        }
    };
    const convertToBase64 = file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        const base64Image = await convertToBase64(file);

        setProduct(prevState => ({ ...prevState, imagem: base64Image }));
    };



    return (
        <div className="edit-product-container">
            <div className="header">
                Pevirt
            </div>
            <NavBar />
            <h2>Editar Produto</h2>
            <form onSubmit={handleProductSubmit}>
                <label>
                    Nome do Produto
                    <input
                        type="text"
                        name="nome"
                        value={product.nome}
                        onChange={handleProductChange}
                        placeholder="Nome do Produto"
                    />
                </label>
                <label>
                    Descrição
                    <input
                        type="text"
                        name="descricao"
                        value={product.descricao}
                        onChange={handleProductChange}
                        placeholder="Descrição"
                    />
                </label>
                <label>
                    Preço
                    <input
                        type="text"
                        name="preco"
                        placeholder="Preço"
                        value={product.preco}
                        onChange={e => {
                            const maskedValue = maskPrice(e.target.value);
                            handleProductChange({ target: { name: "preco", value: maskedValue } });
                        }}
                    />
                </label>
                <label>
                    Imagem do Produto
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={inputFileRef}
                    />
                </label>
                <label>
                    Promocional:
                    <input
                        type="checkbox"
                        name="promocional"
                        checked={product.promocional}
                        onChange={e => handleProductChange({
                            target: {
                                name: e.target.name,
                                value: e.target.checked
                            }
                        })}
                    />
                </label>
                <label>
                    Ativo:
                    <input
                        type="checkbox"
                        name="ativo"
                        checked={product.ativo}
                        onChange={e => handleProductChange({
                            target: {
                                name: e.target.name,
                                value: e.target.checked
                            }
                        })}
                    />
                </label>
                <button type="submit">Atualizar Produto</button>
            </form>
        </div>
    );
}

export default EditProductScreen;
