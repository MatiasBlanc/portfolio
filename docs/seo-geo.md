# SEO y visibilidad en buscadores con IA

Revisión: 19 de octubre de 2026. Dominio canónico: `https://mb.madeinchile.tech`.

## Diagnóstico: qué sabemos y qué no

El propietario informa cero impresiones y cero clics en Search Console. No se dispone de acceso a esa propiedad, a sus filtros, al historial de indexación ni a los registros del hosting. **No está demostrada la causa de las cero impresiones.**

Comprobaciones públicas previas a los cambios:

- La portada, `/blog` y un artículo consultado respondían HTTP 200. Esto no demuestra que Google los haya indexado ni que un firewall permita todos sus rastreadores.
- `robots.txt` permitía el rastreo general y el sitemap enumeraba 16 páginas.
- La imagen predeterminada `/project-itf.webp` devolvía 404. También se usaba como supuesta imagen del autor, aunque no era una foto suya.
- Las tarjetas, el RSS y el sitemap enlazaban con barra final; otros enlaces no. La canonical dependía de la variante de ruta.
- El blog estaba en español, pero su listado declaraba inglés y reutilizaba la descripción de la portada. El menú elegía inglés por defecto, contradiciendo la inicialización del head.
- El contenedor de Google Translate se insertaba en el head: HTML inválido que podía alterar su interpretación por el navegador.
- La portada tenía una pantalla de entrada que requería JavaScript para desaparecer.
- Una consulta pública `site:mb.madeinchile.tech` no devolvió resultados en el proveedor consultado. **No equivale al informe de indexación de Google** y no sirve para contar páginas indexadas.

Los artículos ya tenían respuestas iniciales, encabezados descriptivos y límites explícitos. No hacía falta convertirlos en contenido masivo generado ni repetir palabras clave.

## Cambios implementados

- URLs sin barra final, salvo la raíz; canonical, enlaces, sitemap y RSS alineados.
- Títulos y descripciones propios para portada, blog y proyectos, con intención y contexto local verificable.
- Imagen social propia de 1200 × 630; metadatos de imagen, idioma y permiso de previews grandes.
- JSON-LD con una identidad de autor estable, WebSite, WebPage/CollectionPage, BlogPosting y BreadcrumbList. El titular del artículo no incluye el sufijo de marca.
- Idioma original del contenido en HTML y schema. Los casos de estudio existentes siguen en inglés; no se presentan como traducciones españolas publicadas.
- Contenedor de traducción trasladado al body y configurado con el idioma original. No se añaden `hreflang`: el cambio de idioma por JavaScript no crea URLs traducidas indexables.
- Blog con presentación en español, guías destacadas, índices navegables sin JavaScript, autor visible, breadcrumbs y enlaces relacionados por etiquetas compartidas.
- Guía de Clean Architecture ampliada con tabla de responsabilidades, cuatro pruebas ejecutables, fuentes primarias y enlaces contextuales.
- `OAI-SearchBot` permitido explícitamente. Ya estaba cubierto por `User-agent: *`; no era un bloqueo demostrado. Se conservan los permisos anteriores de entrenamiento.
- Portada visible sin esperar una pantalla de entrada.
- Validación reproducible: `npm run check:seo` o `bun run check:seo`.

## Prioridad 1: verificar indexación después de publicar

1. **Desplegar estos cambios** mediante el flujo habitual. No se ha realizado un despliegue desde esta revisión.
2. En Search Console, confirmar la propiedad: `https://mb.madeinchile.tech/` o una propiedad de dominio que la incluya. Una propiedad de prefijo `https://madeinchile.tech/` no representa automáticamente este subdominio.
3. En Rendimiento, quitar filtros de consulta/página/país, seleccionar búsqueda Web y revisar tanto los últimos 28 días como un período más amplio. Distinguir cero impresiones de cero clics.
4. Enviar `https://mb.madeinchile.tech/sitemap-index.xml` en Sitemaps y comprobar el estado de lectura. Que sea leído no garantiza indexación.
5. Inspeccionar la portada, `/blog` y `/blog/clean-architecture-reactjs`. Anotar para cada URL:
   - estado de indexación y motivo de exclusión;
   - última fecha de rastreo;
   - si se permite rastreo e indexación;
   - canonical declarada y canonical seleccionada por Google;
   - resultado de «Probar URL publicada» y HTML renderizado.
