window.onload = inicializar;

var formSocios;
var refNuevoSocio;
var tbodyTablaSocios;
var refSocioAEditar;
var CREATE = "Añadir nuevo socio";
var UPDATE = "Actualizar socio existente";
var modo = CREATE;
var cabeceraModal;
var esMonitor = false;
var esAlumno = false;
var miLetraDni;
var numeroDeSocio = 1;


function inicializar() {
    formSocios = document.getElementById("form-socio");
    formSocios.addEventListener("submit", createUpdateSociosFirebase, false);
    refNuevoSocio = firebase.database().ref().child("socios");
    mostrarSociosFirebase();
    tbodyTablaSocios = document.getElementById("tbody-tabla-socios");
}

function createUpdateSociosFirebase() {



    if (document.getElementById("socio-monitor").checked) {
        esMonitor = true;
    }
    if (document.getElementById("socio-escuela").checked) {
        esAlumno = true;
    }
    if (document.getElementById("dni-socio").value == "") {
        miLetraDni = "";
    } else {
        letraDni();
    }




    switch (modo) {

        case CREATE:

            refNuevoSocio.push({
                numSocio: numeroDeSocio,
                nombreSocio: event.target.nombreSocio.value,
                apellidosSocio: event.target.apellidosSocio.value,
                direccionSocio: event.target.direccionSocio.value,
                socioMonitor: esMonitor,
                socioEscuela: esAlumno,
                movilSocio: event.target.movilSocio.value,
                dniSocio: event.target.dniSocio.value,
                fechaAltaSocio: event.target.fechaAltaSocio.value,
                letraDni: miLetraDni
            })
            miLetraDni = "";
            formSocios.reset();
            esMonitor = false;
            esAlumno = false;
            break;

        case UPDATE:

            datosRecogidosEnFormulario();
            refSocioAEditar.update({
                numSocio: event.target.numSocio.value,
                nombreSocio: event.target.nombreSocio.value,
                apellidosSocio: event.target.apellidosSocio.value,
                direccionSocio: event.target.direccionSocio.value,
                socioMonitor: esMonitor,
                socioEscuela: esAlumno,
                movilSocio: event.target.movilSocio.value,
                dniSocio: event.target.dniSocio.value,
                fechaAltaSocio: event.target.fechaAltaSocio.value,
                letraDni: miLetraDni
            })
            miLetraDni = "";
            formSocios.reset();
            esMonitor = false;
            esAlumno = false;
            $('#myModal').modal('hide');
    }

    modo = CREATE;
    document.getElementById("boton-enviar-nuevo-socio").value = CREATE;


}



function mostrarSociosFirebase() {
    refNuevoSocio.on("value", function (snap) {
        var datos = snap.val();
        var filasAMostrar = "";
        for (var key in datos) {
            numeroDeSocio = parseInt(datos[key].numSocio) + 1;
            if (datos[key].socioEscuela) {
                var datosKeySocioEscuela = "<span class='glyphicon glyphicon-ok iconOk'></span>";
            } else {
                datosKeySocioEscuela = '<span class="glyphicon glyphicon-remove iconRemove"></span>';
            }

            if (datos[key].socioMonitor) {
                var datosKeySocioMonitor = "<span class='glyphicon glyphicon-ok iconOk'></span>";
            } else {
                datosKeySocioMonitor = '<span class="glyphicon glyphicon-remove iconRemove"></span>';
            }

            if (datos[key].dniSocio == "") {
                filasAMostrar +=
                    '<tr id="tablaSocios">' +
                    "<td>" + datos[key].numSocio + "</td>" +
                    "<td>" + datos[key].nombreSocio + "</td>" +
                    "<td>" + datos[key].apellidosSocio + "</td>" +
                    "<td>" + datos[key].direccionSocio + "</td>" +
                    "<td>" + datos[key].movilSocio + "</td>" +
                    "<td>" + datos[key].dniSocio + "</td>" +
                    "<td>" + datos[key].fechaAltaSocio + "</td>" +
                    "<td id='tdEsMonitor'>" + datosKeySocioMonitor + "</td>" +
                    "<td id='tdEsAlumno'>" + datosKeySocioEscuela + "</td>" +
                    '<td id="tdEditar">' +
                    '<button class="btn btn-default editar" data-toggle="modal" data-target="#myModal" data-socios="' + key + '">' +
                    '<span class="glyphicon glyphicon-pencil"></span>' +
                    '</button>' +
                    '</td>' +
                    '<td id="tdBorrar">' +
                    '<button class="btn btn-danger btn-danger-text-center borrar" data-socios="' + key + '">' +
                    '<span class="glyphicon glyphicon-trash"></span>' +
                    '</button>' +
                    '</td>' +
                    '</tr>';
            } else {
                filasAMostrar +=
                    '<tr id="tablaSocios">' +
                    "<td>" + datos[key].numSocio + "</td>" +
                    "<td>" + datos[key].nombreSocio + "</td>" +
                    "<td>" + datos[key].apellidosSocio + "</td>" +
                    "<td>" + datos[key].direccionSocio + "</td>" +
                    "<td>" + datos[key].movilSocio + "</td>" +
                    "<td>" + datos[key].dniSocio + '-' + datos[key].letraDni + "</td>" +
                    "<td>" + datos[key].fechaAltaSocio + "</td>" +
                    "<td id='tdEsMonitor'>" + datosKeySocioMonitor + "</td>" +
                    "<td id='tdEsAlumno'>" + datosKeySocioEscuela + "</td>" +
                    '<td id="tdEditar">' +
                    '<button class="btn btn-default editar" data-toggle="modal" data-target="#myModal" data-socios="' + key + '">' +
                    '<span class="glyphicon glyphicon-pencil"></span>' +
                    '</button>' +
                    '</td>' +
                    '<td id="tdBorrar">' +
                    '<button class="btn btn-danger btn-danger-text-center borrar" data-socios="' + key + '">' +
                    '<span class="glyphicon glyphicon-trash"></span>' +
                    '</button>' +
                    '</td>' +
                    '</tr>';
            }


        }
        tbodyTablaSocios.innerHTML = filasAMostrar;

        /*Para almacenar en 2 variables (una para editar socios y otra para borrar socios) los elementos que se podrán editar y borrar, recorremos todos los posibles candidatos que tienen el icono de editar y borrar*/

        if (filasAMostrar != "") {
            var elementosEditables = document.getElementsByClassName("editar");
            for (var i = 0; i < elementosEditables.length; i++) {
                elementosEditables[i].addEventListener("click", editarSociosDeFirebase, false);
            }

            var elementosBorrables = document.getElementsByClassName("borrar");
            for (var i = 0; i < elementosBorrables.length; i++) {
                elementosBorrables[i].addEventListener("click", borrarSociosDeFirebase, false);
            }
        }

    });
}

