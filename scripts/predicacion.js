import { ENV } from "../config.js"

async function TablaSalidas(nombre) {

    const SHEET_ID = ENV.TABLA_PREDICACION
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


async function cargarDatosSalidas() {
    
    try {
        
        const datos_salidas_generales = await TablaSalidas("Tabla_General")
        const datos_salidas_grupales = await TablaSalidas("Tabla_Grupo")

        if(datos_salidas_generales.length > 0 && datos_salidas_grupales.length > 0){
            Salida_Vista(datos_salidas_generales)
            Salida_Vista_Grupales(datos_salidas_grupales)
        }else {
            console.warn("No hay un programa activo para esta semana.");
            const contenedor = document.getElementById("data_salidas");
            if (contenedor) {
                contenedor.innerHTML = "<p class='sabado-error'>No hay ningún programa activo para esta semana.</p>";
            }
        }
    } catch (error) {
        throw new Error(error)
    }


}


async function EsperaDeDatosSalidas(){


    const contenedor = document.getElementById("data_salidas")
    if (!contenedor) {
        console.warn("El contenedor 'data_salidas' aún no está listo en el DOM.");
        return; 
    }
    contenedor.insertAdjacentHTML("afterbegin", "<p id='status-mensaje' class='miercoles-cargando'>Cargando la Base de Datos...</p>");

    try {
        await cargarDatosSalidas()
        const mensaje = document.getElementById("status-mensaje")
        if (mensaje) mensaje.remove();

    } catch (error) {
        console.log(error)
        if (contenedor) {
            contenedor.innerHTML = "<p class='error'>Error al cargar el programa.</p>";
        }
        throw new Error(error)
    }

}


async function Salida_Vista(data) {
        const contenedor = document.getElementById("contenedor_salidas_generales")

        const dias_de_semana = [
            "Lunes Tarde", 
            "Martes Mañana", 
            "Martes Tarde", 
            "Miércoles Mañana", 
            "Jueves Mañana", 
            "Jueves Tarde", 
            "Viernes Mañana", 
            "Viernes Tarde", 
            "Sabado Mañana", 
            "Sabado Tarde", 
        ]




        data.forEach(element => {
            if(dias_de_semana.includes(element.Dia)){
                const zoom = element.Link_de_Zoom; 
                contenedor.innerHTML += `
                <div class="tarjeta-evento">
                    <div class="evento-header">
                        <span class="etiqueta-dia">${element.Dia || ""}</span>
                        <span class="etiqueta-hora">${element.Hora || ""}</span>
                    </div>
                    <div class="evento-cuerpo">
                        <p class="dato-ubicacion">
                            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(element.Ubicacion || '')}" target="_blank" class="link-mapa">
                                <strong>Ubicación:</strong> ${element.Ubicacion || ""}
                            </a>
                        </p>                        
                        <p><strong>Información:</strong> ${element.Dato_Adicional}</p>
                        <p><strong>Conductor:</strong> ${element.Conductor || ""}</p>
                        <p><strong>Territorio Principal:</strong>  <a href="${element.Link_del_Terrirotorio || ""}" target="_blank" >${element.Territorio || ""}</a></p>
                        <p><strong>Territorio Secundario:</strong>  <a target="_blank" >${element.Territorio_Secundario || ""}</a></p>
                    </div>
                    ${zoom ? 
                        `
                        <div class="evento-footer">
                        <a href="${element.Link_de_Zoom || ""}" target="_blank" class="btn-zoom">Unirse a Zoom</a>
                        </div>
                        `
                        : ""
                    } 
                    
                </div>
            `;
            }
        });  
    
    }

async function Salida_Vista_Grupales(data) {
        const contenedor = document.getElementById("contenedor_salidas_grupales")

        const dias_de_semana = [
            "Lunes Tarde", 
            "Martes Mañana", 
            "Martes Tarde", 
            "Miércoles Mañana", 
            "Jueves Mañana", 
            "Jueves Tarde", 
            "Viernes Mañana", 
            "Viernes Tarde", 
            "Sabado Mañana", 
            "Sabado Tarde", 
        ]


        data.forEach(element => {
            if(dias_de_semana.includes(element.Dia)){
                const zoom = element.Link_de_Zoom; 
                contenedor.innerHTML += `
                <div class="tarjeta-evento-grupo">
                    <div class="evento-header-grupo">
                        <span class="etiqueta-dia-grupo">${element.Dia || ""}</span>
                        <span class="etiqueta-hora-grupo">${element.Hora || ""}</span>
                    </div>
                    <div class="evento-cuerpo-grupo">
                        <p class="dato-ubicacion-grupo">
                            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(element.Ubicacion || '')}" target="_blank" class="link-mapa-grupo">
                                <strong>Ubicación:</strong> ${element.Ubicacion || ""}
                            </a>
                        </p>                        
                        <p><strong>Información:</strong> ${element.Dato_Adicional || ""}</p>
                        <p><strong>Conductor:</strong> ${element.Conductor || ""}</p>
                        <p><strong>Territorio Principal:</strong> <a href="${element.Link_del_Terrirotorio || ""}" target="_blank">${element.Territorio || ""}</a></p>
                        <p><strong>Territorio Secundario:</strong>${element.Territorio_Secundario || ""}</p>
                    </div>
                    ${zoom ? 
                        `
                        <div class="evento-footer-grupo">
                            <a href="${element.Link_de_Zoom || ""}" target="_blank" class="btn-zoom-grupo">Unirse a Zoom</a>
                        </div>
                        `
                        : ""
                    } 
                </div>
                `;
            }
        });  

    
    }



window.EsperaDeDatosSalidas = EsperaDeDatosSalidas