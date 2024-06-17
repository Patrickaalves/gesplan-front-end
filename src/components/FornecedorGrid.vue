<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <button @click="controleMostrarFuncionarios()" type="button" class="btn btn-success btn-lg m-1">Novo
        Fornecedor</button>
      <button @click="controleMostrarEdicaoFuncionarios()" type="button"
        :class="{ 'btn btn-warning m-2': algumaCheckboxSelecionada, 'btn btn-secondary m-2': !algumaCheckboxSelecionada }">
        <i class="bi bi-pencil"></i>
      </button>
      <button @click="deletarFornecedores()" type="button"
        :class="{ 'btn btn-danger m-2': algumaCheckboxSelecionada, 'btn btn-secondary m-2': !algumaCheckboxSelecionada }">
        <i class="bi bi-trash"></i>
      </button>
    </nav>
    <FornecedorFormulario v-if="mostrar_formulario" @close="controleMostrarFuncionarios()" @save="controleMostrarFuncionarios(true)" />

    <FornecedorEditar v-if="editar_fornecedor_formulario" :idFornecedor="idFornecedorSelecionado" @close="controleMostrarEdicaoFuncionarios()" 
    @save="controleMostrarEdicaoFuncionarios()" @fecharEdicao="controleMostrarEdicaoFuncionarios(true)"/>


    <div v-if="fornecedores && fornecedores.content.length > 0">
      <table class="table">
        <thead>
          <tr>
            <th><input type="checkbox" disabled /></th>
            <th scope="col">NOME</th>
            <th scope="col">EMAIL</th>
            <th scope="col">TELEFONE</th>
            <th scope="col">TIPO DE FORNECEDOR</th>
            <th scope="col">OBSERVACAO</th>
            <th scope="col"><i class="bi bi-star"></i></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fornecedor in fornecedores.content" :key="fornecedor.id">
            <td><input type="checkbox" v-model="fornecedorSelecionado[fornecedor.id]" /></td>
            <td>{{ fornecedor.nome }}</td>
            <td>{{ fornecedor.email }}</td>
            <td>
              <div v-for="telefone in telefones[fornecedor.id]" :key="telefone.id">
                {{ telefone.numeroTelefone }}
              </div>
            </td>
            <td>{{ fornecedor.tipoDeFornecedor }}</td>
            <td>{{ fornecedor.observacao }}</td>
            <td>
              <i class="bi bi-star-fill" :class="{ 'star-selected': fornecedor.favorito }"
                @click="alternarFavorito(fornecedor)">
              </i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>Nenhum fornecedor encontrado.</p>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent, onMounted, watch } from 'vue';
import apiFornecedores from '@/service/ApiFornecedorGrid.js';
import apiFornecedoresTelefone from '@/service/ApiFornecedoresTelefone';

import FornecedorFormulario from '@/components/FornecedorFormulario.vue'
import FornecedorEditar from '@/components/FornecedorEditar.vue'