function datosRecogidosEnFormulario() {
    var numSocio = $("#num-socio").val();
    var nombreSocio = $("#nombre-socio").val();
    var apellidosSocio = $("#apellidos-socio").val();
    var direccionSocio = $("#direccion-socio").val();
    var socioMonitor = $("#socio-monitor").val();
    var socioAlumno = $("#socio-escuela").val();
    var movilSocio = $("#movil-socio").val();
    var dniSocio = $("#dni-socio").val();
    var fechaAltaSocio = $("#fecha-alta-socio").val();

    document.getElementById("num-socio").value = numSocio;
    document.getElementById("nombre-socio").value = nombreSocio;
    document.getElementById("apellidos-socio").value = apellidosSocio;
    document.getElementById("direccion-socio").value = direccionSocio;
    if (!socioMonitor) {
        $("#socio-monitor").attr('checked', true);
    } else {
        $("#socio-monitor").attr('checked', false);
    }
    if (!socioAlumno) {
        $("#socio-escuela").attr('checked', true);
    } else {
        $("#socio-escuela").attr('checked', false);
    }
    document.getElementById("movil-socio").value = movilSocio;
    document.getElementById("dni-socio").value = dniSocio;
    document.getElementById("fecha-alta-socio").value = fechaAltaSocio;
}

function editarSociosDeFirebase() {
    var keyDeSociosAEditar = this.getAttribute("data-socios");
    refSocioAEditar = refNuevoSocio.child(keyDeSociosAEditar);
    refSocioAEditar.once("value", function (snap) {
        var datos = snap.val();
        document.getElementById("num-socio").value = datos.numSocio;
        document.getElementById("nombre-socio").value = datos.nombreSocio;
        document.getElementById("apellidos-socio").value = datos.apellidosSocio;
        document.getElementById("direccion-socio").value = datos.direccionSocio;
        if (datos.socioMonitor) {
            $("#socio-monitor").attr('checked', true);
        } else {
            $("#socio-monitor").attr('checked', false);
        }
        if (datos.socioEscuela) {
            $("#socio-escuela").attr('checked', true);
        } else {
            $("#socio-escuela").attr('checked', false);
        }
        document.getElementById("movil-socio").value = datos.movilSocio;
        document.getElementById("dni-socio").value = datos.dniSocio;
        document.getElementById("fecha-alta-socio").value = datos.fechaAltaSocio;

        cabeceraModal = "Actualizar los datos del socio " + datos.nombreSocio + " " + datos.apellidosSocio;
        document.getElementById("cabecera-modal").innerHTML = cabeceraModal;
    });


    document.getElementById("boton-enviar-nuevo-socio").value = UPDATE;
    modo = UPDATE;

}

function borrarSociosDeFirebase() {
    var keyDeSociosABorrar = this.getAttribute("data-socios");
    var refSocioABorrar = refNuevoSocio.child(keyDeSociosABorrar);
    refSocioABorrar.remove();
}

function cambiarDatosFormulario() {
    document.getElementById("boton-enviar-nuevo-socio").value = CREATE;
    document.getElementById("cabecera-modal").innerHTML = "Nuevo Socio";
    formSocios.reset();
}

$(document).ready(function () {
    var date_input = $('input[name="fechaAltaSocio"]'); //our date input has the name "fechaAltaSocio"
    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    var options = {
        format: 'dd/mm/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,
    };
    date_input.datepicker(options);
    $("#fecha-alta-socio").datepicker().datepicker("setDate", new Date());
})

function letraDni() {
    var cadena = "TRWAGMYFPDXBNJZSQVHLCKET";
    var dniSocio = $("#dni-socio").val();
    var posicion = dniSocio % 23;
    miLetraDni = cadena.substring(posicion, posicion + 1);

    //document.formulario.dni.value=formulario.dni.value+" - "+letraDni
}
