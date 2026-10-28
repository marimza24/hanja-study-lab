# Hanja Study Lab — 한자 함께 공부하기

Laboratorio web estático para el estudio colaborativo de Hanja. La primera etapa se concentra únicamente en **人 (인)**; la biblioteca se ampliará a medida que avance el grupo.

## Funciones actuales

- Ficha principal de 人 y lectura en coreano y mandarín.
- Audio de pronunciación mediante Speech Synthesis del navegador para 人 y para cada palabra coreana.
- Las 19 palabras de la lista de trabajo: 인간, 개인, 외국인, 성인, 주인, 타인, 노인, 인구, 인물, 인형, 인생, 인류, 인재, 인력, 인원, 인사, 인격, 인권 e 인종.
- Votación semanal de ejemplo para proponer el siguiente Hanja.
- Reto cronometrado de 10 preguntas, con botones para comenzar, pausar, reanudar y terminar.
- Tabla local de resultados con nombre, puntaje, aciertos, tiempo y fecha; exportación a TXT.

## Límites que hay que conocer

- La votación y el marcador se guardan en `localStorage`. No se sincronizan entre distintos móviles o navegadores. Para compartir resultados y votos reales del grupo se necesita una base de datos o servicio backend.
- El audio usa las voces disponibles en el dispositivo/navegador; no son grabaciones profesionales y puede variar la calidad o disponibilidad.
- Las definiciones en español son glosas iniciales de estudio. Deben verificarse con diccionarios fiables y en contexto.
- Las ilustraciones previas creadas para las fichas aún deben incorporarse como archivos de imagen. Evitar enlazar imágenes privadas o dependientes de permisos de Canva sin exportarlas primero.
- No se extrae automáticamente contenido de Naver. Antes de integrar una fuente o API hay que verificar permisos, condiciones de uso y seguridad de claves.

## Desarrollo

El sitio está en `index.html`, sin proceso de compilación. Netlify puede publicar directamente la raíz del repositorio. Las nuevas versiones se despliegan cuando la integración con GitHub está conectada y el sitio recibe el commit.

Repositorio: https://github.com/marimza24/hanja-study-lab
