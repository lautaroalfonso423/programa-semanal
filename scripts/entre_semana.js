
async function Tablas(nombre) {

    const SHEET_ID = "1uLNHtuM2fcaaCaIXh5lGy-Im5vou6uItiM8YjgiLmL4"

    const url =
    `https://opensheet.elk.sh/${SHEET_ID}/${nombre}`
    
    
    
    try {
        const res = await fetch(url)
        if(!res.ok) throw new Error("No se encontraron datos")
        return await res.json()     
    } catch (error) {
        throw error;
    }

}

async function cargarDatos() {

    try{


    const programa = await Tablas("Tabla_Principal")
    const tesoros = await Tablas("Tesoros")
    const maestros = await Tablas("3")
    const vida_cristiana = await Tablas("4")

    const semana_Principal = programa.find(e => e.Permisos === "active")

    if(semana_Principal){
        const fecha_Actual = semana_Principal.Semana

        const tesoros_fecha = tesoros.filter(e=> e.Fecha_Tesoros === fecha_Actual)
        const maestros_fecha = maestros.filter(e=> e.Fecha_Maestros === fecha_Actual)
        const vida_fecha = vida_cristiana.filter(e=> e.Fecha_Vida_Cristiana === fecha_Actual)
        
        Tesoros(tesoros_fecha)
        MejoresMaestros(maestros_fecha)
        NuestraVidaCristiana(vida_fecha)
    } else {
        console.warn("No hay ningún programa activo para esta semana.");
            const contenedor = document.getElementById("data_entre_semana");
            if (contenedor) {
                contenedor.innerHTML = "<p class='miercoles-error'>No hay un programa activo asignado para esta semana.</p>";
            }
    }
    
    }catch(error){
    throw new Error(error)

    }
}

window.EsperaDeDatos = EsperaDeDatos

async function EsperaDeDatos (){


    const contenedor = document.getElementById("data_entre_semana")
    if (!contenedor) {
        console.warn("El contenedor 'data_entre_semana' aún no está listo en el DOM.");
        return; 
    }
    contenedor.insertAdjacentHTML("afterbegin", "<p id='status-mensaje' class='miercoles-cargando'>Cargando la Base de Datos...</p>");

    try {
        await cargarDatos()
        const mensaje = document.getElementById("status-mensaje")
        if (mensaje) mensaje.remove();

    } catch (error) {
        console.log(error)
        if (contenedor) {
            contenedor.innerHTML = "<p class='miercoles-error'>Error al cargar el programa.</p>";
        }
        throw new Error(error)
    }

}


function Tesoros(data){

        const contenedor =
        document.getElementById("data_tesoros")

        data.forEach(element=>{

        if(!element.Presidente)
        return

        contenedor.innerHTML += `
        <div class="reunion-tarjeta">
            <!-- Encabezado de la Reunión -->
            <div class="reunion-fecha-encabezado">
                <span class="reunion-etiqueta-fecha">Fecha:</span> ${element.Fecha ?? ""}
            </div>

            <!-- Introducción y Presidencia -->
            <div class="reunion-seccion-introduccion">
                <h3 class="reunion-titulo-principal">
                    <span class="reunion-etiqueta-titulo">Presidente:</span> ${element.Presidente ?? ""}
                </h3>
                <div class="reunion-fila-info">
                    <span class="reunion-etiqueta">Sala B:</span>
                    <span class="reunion-asignado">${element.Presidente_Sala_B ?? "-"}</span>
                </div>
                <div class="reunion-fila-info">
                    <span class="reunion-etiqueta">Cántico:</span>
                    <span class="reunion-asignado">Canción ${element.Cantico ?? "-"}</span>
                </div>
                <div class="reunion-fila-info">
                <span class="reunion-etiqueta">Oración:</span>
                    <span class="reunion-asignado">${element.Oracion ?? "-"}</span>
                </div>
            </div>

            <!-- Bloque de Tesoros de la Biblia -->
            <div class="reunion-bloque-seccion tesoros-seccion">
                <div class="reunion-subencabezado-icono">
                    <h4 class="reunion-subtitulo-seccion">💎 TESOROS DE LA BIBLIA</h4>
                </div>

                <div class="reunion-item-actividad">
                    <!-- Nombre único para este contenedor en columna -->
                    <div class="tesoros-fila-vertical">
                        <span class="tesoros-titulo font-bold">1. ${element.Titulo_Tesoros ?? "-"} <span class="reunion-tiempo">(10 mins.)</span></span>
                        <span class="tesoros-discursante">${element.Discursante ?? "-"}</span>
                    </div>
                </div>

                <div class="reunion-item-actividad">
                    <!-- Nombre único para este contenedor en columna -->
                    <div class="tesoros-fila-vertical">
                        <span class="tesoros-titulo font-bold">2. Busquemos perlas escondidas <span class="reunion-tiempo">(10 mins.)</span></span>
                        <span class="tesoros-discursante">${element.Conductor_Perlas ?? "-"}</span>
                    </div>
                </div>
            </div>
            <div class="reunion-item-actividad lectura-bloque">
                    <div class="reunion-fila-info">
                        <span class="reunion-etiqueta font-bold">3. Lectura de la Biblia: <span class="reunion-detalle-texto">${element.Lectura_Biblia ?? "-"}</span> <span class="reunion-tiempo">(4 mins.)</span></span>
                    </div>
                    <div class="reunion-subfilas-salas">
                        <div class="reunion-fila-info sala-a">
                            <span class="reunion-etiqueta">Sala A:</span>
                            <span class="reunion-asignado">${element.Lector_A ?? "-"}</span>
                        </div>
                        <div class="reunion-fila-info sala-b">
                            <span class="reunion-etiqueta">Sala B:</span>
                            <span class="reunion-asignado">${element.Lector_B ?? "-"}</span>
                        </div>
                    </div>
                </div>
        </div>

        `

        })

}

