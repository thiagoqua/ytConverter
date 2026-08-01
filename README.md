<div align="center">

# 🎵 ytConverter

**Convertidor de YouTube a Audio MP3 y WAV**

Una aplicación web moderna, rápida y minimalista para extraer audio de videos de YouTube en alta calidad con un solo clic.

[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![FFmpeg](https://img.shields.io/badge/FFmpeg-007808?style=for-the-badge&logo=ffmpeg&logoColor=white)](https://ffmpeg.org/)

</div>

---

## ✨ Características Principales

* 🎶 **Formatos de Alta Calidad**: Descargas en **MP3** (con selección de calidad baja, media y alta) o **WAV** (audio sin pérdida).
* 🎨 **Diseño Cyber-Minimalista**: Interfaz responsiva con diseño glassmorphic, luces neón y animaciones fluidas.
* ⚡ **Procesamiento Eficiente**: Uso de archivos temporales optimizados con `yt-dlp` y `ffmpeg` para evitar descargas corruptas o de 0 bytes.
* 🛡️ **Prevención Anti-Bot & Datacenters**: Soporte integrado para prevención de bloqueos mediante cookies y proxies.
* 🔒 **Privacidad Garantizada**: Procesamiento directo sin almacenamiento permanente de datos ni historial de usuario.

---

## 🛠️ Tecnologías

### Frontend
- **Framework**: Angular 16+
- **Estilos**: CSS3 con Variables Nativas y Glassmorphism
- **Tipografías**: Outfit & Plus Jakarta Sans (Google Fonts)

### Backend
- **Runtime**: Node.js + TypeScript
- **Servidor HTTP**: Express.js
- **Motor de Conversión**: `yt-dlp` + `FFmpeg`

---

## 🚀 Ejecución en Local

### 1. Usando Docker Compose *(Recomendado)*

La forma más rápida de ejecutar la aplicación completa (Frontend + Backend) en un entorno listo con `ffmpeg` y `yt-dlp`:

```bash
# Clonar el repositorio
git clone https://github.com/thiagoqua/ytConverter.git
cd ytConverter

# Construir y levantar los contenedores
docker compose up --build
```

Una vez iniciado, accede a:
* **Frontend**: `http://localhost:4200`
* **Backend API**: `http://localhost:8080`

---

### 2. Ejecución Manual (Sin Docker)

#### Requisitos Previos:
1. Tener [Node.js](https://nodejs.org/) (v18+) instalado.
2. Tener **FFmpeg** instalado y accesible en el `PATH` del sistema.
3. Tener **`yt-dlp`** instalado en el sistema.

#### Paso A: Levantar el Backend
```bash
cd backend
npm install
npm run dev
```
*El backend se iniciará en `http://localhost:8080`.*

#### Paso B: Levantar el Frontend
```bash
cd frontend
npm install
ng serve
```
*El frontend estará disponible en `http://localhost:4200`.*

---

## ⚙️ Variables de Entorno (Backend)

El backend soporta las siguientes variables de entorno opcionales para despliegue y prevención de bloqueos:

| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `PORT` | Puerto donde escucha la aplicación Express | `8080` |
| `YT_COOKIES` | Contenido en texto de un archivo `cookies.txt` para autenticación en YouTube | `# Netscape HTTP Cookie File...` |
| `YT_COOKIES_PATH` | Ruta local absoluta hacia un archivo `cookies.txt` | `/app/cookies.txt` |
| `YT_PROXY` | Servidor proxy HTTP/SOCKS5 para enrutar las peticiones de `yt-dlp` | `http://127.0.0.1:8080` |

---

## 👤 Autor

Desarrollado con ❤️ por **Thiago Quaglia**

* 🌐 **Sitio Web**: [thiagoqua.ar](https://thiagoqua.ar)
* 🐙 **GitHub**: [@thiagoqua](https://github.com/thiagoqua)

---

## 📄 Licencia

Este proyecto está bajo la Licencia [ISC](LICENSE).