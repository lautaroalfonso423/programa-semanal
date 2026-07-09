import { ENV } from "../config.js"

async function TablaSalidas() {

    const SHEET_ID = ENV.TABLA_PREDICACION
    const url =
    `https://opensheet.elk.sh/${SHEET_ID}/Tabla_Predi`
    
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
        const datos_salidas = await TablaSalidas()
        if(datos_salidas.length > 0){
            Salida_Vista(datos_salidas)
        
        } else {
            console.warn("No hay ningún programa activo para esta semana.");
            const contenedor = document.getElementById("data_salidas");
            if (contenedor) {
                contenedor.innerHTML = "<p class='sabado-error'>No hay un programa activo asignado para esta semana.</p>";
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
        const contenedor = document.getElementById("contenedor_salidas")

        const dias_de_semana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sabado", "Domigno"]


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
                        <p><strong>Territorio:</strong>  <a href="${element.Link_del_Terrirotorio || ""}" target="_blank" >${element.Territorio || ""}</a></p>
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



window.EsperaDeDatosSalidas = EsperaDeDatosSalidas