function MejoresMaestros(data){

        const contenedor =
        document.getElementById("data_maestros")

        data.forEach(element=>{

        contenedor.innerHTML += `
        <div class="reunion-tarjeta">

            <div class="reunion-bloque-seccion tesoros-seccion">
                <div class="reunion-item-actividad">
                    <div class="tesoros-fila-vertical">
                        <span class="tesoros-titulo font-bold">${element.Titulo ?? "-"} <span class="reunion-tiempo">(${element.Tiempo ?? "-"} mins.)</span></span>
                        <span class="tesoros-discursante">${element.Asignados_SalaA ?? "-"}</span>
                        <span class="tesoros-discursante">${element.Asignados_SalaB ?? "-"}</span>
                    </div>
                </div>
            </div>
        </div>

        `

        })

}


function NuestraVidaCristiana(data){

        const contenedor =
        document.getElementById("data_vida_cristiana")

        data.forEach(element=>{


        contenedor.innerHTML += `
        <div class="reunion-tarjeta">
    
            <div class="reunion-seccion-introduccion">
                <div class="reunion-fila-info">
                    <span class="reunion-etiqueta">Cántico:</span>
                    <span class="reunion-asignado">Canción ${element.Cantico_Intermedio ?? "-"}</span>
                </div>
            </div>

            <div class="reunion-bloque-seccion tesoros-seccion">

                <div class="reunion-item-actividad">

                    <div class="tesoros-fila-vertical">
                        <span class="tesoros-titulo font-bold">${element.Primer_Discurso ?? "-"}</span>
                        <span class="tesoros-discursante">${element.Discursante_Primer_Discurso ?? "-"}</span>
                    </div>

                    <div class="tesoros-fila-vertical">
                        <span class="tesoros-titulo font-bold">${element.Segundo_Discurso ?? "-"}</span>
                        <span class="tesoros-discursante">${element.Discursante_Segundo_Discurso ?? "-"}</span>
                    </div>

                    <div class="tesoros-fila-vertical">
                        <span class="tesoros-titulo font-bold">${element.Tercer_Discurso ?? "-"}</span>
                        <span class="tesoros-discursante">${element.Discursante_Tercer_Discurso ?? "-"}</span>
                    </div>

                    <div class="tesoros-fila-vertical">
                        <span class="tesoros-titulo font-bold">${element.Estudio_Biblico ?? "-"}</span>
                        <span class="tesoros-discursante">${element.Conductor_Lector ?? "-"}</span>
                    </div>

                </div>
            </div>
            <div class="reunion-item-actividad lectura-bloque">
                    <div class="reunion-subfilas-salas">
                        <div class="reunion-fila-info sala-a">
                            <span class="reunion-etiqueta">Cantico y Oración:</span>
                            <span class="reunion-asignado">${element.Cantico_Oracion ?? "-"}</span>
                        </div>
                        <div class="reunion-fila-info sala-b">
                            <span class="reunion-etiqueta">Grupo de Limpieza y Encargado:</span>
                            <span class="reunion-asignado">${element.Limpieza_Encargado ?? "-"}</span>
                        </div>
                    </div>
                </div>
        </div>

        `

        })

}

