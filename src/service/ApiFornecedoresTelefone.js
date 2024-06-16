import axios from 'axios';

// Cria a instância do axios
const api = axios.create({
  baseURL: 'http://localhost:8080/fornecedortelefone/fornecedor'
});



// buscaTodosOsFornecedores
api.getTelefones = function(id) {
  return this.get(`/${id}`);
};

api.getTelefoneIdFornecedor = function(id){
  return this.get(`/${id}`)
}

api.updateTelefonesFornecedor = function (idFornecedor, idTelefone, telefone) {
  return api.put(`http://localhost:8080/fornecedortelefone/atualizarTelefone?idFornecedor=${idFornecedor}&idTelefone=${idTelefone}`, telefone);
}

api.createTelefoneFornecedor = function (idFornecedor, telefone) {
  return api.post(`http://localhost:8080/fornecedortelefone/${idFornecedor}`, telefone);
}

api.deleteTelefoneFornecedor = function (idTelefone) {
  return api.delete(`http://localhost:8080/fornecedortelefone/${idTelefone}`, idTelefone);
}

export default api;
