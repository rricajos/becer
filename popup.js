document.getElementById("generate").addEventListener("click", () => {
    let output = document.getElementById("output");
    let saveButton = document.getElementById("save");

    output.textContent = "Generant l'informe... ⏳";

    chrome.runtime.sendMessage({ action: "generateReport" }, (response) => {
        if (chrome.runtime.lastError) {
            output.textContent = "❌ Error al obtindre l'informació.";
            console.error(chrome.runtime.lastError.message);
            saveButton.disabled = true;
        } else {
            setTimeout(() => {
                let data = JSON.parse(response); // Convertimos el JSON

                // Convertimos el JSON en texto formateado
                let formattedJSON = JSON.stringify(data, null, 2)
                    .replace(/"name":\s"([^"]+)"/g, '"name": "<span class=\'extension\'>$1</span>"') // Resalta extensiones
                    .replace(/\n/g, "<br>") // Mantiene saltos de línea
                    .replace(/ /g, " "); // Mantiene la indentación

                output.innerHTML = formattedJSON; // Se usa innerHTML sin perder estructura
                saveButton.disabled = false;
            }, 1000);
        }
    });
});

// Guardar el JSON en un archivo
document.getElementById("save").addEventListener("click", async () => {
    let o = document.getElementById("output");
    let output = o.innerText; // Capturar el texto sin HTML

    if (output.startsWith("❌") || output.startsWith("⚠️")) {
        o.textContent = "🍃 Premeu el botó per generar l'informe....";
    } else {
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: "becer.json",
                types: [{
                    description: "Archivo JSON",
                    accept: { "application/json": [".json"] }
                }]
            });

            const writable = await handle.createWritable();
            await writable.write(output);
            await writable.close();

            o.textContent = "📂 Archiu guardat correctament.";
        } catch (error) {
            o.textContent = "❌ " + error;
            document.getElementById("save").disabled = true;
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const manifest = chrome.runtime.getManifest();
    document.getElementById("version").textContent = `Versió ${manifest.version}`;
});
