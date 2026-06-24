
async function Tablas(nombre) {

    const SHEET_ID = "1uLNHtuM2fcaaCaIXh5lGy-Im5vou6uItiM8YjgiLmL4"

    const url =
    `https://opensheet.elk.sh/${SHEET_ID}/${nombre}`
    
    
    
    try {
    const res = await fetch(url)
    
    return await res.json()     
    } catch (error) {
        throw new Error(error)
    }

}

async function cargarDatos() {

    const contenedor = document.getElementById("data_entre_semana")
    if(contenedor){

        contenedor.innerHTML ="<p class='miercoles-cargando'>Cargando la Base de Datos...</p>";
    }

    
    try{

    const programa = await Tablas("Tabla_Principal")
    const fila = programa[0]

    const tesoros = await Tablas("Tesoros")
    const maestros = await Tablas("Mejores_Maestros")
    const vida_cristiana = await Tablas( fila.Tabla_Vida_Cristiana)
    if (contenedor) {
    
        contenedorGeneral.innerHTML = "";
    }

    Tesoros(tesoros)
    

    }catch(error){

    console.log(error)
    if (contenedor) {
            contenedorGeneral.innerHTML = "<p class='miercoles-error'>Error al cargar el programa.</p>";
        }

    }
}

function Tesoros(data){

        const contenedor =
        document.getElementById("data_tesoros")


        // contenedor.innerHTML= "<p>Consultando la Base de Datos...</p>"

        data.forEach(element=>{

        if(!element.Presidente)
        return

        contenedor.innerHTML += `

        <div class="reunion-tarjeta">

            <h3 class="reunion-titulo-principal">
                <span class="reunion-etiqueta">Fecha</span>${element.Fecha ?? ""}
            </h3>

            <h3 class="reunion-titulo-principal">
                <span class="reunion-etiqueta">Presidente:</span>
                ${element.Presidente ?? ""}
            </h3>
            
            <div class="reunion-fila-info">
                <span class="reunion-etiqueta">Presidente Sala B:</span>
                <span class="reunion-asignado">${element.Presidente_Sala_B ?? "-"}</span>
            </div>

            <div class="reunion-fila-info">
                <span class="reunion-etiqueta">Cántico:</span>
                <span class="reunion-asignado">${element.Cantico ?? "-"}</span>
            </div>

            <div class="reunion-fila-info">
                <span class="reunion-etiqueta">Título Tesoros:</span>
                <span class="reunion-asignado">${element.Titulo_Tesoros ?? "-"}</span>
            </div>

            <div class="reunion-fila-info">
                <span class="reunion-etiqueta">Discursante:</span>
                <span class="reunion-asignado">${element.Discursante ?? "-"}</span>
            </div>

            <div class="reunion-fila-info">
                <span class="reunion-etiqueta">Conductor Perlas:</span>
                <span class="reunion-asignado">${element.Conductor_Perlas ?? "-"}</span>
            </div>

            <div class="reunion-fila-info">
                <span class="reunion-etiqueta">Lectura de la Biblia:</span>
                <span class="reunion-asignado">${element.Lectura_Biblia ?? "-"}</span>
            </div>

            <div class="reunion-fila-info">
                <span class="reunion-etiqueta">Lector A:</span>
                <span class="reunion-asignado">${element.Lector_A ?? "-"}</span>
            </div>

            <div class="reunion-fila-info">
                <span class="reunion-etiqueta">Lector B:</span>
                <span class="reunion-asignado">${element.Lector_B ?? "-"}</span>
            </div>
        </div>

        `

        })

}

cargarDatos()