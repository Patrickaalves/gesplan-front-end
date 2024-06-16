import axios from 'axios';

// Cria a instância do axios
const api = axios.create({
  baseURL: 'http://localhost:8080/fornecedortelefone/fornecedor'
});

// buscaTodosOsFornecedores
api.getTelefones = function(id) {
  return this.get(`/${id}`);
};

export default api;
