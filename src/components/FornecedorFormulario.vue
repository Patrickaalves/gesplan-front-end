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
                                <input type="text" class="form-control" id="inputNome">
                            </div>
                            <div class="col">
                                <label for="inputEmail" class="form-label">Email</label>
                                <input type="text" class="form-control" id="input2">
                            </div>
                            <div class="col">
                                <label for="inputEmail" class="form-label">Tipo de fornecedor</label>
                                <select class="form-select" aria-label="Tipo de fornecedor">
                                    <option selected>Tipo de fornecedor</option>
                                    <option value="ATACADISTA">Atacadista</option>
                                    <option value="DISTRIBUIDOR">Distribuidor</option>
                                    <option value="FABRICANTE">Fabricante</option>
                                    <option value="VAREJISTA">Varejista</option>
                                </select>
                            </div>
                        </div>
                    </form>
                    <form action="">
                        <div class="row mb-3">
                            <div class="col">
                                <label for="inputTelefone" class="form-label">Telefone</label>
                                <input type="text" class="form-control" id="inputTelefone">
                            </div>
                            <div class="col align-self-end">
                                <button type="button" class="btn btn-success"><i class="bi bi-plus"></i></button>
                            </div>
                        </div>
                    </form>
                    <form action="">
                        <label for="inputObservacao" class="form-label">Observacao</label>
                        <textarea class="form-control" id="inputObservacao" rows="5"></textarea>
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
import { defineComponent } from 'vue';
import apiFornecedores from '@/service/ApiFornecedorGrid.js';

export default defineComponent({
    name: 'FornecedorFormulario',
    setup(props, { emit }) {

        const salvarFornecedor = () => {
            emit('save');
        }

        return {
            salvarFornecedor
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
    height: 720px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    position: relative;
}
</style>