6. Si la prueba pública funciona y la URL es canónica, solicitar indexación de estas páginas prioritarias. No repetir la solicitud cada día ni enviar todas las variantes de la misma URL.
7. Revisar Acciones manuales y Problemas de seguridad. Si hay errores de acceso, revisar registros y reglas del hosting/CDN; una petición con user-agent simulado no verifica por sí sola el acceso de Googlebot.
8. Validar las páginas publicadas con [Rich Results Test](https://search.google.com/test/rich-results) y [Schema Markup Validator](https://validator.schema.org/). La prueba local comprueba coherencia del marcado, no certifica elegibilidad para funciones de Google.

### Qué hacer según el informe

| Estado | Próxima acción |
| --- | --- |
| Descubierta, actualmente sin indexar | Revisar enlaces internos, disponibilidad del servidor y utilidad/diferenciación del contenido. No implica necesariamente un error de código. |
| Rastreada, actualmente sin indexar | Revisar duplicados, canonical y si aporta una respuesta original frente a otras páginas. Mejorar evidencia antes que aumentar longitud. |
| Duplicada / Google eligió otra canonical | Comparar ambas páginas y dominios, comprobar redirecciones y usar la misma URL en enlaces y sitemap. |
| Bloqueada, noindex o error HTTP | Corregir la regla, cabecera, respuesta o configuración que señale la prueba pública. |
| Indexada, cero impresiones | Investigar consultas e intención: una página indexada no tiene garantizada demanda ni posiciones visibles. |
| Impresiones, pocos clics | Revisar consultas reales, posición, título y descripción. Comparar CTR solo entre consultas y posiciones similares. |

No cambiar de dominio solo para intentar escapar del cero. Si existen copias del portfolio en otros dominios propios, comprobarlas primero y consolidar con redirecciones permanentes cuando corresponda.

## Prioridad 2: enfoque editorial y descubrimiento

Elegir una prioridad comercial: proyectos/clientes o empleo técnico. La portada puede servir a ambos, pero cada artículo debería atender una pregunta concreta, no todas a la vez.

### Temas propuestos para las próximas cuatro semanas

Son hipótesis editoriales, **no palabras clave con volumen o dificultad medidos**. Validarlas con consultas reales de Search Console cuando haya datos.

| Semana | Acción | Evidencia que conviene aportar |
| --- | --- | --- |
| 1 | Publicar la guía mejorada de Clean Architecture en React y distribuirla | Código ejecutable, salida de pruebas y explicación de cuándo no usar capas. |
| 2 | Profundizar «Astro o React para la web de un negocio» a partir de Riego Mendoza y FECHITAT | Restricciones reales, decisiones distintas por proyecto y enlaces a los casos de estudio. No atribuir conversiones no medidas. |
| 3 | Ampliar Hugr para «Telegram a Obsidian con IA» | Un flujo reproducible, validación de salida, tratamiento de errores y capturas sin información privada. |
| 4 | Mejorar un caso de estudio de portafolio | Responsabilidad individual, estado real, repositorio/demo si existen y límites del prototipo. |

React/TypeScript, desarrollo de sitios para organizaciones y automatización con IA son líneas más conectadas con la oferta del portfolio que artículos generales de bienestar. Conservar estos últimos si aportan valor, pero no usarlos como principal estrategia de captación técnica.

Para cada publicación:

- Responder la pregunta al inicio, luego explicar condiciones y excepciones.
- Añadir código probado, capturas propias o datos con método y fecha. No fabricar experiencias, clientes, testimonios ni resultados.
- Enlazar fuentes primarias para hechos verificables; distinguir una recomendación personal de un requisito técnico.
- Conectar con uno o dos artículos o proyectos realmente relacionados.
- Actualizar `updatedDate` solo tras un cambio sustancial, no en cada build.
- Compartir un resumen útil en LinkedIn, GitHub y comunidades pertinentes, con el enlace canónico. Pedir feedback concreto, no publicar el mismo enlace en masa.
- Añadir el portfolio al perfil y README de GitHub y comprobar el enlace de LinkedIn. Solicitar menciones legítimas en proyectos o colaboraciones solo cuando corresponda.
- Mantener `public/llms.txt` consistente al cambiar títulos, URLs o estado de proyectos; hoy es un resumen manual.

No comprar enlaces, crear páginas repetidas para cada ciudad ni copiar artículos de competidores. Una ficha de Google Business Profile solo corresponde si se cumplen sus reglas de elegibilidad; no basta tener una web o trabajar desde Coquimbo.

## GEO: aparecer como fuente en respuestas de IA

[GEO aquí significa visibilidad en buscadores generativos, no geolocalización.]

- **Google AI Overviews / AI Mode:** según Google, se aplican los fundamentos de SEO. Para ser enlace de apoyo, la página debe estar indexada y ser elegible para mostrarse con un snippet. No exige un schema especial ni un archivo de IA.
- **ChatGPT Search:** permitir `OAI-SearchBot` y comprobar que la infraestructura no lo bloquee. Es independiente de `GPTBot`, que tiene relación con entrenamiento. Permitir entrenamiento no garantiza citas ni posiciones.
- **Contenido citable:** respuestas precisas, términos definidos, tablas útiles, pasos reproducibles y límites explícitos. Todo debe ser visible para los lectores, no únicamente dentro de JSON-LD.
- **Identidad y evidencia:** autor identificable, perfiles coherentes, enlaces a proyectos reales y fuentes originales. No inflar credenciales con marcado estructurado.
- **`llms.txt`:** mantenerlo como documento auxiliar; no es un requisito de Google ni una garantía de lectura o cita de otros proveedores.
- **FAQ:** las preguntas pueden ayudar al lector, pero el marcado FAQPage no es una vía garantizada a resultados enriquecidos para este portfolio.

Ningún cambio técnico puede obligar a ChatGPT, Google o Perplexity a citar una página.

## Seguimiento: qué medir

Registrar una línea base el día del despliegue y comparar períodos equivalentes de 28 días, además de revisar errores semanalmente:

1. Páginas canónicas indexadas frente a páginas publicadas.
2. Impresiones y número de consultas no relacionadas con «Matías Blanc».
3. Clics y CTR por consulta y página, considerando la posición.
4. Artículos que llevan visitas a proyectos o contacto.
5. Consultas comerciales recibidas y origen declarado por la persona.

Search Console incluye las funciones de IA de Google dentro de Web; ese informe no es un contador separado de citas en IA. Para visitas desde otros asistentes, se necesita analítica o registros con referentes disponibles. Una visita sin referente no puede atribuirse automáticamente a IA. No se incorporó seguimiento adicional de usuarios en este cambio.

El rastreo y la indexación pueden tardar; no hay un plazo garantizado ni una promesa de impresiones. Si después de publicar persiste el cero, el siguiente dato necesario es el resultado exacto de Inspección de URL, no otro bloque de metadatos.

## Fuentes consultadas

- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: requisitos técnicos](https://developers.google.com/search/docs/essentials/technical)
- [Google: inspección de URLs](https://support.google.com/webmasters/answer/9012289)
- [Google: informe de indexación de páginas](https://support.google.com/webmasters/answer/7440203)
- [Google: marcado de artículos](https://developers.google.com/search/docs/appearance/structured-data/article)
- [OpenAI: rastreadores y controles independientes](https://developers.openai.com/api/docs/bots)
