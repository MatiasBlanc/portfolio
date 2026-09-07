---
title: "¿Cómo conecté Telegram con Obsidian mediante IA? El caso de Hugr"
description: "La arquitectura y las decisiones detrás de mi asistente personal: voz, documentos y mensajes convertidos en notas útiles de Obsidian y eventos de calendario."
lang: es
pubDate: 2026-08-15
updatedDate: 2026-09-03
status: build
tags:
  - Obsidian
  - Python
  - Automatización
  - Productividad
image: ../../assets/blog/hugr.webp
imageAlt: "Arquitectura de Hugr entre Telegram, Obsidian y Google Calendar"
---

**Hugr conecta Telegram con Obsidian y Google Calendar para convertir mensajes, audios, imágenes y documentos en notas o eventos estructurados.** Está construido con Python y Pydantic: el modelo propone JSON, la aplicación lo valida y solo después ejecuta una escritura o acción permitida.

Mis notas no se perdían porque me faltara una aplicación. Se perdían porque capturarlas exigía cambiar de contexto.

Una idea aparecía caminando y terminaba en un mensaje guardado. Una fecha quedaba enterrada en un PDF. Un avance de proyecto vivía en Telegram y otro en una nota de Obsidian. El problema no era almacenar información: era **convertir una captura rápida en algo que pudiera encontrar y usar después**.

Así nació Hugr, mi asistente personal conectado a Telegram, Obsidian y Google Calendar. El procesamiento de servicios externos debe considerarse parte del modelo de privacidad: que la bóveda sea local no implica que cada entrada se interprete localmente.

> Hugr no intenta recordar todo por mí. Intenta que cada cosa llegue al lugar donde mi yo del futuro esperaría encontrarla.

## ¿Qué hace Hugr?

Hugr recibe texto, notas de voz, audios largos, imágenes y documentos. A partir de ese material puede:

- transcribir audio;
- detectar si estoy creando una nota, actualizando un proyecto o registrando un evento;
- producir datos estructurados y validarlos;
- crear o anexar contenido en mi bóveda;
- proponer un evento de calendario;
- ofrecer acciones contextuales, como crear un checklist o guardar un *snippet*;
- recuperar información previa mediante búsqueda textual o semántica.

Telegram es la bandeja de entrada. Obsidian conserva el conocimiento. El bot es la capa que traduce entre ambos. Para proteger la privacidad, las credenciales se mantienen fuera del repositorio y los proveedores que reciben contenido deben estar identificados y limitados según el tipo de dato.

## ¿Cuál es el flujo completo de Hugr?

```text
Texto / voz / imagen / PDF
            ↓
        Telegram
            ↓
Transcripción o extracción
            ↓
 Clasificación de intención
            ↓
 JSON validado con Pydantic
       ↙           ↘
Obsidian        Calendar
       ↘           ↙
 Respuesta y acciones en Telegram
```

La parte importante del diagrama no es el modelo de lenguaje. Es el contrato estructurado que viene después.

## ¿Cómo evita Hugr que un LLM escriba directamente en la bóveda?

La primera tentación era pedirle al modelo una ruta y contenido, y guardar su respuesta. Eso convertía una salida probabilística en una operación sobre archivos personales.

Hugr intercala un “portero”:

1. el modelo devuelve JSON;
2. Pydantic valida campos, tipos e intención;
3. las rutas se normalizan y restringen;
4. si la respuesta no cumple el contrato, se corrige o se rechaza;
5. solo entonces se escribe.

Este límite evita títulos vacíos, categorías inventadas y rutas fuera de las áreas permitidas. También hace que los errores sean visibles en vez de esconderlos detrás de un `try/except` silencioso.

## ¿Cuándo conviene crear una nota y cuándo anexarla?

Una bóveda puede volverse inútil por exceso de notas pequeñas. Por eso Hugr distingue entre dos operaciones:

- **CREATE:** inicia una nota nueva cuando aparece una entidad o tema independiente.
- **APPEND:** agrega una actualización fechada a una nota existente.

Decir “avancé con la autenticación de ITF App” no debería crear `Avancé con la autenticación.md`. Debería encontrar el proyecto y registrar una actualización dentro de su contexto.

La decisión parece menor, pero determina si el sistema construye memoria o solo acumula archivos.

