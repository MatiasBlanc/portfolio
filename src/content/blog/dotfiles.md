---
title: "¿Cómo organizar tus dotfiles para reconstruir tu entorno Linux?"
description: "Cómo organizo Neovim, Kitty y mis herramientas de terminal, qué merece vivir en Git y qué aprendí después de convertir la configuración en un proyecto."
lang: es
pubDate: 2026-07-21
updatedDate: 2026-09-03
status: build
tags:
  - Terminal
  - Neovim
  - Linux
image: ../../assets/blog/dotfiles.webp
imageAlt: "Editor Neovim y terminal Kitty con el tema Tokyo Night"
faq:
  - question: "¿Necesito saber Lua para configurar Neovim?"
    answer: "No para empezar. Puedes modificar opciones y keymaps básicos con poco Lua, pero conviene entender cada fragmento que copies antes de depender de él."
  - question: "¿Debo copiar todos tus dotfiles?"
    answer: "No. Usa el repositorio como referencia y adopta una pieza a la vez. Una configuración personal funciona cuando refleja tu flujo, no cuando reproduce el de otra persona."
  - question: "¿Cómo sincronizo dotfiles entre equipos?"
    answer: "Mantén en Git solo archivos portables, excluye secretos y datos de sesión, y enlaza o copia las configuraciones desde un repositorio clonado. Un script de instalación puede venir después."
---

**Un repositorio de dotfiles debe conservar solo la configuración que puedes explicar y reconstruir: preferencias portables, dependencias declaradas y ningún secreto.** En mi caso reúne Neovim, Kitty y herramientas de terminal para recuperar un entorno Linux sin depender de la memoria.

Durante años configuré el editor como quien ordena un escritorio: movía cosas hasta que se veían bien y esperaba no tener que repetirlo. Cada reinstalación demostraba que no tenía un sistema, solo una máquina cuidadosamente improvisada.

