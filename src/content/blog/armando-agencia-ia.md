---
title: "¿Qué estoy automatizando con IA en una agencia unipersonal?"
description: "El sistema local con el que detecto negocios sin web, preparo una landing y produzco un primer contacto sin convertir la prospección en spam automático."
lang: es
pubDate: 2026-07-01
updatedDate: 2026-09-03
status: draft
tags:
  - Python
  - React
  - Automatización
  - IA
image: ../../assets/blog/armando-agencia-ia.webp
imageAlt: "Pipeline de una agencia unipersonal asistida por inteligencia artificial"
---

**Agencia IA es un sistema local para detectar negocios sin sitio propio, preparar una landing personalizada y redactar un primer contacto revisable por una persona.** No envía mensajes automáticamente ni pretende reemplazar la relación comercial: organiza el trabajo repetible de una agencia unipersonal y deja las decisiones comerciales en manos humanas.

Construir una landing para un negocio local puede tomar menos tiempo que conseguir al cliente. Buscar prospectos, revisar su presencia digital, ordenar información, preparar una demo y redactar un mensaje obliga a repetir el mismo trabajo antes de saber si habrá una conversación.

Estoy construyendo Agencia IA para reducir ese costo de exploración, no para convertir la prospección en volumen.

> La IA no reemplaza la relación con el cliente. Me ayuda a llegar a esa relación con una propuesta menos improvisada.

## ¿Qué parte del proceso comercial quiero mejorar?

```text
Google Places
      ↓
Negocios sin sitio propio
      ↓
Ficha local del prospecto
      ↓
Contenido, identidad y SEO
      ↓
Landing en React
      ↓
Build, captura y demo
      ↓
Borrador de contacto
```

Cada prospecto vive en una carpeta aislada con cuatro piezas:

```text
clients/prospectos/nombre_del_negocio/
├── 1_lead.json
├── 2_landing/
├── 3_outbox.txt
└── 4_data/
```

`1_lead.json` conserva datos y diagnóstico. `2_landing/` contiene el código. `4_data/` reúne la identidad, el contenido y los recursos. `3_outbox.txt` es el borrador del mensaje que solo se usa después de revisar todo.

## ¿Por qué elegí archivos locales en vez de una plataforma SaaS?

Una base de datos, un panel y un sistema multiusuario habrían hecho que el proyecto pareciera más serio. También habrían retrasado el aprendizaje principal: comprobar si el flujo ayuda a vender y entregar mejores sitios.

Con archivos locales obtengo:

- aislamiento claro entre clientes;
- historial mediante Git donde corresponde;
- copias de seguridad simples;
- cero infraestructura para un único operador;
- datos legibles incluso si abandono el proyecto.

La arquitectura no está pensada para escalar a cien empleados. Está pensada para que una persona pueda entender en qué etapa está cada oportunidad.

## ¿Cómo encontrar prospectos sin acosarlos?

`scout.py` consulta Google Places con una búsqueda como:

```bash
python scout.py "Dentistas en Valparaíso" --max 20 --rating 4.0 --dry-run
```

El script filtra negocios sin un sitio web propio y crea fichas con la información pública necesaria para evaluarlos. El modo `--dry-run` permite inspeccionar candidatos antes de escribir carpetas o consumir más recursos.

Encontrar un negocio sin web no significa que quiera una. El resultado del *scout* es una hipótesis, no un permiso para contactar.

## ¿Qué roles automatizo y qué responsabilidad conservo?

Organizo los prompts por función:

1. **Scout estratégico:** ordena la información disponible y detecta preguntas abiertas.
2. **Estratega:** propone identidad, contenido y SEO local.
3. **Builder:** adapta una base de React, Vite y Tailwind al negocio.
4. **Pitcher:** redacta un primer mensaje a partir de la demo terminada.

Los nombres ayudan a separar contextos, pero no convierten a los modelos en empleados autónomos. Yo sigo siendo responsable de verificar los datos, revisar el sitio y decidir si el contacto aporta valor.

## ¿Cómo evito convertir la agencia en una fábrica de plantillas?

El riesgo más visible es entregar la misma landing con otro logo. Para combatirlo, el flujo separa datos y presentación, y obliga a escoger la estructura según el negocio:

- una clínica necesita confianza, equipo y ubicación;
- un restaurante necesita carta, horario y reserva;
- un servicio técnico necesita cobertura, urgencia y evidencia;
- un profesional necesita explicar proceso y credenciales.

Aun así, un prompt no garantiza originalidad. La defensa real es comparar, editar y eliminar secciones que existen solo porque “todas las landing las tienen”.

## Automatizar el despliegue sin automatizar la promesa

El proyecto incluye herramientas para compilar, desplegar en Cloudflare Pages y generar una captura móvil. La URL se puede insertar en el borrador de contacto.

Eso acelera la entrega de una demo, pero introduce una responsabilidad: no publicar datos falsos, testimonios inventados ni información sensible. Una web técnicamente temporal ya es pública desde el momento en que tiene una URL.

## ¿Qué problemas todavía no están resueltos?

El proyecto sigue en borrador por razones concretas:

- debo validar el proceso con suficientes conversaciones reales;
- falta medir cuánto tiempo ahorra cada etapa;
- el enriquecimiento de datos necesita controles de exactitud;
- el despliegue y la captura requieren mejor manejo de fallos;
- las demos necesitan una política clara de expiración y privacidad;
- no quiero confundir volumen de prospectos con calidad comercial.

## ¿Cómo medir si la automatización aporta valor?

No mediría el éxito por cantidad de páginas generadas. Mediría:

- demos que superan mi revisión técnica;
- mensajes realmente personalizados;
- conversaciones iniciadas sin seguimiento invasivo;
- proyectos pagados;
- tiempo desde la selección del prospecto hasta una propuesta revisable.

Si el pipeline genera cincuenta sitios y ninguna conversación útil, no es automatización: es inventario.

## ¿Qué quiero demostrar con Agencia IA?

Agencia IA es un experimento sobre apalancamiento, no sobre reemplazo. Quiero saber cuánto puede avanzar una persona cuando convierte sus decisiones repetibles en un sistema, sin delegar su reputación a una salida probabilística.

Publicaré este artículo cuando tenga resultados reales, incluidos los intentos que no funcionaron. Hasta entonces, esta es la arquitectura; todavía no es el caso de éxito.
