var db = openDatabase('aulas', '1.0', 'Gravando as aulas', 2 * 1024 * 1024);

var botao = document.querySelector('.btnSalvar')
var btnDeletar = document.querySelector('.btn-deletar')
var input_data = document.querySelector('.data')
var hora = document.querySelector('.hora')
var aula = document.querySelector('.aula')
var msg = document.querySelector('.msg')

var dados = $(".dados")

var qtdAulas

function pad(str, length) {
    const resto = length - String(str).length;
    return '0'.repeat(resto > 0 ? resto : '0') + str;
  }

//Formatar data
function formatarData(data) {
    var data_sep = data.split('-')
    return data_sep[2] + '/' + data_sep[1] + '/' + data_sep[0]
}

//pegar data atual

function dataHoraAtualFomatada(tipo) {
    var data = new Date(),
        dia = data.getDate(),
        mes = data.getMonth() + 1,
        ano = data.getFullYear(),
        hora = data.getHours(),
        minutos = data.getMinutes(),
        segundos = data.getSeconds();

    if (tipo == "data") {

        return pad(ano, 2) + '-' + pad(mes, 2) + '-' + pad(dia, 2)

    } else {

       
            return pad(hora, 2) + ':' + '00'
        

    }
    
}

input_data.value = dataHoraAtualFomatada("data")

if (dataHoraAtualFomatada('hora') == '00') {
    hora.value = '23:00'
} else {
    hora.value = dataHoraAtualFomatada("hora")
}

$(".aula").on("keyup", function(evt) {
    evt = evt || window.event;
    var key = evt.keyCode || evt.which;
    var tecla = String.fromCharCode(key); 
    
    if (tecla == "U" || tecla == "u") {
        $(this).val("Unit")
    }

    if (tecla == "W" || tecla == "w") {
        $(this).val("Warm Up")
    }

    if (tecla == "C" || tecla == "c") {
        $(this).val("Click")
    }

    if (tecla == "O" || tecla == "o") {
        $(this).val("Oral Test")
    }

    if (tecla == "N" || tecla == "n") {
        $(this).val("NM")
    }

    if (tecla == "F" || tecla == "f") {
        $(this).val("Feriado")
    }

    if (tecla == "R" || tecla == "r") {
        $(this).val("Reunião")
    }

    if (tecla == "T" || tecla == "t") {
        $(this).val("Teens")
    }
    
})


db.transaction(function (tx) {   
    tx.executeSql('CREATE TABLE IF NOT EXISTS aulas (id unique, data TEXT, hora TEXT, aula TEXT)'); 
 });

function carregarDados() {

    dados.html("")

    db.transaction(function(tx) {

        tx.executeSql('SELECT rowid, * FROM aulas ORDER BY data', [], function(tx, results) {

            var len = results.rows.length

            qtdAulas = len

            if (len <= 0) {
                dados.prepend('<tr> <td> Não existem registros </td> </tr>')
            } else {
                $(".btn-whatsapp").fadeIn('slow')
            }

            for (i = 0; i < len; i ++) {

                var myHtmlContent = '<tr> <td> ' + formatarData(results.rows[i].data) + ' </td> <td> ' + results.rows[i].hora + ' </td> <td> ' + results.rows[i].aula + ' </td> <td> <a href="#" class="btnAcao edit" data-id = "' + results.rows[i].rowid + '"> <i class="fa fa-edit"></i> </a> <a href="#" class="btnAcao excluir" data-id = "' + results.rows[i].rowid + '"> <i class="fa fa-trash"></i> </a> </td> </tr>';

                dados.prepend(myHtmlContent)

            }

        })

    })

    envioWhatsapp()

}

carregarDados()

