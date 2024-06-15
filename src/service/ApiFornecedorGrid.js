import axios from 'axios';

// Cria a instância do axios
const api = axios.create({
  baseURL: 'http://localhost:8080/fornecedor'
});

// buscaTodosOsFornecedores
api.getCadastros = function() {
  return this.get();
};

export default api;
