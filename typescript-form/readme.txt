# 📋 Formulario Dinámico Multi-Paso con TypeScript

Sistema de formularios dinámicos con validación, filtrado por roles y navegación secuencial implementado en TypeScript puro.

## 🌟 Características

- ✅ **Formularios Multi-Paso**: Sistema de 3 formularios secuenciales con navegación
- ✅ **Validación Obligatoria**: No permite avanzar sin completar todos los campos requeridos
- ✅ **Filtrado por Roles**: Campos visibles según el rol seleccionado (Admin, User, Desarrollador)
- ✅ **Persistencia de Datos**: Los datos se conservan al navegar entre formularios
- ✅ **Barra de Progreso**: Indicador visual del progreso en el proceso
- ✅ **Protección de Roles**: El selector de roles se bloquea después del primer formulario
- ✅ **TypeScript**: Tipado fuerte y seguridad en tiempo de desarrollo
- ✅ **Responsive**: Diseño adaptable a diferentes tamaños de pantalla

## 📁 Estructura del Proyecto

```
typescript-form/
├── html/
│   └── index.html          # Página principal
├── ts/
│   └── main.ts             # Código TypeScript fuente
├── js/
│   └── main.js             # JavaScript compilado
├── css/
│   └── styles.css          # Estilos del formulario
├── tsconfig.json           # Configuración de TypeScript
└── README.md               # Este archivo
```

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js y npm instalados
- TypeScript instalado globalmente: `npm install -g typescript`
- VS Code con la extensión Live Server (recomendado)

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   cd c:\Users\alejandro.gonzalez\Desktop\Prácticas\form\typescript-form
   ```

2. **Compilar TypeScript**
   ```bash
   tsc
   ```

3. **Modo watch (opcional pero recomendado)**
   ```bash
   tsc --watch
   ```
   Esto recompilará automáticamente cuando guardes cambios en [`main.ts`](ts/main.ts )

4. **Iniciar servidor local**
   - En VS Code: Clic derecho en [`index.html`](html/index.html ) → "Open with Live Server"
   - O usando npx: `npx serve .`

## 🎮 Uso

### Flujo de Formularios

1. **Seleccionar Rol**: Elige entre Admin, User o Desarrollador
2. **Formulario 1 - Datos Personales**: 
   - Nombre (todos los roles)
   - Email (todos los roles)
   - Edad (todos los roles)

3. **Formulario 2 - Información Adicional**:
   - Biografía (todos los roles)
   - País (todos los roles)
   - Teléfono (solo Admin y User)

4. **Formulario 3 - Campos Específicos**:
   - Campo Admin (solo Admin)
   - Campo Dev (solo Desarrollador)
   - Preferencias (solo User)
   - Aceptar Términos (todos los roles)

5. **Finalización**: Visualización de todos los datos recopilados

### Navegación

- **Siguiente**: Valida y guarda datos, avanza al siguiente formulario
- **Anterior**: Vuelve al formulario previo sin perder datos
- **Finalizar**: Completa el proceso y muestra resumen
- **Reiniciar**: Vuelve al inicio y limpia todos los datos

## 🔧 Configuración de Roles

### Agregar Nuevos Roles

Edita el archivo [`ts/main.ts`](ts/main.ts ):

```typescript
let userData = {
    role: "nuevo_rol", // Rol por defecto
    edad: 28,
    pais: "España"
};
```

Y en el HTML [`html/index.html`](html/index.html ):

```html
<select id="roleSelect">
    <option value="admin">Admin</option>
    <option value="user" selected>User</option>
    <option value="desarrollador">Desarrollador</option>
    <option value="nuevo_rol">Nuevo Rol</option>
