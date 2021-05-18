var db = openDatabase('aulas', '1.0', 'Gravando as aulas', 2 * 1024 * 1024);

var botao = document.querySelector('.btnSalvar')
var btnDeletar = document.querySelector('.btn-deletar')
var input_data = document.querySelector('.data')
var hora = document.querySelector('.hora')
var aula = document.querySelector('.aula')
var msg = document.querySelector('.msg')

var dados = $(".dados")

db.transaction(function (tx) {   
    tx.executeSql('CREATE TABLE IF NOT EXISTS aulas (id unique, data TEXT, hora TEXT, aula TEXT)'); 
 });

function carregarDados() {

    dados.html("")

    db.transaction(function(tx) {

        tx.executeSql('SELECT * FROM aulas', [], function(tx, results) {

            var len = results.rows.length

            for (i = 0; i <= len; i ++) {

                var myHtmlContent = '<tr> <td> ' + results.rows[i].data + ' </td> <td> ' + results.rows[i].hora + ' </td> <td> ' + results.rows[i].aula + ' </td> <td> <a href="#" class="edit"> <i class="fa fa-edit"></i> </a> <a href="#" class="excluir"> <i class="fa fa-trash"></i> </a> </td> </tr>';

                dados.prepend(myHtmlContent)

            }

        })

    })

}

carregarDados()

btnDeletar.addEventListener("click", function() {

    msg.classList.remove('ocultar')

    setTimeout(function() {

        msg.classList.add('ocultar')

     }, 3000)

    db.transaction(function (tx) { 
        tx.executeSql("DROP TABLE aulas",[], 
        function(tx,results){msg.innerHTML = "Deletado com sucesso"},
        function(tx,error){msg.innerHTML = "Falha ao deletar"}
        );
    })

    carregarDados()

})

input_data.addEventListener("change", function() {

    var data = this.value;
    var hora = document.querySelector('.hora').value

    db.transaction(function (tx) { 

        tx.executeSql('SELECT data, hora, aula FROM aulas WHERE data = "' + data + '" AND hora = "' + hora + '"' , [], function(tx, results) {
            if (results.rows.length == 0) {

                aula.value = ""

            } else {

                aula.value = results.rows[0].aula

            }
        })
     })

})

hora.addEventListener("blur", function() {

    var data = document.querySelector('.data').value
    var hora = this.value

    db.transaction(function (tx) { 

        tx.executeSql('SELECT data, hora, aula FROM aulas WHERE data = "' + data + '" AND hora = "' + hora + '"' , [], function(tx, results) {
            if (results.rows.length == 0) {

                aula.value = ""

            } else {

                aula.value = results.rows[0].aula

            }
        })
     })

})

 botao.addEventListener("click", function() {

    msg.classList.remove('ocultar')

    setTimeout(function() {

        msg.classList.add('ocultar')

     }, 3000)

     var data = document.querySelector('.data').value;
     var aula = document.querySelector('.aula').value;
     var hora = document.querySelector('.hora').value;

     if (data == "") {
        msg.classList.remove('alert-info')
        msg.classList.add('alert-warning')
        msg.innerHTML = "Selecione a data"
        return false
     }

     db.transaction(function (tx) { 

        tx.executeSql('SELECT data FROM aulas WHERE data = "' + data + '" AND hora = "' + hora + '"', [], function(tx, results) {
            if (results.rows.length == 0) {

                
                    tx.executeSql('INSERT INTO aulas (data, hora, aula) VALUES ("' + data + '","' + hora + '","' + aula + '")',[], 
                    function(tx,results){msg.innerHTML = "Salvo com Sucesso"},
                    function(tx,error){msg.innerHTML = "Falha ao salvar"}
                    );

                    carregarDados()
                
        
             } else {
        
                
                    tx.executeSql('UPDATE aulas SET aula = "' + aula + '" WHERE data = "' + data + '" AND hora = ' + '"' + hora + '"',[], 
                    function(tx,results){msg.innerHTML = "Atualizado com sucesso"},
                    function(tx,error){msg.innerHTML = "Falha ao atualizar"}
                    );

                    carregarDados()
                
        
             }
        })
     })
 
 })