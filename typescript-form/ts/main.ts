type FieldType = 
    "string" | "int" | "float" | "boolean" | "date" |
    "email" | "password" | "textarea" | "url" | "tel" |
    "datetime-local" | "time" | "month" |
    "select" | "radio" | "checkbox-group" | "file";

interface FieldConfig {
    type: FieldType;
    label?: string;
    options?: string[];
    roles?: string[]; 
}

interface FormSchema {
    [key: string]: FieldType | FieldConfig;
}

interface SchemaWrapper {
    form_childs: FormSchema;
}

let userData = {
    role: "user",
    edad: 28,
    pais: "España"
};

// Nuevo: sistema de formularios múltiples
let currentFormIndex = 0;
let formData: Record<string, any> = {}; // Almacena todos los datos del usuario

const formSchemas: FormSchema[] = [
    // Formulario 1: Datos personales
    {
        nombre: { type: "string", label: "Nombre", roles: ["admin","user","desarrollador"] },
        email: { type: "email", label: "Email", roles: ["admin","user","desarrollador"] },
        edad: { type: "int", label: "Edad", roles: ["admin","user","desarrollador"] }
    },
    // Formulario 2: Información adicional
    {
        bio: { type: "textarea", label: "Biografía", roles: ["admin","desarrollador", "user"] },
        pais: { type: "select", label: "País", options: ["España","México"], roles: ["admin","user","desarrollador"] },
        telefono: { type: "tel", label: "Teléfono", roles: ["admin","user"] }
    },
    // Formulario 3: Campos específicos por rol
    {
        admin_field: { type: "string", label: "Campo Admin", roles: ["admin"] },
        dev_field: { type: "string", label: "Campo Dev", roles: ["desarrollador"] },
        user_preferences: { type: "textarea", label: "Preferencias", roles: ["user"] },
        accept_terms: { type: "boolean", label: "Aceptar Términos", roles: ["admin","user","desarrollador"] }
    }
];

function createFormFromJSON(
    data: SchemaWrapper | FormSchema,
    userData: Record<string, any>
): void {
    const form = document.getElementById("dynamicForm") as HTMLFormElement | null;
    if (!form) return;

    // Limpiar formulario
    form.innerHTML = "";

    // Título del formulario actual
    const formTitle = document.createElement("h2");
    formTitle.textContent = `Formulario ${currentFormIndex + 1} de ${formSchemas.length}`;
    form.appendChild(formTitle);

    // Barra de progreso
    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";
    progressBar.innerHTML = `
        <div class="progress-fill" style="width: ${((currentFormIndex + 1) / formSchemas.length) * 100}%"></div>
    `;
    form.appendChild(progressBar);

    const allowedTypes: FieldType[] = [
        "string", "int", "float", "boolean", "date",
        "email", "password", "textarea", "url", "tel",
        "datetime-local", "time", "month",
        "select", "radio", "checkbox-group", "file"
    ];

    let fieldsData: FormSchema;
    if (typeof data === "object" && data !== null) {
        if ("form_childs" in data) {
            if (typeof data.form_childs === "object" && data.form_childs !== null) {
                fieldsData = data.form_childs as FormSchema;
            } else {
                console.error("Invalid form_childs format");
                return;
            }
        } else {
            fieldsData = data as FormSchema;
        }
    } else {
        console.error("Invalid data format");
        return;
    }

    let hasVisibleFields = false;


    for (const key of Object.keys(fieldsData)) {
        const fieldConfig = fieldsData[key];
        let fieldType: FieldType;
        let fieldLabel: string;
        let options: string[] | undefined;
        let roles: string[] | undefined;

        if (typeof fieldConfig === "string") {
            fieldType = fieldConfig as FieldType;
            fieldLabel = key.charAt(0).toUpperCase() + key.slice(1);
        } else {
            fieldType = fieldConfig.type;
            fieldLabel = fieldConfig.label || key.charAt(0).toUpperCase() + key.slice(1);
            options = fieldConfig.options;
            roles = fieldConfig.roles;
        }

  
        if (Array.isArray(roles) && roles.indexOf(userData.role) === -1) {
            console.log(`Campo ${key} filtrado. Roles permitidos:`, roles, "Rol actual:", userData.role);
            continue;
        }
        
        hasVisibleFields = true;
        console.log(`Campo ${key} incluido para rol:`, userData.role);
        if (allowedTypes.indexOf(fieldType) === -1) continue;

        const fieldContainer = document.createElement("div");
        fieldContainer.className = "field-container";

        const label = document.createElement("label");
        label.textContent = fieldLabel + ": ";
        label.setAttribute("for", key);

        let input: HTMLElement;

        switch (fieldType) {
            case "string":
            case "int":
            case "float":
            case "email":
            case "password":
            case "url":
            case "tel":
            case "date":
            case "datetime-local":
            case "time":
            case "month":
                const textInput = document.createElement("input");
                if (fieldType === "int" || fieldType === "float") {
                    textInput.type = "number";
                    if (fieldType === "float") textInput.step = "0.01";
                } else {
                    textInput.type = fieldType === "string" ? "text" : fieldType;
                }
                textInput.id = key;
                textInput.name = key;
                textInput.required = true;
                // Mantener valores previos si existen
                if (formData[key]) textInput.value = formData[key];
                input = textInput;
                break;

            case "boolean":
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = key;
                checkbox.name = key;
                if (formData[key]) checkbox.checked = formData[key];
                input = checkbox;
                break;

            case "textarea":
                const textarea = document.createElement("textarea");
                textarea.id = key;
                textarea.name = key;
                textarea.required = true;
                if (formData[key]) textarea.value = formData[key];
                input = textarea;
                break;

            case "select":
                const select = document.createElement("select");
                select.id = key;
                select.name = key;
                select.required = true;
                if (options) {
                    options.forEach(opt => {
                        const option = document.createElement("option");
                        option.value = opt;
                        option.textContent = opt;
                        if (formData[key] === opt) option.selected = true;
                        select.appendChild(option);
                    });
                }
                input = select;
                break;

            default:
                input = document.createElement("input");
                input.id = key;
                input.setAttribute("name", key);
                input.setAttribute("type", "text");
        }

        fieldContainer.appendChild(label);
        fieldContainer.appendChild(input);
        form.appendChild(fieldContainer);
    }

    // Solo mostrar botones si hay campos visibles
    if (hasVisibleFields) {
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "button-container";

        // Botón "Anterior" (solo si no es el primer formulario)
        if (currentFormIndex > 0) {
            const prevButton = document.createElement("button");
            prevButton.type = "button";
            prevButton.textContent = "Anterior";
            prevButton.onclick = () => goToPreviousForm();
            buttonContainer.appendChild(prevButton);
        }

        // Botón "Siguiente" o "Finalizar"
        const nextButton = document.createElement("button");
        nextButton.type = "submit";
        nextButton.textContent = currentFormIndex === formSchemas.length - 1 ? "Finalizar" : "Siguiente";
        buttonContainer.appendChild(nextButton);

        form.appendChild(buttonContainer);
    }

    // Agregar el event listener para el submit
    form.onsubmit = handleFormSubmit;
}