## ¿Cómo organizo la bóveda para mis áreas reales?

Uso una adaptación de PARA:

```text
hugrVault/
├── 00_Daily/
├── 01_Inbox/
├── 02_Areas/
│   ├── Dev/
│   ├── Universidad/
│   ├── Taekwondo/
│   └── Twitter/
├── 03_Resources/
│   ├── Learning/
│   ├── People/
│   └── Templates/
└── 04_Archive/
```

No intenté reproducir un método de productividad de forma literal. Las carpetas reflejan responsabilidades que ya existen en mi vida: universidad, software, entrenamiento y contenido.

Esa estructura también permite que el bot tome decisiones acotadas. Elegir entre cinco áreas conocidas es más seguro que pedirle que invente una taxonomía en cada mensaje.

## ¿Por qué una cola local fue más importante que otro modelo?

Si Dropbox deja de sincronizar o una escritura falla, no quiero perder la captura original. Hugr usa una cola local para desacoplar la recepción del mensaje y la escritura definitiva.

Este patrón mejora más la confianza que cambiar a un modelo ligeramente mejor:

- Telegram confirma que recibió el material;
- la operación queda registrada;
- el *worker* puede reintentar;
- un fallo no obliga a recordar y reenviar la idea.

Un segundo cerebro al que no confío información urgente es solo una demo.

## ¿Qué funciones surgieron del uso diario?

### Agenda y rutina académica

Hugr consulta Calendar, resume el día y organiza información de asignaturas, evaluaciones y asistencia. Los comandos explícitos siguen existiendo porque no todo necesita lenguaje natural: `/hoy` es más rápido y predecible que formular una pregunta distinta cada mañana.

### Captura de contenido

Las ideas para X llegan a una carpeta editorial con estado y metadatos. Allí se conectan con Trending2Tweet, pero ninguna queda publicada por el solo hecho de haber sido generada.

### Memoria consultable

La búsqueda semántica permite preguntar por decisiones anteriores sin recordar el nombre exacto del archivo. La respuesta debe conservar citas o referencias a las notas originales; de lo contrario, una “memoria” generativa puede mezclar hechos con inferencias.

### Rutinas proactivas

Un resumen matinal y un cierre nocturno convierten el sistema en algo más que una bandeja de entrada. Aun así, mantengo pocas notificaciones. Un asistente que interrumpe demasiado pronto se convierte en otra aplicación silenciada.

## ¿Cómo trato la privacidad y los límites?

Hugr procesa información personal, así que la seguridad no es una mejora futura. El sistema aplica una lista de usuarios autorizados, separa secretos del repositorio y limita rutas y operaciones.

También mantengo una distinción clara:

- el **vault** es la fuente legible y portable;
- el **índice semántico** es derivado y se puede reconstruir;
- el **LLM** interpreta, pero no es la fuente de verdad.

Esta separación evita quedar atrapado en un proveedor o en una base vectorial específica.

## ¿Qué salió mal al construir Hugr?

Construí funciones antes de consolidar hábitos. Finanzas por voz, CRM, seguimiento académico, lectura de documentos y contenido son útiles, pero juntas amplían demasiado la superficie del producto.

Hoy evalúo cada nueva idea con una regla:

> Si la función no elimina una fricción que aparece varias veces por semana, todavía no merece automatización.

También aprendí que el nombre “segundo cerebro” promete demasiado. Hugr no comprende mi vida. Clasifica capturas, ejecuta contratos y recupera contexto. Describirlo así me obliga a diseñarlo mejor.

## ¿Qué sigue para Hugr?

Mis prioridades son menos espectaculares y más valiosas:

1. reforzar observabilidad y recuperación de la cola;
2. medir errores de clasificación con ejemplos reales;
3. mejorar la estrategia de anexado para evitar duplicados;
4. hacer que cada respuesta de memoria cite su nota;
5. reducir comandos y botones que no uso.

## ¿Cuál es la idea principal de Hugr?

El valor de Hugr no está en hablar con una IA desde Telegram. Está en cerrar la distancia entre **“esto importa”** y **“esto quedó organizado”**.

Cuando esa distancia se reduce a un audio de treinta segundos, tomar notas deja de competir con vivir la experiencia que quiero recordar.
