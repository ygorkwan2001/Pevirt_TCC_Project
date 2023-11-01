import React, { useState } from 'react';
import { Form, Button, Row } from 'react-bootstrap';
import { getData } from '../components/config/storage';
import api from './api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './estilos/userform.css';

const User = () => {
  const navigate = useNavigate();
  const initialData = getData('user') || {
    email: '',
    telefone: '',
    nome: '',
    senha: '',
    tipo: ''
  };

  const [userData, setUserData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users', userData);
      if (response.status === 201) {
        Swal.fire('Sucesso', 'Dados do usuário salvos com sucesso!', 'success');
        navigate('/login');
      } else {
        Swal.fire('Erro', 'Ocorreu um erro ao salvar os dados do usuário.', 'error');
      }
    } catch (error) {
      Swal.fire('Erro', 'Ocorreu um erro ao salvar os dados do usuário.', 'error');
    }
  };

  const handleClear = () => {
    setUserData({
      email: '',
      telefone: '',
      nome: '',
      senha: '',
      tipo: ''
    });
  };



  return (
    <div className="user-screen">
      <div className="user-form-container">
        <img src="/images/cadastro.png" alt="Logo" className="user-logo" />
        <h2 className="user-form-title">Cadastro de Usuário</h2>
        <Form className="user-form" onSubmit={handleSubmit}>


          <Form.Group className="user-form-group">
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" name="email" value={userData.email} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="user-form-group">
            <Form.Label>Telefone</Form.Label>
            <Form.Control type="text" name="telefone" value={userData.telefone} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="user-form-group">
            <Form.Label>Nome</Form.Label>
            <Form.Control type="text" name="nome" value={userData.nome} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="user-form-group">
            <Form.Label>Senha</Form.Label>
            <Form.Control className="password-input" type="password" name="senha" value={userData.senha} onChange={handleChange} />
          </Form.Group>



          <Form.Group className="user-form-group">
            <Form.Label>Tipo</Form.Label>
            <Form.Control as="select" name="tipo" value={userData.tipo} onChange={handleChange}>
              <option value="">Selecione</option>
              <option value="Lojista">Lojista</option>
              <option value="Cliente">Cliente</option>
            </Form.Control>

          </Form.Group>

          <Button className="user-button" type="submit">Cadastrar</Button>
          <Button className="user-button" onClick={handleClear}>Limpar</Button>

          <Button variant="secondary" className="mt-3 back-to-homepage" onClick={() => navigate('/login')}>Voltar para Login</Button>

        </Form>
      </div>
    </div>
  );
};

export default User;
