document.getElementById("generate").addEventListener("click", async () => {
  let report = await chrome.runtime.sendMessage({ action: "generateReport" });
  document.getElementById("output").textContent = report;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "generateReport") {
      generateReport().then(report => sendResponse(report));
      return true;
  }
});
