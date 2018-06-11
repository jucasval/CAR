window.onload=inicializar;

var formSocios;
var refNuevoSocio;
var tbodyTablaSocios;

function inicializar(){
    formSocios = document.getElementById("form-socio");
    formSocios.addEventListener("submit", enviarAltaSocioFirebase, false);
    refNuevoSocio = firebase.database().ref().child("socios");
    mostrarSociosFirebase();
    tbodyTablaSocios = document.getElementById("tbody-tabla-socios");
}

function enviarAltaSocioFirebase(event){
    event.preventDefault();
    refNuevoSocio.push({
        numSocio: event.target.numSocio.value,
        nombreSocio: event.target.nombreSocio.value,
        apellidosSocio: event.target.apellidosSocio.value,
        movilSocio: event.target.movilSocio.value,
        dniSocio: event.target.dniSocio.value
    });

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

    });
}







