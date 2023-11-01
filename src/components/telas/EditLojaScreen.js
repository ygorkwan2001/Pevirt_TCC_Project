import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../NavBar';
import { useParams } from 'react-router-dom';

const EditLojaScreen = ({  }) => {
    const { id } = useParams();
    console.log(id);
    const [loja, setLoja] = useState(null);
    const [nome, setNome] = useState('');
    const [endereco, setEndereco] = useState('');

    useEffect(() => {
        const fetchLoja = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/stores/${id}`);
                setLoja(response.data);
                setNome(response.data.nome);
                setEndereco(response.data.endereco);
            } catch (error) {
                console.error("Erro ao buscar loja:", error);
            }
        };
        fetchLoja();
    }, [id]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/stores/${id}`, { nome, endereco });
            alert("Loja atualizada com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar loja:", error.response?.data || error.message);

        }
    };

    return (
        <div>
            <div className="edit-container">
                <div className="header">
                    Pevirt
                </div>
                <NavBar />
                <h1>Editar Loja</h1>
                <form onSubmit={handleSave}>
                    <lable>
                        Nome da Loja
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Nome"
                    />
                    </lable>
                    <label>
                        Endereço da Loja
                    <input
                        type="text"
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                        placeholder="Endereço"
                    />
                    </label>
                    <button type="submit">Salvar Alterações</button>
                </form>
            </div>
        </div>
    );
}

export default EditLojaScreen;
