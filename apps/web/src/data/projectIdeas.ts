// Ideas de proyectos que se proponen según los cursos que ya dominas.
// `requires` son ids de cursos (ver data/courses.ts). `combo` = mezcla 2+ stacks.
export type ProjectType = 'Desarrollo' | 'Web' | 'Móvil' | 'Videojuego' | 'API' | 'Otro';

export type ProjectIdea = {
  id: string;
  title: string;
  desc: string;
  type: ProjectType;
  difficulty: number; // 1-5
  requires: string[]; // ids de cursos necesarios
  combo?: boolean; // mezcla varios lenguajes/stacks
  vancouver?: boolean; // pieza fuerte de portafolio para reclutadores 🍁
  tasks: string[]; // primeras tareas sugeridas (sazón)
};

export const PROJECT_IDEAS: ProjectIdea[] = [
  // ── Un solo lenguaje / curso ──
  { id: 'py-gastos', title: 'CLI Gestor de Gastos', desc: 'Programa de consola para registrar ingresos y gastos y ver tu balance mensual.', type: 'Desarrollo', difficulty: 2, requires: ['python'],
    tasks: ['Definir el menú de opciones', 'Guardar movimientos en un archivo', 'Calcular balance y por categoría', 'Mostrar reporte mensual'] },
  { id: 'py-scraper', title: 'Web Scraper de Noticias', desc: 'Extrae titulares de una web y guárdalos en un CSV automáticamente.', type: 'Desarrollo', difficulty: 3, requires: ['python'],
    tasks: ['Elegir la web objetivo', 'Descargar el HTML con requests', 'Parsear con BeautifulSoup', 'Exportar a CSV', 'Programar ejecución diaria'] },
  { id: 'java-api-tareas', title: 'API REST de Tareas (Spring Boot)', desc: 'API con CRUD completo de tareas: el clásico que demuestra que sabes backend.', type: 'API', difficulty: 3, requires: ['java'], vancouver: true,
    tasks: ['Diseñar los endpoints', 'Crear el modelo Tarea', 'Implementar CRUD', 'Validar entradas', 'Documentar con Swagger'] },
  { id: 'js-snake', title: 'Juego Snake en el navegador', desc: 'La serpiente clásica con canvas: controles, colisiones y puntaje.', type: 'Videojuego', difficulty: 2, requires: ['javascript'],
    tasks: ['Dibujar el tablero con canvas', 'Mover la serpiente con teclado', 'Generar comida aleatoria', 'Detectar colisiones', 'Guardar el récord'] },
  { id: 'html-portfolio', title: 'Portafolio Personal', desc: 'Tu carta de presentación para reclutadores: quién eres, proyectos y contacto.', type: 'Web', difficulty: 1, requires: ['html', 'css'], vancouver: true,
    tasks: ['Definir secciones (sobre mí, proyectos, contacto)', 'Maquetar con HTML semántico', 'Estilizar con CSS', 'Hacerlo responsive', 'Desplegar en GitHub Pages'] },
  { id: 'sql-ecommerce', title: 'Base de datos de E-commerce', desc: 'Diseña el esquema (usuarios, productos, pedidos) y escribe consultas reales.', type: 'Desarrollo', difficulty: 2, requires: ['sql'],
    tasks: ['Diseñar las tablas y relaciones', 'Crear las tablas con claves foráneas', 'Insertar datos de ejemplo', 'Escribir consultas con JOIN', 'Reporte de ventas con GROUP BY'] },
  { id: 'go-shortener', title: 'Acortador de URLs en Go', desc: 'Servicio que recibe una URL larga y devuelve una corta. Rápido y conciso.', type: 'API', difficulty: 3, requires: ['go'], vancouver: true,
    tasks: ['Definir el endpoint /shorten', 'Generar código corto único', 'Guardar el mapeo', 'Redirigir al original', 'Manejar errores 404'] },
  { id: 'cpp-calc', title: 'Calculadora científica en C++', desc: 'Operaciones, memoria y manejo de errores en consola.', type: 'Desarrollo', difficulty: 2, requires: ['cpp'],
    tasks: ['Leer la operación del usuario', 'Implementar operaciones básicas', 'Añadir funciones (raíz, potencia)', 'Manejar división entre cero'] },

  // ── Combos (mezclan varios stacks) ──
  { id: 'web-clima', title: 'App del Clima con API', desc: 'Consume una API pública y muestra el clima de cualquier ciudad. Tu primer fetch real.', type: 'Web', difficulty: 2, requires: ['html', 'css', 'javascript'], combo: true, vancouver: true,
    tasks: ['Maquetar la interfaz', 'Conseguir una API key gratuita', 'Hacer fetch del clima', 'Mostrar los datos', 'Manejar ciudad no encontrada'] },
  { id: 'react-dashboard', title: 'Dashboard de Tareas (React)', desc: 'SPA con componentes, estado y filtros. El proyecto estrella de tu portafolio front.', type: 'Web', difficulty: 3, requires: ['react'], combo: true, vancouver: true,
    tasks: ['Crear componentes (Lista, Item, Form)', 'Manejar estado con useState', 'Filtrar por estado', 'Persistir en localStorage', 'Desplegar en Vercel'] },
  { id: 'dsa-visualizer', title: 'Visualizador de Algoritmos de Ordenamiento', desc: 'Anima bubble/quick sort paso a paso. Demuestra que entiendes los algoritmos.', type: 'Web', difficulty: 3, requires: ['dsa', 'javascript'], combo: true, vancouver: true,
    tasks: ['Generar un arreglo aleatorio', 'Dibujar barras', 'Animar bubble sort', 'Añadir quick sort', 'Control de velocidad'] },
  { id: 'fullstack-login', title: 'Full-Stack: Gestor con Login', desc: 'Front en React + TypeScript, datos en SQL y autenticación. El combo que abre puertas.', type: 'Web', difficulty: 4, requires: ['react', 'typescript', 'sql'], combo: true, vancouver: true,
    tasks: ['Diseñar el esquema de BD', 'Crear API con auth', 'Front con React + TS', 'Login con sesión/token', 'Proteger rutas privadas', 'Desplegar'] },
  { id: 'java-biblioteca', title: 'API de Biblioteca dockerizada', desc: 'API en Java + Postgres, todo corriendo en Docker con compose. Nivel profesional.', type: 'API', difficulty: 4, requires: ['java', 'sql', 'docker'], combo: true, vancouver: true,
    tasks: ['Modelar libros y préstamos', 'API CRUD con Spring', 'Conectar a Postgres', 'Escribir el Dockerfile', 'Levantar con docker-compose'] },
  { id: 'py-data', title: 'Dashboard de Datos (Python + SQL)', desc: 'Consulta una BD, procesa los datos y muéstralos en gráficas.', type: 'Desarrollo', difficulty: 3, requires: ['python', 'sql'], combo: true,
    tasks: ['Conectar Python a la BD', 'Consultar y agregar datos', 'Procesar con pandas', 'Graficar con matplotlib', 'Exportar el reporte'] },
  { id: 'aws-deploy', title: 'App desplegada en AWS', desc: 'Sube un front React+TS a S3 y un backend en Lambda. Despliegue real en la nube.', type: 'Web', difficulty: 4, requires: ['react', 'typescript', 'cloud'], combo: true, vancouver: true,
    tasks: ['Construir el front', 'Subir el build a S3', 'Crear función Lambda', 'Conectar front y API', 'Configurar permisos IAM'] },
  { id: 'go-micro', title: 'Microservicio con Docker', desc: 'Servicio en Go contenerizado, con healthcheck y buenas prácticas de red.', type: 'API', difficulty: 4, requires: ['go', 'docker', 'redes'], combo: true,
    tasks: ['Crear la API en Go', 'Añadir endpoint /health', 'Escribir el Dockerfile', 'Exponer el puerto correcto', 'Probar con docker run'] },
  { id: 'ciber-login', title: 'Login Seguro (hashing + validación)', desc: 'Implementa un registro/login aplicando todo lo del curso de ciberseguridad.', type: 'Web', difficulty: 3, requires: ['ciber', 'javascript'], combo: true, vancouver: true,
    tasks: ['Formulario de registro', 'Validar y sanear entradas', 'Hashear contraseña (bcrypt)', 'Prevenir inyección', 'Sesión segura'] },
  { id: 'devops-deploy', title: 'Script de despliegue CI/CD', desc: 'Automatiza build, test y deploy con bash + Git + Docker. Sabor DevOps.', type: 'Desarrollo', difficulty: 3, requires: ['linux', 'git', 'docker'], combo: true,
    tasks: ['Script bash de build', 'Correr los tests', 'Construir la imagen Docker', 'Push al registro', 'Automatizar con un git hook'] },
  { id: 'chat-realtime', title: 'Chat en tiempo real', desc: 'Mensajería instantánea con WebSockets aplicando ideas de diseño de sistemas.', type: 'Web', difficulty: 4, requires: ['javascript', 'sysdesign'], combo: true, vancouver: true,
    tasks: ['Servidor WebSocket', 'Conexión del cliente', 'Difundir mensajes', 'Lista de usuarios en línea', 'Manejar reconexión'] },
];
