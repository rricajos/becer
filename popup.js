document.getElementById("generate").addEventListener("click", () => {
    let output = document.getElementById("output");
    let saveButton = document.getElementById("save");
    
    output.textContent = "Generando informe...";
    
    chrome.runtime.sendMessage({ action: "generateReport" }, (response) => {
        if (chrome.runtime.lastError) {
            output.textContent = "❌ Error al obtener el reporte.";
            console.error(chrome.runtime.lastError.message);
            saveButton.disabled = true;
        } else {
            output.textContent = response ? response : "⚠️ No se pudo generar el reporte.";
            saveButton.disabled = false; // Habilita el botón de guardar
        }
    });
});

document.getElementById("save").addEventListener("click", async () => {
    let output = document.getElementById("output").textContent;
    
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
        
    }
});