function handleFormSubmit(e: Event): void {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    
    // Validar que todos los campos requeridos estén llenos
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        const element = input as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        if (!element.value.trim()) {
            element.style.border = "2px solid red";
            isValid = false;
        } else {
            element.style.border = "";
        }
    });

    if (!isValid) {
        alert("Por favor, completa todos los campos requeridos.");
        return;
    }

    // Guardar los datos del formulario actual
    const allInputs = form.querySelectorAll('input, textarea, select');
    allInputs.forEach(input => {
        const element = input as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        if (element.name) {
            if (element.type === 'checkbox') {
                formData[element.name] = (element as HTMLInputElement).checked;
            } else {
                formData[element.name] = element.value;
            }
        }
    });

    console.log("Datos guardados:", formData);

    // Ir al siguiente formulario o finalizar
    if (currentFormIndex < formSchemas.length - 1) {
        currentFormIndex++;
        regenerateForm();
    } else {
        // Formulario completado
        console.log("¡Todos los formularios completados!", formData);
        alert("¡Formularios completados exitosamente!");
        showCompletionMessage();
    }
}

function goToPreviousForm(): void {
    if (currentFormIndex > 0) {
        currentFormIndex--;
        regenerateForm();
    }
}

function showCompletionMessage(): void {
    const form = document.getElementById("dynamicForm") as HTMLFormElement | null;
    if (!form) return;

    form.innerHTML = `
        <h2>¡Formularios Completados!</h2>
        <div class="completion-message">
            <p>Todos los datos han sido guardados exitosamente.</p>
            <pre>${JSON.stringify(formData, null, 2)}</pre>
            <button type="button" id="restartButton">Reiniciar Formularios</button>
        </div>
    `;
    
    const restartButton = document.getElementById("restartButton");
    if (restartButton) {
        restartButton.onclick = restartForms;
    }
}

function restartForms(): void {
    currentFormIndex = 0;
    formData = {};
    regenerateForm();
    updateRoleSelector();
}

function regenerateForm() {
    console.log("Regenerando formulario", currentFormIndex + 1, "para rol:", userData.role);
    createFormFromJSON(formSchemas[currentFormIndex], userData);
    updateRoleSelector();
}

function updateRoleSelector(): void {
    const roleSelect = document.getElementById("roleSelect") as HTMLSelectElement | null;
    if (roleSelect) {
        // Deshabilitar el selector si no estamos en el primer formulario
        if (currentFormIndex > 0) {
            roleSelect.disabled = true;
            roleSelect.style.opacity = "0.5";
            roleSelect.style.cursor = "not-allowed";
        } else {
            roleSelect.disabled = false;
            roleSelect.style.opacity = "1";
            roleSelect.style.cursor = "pointer";
        }
    }
}


document.addEventListener("DOMContentLoaded", () => {
    console.log("=== SCRIPT CARGADO ==="); 
    
    const roleSelect = document.getElementById("roleSelect") as HTMLSelectElement | null;
    console.log("roleSelect:", roleSelect); 
    
    if (roleSelect) {
        console.log("roleSelect encontrado, registrando listener");
        roleSelect.addEventListener("change", (e) => {
            // Solo permitir cambio de rol en el primer formulario
            if (currentFormIndex === 0) {
                const selectedRole = (e.target as HTMLSelectElement).value;
                console.log("Rol seleccionado:", selectedRole);
                userData.role = selectedRole;
                console.log("userData.role actualizado a:", userData.role);
                regenerateForm();
            } else {
                // Prevenir cambio si no estamos en el primer formulario
                e.preventDefault();
                alert("No puedes cambiar el rol una vez que has comenzado a completar los formularios.");
                roleSelect.value = userData.role;
            }
        });
    } else {
        console.error("roleSelect NO encontrado");
    }

    regenerateForm();
});


