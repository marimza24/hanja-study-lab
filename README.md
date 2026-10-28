# Hanja Study Lab — 한자 함께 공부하기

Laboratorio web colaborativo para estudiar Hanja en español. Primera etapa: 人 (인).

## Funciones

- Vocabulario y explicación del Hanja.
- Votación semanal compartida para elegir el próximo carácter.
- Reto de 10 preguntas con cronómetro, pausa, reanudación y puntuación.
- Clasificación pública compartida entre dispositivos: nombre, puntos, aciertos, tiempo y fecha.
- Sin registro, correo electrónico ni cuentas de usuario.
- Botón de exportación de resultados a TXT.
- Borrado de todos los datos de prueba mediante clave de administración, guardada como variable secreta en Netlify.

## Datos y privacidad

La votación y las partidas se guardan en Netlify Database (PostgreSQL). Los nombres son elegidos por los participantes y no se verifica su identidad. Se conserva el nombre elegido, los votos y los resultados del juego; no se solicita correo electrónico.

El botón **Borrar datos de prueba compartidos** elimina todos los votos y todas las partidas. La operación requiere la variable de entorno `HANJA_ADMIN_TOKEN` (scope Functions); nunca debe incluirse en el código del navegador ni en GitHub.

## Despliegue

- Sitio estático: `public/index.html`
- Función API: `netlify/functions/api.mjs`
- Migraciones: `netlify/database/migrations/`
- Netlify instala `@netlify/database` y aplica la migración al desplegar.

Repositorio: https://github.com/marimza24/hanja-study-lab
