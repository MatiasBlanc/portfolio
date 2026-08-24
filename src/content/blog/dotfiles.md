---
title: "El Setup Definitivo para Terminal: Mis Dotfiles"
description: "El stack definitivo para desarrollo. De VSCode a Neovim: Configurando el stack definitivo"
pubDate: 21 Jul 2026
status: build
updatedDate: 21 Jul 2026
tags:
  - Terminal
  - Neovim
  - Zsh
faq:
  - question: ¿Es necesario ser un experto para empezar a usar dotfiles?
    answer: No. Puedes empezar copiando configs, pero es mejor que entiendas cada línea antes de incluirla. Conocer lo básico de Zsh, Neovim y la estructura de archivos te evitará frustraciones al depurar.
  - question: ¿Qué diferencia hay entre una terminal como Kitty y el entorno de desarrollo integrado (VS Code)?
    answer: Kitty es una terminal. VS Code es un editor con terminal integrado. La diferencia clave es que Kitty renderiza por GPU y permite splits nativos, mientras que el IDE trae más herramientas integradas pero consume más recursos.
  - question: ¿Vale la pena el esfuerzo de migrar de VS Code a Neovim?
    answer: Si pasas muchas horas escribiendo código, sí. La curva de aprendizaje es real, pero una vez que la superas, editas a la velocidad del pensamiento y sin un navegador que consuma memoria.
  - question: ¿Cómo puedo mantener mis dotfiles sincronizados entre equipos?
    answer: Suelo usar un repositorio Git y crear symlinks manualmente (o con una herramienta como Stow). Así cualquier cambio queda versionado y puedes reinstalarlo en otra máquina de forma muy rápida.
---

<div align="left">

<div class="flex items-center gap-3 flex-wrap">
  <img src="https://img.shields.io/badge/Neovim-57A143?style=for-the-badge&logo=neovim&logoColor=white" alt="Neovim" />
  <img src="https://img.shields.io/badge/Kitty-000000?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJDNi40NzcgMiAyIDYuNDc3IDIgMTJzNC40NzcgMTAgMTAgMTAgMTAtNC40NzcgMTAtMTBTMTcuNTIzIDIgMTIgMnptMCAxOGMtNC40MTEgMC04LTMuNTg5LTgtOHMzLjU4OS04IDgtOCA4IDMuNTg5IDggOC0zLjU4OSA4LTggOHoiIGZpbGw9IiNmZmYiLz48L3N2Zz==&logoColor=white" alt="Kitty" />
  <img src="https://img.shields.io/badge/Zsh-F15A24?style=for-the-badge&logo=zsh&logoColor=white" alt="Zsh" />
  <img src="https://img.shields.io/badge/Starship-DD3B41?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJMMyA3djEwbDkgNSA5LTVIN0wxMiAyeiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==&logoColor=white" alt="Starship" />
</div>

> Si vas a pasar horas frente a una terminal, al menos que sea bonita

---

## 📖 Tabla de Contenidos