Mis [dotfiles](https://github.com/MatiasBlanc/dotfiles) nacieron para cambiar eso. El repositorio conserva la configuración que puedo explicar, reconstruir y revisar; no una copia completa de mi carpeta personal.

> Un buen setup no es el que tiene más plugins. Es el que puedes perder hoy y recuperar mañana sin depender de tu memoria.

## ¿Qué versiono en mis dotfiles?

El núcleo actual tiene tres partes:

```text
dotfiles/
├── kitty/
│   ├── kitty.conf
│   └── tokyonight.conf
├── nvim/
│   ├── init.lua
│   ├── lazy-lock.json
│   ├── lua/
│   │   ├── core/
│   │   └── plugins/
│   └── snippets/
├── pi/
│   └── agent/
├── .gitconfig
└── AGENTS.md
```

También experimento con configuración de agentes y herramientas de terminal. Eso vuelve más importante separar **preferencias portables** de estado generado, cachés y credenciales.

## ¿Qué regla uso para decidir qué entra al repositorio?

Un archivo debe cumplir al menos una de estas condiciones:

- cambia deliberadamente cómo trabajo;
- sería costoso reconstruirlo de memoria;
- sirve como documentación ejecutable;
- necesita historial para entender por qué cambió.

No versiono un archivo solo porque existe dentro de `~/.config`.

Quedan fuera:

- tokens y secretos;
- historiales y sesiones;
- cachés;
- logs;
- rutas privadas que solo funcionan en una máquina;
- archivos generados que la herramienta puede reconstruir.

Esta frontera es más importante que la elección entre Neovim y VS Code.

## ¿Cómo mantengo explícita la configuración de Neovim?

Mi `init.lua` hace poco: define la tecla líder, carga opciones propias, instala `lazy.nvim` si falta y descubre los módulos de plugins.

```lua
vim.g.mapleader = " "
require("core")

require("lazy").setup({
  { import = "plugins" },
})
```

Cada plugin tiene un archivo. No porque una carpeta por plugin sea universalmente mejor, sino porque puedo desactivar uno, revisar su configuración y entender su impacto sin recorrer un bloque enorme.

### El conjunto que realmente sostiene mi flujo

| Necesidad | Herramienta |
| --- | --- |
| Buscar archivos y texto | Telescope |
| Navegar el árbol | nvim-tree |
| LSP e instalación | nvim-lspconfig + Mason |
| Autocompletado | nvim-cmp |
| Sintaxis estructural | Treesitter |
| Formato | conform.nvim |
| Señales de Git | gitsigns.nvim |
| Snippets | LuaSnip |
| Integración con el agente | pi-agent.nvim |

La lista completa es más larga, pero esta tabla cuenta mejor la historia: cada dependencia debe responder a una fricción concreta.

## ¿Qué keymaps sobreviven a las modas?

Los atajos más valiosos no son los más ingeniosos. Son los que uso hasta olvidarme de que los configuré.

```lua
local map = vim.keymap.set
local opts = { noremap = true, silent = true }

map("n", "<leader>w", ":w<CR>", opts)
map("n", "<C-h>", "<C-w>h", opts)
map("n", "<C-j>", "<C-w>j", opts)
map("n", "<C-k>", "<C-w>k", opts)
map("n", "<C-l>", "<C-w>l", opts)
map("n", "<Esc>", ":noh<CR>", opts)
```

También mantengo el cursor centrado al saltar resultados, conservo la selección después de indentar y separo “eliminar” de “sobrescribir el portapapeles”. Son detalles pequeños que eliminan interrupciones cientos de veces.

Un atajo muy específico ejecuta archivos sobre un RP2040:

```lua
map(
  "n",
  "<leader>r",
  ":w<CR>:vsplit term://mpremote run %<CR>",
  { desc = "Ejecutar script en RP2040" }
)
```

Ese *keymap* explica mejor por qué existen los dotfiles que cualquier captura bonita: adapta una herramienta general a una tarea que yo repito.

## ¿Qué consecuencias tienen estas opciones?

Algunas preferencias son visuales; otras cambian cómo el editor protege el trabajo.

```lua
vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.undofile = true
vim.opt.swapfile = false
vim.opt.backup = false
vim.opt.clipboard = "unnamedplus"
```

Desactivar `swapfile` y `backup` reduce archivos auxiliares, pero también elimina mecanismos de recuperación. Solo tiene sentido porque conservo historial persistente de *undo* y versiono el código. Copiar esas líneas sin entender el intercambio sería una mala recomendación.

Esa es una lección general: **cada opción debería poder explicarse como una decisión, no como una superstición heredada de otro README**.

## ¿Cómo configuro Kitty sin convertirlo en otro sistema operativo?

Uso Kitty por su renderizado acelerado, divisiones nativas y configuración en texto. Mi archivo define fuente, márgenes, alerta visual, opacidad, tema y unos pocos atajos.

```ini
font_family family="JetBrainsMono Nerd Font"
font_size 14.0
enabled_layouts splits, stack
background_opacity 0.95

map ctrl+shift+h launch --location=hsplit
map ctrl+shift+v launch --location=vsplit
```

El tema Tokyo Night mantiene una identidad visual común con Neovim. Me gusta que el entorno se vea cuidado, pero la estética tiene una condición: no puede impedir leer contraste, distinguir el foco o trabajar sin transparencia.

## ¿Por qué importa `lazy-lock.json`?

Declarar plugins permite instalar “algo parecido” a mi editor. Versionar el *lockfile* permite reconstruir versiones concretas.

Sin ese archivo, una instalación nueva puede traer cambios incompatibles aunque mi configuración no haya variado. Con él, actualizar se convierte en una decisión que Git puede mostrar y revertir.

Lo mismo aplica a cualquier entorno reproducible: la lista de dependencias describe la intención; el *lockfile* describe el estado.

## ¿Qué hice mal al principio?

### Documenté una configuración ideal, no la real

Mi README llegó a mencionar carpetas y herramientas que ya no estaban en el repositorio. Una documentación desincronizada es peor que una breve: hace que una instalación falle mientras asegura que todo funciona.

Ahora trato el árbol real como fuente de verdad y evito prometer un instalador que todavía no existe.

### Convertí opiniones en verdades

“Este es el mejor gestor” o “editarás a la velocidad del pensamiento” suenan bien, pero no ayudan. Neovim tiene una curva de aprendizaje y mantenimiento. VS Code resuelve muchas necesidades con menor costo inicial. La herramienta correcta depende del trabajo y de cuánto quieras convertir la configuración en una afición.

### Guardé rutas absolutas

Una ruta como `/home/mblanc/...` funciona exactamente en un equipo. Prefiero `vim.fn.expand("~")`, variables de entorno o rutas calculadas desde el archivo cuando una configuración debe ser portable.

### Añadí plugins antes de aprender la función nativa

Cada plugin agrega carga, configuración, actualizaciones y posibilidades de conflicto. Primero intento resolver el problema con Neovim; después agrego una dependencia si mejora de forma clara la experiencia.

## ¿Cómo empezar tus propios dotfiles?

No copies el repositorio completo. Hazlo en capas:

1. versiona la configuración de una sola herramienta;
2. elimina secretos y rutas personales;
3. reinstálala manualmente en otro directorio o contenedor;
4. documenta dependencias reales;
5. añade *lockfiles*;
6. crea enlaces simbólicos o un script solo cuando el proceso esté estable.

Una prueba sencilla ayuda: si no puedes explicar una línea, coméntala o elimínala hasta saber por qué la necesitas. Para comprobar la reconstrucción, instala primero una sola herramienta en un directorio limpio o contenedor, verifica que las dependencias existen y documenta el resultado antes de añadir un instalador automático.

## ¿Qué falta para hacer reproducibles estos dotfiles?

Mi repositorio todavía necesita:

- un instalador idempotente;
- comprobaciones de dependencias y versiones;
- una estrategia clara para enlaces simbólicos;
- una auditoría para eliminar archivos generados;
- capturas actualizadas;
- CI mínima que valide Lua y enlaces rotos.

No los escondo porque son parte del proyecto. Un setup personal nunca está “terminado”; lo importante es distinguir evolución de acumulación.

## ¿Cuál es el objetivo final de mis dotfiles?

Mis dotfiles no buscan demostrar que uso herramientas difíciles. Buscan reducir el número de decisiones que repito cuando cambio de equipo, reinstalo Fedora o pruebo una nueva forma de trabajar.

La mejor señal de que funcionan no es una terminal espectacular. Es abrir una máquina limpia y volver a construir, con calma, un entorno que reconozco.