export default defineComponent({

  components: {
    FornecedorFormulario,
    FornecedorEditar
  },

  setup() {
    const fornecedores = ref(null);
    const telefones = ref({});
    const fornecedorSelecionado = ref({}); // Objeto para controlar checkboxes selecionadas
    const algumaCheckboxSelecionada = ref(false); // Variável para verificar se alguma checkbox está selecionada
    const mostrar_formulario = ref(false)
    const editar_fornecedor_formulario = ref(false)
    const idFornecedorSelecionado = ref(null); // ID do fornecedor selecionado para edição

    // Carregar a grid com os dados dos fornecedores
    const fetchFornecedores = () => {
      apiFornecedores.listarFornecedoresGrid()
        .then(response => {
          fornecedores.value = response.data;
          fornecedores.value.content.forEach(fornecedor => {
            fetchTelefonesFornecedor(fornecedor.id);
          });
        })
        .catch(error => {
          console.error('Erro ao buscar fornecedores:', error);
        });
    };

    // Busca os telefones de determinado fornecedor
    const fetchTelefonesFornecedor = (id) => {
      apiFornecedoresTelefone.buscarTelefoneIdFornecedor(id)
        .then(response => {
          telefones.value[id] = response.data;
        })
        .catch(error => {
          console.error('Erro ao buscar telefones do fornecedor:', error);
        });
    };

    // Alternar o favorito tanto na aplicacao quanto no banco de dados
    const alternarFavorito = (fornecedor) => {
      fornecedor.favorito = !fornecedor.favorito;
      apiFornecedores.atualizarCampoFavoritoFornecedor(fornecedor)
        .then(response => {
          fetchFornecedores()
        })
        .catch(error => {
          console.error('Erro ao atualizar fornecedor:', error);
        });
    };

    // Verificar se alguma checkbox está selecionada
    const verificarAlgumaSelecionada = () => {
      let algumaSelecionada = false;
      for (let key in fornecedorSelecionado.value) {
        if (fornecedorSelecionado.value[key]) {
          algumaSelecionada = true;
          break;
        }
      }
      algumaCheckboxSelecionada.value = algumaSelecionada;
    };

    const deletarFornecedores = () => {
      if (algumaCheckboxSelecionada.value != null) {
        Object.keys(fornecedorSelecionado.value).forEach(idFornecedor => {
          if (fornecedorSelecionado.value[idFornecedor]) {
            apiFornecedores.apagarFornecedoresPorId(idFornecedor)
              .then(() => {
                // Atualize os fornecedores após a deleção
                algumaCheckboxSelecionada.value = false
                fetchFornecedores();
              })
              .catch(error => {
                console.error(`Erro ao deletar fornecedor ${idFornecedor}:`, error);
              });
          }
        });

        for (let key in fornecedorSelecionado.value) {
          fornecedorSelecionado.value[key] = false;
        }
        
      }
    };

    // Exibir formulario de cadastro de fornecedores ou fechar o formulario
    const controleMostrarFuncionarios = (prm_salvar) => {
      mostrar_formulario.value = !mostrar_formulario.value
      if (prm_salvar == true) {
        fetchFornecedores();
      }
    }

    const controleMostrarEdicaoFuncionarios = (prm_fechar) => {
      // Verificar se há apenas um fornecedor selecionado
      let idsSelecionados = Object.keys(fornecedorSelecionado.value).filter(key => fornecedorSelecionado.value[key]);
      if (idsSelecionados.length === 1) {
        // Definir o ID do fornecedor selecionado para edição
        idFornecedorSelecionado.value = idsSelecionados[0];
        editar_fornecedor_formulario.value = true;
      }
      // Se prm_fechar for verdadeiro, fechar o formulário de edição
      if (prm_fechar) {
        editar_fornecedor_formulario.value = false;

        // Desmarcar todas as checkboxes
        for (let key in fornecedorSelecionado.value) {
          fornecedorSelecionado.value[key] = false;
        }
      }
};

    // Monitorar mudanças nas checkboxes selecionadas
    watch(fornecedorSelecionado, verificarAlgumaSelecionada, { deep: true });

    onMounted(() => {
      fetchFornecedores();
    });

    return {
      fornecedores,
      telefones,
      fornecedorSelecionado,
      algumaCheckboxSelecionada,
      alternarFavorito,
      deletarFornecedores,
      mostrar_formulario,
      controleMostrarFuncionarios,
      editar_fornecedor_formulario,
      controleMostrarEdicaoFuncionarios,
      idFornecedorSelecionado // Retornar ID do fornecedor selecionado para edição
    };
  },
});
</script>

<style>
.bi-star-fill {
  cursor: pointer;
  transition: color 0.3s, background-color 0.3s;
}

.star-selected {
  color: gold;
  background-color: rgba(255, 215, 0, 0.3);
  border-radius: 50%;
}
</style>
