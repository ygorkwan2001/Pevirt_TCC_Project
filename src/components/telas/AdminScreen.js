import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';
import axios from 'axios';
import '../estilos/adminscreen.css';
import '../estilos/storecreated.css';
import { getData } from '../config/storage'
import swal from 'sweetalert';

const AdminScreen = () => {
    const navigate = useNavigate();
    const [lojas, setLojas] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const initialStore = { nome: '', endereco: '' };
    const [store, setStore] = useState(initialStore);
    const initialProduct = { nome: '', descricao: '', preco: '', imagem: '', promocional: false, ativo: true, storeId: '' };
    const [product, setProduct] = useState(initialProduct);


    const inputFileRef = useRef();

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

    useEffect(() => {
        const fetchLojas = async () => {
            try {
                const response = await axios.get('http://localhost:5000/stores');
                setLojas(response.data);
            } catch (error) {
                console.error("Erro ao buscar lojas:", error);
            }
        };

        const fetchProdutos = async () => {
            try {
                const response = await axios.get('http://localhost:5000/products');
                setProdutos(response.data);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            }
        };

        fetchLojas();
        fetchProdutos();
    }, []);

    const user = getData('user');
    console.log("Usuário atual:", user);

    if (!user || user.tipo !== 'Lojista') {
        swal({
            title: "Acesso Negado!",
            text: "Desculpe, você não tem acesso ao painel administrativo.",
            icon: "error",
            button: "Entendi",
        }).then(() => {
            navigate('/homepage');
        });
        return null;
    }

    const handleStoreChange = (e) => {
        const { name, value } = e.target;
        setStore(prevState => ({ ...prevState, [name]: value }));
    };

    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setProduct(prevState => ({ ...prevState, [name]: value }));
    };

    const handleStoreSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/stores', store);
            alert("Loja cadastrada com sucesso!");  // Adicionando alerta de sucesso
            navigate('/homepage');  // Redirecionando para a homepage
        } catch (error) {
            console.error("Erro ao salvar loja:", error);
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/products', product);
            alert("Produto cadastrado com sucesso!");  // Adicionando alerta de sucesso
            navigate('/homepage');  // Redirecionando para a homepage
        } catch (error) {
            console.error("Erro ao salvar produto:", error);
        }
    };


    const handleEdit = (id) => {
        navigate(`/edit-loja/${id}`);
    };

    const handleEditProduct = (id) => {
        navigate(`/edit-product/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir essa loja?")) {
            try {
                await axios.delete(`http://localhost:5000/stores/${id}`);
                setLojas(prevLojas => prevLojas.filter(loja => loja.id !== id));
            } catch (error) {
                console.error("Erro ao excluir loja:", error);
            }
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir esse produto?")) {
            try {
                await axios.delete(`http://localhost:5000/products/${id}`);
                setProdutos(prevProdutos => prevProdutos.filter(produto => produto.id !== id));
            } catch (error) {
                console.error("Erro ao excluir produto:", error);
            }
        }
    };

    return (
        <div className="admin-container">
            <div className="header">
                Pevirt
            </div>
            <NavBar />

            <h1>Painel Administrativo</h1>

            {showConfirmation && <p>Cadastro realizado com sucesso!</p>}

            <section className="section-store">
                <h2>Cadastrar Loja</h2>
                <form onSubmit={handleStoreSubmit}>
                    <input type="text" name="nome" placeholder="Nome da Loja" value={store.nome} onChange={handleStoreChange} />
                    <input type="text" name="endereco" placeholder="Endereço" value={store.endereco} onChange={handleStoreChange} />
                    <button type="submit">Salvar Loja</button>
                </form>
            </section>



            <section className="section-product">
                <h2>Cadastrar Produto</h2>
                <form onSubmit={handleProductSubmit}>
                    <input type="text" name="nome" placeholder="Nome do Produto" value={product.nome} onChange={handleProductChange} />
                    <textarea name="descricao" placeholder="Descrição" value={product.descricao} onChange={handleProductChange}></textarea>
                    <input type="text" name="preco" placeholder="Preço" value={product.preco} onChange={handleProductChange} />
                    <input type="file" accept="image/*" placeholder="Imagem do Produto" onChange={handleImageChange} ref={inputFileRef} />
                    <label>
                        <input type="checkbox" name="promocional" checked={product.promocional} onChange={e => setProduct({ ...product, promocional: e.target.checked })} /> Produto Promocional
                    </label>
                    <label>
                        <input type="checkbox" name="ativo" checked={product.ativo} onChange={e => setProduct({ ...product, ativo: e.target.checked })} /> Produto Ativo
                    </label>
                    <h3>Vincular Loja</h3>
                    <select name="storeId" value={product.storeId} onChange={handleProductChange}>
                        <option value="">Selecione uma loja</option>
                        {lojas.map(loja => (
                            <option key={loja.id} value={loja.id}>{loja.nome}</option>
                        ))}
                    </select>
                    <button type="submit">Salvar Produto</button>
                </form>
            </section>


            <section className="section-store-list">
                <h2>Produtos Cadastrados</h2>
                <table className="store-table">
                    <thead>
                        <tr>
                            <th>Nome do Produto</th>
                            <th>Descrição</th>
                            <th>Preço</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtos.map(produto => (
                            <tr key={produto.id}>
                                <td>{produto.nome}</td>
                                <td>{produto.descricao}</td>
                                <td>{produto.preco}</td>
                                <td>
                                    <button onClick={() => handleEditProduct(produto.id)}>Editar</button>
                                    <button onClick={() => handleDeleteProduct(produto.id)}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>






        </div>
    );
}

export default AdminScreen;
