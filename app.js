    class Despesas {
        constructor(ano, mes, dia, tipo, descrição, valor) {
            this.Ano = ano
            this.Mes = mes 
            this.Dia = dia
            this.Tipo = tipo
            this.Descrição = descrição
            this.Valor = valor
        }

        validarDados() {
          for(let x in this) {
            if(this[x] == undefined || this[x] == null || this[x] == '' || this.Dia >= 32) {
                return false
            }                        
          }
          return true
        }
    }

    class Bd {
        constructor(){
            let id = localStorage.getItem('id')

            if (id === null) {
                localStorage.setItem('id', 0)
            }
        }
                
        ProximoId() {
            let proximoId = localStorage.getItem('id')
            return parseInt(proximoId) +1
        }
        
        gravar(d) {
            let id = this.ProximoId()
            localStorage.setItem(id, JSON.stringify(d))
            localStorage.setItem('id', id)         
        }

        carregaTodosRegistros() {
           let id = localStorage.getItem('id')

           let Despesas = Array()
            for(let x = 1; x <= id; x++) {
                let despesa = JSON.parse(localStorage.getItem(x)) 

                if(despesa === null) {
                    continue
                }
                despesa.id = x
                Despesas.push(despesa)                
            }
            return Despesas
        }
        pesquisar(despesa) {
            let despesasFiltradas = Array()
            despesasFiltradas = this.carregaTodosRegistros()
                                    
            // ano 
            if (despesa.Ano != '') {                
            despesasFiltradas = despesasFiltradas.filter(d => d.Ano == despesa.Ano)
            }
            // mes
            if (despesa.Mes != ''){            
            despesasFiltradas = despesasFiltradas.filter(d => d.Mes == despesa.Mes)
            }
            // dia 
            if (despesa.Dia != '') {                
            despesasFiltradas = despesasFiltradas.filter(d => d.Dia == despesa.Dia)
            }
            // tipo
            if (despesa.Tipo != '') {                
            despesasFiltradas = despesasFiltradas.filter(d => d.Tipo ==  despesa.Tipo)
            }
            // descrição
            if (despesa.Descrição != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.Descrição == despesa.Descrição)
            }
            // preço
            if (despesa.Valor != '') {                
            despesasFiltradas = despesasFiltradas.filter(d => d.Valor == despesa.Valor)
            }
            return despesasFiltradas
                  
        }
        remover(id) {
            localStorage.removeItem(id)
        }
        
    }

    let bd = new Bd()

 function cadastrarDespesas() {
    let Ano = document.getElementById('ano').value
    let Mes = document.getElementById('mes').value
    let Dia = document.getElementById('dia').value
    let Tipo = document.getElementById('tipo').value
    let Descrição = document.getElementById('descricao').value
    let Valor = document.getElementById('valor').value

    let despesas = new Despesas(Ano, Mes, Dia, Tipo, Descrição, Valor)

    if (despesas.validarDados()) {
        bd.gravar(despesas) 

        let modalTitulo = document.getElementById('modalTitulo')
        modalTitulo.innerHTML = 'Despesa cadastrada com sucesso!'
        modalTitulo.className = 'text-success'

        let button = document.getElementById('button')
        button.innerHTML = 'Voltar'
        button.className = 'btn btn-success'
        let modalBody = document.getElementById('modalBody')
        modalBody.innerHTML = 'Você pode consultar sua despesa na aba Consulta'
        

        $('#modeloModal').modal('show')

        let dia = document.getElementById('dia')
        dia.value = ''
        let mes = document.getElementById('mes')
        mes.value = ''
        let ano = document.getElementById('ano')
        ano.value = ''
        let tipo = document.getElementById('tipo')
        tipo.value = ''
        let valor = document.getElementById('valor')
        valor.value = ''
        let descrição = document.getElementById('descricao')
        descrição.value = ''
    }
    else {
        let modalTitulo = document.getElementById('modalTitulo')
        modalTitulo.innerHTML = 'Não foi possível cadastrar sua despesa...'
        modalTitulo.className = 'text-danger'

        let button = document.getElementById('button')
        button.innerHTML = 'Voltar e corrigir'
        button.className = 'btn btn-danger'

        let modalBody = document.getElementById('modalBody')
        modalBody.innerHTML = 'Preencha todas as informações para cadastrar sua despesa.'
       $('#modeloModal').modal('show')
    }
   
    
}


function carregaListaDepesas(despesas = Array(), filtro = false) {
    if (despesas.length == 0 && filtro == false) {
    despesas = bd.carregaTodosRegistros()
    }
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    despesas.forEach( 
        function(x) {            
            let linha = listaDespesas.insertRow()
            switch((parseInt(x.Tipo))) {
                case 1: x.Tipo = 'Alimentação'
                break
                case 2: x.Tipo = 'Educação'
                break
                case 3: x.Tipo = 'Lazer'
                break
                case 4: x.Tipo = 'Saúde'
                break
                case 5: x.Tipo = 'Transporte'
            }

            linha.insertCell(0).innerHTML = x.Dia + '/' + x.Mes + '/' + x.Ano
            linha.insertCell(1).innerHTML = x.Tipo           
            linha.insertCell(2).innerHTML = x.Descrição
            linha.insertCell(3).innerHTML = 'R$ '+ x.Valor 

            // criação do butão
            let btn = document.createElement('button')
            btn.className = 'btn btn-danger '
            btn.innerHTML = '<i class="fas fa-times"><i>'
            btn.id = `id_despesa_${x.id}`
            btn.onclick = function excluirDespesa() {
                let id = this.id.replace('id_despesa_', '')     

                let modalTitulo = document.getElementById('modalTitulo')
                modalTitulo.innerHTML = 'Despesa excluída com sucesso!'
                modalTitulo.className = 'text-success'
        
                let button = document.getElementById('button')
                button.innerHTML = 'Voltar'
                button.className = 'btn btn-success'
                button.onclick = function() {
                    linha.remove()
                }
                let btnClose = document.getElementById('btn-close')
                btnClose.onclick = function() {
                    linha.remove()
                }
                let modalBody = document.getElementById('modalBody')
                modalBody.innerHTML = 'Você pode cadastrar uma nova despesa na aba Cadastro.'
               $('#modeloModal').modal('show')

                bd.remover(id)                  
                
            }
            linha.insertCell(4).append(btn)
    }
    )

}
    
function pesquisarDespesas() {
    let Ano = document.getElementById('ano').value
    let Mes = document.getElementById('mes').value
    let Dia = document.getElementById('dia').value
    let Tipo = document.getElementById('tipo').value
    let Descrição = document.getElementById('descricao').value
    let Valor = document.getElementById('valor').value

    let despesa = new Despesas(Ano, Mes, Dia, Tipo, Descrição, Valor)

    let despesas = bd.pesquisar(despesa)  
    
    carregaListaDepesas(despesas, true)
   

    
}

