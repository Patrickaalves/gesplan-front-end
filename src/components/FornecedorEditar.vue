<template>
    <div class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Formulário</h5>
                    <button type="button" class="btn-close" @click="$emit('fecharEdicao')"></button>
                </div>
                <div class="modal-body">
                    <form class="needs-validation" @submit.prevent="AtualizarFornecedor" novalidate>
                        <div class="row mb-3">
                            <div class="col">
                                <label for="inputNome" class="form-label">Nome</label>
                                <input type="text" class="form-control" id="inputNome" v-model="novoFornecedor.nome" required>
                                <div class="invalid-feedback">
                                    Nome é obrigatório.
                                </div>
                            </div>
                            <div class="col">
                                <label for="inputEmail" class="form-label">Email</label>
                                <input type="email" class="form-control" id="inputEmail" v-model="novoFornecedor.email" required :class="{'is-invalid': !validarEmail(novoFornecedor.email) && novoFornecedor.email !== ''}">
                                <div class="invalid-feedback">
                                    {{ !validarEmail(novoFornecedor.email) && novoFornecedor.email !== '' ? 'Email inválido. Formato esperado: xxxxx@xxxx.com' : 'Email é obrigatório.' }}
                                </div>
                            </div>
                            <div class="col">
                                <label for="inputTipoFornecedor" class="form-label">Tipo de fornecedor</label>
                                <select class="form-select" id="inputTipoFornecedor" v-model="novoFornecedor.tipoDeFornecedor" required>
                                    <option disabled value="">Tipo de fornecedor</option>
                                    <option value="ATACADISTA">Atacadista</option>
                                    <option value="DISTRIBUIDOR">Distribuidor</option>
                                    <option value="FABRICANTE">Fabricante</option>
                                    <option value="VAREJISTA">Varejista</option>
                                </select>
                                <div class="invalid-feedback">
                                    Tipo de fornecedor é obrigatório.
                                </div>
                            </div>
                        </div>
                        <div v-for="(telefone, index) in novoFornecedor.telefones" :key="index" class="row mb-3">
                            <div class="col">
                                <label :for="'inputTelefone' + index" class="form-label">Telefone</label>
                                <input type="text" class="form-control" :id="'inputTelefone' + index" v-model="telefone.numeroTelefone" required :class="{'is-invalid': !validarTelefone(telefone.numeroTelefone) && telefone.numeroTelefone !== ''}">
                                <div class="invalid-feedback">
                                    {{ !validarTelefone(telefone.numeroTelefone) && telefone.numeroTelefone !== '' ? 'Telefone inválido. Formato esperado: (xx) x xxxx-xxxx' : 'Telefone é obrigatório.' }}
                                </div>
                            </div>
                            <div class="col align-self-end">
                                <button @click="AdicionarCampoTelefone" type="button" class="btn btn-success espaco-entre-botoes"><i class="bi bi-plus"></i></button>
                                <button @click="RemoverCampoTelefone(index)" v-if="novoFornecedor.telefones.length > 1" type="button" class="btn btn-danger"><i class="bi bi-trash"></i></button>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="inputObservacao" class="form-label">Observacao</label>
                            <textarea class="form-control" id="inputObservacao" rows="5" v-model="novoFornecedor.observacao"></textarea>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="$emit('fecharEdicao')">Cancelar</button>
                            <button type="submit" class="btn btn-success">Atualizar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { defineComponent, ref, onMounted } from 'vue';
import apiFornecedores from '@/service/ApiFornecedorGrid.js';
import apiFornecedoresTelefone from '@/service/ApiFornecedoresTelefone.js';

