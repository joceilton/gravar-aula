$(function() {

//var db = openDatabase('aulas', '1.0', 'Gravando as aulas', 2 * 1024 * 1024);

var db

if (localStorage.getItem('dbAulas')) {
    db = JSON.parse(window.localStorage.getItem('dbAulas'))
} else {
    db = []
}


var botao = document.querySelector('.btnSalvar')
var btnDeletar = document.querySelector('.btn-deletar')
var input_data = document.querySelector('.data')
var hora = document.querySelector('.hora')
var aula = document.querySelector('.aula')
var msg = document.querySelector('.msg')

var dados = $(".dados")

var myHtmlContent

var qtdAulas

var msg_digitada = ""

var linhaTabela = ""

aula.focus()

$(".btn_msg").on("click", function() {
    $("div.msg_conteudo").slideToggle('slow')
})

$("textarea.msg_conteudo").on("keydown", function() {
    msg_digitada = $(this).val()
    envioWhatsapp()
    envioTelegram()
})

function pad(str, length) {
    const resto = length - String(str).length;
    return '0'.repeat(resto > 0 ? resto : '0') + str;
  }

//Formatar data
function formatarData(data) {
    var data_sep = data.split('-')
    return data_sep[2] + '/' + data_sep[1] + '/' + data_sep[0]
}

function desabilitar(campo) {

    campo.prop("disabled", true);
    setTimeout(function(){
        campo.prop("disabled", false);
        campo.focus()
    }, 300)

}

function verificaHora(h) {
    setTimeout(function() {
        db.forEach(el => {
            if (el.hora == h) {
                setTimeout(function() {
                    hora.style.border = "1px #f00 solid"
                }, 3000)
            } else {
                hora.style.border = "0"
            }
    })
    }, 100)
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


/*$(".aula").on("keydown", function(evt) {
    evt = evt || window.event;
    var key = evt.keyCode || evt.which;
    var tecla = String.fromCharCode(key);

    verificaHora(hora.value)

    if ($(this).val().length <= 1) {
    
        if (tecla == "U" || tecla == "u") {
            var campo = $(this)
            $(this).val("Unit")
            desabilitar(campo)
        }

        if (tecla == "W" || tecla == "w") {
            var campo = $(this)
            campo.val("Warm Up")
            desabilitar(campo)
        }

        if (tecla == "C" || tecla == "c") {
            var campo = $(this)
            campo.val("Click")
            desabilitar(campo)
        }

        if (tecla == "I" || tecla == "i") {
            var campo = $(this)
            campo.val("Intervalo")
            desabilitar(campo)
        }

        if (tecla == "O" || tecla == "o") {
            var campo = $(this)
            $(this).val("Oral Test")
            desabilitar(campo)
        }

        if (tecla == "N" || tecla == "n") {
            var campo = $(this)
            campo.val("NM")
            desabilitar(campo)
        }

        if (tecla == "F" || tecla == "f") {
            var campo = $(this)
            campo.val("Feriado")
            desabilitar(campo)
        }

        if (tecla == "R" || tecla == "r") {
            var campo = $(this)
            campo.val("Reunião")
            desabilitar(campo)
        }

        if (tecla == "T" || tecla == "t") {
            var campo = $(this)
            campo.val("Teens")
            desabilitar(campo)
        }

    }
    
})*/

$(".tipo_aula").on("change", function(event) {
var sl = $(this)
$(".aula").val(event.currentTarget.value)
$(".aula").focus()
setTimeout(function() {
sl.val("")
}, 50)
})


/*db.transaction(function (tx) {   
    tx.executeSql('CREATE TABLE IF NOT EXISTS aulas (id unique, data TEXT, hora TEXT, aula TEXT)'); 
 });*/

function carregarDados() {

    dados.html("")

    localStorage.setItem('dbAulas', JSON.stringify(db))

    if (db.length) {

    db.forEach(el => {

        if (el.data != "") {

            myHtmlContent = '<tr data-id=' + el.id +'> <td> ' + formatarData(el.data) + ' </td> <td> ' + el.hora + ' </td> <td> ' + el.aula + ' </td> <td> <a href="#" class="btnAcao edit" data-id = "' + el.id + '"> <i class="fa fa-edit"></i> </a> <a href="#" class="btnAcao excluir" data-id = "' + el.id + '"> <i class="fa fa-trash"></i> </a> </td> </tr>'

            dados.prepend(myHtmlContent)

        }

        envioWhatsapp()
        envioTelegram()

        })

    } else {

        myHtmlContent = '<tr> <td> Nenhum registro de aulas </td> </tr>'

        dados.prepend(myHtmlContent)

    }


}

carregarDados()


function envioWhatsapp() {

    var datas = []

    var dadosEnviar = []

    var dadosFormatado = ""

    var dataSelect = "https://api.whatsapp.com/send?text="

    var texto_inserir = ""

    var texto = ""

    var newArray = []

    var date_increment = []

    db.filter(el => {

            texto_inserir += "✅ *" + formatarData(el.data) + "*" +  "\n-----------\n"
            texto_inserir += "⏲️ *Hora:* " + el.hora + "\n" + "*Aula:* " + el.aula + "\n-----------\n"
        
    })

    console.log(texto_inserir)

    console.log(datas)

    if (msg_digitada == "") {
        $('.btn-whatsapp').attr("href", dataSelect + encodeURIComponent(texto_inserir))
    } else {
        $('.btn-whatsapp').attr("href", dataSelect + encodeURIComponent(texto_inserir + "\n\n" + "📝 *_OBS:_*" + "\n\n" + msg_digitada))
    }

}


function envioTelegram() {

    var datas = []

    var dadosEnviar = []

    var dadosFormatado = ""

    //var dataSelect = "https://api.whatsapp.com/send?text="
    var dataSelect = "https://telegram.me/share/url?text="

    var texto_inserir = ""

    var texto = ""

    var newArray = []

    var date_increment = []

    db.filter(el => {

            texto_inserir += "✅ **" + formatarData(el.data) + "**" +  "\n-----------\n"
            texto_inserir += "⏲️ **Hora:** " + el.hora + "\n" + "**Aula:** " + el.aula + "\n-----------\n"
        
    })

    console.log(texto_inserir)

    console.log(datas)

    if (msg_digitada == "") {
        $('.btn-telegram').attr("href", dataSelect + encodeURIComponent(texto_inserir))
    } else {
        $('.btn-telegram').attr("href", dataSelect + encodeURIComponent(texto_inserir + "\n\n" + "📝 __OBS:__" + "\n\n" + msg_digitada))
    }

}

function editar(id) {

    db.forEach(el => {
        if (el.id == id) {
            input_data.value = el.data
            hora.value = el.hora
            aula.value = el.aula
        }
    })

    /*db.transaction(function(tx) {
        tx.executeSql('SELECT rowid,* FROM aulas WHERE rowid = "' + id + '"', [], function(tx, results) {
            input_data.value = results.rows[0].data
            hora.value = results.rows[0].hora
            aula.value = results.rows[0].aula
        })
    })*/
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

                }, 1000)

                objIndex = db.findIndex(obj => obj.id == id)

                if (objIndex > -1) {

                    db.splice(objIndex, 1)

                    msg.innerHTML = "Deletado com sucesso"

                }

                /*db.transaction(function (tx) { 
                    tx.executeSql("DELETE FROM aulas WHERE rowid = '" + id + "'",[], 
                    function(tx,results){msg.innerHTML = "Deletado com sucesso"},
                    function(tx,error){msg.innerHTML = "Falha ao deletar"}
                    );
                })*/

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
    linhaTabela = $(this).parent().parent().attr("data-id")
    $("table tbody tr").css("background-color", "#fff")
    $("table tbody tr[data-id:" + linhaTabela + "]").css("background-color", "#f0f")
    editar(id)
})

