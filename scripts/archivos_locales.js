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
    const boton_entre_semana = document.getElementById("entre_semana_carpeta")
    const boton_login = document.getElementById("login_carpeta")
    const boton_fin_de_semana = document.getElementById("fin_semana_carpeta")
    const boton_salida = document.getElementById("salidas_carpeta")
    
    if(boton_entre_semana){
        boton_entre_semana.addEventListener("click", async()=>{
            // await cargarCarpeta("public/reuniones/entre_semana.html")
            await cargarCarpeta("/reuniones/entre_semana.html")
            EsperaDeDatos()
        })
    }

    if(boton_login){
        boton_login.addEventListener("click", async()=>{
            // await cargarCarpeta("public/login.html")
            await cargarCarpeta("/login.html")
        })
    }

    if(boton_fin_de_semana){
        boton_fin_de_semana.addEventListener("click", async()=>{
            await cargarCarpeta("/reuniones/fin_semana.html")
            // await cargarCarpeta("public/reuniones/fin_semana.html")
            EsperaDeDatosAtalaya()
        })
    }

    if(boton_salida){
        boton_salida.addEventListener("click", async()=>{
            await cargarCarpeta("/predicacion/salidas.html")
            // await cargarCarpeta("public/predicacion/salidas.html")
            EsperaDeDatosSalidas()
        })
    }

})