export default defineComponent({
    name: 'FornecedorEditar',
    props: {
        idFornecedor: {
            type: [String, Number],
            required: true
        }
    },
    setup(props, { emit }) {
        const novoFornecedor = ref({
            nome: '',
            email: '',
            tipoDeFornecedor: '',
            telefones: [{ idTelefone: null, numeroTelefone: '' }],
            observacao: '',
            favorito: false
        });

        const montarJsonFornecedor = () => ({
            nome: novoFornecedor.value.nome,
            email: novoFornecedor.value.email,
            tipoDeFornecedor: novoFornecedor.value.tipoDeFornecedor,
            observacao: novoFornecedor.value.observacao,
            favorito: novoFornecedor.value.favorito
        });

        // Busca os dados do fornecedor, para serem preenchidos ao abrir o formulario de edicao
        const buscarFornecedor = (idFornecedor) => {
            apiFornecedores.buscarFornecedorPorId(idFornecedor)
                .then(response => {
                    if (response.data) {
                        const fornecedor = response.data;
                        novoFornecedor.value.nome = fornecedor.nome;
                        novoFornecedor.value.email = fornecedor.email;
                        novoFornecedor.value.tipoDeFornecedor = fornecedor.tipoDeFornecedor;
                        novoFornecedor.value.observacao = fornecedor.observacao;
                        buscarTelefoneFornecedor(idFornecedor);
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar dados do fornecedor:', error);
                });
        };

        const AtualizarFornecedor = () => {
            if (validarFormulario()) {
                const fornecedorNovo = montarJsonFornecedor();
                apiFornecedores.atualizarFornecedorPorId(props.idFornecedor, fornecedorNovo)
                    .then(() => {
                        AtualizarTelefonesFornecedor();
                        emit('save');
                    })
                    .catch(error => {
                        console.error('Erro ao salvar fornecedor:', error);
                    });
            }
        };

        // Busca os telefones do fornecedor, para serem preenchidos ao abrir o formulario de edicao
        const buscarTelefoneFornecedor = async (idFornecedor) => {
            try {
                const response = await apiFornecedoresTelefone.buscarTelefoneIdFornecedor(idFornecedor);
                if (response.data && response.data.length > 0) {
                    novoFornecedor.value.telefones = response.data.map(tel => ({
                        idTelefone: tel.id,
                        numeroTelefone: tel.numeroTelefone
                    }));
                } else {
                    novoFornecedor.value.telefones = [{ idTelefone: null, numeroTelefone: '' }];
                }
            } catch (error) {
                console.error('Erro ao buscar telefones do fornecedor:', error);
            }
        };

        const AtualizarTelefonesFornecedor = () => {
            return Promise.all(novoFornecedor.value.telefones.map(telefone => {
                const { idTelefone, numeroTelefone } = telefone;
                if (idTelefone === null || idTelefone === undefined) {
                    return apiFornecedoresTelefone.criarTelefoneFornecedor(props.idFornecedor, { numeroTelefone })
                        .then(() => {
                            // Telefone criado com sucesso
                        })
                        .catch(error => {
                            console.error('Erro ao criar telefone:', error);
                            throw error; // Lança o erro para interromper o Promise.all
                        });
                } else {
                    return apiFornecedoresTelefone.atualizarTelefonesFornecedor(props.idFornecedor, idTelefone, { numeroTelefone })
                        .then(() => {
                            // Telefone atualizado com sucesso
                        })
                        .catch(error => {
                            console.error(`Erro ao atualizar telefone com ID ${idTelefone}:`, error);
                            throw error; // Lança o erro para interromper o Promise.all
                        });
                }
            })).then(() => {
                // Todos os telefones foram atualizados ou criados com sucesso
                // Emitir evento
                emit('fecharEdicao');
            });
        };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const telefoneRegex = /^\(\d{2}\)\s\d\s\d{4}-\d{4}$/;

        const validarEmail = (email) => emailRegex.test(email);
        const validarTelefone = (telefone) => telefoneRegex.test(telefone);

        const validarFormulario = () => {
            // Validação necessaria para o bootstrap
            const forms = document.querySelectorAll('.needs-validation');
            let isValid = true;

            Array.prototype.slice.call(forms).forEach(function (form) {
                if (!form.checkValidity()) {
                    isValid = false;
                    form.classList.add('was-validated');
                } else {
                    form.classList.remove('was-validated');
                }
            });

            // Validações feitas por min
            if (!validarEmail(novoFornecedor.value.email)) {
                isValid = false;
            }
            novoFornecedor.value.telefones.forEach(telefone => {
                if (!validarTelefone(telefone.numeroTelefone)) {
                    isValid = false;
                }
            });

            return isValid;
        };

        const AdicionarCampoTelefone = () => {
            novoFornecedor.value.telefones.push({ idTelefone: null, numeroTelefone: '' });
        };

        const RemoverCampoTelefone = (index) => {
            const telefone = novoFornecedor.value.telefones[index];

            if (telefone.idTelefone) {
                // Telefone veio da requisição, chama endpoint para exclusão
                apiFornecedoresTelefone.apagarTelefoneFornecedor(telefone.idTelefone)
                    .then(() => {
                        novoFornecedor.value.telefones.splice(index, 1);
                    })
                    .catch(error => {
                        console.error(`Erro ao excluir telefone com ID ${telefone.idTelefone}:`, error);
                    });
            } else {
                // Telefone não tem ID, apenas remove localmente
                novoFornecedor.value.telefones.splice(index, 1);
            }
        };

        onMounted(() => {
            buscarFornecedor(props.idFornecedor);
        });

        return {
            AtualizarFornecedor,
            AtualizarTelefonesFornecedor,
            AdicionarCampoTelefone,
            RemoverCampoTelefone,
            novoFornecedor,
            validarEmail,
            validarTelefone
        };
    }
});
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

.espaco-entre-botoes {
    margin-right: 10px;
}
</style>
