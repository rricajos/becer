document.getElementById("generate").addEventListener("click", () => {
    let output = document.getElementById("output");
    let saveButton = document.getElementById("save");

    output.textContent = "Generando informe... ⏳";

    chrome.runtime.sendMessage({ action: "generateReport" }, (response) => {
        if (chrome.runtime.lastError) {
            output.textContent = "❌ Error al obtener el reporte.";
            console.error(chrome.runtime.lastError.message);
            saveButton.disabled = true;
        } else {
            setTimeout(() => {
                // Convertir JSON en objeto para aplicar colores
                let data = JSON.parse(response);

                // Resaltar las extensiones con una clase CSS
                let formattedJSON = JSON.stringify(data, null, 2)
                    .replace(/("name":\s")(.+?)(",\s"enabled")/g, '$1<span class="extension">$2</span>$3');

                output.innerHTML = formattedJSON; // Usamos innerHTML para aplicar estilos
                saveButton.disabled = false;

              
            }, 2000); // 2 segundos de delay
        }
    });
});


// Guardar el JSON en un archivo
document.getElementById("save").addEventListener("click", async () => {
    let output = document.getElementById("output").innerText; // Capturar el texto sin HTML

    if (!output || output.startsWith("❌") || output.startsWith("⚠️")) {
        alert("No hay un informe válido para guardar.");
        return;
    }

    try {
        const handle = await window.showSaveFilePicker({
            suggestedName: "reporte_navegador.json",
            types: [{
                description: "Archivo JSON",
                accept: { "application/json": [".json"] }
            }]
        });

        const writable = await handle.createWritable();
        await writable.write(output);
        await writable.close();

        alert("📂 Archivo guardado correctamente.");
    } catch (error) {
        // console.error("Error al guardar el archivo:", error);
        // alert("❌ No se pudo guardar el archivo.");
    }
});
