import axios from 'axios';

// Cria a instância do axios
const api = axios.create({
  baseURL: 'http://localhost:8080/fornecedortelefone'
});

/*
Ao usar a baseURL ela por padrao manda sempre com uma / e isso quebra a url fazendo não buscar direito
Para resovler, usar a UrlBaseApis
*/

let UrlBaseApis = 'http://localhost:8080/fornecedortelefone'

// Busca Todos os telefones de um determinado Fornecedor com base em seu id de fornecedor
api.buscarTelefoneIdFornecedor = function(idFornecedor){
  return this.get(`fornecedor/${idFornecedor}`)
}

api.atualizarTelefonesFornecedor = function (idFornecedor, idTelefone, telefone) {
  return api.put(`${UrlBaseApis}?idFornecedor=${idFornecedor}&idTelefone=${idTelefone}`, telefone);
}

api.criarTelefoneFornecedor = function (idFornecedor, telefone) {
  return api.post(`/${idFornecedor}`, telefone);
}

api.apagarTelefoneFornecedor = function (idTelefone) {
  return api.delete(`/${idTelefone}`, idTelefone);
}

export default api;
