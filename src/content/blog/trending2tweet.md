---
title: "Trending2Tweet: automatizar la búsqueda sin automatizar el criterio"
description: "Cómo construí un pipeline local en Python que convierte tendencias técnicas en borradores con fuentes, revisión humana y archivos Markdown."
lang: es
pubDate: 2026-07-01
updatedDate: 2026-09-03
status: build
tags:
  - Python
  - IA
  - Obsidian
  - Automatización
image: ../../assets/blog/trending2tweet.webp
imageAlt: "Flujo de Trending2Tweet desde las fuentes hasta un borrador en Obsidian"
---

Encontrar temas para escribir parecía una tarea simple hasta que intenté hacerla todos los días. Abría GitHub, Hacker News y X; guardaba diez enlaces; leía dos; publicaba ninguno.

Mi primera reacción fue automatizarlo todo. También fue la equivocada.

Un bot capaz de detectar una tendencia, resumirla y publicarla sin revisión ahorra tiempo, pero elimina justo la parte por la que alguien seguiría mi cuenta: **el criterio**. Por eso construí [Trending2Tweet](https://github.com/MatiasBlanc/Trending2Tweet) como un sistema *human in the loop*. La máquina busca y prepara; yo verifico, decido y escribo la versión final.

> No quería una cuenta que pareciera activa. Quería un proceso que me ayudara a tener algo propio que decir.

## El problema real no era escribir

El cuello de botella estaba antes del primer párrafo:

- recorrer varias fuentes;
- descartar duplicados y ruido;
- recuperar el contexto técnico;
- conservar el enlace original;
- empezar un borrador sin perder media hora organizándolo.

Trending2Tweet automatiza esa parte. Puede tomar candidatos de GitHub, Hacker News y Reddit, o analizar un repositorio elegido manualmente. Después crea una nota Markdown dentro de mi bóveda de Obsidian.

El resultado **no se publica solo**. Queda esperando una revisión.

## El pipeline actual

```text
Fuentes técnicas
      ↓
Parser específico de cada fuente
      ↓
LLM analista: extrae un brief factual
      ↓
LLM editor: propone el borrador
      ↓
Nota Markdown con fuente y checklist
      ↓
Revisión humana
      ↓
Publicación opcional en X
```

La interfaz vive en la terminal. Desde ahí puedo generar propuestas por categoría, mejorar una nota existente, revisar estadísticas, publicar una pieza aprobada y archivar lo que ya salió.

### 1. Cada fuente tiene su propio adaptador

Un repositorio de GitHub no se entiende igual que una noticia. Para GitHub me interesan el README, el propósito y las señales públicas del proyecto. Para Hacker News necesito el artículo original, no solo el titular. Para un reto de código necesito lenguaje, dificultad y una respuesta comprobable.

Separar esos adaptadores evita un “scraper universal” lleno de condiciones y me permite cambiar una fuente sin romper las demás.

### 2. Separé investigar de redactar

La primera versión usaba una sola llamada al modelo: recibía datos crudos y devolvía el tweet. Funcionaba, pero mezclaba hechos e interpretación. Cuando aparecía una afirmación dudosa, era difícil saber en qué etapa se había inventado.

Ahora hay dos responsabilidades:

1. un modelo prepara un brief usando únicamente la información recibida;
2. otro transforma ese brief en un borrador con restricciones editoriales.

No elimina las alucinaciones, pero reduce la superficie del problema y hace más fácil revisar el resultado.

### 3. Obsidian es el CMS

Podría haber creado un dashboard con login, editor enriquecido y base de datos remota. No lo hice porque ya tenía una interfaz mejor para mi caso: archivos Markdown.

Cada borrador guarda:

```yaml
---
type: tweet
status: draft
category: github
source: github_trending
url: "https://github.com/autor/proyecto"
date: "2026-09-03T18:30:00"
---
```

Debajo quedan el texto propuesto, sus metadatos y una lista de control:

- [ ] Revisar ortografía.
- [ ] Verificar datos y fuente.
- [ ] Agregar una experiencia o postura propia.
- [ ] Comprobar la longitud.
- [ ] Publicar.

Ese último tramo es intencionalmente manual.

## Decisiones técnicas poco glamorosas, pero importantes

### SQLite para no repetirme

El sistema registra identificadores procesados en una base SQLite local. No necesito un servicio distribuido para recordar qué repositorio ya apareció. Necesito una tabla pequeña, portable y fácil de inspeccionar.

### Proveedores compatibles con la API de OpenAI

La configuración acepta endpoints compatibles con OpenAI. Así puedo cambiar modelo de entrada y de salida mediante variables de entorno, sin acoplar toda la aplicación a un proveedor.

### Límites y rutas seguras

Los generadores tienen límites máximos; las credenciales viven fuera del repositorio; y las operaciones sobre notas validan que el archivo sea Markdown y permanezca dentro de la bóveda autorizada. En una herramienta que mueve y archiva contenido, una ruta mal validada es más peligrosa que un tweet mediocre.

## Lo que encontré al probarlo con contenido real

La automatización sí resolvió el trabajo mecánico. Mi bóveda empezó a llenarse de borradores sobre repositorios, noticias y código.

También apareció una verdad incómoda: **tener más borradores no significa tener mejores ideas**.

Los textos generados solían ser correctos y ordenados, pero intercambiables. Abusaban de adjetivos, buscaban un gancho antes de encontrar una postura y confundían resumen con análisis. Compararlos con mis notas manuales dejó clara la diferencia.

Por eso cambié el objetivo. Ya no optimizo el sistema para “generar contenido viral”. Lo optimizo para responder cuatro preguntas:

1. ¿De dónde salió esta afirmación?
2. ¿Qué parte aportó el modelo?
3. ¿Qué parte aporté yo?
4. ¿Por qué vale la pena publicar esto?

## Lo que todavía está incompleto

Trending2Tweet sigue en desarrollo. Hoy tiene limitaciones concretas:

- no cuenta con una suite de pruebas suficiente;
- un README no equivale a auditar un repositorio;
- truncar a 280 caracteres puede romper una buena frase en vez de reescribirla;
- un hilo puede quedar publicado a medias si X falla entre respuestas;
- las fuentes rápidas envejecen y requieren verificación el mismo día;
- todavía debo medir si el sistema mejora mi constancia o solo aumenta el inventario.

## El siguiente paso

Quiero convertir el checklist editorial en una máquina de estados: `capturado → verificado → editado → aprobado → publicado`. Ninguna pieza debería saltar desde “generada” hasta “publicada”.

También quiero evaluar consistencia de voz contra mis propios textos publicados. No para que una IA me imite, sino para detectar señales de alerta: clichés, afirmaciones sin fuente, tono promocional y conclusiones que yo nunca defendería.

## Lo que me enseñó este proyecto

Construir el scraper, el cliente de LLM y la integración con Obsidian fue la parte directa. Lo difícil fue diseñar **dónde termina la automatización**.

En herramientas creativas, el mejor flujo no siempre es el que elimina más pasos. A veces es el que conserva el paso en el que una persona se hace responsable de lo que firma.
