var userData = {
    role: "user",
    edad: 28,
    pais: "España"
};
// -----------------------------
// Formulario con campos y roles
// -----------------------------
var formSchema = {
    form_childs: {
        nombre: { type: "string", label: "Nombre", roles: ["admin", "user", "desarrollador"] },
        bio: { type: "textarea", label: "Biografía", roles: ["admin", "desarrollador"] },
        pais: { type: "select", label: "País", options: ["España", "México"], roles: ["admin", "user", "desarrollador"] },
        admin_field: { type: "string", label: "Campo Admin", roles: ["admin"] },
        dev_field: { type: "string", label: "Campo Dev", roles: ["desarrollador"] }
    }
};
function createFormFromJSON(data, userData) {
    var form = document.getElementById("dynamicForm");
    if (!form)
        return;
    var allowedTypes = [
        "string", "int", "float", "boolean", "date",
        "email", "password", "textarea", "url", "tel",
        "datetime-local", "time", "month",
        "select", "radio", "checkbox-group", "file"
    ];
    // Guard explícito de tipos
    var fieldsData;
    if (typeof data === "object" && data !== null) {
        if ("form_childs" in data) {
            if (typeof data.form_childs === "object" && data.form_childs !== null) {
                fieldsData = data.form_childs;
            }
            else {
                console.error("Invalid form_childs format");
                return;
            }
        }
        else {
            fieldsData = data;
        }
    }
    else {
        console.error("Invalid data format");
        return;
    }
    var _loop_1 = function (key) {
        var fieldConfig = fieldsData[key];
        var fieldType = void 0;
        var fieldLabel = void 0;
        var options = void 0;
        var roles = void 0;
        if (typeof fieldConfig === "string") {
            fieldType = fieldConfig;
            fieldLabel = key.charAt(0).toUpperCase() + key.slice(1);
        }
        else {
            fieldType = fieldConfig.type;
            fieldLabel = fieldConfig.label || key.charAt(0).toUpperCase() + key.slice(1);
            options = fieldConfig.options;
            roles = fieldConfig.roles;
        }
        if (Array.isArray(roles) && roles.indexOf(userData.role) === -1) {
            console.log("Campo ".concat(key, " filtrado. Roles permitidos:"), roles, "Rol actual:", userData.role); // Debug
            return "continue";
        }
        console.log("Campo ".concat(key, " incluido para rol:"), userData.role); // Debug
        if (allowedTypes.indexOf(fieldType) === -1)
            return "continue";
        var fieldContainer = document.createElement("div");
        fieldContainer.className = "field-container";
        var label = document.createElement("label");
        label.textContent = fieldLabel + ": ";
        label.setAttribute("for", key);
        var input = void 0;
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
                var textInput = document.createElement("input");
                if (fieldType === "int" || fieldType === "float") {
                    textInput.type = "number";
                    if (fieldType === "float")
                        textInput.step = "0.01";
                }
                else {
                    textInput.type = fieldType === "string" ? "text" : fieldType;
                }
                textInput.id = key;
                textInput.name = key;
                textInput.required = true;
                input = textInput;
                break;
            case "boolean":
                var checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = key;
                checkbox.name = key;
                input = checkbox;
                break;
            case "textarea":
                var textarea = document.createElement("textarea");
                textarea.id = key;
                textarea.name = key;
                textarea.required = true;
                input = textarea;
                break;
            case "select":
                var select_1 = document.createElement("select");
                select_1.id = key;
                select_1.name = key;
                select_1.required = true;
                if (options) {
                    options.forEach(function (opt) {
                        var option = document.createElement("option");
                        option.value = opt;
                        option.textContent = opt;
                        select_1.appendChild(option);
                    });
                }
                input = select_1;
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
    };
    for (var _i = 0, _a = Object.keys(fieldsData); _i < _a.length; _i++) {
        var key = _a[_i];
        _loop_1(key);
    }
    var submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Enviar";
    form.appendChild(submitButton);
}
function regenerateForm() {
    console.log("Regenerando formulario para rol:", userData.role); // Debug
    var form = document.getElementById("dynamicForm");
    if (!form)
        return;
    form.innerHTML = "";
    createFormFromJSON(formSchema, userData);
}
document.addEventListener("DOMContentLoaded", function () {
    console.log("=== SCRIPT CARGADO ==="); // Añade esto al inicio
    var roleSelect = document.getElementById("roleSelect");
    console.log("roleSelect:", roleSelect); // Verifica si encuentra el elemento
    if (roleSelect) {
        console.log("roleSelect encontrado, registrando listener");
        roleSelect.addEventListener("change", function (e) {
            console.log("=== CHANGE DETECTADO ==="); // Añade esto
            var selectedRole = e.target.value;
            console.log("Rol seleccionado:", selectedRole);
            userData.role = selectedRole;
            console.log("userData.role actualizado a:", userData.role);
            regenerateForm();
        });
    }
    else {
        console.error("roleSelect NO encontrado");
    }
    // Generar formulario inicial
    regenerateForm();
});