</select>
```

### Configurar Campos por Rol

Modifica el array `formSchemas` en [`main.ts`](ts/main.ts ):

```typescript
const formSchemas: FormSchema[] = [
    {
        campo_ejemplo: { 
            type: "string", 
            label: "Campo Ejemplo", 
            roles: ["admin", "nuevo_rol"] // Solo visible para estos roles
        }
    }
];
```

## 📝 Tipos de Campos Soportados

| Tipo | Descripción | HTML Input |
|------|-------------|------------|
| `string` | Texto simple | `<input type="text">` |
| `int` | Número entero | `<input type="number">` |
| `float` | Número decimal | `<input type="number" step="0.01">` |
| `boolean` | Casilla de verificación | `<input type="checkbox">` |
| `email` | Email con validación | `<input type="email">` |
| `password` | Contraseña oculta | `<input type="password">` |
| `textarea` | Texto multilínea | `<textarea>` |
| `url` | URL con validación | `<input type="url">` |
| `tel` | Teléfono | `<input type="tel">` |
| `date` | Selector de fecha | `<input type="date">` |
| `datetime-local` | Fecha y hora | `<input type="datetime-local">` |
| `time` | Hora | `<input type="time">` |
| `month` | Mes y año | `<input type="month">` |
| `select` | Lista desplegable | `<select>` |

## 🎨 Personalización de Estilos

Los estilos se encuentran en [`css/styles.css`](css/styles.css ). Clases CSS principales:

- `.progress-bar`: Contenedor de la barra de progreso
- `.progress-fill`: Relleno de la barra (ajustar color en `background-color`)
- `.field-container`: Contenedor de cada campo
- `.button-container`: Contenedor de botones de navegación
- `.completion-message`: Pantalla de finalización

### Ejemplo de Personalización

```css
.progress-fill {
    background-color: #FF5722; /* Cambiar color de la barra */
}

.field-container input:focus {
    border-color: #2196F3; /* Color del borde al enfocar */
    box-shadow: 0 0 5px rgba(33, 150, 243, 0.5);
}
```

## 🛠️ Desarrollo

### Compilar TypeScript

```bash
# Compilación única
tsc

# Modo watch (recompila automáticamente)
tsc --watch

# Compilar con source maps para debugging
tsc --sourceMap
```

### Estructura de Tipos

```typescript
type FieldType = "string" | "int" | "float" | "boolean" | "email" | ...;

interface FieldConfig {
    type: FieldType;
    label?: string;
    options?: string[];
    roles?: string[];
}

interface FormSchema {
    [key: string]: FieldType | FieldConfig;
}
```

## 🐛 Solución de Problemas

### El formulario no se actualiza al cambiar de rol

1. Verifica que `tsc --watch` esté corriendo
2. Recarga la página con Ctrl+F5 (recarga forzada)
3. Revisa la consola del navegador para errores

### Los campos no se guardan entre formularios

- Verifica que los campos tengan el atributo `name` correcto
- Asegúrate de que el evento `submit` se esté manejando correctamente

### Error: "Cannot find module"

Asegúrate de que [`tsconfig.json`](tsconfig.json ) esté configurado correctamente:

```json
{
  "compilerOptions": {
    "target": "ES6",
    "outDir": "./js",
    "rootDir": "./ts",
    "strict": true
  }
}
```

## 📊 Flujo de Datos

```
Usuario selecciona rol
    ↓
Formulario 1 se genera con campos filtrados
    ↓
Usuario completa campos
    ↓
Click en "Siguiente" → Validación
    ↓
Datos se guardan en formData
    ↓
currentFormIndex++
    ↓
Formulario 2 se genera con datos previos
    ↓
Repetir hasta completar todos los formularios
    ↓
Pantalla de finalización con resumen
```

## 🔒 Seguridad

- **Validación del lado del cliente**: Todos los campos requeridos se validan antes de avanzar
- **Protección de roles**: El selector se bloquea después del primer formulario
- **Limpieza de datos**: Los datos se reinician completamente al usar "Reiniciar Formularios"

> ⚠️ **Nota**: Este es un formulario del lado del cliente. Para producción, implementa validación del lado del servidor.

## 📈 Mejoras Futuras

- [ ] Integración con backend (API REST)
- [ ] Validaciones personalizadas por campo
- [ ] Soporte para campos condicionales (mostrar campo B si campo A tiene cierto valor)
- [ ] Exportar datos a JSON/CSV
- [ ] Modo oscuro
- [ ] Animaciones de transición entre formularios
- [ ] Almacenamiento local (LocalStorage) para recuperar datos

## 👨‍💻 Autor

Alejandro González

**Versión**: 1.0.0  
**Última actualización**: Octubre 2025