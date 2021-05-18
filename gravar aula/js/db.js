var db = openDatabase('aulas', '1.0', 'Gravando as aulas', 2 * 1024 * 1024);

var botao = document.querySelector('.btnSalvar')
var btnDeletar = document.querySelector('.btn-deletar')
var input_data = document.querySelector('.data')
var aula = document.querySelector('.aula')
var msg = document.querySelector('.msg')

db.transaction(function (tx) {   
    tx.executeSql('CREATE TABLE IF NOT EXISTS aulas (id unique, data TEXT, aula TEXT)'); 
 });

btnDeletar.addEventListener("click", function() {
    db.transaction(function (tx) { 
        tx.executeSql("DROP TABLE aulas",[], 
        function(tx,results){msg.innerHTML = "Successfully Dropped"},
        function(tx,error){msg.innerHTML = "Could not delete"}
        );
    })

})

input_data.addEventListener("change", function() {

    var data = this.value;

    db.transaction(function (tx) { 

        tx.executeSql('SELECT data, aula FROM aulas WHERE data = "' + data + '"', [], function(tx, results) {
            if (results.rows.length == 0) {

                //Não encontrou registros desta data

            } else {

                aula.value = results.rows[0].aula

            }
        })
     })

})

 botao.addEventListener("click", function() {

     var data = document.querySelector('.data').value;
     var aula = document.querySelector('.aula').value;

     db.transaction(function (tx) { 

        tx.executeSql('SELECT data FROM aulas WHERE data = "' + data + '"', [], function(tx, results) {
            if (results.rows.length == 0) {

                
                    tx.executeSql('INSERT INTO aulas (data, aula) VALUES ("' + data + '","' + aula + '")',[], 
                    function(tx,results){msg.innerHTML = "Salvo com Sucesso"},
                    function(tx,error){msg.innerHTML = "Falha ao salvar"}
                    );
                
        
             } else {
        
                
                    tx.executeSql('UPDATE aulas SET aula = "' + aula + '" WHERE data = "' + data + '"',[], 
                    function(tx,results){msg.innerHTML = "Atualizado com sucesso"},
                    function(tx,error){msg.innerHTML = "Falha ao atualizar"}
                    );
                
        
             }
        })
     })
 
 })