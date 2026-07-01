function cargarCarpeta(rutaArchivos){
    const carga_de_elementos = document.getElementById("seleccionar_reuniones")

    carga_de_elementos.innerHTML = "<p>Cargando programa...</p>"

    return fetch(rutaArchivos)
        .then(response => {
            if(!response.ok){
                throw new Error("No se encontro el archivo del programa.")
            } 
            return response.text()
        })
        .then(html => {
            carga_de_elementos.innerHTML = html
        })
        .catch(error => {
            carga_de_elementos.innerHTML = "<p>No se pudo cargar el contenido.</p>"
            console.log(error)
        })
}


window.document.addEventListener("DOMContentLoaded", ()=>{
    const boton = document.getElementById("entre_semana_carpeta")

    if(boton){
        boton.addEventListener("click", async()=>{
            await cargarCarpeta("/reuniones/entre_semana.html")
            EsperaDeDatos()
        })
    }
})










