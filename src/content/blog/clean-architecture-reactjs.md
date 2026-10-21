---
title: "¿Cómo aplicar Clean Architecture en React sin sobreingeniería?"
description: "Una guía práctica para separar dominio, casos de uso, infraestructura y UI en React, con criterios para saber cuándo la arquitectura ayuda y cuándo sobra."
lang: es
pubDate: 2022-07-08
updatedDate: 2026-10-19
status: build
tags:
  - React
  - TypeScript
  - Arquitectura
---

**En React, Clean Architecture merece la pena cuando separa reglas de negocio y contratos externos que necesitas probar o cambiar; no cuando solo añade carpetas.** La dirección de las dependencias debe proteger el dominio de React, HTTP y las bibliotecas de estado.

La mayoría de los artículos sobre arquitectura frontend empieza con un árbol de carpetas. Ese suele ser el primer error.

Puedes crear `domain/`, `application/` e `infrastructure/` y seguir teniendo un componente que valida reglas de negocio, llama a `fetch`, transforma la respuesta y muestra un *toast*. Las carpetas parecen limpias; las dependencias no.

> Clean Architecture no consiste en ordenar archivos. Consiste en decidir qué código puede conocer a qué otro código.

Esta guía es una revisión completa de mis notas de 2022, inspiradas inicialmente por el trabajo de [Gentleman Programming](https://github.com/Gentleman-Programming/Front-End-Clean-Architecture). Hoy mantendría la idea central, pero cambiaría casi toda la aplicación práctica.

## ¿Qué problema resuelve Clean Architecture en React?

Imagina una pantalla para suspender una cuenta. La regla dice que no se puede suspender al último administrador activo.

En una implementación rápida, el componente puede terminar haciendo todo:

```tsx
function SuspendUserButton({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    const response = await fetch(`/api/users/${userId}/suspend`, {
      method: "POST",
    });

    if (!response.ok) {
      toast.error("No se pudo suspender el usuario");
    }

    setIsLoading(false);
  }

  return <button onClick={handleClick}>Suspender</button>;
}
```

No hay nada incorrecto en `fetch` o `useState`. El problema aparece cuando el componente también decide **si** la operación está permitida, conoce el formato exacto del backend y repite esa lógica en otros flujos.

Cuando cambie la API, tocarás la UI. Cuando cambie la regla, tocarás la UI. Cuando quieras probar la regla, renderizarás React aunque la regla no tenga nada visual.

## ¿Cómo se relacionan dominio, aplicación, infraestructura y UI?

Una separación útil puede pensarse en cuatro zonas:

1. **Dominio:** conceptos y reglas del negocio.
2. **Aplicación:** acciones que el usuario puede ejecutar.
3. **Infraestructura:** API, almacenamiento, analítica y otros detalles externos.
4. **Presentación:** componentes, rutas, estado visual y accesibilidad.

| Capa | Responsabilidad en este ejemplo | No debería conocer |
| --- | --- | --- |
| Dominio | Decidir si se puede suspender una cuenta | React, HTTP o almacenamiento |
| Aplicación | Coordinar la suspensión mediante un contrato | Componentes y URLs concretas |
| Infraestructura | Convertir el contrato en una petición HTTP | Estado visual del botón |
| Presentación | Mostrar carga, éxito y errores | Detalles del formato de la API |

La regla de dependencias apunta hacia el dominio:

```text
React → caso de uso → dominio
           ↑
     adaptador HTTP
```

El dominio no importa React, Axios, Zustand ni el SDK del proveedor. Los casos de uso declaran qué necesitan mediante contratos. La infraestructura implementa esos contratos. La UI conecta las piezas.

## ¿Cómo se aplica en un ejemplo pequeño?

### 1. La regla vive en el dominio

```ts
export interface User {
  id: string;
  role: "admin" | "member";
  isActive: boolean;
}

export function canSuspendUser(
  user: User,
  activeAdminCount: number,
): boolean {
  const isLastActiveAdmin =
    user.role === "admin" && user.isActive && activeAdminCount === 1;

  return !isLastActiveAdmin;
}
```

Esta función no sabe dónde llegaron los usuarios ni cómo se mostrará el error. Se puede probar con datos simples.

### 2. El caso de uso expresa la intención

```ts
export interface UserRepository {
  suspend(userId: string): Promise<void>;
}

export interface SuspendUserInput {
  user: User;
  activeAdminCount: number;
}

export class CannotSuspendLastAdminError extends Error {}

export function createSuspendUser(repository: UserRepository) {
  return async function suspendUser(input: SuspendUserInput): Promise<void> {
    if (!canSuspendUser(input.user, input.activeAdminCount)) {
      throw new CannotSuspendLastAdminError();
    }

    await repository.suspend(input.user.id);
  };
}
```

El caso de uso conoce la operación `suspend`, pero no su URL. La interfaz es un puerto definido por la necesidad de la aplicación, no una copia de todos los endpoints del backend.

### 3. La infraestructura traduce HTTP al contrato

```ts
export function createHttpUserRepository(
  baseUrl: string,
  fetcher: typeof fetch,
): UserRepository {
  return {
    async suspend(userId: string): Promise<void> {
      const response = await fetcher(`${baseUrl}/users/${userId}/suspension`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`La API respondió con estado ${response.status}`);
      }
    },
  };
}
```

Aquí sí pertenecen la URL, el verbo HTTP y el código de estado. Si el backend cambia, el dominio permanece intacto.

### 4. ¿Cómo gestiona React la experiencia?

La capa de presentación decide cuándo deshabilitar el botón, cómo representar la carga, qué mensaje mostrar y dónde devolver el foco. Puede integrar el caso de uso mediante un *hook* o una mutación de TanStack Query.

Una comprobación de interfaz no es una garantía de seguridad. La regla de “no suspender al último administrador” debe validarse también en el backend, dentro de una operación segura frente a cambios simultáneos.

Lo importante es que React **presenta** la decisión del dominio; no la reinventa.

## ¿Cómo organizar el código por funcionalidad?

Un proyecto puede tener todas las interfaces en `components/`, todos los *hooks* en `hooks/` y todas las peticiones en `services/`. Al principio parece ordenado. A medida que crece, modificar “usuarios” obliga a recorrer toda la aplicación.

Prefiero mantener juntas las piezas que cambian por la misma razón:

```text
src/
├── app/
│   ├── providers/
│   └── router/
├── features/
│   └── suspend-user/
│       ├── application/
│       ├── domain/
│       ├── infrastructure/
│       ├── ui/
│       └── index.ts
├── entities/
│   └── user/
└── shared/
    ├── api/
    └── ui/
```

No todas las funcionalidades necesitan las cuatro subcarpetas. Una validación de formulario puede vivir junto a su componente. Separar por capas tiene sentido cuando existe lógica, infraestructura o reutilización real.

La combinación que mejor me funciona es:

> **Funcionalidades por fuera; límites limpios por dentro.**

## ¿Cómo evitan los adaptadores que la API gobierne la UI?

Supongamos que el backend devuelve:

```json
{
  "user_id": "usr_42",
  "display_name": "Ana",
  "role": "member",
  "active": 1
}
```

La aplicación no debería arrastrar `user_id` y `active: 1` por cada componente. Un adaptador puede convertir ese DTO en un modelo interno:

```ts
type UserDto = {
  user_id: string;
  display_name: string;
  role: "admin" | "member";
  active: 0 | 1;
};

export function toUser(dto: UserDto): User {
  return {
    id: dto.user_id,
    role: dto.role,
    isActive: dto.active === 1,
  };
}
```

El adaptador es especialmente valioso cuando:

- el contrato externo usa otra convención de nombres;
- faltan campos y necesitas valores explícitos;
- una fecha llega como texto;
- existen versiones de una API;
- el mismo modelo se obtiene desde HTTP y almacenamiento local.

Si el adaptador solo copia cinco propiedades con el mismo nombre, probablemente todavía no aporta nada.

## ¿Cómo separar el estado del servidor del estado de interfaz?

Otro cambio respecto de mis notas antiguas: no pondría todo en Context ni en un *store* global.

- **Estado remoto:** usuarios, proyectos, permisos. Tiene caché, reintentos e invalidación. Una herramienta como TanStack Query suele encajar bien.
- **Estado de URL:** búsqueda, filtros, paginación. Debería poder compartirse y sobrevivir una recarga.
- **Estado visual local:** modal abierto, pestaña activa, borrador temporal. Vive cerca del componente.
- **Estado de sesión global:** identidad o preferencias transversales. Puede justificar un contexto o *store*.

La arquitectura se vuelve más simple cuando cada dato tiene un dueño claro.

## ¿Qué probar en cada límite de la arquitectura?

Una estrategia razonable:

### Dominio

Pruebas unitarias rápidas para reglas y transformaciones. Sin render, red ni *mocks* de framework.

### Un test de dominio que puedes ejecutar sin React

Guarda la interfaz `User` y la función `canSuspendUser` del primer ejemplo en `domain.ts`. Al lado, crea `domain.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";
import { canSuspendUser } from "./domain.ts";

test("impide suspender al último administrador activo", () => {
  assert.equal(
    canSuspendUser({ id: "admin-1", role: "admin", isActive: true }, 1),
    false,
  );
});

test("permite suspender a un administrador si queda otro activo", () => {
  assert.equal(
    canSuspendUser({ id: "admin-1", role: "admin", isActive: true }, 2),
    true,
  );
});

test("no bloquea a un miembro por el número de administradores", () => {
  assert.equal(
    canSuspendUser({ id: "member-1", role: "member", isActive: true }, 1),
    true,
  );
});

test("un administrador inactivo no es el último administrador activo", () => {
  assert.equal(
    canSuspendUser({ id: "admin-2", role: "admin", isActive: false }, 1),
    true,
  );
});
```

Ejecuta con Node.js 22.12 o superior y su soporte de eliminación de tipos:

```bash
node --experimental-strip-types --test domain.test.mjs
```

No necesitas DOM ni un servidor para comprobar esta regla. El ejemplo presupone un recuento válido de administradores; no sustituye las validaciones de entrada, autorización ni concurrencia del backend. El ejecutor nativo está documentado en [Node.js Test runner](https://nodejs.org/api/test.html).

### Casos de uso

Repositorios falsos pequeños que verifiquen decisiones: cuándo se llama a una dependencia, qué error se devuelve y qué datos se envían.

### Infraestructura

Pruebas de contrato para serialización, rutas, cabeceras y errores HTTP.

### UI

Pruebas orientadas al comportamiento visible: el usuario puede iniciar la acción, entiende por qué está bloqueada y recibe un estado de error accesible.

### Flujo completo

Pocas pruebas E2E para los recorridos de mayor riesgo. No necesitas reproducir cada combinación que ya cubrió el dominio.

## ¿Qué errores hacen que Clean Architecture empeore un proyecto?

### Crear una interfaz para cada función

La inversión de dependencias sirve en fronteras que pueden cambiar o necesitan reemplazo. Una interfaz para sumar dos números solo agrega navegación.

### Duplicar modelos sin una razón

`UserDto`, `UserEntity`, `UserModel`, `UserViewModel` pueden ser cuatro formas justificadas o cuatro copias idénticas. La transformación debe proteger una diferencia real.

### Construir una carpeta `shared` infinita

Mover algo a `shared` porque apareció dos veces puede borrar su contexto. Primero confirma que ambas piezas cambian por la misma razón.

### Ocultar toda la biblioteca externa

Encapsular una dependencia estable detrás de una réplica exacta de su API no reduce acoplamiento; solo crea una API adicional que mantener.

### Diseñar para una escala imaginaria

Una landing, un prototipo y un panel empresarial no necesitan el mismo número de capas. La arquitectura debe pagar su costo con cambios que realmente esperas.

## ¿Cuándo merece la pena extraer una capa?

Antes de crear un caso de uso, puerto o adaptador, pregunto:

1. ¿Existe una regla independiente de React?
2. ¿Este proveedor o contrato externo puede cambiar?
3. ¿Necesito probar esta decisión sin renderizar una pantalla?
4. ¿Más de una interfaz ejecutará la misma acción?
5. ¿La transformación protege al resto del sistema de datos externos?

Si casi todas las respuestas son “no”, mantengo el código cerca de la funcionalidad.

## ¿Cuál es el criterio para decidir?

La mejor arquitectura frontend no es la que exhibe más patrones. Es la que permite responder con claridad:

- dónde vive una regla;
- quién puede cambiarla;
- qué depende del framework;
- qué ocurrirá si cambia la API;
- cómo comprobar que la decisión sigue siendo correcta.

Empieza con componentes y funcionalidades claras. Extrae límites cuando el código te muestre una razón. Clean Architecture funciona mejor como una herramienta para controlar dependencias que como una plantilla que debes completar.

Si estás usando este ejemplo para una candidatura, acompaña el código con [un caso de estudio que explique decisiones y límites](/blog/que-hace-valioso-un-proyecto-de-portafolio). Si todavía dependes de copiar ejemplos, prueba la [ruta para aprender a programar construyendo proyectos pequeños](/blog/como-aprender-a-programar-sin-coleccionar-tutoriales).

## Fuentes y alcance de esta guía

- [The Clean Architecture, Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html): origen de la regla de dependencias. La estructura de carpetas de este artículo es una adaptación, no una obligación del patrón.
- [Thinking in React, documentación de React](https://react.dev/learn/thinking-in-react): descomposición de interfaces, estado mínimo y flujo de datos. React no exige implementar estas cuatro capas.
- [Overview, documentación de TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview): alcance del estado de servidor, caché y sincronización; no reemplaza las reglas de negocio.
- [Front-End Clean Architecture, Gentleman Programming](https://github.com/Gentleman-Programming/Front-End-Clean-Architecture): referencia que inspiró mis notas originales.

El caso de suspensión es didáctico. Las decisiones deben adaptarse a las reglas, riesgos y tamaño de cada aplicación; añadir capas no demuestra por sí solo que una solución sea mejor.
