document.getElementById('go-to-app').addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:3000/' });
});

document.getElementById('fill-form').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ['content.js']
            }).then(() => {
                console.log("content.js inyectado manualmente.");
                chrome.tabs.sendMessage(tabs[0].id, { action: "fillForm" }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error("Error al enviar el mensaje:", chrome.runtime.lastError.message);
                    } else if (response && response.status === "Formulario completado") {
                        console.log("Formulario completado exitosamente.");
                    } else {
                        console.log("Error al completar el formulario.");
                    }
                });
            }).catch(error => console.error("Error al inyectar content.js:", error));
        } else {
            console.error("No hay una pestaña activa a la cual enviar el mensaje.");
        }
    });
});