$(document).on("click", ".excluir", function() {
    var id = $(this).attr("data-id")
    excluir(id)
})

btnDeletar.addEventListener("click", function() {

    msg.innerHTML = ""

    if(db.length <= 0) {

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
                $("textarea.msg_conteudo").val("")
                db = []
                msg.innerHTML = "Registros deletados"

                setTimeout(function() {
                   msg.classList.add('ocultar')
                }, 1000)

                carregarDados()


            },
            No: function () {
                dialogResult = "Não";
                msg.classList.remove('ocultar')

                setTimeout(function() {

                    msg.classList.add('ocultar')

                }, 1000)
                msg.innerHTML = "Ação cancelada"
                },
        }
    });

})

input_data.addEventListener("change", function() {

    var data = this.value;
    var hora = document.querySelector('.hora').value


    /*db.transaction(function (tx) { 

        tx.executeSql('SELECT data, hora, aula FROM aulas WHERE data = "' + data + '" AND hora = "' + hora + '"' , [], function(tx, results) {
            if (results.rows.length == 0) {

                aula.value = ""

            } else {

                aula.value = results.rows[0].aula

            }
        })
     })*/

})

hora.addEventListener('change', function() {
    verificaHora(this.value)
})

hora.addEventListener("blur", function() {

    var data = document.querySelector('.data').value
    var hora = this.value

    /*db.transaction(function (tx) { 

        tx.executeSql('SELECT data, hora, aula FROM aulas WHERE data = "' + data + '" AND hora = "' + hora + '"' , [], function(tx, results) {
            if (results.rows.length == 0) {

                aula.value = ""

            } else {

                aula.value = results.rows[0].aula

            }
        })
     })*/

})

 botao.addEventListener("click", function() {

    msg.classList.remove('ocultar')

    setTimeout(function() {

        msg.classList.add('ocultar')

     }, 1000)

     var data = document.querySelector('.data').value;
     var aula = document.querySelector('.aula').value;
     var hora = document.querySelector('.hora').value;

     var verifica = true

     if (data == "") {
        msg.classList.remove('alert-info')
        msg.classList.add('alert-warning')
        msg.innerHTML = "Selecione a data"
        return false
     }

     function gravarAula() {

        var id

        if (db.length <= 0) {

            id = 0

        } else {

            id = db[db.length - 1].id

        }


             db.push({
                id: id + 1,
                data,
                hora,
                aula
             })

           msg.innerHTML = "Salvo com sucesso"

     }

     db.forEach(el => {

        if (el.data == data && el.hora == hora) {

            objIndex = db.findIndex(obj => obj.id == el.id)

            db[objIndex].aula = aula

            verifica = false

            msg.innerHTML = "Atualizado com sucesso"

        }


    })

    if (verifica) {
        gravarAula()
    } 

        /*console.log(el.id)

        if (el.data == data) {

            //objIndex = db.findIndex((obj => obj.id == el.id))

            console.log('caiu aqui')

        } else {*/


        //}

     carregarDados()

     /*db.transaction(function (tx) { 

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

     
                
        
             }
        })
     })*/
 
 })

 })
