window.onload=inicializar;

var formSocios;
var refNuevoSocio;
var tbodyTablaSocios;
var refSocioAEditar;
var CREATE = "Añadir nuevo socio";
var UPDATE = "Actualizar socio existente";
var modo = CREATE;


function inicializar(){
    formSocios = document.getElementById("form-socio");
    formSocios.addEventListener("submit", createUpdateSociosFirebase, false);
    refNuevoSocio = firebase.database().ref().child("socios");
    mostrarSociosFirebase();
    tbodyTablaSocios = document.getElementById("tbody-tabla-socios");
}

function createUpdateSociosFirebase(event){
    event.preventDefault();

    switch(modo){
        case CREATE:
            refNuevoSocio.push({
                numSocio: event.target.numSocio.value,
                nombreSocio: event.target.nombreSocio.value,
                apellidosSocio: event.target.apellidosSocio.value,
                movilSocio: event.target.movilSocio.value,
                dniSocio: event.target.dniSocio.value
            });
            break;

        case UPDATE:
            refSocioAEditar.update({
                numSocio: event.target.numSocio.value,
                nombreSocio: event.target.nombreSocio.value,
                apellidosSocio: event.target.apellidosSocio.value,
                movilSocio: event.target.movilSocio.value,
                dniSocio: event.target.dniSocio.value
            })
    }

    modo = CREATE;
    document.getElementById("boton-enviar-nuevo-socio").value = CREATE;

    formSocios.reset();
}

function mostrarSociosFirebase(){
    refNuevoSocio.on("value", function(snap){
        var datos = snap.val();
        var filasAMostrar = "";
        for(var key in datos){
            filasAMostrar +=
                '<tr id="tablaSocios">' +
                    "<td>" + datos[key].numSocio + "</td>" +
                    "<td>" + datos[key].nombreSocio + "</td>" +
                    "<td>" + datos[key].apellidosSocio + "</td>" +
                    "<td>" + datos[key].movilSocio + "</td>" +
                    "<td>" + datos[key].dniSocio + "</td>" +
                    '<td id="tdEditar">' +
                        '<button class="btn btn-default editar" data-socios="' +key+ '">'+
                            '<span class="glyphicon glyphicon-pencil"></span>'+
                        '</button>' +
                    '</td>'+
                    '<td id="tdBorrar">' +
                        '<button class="btn btn-danger btn-danger-text-center borrar" data-socios="' +key+ '">'+
                            '<span class="glyphicon glyphicon-trash"></span>'+
                        '</button>' +
                    '</td>'+
                '</tr>';
        }
        tbodyTablaSocios.innerHTML = filasAMostrar;

        /*Para almacenar en 2 variables (una para editar socios y otra para borrar socios) los elementos que se podrán editar y borrar, recorremos todos los posibles candidatos que tienen el icono de editar y borrar*/

        if(filasAMostrar!=""){
            var elementosEditables = document.getElementsByClassName("editar");
            for(var i=0; i<elementosEditables.length; i++){
                elementosEditables[i].addEventListener("click", editarSociosDeFirebase, false);
            }

            var elementosBorrables = document.getElementsByClassName("borrar");
            for(var i=0; i<elementosBorrables.length; i++){
                elementosBorrables[i].addEventListener("click", borrarSociosDeFirebase, false);
            }
        }

    });
}

function editarSociosDeFirebase(){
    var keyDeSociosAEditar = this.getAttribute("data-socios");
    refSocioAEditar = refNuevoSocio.child(keyDeSociosAEditar);
    refSocioAEditar.once("value", function(snap){
        var datos = snap.val();
        document.getElementById("num-socio").value = datos.numSocio;
        document.getElementById("nombre-socio").value = datos.nombreSocio;
        document.getElementById("apellidos-socio").value = datos.apellidosSocio;
        document.getElementById("movil-socio").value = datos.movilSocio;
        document.getElementById("dni-socio").value = datos.dniSocio;
    });

    document.getElementById("boton-enviar-nuevo-socio").value = UPDATE;
    modo = UPDATE;

}

function borrarSociosDeFirebase(){
    var keyDeSociosABorrar = this.getAttribute("data-socios");
    var refSocioABorrar = refNuevoSocio.child(keyDeSociosABorrar);
    refSocioABorrar.remove();
}







