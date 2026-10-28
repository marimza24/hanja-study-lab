# Hanja Study Lab — 한자 함께 공부하기

Sitio estático en español para el aprendizaje colaborativo de Hanja. Está separado del portfolio y de Hanori y preparado para ampliarse con cada nuevo encuentro.

## Funciones actuales

- Biblioteca de varios Hanja con búsqueda por carácter, lectura, significado y palabras relacionadas.
- Fichas expandibles con notas de estudio y etiquetas.
- Tabla de vocabulario filtrable por palabra o por Hanja.
- Mini reto reutilizable: selecciona un carácter y practica con palabras relacionadas.
- Guía para encuentros colaborativos: observar, reunir vocabulario, crear ejemplos y compartir preguntas.
- Mesa de aportes local con opción de exportar las ideas como TXT.

## Estructura y límites actuales

- El contenido inicial está incluido en `index.html` como datos editables. Para agregar un carácter, añade su ficha en `hanjaData`; para añadir vocabulario, añade una entrada en `words`.
- Las definiciones en español son glosas iniciales para estudiar y deben verificarse en contexto.
- La mesa de aportes utiliza `localStorage`: los datos quedan en el navegador y no se comparten automáticamente con otras personas. La colaboración sincronizada requiere una base de datos y configuración adicional.
- No se extrae ni se copia automáticamente contenido de Naver. Para automatizar definiciones/traducciones, primero hay que seleccionar una API o fuente autorizada, comprobar sus licencias y proteger cualquier clave de acceso. No se deben incrustar claves secretas en el JavaScript público del sitio.

## Publicar en Netlify

1. Conecta este repositorio de GitHub a un sitio de Netlify.
2. No hace falta comando de build para esta versión estática.
3. El archivo `netlify.toml` configura `.` como directorio de publicación.
4. Publica la rama `main`. Los cambios futuros del repositorio podrán disparar nuevos despliegues si la integración continua está activada.

Repositorio: https://github.com/marimza24/hanja-study-lab