- [¿Qué es esto?](#-qué-es-esto)
- [Estructura del Repo](#-estructura-del-repo)
- [🚀 Kitty — La Terminal](#-kitty--la-terminal)
- [⚡ Neovim — El Editor](#-neovim--el-editor)
- [🐚 Zsh + Starship — El Shell](#-zsh--starship--el-shell)
- [📦 Git — El Control de Versiones](#-git--el-control-de-versiones)
- [🎨 Screenshots](#-screenshots)
- [🛠️ Mejoras Pendientes](#️-mejoras-pendientes)
- [📝 Licencia](#-licencia)

---

## 🤔 ¿Qué es esto?

Estos son mis **dotfiles** — la configuración que convierte una terminal genérica en _mi_ terminal. Si eres de los que copian configs de YouTube sin saber qué hacen, bienvenido. Si eres de los que leen todo antes de copiar, **doble bienvenido**.

> **Stack principal:** Neovim + Kitty + Zsh + Starship
> **Lenguajes:** Python, JavaScript/TypeScript, React, Lua
> **SO:** Fedora Linux (porque los rolling releases son para valientes)

---

## 📁 Estructura del Repo

```
dotfiles/
├── kitty/                  # Configuración de la terminal
│   ├── kitty.conf          # Configuración principal
│   └── tokyonight.conf     # Tema Tokyo Night
│
├── nvim/                   # Configuración de Neovim
│   ├── init.lua            # Punto de entrada
│   ├── lua/
│   │   ├── atajos.lua      # Keymaps personalizados
│   │   ├── opciones.lua    # Opciones del editor
│   │   ├── plugins.lua     # Carga de plugins (Lazy.nvim)
│   │   ├── lsp_config.lua  # Configuración de LSPs
│   │   ├── core/           # Configuraciones core
│   │   └── plugins/        # Configs individuales de plugins
│   ├── snippets/           # Snippets personalizados
│   │   ├── python.lua      # Snippets de Python
│   │   ├── javascript.lua  # Snippets de JS
│   │   ├── react.lua       # Snippets de React
│   │   └── html.lua        # Snippets de HTML
│   └── folding/            # Persistencia de folds
│
├── zsh/                    # Configuración del shell
│   ├── .zshrc              # Configuración de Zsh + Zinit
│   └── starship.toml       # Tema del prompt
│
├── .gitconfig              # Configuración de Git
├── .gitignore              # Archivos ignorados
└── AGENTS.md               # Instrucciones para la IA
```

---

## 🚀 Kitty — La Terminal

### ¿Por qué Kitty y no Alacritty/Warp/la-que-esté-de-moda?

Porque Kitty tiene:

- ✅ **GPU-accelerated** rendering
- ✅ **Splits nativos** (no necesitas tmux para dividir pantalla)
- ✅ **Protocolo de imágenes** (puedes ver imágenes en la terminal)
- ✅ **Tabs con powerline** (porque lo bonito importa)

### Configuración destacada

```conf
# Fuentes — JetBrains Mono Nerd Font (la mejor para devs)
font_family      family="JetBrainsMono Nerd Font"
font_size        12.0

# Layouts habilitados — splits y stack
enabled_layouts splits, stack

# Transparencia sutil (requiere compositor)
background_opacity 0.95

# Powerline tabs (porque somos fancy)
tab_bar_style powerline
tab_powerline_style slanted
```

### Atajos de Kitty

| Atajo             | Acción                 |
| ----------------- | ---------------------- |
| `Ctrl+Shift+H`    | Split horizontal       |
| `Ctrl+Shift+V`    | Split vertical         |
| `Ctrl+Shift+↑↓←→` | Navegar entre paneles  |
| `Ctrl+C`          | Copiar (o interrumpir) |
| `Ctrl+V`          | Pegar                  |

### Tema: Tokyo Night 🌙

El tema está en `kitty/tokyonight.conf` y es el mismo que uso en Neovim. **Consistencia visual es clave**.

```
background  #1a1b26
foreground  #c0caf5
cursor      #c0caf5
```

> 💡 **Tip:** Si quieres cambiar el tema, solo modifica el `include` en `kitty.conf`

---

## ⚡ Neovim — El Editor

### ¿Por qué Neovim y no VS Code?

Porque después de la curva de aprendizaje (que sí, es empinada), editas código a la velocidad del pensamiento. Y porque **no necesitas un navegador para editar texto**.

### Plugins Instalados

| Plugin                  | Propósito                                |
| ----------------------- | ---------------------------------------- |
| `lazy.nvim`             | Gestor de plugins (el mejor, sin debate) |
| `tokyonight.nvim`       | Tema visual                              |
| `alpha-nvim`            | Dashboard de inicio                      |
| `lualine.nvim`          | Barra de estado                          |
| `bufferline.nvim`       | Pestañas de buffers                      |
| `nvim-tree.lua`         | Explorador de archivos                   |
| `telescope.nvim`        | Buscador fuzzy (el corazón del workflow) |
| `nvim-lspconfig`        | Configuración de LSPs                    |
| `mason.nvim`            | Instalador de LSPs/formatters            |
| `nvim-cmp`              | Autocompletado                           |
| `LuaSnip`               | Snippets                                 |
| `nvim-treesitter`       | Resaltado de sintaxis avanzado           |
| `gitsigns.nvim`         | Indicadores de Git en el editor          |
| `conform.nvim`          | Formateo automático                      |
| `toggleterm.nvim`       | Terminal integrada                       |
| `comment.nvim`          | Comentar/descomentar código              |
| `nvim-autopairs`        | Autocierre de paréntesis/llaves          |
| `indent-blankline.nvim` | Guías de indentación                     |
| `emmet-vim`             | Emmet para HTML/CSS                      |
| `pi-agent.nvim`         | Integración con Pi Agent                 |

### Lenguajes Soportados (LSP)

```lua
ensure_installed = { "html", "cssls", "ts_ls", "pyright", "lua_ls" }
```

- **HTML/CSS** — Web basics
- **TypeScript/JavaScript** — Frontend y Node
- **Python** — Pyright como LSP
- **Lua** — Para configurar Neovim con Neovim 🤯

### Keymaps Esenciales

#### Navegación

| Atajo         | Acción                          |
| ------------- | ------------------------------- |
| `Espacio + f` | Buscar archivos (Telescope)     |
| `Espacio + g` | Buscar texto (Live Grep)        |
| `Espacio + e` | Toggle explorador (NvimTree)    |
| `Espacio + n` | Toggle explorador (alternativo) |
| `Ctrl+\`      | Toggle terminal                 |

#### Edición

| Atajo         | Acción                                            |
| ------------- | ------------------------------------------------- |
| `jk` / `kj`   | Salir del modo insertar (todas las combinaciones) |
| `Espacio + d` | Comentar/descomentar línea                        |
| `Tab`         | Siguiente sugerencia de autocompletado            |
| `Shift+Tab`   | Sugerencia anterior                               |

#### Buffers

| Atajo          | Acción           |
| -------------- | ---------------- |
| `Espacio + v`  | Buffer anterior  |
| `Espacio + b`  | Buffer siguiente |
| `Espacio + bd` | Cerrar buffer    |
| `Ctrl+1`       | Ir al buffer 1   |

#### Git (Gitsigns)

| Atajo          | Acción                      |
| -------------- | --------------------------- |
| `]h` / `[h`    | Siguiente/anterior hunk     |
| `Espacio + hs` | Stage hunk                  |
| `Espacio + hr` | Reset hunk                  |
| `Espacio + hp` | Preview hunk                |
| `Espacio + hb` | Blame línea                 |
| `Espacio + gg` | LazyGit (terminal flotante) |

### Snippets Personalizados

Tengo snippets para **Python**, **JavaScript**, **React** y **HTML**. Algunos ejemplos:

#### Python

```python
# def + Tab → Función
# defd + Tab → Función con docstring
# class + Tab → Clase con __init__
# try + Tab → Try/Except
# main + Tab → if __name__ == "__main__"
# prd + Tab → print(f"DEBUG variable: {variable}")
```

#### React

```jsx
// rfc + Tab → Componente funcional
// rfcts + Tab → Componente con TypeScript
// us + Tab → useState
// ue + Tab → useEffect
// hook + Tab → Custom hook
// jmap + Tab → JSX .map()
```

### Configuración de Folding

Neovim recuerda los folds entre sesiones gracias a:

```lua
vim.opt.viewdir = vim.fn.expand("~/.config/nvim/folding")

-- Auto-save folds al guardar
vim.api.nvim_create_autocmd("BufWrite", {
  pattern = "*",
  command = "mkview"
})

-- Auto-load folds al abrir
vim.api.nvim_create_autocmd("BufRead", {
  pattern = "*",
  command = "silent! loadview"
})
```

### Dashboard de Inicio

Al abrir Neovim, te recibe un ASCII art con opciones rápidas:

```
███╗   ██╗███████╗ ██████╗ ██╗   ██╗██╗███╗   ███╗
████╗  ██║██╔════╝██╔═══██╗██║   ██║██║████╗ ████║
██╔██╗ ██║█████╗  ██║   ██║██║   ██║██║██╔████╔██║
██║╚██╗██║██╔══╝  ██║   ██║╚██╗ ██╔╝██║██║╚██╔╝██║
██║ ╚████║███████╗╚██████╔╝ ╚████╔╝ ██║██║ ╚═╝ ██║
╚═╝  ╚═══╝╚══════╝ ╚═════╝   ╚═══╝  ╚═╝╚═╝     ╚═╝

          [ m b l a n c @nvim ]
```

---

## 🐚 Zsh + Starship — El Shell

### ¿Por qué Zsh + Starship?

- **Zsh** → Autocompletado superior, glob patterns, y plugins con Zinit
- **Starship** → Prompt minimalista, rápido, y con información contextual

### Zinit Plugins

```bash
# Plugins de Zinit (gestor de plugins para Zsh)
zinit light zdharma-continuum/zinit-annex-as-monitor
zinit light zdharma-continuum/zinit-annex-bin-gem-node
zinit light zdharma-continuum/zinit-annex-patch-dl
zinit light zdharma-continuum/zinit-annex-rust

# Zoxide (navegación inteligente de directorios)
zinit light ajeetdsouza/zoxide

# Starship (prompt)
zinit light starship/starship
```

### Herramientas en PATH

```bash
# npm global packages
export PATH=~/.npm-global/bin:$PATH

# Local binaries
export PATH="/home/mblanc/.local/bin:$PATH"

# Bun (runtime JS alternativo)
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
```

### Alias Importantes

```bash
alias idea='~/programas/idea-2026.1.4/idea-IU-261.26222.65/bin/idea.sh'
```

### Prompt de Starship

El prompt muestra:

```
@matias:~/proyecto  main ≡ +2⇡  python 3.11 node 20.12 ➜
```

- **Usuario y directorio** → Siempre visible (fondo azul Tokyo Night)
- **Rama de Git** → Con indicadores de status (fondo púrpura)
- **Versión de lenguaje** → Solo cuando estás en un proyecto de ese lenguaje
- **Duración del comando** → Si tarda más de 2 segundos
- **Hora** → A la derecha
- **Carácter de éxito/error** → Verde `➜` o rojo `✗`

#### Paleta de colores (Tokyo Night Storm)

| Elemento           | Color    | Hex       |
| ------------------ | -------- | --------- |
| Username/Directory | Azul     | `#7aa2f7` |
| Git branch         | Púrpura  | `#bb9af7` |
| Python             | Amarillo | `#e0af68` |
| Node.js            | Verde    | `#73daca` |
| Rust               | Rojo     | `#f7768e` |
| Go                 | Cyan     | `#7dcfff` |
| Success            | Verde    | `#73daca` |
| Error              | Rojo     | `#f7768e` |

---

## 📦 Git — El Control de Versiones

```ini
[user]
    name = Matias Blanc
    email = matias.f.blanc@gmail.com

[init]
    defaultBranch = main        # No más 'master'

[core]
    editor = nvim               # Neovim para commits

[color]
    ui = auto                   # Colores en terminal

[pull]
    rebase = false              # Merge por defecto al pull

[alias]
    st = status
    co = checkout
    pu = push
    cm = commit -m
    pl = pull
```

### Aliases de Git

| Alias              | Comando                   |
| ------------------ | ------------------------- |
| `git st`           | `git status`              |
| `git co`           | `git checkout`            |
| `git pu`           | `git push`                |
| `git cm "mensaje"` | `git commit -m "mensaje"` |
| `git pl`           | `git pull`                |

> ⚠️ Los aliases están definidos una sola vez en `[alias]`, sin secciones anidadas.

---

## 🎨 Screenshots

> _TODO: Agregar screenshots del setup en acción_

```bash
# Para tomar un screenshot de Kitty:
# Ctrl+Shift+P → save_png
```

---

## 🛠️ Mejoras Pendientes

Cosas que deberían mejorar pero "funciona así que no lo toco":

### Neovim

- [ ] Agregar `which-key.nvim` para visualizar keymaps
- [ ] Configurar `telescope-fzf-native` correctamente (ya está en deps pero no configurado)
- [ ] Agregar soporte para debugging (`nvim-dap`)
- [ ] Snippets para más lenguajes (Bash, SQL, Docker)
- [ ] Configurar `noice.nvim` para UI de comandos mejorada

### Kitty

- [ ] Agregar más temas alternativos
- [ ] Configurar `kitten ssh` para remotos
- [ ] Agregar custom kittens para workflows

### Zsh

- [ ] Agregar más plugins de Zinit (autosuggestions, syntax highlighting)
- [ ] Configurar `fzf` como integración con Zsh
- [ ] Agregar funciones personalizadas frecuentes

### General

- [ ] Script de instalación automática (`install.sh`)
- [ ] Stow para gestión de symlinks
- [ ] Documentar dependencias del sistema

---

## 📝 Instalación

### Prerrequisitos

```bash
# Fedora
sudo dnf install neovim kitty zsh starship git

# Instalar Nerd Font
mkdir -p ~/.local/share/fonts
cd ~/.local/share/fonts
curl -fLO https://github.com/ryanoasis/nerd-fonts/releases/latest/download/JetBrainsMono.tar.xz
tar xf JetBrainsMono.tar.xz
fc-cache -fv

# Cambiar shell por defecto
chsh -s $(which zsh)
```

### Clonar y Configurar

```bash
# Clonar dotfiles
git clone https://github.com/tu-usuario/dotfiles.git ~/dotfiles

# Crear symlinks (manual por ahora)
ln -sf ~/dotfiles/kitty ~/.config/kitty
ln -sf ~/dotfiles/nvim ~/.config/nvim
ln -sf ~/dotfiles/zsh/.zshrc ~/.zshrc
ln -sf ~/dotfiles/zsh/starship.toml ~/.config/starship.toml
ln -sf ~/dotfiles/.gitconfig ~/.gitconfig

# Instalar plugins de Neovim
nvim --headless "+Lazy! sync" +qa

# Reiniciar terminal
exec zsh
```

---

## 🤝 ¿Contribuir?

Si quieres mejorar algo:

1. Fork el repo
2. Crea una rama (`git checkout -b feature/mejora-genial`)
3. Commit (`git commit -m 'feat: agregar mejora genial'`)
4. Push (`git push origin feature/mejora-genial`)
5. Abre un Pull Request

---

## 📜 Licencia

MIT — Haz lo que quieras con esto. Si te funciona, genial. Si no, al menos aprendiste algo.

---

<div align="center">

**Hecho con ❤️ desde Chile.**
<br>
Por varias noches de "solo 5 minutos más configurando"
![Last Commit](https://img.shields.io/github/last-commit/matiasblanc/dotfiles?style=flat-square)

</div>
