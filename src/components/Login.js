import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './estilos/login.css';
import { Form, Button, Card } from 'react-bootstrap';
import { PersonFill, LockFill } from 'react-bootstrap-icons';
import Swal from 'sweetalert2';
import './estilos/backhomestyles.css'

const Login = ({setIsAuthenticated, setCurrentUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/users')
      .then((response) => response.json())
      .then((users) => {
        const user = users.find(
          (u) => u.email.trim() === email.trim() && u.senha.trim() === password.trim()
        );
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          setCurrentUser(user);
          Swal.fire('Sucesso', 'Login bem-sucedido!', 'success');
          setIsAuthenticated(true);
          navigate('/homepage');
        } else {
          Swal.fire('Erro', 'Email ou senha incorretos. Por favor, tente novamente.', 'error');
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar os usuários:", error);
        Swal.fire('Erro', 'Houve um erro ao verificar as credenciais. Tente novamente.', 'error');
      });
  };




  return (
    <Card className="login-card">
      <Card.Img variant="top" src="/images/logo.png" className="login-logo" />
      <Card.Body>
        <Form onSubmit={handleSubmit}>

          <div className="input-field">
            <i><PersonFill /></i>
            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          </div>

          <div className="input-field">
            <i><LockFill /></i>
            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" />
          </div>

          <Button type="submit" className="login-button">Entrar</Button>
          <Button variant="link" className="login-button register" onClick={() => navigate('/user')}>Criar novo usuário</Button>

          <Button variant="secondary" className="mt-3 back-to-homepage" onClick={() =>  navigate('/homepage')}>Voltar para Homepage</Button>

        </Form>
      </Card.Body>
    </Card>
  );
};

export default Login;
