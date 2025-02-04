chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "generateReport") {
        generateReport()
            .then(report => sendResponse(report))
            .catch(error => sendResponse({ error: error.message }));
        return true; // Necesario para usar sendResponse asincrónicamente
    }
});

async function generateReport() {
    let cookies = await getCookies();
    let extensions = await getExtensions();
    return JSON.stringify({
        browser: navigator.userAgent,
        extensions,
        cookies
        
    }, null, 2);
}

function getCookies() {
    return new Promise((resolve, reject) => {
        if (!chrome.cookies) {
            reject("Error: La API chrome.cookies no está disponible.");
            return;
        }
        chrome.cookies.getAll({}, (cookies) => {
            if (chrome.runtime.lastError) {
                reject("Error al obtener cookies: " + chrome.runtime.lastError.message);
                return;
            }

            resolve(cookies.map(cookie => {
                let formattedDate = cookie.expirationDate 
                    ? formatTimestamp(cookie.expirationDate) 
                    : "Session"; // Si no hay fecha, es una cookie de sesión

                return {
                    name: cookie.name,
                    domain: cookie.domain,
                    path: cookie.path,
                    value: cookie.value,
                    expirationDate: cookie.expirationDate || null, 
                    expirationDateFormatted: formattedDate
                };
            }));
        });
    });
}

function getExtensions() {
    return new Promise((resolve) => {
        chrome.management.getAll((extensions) => {
            resolve(extensions.map(ext => ({
                name: ext.name,
                id: ext.id,
                enabled: ext.enabled,
                description: ext.description,
                version: ext.version
            })));
        });
    });
}

// Convierte timestamp Unix (segundos) a fecha legible en local
function formatTimestamp(timestamp) {
    let date = new Date(timestamp * 1000); // Convertimos segundos a milisegundos
    return date.toLocaleString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}
