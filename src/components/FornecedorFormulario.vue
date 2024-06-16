<template>
    <div class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Formulário</h5>
                    <button type="button" class="btn-close" @click="$emit('close')"></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="row mb-3">
                            <div class="col">
                                <label for="inputNome" class="form-label">Nome</label>
                                <input type="text" class="form-control" id="inputNome" v-model="novoFornecedor.nome">
                            </div>
                            <div class="col">
                                <label for="inputEmail" class="form-label">Email</label>
                                <input type="text" class="form-control" id="inputEmail" v-model="novoFornecedor.email">
                            </div>
                            <div class="col">
                                <label for="inputTipoFornecedor" class="form-label">Tipo de fornecedor</label>
                                <select class="form-select" id="inputTipoFornecedor" v-model="novoFornecedor.tipoDeFornecedor">
                                    <option selected>Tipo de fornecedor</option>
                                    <option value="ATACADISTA">Atacadista</option>
                                    <option value="DISTRIBUIDOR">Distribuidor</option>
                                    <option value="FABRICANTE">Fabricante</option>
                                    <option value="VAREJISTA">Varejista</option>
                                </select>
                            </div>
                        </div>
                    </form>
                    <form v-for="(item, index) in listaCampoTelefone" :key="index">
                        <div class="row mb-3">
                            <div class="col">
                                <label :for="'inputTelefone' + index" class="form-label">Telefone</label>
                                <input type="text" class="form-control" :id="'inputTelefone' + index" v-model="novoFornecedor.telefones[index].numeroTelefone">
                            </div>
                            <div class="col align-self-end">
                                <button @click="AdicionarCampoTelefone()" type="button" class="btn btn-success espaco-entre-botoes"><i class="bi bi-plus"></i></button>
                                <button @click="RemoverCampoTelefone(index)" v-if="contadorCampoTelefone > 0" type="button" class="btn btn-danger"><i class="bi bi-trash"></i></button>
                            </div>
                        </div>
                    </form>
                    <form action="">
                        <label for="inputObservacao" class="form-label">Observacao</label>
                        <textarea class="form-control" id="inputObservacao" rows="5" v-model="novoFornecedor.observacao"></textarea>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="$emit('close')">Cancelar</button>
                    <button type="button" class="btn btn-success" @click="salvarFornecedor">Salvar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref,onMounted } from 'vue';
import apiFornecedores from '@/service/ApiFornecedorGrid.js';

export default defineComponent({
    name: 'FornecedorFormulario',
    setup(props, { emit }) {

        const novoFornecedor = ref({
            nome: '',
            email: '',
            tipoDeFornecedor: '',
            telefones: [{ numeroTelefone: '' }],
            observacao: ''
        });
        const contadorCampoTelefone = ref(-1)
        const listaCampoTelefone = ref([])

        const salvarFornecedor = () => {
            const fornecedorNovo = montarJsonFornecedor();

            apiFornecedores.salvarFornecedor(fornecedorNovo)
                .then(response => {
                    emit('save')
                })
                .catch(error => {
                    console.error('Erro ao buscar fornecedores:', error);
            });

        }

        const montarJsonFornecedor = () => {
            const fornecedorParaSalvar = {
                nome: novoFornecedor.value.nome,
                email: novoFornecedor.value.email,
                tipoDeFornecedor: novoFornecedor.value.tipoDeFornecedor,
                telefones: novoFornecedor.value.telefones.map(telefone => ({ numeroTelefone: telefone.numeroTelefone })),
                observacao: novoFornecedor.value.observacao,
                favorito: false
            }; 

            return fornecedorParaSalvar
        }

        const AdicionarCampoTelefone = () => {
            contadorCampoTelefone.value++;
            listaCampoTelefone.value.push('');
        }

        const RemoverCampoTelefone = (index) => {

            listaCampoTelefone.value.splice(index, 1);
            contadorCampoTelefone.value--;
        }

        onMounted(() => {
            AdicionarCampoTelefone();
        });

        return {
            salvarFornecedor,
            AdicionarCampoTelefone,
            listaCampoTelefone,
            contadorCampoTelefone,
            RemoverCampoTelefone,
            novoFornecedor
        }
    }
})
</script>

<style scoped>
.modal {
    background: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
    max-width: 1280px;
    width: 100%;
}

.modal-content {
    width: 100%;
    height: auto;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    position: relative;
}

.espaco-entre-botoes{
    margin-right: 10px;
}
</style>