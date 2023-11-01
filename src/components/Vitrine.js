import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { storeData, getData } from './storage';

const CardapioEletronico = () => {
  const initialData = getData('cardapioEletronico') || {
    logo: '',
    nome: '',
    sobrenome: '',
    back_color: '',
    back_image: '',
    cor_primaria: '',
    cor_secundaria: '',
    cor_terciaria: '',
    cor_quaternaria: ''
  };

  const [cardapioData, setCardapioData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardapioData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    storeData('cardapioEletronico', cardapioData);
    alert('Cardápio Eletrônico salvo com sucesso!');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Logo (URL)</Form.Label>
        <Form.Control type="text" name="logo" value={cardapioData.logo} onChange={handleChange} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Nome</Form.Label>
        <Form.Control type="text" name="nome" value={cardapioData.nome} onChange={handleChange} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Sobrenome</Form.Label>
        <Form.Control type="text" name="sobrenome" value={cardapioData.sobrenome} onChange={handleChange} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Cor de Fundo</Form.Label>
        <Form.Control type="color" name="back_color" value={cardapioData.back_color} onChange={handleChange} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Imagem de Fundo (URL)</Form.Label>
        <Form.Control type="text" name="back_image" value={cardapioData.back_image} onChange={handleChange} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Cor Primária</Form.Label>
        <Form.Control type="color" name="cor_primaria" value={cardapioData.cor_primaria} onChange={handleChange} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Cor Secundária</Form.Label>
        <Form.Control type="color" name="cor_secundaria" value={cardapioData.cor_secundaria} onChange={handleChange} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Cor Terciária</Form.Label>
        <Form.Control type="color" name="cor_terciaria" value={cardapioData.cor_terciaria} onChange={handleChange} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Cor Quaternária</Form.Label>
        <Form.Control type="color" name="cor_quaternaria" value={cardapioData.cor_quaternaria} onChange={handleChange} />
      </Form.Group>
      <Button type="submit">Salvar</Button>
    </Form>
  );
};

export default CardapioEletronico;