function envioWhatsapp() {

    var datas = ""

    var dadosEnviar = []

    var dadosFormatado = ""

    var dataSelect = "https://api.whatsapp.com/send?text="

    var texto_inserir = ""

    var texto = ""

    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM aulas ORDER BY data', [], function(tx, results) {

            dadosEnviar = results.rows

            if(results.rows.length <= 0) {
                
                $(".btn-whatsapp").fadeOut('slow')

                return false

            }

            for (i=0; i < dadosEnviar.length; i++) {

                if (! datas.includes(dadosEnviar[i].data)) {
                    datas += dadosEnviar[i].data + ','
                    texto_inserir += "✅ *" + formatarData(dadosEnviar[i].data) + "*" +  "\n-----------\n"
                    texto_inserir += "⏲️ *Hora:* " + dadosEnviar[i].hora + "\n" + "*Aula:* " + dadosEnviar[i].aula + "\n-----------\n"
                } else {
                    texto_inserir += "⏲️ *Hora:* " + dadosEnviar[i].hora + "\n" + "*Aula:* " + dadosEnviar[i].aula + "\n-----------\n"
                }
            }
            

            /*texto_inserir += "✅ *" + formatarData(datas[i]) + "*" +  "\n-----------\n"
                            

            texto_inserir += "⏲️ *Hora:* " + results.rows[i].hora + "\n" + "*Aula:* " + results.rows[i].aula + "\n-----------\n"*/


            $('.btn-whatsapp').attr("href", dataSelect + encodeURIComponent(texto_inserir))

            

        })
    })

}

function editar(id) {
    db.transaction(function(tx) {
        tx.executeSql('SELECT rowid,* FROM aulas WHERE rowid = "' + id + '"', [], function(tx, results) {
            input_data.value = results.rows[0].data
            hora.value = results.rows[0].hora
            aula.value = results.rows[0].aula
        })
    })
}

function excluir(id) {

    msg.innerHTML = ""

    var dialogResult = "";
    $.confirm({
        title: 'Deletar este registro?',
        content: 'O registro será deletado!',
        buttons: {
            Yes: function () {
                dialogResult = "Sim";

                msg.classList.remove('ocultar')

                setTimeout(function() {

                    msg.classList.add('ocultar')

                }, 3000)

                db.transaction(function (tx) { 
                    tx.executeSql("DELETE FROM aulas WHERE rowid = '" + id + "'",[], 
                    function(tx,results){msg.innerHTML = "Deletado com sucesso"},
                    function(tx,error){msg.innerHTML = "Falha ao deletar"}
                    );
                })

                carregarDados()
            },
            No: function () {
                dialogResult = "Não";
                msg.classList.remove('ocultar')

                setTimeout(function() {

                    msg.classList.add('ocultar')

                }, 3000)
                msg.innerHTML = "Ação cancelada"
                },
        }
    });

}

$(document).on("click", ".edit", function() {
    var id = $(this).attr("data-id")
    editar(id)
})

$(document).on("click", ".excluir", function() {
    var id = $(this).attr("data-id")
    excluir(id)
})

btnDeletar.addEventListener("click", function() {

    msg.innerHTML = ""

    if(qtdAulas <= 0) {

        msg.classList.remove('ocultar')

        setTimeout(function() {

            msg.classList.add('ocultar')

        }, 3000)
        msg.innerHTML = "Sem aulas registradas"

        return false

    }

    var dialogResult = "";
    $.confirm({
        title: 'Deletar todos os registros?',
        content: 'Serão deletados todos os regisros!',
        buttons: {
            Yes: function () {
                dialogResult = "Sim";

                msg.classList.remove('ocultar')

                setTimeout(function() {
                   msg.classList.add('ocultar')
                   location.reload();
                }, 3000)

                db.transaction(function (tx) { 
                    tx.executeSql("DROP TABLE aulas",[], 
                    function(tx,results){msg.innerHTML = "Deletado com sucesso"},
                    function(tx,error){msg.innerHTML = "Falha ao deletar"}
                    );
                })

            },
            No: function () {
                dialogResult = "Não";
                msg.classList.remove('ocultar')

                setTimeout(function() {

                    msg.classList.add('ocultar')

                }, 3000)
                msg.innerHTML = "Ação cancelada"
                },
        }
    });

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