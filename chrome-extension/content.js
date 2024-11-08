console.log("content.js cargado correctamente");

// Escucha los mensajes enviados desde el popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Mensaje recibido en content.js:", request);

    if (request.action === 'fillForm') {
        console.log("Acción 'fillForm' detectada, solicitando datos del usuario...");

        // Llama a la API del backend para obtener los datos del usuario
        fetch('http://localhost:5000/api/user')
            .then(response => {
                console.log("Respuesta de la API recibida", response);
                return response.json();
            })
            .then(data => {
                console.log("Datos del usuario obtenidos:", data);

                if (data && Object.keys(data).length > 0) {
                    const user = data;
                    console.log("Usuario encontrado en la respuesta:", user);

                    const fieldMappings = {
                        firstName: user.name,
                        lastName: user.lastName,
                        email: user.email,
                        phone: user.phone,
                        id: user.id,
                        experience: user.experience,
                        education: user.education,
                        languages: user.languages,
                        professionalSummary: user.professionalSummary,
                        salaryExpectation: user.salaryExpectation,
                        residenceAddress: user.residenceAddress,
                        jobPlatform: user.jobPlatform,
                        profileURL: user.profileURL,
                        certification: user.certification,
                        recomendations: user.recomendations,
                        disponibilityToRemoteWork: user.disponibilityToRemoteWork,
                        industry: user.industry,
                        skills: user.skills,
                        typeOfContract: user.typeOfContract,
                        disponibilityToStart: user.disponibilityToStart
                    };

                    // Función para buscar el campo usando diferentes atributos
                    const findAndFillField = (possibleSelectors, value) => {
                        console.log("Buscando campo con posibles selectores:", possibleSelectors);
                        for (const selector of possibleSelectors) {
                            const element = document.querySelector(selector);
                            if (element) {
                                console.log(`Campo encontrado para ${selector}, rellenando con:`, value);
                                element.value = value || '';
                                element.dispatchEvent(new Event('input', { bubbles: true }));
                                return;
                            }
                        }
                        console.log("No se encontró ningún campo para los selectores:", possibleSelectors);
                    };

                    // Nueva función para rellenar el campo de nombre completo
                    const findAndFillFullNameField = (possibleSelectors, firstName, lastName) => {
                        const fullName = `${firstName} ${lastName}`;
                        console.log("Intentando rellenar campo de nombre completo con:", fullName);
                        findAndFillField(possibleSelectors, fullName);
                    };

                    // Relleno de todos los campos con diferentes selectores
                    findAndFillField(['input[name="firstName"]','input[id="1200"]', 'input[name="_systemfield_name"]', 'input[aria-label="First name"]', 'input[aria-label="First Name"]', '#inputFirstName', 'input[name="first_name"]', 'input[id="first_name"]', 'input[id="inputFirstName"]', 'input[name="name"]', 'input[id="firstNameField"]'], fieldMappings.firstName);
                    findAndFillField(['input[name="lastName"]', 'input[id="1201"]','input[aria-label="Last name"]', 'input[aria-label="Last Name"]', 'input[id="last_name"]', 'input[id="inputLastName"]', '#inputLastName'], fieldMappings.lastName);
                    findAndFillFullNameField(['input[name="fullName"]', 'input[id="inputFullName"]', 'input[name="_systemfield_name"]', 'input[aria-label="Full Name"]', '#inputFullName', 'input[name="full_name"]'], fieldMappings.firstName, fieldMappings.lastName);
                    findAndFillField(['input[name="email"]', 'input[id="1202"]', 'input[aria-label="Email"]', 'input[name="_systemfield_email"]', '#inputEmail'], fieldMappings.email);
                    findAndFillField(['input[name="phone"]', 'input[id="inputMobilePhone"]', 'input[id="1203"]', 'input[aria-label="Phone"]', '#inputPhone'], fieldMappings.phone);
                    findAndFillField(['input[name="id"]', 'input[aria-label="ID"]', 'input[aria-label="Identification"]', 'input[id="inputID"]'], fieldMappings.id);
                    findAndFillField(['input[name="experience"]', 'textarea[name="experience"]'], fieldMappings.experience);
                    findAndFillField(['input[name="education"]', 'textarea[name="education"]'], fieldMappings.education);
                    findAndFillField(['input[name="languages"]', 'textarea[name="languages"]'], fieldMappings.languages);
                    findAndFillField(['textarea[name="professionalSummary"]', 'input[name="professionalSummary"]', 'textarea[aria-label="Professional Summary"]'], fieldMappings.professionalSummary);
                    findAndFillField(['input[name="salaryExpectation"]', 'input[aria-label="Salary Expectation"]'], fieldMappings.salaryExpectation);
                    findAndFillField(['input[name="residenceAddress"]', 'input[aria-label="Residence Address"]'], fieldMappings.residenceAddress);
                    findAndFillField(['input[name="jobPlatform"]', 'input[aria-label="Job Platform"]'], fieldMappings.jobPlatform);
                    findAndFillField(['input[name="profileURL"]', 'input[id="1207"]', 'input[aria-label="Profile URL"]'], fieldMappings.profileURL);
                    findAndFillField(['input[name="certification"]', 'input[aria-label="Certification"]'], fieldMappings.certification);
                    findAndFillField(['input[name="recomendations"]', 'input[aria-label="Recomendations"]'], fieldMappings.recomendations);
                    findAndFillField(['input[name="disponibilityToRemoteWork"]', 'input[aria-label="Disponibility to Remote Work"]'], fieldMappings.disponibilityToRemoteWork);
                    findAndFillField(['input[name="industry"]', 'input[aria-label="Industry"]'], fieldMappings.industry);
                    findAndFillField(['input[name="skills"]', 'textarea[name="skills"]'], fieldMappings.skills);
                    findAndFillField(['input[name="typeOfContract"]', 'input[aria-label="Type of Contract"]'], fieldMappings.typeOfContract);
                    findAndFillField(['input[name="disponibilityToStart"]', 'input[aria-label="Disponibility to Start"]'], fieldMappings.disponibilityToStart);

                    console.log('Formulario completado exitosamente.');
                    sendResponse({ status: "Formulario completado" });
                } else {
                    console.log("No se encontraron datos del usuario o los datos están vacíos.");
                    sendResponse({ status: "Error al obtener los datos del usuario" });
                }
            })
            .catch(error => {
                console.error('Error al autocompletar el formulario:', error);
                sendResponse({ status: "Error al autocompletar el formulario" });
            });

        return true; // Indica que sendResponse será llamado de manera asíncrona
    } else {
        console.log("Acción no reconocida en content.js:", request.action);
    }
});

