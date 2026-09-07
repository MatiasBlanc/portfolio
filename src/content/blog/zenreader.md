---
title: "¿Cómo diseñé ZenReader para leer artículos sin distracciones?"
description: "Cómo diseñé una extensión de navegador open source centrada en tipografía, almacenamiento local y privacidad para leer sin anuncios ni distracciones."
lang: es
pubDate: 2026-08-20
updatedDate: 2026-09-03
status: build
tags:
  - TypeScript
  - WebExtensions
  - Open Source
  - Privacidad
  - Frontend
---

**ZenReader es una extensión de navegador de código abierto que extrae el contenido principal de páginas compatibles, lo muestra con una interfaz tipográfica configurable y guarda copias localmente para leerlas sin conexión cuando los recursos fueron almacenados.** No requiere una cuenta ni incorpora telemetría en su diseño actual, pero la privacidad depende también de los permisos y del navegador donde se instala.

Intentar leer un artículo técnico en la web actual se ha convertido en una prueba de paciencia.

Abres un enlace y antes del primer párrafo te encuentras con un banner de cookies que ocupa media pantalla, un video flotante con reproducción automática en la esquina inferior, tres anuncios parpadeantes entre los encabezados y un modal rogándote que te suscribas a un newsletter.

La web fue concebida como el medio definitivo para compartir texto e ideas, pero la arquitectura publicitaria moderna la convirtió en un casino visual.

Para resolver mi propia frustración con la lectura diaria construí **ZenReader**, una extensión de navegador de código abierto diseñada para transformar páginas compatibles en una experiencia de lectura limpia, tipográficamente cuidada y con almacenamiento local.

> El modo lectura no debería ser un accesorio secundario del navegador; debería ser una herramienta de preservación de la atención.

## ¿Qué hace ZenReader?

ZenReader intercepta el contenido de una página web y ejecuta un proceso de limpieza inmediata:

- **Aísla el texto principal:** intenta extraer el cuerpo del artículo descartando navegación, barras laterales, publicidad y widgets de comentarios.
- **Tipografía pensada para los ojos:** renderiza el contenido con anchos de línea configurables, interlineado calculado y escalas tipográficas legibles.
- **Temas adaptables:** incluye modos Claro, Sepia y Oscuro profundo para pantallas OLED.
- **Almacenamiento local (Local-First):** guarda lecturas completas directamente en el navegador para revisarlas después, incluso sin conexión cuando la copia local está disponible.
- **Sin telemetría en el diseño actual:** no requiere registro ni envía métricas de lectura a un servidor propio; los permisos de la extensión deben revisarse antes de instalarla.

## ¿Cómo transforma ZenReader una página?

```text
Página web con anuncios, scripts y ruido
                    ↓
        Content Script inyectado
                    ↓
 Extracción y scoring del DOM (Readability)
                    ↓
 Sanitización y renderizado tipográfico
        ↙                       ↘
 Lectura inmediata       Persistencia en IndexedDB (Offline)
```

## ¿Cómo funciona la arquitectura de ZenReader?

### 1. Extracción de contenido en el cliente

Muchas herramientas de "leer más tarde" envían la URL a sus propios servidores para procesar el HTML de forma remota (como hacen Pocket o Instapaper). 

ZenReader hace todo el trabajo de parseo **directamente en el navegador del usuario**. Esto tiene dos ventajas fundamentales:

1. **Menor exposición de datos:** el contenido puede procesarse en el navegador sin enviarlo a un servidor propio; esto no equivale a una garantía absoluta de privacidad.
2. **Acceso a contenido tras sesiones activas:** si estás leyendo un documento o publicación técnica en una intranet o detrás de tu propia sesión, ZenReader puede procesar el DOM renderizado sin pedirte credenciales adicionales.

El algoritmo recorre los nodos del DOM, asigna puntuaciones según densidad de texto, enlaces y etiquetas semánticas (`<article>`, `<main>`, `<p>`), y descarta contenedores con clases asociadas a publicidad o barras laterales.

### 2. Almacenamiento local con IndexedDB

Para la función de guardar artículos offline, la cuota de almacenamiento básica de `chrome.storage.sync` (alrededor de 100 KB) resultaba insuficiente.

En su lugar, utilicé **IndexedDB** a través de una abstracción ligera:

- Almacena el contenido HTML limpio, el título, el autor, la fecha de captura y el tiempo estimado de lectura.
- Permite gestionar una biblioteca personal de artículos sin depender de almacenamiento en la nube; el límite real depende de la cuota del navegador y del tamaño del contenido.

```typescript
interface SavedArticle {
  id: string;
  url: string;
  title: string;
  byline?: string;
  content: string;
  excerpt: string;
  readingTimeMinutes: number;
  savedAt: string;
  tags: string[];
}
```

### 3. Sistema de diseño y tipografía fluida

Una buena experiencia de lectura no es solo quitar anuncios; es cuidar el ritmo visual. La interfaz de ZenReader aplica reglas estrictas de diseño editorial:

- **Medida de columna controlada:** el texto nunca se expande al ancho completo de un monitor panorámico. Se fija entre `60ch` y `75ch` para evitar la fatiga ocular al saltar de línea.
- **Tipografías con licencia abierta de alta legibilidad:** soporte para fuentes serif editoriales (como Merriweather o Lora) y sans-serif modernas (como Inter o System UI).
- **Control de contraste accesible:** colores revisados con criterios de contraste de WCAG; la conformidad completa debe comprobarse por combinación, navegador y estado de la interfaz.

## ¿Qué aprendí construyendo ZenReader?

1. **El DOM real es caótico:** no todos los sitios usan etiquetas semánticas (`<article>` o `<section>`). Muchos medios de noticias anidan párrafos dentro de decenas de `<div>` sin sentido semántico. Diseñar heurísticas de extracción que no borren fragmentos legítimos de código o citas fue el mayor desafío técnico.
2. **Local-first simplifica la infraestructura:** al no tener backend centralizado, no hay servidores propios ni bases de datos remotas que mantener para esta función. Eso reduce superficie operativa, pero no elimina los riesgos del navegador, de los permisos ni del HTML que se procesa.

## ¿Qué limitaciones y próximos pasos tiene ZenReader?

ZenReader sigue evolucionando. Algunas de las funcionalidades en las que estoy trabajando incluyen:

- **Exportación directa a Markdown:** guardar artículos directamente en una bóveda de Obsidian o directorio local.
- **Sincronización P2P cifrada:** permitir sincronizar lecturas entre dispositivos sin pasar por un servidor centralizado.
- **Resaltado y notas marginales:** añadir anotaciones sobre el texto que permanezcan guardadas localmente.

---

ZenReader es código abierto y está pensado para cualquiera que valore la concentración y el placer de leer con calma en internet. Antes de presentarlo como compatible con cualquier sitio, necesito documentar navegadores, permisos, casos de extracción fallida y una auditoría reproducible de accesibilidad.
