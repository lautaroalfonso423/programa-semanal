import { ENV } from "../config.js"


async function TablaAtalaya() {

    const SHEET_ID = ENV.TABLA_FIN_DE_SEMANA
    const url =
    `https://opensheet.elk.sh/${SHEET_ID}/Tabla_Atalaya`
    
    try {
        const res = await fetch(url)
        if(!res.ok) throw new Error("No se encontraron datos")
        return await res.json()     
    } catch (error) {
        throw error;
    }

}

async function cargarDatosAtalaya() {

    try {
        const data = await TablaAtalaya()
        const estaActivo = data.find( e => e.Estado === "active")

        if(estaActivo){
            const contenedor = document.getElementById("data_atalaya")

            contenedor.innerHTML = `
                <div class="fds-tarjeta-contenedor">    
                    <!-- SECCIÓN 1: ENCABEZADO Y APERTURA -->
                    <div class="fds-encabezado-bloque">
                        <div class="fds-meta-fecha">
                            <span class="fds-texto-negrita">Fecha:</span> ${estaActivo.Fecha ?? ""}
                        </div>
                        <div class="fds-meta-presidente">
                            <span class="fds-texto-negrita">Presidente:</span> ${estaActivo.Presidente_FDS ?? ""}
                        </div>
                        <div class="fds-fila-cantico-inicio">
                            <span class="fds-etiqueta-gris">Cántico de Inicio:</span>
                            <span class="fds-valor-resaltado">Canción ${estaActivo.Cantico_inicio ?? "-"}</span>
                        </div>
                    </div>

                    <!-- SECCIÓN 2: DISCURSO PÚBLICO -->
                    <div class="fds-seccion-discurso">
                        <div class="fds-separador-titulo">
                            <h4 class="fds-titulo-actividad">DISCURSO PÚBLICO</h4>
                        </div>
                        <div class="fds-caja-detalles-discurso">
                            <div class="fds-tema-principal">
                                ${estaActivo.Titulo_Discurso ?? "-"} <span class="fds-duracion-tiempo">(30 mins.)</span>
                            </div>
                            <div class="fds-datos-orador">
                                <span class="fds-etiqueta-orador">Orador:</span> 
                                <span class="fds-nombre-orador">${estaActivo.Discursante_FDS ?? "-"}</span>
                            </div>
                            <div class="fds-procedencia-orador">
                                <span class="fds-etiqueta-orador">Congregación:</span> 
                                <span class="fds-nombre-orador">${estaActivo.Congregacion ?? "-"}</span>
                            </div>
                        </div>
                    </div>

                    <!-- SECCIÓN 3: ESTUDIO DE LA ATALAYA Y CIERRE -->
                    <div class="fds-seccion-atalaya">
                        <div class="fds-fila-cantico-medio">
                            <span class="fds-etiqueta-gris">Cántico Intermedio:</span>
                            <span class="fds-valor-resaltado">Canción ${estaActivo.Cantico_intermedio ?? "-"}</span>
                        </div>

                        <div class="fds-separador-titulo">
                            <h4 class="fds-titulo-actividad">ESTUDIO DE LA ATALAYA</h4>
                        </div>
                        
                        <div class="fds-caja-personal-atalaya">
                            <div class="fds-fila-personal">
                                <span class="fds-rol-atalaya">Conductor:</span>
                                <span class="fds-nombre-personal">${estaActivo.Conductor_atalaya ?? "-"}</span>
                            </div>
                            <div class="fds-fila-personal">
                                <span class="fds-rol-atalaya">Lector:</span>
                                <span class="fds-nombre-personal">${estaActivo.Lector_atalaya ?? "-"}</span>
                            </div>
                        </div>

                        
                        <!-- Bloque de Conclusión de la Reunión -->
                        <div class="fds-bloque-cierre-reunion">
                            <div class="fds-fila-cierre">
                                <span class="fds-etiqueta-cierre">Cántico Final:</span>
                                <span class="fds-valor-cierre">Canción ${estaActivo.Cantico_final ?? "-"}</span>
                            </div>
                            <div class="fds-fila-cierre">
                                <span class="fds-etiqueta-cierre">Oración Final:</span>
                                <span class="fds-valor-cierre">${estaActivo.Oracion_final ?? "-"}</span>
                            </div>
                            <div class="fds-fila-cierre fds-borde-limpieza">
                                <span class="fds-etiqueta-cierre">Grupo de Limpieza:</span>
                                <span class="fds-valor-cierre-limpieza">${estaActivo.Grupo_limpieza ?? "-"}</span>
                            </div>
                        </div>
                    </div>

                </div>
                `
        } else {
            console.warn("No hay ningún programa activo para esta semana.");
            const contenedor = document.getElementById("sabado_datos");
            if (contenedor) {
                contenedor.innerHTML = "<p class='sabado-error'>No hay un programa activo asignado para esta semana.</p>";
            }
        }

    } catch (error) {
        throw new Error(error)
    }
    
}


async function EsperaDeDatosAtalaya (){


    const contenedor = document.getElementById("sabado_datos")
    if (!contenedor) {
        console.warn("El contenedor 'sabado_datos' aún no está listo en el DOM.");
        return; 
    }
    contenedor.insertAdjacentHTML("afterbegin", "<p id='status-mensaje' class='sabado-cargando'>Cargando la Base de Datos...</p>");

    try {
        await cargarDatosAtalaya()
        const mensaje = document.getElementById("status-mensaje")
        if (mensaje) mensaje.remove();

    } catch (error) {
        console.log(error)
        if (contenedor) {
            contenedor.innerHTML = "<p class='sabado-error'>Error al cargar el programa.</p>";
        }
        throw new Error(error)
    }

}

window.EsperaDeDatosAtalaya = EsperaDeDatosAtalaya

