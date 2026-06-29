// Sistema de Aprendizaje estructurado — todos los cursos comparten esta forma.
export type ExLevel = 'Básico' | 'Intermedio' | 'Avanzado' | 'Experto';

export type Exercise = {
  id: string;
  level: ExLevel;
  objective: string;
  hint?: string;
  solution: string;
};

export type Theory = {
  teoria: string;
  ejemplo?: string;
  buenas?: string[];
  errores?: string[];
};

export type CourseLevel = {
  id: string;
  title: string;
  subtopics: string[];
  theory: Theory;
  exercises: Exercise[];
  project?: { title: string; desc: string };
};

export type Course = {
  id: string;
  name: string;
  icon: string;
  color: string;
  tagline: string;
  levels: CourseLevel[];
  requires?: { courseId: string; label: string }[]; // prerrequisitos de curso
};

const EX_ORDER: ExLevel[] = ['Básico', 'Intermedio', 'Avanzado', 'Experto'];
export const exLevelColor: Record<ExLevel, string> = {
  Básico: '#22c55e', Intermedio: '#3b82f6', Avanzado: '#f59e0b', Experto: '#ef4444',
};
export const sortExercises = (ex: Exercise[]) => [...ex].sort((a, b) => EX_ORDER.indexOf(a.level) - EX_ORDER.indexOf(b.level));

// ════════════════════════ JAVA ════════════════════════
const JAVA: Course = {
  id: 'java', name: 'Java', icon: '☕', color: '#f59e0b', tagline: 'De cero a backend profesional (ruta Vancouver)',
  levels: [
    {
      id: 'java-1', title: 'Nivel 1 · Fundamentos',
      subtopics: ['¿Qué es Java?', 'Instalación (JDK)', 'Variables', 'Tipos de datos', 'Operadores', 'Entrada/salida'],
      theory: {
        teoria: 'Java es un lenguaje compilado, orientado a objetos y multiplataforma ("escribe una vez, ejecuta en cualquier lugar" gracias a la JVM). Un programa parte de un método main. Las variables guardan datos con un tipo: int (enteros), double (decimales), boolean (true/false), char y String (texto).',
        ejemplo: 'public class Main {\n  public static void main(String[] args) {\n    int edad = 25;\n    double altura = 1.78;\n    String nombre = "Cemal";\n    System.out.println(nombre + " tiene " + edad + " años");\n  }\n}',
        buenas: ['Nombra variables en camelCase y de forma descriptiva (edadUsuario, no x).', 'Usa final para valores que no cambian (constantes).'],
        errores: ['Olvidar el ; al final de cada sentencia.', 'Confundir = (asignación) con == (comparación).', 'No coincide el nombre de la clase pública con el del archivo .java.'],
      },
      exercises: [
        { id: 'java-1-b1', level: 'Básico', objective: 'Declara una variable nombre y otra edad, e imprime "Hola, soy <nombre> y tengo <edad> años".', hint: 'Usa System.out.println y concatena con +.', solution: 'String nombre = "Ana";\nint edad = 30;\nSystem.out.println("Hola, soy " + nombre + " y tengo " + edad + " años");' },
        { id: 'java-1-b2', level: 'Básico', objective: 'Calcula e imprime el área de un rectángulo de base 5 y altura 3.', hint: 'área = base * altura.', solution: 'int base = 5, altura = 3;\nSystem.out.println("Área: " + (base * altura));' },
        { id: 'java-1-i1', level: 'Intermedio', objective: 'Lee dos números del usuario y muestra su suma.', hint: 'Usa Scanner y nextInt().', solution: 'import java.util.Scanner;\nScanner sc = new Scanner(System.in);\nint a = sc.nextInt(), b = sc.nextInt();\nSystem.out.println("Suma: " + (a + b));' },
      ],
    },
    {
      id: 'java-2', title: 'Nivel 2 · Control de Flujo',
      subtopics: ['if / else', 'switch', 'operador ternario'],
      theory: {
        teoria: 'El control de flujo decide qué código se ejecuta. if/else evalúa condiciones booleanas; switch compara un valor contra varios casos; el operador ternario (cond ? a : b) es un if corto que devuelve un valor.',
        ejemplo: 'int nota = 85;\nif (nota >= 90) System.out.println("Excelente");\nelse if (nota >= 70) System.out.println("Aprobado");\nelse System.out.println("Reprobado");\n\nString estado = (nota >= 70) ? "pasa" : "no pasa";',
        buenas: ['Usa switch cuando comparas el mismo valor contra muchos casos.', 'Evita anidar demasiados if; extrae la lógica a métodos.'],
        errores: ['Olvidar break en cada case del switch (cae al siguiente).', 'Comparar Strings con == en vez de .equals().'],
      },
      exercises: [
        { id: 'java-2-b1', level: 'Básico', objective: 'Dado un número, imprime "par" o "impar".', hint: 'n % 2 == 0.', solution: 'int n = 7;\nSystem.out.println(n % 2 == 0 ? "par" : "impar");' },
        { id: 'java-2-i1', level: 'Intermedio', objective: 'Pide una nota (0-100) y muestra la letra: A(90+), B(80+), C(70+), F(<70).', hint: 'Usa if/else if encadenados.', solution: 'int nota = 84;\nif (nota >= 90) System.out.println("A");\nelse if (nota >= 80) System.out.println("B");\nelse if (nota >= 70) System.out.println("C");\nelse System.out.println("F");' },
        { id: 'java-2-a1', level: 'Avanzado', objective: 'Usa switch para mostrar el nombre del día (1=Lunes…7=Domingo).', hint: 'switch(dia){ case 1: … }', solution: 'int dia = 3;\nswitch (dia) {\n  case 1 -> System.out.println("Lunes");\n  case 3 -> System.out.println("Miércoles");\n  default -> System.out.println("Otro");\n}' },
      ],
    },
    {
      id: 'java-3', title: 'Nivel 3 · Ciclos',
      subtopics: ['for', 'while', 'do-while', 'for-each'],
      theory: {
        teoria: 'Los ciclos repiten código. for cuando sabes cuántas veces; while mientras una condición sea cierta; do-while ejecuta al menos una vez; for-each recorre colecciones/arreglos.',
        ejemplo: 'for (int i = 1; i <= 5; i++) System.out.println(i);\n\nint i = 0;\nwhile (i < 3) { System.out.println(i); i++; }',
        buenas: ['Elige el ciclo según el caso; for-each para recorrer sin índice.', 'Evita bucles infinitos: asegúrate de que la condición cambie.'],
        errores: ['Off-by-one: usar <= cuando debía ser <.', 'Modificar la variable del ciclo dentro del cuerpo sin querer.'],
      },
      exercises: [
        { id: 'java-3-b1', level: 'Básico', objective: 'Imprime los números del 1 al 10 con un for.', hint: 'for (int i=1; i<=10; i++).', solution: 'for (int i = 1; i <= 10; i++) System.out.println(i);' },
        { id: 'java-3-i1', level: 'Intermedio', objective: 'Calcula la suma de 1 a 100 con un while.', hint: 'Acumula en una variable total.', solution: 'int total = 0, i = 1;\nwhile (i <= 100) { total += i; i++; }\nSystem.out.println(total);' },
        { id: 'java-3-a1', level: 'Avanzado', objective: 'Imprime la tabla de multiplicar del 7 (acumulativo: usa variables, ciclo y condición).', hint: 'for de 1 a 10, imprime 7*i.', solution: 'int base = 7;\nfor (int i = 1; i <= 10; i++) {\n  System.out.println(base + " x " + i + " = " + (base * i));\n}' },
      ],
      project: { title: 'Proyecto Etapa 1 · Calculadora', desc: 'Crea una calculadora de consola: suma, resta, multiplicación y división con un menú (usa ciclos y condiciones).' },
    },
    {
      id: 'java-4', title: 'Nivel 4 · Arreglos y Colecciones',
      subtopics: ['arreglos', 'matrices', 'ArrayList', 'List', 'Set', 'Map'],
      theory: {
        teoria: 'Un arreglo guarda varios valores del mismo tipo con tamaño fijo (int[] a = new int[5]). Las colecciones son dinámicas: ArrayList (lista ordenada), Set (sin duplicados), Map (pares clave-valor).',
        ejemplo: 'int[] notas = {90, 85, 70};\nfor (int n : notas) System.out.println(n);\n\nimport java.util.*;\nList<String> nombres = new ArrayList<>();\nnombres.add("Ana");\nMap<String,Integer> edades = new HashMap<>();\nedades.put("Ana", 30);',
        buenas: ['Usa List en vez de arreglos cuando el tamaño cambia.', 'Programa contra la interfaz (List) no la implementación (ArrayList).'],
        errores: ['ArrayIndexOutOfBounds: acceder a un índice fuera del rango.', 'Olvidar importar java.util.*.'],
      },
      exercises: [
        { id: 'java-4-b1', level: 'Básico', objective: 'Crea un arreglo con 5 números y imprime su promedio.', hint: 'Suma con for-each y divide entre length.', solution: 'int[] n = {10, 20, 30, 40, 50};\nint suma = 0;\nfor (int x : n) suma += x;\nSystem.out.println("Promedio: " + (suma / n.length));' },
        { id: 'java-4-i1', level: 'Intermedio', objective: 'Usa un ArrayList<String>, agrega 3 nombres y muéstralos.', hint: 'add() y for-each.', solution: 'List<String> nombres = new ArrayList<>();\nnombres.add("Ana"); nombres.add("Luis"); nombres.add("Sara");\nfor (String s : nombres) System.out.println(s);' },
        { id: 'java-4-a1', level: 'Avanzado', objective: 'Cuenta cuántas veces aparece cada palabra de un texto usando un Map (acumulativo).', hint: 'getOrDefault(palabra, 0) + 1.', solution: 'String[] palabras = "a b a c b a".split(" ");\nMap<String,Integer> conteo = new HashMap<>();\nfor (String p : palabras) conteo.put(p, conteo.getOrDefault(p, 0) + 1);\nSystem.out.println(conteo);' },
      ],
      project: { title: 'Proyecto Etapa 2 · Agenda telefónica', desc: 'Agenda de consola: agregar, listar y buscar contactos usando ArrayList o Map.' },
    },
    {
      id: 'java-5', title: 'Nivel 5 · Métodos',
      subtopics: ['parámetros', 'retorno de valores', 'sobrecarga'],
      theory: {
        teoria: 'Un método agrupa código reutilizable. Recibe parámetros, puede devolver un valor (return) o no (void). La sobrecarga permite varios métodos con el mismo nombre pero distintos parámetros.',
        ejemplo: 'static int sumar(int a, int b) { return a + b; }\nstatic double sumar(double a, double b) { return a + b; } // sobrecarga\n\nSystem.out.println(sumar(2, 3));',
        buenas: ['Un método, una responsabilidad.', 'Nombra los métodos como verbos (calcularTotal, enviarCorreo).'],
        errores: ['No devolver valor en un método no-void.', 'Demasiados parámetros: agrupa en un objeto.'],
      },
      exercises: [
        { id: 'java-5-b1', level: 'Básico', objective: 'Crea un método esPar(int n) que devuelva boolean.', hint: 'return n % 2 == 0;', solution: 'static boolean esPar(int n) {\n  return n % 2 == 0;\n}' },
        { id: 'java-5-i1', level: 'Intermedio', objective: 'Método factorial(int n) recursivo.', hint: 'n <= 1 ? 1 : n * factorial(n-1).', solution: 'static long factorial(int n) {\n  return n <= 1 ? 1 : n * factorial(n - 1);\n}' },
        { id: 'java-5-a1', level: 'Avanzado', objective: 'Sobrecarga area() para círculo (radio) y rectángulo (base, altura).', hint: 'Dos métodos con el mismo nombre.', solution: 'static double area(double r) { return Math.PI * r * r; }\nstatic double area(double b, double h) { return b * h; }' },
      ],
    },
    {
      id: 'java-6', title: 'Nivel 6 · POO',
      subtopics: ['clases y objetos', 'encapsulamiento', 'herencia', 'polimorfismo', 'interfaces'],
      theory: {
        teoria: 'La Programación Orientada a Objetos modela el mundo con clases (plantillas) y objetos (instancias). Encapsulamiento: atributos privados con getters/setters. Herencia: una clase extiende otra. Polimorfismo: un mismo método se comporta distinto según el objeto. Interfaces: contratos que las clases implementan.',
        ejemplo: 'class Animal {\n  protected String nombre;\n  Animal(String n) { this.nombre = n; }\n  void hablar() { System.out.println("..."); }\n}\nclass Perro extends Animal {\n  Perro(String n) { super(n); }\n  void hablar() { System.out.println(nombre + ": Guau"); }\n}',
        buenas: ['Encapsula: atributos private + métodos públicos.', 'Prefiere composición sobre herencia cuando dudes.'],
        errores: ['Exponer atributos public rompiendo el encapsulamiento.', 'Herencia profunda e innecesaria.'],
      },
      exercises: [
        { id: 'java-6-b1', level: 'Básico', objective: 'Crea una clase Persona con nombre y edad, y un método saludar().', hint: 'Constructor + método.', solution: 'class Persona {\n  String nombre; int edad;\n  Persona(String n, int e) { nombre = n; edad = e; }\n  void saludar() { System.out.println("Hola, soy " + nombre); }\n}' },
        { id: 'java-6-i1', level: 'Intermedio', objective: 'Encapsula la clase Cuenta con saldo privado y métodos depositar/retirar.', hint: 'private double saldo;', solution: 'class Cuenta {\n  private double saldo = 0;\n  void depositar(double m) { saldo += m; }\n  boolean retirar(double m) { if (m <= saldo) { saldo -= m; return true; } return false; }\n  double getSaldo() { return saldo; }\n}' },
        { id: 'java-6-a1', level: 'Avanzado', objective: 'Crea una interface Figura con area() e impleméntala en Circulo y Cuadrado (polimorfismo).', hint: 'interface Figura { double area(); }', solution: 'interface Figura { double area(); }\nclass Circulo implements Figura {\n  double r; Circulo(double r){this.r=r;}\n  public double area() { return Math.PI * r * r; }\n}\nclass Cuadrado implements Figura {\n  double l; Cuadrado(double l){this.l=l;}\n  public double area() { return l * l; }\n}' },
      ],
      project: { title: 'Proyecto Etapa 3 · Sistema de inventario', desc: 'Modela Producto (clase), gestiona stock con List y aplica encapsulamiento. Menú para agregar/listar/actualizar.' },
    },
    {
      id: 'java-7', title: 'Nivel 7 · Estructuras de Datos',
      subtopics: ['pilas', 'colas', 'listas enlazadas', 'árboles', 'grafos'],
      theory: {
        teoria: 'Las estructuras de datos organizan información para usarla eficientemente. Pila (LIFO, último en entrar primero en salir), Cola (FIFO), Lista enlazada (nodos), Árbol (jerarquía), Grafo (nodos y conexiones).',
        ejemplo: 'import java.util.*;\nDeque<Integer> pila = new ArrayDeque<>();\npila.push(1); pila.push(2);\nSystem.out.println(pila.pop()); // 2\n\nQueue<Integer> cola = new LinkedList<>();\ncola.add(1); cola.add(2);\nSystem.out.println(cola.poll()); // 1',
        buenas: ['Elige la estructura según las operaciones más frecuentes.', 'Usa las de java.util antes de implementar las tuyas.'],
        errores: ['Confundir LIFO (pila) con FIFO (cola).', 'pop()/poll() en estructura vacía.'],
      },
      exercises: [
        { id: 'java-7-i1', level: 'Intermedio', objective: 'Usa una pila para invertir una cadena.', hint: 'push cada char, luego pop.', solution: 'String s = "Java";\nDeque<Character> pila = new ArrayDeque<>();\nfor (char c : s.toCharArray()) pila.push(c);\nStringBuilder sb = new StringBuilder();\nwhile (!pila.isEmpty()) sb.append(pila.pop());\nSystem.out.println(sb);' },
        { id: 'java-7-a1', level: 'Avanzado', objective: 'Verifica si los paréntesis de una expresión están balanceados (usa pila).', hint: 'push "(", pop al ver ")".', solution: 'boolean balanceado(String s) {\n  Deque<Character> p = new ArrayDeque<>();\n  for (char c : s.toCharArray()) {\n    if (c == \'(\') p.push(c);\n    else if (c == \')\') { if (p.isEmpty()) return false; p.pop(); }\n  }\n  return p.isEmpty();\n}' },
      ],
    },
    {
      id: 'java-8', title: 'Nivel 8 · Bases de Datos',
      subtopics: ['SQL', 'MySQL/PostgreSQL', 'relaciones', 'JDBC'],
      theory: {
        teoria: 'Las bases de datos relacionales guardan datos en tablas con filas y columnas. SQL es el lenguaje para consultarlas (SELECT, INSERT, UPDATE, DELETE). Las relaciones conectan tablas con claves (PK/FK). Java se conecta con JDBC.',
        ejemplo: 'SELECT u.nombre, o.total\nFROM ordenes o\nJOIN usuarios u ON u.id = o.usuario_id\nWHERE o.total > 100\nORDER BY o.total DESC;',
        buenas: ['Usa consultas parametrizadas (PreparedStatement) para evitar inyección SQL.', 'Indexa columnas usadas en WHERE/JOIN.'],
        errores: ['Concatenar valores del usuario en el SQL (inyección).', 'Olvidar cerrar conexiones (usa try-with-resources).'],
      },
      exercises: [
        { id: 'java-8-b1', level: 'Básico', objective: 'Escribe un SELECT que traiga nombre y email de la tabla usuarios mayores de 18.', hint: 'WHERE edad > 18.', solution: 'SELECT nombre, email FROM usuarios WHERE edad > 18;' },
        { id: 'java-8-i1', level: 'Intermedio', objective: 'Cuenta cuántos usuarios hay por ciudad.', hint: 'GROUP BY ciudad.', solution: 'SELECT ciudad, COUNT(*) AS total\nFROM usuarios\nGROUP BY ciudad;' },
      ],
      project: { title: 'Proyecto Etapa 4 · Sistema bancario', desc: 'Cuentas, clientes y transacciones persistidas en base de datos (SQL + JDBC). CRUD completo.' },
    },
    {
      id: 'java-9', title: 'Nivel 9 · Frameworks',
      subtopics: ['Spring Boot', 'JPA / Hibernate', 'inyección de dependencias'],
      theory: {
        teoria: 'Spring Boot acelera el desarrollo backend: configura por convención y levanta un servidor web con poco código. JPA/Hibernate mapean clases Java a tablas (ORM). La inyección de dependencias (@Autowired) desacopla los componentes.',
        ejemplo: '@RestController\npublic class HolaController {\n  @GetMapping("/hola")\n  public String hola() { return "Hola Vancouver"; }\n}',
        buenas: ['Separa capas: controller → service → repository.', 'Usa DTOs para no exponer entidades directamente.'],
        errores: ['Poner lógica de negocio en el controller.', 'Entidades JPA sin clave primaria (@Id).'],
      },
      exercises: [
        { id: 'java-9-i1', level: 'Intermedio', objective: 'Crea un endpoint GET /saludo que devuelva un texto en Spring Boot.', hint: '@RestController + @GetMapping.', solution: '@RestController\npublic class SaludoController {\n  @GetMapping("/saludo")\n  public String saludo() { return "¡Listo para Canadá!"; }\n}' },
        { id: 'java-9-a1', level: 'Avanzado', objective: 'Define una entidad JPA Usuario con id autogenerado y nombre.', hint: '@Entity, @Id, @GeneratedValue.', solution: '@Entity\npublic class Usuario {\n  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n  private Long id;\n  private String nombre;\n  // getters y setters\n}' },
      ],
      project: { title: 'Proyecto Etapa 6 · API REST profesional', desc: 'API REST con Spring Boot + JPA: CRUD de una entidad, capas service/repository y conexión a base de datos.' },
    },
    {
      id: 'java-10', title: 'Nivel 10 · Profesional',
      subtopics: ['Docker', 'APIs REST', 'microservicios', 'testing', 'arquitectura', 'Git/GitHub'],
      theory: {
        teoria: 'El nivel profesional integra: APIs REST bien diseñadas, Docker para empaquetar la app en contenedores, microservicios para escalar, testing (JUnit) para asegurar calidad, y buena arquitectura. Git/GitHub para versionar y mostrar tu portafolio (clave para reclutadores en Vancouver).',
        ejemplo: '# Dockerfile\nFROM eclipse-temurin:21-jre\nCOPY target/app.jar app.jar\nENTRYPOINT ["java", "-jar", "app.jar"]',
        buenas: ['Escribe tests para la lógica crítica.', 'Documenta tu API (OpenAPI/Swagger).', 'Sube tus proyectos a GitHub con un buen README.'],
        errores: ['Subir secretos/keys al repositorio.', 'No escribir tests "porque funciona".'],
      },
      exercises: [
        { id: 'java-10-a1', level: 'Avanzado', objective: 'Escribe un test JUnit que verifique que sumar(2,3) == 5.', hint: 'assertEquals(5, sumar(2,3)).', solution: '@Test\nvoid testSuma() {\n  assertEquals(5, Calc.sumar(2, 3));\n}' },
        { id: 'java-10-e1', level: 'Experto', objective: 'Escribe un Dockerfile que empaquete y ejecute un jar de Java 21.', hint: 'FROM eclipse-temurin, COPY, ENTRYPOINT.', solution: 'FROM eclipse-temurin:21-jre\nWORKDIR /app\nCOPY target/app.jar app.jar\nEXPOSE 8080\nENTRYPOINT ["java", "-jar", "app.jar"]' },
      ],
      project: { title: 'Proyecto Etapa 7 · Plataforma empresarial', desc: 'Aplicación full backend dockerizada con API REST, base de datos, tests y desplegable. Tu pieza estrella de portafolio para Vancouver.' },
    },
  ],
};

// ════════════════════════ REACT (requiere JavaScript) ════════════════════════
const REACT: Course = {
  id: 'react', name: 'React', icon: '⚛️', color: '#3b82f6', tagline: 'Frontend moderno para Full Stack',
  requires: [{ courseId: 'javascript', label: 'JavaScript (al menos 50%)' }],
  levels: [
    {
      id: 'react-1', title: 'Nivel 1 · Fundamentos',
      subtopics: ['componentes', 'JSX', 'props'],
      theory: {
        teoria: 'React construye interfaces con componentes: funciones que devuelven JSX (HTML dentro de JS). Las props pasan datos de un componente padre a un hijo (son de solo lectura).',
        ejemplo: 'function Saludo({ nombre }) {\n  return <h1>Hola, {nombre}</h1>;\n}\n\n// uso:\n<Saludo nombre="Cemal" />',
        buenas: ['Componentes pequeños, con una responsabilidad.', 'Nombra los componentes con Mayúscula inicial.'],
        errores: ['Olvidar la key al renderizar listas.', 'Mutar las props (son de solo lectura).'],
      },
      exercises: [
        { id: 'react-1-b1', level: 'Básico', objective: 'Componente que muestre "Hola <nombre>" recibiendo nombre por props.', solution: 'function Hola({ nombre }) {\n  return <p>Hola {nombre}</p>;\n}' },
        { id: 'react-1-i1', level: 'Intermedio', objective: 'Componente Tarjeta que reciba titulo y texto por props y los muestre.', solution: 'function Tarjeta({ titulo, texto }) {\n  return (\n    <div className="card">\n      <h3>{titulo}</h3>\n      <p>{texto}</p>\n    </div>\n  );\n}' },
      ],
    },
    {
      id: 'react-2', title: 'Nivel 2 · Estado y Eventos',
      subtopics: ['useState', 'onClick', 'eventos'],
      theory: {
        teoria: 'El estado (useState) guarda datos que cambian y hacen que la UI se vuelva a dibujar. const [valor, setValor] = useState(inicial). Los eventos (onClick) reaccionan a la interacción.',
        ejemplo: 'function Contador() {\n  const [n, setN] = useState(0);\n  return <button onClick={() => setN(n + 1)}>Clics: {n}</button>;\n}',
        buenas: ['Nunca mutes el estado; usa el setter.', 'Para estado que depende del anterior usa setN(prev => prev + 1).'],
        errores: ['Modificar la variable de estado directamente (n++).', 'Llamar al setter dentro del render sin condición (bucle infinito).'],
      },
      exercises: [
        { id: 'react-2-b1', level: 'Básico', objective: 'Botón contador que aumente en 1 al hacer clic.', solution: 'function Contador() {\n  const [n, setN] = useState(0);\n  return <button onClick={() => setN(n + 1)}>{n}</button>;\n}' },
        { id: 'react-2-i1', level: 'Intermedio', objective: 'Botón que alterne (toggle) un texto entre "ON" y "OFF".', hint: 'useState(false).', solution: 'function Toggle() {\n  const [on, setOn] = useState(false);\n  return <button onClick={() => setOn(!on)}>{on ? "ON" : "OFF"}</button>;\n}' },
      ],
    },
    {
      id: 'react-3', title: 'Nivel 3 · Listas y Condicionales',
      subtopics: ['map + key', 'renderizado condicional', '&&', 'ternario'],
      theory: {
        teoria: 'Para renderizar listas usa .map() devolviendo JSX con una key única. Renderizado condicional: {cond && <X/>} muestra X si cond es verdadero; {cond ? <A/> : <B/>} elige entre dos.',
        ejemplo: 'function Lista({ items }) {\n  return (\n    <ul>\n      {items.map((it) => <li key={it.id}>{it.nombre}</li>)}\n    </ul>\n  );\n}',
        buenas: ['La key debe ser estable y única (un id), no el índice si la lista cambia.', 'Extrae el item a su propio componente si crece.'],
        errores: ['Usar el índice del array como key en listas dinámicas.', 'Olvidar el return dentro del map.'],
      },
      exercises: [
        { id: 'react-3-b1', level: 'Básico', objective: 'Renderiza una lista de nombres (array de strings) en <li>.', solution: 'function Nombres({ lista }) {\n  return <ul>{lista.map((n, i) => <li key={i}>{n}</li>)}</ul>;\n}' },
        { id: 'react-3-i1', level: 'Intermedio', objective: 'Muestra "Cargando…" si loading es true, si no muestra el contenido.', solution: 'function Vista({ loading, datos }) {\n  return loading ? <p>Cargando…</p> : <p>{datos}</p>;\n}' },
      ],
    },
    {
      id: 'react-4', title: 'Nivel 4 · Efectos y Datos',
      subtopics: ['useEffect', 'fetch', 'ciclo de vida'],
      theory: {
        teoria: 'useEffect ejecuta código tras el render (efectos secundarios): pedir datos, suscripciones, timers. El array de dependencias controla cuándo corre: [] = solo al montar.',
        ejemplo: 'function Datos() {\n  const [data, setData] = useState(null);\n  useEffect(() => {\n    fetch("/api").then(r => r.json()).then(setData);\n  }, []);\n  return <pre>{JSON.stringify(data)}</pre>;\n}',
        buenas: ['Declara TODAS las dependencias que usa el efecto.', 'Limpia suscripciones/timers en el return del efecto.'],
        errores: ['Olvidar el array de dependencias (corre en cada render).', 'Hacer fetch sin manejar el estado de carga/error.'],
      },
      exercises: [
        { id: 'react-4-i1', level: 'Intermedio', objective: 'Al montar el componente, haz fetch a una API y guarda el resultado en estado.', solution: 'function App() {\n  const [data, setData] = useState(null);\n  useEffect(() => {\n    fetch("https://api.example.com").then(r => r.json()).then(setData);\n  }, []);\n  return <div>{data ? "Listo" : "Cargando…"}</div>;\n}' },
        { id: 'react-4-a1', level: 'Avanzado', objective: 'Crea un reloj que actualice la hora cada segundo (useEffect + setInterval + limpieza).', solution: 'function Reloj() {\n  const [hora, setHora] = useState(new Date());\n  useEffect(() => {\n    const id = setInterval(() => setHora(new Date()), 1000);\n    return () => clearInterval(id);\n  }, []);\n  return <p>{hora.toLocaleTimeString()}</p>;\n}' },
      ],
    },
    {
      id: 'react-5', title: 'Nivel 5 · Formularios',
      subtopics: ['inputs controlados', 'onChange', 'lifting state'],
      theory: {
        teoria: 'Un input controlado tiene su value atado al estado y se actualiza con onChange. "Lifting state up" = subir el estado al componente padre común cuando varios hijos lo comparten.',
        ejemplo: 'function Form() {\n  const [texto, setTexto] = useState("");\n  return (\n    <input value={texto} onChange={(e) => setTexto(e.target.value)} />\n  );\n}',
        buenas: ['Un input controlado por estado para tener una sola fuente de verdad.', 'Valida antes de enviar.'],
        errores: ['Input con value sin onChange (queda bloqueado).', 'Manejar el form sin preventDefault en el submit.'],
      },
      exercises: [
        { id: 'react-5-b1', level: 'Básico', objective: 'Input controlado que muestre debajo lo que escribes.', solution: 'function Echo() {\n  const [t, setT] = useState("");\n  return (\n    <div>\n      <input value={t} onChange={(e) => setT(e.target.value)} />\n      <p>{t}</p>\n    </div>\n  );\n}' },
        { id: 'react-5-a1', level: 'Avanzado', objective: 'Formulario que al enviar agregue el texto a una lista (sin recargar).', solution: 'function App() {\n  const [t, setT] = useState("");\n  const [items, setItems] = useState([]);\n  const enviar = (e) => { e.preventDefault(); setItems([...items, t]); setT(""); };\n  return (\n    <form onSubmit={enviar}>\n      <input value={t} onChange={(e) => setT(e.target.value)} />\n      <ul>{items.map((x, i) => <li key={i}>{x}</li>)}</ul>\n    </form>\n  );\n}' },
      ],
    },
    {
      id: 'react-6', title: 'Nivel 6 · Profesional',
      subtopics: ['custom hooks', 'Context', 'routing', 'estructura'],
      theory: {
        teoria: 'Custom hooks (useAlgo) extraen lógica reutilizable. Context comparte datos sin pasar props en cascada. React Router maneja la navegación. Una buena estructura (components/, pages/, hooks/, lib/) hace el proyecto mantenible y vendible.',
        ejemplo: 'function useContador(inicial = 0) {\n  const [n, setN] = useState(inicial);\n  return { n, mas: () => setN(n + 1) };\n}\n// uso: const { n, mas } = useContador();',
        buenas: ['Extrae lógica repetida a custom hooks.', 'Organiza por carpetas (components, pages, hooks, lib).', 'Sube el proyecto a GitHub con README (clave para Vancouver).'],
        errores: ['Prop drilling profundo en vez de Context.', 'Poner toda la app en un solo componente gigante.'],
      },
      exercises: [
        { id: 'react-6-a1', level: 'Avanzado', objective: 'Crea un custom hook useToggle() que devuelva [estado, alternar].', solution: 'function useToggle(inicial = false) {\n  const [on, setOn] = useState(inicial);\n  return [on, () => setOn((v) => !v)];\n}' },
        { id: 'react-6-e1', level: 'Experto', objective: 'Crea un Context de tema (claro/oscuro) con su provider y un hook para consumirlo.', solution: 'const TemaContext = createContext("claro");\nfunction TemaProvider({ children }) {\n  const [tema, setTema] = useState("claro");\n  return <TemaContext.Provider value={{ tema, setTema }}>{children}</TemaContext.Provider>;\n}\nconst useTema = () => useContext(TemaContext);' },
      ],
      project: { title: 'Proyecto · Dashboard / E-Commerce', desc: 'App React completa con varias páginas (routing), estado global (Context), consumo de API y diseño responsive. Tu pieza estrella de portafolio Full Stack.' },
    },
  ],
};

// ════════════════════════ PYTHON ════════════════════════
const PYTHON: Course = {
  id: 'python', name: 'Python', icon: '🐍', color: '#22c55e', tagline: 'Versátil: scripting, datos e IA',
  levels: [
    {
      id: 'py-1', title: 'Nivel 1 · Fundamentos',
      subtopics: ['¿Qué es Python?', 'variables', 'tipos', 'operadores', 'print/input'],
      theory: {
        teoria: 'Python es un lenguaje interpretado, legible y de tipado dinámico (no declaras el tipo). Los bloques se definen por indentación. print() imprime, input() lee del usuario (devuelve texto).',
        ejemplo: 'nombre = "Cemal"\nedad = 25\nprint(f"Hola, soy {nombre} y tengo {edad} años")\n\nn = int(input("Dame un número: "))\nprint(n * 2)',
        buenas: ['Nombres en snake_case (edad_usuario).', 'Usa f-strings para formatear texto.'],
        errores: ['Mezclar tabs y espacios en la indentación.', 'Olvidar convertir input() a int/float.'],
      },
      exercises: [
        { id: 'py-1-b1', level: 'Básico', objective: 'Imprime "Hola, Renacer".', solution: 'print("Hola, Renacer")' },
        { id: 'py-1-b2', level: 'Básico', objective: 'Pide un número y muestra su doble.', hint: 'int(input()).', solution: 'n = int(input())\nprint(n * 2)' },
        { id: 'py-1-i1', level: 'Intermedio', objective: 'Calcula el área de un círculo de radio 5.', hint: 'pi * r**2.', solution: 'import math\nr = 5\nprint(math.pi * r ** 2)' },
      ],
    },
    {
      id: 'py-2', title: 'Nivel 2 · Control de Flujo',
      subtopics: ['if', 'elif', 'else', 'operadores lógicos'],
      theory: {
        teoria: 'if/elif/else deciden el flujo según condiciones booleanas. Operadores: and, or, not. La indentación define qué pertenece a cada rama.',
        ejemplo: 'nota = 85\nif nota >= 90:\n    print("A")\nelif nota >= 70:\n    print("Aprobado")\nelse:\n    print("Reprobado")',
        buenas: ['Evita comparaciones redundantes (if x == True → if x).', 'Usa in para pertenencia (if c in "aeiou").'],
        errores: ['Olvidar los dos puntos (:).', 'Comparar con = en vez de ==.'],
      },
      exercises: [
        { id: 'py-2-b1', level: 'Básico', objective: 'Dado un número, imprime "par" o "impar".', hint: 'n % 2.', solution: 'n = 7\nprint("par" if n % 2 == 0 else "impar")' },
        { id: 'py-2-i1', level: 'Intermedio', objective: 'Clasifica una edad: niño(<13), adolescente(<18), adulto.', solution: 'edad = 20\nif edad < 13: print("niño")\nelif edad < 18: print("adolescente")\nelse: print("adulto")' },
      ],
    },
    {
      id: 'py-3', title: 'Nivel 3 · Ciclos',
      subtopics: ['for', 'while', 'range', 'break/continue'],
      theory: {
        teoria: 'for recorre secuencias (range, listas, texto); while repite mientras una condición sea cierta. range(a, b) genera números de a a b-1.',
        ejemplo: 'for i in range(1, 6):\n    print(i)\n\ntotal = 0\nwhile total < 10:\n    total += 2',
        buenas: ['for-in sobre la colección, no sobre índices innecesarios.', 'Usa enumerate() si necesitas índice y valor.'],
        errores: ['Bucle infinito por no actualizar la condición.', 'range(5) va de 0 a 4, no a 5.'],
      },
      exercises: [
        { id: 'py-3-b1', level: 'Básico', objective: 'Imprime del 1 al 10.', solution: 'for i in range(1, 11):\n    print(i)' },
        { id: 'py-3-i1', level: 'Intermedio', objective: 'Suma los números del 1 al 100.', hint: 'acumula en total.', solution: 'print(sum(range(1, 101)))' },
        { id: 'py-3-a1', level: 'Avanzado', objective: 'Cuenta las vocales de una palabra (usa ciclo y condición).', solution: 'p = "renacer"\nprint(sum(1 for c in p if c in "aeiou"))' },
      ],
    },
    {
      id: 'py-4', title: 'Nivel 4 · Estructuras de Datos',
      subtopics: ['listas', 'tuplas', 'sets', 'diccionarios'],
      theory: {
        teoria: 'list (ordenada, mutable), tuple (inmutable), set (sin duplicados), dict (clave-valor). Son la base para manejar datos.',
        ejemplo: 'nombres = ["Ana", "Luis"]\nnombres.append("Sara")\nedades = {"Ana": 30}\nedades["Luis"] = 25\nunicos = set([1, 1, 2, 3])',
        buenas: ['Comprensiones de listas: [x*2 for x in lista].', 'Usa dict.get(clave, defecto) para evitar errores.'],
        errores: ['IndexError por índice fuera de rango.', 'KeyError al acceder a una clave inexistente.'],
      },
      exercises: [
        { id: 'py-4-b1', level: 'Básico', objective: 'Crea una lista de 3 frutas e imprime la segunda.', solution: 'frutas = ["manzana", "pera", "uva"]\nprint(frutas[1])' },
        { id: 'py-4-i1', level: 'Intermedio', objective: 'Cuenta la frecuencia de palabras de un texto con un dict (acumulativo).', solution: 'texto = "a b a c b a"\nconteo = {}\nfor p in texto.split():\n    conteo[p] = conteo.get(p, 0) + 1\nprint(conteo)' },
      ],
    },
    {
      id: 'py-5', title: 'Nivel 5 · Funciones',
      subtopics: ['def', 'parámetros', 'return', 'lambda'],
      theory: {
        teoria: 'def define funciones reutilizables. Pueden tener parámetros con valores por defecto y devolver con return. lambda crea funciones anónimas cortas.',
        ejemplo: 'def saludar(nombre, signo="!"):\n    return f"Hola {nombre}{signo}"\n\ncuadrado = lambda x: x * x\nprint(saludar("Ana"), cuadrado(5))',
        buenas: ['Una función, una responsabilidad.', 'Documenta con docstrings.'],
        errores: ['Olvidar return (devuelve None).', 'Usar mutables como valor por defecto.'],
      },
      exercises: [
        { id: 'py-5-b1', level: 'Básico', objective: 'Función es_par(n) que devuelva True/False.', solution: 'def es_par(n):\n    return n % 2 == 0' },
        { id: 'py-5-i1', level: 'Intermedio', objective: 'Función factorial(n) recursiva.', solution: 'def factorial(n):\n    return 1 if n <= 1 else n * factorial(n - 1)' },
      ],
    },
    {
      id: 'py-6', title: 'Nivel 6 · Profesional',
      subtopics: ['POO', 'módulos', 'archivos', 'errores', 'librerías'],
      theory: {
        teoria: 'POO con class. Manejo de errores con try/except. Lectura/escritura de archivos con open(). Librerías externas con pip (requests, pandas). Aquí nacen proyectos como web scrapers y analizadores de datos.',
        ejemplo: 'class Cuenta:\n    def __init__(self):\n        self.saldo = 0\n    def depositar(self, m):\n        self.saldo += m\n\ntry:\n    n = int("abc")\nexcept ValueError:\n    print("No es número")',
        buenas: ['Captura excepciones específicas, no Exception genérica.', 'Cierra archivos con with open(...).'],
        errores: ['except: pass que oculta errores.', 'No manejar archivos inexistentes.'],
      },
      exercises: [
        { id: 'py-6-i1', level: 'Intermedio', objective: 'Crea una clase Persona con nombre y un método saludar().', solution: 'class Persona:\n    def __init__(self, nombre):\n        self.nombre = nombre\n    def saludar(self):\n        return f"Hola, soy {self.nombre}"' },
        { id: 'py-6-a1', level: 'Avanzado', objective: 'Lee un número con input y maneja el error si no es válido (try/except).', solution: 'try:\n    n = int(input("Número: "))\n    print(n * 2)\nexcept ValueError:\n    print("Eso no es un número")' },
      ],
      project: { title: 'Proyecto · Analizador de datos', desc: 'Lee un CSV con pandas, calcula estadísticas (media, máx, mín) y muestra un resumen.' },
    },
  ],
};

// ════════════════════════ EXÁMENES DE DESBLOQUEO ════════════════════════
export type ExamQ = { id: string; q: string; options: string[]; answer: number };
export type Exam = { pass: number; questions: ExamQ[] };

export const EXAMS: Record<string, Exam> = {
  'java-1': { pass: 70, questions: [
    { id: 'e-j1-1', q: '¿Qué tipo usarías para un número con decimales?', options: ['int', 'double', 'String', 'boolean'], answer: 1 },
    { id: 'e-j1-2', q: '¿Qué imprime System.out.println(2 + 3 + "!")?', options: ['23!', '5!', '"5"!', 'error'], answer: 1 },
    { id: 'e-j1-3', q: 'Para comparar dos textos en Java se usa…', options: ['==', '.equals()', '=', 'compare'], answer: 1 },
  ] },
  'java-2': { pass: 70, questions: [
    { id: 'e-j2-1', q: '¿Qué falta en cada case de un switch para no caer al siguiente?', options: ['return', 'break', 'continue', 'stop'], answer: 1 },
    { id: 'e-j2-2', q: 'cond ? a : b es…', options: ['un bucle', 'el operador ternario', 'un switch', 'una clase'], answer: 1 },
    { id: 'e-j2-3', q: '"if (x = 5)" en Java…', options: ['compara x con 5', 'da error (no es boolean)', 'asigna y compara', 'es válido'], answer: 1 },
  ] },
  'java-3': { pass: 70, questions: [
    { id: 'e-j3-1', q: '¿Qué ciclo se ejecuta al menos una vez?', options: ['for', 'while', 'do-while', 'for-each'], answer: 2 },
    { id: 'e-j3-2', q: 'for (int i=0; i<5; i++) imprime…', options: ['1 a 5', '0 a 4', '0 a 5', '1 a 4'], answer: 1 },
    { id: 'e-j3-3', q: 'for-each sirve para…', options: ['contar', 'recorrer una colección', 'romper un ciclo', 'declarar variables'], answer: 1 },
  ] },
  'java-4': { pass: 70, questions: [
    { id: 'e-j4-1', q: '¿Qué colección NO permite duplicados?', options: ['List', 'ArrayList', 'Set', 'Map'], answer: 2 },
    { id: 'e-j4-2', q: 'Un Map guarda…', options: ['solo valores', 'pares clave-valor', 'sin orden fijo de tipo', 'solo números'], answer: 1 },
    { id: 'e-j4-3', q: 'int[] a = new int[5]; el último índice válido es…', options: ['5', '4', '0', '6'], answer: 1 },
  ] },
  'java-5': { pass: 70, questions: [
    { id: 'e-j5-1', q: 'La sobrecarga permite…', options: ['heredar', 'varios métodos con igual nombre y distintos parámetros', 'crear clases', 'ciclos'], answer: 1 },
    { id: 'e-j5-2', q: 'Un método void…', options: ['siempre devuelve int', 'no devuelve valor', 'no recibe parámetros', 'es privado'], answer: 1 },
    { id: 'e-j5-3', q: 'Los métodos se nombran idealmente como…', options: ['sustantivos', 'verbos', 'adjetivos', 'números'], answer: 1 },
  ] },
  'java-6': { pass: 70, questions: [
    { id: 'e-j6-1', q: 'El encapsulamiento implica atributos…', options: ['public', 'private con getters/setters', 'static', 'final'], answer: 1 },
    { id: 'e-j6-2', q: 'Una interface define…', options: ['atributos', 'un contrato de métodos', 'objetos', 'bucles'], answer: 1 },
    { id: 'e-j6-3', q: 'extends sirve para…', options: ['implementar interfaces', 'heredar de una clase', 'crear objetos', 'encapsular'], answer: 1 },
  ] },
  'java-7': { pass: 70, questions: [
    { id: 'e-j7-1', q: 'Una pila es…', options: ['FIFO', 'LIFO', 'aleatoria', 'ordenada'], answer: 1 },
    { id: 'e-j7-2', q: 'Una cola es…', options: ['LIFO', 'FIFO', 'sin orden', 'un árbol'], answer: 1 },
    { id: 'e-j7-3', q: 'pop() en una pila vacía…', options: ['devuelve 0', 'lanza error', 'devuelve null siempre', 'no hace nada'], answer: 1 },
  ] },
  'java-8': { pass: 70, questions: [
    { id: 'e-j8-1', q: 'Para evitar inyección SQL usas…', options: ['concatenar strings', 'PreparedStatement', 'mayúsculas', 'comentarios'], answer: 1 },
    { id: 'e-j8-2', q: 'GROUP BY sirve para…', options: ['ordenar', 'agrupar y agregar', 'filtrar filas', 'unir tablas'], answer: 1 },
    { id: 'e-j8-3', q: 'Un JOIN…', options: ['borra datos', 'une tablas por una clave', 'crea índices', 'ordena'], answer: 1 },
  ] },
  'java-9': { pass: 70, questions: [
    { id: 'e-j9-1', q: '@RestController en Spring Boot…', options: ['crea una entidad', 'expone endpoints HTTP', 'conecta a la BD', 'corre tests'], answer: 1 },
    { id: 'e-j9-2', q: 'JPA/Hibernate son…', options: ['servidores web', 'ORM (mapean clases a tablas)', 'lenguajes', 'tests'], answer: 1 },
    { id: 'e-j9-3', q: 'La lógica de negocio debe ir en…', options: ['el controller', 'la capa service', 'la entidad', 'el main'], answer: 1 },
  ] },
  'java-10': { pass: 70, questions: [
    { id: 'e-j10-1', q: 'Docker sirve para…', options: ['escribir tests', 'empaquetar la app en contenedores', 'compilar Java', 'diseñar UI'], answer: 1 },
    { id: 'e-j10-2', q: 'JUnit se usa para…', options: ['desplegar', 'escribir pruebas', 'crear repos', 'estilos'], answer: 1 },
    { id: 'e-j10-3', q: 'Para tu portafolio (Vancouver) es clave…', options: ['no usar Git', 'subir proyectos a GitHub con buen README', 'ocultar el código', 'evitar tests'], answer: 1 },
  ] },
  // Python
  'py-1': { pass: 70, questions: [
    { id: 'e-p1-1', q: 'En Python, los bloques se definen por…', options: ['llaves {}', 'indentación', 'paréntesis', 'punto y coma'], answer: 1 },
    { id: 'e-p1-2', q: 'input() devuelve…', options: ['int', 'float', 'texto (str)', 'boolean'], answer: 2 },
    { id: 'e-p1-3', q: 'f"Hola {x}" es…', options: ['un comentario', 'un f-string', 'una función', 'un error'], answer: 1 },
  ] },
  'py-2': { pass: 70, questions: [
    { id: 'e-p2-1', q: '"si no, si" en Python es…', options: ['elseif', 'elif', 'else if', 'elsif'], answer: 1 },
    { id: 'e-p2-2', q: '¿Qué falta tras un if/else?', options: ['; ', ': (dos puntos)', '{ }', 'nada'], answer: 1 },
    { id: 'e-p2-3', q: '"c in \'aeiou\'" comprueba…', options: ['suma', 'pertenencia', 'igualdad de objetos', 'tipo'], answer: 1 },
  ] },
  'py-3': { pass: 70, questions: [
    { id: 'e-p3-1', q: 'range(5) genera…', options: ['1..5', '0..4', '0..5', '1..4'], answer: 1 },
    { id: 'e-p3-2', q: 'Para índice y valor a la vez se usa…', options: ['zip()', 'enumerate()', 'map()', 'range()'], answer: 1 },
    { id: 'e-p3-3', q: 'while se repite…', options: ['un número fijo', 'mientras la condición sea True', 'una sola vez', 'nunca'], answer: 1 },
  ] },
  'py-4': { pass: 70, questions: [
    { id: 'e-p4-1', q: '¿Cuál es inmutable?', options: ['list', 'tuple', 'set', 'dict'], answer: 1 },
    { id: 'e-p4-2', q: 'dict.get(k, 0) sirve para…', options: ['borrar', 'evitar KeyError con un valor por defecto', 'ordenar', 'sumar'], answer: 1 },
    { id: 'e-p4-3', q: '[x*2 for x in l] es…', options: ['un bucle while', 'una comprensión de lista', 'una función', 'un set'], answer: 1 },
  ] },
  'py-5': { pass: 70, questions: [
    { id: 'e-p5-1', q: 'Una función sin return devuelve…', options: ['0', 'None', 'error', '""'], answer: 1 },
    { id: 'e-p5-2', q: 'lambda x: x*x es…', options: ['una clase', 'una función anónima', 'un bucle', 'un dict'], answer: 1 },
    { id: 'e-p5-3', q: 'def saludar(n, s="!"): el "!" es…', options: ['obligatorio', 'valor por defecto', 'un error', 'global'], answer: 1 },
  ] },
  'py-6': { pass: 70, questions: [
    { id: 'e-p6-1', q: 'Para manejar errores se usa…', options: ['if/else', 'try/except', 'for', 'def'], answer: 1 },
    { id: 'e-p6-2', q: 'with open(...) sirve para…', options: ['crear clases', 'abrir y cerrar archivos seguro', 'un bucle', 'imprimir'], answer: 1 },
    { id: 'e-p6-3', q: 'pandas se usa para…', options: ['interfaces', 'análisis de datos', 'videojuegos', 'redes'], answer: 1 },
  ] },
  // JavaScript
  'js-1': { pass: 70, questions: [
    { id: 'e-js1-1', q: '¿Cuál NO reasigna su valor?', options: ['let', 'var', 'const', 'function'], answer: 2 },
    { id: 'e-js1-2', q: '`Hola ${x}` es…', options: ['un comentario', 'un template literal', 'un objeto', 'un error'], answer: 1 },
    { id: 'e-js1-3', q: 'typeof "5" devuelve…', options: ['number', 'string', 'boolean', 'object'], answer: 1 },
  ] },
  'js-2': { pass: 70, questions: [
    { id: 'e-js2-1', q: 'const f = (x) => x*2 es…', options: ['una clase', 'una función flecha', 'un bucle', 'un array'], answer: 1 },
    { id: 'e-js2-2', q: 'Las variables let tienen scope…', options: ['global siempre', 'de bloque', 'de función solo', 'ninguno'], answer: 1 },
    { id: 'e-js2-3', q: 'Una función sin return devuelve…', options: ['0', 'undefined', 'null', 'error'], answer: 1 },
  ] },
  'js-3': { pass: 70, questions: [
    { id: 'e-js3-1', q: '.map() sirve para…', options: ['filtrar', 'transformar cada elemento', 'sumar', 'ordenar'], answer: 1 },
    { id: 'e-js3-2', q: '.filter() devuelve…', options: ['un solo valor', 'los elementos que cumplen una condición', 'el primero', 'nada'], answer: 1 },
    { id: 'e-js3-3', q: 'const {a} = obj es…', options: ['un bucle', 'destructuring', 'una clase', 'un error'], answer: 1 },
  ] },
  'js-4': { pass: 70, questions: [
    { id: 'e-js4-1', q: 'document.querySelector sirve para…', options: ['crear servidores', 'seleccionar un elemento del DOM', 'hacer fetch', 'declarar variables'], answer: 1 },
    { id: 'e-js4-2', q: 'addEventListener("click", fn)…', options: ['borra el elemento', 'ejecuta fn al hacer clic', 'crea un bucle', 'imprime'], answer: 1 },
    { id: 'e-js4-3', q: 'Para cambiar el texto de un elemento usas…', options: ['.value', '.textContent', '.href', '.src'], answer: 1 },
  ] },
  'js-5': { pass: 70, questions: [
    { id: 'e-js5-1', q: 'await sirve para…', options: ['crear bucles', 'esperar una promesa', 'declarar variables', 'imprimir'], answer: 1 },
    { id: 'e-js5-2', q: 'fetch() devuelve…', options: ['un string', 'una promesa', 'un número', 'un array'], answer: 1 },
    { id: 'e-js5-3', q: 'Una función con await debe ser…', options: ['const', 'async', 'static', 'public'], answer: 1 },
  ] },
  // React
  'react-1': { pass: 70, questions: [
    { id: 'e-r1-1', q: 'Un componente de React es…', options: ['una clase CSS', 'una función que devuelve JSX', 'un archivo HTML', 'una variable'], answer: 1 },
    { id: 'e-r1-2', q: 'Las props son…', options: ['mutables', 'datos de solo lectura del padre', 'estado interno', 'estilos'], answer: 1 },
    { id: 'e-r1-3', q: 'Los componentes se nombran con…', options: ['minúscula', 'Mayúscula inicial', 'guiones', 'números'], answer: 1 },
  ] },
  'react-2': { pass: 70, questions: [
    { id: 'e-r2-1', q: 'useState devuelve…', options: ['un valor', '[valor, función para actualizarlo]', 'una promesa', 'JSX'], answer: 1 },
    { id: 'e-r2-2', q: 'Para cambiar el estado…', options: ['lo mutas directo', 'usas el setter', 'recargas la página', 'usas var'], answer: 1 },
    { id: 'e-r2-3', q: 'onClick recibe…', options: ['un string', 'una función', 'un número', 'un componente'], answer: 1 },
  ] },
  'react-3': { pass: 70, questions: [
    { id: 'e-r3-1', q: 'Para renderizar una lista usas…', options: ['for fuera del JSX', '.map() con key', 'while', '.push()'], answer: 1 },
    { id: 'e-r3-2', q: 'La key debe ser…', options: ['el índice siempre', 'única y estable (un id)', 'aleatoria', 'opcional'], answer: 1 },
    { id: 'e-r3-3', q: '{cond && <X/>} muestra X…', options: ['siempre', 'si cond es verdadero', 'nunca', 'si cond es falso'], answer: 1 },
  ] },
  'react-4': { pass: 70, questions: [
    { id: 'e-r4-1', q: 'useEffect(fn, []) corre…', options: ['en cada render', 'solo al montar', 'nunca', 'al hacer clic'], answer: 1 },
    { id: 'e-r4-2', q: 'Para limpiar un intervalo…', options: ['no se puede', 'return en el efecto con clearInterval', 'otro useState', 'recargar'], answer: 1 },
    { id: 'e-r4-3', q: 'fetch dentro de useEffect sirve para…', options: ['estilos', 'pedir datos al montar', 'crear rutas', 'eventos'], answer: 1 },
  ] },
  'react-5': { pass: 70, questions: [
    { id: 'e-r5-1', q: 'Un input controlado ata su value a…', options: ['una constante', 'el estado (useState)', 'el DOM directo', 'las props'], answer: 1 },
    { id: 'e-r5-2', q: 'onChange actualiza con…', options: ['e.target.value', 'e.value', 'this.value', 'value()'], answer: 0 },
    { id: 'e-r5-3', q: 'En el submit de un form se usa…', options: ['return false', 'e.preventDefault()', 'reload()', 'nada'], answer: 1 },
  ] },
  'react-6': { pass: 70, questions: [
    { id: 'e-r6-1', q: 'Un custom hook…', options: ['es un componente', 'extrae lógica reutilizable (useAlgo)', 'es CSS', 'es una clase'], answer: 1 },
    { id: 'e-r6-2', q: 'Context sirve para…', options: ['estilos', 'compartir datos sin pasar props en cascada', 'rutas', 'tests'], answer: 1 },
    { id: 'e-r6-3', q: 'Para el portafolio (Vancouver) conviene…', options: ['un solo componente gigante', 'estructura por carpetas + subir a GitHub', 'no usar Git', 'sin README'], answer: 1 },
  ] },
  // HTML
  'html-1': { pass: 70, questions: [
    { id: 'e-h1-1', q: '¿Qué etiqueta es el título principal?', options: ['<title>', '<h1>', '<head>', '<p>'], answer: 1 },
    { id: 'e-h1-2', q: 'Un enlace se hace con…', options: ['<link>', '<a href>', '<url>', '<href>'], answer: 1 },
    { id: 'e-h1-3', q: 'Una lista no ordenada es…', options: ['<ol>', '<ul>', '<li>', '<list>'], answer: 1 },
  ] },
  'html-2': { pass: 70, questions: [
    { id: 'e-h2-1', q: 'Un campo de texto se crea con…', options: ['<text>', '<input>', '<field>', '<box>'], answer: 1 },
    { id: 'e-h2-2', q: '¿Qué etiqueta semántica envuelve el menú de navegación?', options: ['<div>', '<nav>', '<menu>', '<header>'], answer: 1 },
    { id: 'e-h2-3', q: '<label> sirve para…', options: ['estilos', 'etiquetar un input (accesibilidad)', 'enlaces', 'tablas'], answer: 1 },
  ] },
  'html-3': { pass: 70, questions: [
    { id: 'e-h3-1', q: 'Una fila de tabla es…', options: ['<td>', '<tr>', '<table>', '<row>'], answer: 1 },
    { id: 'e-h3-2', q: 'Para incrustar un video usas…', options: ['<movie>', '<video>', '<media>', '<play>'], answer: 1 },
    { id: 'e-h3-3', q: 'El atributo alt en <img> sirve para…', options: ['tamaño', 'texto alternativo (accesibilidad/SEO)', 'borde', 'enlace'], answer: 1 },
  ] },
  // CSS
  'css-1': { pass: 70, questions: [
    { id: 'e-c1-1', q: 'Para seleccionar por clase usas…', options: ['#nombre', '.nombre', 'nombre', '*nombre'], answer: 1 },
    { id: 'e-c1-2', q: 'El box model incluye…', options: ['solo el contenido', 'content, padding, border, margin', 'solo color', 'solo fuentes'], answer: 1 },
    { id: 'e-c1-3', q: 'Para seleccionar por id usas…', options: ['.id', '#id', 'id', '@id'], answer: 1 },
  ] },
  'css-2': { pass: 70, questions: [
    { id: 'e-c2-1', q: 'Para centrar con flex…', options: ['text-align', 'justify-content + align-items', 'float', 'position'], answer: 1 },
    { id: 'e-c2-2', q: 'Grid se activa con…', options: ['display: grid', 'display: block', 'float: left', 'flex: 1'], answer: 0 },
    { id: 'e-c2-3', q: 'En flex, la dirección se controla con…', options: ['flex-direction', 'grid-template', 'align', 'order'], answer: 0 },
  ] },
  'css-3': { pass: 70, questions: [
    { id: 'e-c3-1', q: 'Para diseño responsive usas…', options: ['@media', '@import', '@keyframes', '@font'], answer: 0 },
    { id: 'e-c3-2', q: 'Las animaciones se definen con…', options: ['@media', '@keyframes', 'transition-only', 'animate()'], answer: 1 },
    { id: 'e-c3-3', q: 'Una unidad relativa al ancho de pantalla es…', options: ['px', 'vw', 'pt', 'cm'], answer: 1 },
  ] },
  // SQL
  'sql-1': { pass: 70, questions: [
    { id: 'e-s1-1', q: 'Para traer columnas usas…', options: ['GET', 'SELECT', 'FETCH', 'SHOW'], answer: 1 },
    { id: 'e-s1-2', q: 'Para filtrar filas…', options: ['ORDER BY', 'WHERE', 'GROUP BY', 'HAVING'], answer: 1 },
    { id: 'e-s1-3', q: 'Para ordenar resultados…', options: ['SORT', 'ORDER BY', 'WHERE', 'LIMIT'], answer: 1 },
  ] },
  'sql-2': { pass: 70, questions: [
    { id: 'e-s2-1', q: 'Para agrupar y agregar…', options: ['WHERE', 'GROUP BY', 'ORDER BY', 'JOIN'], answer: 1 },
    { id: 'e-s2-2', q: 'Para unir dos tablas…', options: ['MERGE', 'JOIN', 'UNION', 'LINK'], answer: 1 },
    { id: 'e-s2-3', q: 'COUNT(*) cuenta…', options: ['columnas', 'filas', 'tablas', 'bases'], answer: 1 },
  ] },
  'sql-3': { pass: 70, questions: [
    { id: 'e-s3-1', q: 'Una consulta dentro de otra es…', options: ['un JOIN', 'una subconsulta', 'un índice', 'una vista'], answer: 1 },
    { id: 'e-s3-2', q: 'Un índice sirve para…', options: ['borrar datos', 'acelerar búsquedas', 'ordenar siempre', 'unir tablas'], answer: 1 },
    { id: 'e-s3-3', q: 'Una transacción garantiza…', options: ['velocidad', 'atomicidad (todo o nada)', 'orden', 'índices'], answer: 1 },
  ] },
  // PHP
  'php-1': { pass: 70, questions: [
    { id: 'e-p1b-1', q: 'Las variables en PHP empiezan con…', options: ['#', '$', '@', '&'], answer: 1 },
    { id: 'e-p1b-2', q: 'Para imprimir usas…', options: ['print()/echo', 'console.log', 'System.out', 'cout'], answer: 0 },
    { id: 'e-p1b-3', q: 'PHP se ejecuta en…', options: ['el navegador', 'el servidor', 'la base de datos', 'el SO'], answer: 1 },
  ] },
  'php-2': { pass: 70, questions: [
    { id: 'e-p2b-1', q: 'Los datos de un formulario (POST) llegan en…', options: ['$_GET', '$_POST', '$_FORM', '$_DATA'], answer: 1 },
    { id: 'e-p2b-2', q: 'Antes de usar datos del usuario debes…', options: ['confiar', 'validar/sanear', 'ignorar', 'imprimir'], answer: 1 },
    { id: 'e-p2b-3', q: 'htmlspecialchars() ayuda contra…', options: ['SQL injection', 'XSS', 'CSRF', 'DDoS'], answer: 1 },
  ] },
  'php-3': { pass: 70, questions: [
    { id: 'e-p3b-1', q: 'Para conectar a la BD en PHP moderno usas…', options: ['mysql_connect', 'PDO', 'fetch', 'ajax'], answer: 1 },
    { id: 'e-p3b-2', q: 'Para evitar inyección SQL…', options: ['concatenar', 'consultas preparadas', 'mayúsculas', 'comentarios'], answer: 1 },
    { id: 'e-p3b-3', q: 'PDO significa…', options: ['PHP Data Objects', 'Public Data Output', 'Page Document Object', 'Private DB Op'], answer: 0 },
  ] },
  // C++
  'cpp-1': { pass: 70, questions: [
    { id: 'e-cpp1-1', q: 'Para imprimir en C++ usas…', options: ['print', 'std::cout', 'echo', 'System.out'], answer: 1 },
    { id: 'e-cpp1-2', q: 'Para leer entrada…', options: ['std::cin', 'input()', 'scanf only', 'read'], answer: 0 },
    { id: 'e-cpp1-3', q: 'El punto de entrada es…', options: ['start()', 'int main()', 'run()', 'begin()'], answer: 1 },
  ] },
  'cpp-2': { pass: 70, questions: [
    { id: 'e-cpp2-1', q: 'Un puntero guarda…', options: ['un valor', 'una dirección de memoria', 'un texto', 'una clase'], answer: 1 },
    { id: 'e-cpp2-2', q: 'Para reservar memoria dinámica…', options: ['malloc only', 'new', 'alloc', 'create'], answer: 1 },
    { id: 'e-cpp2-3', q: 'Cada new debe tener su…', options: ['free', 'delete', 'remove', 'clear'], answer: 1 },
  ] },
  'cpp-3': { pass: 70, questions: [
    { id: 'e-cpp3-1', q: 'Un contenedor dinámico de la STL es…', options: ['array', 'std::vector', 'list[]', 'tuple'], answer: 1 },
    { id: 'e-cpp3-2', q: 'std::map guarda…', options: ['solo valores', 'pares clave-valor', 'solo claves', 'índices'], answer: 1 },
    { id: 'e-cpp3-3', q: 'La encapsulación usa…', options: ['public todo', 'private + métodos', 'global', 'friend siempre'], answer: 1 },
  ] },
  // Assembly
  'asm-1': { pass: 70, questions: [
    { id: 'e-a1-1', q: 'Para mover un valor a un registro…', options: ['add', 'mov', 'jmp', 'push'], answer: 1 },
    { id: 'e-a1-2', q: 'Un registro de propósito general x86 es…', options: ['EAX', 'main', 'var', 'reg1'], answer: 0 },
    { id: 'e-a1-3', q: 'add eax, 5 hace…', options: ['mueve 5', 'suma 5 a eax', 'compara', 'salta'], answer: 1 },
  ] },
  'asm-2': { pass: 70, questions: [
    { id: 'e-a2-1', q: 'Para apilar un valor…', options: ['pop', 'push', 'mov', 'ret'], answer: 1 },
    { id: 'e-a2-2', q: 'cmp + je sirve para…', options: ['sumar', 'comparar y saltar si igual', 'multiplicar', 'imprimir'], answer: 1 },
    { id: 'e-a2-3', q: 'Para regresar de una función…', options: ['back', 'ret', 'exit', 'jmp main'], answer: 1 },
  ] },
  // Angular
  'angular-1': { pass: 70, questions: [
    { id: 'e-ng1-1', q: 'Angular usa principalmente…', options: ['JavaScript puro', 'TypeScript', 'PHP', 'Java'], answer: 1 },
    { id: 'e-ng1-2', q: 'Interpolación de datos en la plantilla…', options: ['${x}', '{{ x }}', '<x>', '[x]'], answer: 1 },
    { id: 'e-ng1-3', q: 'Para repetir elementos…', options: ['*ngFor', 'v-for', 'map', 'foreach'], answer: 0 },
  ] },
  'angular-2': { pass: 70, questions: [
    { id: 'e-ng2-1', q: 'La lógica compartida va en un…', options: ['component', 'service', 'module solo', 'pipe'], answer: 1 },
    { id: 'e-ng2-2', q: 'Angular inyecta dependencias por…', options: ['herencia', 'el constructor (DI)', 'globales', 'props'], answer: 1 },
    { id: 'e-ng2-3', q: 'Para peticiones HTTP usas…', options: ['fetch only', 'HttpClient', 'axios solo', 'ajax()'], answer: 1 },
  ] },
  'angular-3': { pass: 70, questions: [
    { id: 'e-ng3-1', q: 'Las rutas se definen en…', options: ['un array de routes', 'el HTML', 'CSS', 'el service'], answer: 0 },
    { id: 'e-ng3-2', q: 'Dónde se renderiza la ruta activa…', options: ['<router-outlet>', '<route>', '<view>', '<page>'], answer: 0 },
    { id: 'e-ng3-3', q: 'Para navegar en plantilla…', options: ['href', 'routerLink', 'onclick', 'goto'], answer: 1 },
  ] },
  // Go
  'go-1': { pass: 70, questions: [
    { id: 'e-go1-1', q: 'Para imprimir en Go usas…', options: ['print()', 'fmt.Println', 'echo', 'cout'], answer: 1 },
    { id: 'e-go1-2', q: 'Una variable se declara corto con…', options: [':=', '=', 'let', 'var x ='], answer: 0 },
    { id: 'e-go1-3', q: 'El punto de entrada es…', options: ['start()', 'func main()', 'int main', 'run'], answer: 1 },
  ] },
  'go-2': { pass: 70, questions: [
    { id: 'e-go2-1', q: 'Una función se define con…', options: ['def', 'func', 'function', 'fn'], answer: 1 },
    { id: 'e-go2-2', q: 'Una estructura de datos propia es un…', options: ['class', 'struct', 'object', 'record'], answer: 1 },
    { id: 'e-go2-3', q: 'Go maneja errores devolviendo…', options: ['excepciones', 'un valor error', 'null', 'panic siempre'], answer: 1 },
  ] },
  'go-3': { pass: 70, questions: [
    { id: 'e-go3-1', q: 'Una goroutine se lanza con…', options: ['async', 'go', 'thread', 'spawn'], answer: 1 },
    { id: 'e-go3-2', q: 'Para comunicar goroutines usas…', options: ['variables globales', 'channels', 'archivos', 'sockets'], answer: 1 },
    { id: 'e-go3-3', q: 'Go es famoso por su…', options: ['lentitud', 'concurrencia simple', 'tipado dinámico', 'herencia'], answer: 1 },
  ] },
  // Rust
  'rust-1': { pass: 70, questions: [
    { id: 'e-rs1-1', q: 'Para imprimir en Rust…', options: ['print', 'println!', 'echo', 'fmt'], answer: 1 },
    { id: 'e-rs1-2', q: 'Las variables son por defecto…', options: ['mutables', 'inmutables', 'globales', 'nulas'], answer: 1 },
    { id: 'e-rs1-3', q: 'El "ownership" de Rust evita…', options: ['bucles', 'errores de memoria', 'tipos', 'funciones'], answer: 1 },
  ] },
  'rust-2': { pass: 70, questions: [
    { id: 'e-rs2-1', q: 'Rust maneja "no valor" con…', options: ['null', 'Option<T>', 'undefined', 'void'], answer: 1 },
    { id: 'e-rs2-2', q: 'Para tipos con variantes usas…', options: ['struct', 'enum', 'class', 'interface'], answer: 1 },
    { id: 'e-rs2-3', q: 'El "borrow checker" comprueba…', options: ['sintaxis', 'préstamos/referencias seguras', 'estilos', 'tests'], answer: 1 },
  ] },
  // Kotlin
  'kotlin-1': { pass: 70, questions: [
    { id: 'e-kt1-1', q: 'Variable inmutable en Kotlin…', options: ['var', 'val', 'const solo', 'let'], answer: 1 },
    { id: 'e-kt1-2', q: 'Para imprimir…', options: ['print/println', 'echo', 'cout', 'System.out solo'], answer: 0 },
    { id: 'e-kt1-3', q: 'Kotlin corre sobre…', options: ['el navegador', 'la JVM', 'Python', 'PHP'], answer: 1 },
  ] },
  'kotlin-2': { pass: 70, questions: [
    { id: 'e-kt2-1', q: 'Una función se define con…', options: ['def', 'fun', 'func', 'function'], answer: 1 },
    { id: 'e-kt2-2', q: 'El "?" en String? indica…', options: ['error', 'puede ser null (null safety)', 'opcional de tipo', 'genérico'], answer: 1 },
    { id: 'e-kt2-3', q: 'El operador ?. sirve para…', options: ['sumar', 'llamada segura si no es null', 'comparar', 'castear'], answer: 1 },
  ] },
  'kotlin-3': { pass: 70, questions: [
    { id: 'e-kt3-1', q: 'Una clase solo para datos…', options: ['class', 'data class', 'object', 'enum'], answer: 1 },
    { id: 'e-kt3-2', q: 'data class genera automáticamente…', options: ['nada', 'equals/hashCode/toString', 'tests', 'UI'], answer: 1 },
    { id: 'e-kt3-3', q: 'Kotlin es oficial para desarrollo…', options: ['iOS', 'Android', 'web only', 'embebido'], answer: 1 },
  ] },
  // TypeScript
  'ts-1': { pass: 70, questions: [
    { id: 'e-ts1-1', q: 'TypeScript es…', options: ['un lenguaje nuevo sin relación', 'JavaScript + tipos estáticos', 'solo backend', 'Python'], answer: 1 },
    { id: 'e-ts1-2', q: 'let edad: number = 5 declara…', options: ['un string', 'edad tipada como number', 'una función', 'una clase'], answer: 1 },
    { id: 'e-ts1-3', q: 'TypeScript se…', options: ['interpreta directo', 'compila a JavaScript', 'ejecuta en la JVM', 'no se ejecuta'], answer: 1 },
  ] },
  'ts-2': { pass: 70, questions: [
    { id: 'e-ts2-1', q: 'Para describir la forma de un objeto usas…', options: ['class', 'interface/type', 'enum solo', 'var'], answer: 1 },
    { id: 'e-ts2-2', q: 'function id<T>(x: T): T usa…', options: ['un genérico', 'un any', 'una clase', 'un enum'], answer: 0 },
    { id: 'e-ts2-3', q: 'El tipo que evita es…', options: ['number', 'any (pierde seguridad)', 'string', 'boolean'], answer: 1 },
  ] },
  'ts-3': { pass: 70, questions: [
    { id: 'e-ts3-1', q: 'Partial<T> hace que las props sean…', options: ['obligatorias', 'opcionales', 'readonly', 'nulas'], answer: 1 },
    { id: 'e-ts3-2', q: 'Para una unión de tipos usas…', options: ['&', '|', '+', ','], answer: 1 },
    { id: 'e-ts3-3', q: 'TypeScript ayuda sobre todo a…', options: ['estilos', 'detectar errores antes de ejecutar', 'animaciones', 'redes'], answer: 1 },
  ] },
  // Docker
  'docker-1': { pass: 70, questions: [
    { id: 'e-dk1-1', q: 'Un contenedor es…', options: ['una VM completa', 'un entorno aislado y ligero para una app', 'un servidor físico', 'un lenguaje'], answer: 1 },
    { id: 'e-dk1-2', q: 'Una imagen es…', options: ['una foto', 'la plantilla de la que nacen los contenedores', 'un log', 'un puerto'], answer: 1 },
    { id: 'e-dk1-3', q: 'Para correr un contenedor…', options: ['docker build', 'docker run', 'docker make', 'docker start-app'], answer: 1 },
  ] },
  'docker-2': { pass: 70, questions: [
    { id: 'e-dk2-1', q: 'El archivo que define una imagen es…', options: ['docker.json', 'Dockerfile', 'image.yml', 'container.txt'], answer: 1 },
    { id: 'e-dk2-2', q: 'FROM en un Dockerfile indica…', options: ['el autor', 'la imagen base', 'el puerto', 'el comando'], answer: 1 },
    { id: 'e-dk2-3', q: 'docker-compose sirve para…', options: ['un solo contenedor', 'orquestar varios servicios', 'compilar Java', 'editar código'], answer: 1 },
  ] },
  // Git
  'git-1': { pass: 70, questions: [
    { id: 'e-gt1-1', q: 'Git es un sistema de…', options: ['bases de datos', 'control de versiones', 'diseño', 'pruebas'], answer: 1 },
    { id: 'e-gt1-2', q: 'Para guardar cambios haces…', options: ['git save', 'git add + git commit', 'git push solo', 'git store'], answer: 1 },
    { id: 'e-gt1-3', q: 'git status muestra…', options: ['el historial', 'el estado de los archivos', 'las ramas remotas', 'la config'], answer: 1 },
  ] },
  'git-2': { pass: 70, questions: [
    { id: 'e-gt2-1', q: 'Para crear una rama…', options: ['git new', 'git branch / git checkout -b', 'git fork', 'git copy'], answer: 1 },
    { id: 'e-gt2-2', q: 'Para unir ramas…', options: ['git join', 'git merge', 'git link', 'git mix'], answer: 1 },
    { id: 'e-gt2-3', q: 'Las ramas sirven para…', options: ['borrar código', 'trabajar en features sin romper main', 'subir fotos', 'compilar'], answer: 1 },
  ] },
  'git-3': { pass: 70, questions: [
    { id: 'e-gt3-1', q: 'Para subir a GitHub…', options: ['git upload', 'git push', 'git send', 'git deploy'], answer: 1 },
    { id: 'e-gt3-2', q: 'Para traer cambios del remoto…', options: ['git get', 'git pull', 'git fetch-all', 'git down'], answer: 1 },
    { id: 'e-gt3-3', q: 'Un buen README en tu repo es clave para…', options: ['nada', 'mostrar tu proyecto a reclutadores', 'compilar', 'tests'], answer: 1 },
  ] },
  // Ciberseguridad
  'ciber-1': { pass: 70, questions: [
    { id: 'e-cs1-1', q: 'La triada de la seguridad (CIA) es…', options: ['Código, IA, App', 'Confidencialidad, Integridad, Disponibilidad', 'Control, IP, Acceso', 'Cifrado, Internet, Antivirus'], answer: 1 },
    { id: 'e-cs1-2', q: 'Un software malicioso (virus, troyano) es un…', options: ['firewall', 'malware', 'parche', 'protocolo'], answer: 1 },
    { id: 'e-cs1-3', q: 'Engañar por correo para robar credenciales es…', options: ['spam', 'phishing', 'backup', 'cookie'], answer: 1 },
  ] },
  'ciber-2': { pass: 70, questions: [
    { id: 'e-cs2-1', q: 'Inyectar SQL malicioso por un input es…', options: ['XSS', 'SQL injection', 'CSRF', 'phishing'], answer: 1 },
    { id: 'e-cs2-2', q: 'Inyectar scripts en una web (robar sesión) es…', options: ['XSS', 'SQLi', 'DDoS', 'MITM'], answer: 0 },
    { id: 'e-cs2-3', q: 'Para prevenir inyección SQL usas…', options: ['concatenar strings', 'consultas preparadas + validación', 'mayúsculas', 'comentarios'], answer: 1 },
  ] },
  'ciber-3': { pass: 70, questions: [
    { id: 'e-cs3-1', q: 'Las contraseñas deben guardarse…', options: ['en texto plano', 'hasheadas con bcrypt/argon2 + salt', 'en un .txt', 'en cookies'], answer: 1 },
    { id: 'e-cs3-2', q: 'HTTPS protege los datos cifrándolos con…', options: ['TLS', 'HTML', 'FTP', 'JSON'], answer: 0 },
    { id: 'e-cs3-3', q: 'El principio de mínimo privilegio significa…', options: ['dar todos los permisos', 'dar solo los permisos necesarios', 'no usar contraseñas', 'abrir todos los puertos'], answer: 1 },
  ] },
  // Redes
  'redes-1': { pass: 70, questions: [
    { id: 'e-rd1-1', q: 'El modelo de 4 capas de internet es…', options: ['OSI de 7', 'TCP/IP', 'HTTP', 'DNS'], answer: 1 },
    { id: 'e-rd1-2', q: 'Una dirección IP identifica…', options: ['un servicio', 'un dispositivo en la red', 'un archivo', 'un usuario'], answer: 1 },
    { id: 'e-rd1-3', q: 'Un puerto identifica…', options: ['un dispositivo', 'un servicio/aplicación', 'una IP', 'un cable'], answer: 1 },
  ] },
  'redes-2': { pass: 70, questions: [
    { id: 'e-rd2-1', q: 'TCP frente a UDP es…', options: ['más rápido pero sin garantía', 'fiable y con conexión', 'solo para video', 'sin puertos'], answer: 1 },
    { id: 'e-rd2-2', q: 'El DNS traduce…', options: ['IP a MAC', 'nombres de dominio a IP', 'texto a binario', 'puertos a servicios'], answer: 1 },
    { id: 'e-rd2-3', q: 'HTTPS usa por defecto el puerto…', options: ['80', '443', '21', '25'], answer: 1 },
  ] },
  'redes-3': { pass: 70, questions: [
    { id: 'e-rd3-1', q: 'La máscara de subred sirve para…', options: ['cifrar', 'separar la parte de red y de host', 'acelerar', 'bloquear'], answer: 1 },
    { id: 'e-rd3-2', q: 'El comando ping sirve para…', options: ['borrar archivos', 'comprobar conectividad', 'instalar apps', 'ver el DNS'], answer: 1 },
    { id: 'e-rd3-3', q: 'Un router…', options: ['guarda archivos', 'conecta redes y enruta paquetes', 'cifra contraseñas', 'compila código'], answer: 1 },
  ] },
  // DSA — Estructuras de datos y algoritmos
  'dsa-1': { pass: 70, questions: [
    { id: 'e-dsa1-1', q: 'Recorrer un arreglo de n elementos una vez es…', options: ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'], answer: 1 },
    { id: 'e-dsa1-2', q: 'Acceder a un elemento por índice en un arreglo es…', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], answer: 0 },
    { id: 'e-dsa1-3', q: 'La búsqueda binaria requiere que los datos estén…', options: ['duplicados', 'ordenados', 'en un Map', 'sin ordenar'], answer: 1 },
  ] },
  'dsa-2': { pass: 70, questions: [
    { id: 'e-dsa2-1', q: 'Una pila (stack) funciona como…', options: ['FIFO (primero en entrar, primero en salir)', 'LIFO (último en entrar, primero en salir)', 'aleatorio', 'ordenado'], answer: 1 },
    { id: 'e-dsa2-2', q: 'Una cola (queue) es…', options: ['LIFO', 'FIFO', 'sin orden', 'un árbol'], answer: 1 },
    { id: 'e-dsa2-3', q: 'Insertar al inicio de una lista enlazada es…', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], answer: 1 },
  ] },
  'dsa-3': { pass: 70, questions: [
    { id: 'e-dsa3-1', q: 'Recorrer un árbol binario "en orden" visita…', options: ['raíz, izq, der', 'izq, raíz, der', 'der, izq, raíz', 'por niveles'], answer: 1 },
    { id: 'e-dsa3-2', q: 'BFS (recorrido por anchura) usa una…', options: ['pila', 'cola', 'lista', 'tabla hash'], answer: 1 },
    { id: 'e-dsa3-3', q: 'Toda función recursiva necesita…', options: ['un bucle for', 'un caso base', 'un arreglo', 'memoria infinita'], answer: 1 },
  ] },
  // System Design
  'sys-1': { pass: 70, questions: [
    { id: 'e-sys1-1', q: 'Escalado horizontal significa…', options: ['máquina más potente', 'agregar más máquinas', 'borrar datos', 'comprimir'], answer: 1 },
    { id: 'e-sys1-2', q: 'La latencia es…', options: ['cuántas peticiones por segundo', 'el tiempo que tarda una petición', 'el costo', 'el almacenamiento'], answer: 1 },
    { id: 'e-sys1-3', q: 'Un punto único de falla (SPOF) es…', options: ['bueno', 'un componente que tumba todo si falla', 'un tipo de caché', 'un balanceador'], answer: 1 },
  ] },
  'sys-2': { pass: 70, questions: [
    { id: 'e-sys2-1', q: 'Una caché sirve para…', options: ['guardar permanentemente', 'acelerar lecturas frecuentes', 'cifrar datos', 'balancear'], answer: 1 },
    { id: 'e-sys2-2', q: 'Un load balancer…', options: ['cifra el tráfico', 'reparte peticiones entre servidores', 'guarda archivos', 'compila'], answer: 1 },
    { id: 'e-sys2-3', q: 'Replicar la base de datos en réplicas de lectura ayuda a…', options: ['escribir más rápido', 'escalar las lecturas', 'cifrar', 'reducir código'], answer: 1 },
  ] },
  'sys-3': { pass: 70, questions: [
    { id: 'e-sys3-1', q: 'Una cola de mensajes (ej. Kafka/RabbitMQ) permite…', options: ['comunicación síncrona', 'procesamiento asíncrono y desacoplado', 'cifrar', 'balancear DNS'], answer: 1 },
    { id: 'e-sys3-2', q: 'El teorema CAP dice que ante una partición eliges entre…', options: ['velocidad y costo', 'consistencia y disponibilidad', 'caché y BD', 'TCP y UDP'], answer: 1 },
    { id: 'e-sys3-3', q: 'Los microservicios se caracterizan por…', options: ['un solo despliegue gigante', 'servicios pequeños e independientes', 'no usar red', 'no escalar'], answer: 1 },
  ] },
  // Linux & Terminal
  'linux-1': { pass: 70, questions: [
    { id: 'e-lnx1-1', q: 'Para listar archivos usas…', options: ['dir', 'ls', 'list', 'show'], answer: 1 },
    { id: 'e-lnx1-2', q: 'Para cambiar de carpeta…', options: ['cd', 'mv', 'go', 'open'], answer: 0 },
    { id: 'e-lnx1-3', q: '"pwd" muestra…', options: ['la contraseña', 'el directorio actual', 'los procesos', 'la red'], answer: 1 },
  ] },
  'linux-2': { pass: 70, questions: [
    { id: 'e-lnx2-1', q: 'chmod 755 da al dueño permisos de…', options: ['solo lectura', 'lectura, escritura y ejecución', 'ninguno', 'solo ejecución'], answer: 1 },
    { id: 'e-lnx2-2', q: 'Para ver los procesos en ejecución…', options: ['ls', 'ps / top', 'cd', 'cat'], answer: 1 },
    { id: 'e-lnx2-3', q: 'Ejecutar un comando como administrador…', options: ['admin', 'sudo', 'root()', 'run'], answer: 1 },
  ] },
  'linux-3': { pass: 70, questions: [
    { id: 'e-lnx3-1', q: 'El operador | (pipe) sirve para…', options: ['borrar', 'pasar la salida de un comando a otro', 'comentar', 'crear archivos'], answer: 1 },
    { id: 'e-lnx3-2', q: 'Para conectarte a un servidor remoto usas…', options: ['ftp', 'ssh', 'ping', 'curl'], answer: 1 },
    { id: 'e-lnx3-3', q: 'La primera línea de un script bash (#!/bin/bash) es…', options: ['un comentario inútil', 'el shebang que indica el intérprete', 'un error', 'una variable'], answer: 1 },
  ] },
  // Cloud / AWS
  'cloud-1': { pass: 70, questions: [
    { id: 'e-cl1-1', q: 'IaaS, PaaS y SaaS son…', options: ['lenguajes', 'modelos de servicio en la nube', 'protocolos', 'bases de datos'], answer: 1 },
    { id: 'e-cl1-2', q: 'Una "región" en la nube es…', options: ['un tipo de servidor', 'una ubicación geográfica de centros de datos', 'una IP', 'un usuario'], answer: 1 },
    { id: 'e-cl1-3', q: 'El modelo "pago por uso" significa…', options: ['pagas fijo siempre', 'pagas según lo que consumes', 'es gratis', 'pagas por adelantado un año'], answer: 1 },
  ] },
  'cloud-2': { pass: 70, questions: [
    { id: 'e-cl2-1', q: 'En AWS, una máquina virtual es un…', options: ['S3', 'EC2', 'Lambda', 'RDS'], answer: 1 },
    { id: 'e-cl2-2', q: 'Para guardar archivos/objetos en AWS usas…', options: ['EC2', 'S3', 'IAM', 'VPC'], answer: 1 },
    { id: 'e-cl2-3', q: 'AWS Lambda ejecuta código…', options: ['en un servidor que administras', 'sin administrar servidores (serverless)', 'solo local', 'solo en S3'], answer: 1 },
  ] },
  'cloud-3': { pass: 70, questions: [
    { id: 'e-cl3-1', q: 'IAM en AWS gestiona…', options: ['el almacenamiento', 'identidades y permisos', 'el DNS', 'los precios'], answer: 1 },
    { id: 'e-cl3-2', q: 'Una buena práctica de seguridad es aplicar…', options: ['permisos de admin a todos', 'mínimo privilegio', 'sin contraseñas', 'puertos abiertos'], answer: 1 },
    { id: 'e-cl3-3', q: 'Infraestructura como código (IaC) usa herramientas como…', options: ['Photoshop', 'Terraform/CloudFormation', 'Excel', 'Word'], answer: 1 },
  ] },
  // C#
  'csharp-1': { pass: 70, questions: [
    { id: 'e-cs1-1', q: 'Para imprimir en consola en C# usas…', options: ['print()', 'Console.WriteLine()', 'echo', 'cout'], answer: 1 },
    { id: 'e-cs1-2', q: 'El tipo para texto en C# es…', options: ['str', 'String/string', 'text', 'char[]'], answer: 1 },
    { id: 'e-cs1-3', q: 'C# se ejecuta sobre la plataforma…', options: ['JVM', '.NET', 'Node', 'Python VM'], answer: 1 },
  ] },
  'csharp-2': { pass: 70, questions: [
    { id: 'e-cs2-1', q: 'Una clase con propiedades usa…', options: ['get/set', 'def', 'function', 'struct only'], answer: 0 },
    { id: 'e-cs2-2', q: 'Heredar de una clase en C# se hace con…', options: ['extends', ': BaseClass', 'implements', 'inherits'], answer: 1 },
    { id: 'e-cs2-3', q: 'Una interfaz en C# suele nombrarse…', options: ['con prefijo I (IShape)', 'en minúsculas', 'con _', 'con $'], answer: 0 },
  ] },
  'csharp-3': { pass: 70, questions: [
    { id: 'e-cs3-1', q: 'Para una lista dinámica usas…', options: ['Array', 'List<T>', 'int[]', 'Map'], answer: 1 },
    { id: 'e-cs3-2', q: 'LINQ sirve para…', options: ['compilar', 'consultar colecciones', 'imprimir', 'crear hilos'], answer: 1 },
    { id: 'e-cs3-3', q: 'async/await en C# sirve para…', options: ['estilos', 'programación asíncrona', 'herencia', 'bucles'], answer: 1 },
  ] },
  // Lua
  'lua-1': { pass: 70, questions: [
    { id: 'e-lua1-1', q: 'Para imprimir en Lua usas…', options: ['echo', 'print()', 'console.log', 'printf'], answer: 1 },
    { id: 'e-lua1-2', q: 'Los comentarios de una línea en Lua empiezan con…', options: ['//', '#', '--', ';'], answer: 2 },
    { id: 'e-lua1-3', q: 'Los índices de las tablas/arreglos en Lua empiezan en…', options: ['0', '1', '-1', 'depende'], answer: 1 },
  ] },
  'lua-2': { pass: 70, questions: [
    { id: 'e-lua2-1', q: 'La estructura de datos principal de Lua es…', options: ['el array', 'la tabla (table)', 'la lista', 'el set'], answer: 1 },
    { id: 'e-lua2-2', q: 'Para definir una función usas…', options: ['def', 'function … end', 'func', 'fn'], answer: 1 },
    { id: 'e-lua2-3', q: 'Para recorrer una tabla con pares clave-valor usas…', options: ['for i=1,n', 'pairs()', 'foreach', 'map()'], answer: 1 },
  ] },
  'lua-3': { pass: 70, questions: [
    { id: 'e-lua3-1', q: 'En Roblox, los scripts se escriben en…', options: ['Python', 'Lua (Luau)', 'C#', 'JavaScript'], answer: 1 },
    { id: 'e-lua3-2', q: 'Para detectar que un jugador tocó una parte usas el evento…', options: ['.Clicked', '.Touched', '.OnHit', '.Collide'], answer: 1 },
    { id: 'e-lua3-3', q: 'game.Players.PlayerAdded sirve para…', options: ['borrar el juego', 'ejecutar algo cuando entra un jugador', 'crear partes', 'guardar datos'], answer: 1 },
  ] },
};

// ════════════════════════ JAVASCRIPT ════════════════════════
const JAVASCRIPT: Course = {
  id: 'javascript', name: 'JavaScript', icon: '🟨', color: '#eab308', tagline: 'El lenguaje de la web (front y back)',
  levels: [
    {
      id: 'js-1', title: 'Nivel 1 · Fundamentos',
      subtopics: ['let/const', 'tipos', 'template literals', 'console.log'],
      theory: {
        teoria: 'JavaScript es el lenguaje de la web, de tipado dinámico. Usa let (reasignable) y const (constante); evita var. Tipos: number, string, boolean, null, undefined, object. Los template literals `texto ${x}` interpolan variables.',
        ejemplo: 'const nombre = "Cemal";\nlet edad = 25;\nconsole.log(`Hola, ${nombre} (${edad})`);',
        buenas: ['Usa const por defecto, let si vas a reasignar.', 'Compara con === (estricto), no con ==.'],
        errores: ['Usar var (scope confuso).', 'Confundir == (débil) con === (estricto).'],
      },
      exercises: [
        { id: 'js-1-b1', level: 'Básico', objective: 'Imprime "Hola, Renacer" con console.log.', solution: 'console.log("Hola, Renacer");' },
        { id: 'js-1-b2', level: 'Básico', objective: 'Crea const con tu nombre e imprime un saludo con template literal.', solution: 'const nombre = "Ana";\nconsole.log(`Hola, ${nombre}`);' },
        { id: 'js-1-i1', level: 'Intermedio', objective: 'Convierte "5" (string) a número y súmale 3.', hint: 'Number() o parseInt().', solution: 'console.log(Number("5") + 3);' },
      ],
    },
    {
      id: 'js-2', title: 'Nivel 2 · Funciones y Scope',
      subtopics: ['function', 'arrow functions', 'scope', 'parámetros por defecto'],
      theory: {
        teoria: 'Las funciones agrupan lógica reutilizable. Sintaxis flecha: const f = (a, b) => a + b. El scope de let/const es de bloque {}. Las funciones pueden tener parámetros por defecto.',
        ejemplo: 'const saludar = (nombre, signo = "!") => `Hola ${nombre}${signo}`;\nconsole.log(saludar("Ana"));',
        buenas: ['Funciones cortas y con un propósito.', 'Usa arrow functions para callbacks.'],
        errores: ['Olvidar el return en funciones con cuerpo {}.', 'Depender de var por su hoisting.'],
      },
      exercises: [
        { id: 'js-2-b1', level: 'Básico', objective: 'Función flecha sumar(a,b) que devuelva la suma.', solution: 'const sumar = (a, b) => a + b;' },
        { id: 'js-2-i1', level: 'Intermedio', objective: 'Función esPar(n) que devuelva true/false.', solution: 'const esPar = (n) => n % 2 === 0;' },
        { id: 'js-2-a1', level: 'Avanzado', objective: 'Función que reciba un nombre opcional (por defecto "amigo") y salude.', solution: 'const saludar = (nombre = "amigo") => `Hola, ${nombre}`;' },
      ],
    },
    {
      id: 'js-3', title: 'Nivel 3 · Arrays y Objetos',
      subtopics: ['map', 'filter', 'reduce', 'objetos', 'destructuring'],
      theory: {
        teoria: 'Los arrays tienen métodos potentes: map (transforma), filter (selecciona), reduce (acumula). Los objetos guardan pares clave-valor. El destructuring extrae valores: const {nombre} = persona.',
        ejemplo: 'const nums = [1, 2, 3, 4];\nconst pares = nums.filter((n) => n % 2 === 0);\nconst dobles = nums.map((n) => n * 2);\nconst total = nums.reduce((a, b) => a + b, 0);',
        buenas: ['Prefiere map/filter/reduce sobre bucles for cuando aplique.', 'No mutes el array original; crea uno nuevo.'],
        errores: ['Olvidar el valor inicial en reduce.', 'Mutar el estado directamente.'],
      },
      exercises: [
        { id: 'js-3-b1', level: 'Básico', objective: 'Filtra los números pares de [1,2,3,4,5,6].', solution: 'console.log([1,2,3,4,5,6].filter((n) => n % 2 === 0));' },
        { id: 'js-3-i1', level: 'Intermedio', objective: 'Duplica cada número de un array con map.', solution: 'console.log([1,2,3].map((n) => n * 2));' },
        { id: 'js-3-a1', level: 'Avanzado', objective: 'Suma todos los números de un array con reduce (acumulativo).', solution: 'console.log([1,2,3,4].reduce((a, b) => a + b, 0));' },
      ],
    },
    {
      id: 'js-4', title: 'Nivel 4 · DOM y Eventos',
      subtopics: ['querySelector', 'addEventListener', 'manipular el DOM'],
      theory: {
        teoria: 'El DOM es el árbol de la página. document.querySelector(selector) obtiene un elemento; .textContent cambia su texto; addEventListener("click", fn) reacciona a eventos del usuario.',
        ejemplo: 'const btn = document.querySelector("#boton");\nbtn.addEventListener("click", () => {\n  document.querySelector("#salida").textContent = "¡Clic!";\n});',
        buenas: ['Cachea los elementos en variables.', 'Separa la lógica del HTML.'],
        errores: ['Buscar el elemento antes de que exista en el DOM.', 'Usar innerHTML con datos del usuario (riesgo XSS).'],
      },
      exercises: [
        { id: 'js-4-i1', level: 'Intermedio', objective: 'Selecciona un botón y muestra una alerta al hacer clic.', solution: 'document.querySelector("button").addEventListener("click", () => alert("Hola"));' },
        { id: 'js-4-a1', level: 'Avanzado', objective: 'Al hacer clic, cambia el texto de un elemento con id "out".', solution: 'document.querySelector("#btn").addEventListener("click", () => {\n  document.querySelector("#out").textContent = "Cambiado";\n});' },
      ],
      project: { title: 'Proyecto · Gestor de tareas', desc: 'To-do app: añadir, marcar y borrar tareas manipulando el DOM y guardando en localStorage.' },
    },
    {
      id: 'js-5', title: 'Nivel 5 · Asincronía',
      subtopics: ['promesas', 'async/await', 'fetch'],
      theory: {
        teoria: 'JavaScript es asíncrono: no bloquea esperando. Las promesas representan un valor futuro. async/await las hace legibles. fetch(url) pide datos a una API y devuelve una promesa.',
        ejemplo: 'async function cargar() {\n  const res = await fetch("https://api.example.com/datos");\n  const data = await res.json();\n  console.log(data);\n}',
        buenas: ['Maneja errores con try/catch en funciones async.', 'await solo dentro de funciones async.'],
        errores: ['Olvidar await (obtienes una promesa, no el dato).', 'No manejar el caso de error de la red.'],
      },
      exercises: [
        { id: 'js-5-i1', level: 'Intermedio', objective: 'Escribe una función async que haga fetch a una URL y muestre el JSON.', solution: 'async function cargar(url) {\n  const res = await fetch(url);\n  console.log(await res.json());\n}' },
        { id: 'js-5-a1', level: 'Avanzado', objective: 'Igual que el anterior pero maneja errores con try/catch.', solution: 'async function cargar(url) {\n  try {\n    const res = await fetch(url);\n    console.log(await res.json());\n  } catch (e) {\n    console.log("Error:", e.message);\n  }\n}' },
      ],
      project: { title: 'Proyecto · App del clima', desc: 'Consume una API del clima con fetch y muestra la temperatura de una ciudad.' },
    },
  ],
};

// ════════════════════════ HTML ════════════════════════
const HTML: Course = {
  id: 'html', name: 'HTML', icon: '🟧', color: '#e34f26', tagline: 'La estructura de toda página web',
  levels: [
    {
      id: 'html-1', title: 'Nivel 1 · Estructura básica',
      subtopics: ['doctype', 'etiquetas', 'texto', 'enlaces', 'imágenes', 'listas'],
      theory: {
        teoria: 'HTML es el lenguaje de marcado que estructura las páginas. Un documento tiene <!DOCTYPE html>, <html>, <head> (metadatos) y <body> (contenido visible). Las etiquetas envuelven contenido: <h1>-<h6> títulos, <p> párrafos, <a> enlaces, <img> imágenes.',
        ejemplo: '<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Mi página</h1>\n    <p>Hola, <a href="https://x.com">enlace</a></p>\n    <img src="foto.png" alt="Mi foto" />\n  </body>\n</html>',
        buenas: ['Usa etiquetas por su significado, no por su apariencia.', 'Siempre pon alt en las imágenes.'],
        errores: ['No cerrar las etiquetas (<p> sin </p>).', 'Olvidar el atributo href en los enlaces.'],
      },
      exercises: [
        { id: 'html-1-b1', level: 'Básico', objective: 'Crea un título <h1> con tu nombre y un párrafo debajo.', solution: '<h1>Cemal</h1>\n<p>Futuro dev en Vancouver.</p>' },
        { id: 'html-1-i1', level: 'Intermedio', objective: 'Crea una lista no ordenada con 3 lenguajes.', solution: '<ul>\n  <li>Java</li>\n  <li>Python</li>\n  <li>JavaScript</li>\n</ul>' },
      ],
    },
    {
      id: 'html-2', title: 'Nivel 2 · Formularios y Semántica',
      subtopics: ['form', 'input', 'label', 'header/nav/main/footer'],
      theory: {
        teoria: 'Los formularios capturan datos: <form>, <input>, <label>, <button>. Las etiquetas semánticas (<header>, <nav>, <main>, <section>, <article>, <footer>) describen el significado de cada zona, mejorando accesibilidad y SEO.',
        ejemplo: '<form>\n  <label for="email">Correo</label>\n  <input id="email" type="email" />\n  <button type="submit">Enviar</button>\n</form>',
        buenas: ['Asocia cada <label> a su input con for/id.', 'Usa la etiqueta semántica correcta en vez de <div> para todo.'],
        errores: ['Inputs sin label (mala accesibilidad).', 'Abusar de <div> en lugar de etiquetas semánticas.'],
      },
      exercises: [
        { id: 'html-2-b1', level: 'Básico', objective: 'Crea un input de texto con su label "Nombre".', solution: '<label for="n">Nombre</label>\n<input id="n" type="text" />' },
        { id: 'html-2-i1', level: 'Intermedio', objective: 'Estructura una página con header, main y footer semánticos.', solution: '<header><h1>Sitio</h1></header>\n<main><p>Contenido</p></main>\n<footer><p>© 2026</p></footer>' },
      ],
      project: { title: 'Proyecto · Página personal', desc: 'Crea tu landing/CV en HTML semántico con secciones, formulario de contacto y enlaces a tu GitHub.' },
    },
    {
      id: 'html-3', title: 'Nivel 3 · Tablas y Multimedia',
      subtopics: ['table', 'tr/td', 'audio/video', 'iframe'],
      theory: {
        teoria: 'Las tablas (<table>, <tr>, <th>, <td>) muestran datos tabulares. Multimedia: <video>, <audio> con controls; <iframe> incrusta otra página (un mapa, un video de YouTube).',
        ejemplo: '<table>\n  <tr><th>Lenguaje</th><th>Nivel</th></tr>\n  <tr><td>Java</td><td>80%</td></tr>\n</table>\n<video src="demo.mp4" controls></video>',
        buenas: ['Usa <th> para encabezados de tabla.', 'Las tablas son para datos, no para maquetar (eso es CSS).'],
        errores: ['Usar tablas para el layout de la página.', 'Olvidar controls en audio/video.'],
      },
      exercises: [
        { id: 'html-3-b1', level: 'Básico', objective: 'Crea una tabla con una fila de encabezado y una de datos.', solution: '<table>\n  <tr><th>Nombre</th><th>Edad</th></tr>\n  <tr><td>Ana</td><td>30</td></tr>\n</table>' },
      ],
    },
  ],
};

// ════════════════════════ CSS ════════════════════════
const CSS: Course = {
  id: 'css', name: 'CSS', icon: '🟦', color: '#264de4', tagline: 'Estilo y diseño de las páginas',
  requires: [{ courseId: 'html', label: 'HTML (al menos 50%)' }],
  levels: [
    {
      id: 'css-1', title: 'Nivel 1 · Selectores y Box Model',
      subtopics: ['selectores', 'colores', 'box model', 'tipografía'],
      theory: {
        teoria: 'CSS da estilo al HTML. Selectores: .clase, #id, etiqueta. El box model rodea cada elemento: content → padding → border → margin. Propiedades comunes: color, background, font-size, padding, margin.',
        ejemplo: '.tarjeta {\n  background: #f4f1ea;\n  padding: 16px;\n  border-radius: 8px;\n  color: #1c1917;\n}',
        buenas: ['Usa clases reutilizables, evita estilos en línea.', 'box-sizing: border-box facilita el cálculo de tamaños.'],
        errores: ['Abusar de !important.', 'Selectores demasiado específicos y frágiles.'],
      },
      exercises: [
        { id: 'css-1-b1', level: 'Básico', objective: 'Dale color rojo y padding de 10px a la clase .aviso.', solution: '.aviso {\n  color: red;\n  padding: 10px;\n}' },
        { id: 'css-1-i1', level: 'Intermedio', objective: 'Crea una tarjeta con fondo, bordes redondeados y sombra.', solution: '.card {\n  background: #fff;\n  border-radius: 12px;\n  box-shadow: 0 4px 12px rgba(0,0,0,.1);\n  padding: 16px;\n}' },
      ],
    },
    {
      id: 'css-2', title: 'Nivel 2 · Flexbox y Grid',
      subtopics: ['flexbox', 'grid', 'alineación'],
      theory: {
        teoria: 'Flexbox alinea en una dimensión: display: flex + justify-content (horizontal) + align-items (vertical). Grid maqueta en dos dimensiones: display: grid + grid-template-columns. Son la base del layout moderno.',
        ejemplo: '.fila {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 1rem;\n}\n.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}',
        buenas: ['Flex para componentes lineales; Grid para layouts.', 'Usa gap en vez de márgenes entre items.'],
        errores: ['Usar float para layout (obsoleto).', 'Confundir los ejes de flex.'],
      },
      exercises: [
        { id: 'css-2-b1', level: 'Básico', objective: 'Centra un elemento horizontal y verticalmente con flex.', solution: '.box {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}' },
        { id: 'css-2-i1', level: 'Intermedio', objective: 'Crea una cuadrícula de 3 columnas iguales.', solution: '.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1rem;\n}' },
      ],
      project: { title: 'Proyecto · Diseño responsive', desc: 'Maqueta una página con header, grid de tarjetas y footer, que se adapte a móvil.' },
    },
    {
      id: 'css-3', title: 'Nivel 3 · Responsive y Animaciones',
      subtopics: ['media queries', 'unidades relativas', 'transitions', 'keyframes'],
      theory: {
        teoria: 'El diseño responsive adapta la página a cada pantalla con @media (min-width). Unidades relativas: %, rem, vw/vh. Las animaciones: transition (cambios suaves) y @keyframes (animaciones complejas).',
        ejemplo: '@media (max-width: 600px) {\n  .menu { flex-direction: column; }\n}\n.btn { transition: transform .2s; }\n.btn:hover { transform: scale(1.05); }',
        buenas: ['Diseña mobile-first.', 'Anima propiedades baratas (transform, opacity).'],
        errores: ['Tamaños fijos en px para todo.', 'Animar width/height (provoca reflow).'],
      },
      exercises: [
        { id: 'css-3-i1', level: 'Intermedio', objective: 'Haz que un menú flex pase a columna en pantallas menores a 600px.', solution: '@media (max-width: 600px) {\n  .menu { flex-direction: column; }\n}' },
      ],
    },
  ],
};

// ════════════════════════ SQL ════════════════════════
const SQL: Course = {
  id: 'sql', name: 'SQL', icon: '🗄️', color: '#00758f', tagline: 'Consultas a bases de datos',
  levels: [
    {
      id: 'sql-1', title: 'Nivel 1 · Consultas básicas',
      subtopics: ['SELECT', 'WHERE', 'ORDER BY', 'LIMIT'],
      theory: {
        teoria: 'SQL consulta bases relacionales (tablas con filas/columnas). SELECT columnas FROM tabla trae datos; WHERE filtra; ORDER BY ordena; LIMIT acota.',
        ejemplo: 'SELECT nombre, edad\nFROM usuarios\nWHERE edad > 18\nORDER BY edad DESC\nLIMIT 10;',
        buenas: ['Pide solo las columnas que necesitas (no SELECT *).', 'Usa alias para legibilidad.'],
        errores: ['Olvidar el WHERE en UPDATE/DELETE (afecta todo).', 'Comparar texto sin comillas.'],
      },
      exercises: [
        { id: 'sql-1-b1', level: 'Básico', objective: 'Trae nombre y email de los usuarios mayores de 18.', solution: 'SELECT nombre, email FROM usuarios WHERE edad > 18;' },
        { id: 'sql-1-i1', level: 'Intermedio', objective: 'Los 5 productos más caros.', solution: 'SELECT nombre, precio\nFROM productos\nORDER BY precio DESC\nLIMIT 5;' },
      ],
    },
    {
      id: 'sql-2', title: 'Nivel 2 · Agregación y JOINs',
      subtopics: ['GROUP BY', 'COUNT/AVG/SUM', 'JOIN'],
      theory: {
        teoria: 'Las funciones de agregación resumen datos: COUNT, SUM, AVG, MAX. GROUP BY agrupa filas. JOIN combina tablas relacionadas por una clave (PK/FK).',
        ejemplo: 'SELECT u.ciudad, COUNT(*) AS total\nFROM usuarios u\nJOIN ordenes o ON o.usuario_id = u.id\nGROUP BY u.ciudad;',
        buenas: ['Cada columna del SELECT no agregada debe estar en el GROUP BY.', 'Nombra las tablas con alias en los JOIN.'],
        errores: ['Confundir WHERE (filtra filas) con HAVING (filtra grupos).', 'JOIN sin condición ON (producto cartesiano).'],
      },
      exercises: [
        { id: 'sql-2-b1', level: 'Básico', objective: 'Cuenta cuántos usuarios hay por ciudad.', solution: 'SELECT ciudad, COUNT(*) AS total\nFROM usuarios\nGROUP BY ciudad;' },
        { id: 'sql-2-a1', level: 'Avanzado', objective: 'Une ordenes con usuarios y muestra nombre y total de cada orden.', solution: 'SELECT u.nombre, o.total\nFROM ordenes o\nJOIN usuarios u ON u.id = o.usuario_id;' },
      ],
      project: { title: 'Proyecto · Reportes de ventas', desc: 'Escribe consultas para un sistema de ventas: top clientes, ingresos por mes, productos más vendidos.' },
    },
    {
      id: 'sql-3', title: 'Nivel 3 · Avanzado',
      subtopics: ['subconsultas', 'índices', 'transacciones'],
      theory: {
        teoria: 'Una subconsulta es una consulta dentro de otra. Los índices aceleran las búsquedas en columnas frecuentes. Las transacciones (BEGIN/COMMIT/ROLLBACK) garantizan atomicidad: todo o nada.',
        ejemplo: 'SELECT nombre FROM usuarios\nWHERE id IN (SELECT usuario_id FROM ordenes WHERE total > 100);\n\nBEGIN;\nUPDATE cuentas SET saldo = saldo - 100 WHERE id = 1;\nCOMMIT;',
        buenas: ['Indexa columnas usadas en WHERE/JOIN.', 'Usa transacciones para operaciones relacionadas.'],
        errores: ['Crear índices en todo (ralentiza escrituras).', 'No hacer ROLLBACK ante un error.'],
      },
      exercises: [
        { id: 'sql-3-a1', level: 'Avanzado', objective: 'Usa una subconsulta para traer usuarios que han hecho alguna orden.', solution: 'SELECT nombre FROM usuarios\nWHERE id IN (SELECT usuario_id FROM ordenes);' },
      ],
    },
  ],
};

// ════════════════════════ PHP ════════════════════════
const PHP: Course = {
  id: 'php', name: 'PHP', icon: '🐘', color: '#777bb4', tagline: 'Backend web del lado servidor',
  requires: [{ courseId: 'html', label: 'HTML (al menos 50%)' }],
  levels: [
    {
      id: 'php-1', title: 'Nivel 1 · Fundamentos',
      subtopics: ['variables $', 'echo', 'arrays', 'condicionales'],
      theory: {
        teoria: 'PHP corre en el servidor y genera HTML. Las variables empiezan con $. echo imprime. Soporta arrays asociativos y control de flujo como otros lenguajes. Se mezcla con HTML entre <?php ?>.',
        ejemplo: '<?php\n$nombre = "Cemal";\n$edad = 25;\nif ($edad >= 18) {\n  echo "Hola, $nombre";\n}\n?>',
        buenas: ['Activa errores en desarrollo (error_reporting).', 'Separa lógica de presentación.'],
        errores: ['Olvidar el $ en las variables.', 'No cerrar <?php correctamente.'],
      },
      exercises: [
        { id: 'php-1-b1', level: 'Básico', objective: 'Declara $nombre e imprime "Hola, <nombre>".', solution: '<?php $nombre = "Ana"; echo "Hola, $nombre"; ?>' },
        { id: 'php-1-i1', level: 'Intermedio', objective: 'Recorre un array de 3 frutas e imprime cada una.', solution: '<?php\n$frutas = ["manzana", "pera", "uva"];\nforeach ($frutas as $f) { echo $f . "<br>"; }\n?>' },
      ],
    },
    {
      id: 'php-2', title: 'Nivel 2 · Formularios y POST',
      subtopics: ['$_POST', '$_GET', 'validación', 'seguridad'],
      theory: {
        teoria: 'Los formularios HTML envían datos a PHP. Llegan en $_POST (o $_GET). SIEMPRE valida y sanea los datos del usuario (htmlspecialchars contra XSS). Nunca confíes en la entrada.',
        ejemplo: '<?php\nif ($_SERVER["REQUEST_METHOD"] === "POST") {\n  $email = htmlspecialchars($_POST["email"]);\n  echo "Recibido: $email";\n}\n?>',
        buenas: ['Valida en servidor aunque valides en cliente.', 'Escapa la salida con htmlspecialchars.'],
        errores: ['Confiar en datos del usuario sin sanear (XSS/SQLi).', 'Mostrar errores crudos en producción.'],
      },
      exercises: [
        { id: 'php-2-i1', level: 'Intermedio', objective: 'Lee un campo "nombre" de $_POST y muéstralo saneado.', solution: '<?php\n$nombre = htmlspecialchars($_POST["nombre"] ?? "");\necho "Hola, $nombre";\n?>' },
      ],
      project: { title: 'Proyecto · Formulario de contacto', desc: 'Página con formulario que valida y guarda los mensajes (en archivo o BD).' },
    },
    {
      id: 'php-3', title: 'Nivel 3 · Bases de datos (PDO)',
      subtopics: ['PDO', 'consultas preparadas', 'CRUD'],
      theory: {
        teoria: 'PDO (PHP Data Objects) conecta a bases de datos de forma segura. Usa consultas preparadas (prepare/execute) para evitar inyección SQL. Con ello haces CRUD: crear, leer, actualizar, borrar.',
        ejemplo: '$pdo = new PDO("mysql:host=localhost;dbname=app", $user, $pass);\n$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");\n$stmt->execute([$id]);\n$user = $stmt->fetch();',
        buenas: ['Siempre consultas preparadas con parámetros.', 'Maneja excepciones de PDO con try/catch.'],
        errores: ['Concatenar variables en el SQL (inyección).', 'Guardar contraseñas sin hash.'],
      },
      exercises: [
        { id: 'php-3-a1', level: 'Avanzado', objective: 'Escribe una consulta preparada que busque un usuario por id.', solution: '$stmt = $pdo->prepare("SELECT * FROM usuarios WHERE id = ?");\n$stmt->execute([$id]);\n$usuario = $stmt->fetch();' },
      ],
    },
  ],
};

// ════════════════════════ C++ ════════════════════════
const CPP: Course = {
  id: 'cpp', name: 'C++', icon: '➕', color: '#00599c', tagline: 'Rendimiento: videojuegos y sistemas',
  levels: [
    {
      id: 'cpp-1', title: 'Nivel 1 · Fundamentos',
      subtopics: ['cout/cin', 'variables', 'control de flujo'],
      theory: {
        teoria: 'C++ es compilado y de alto rendimiento. std::cout imprime, std::cin lee. Tipado estático: int, double, bool, std::string. El programa parte de int main().',
        ejemplo: '#include <iostream>\nint main() {\n  int edad = 25;\n  std::cout << "Edad: " << edad << "\\n";\n  return 0;\n}',
        buenas: ['Inicializa siempre las variables.', 'Usa std::string en vez de char* cuando puedas.'],
        errores: ['Olvidar #include <iostream>.', 'Usar variables sin inicializar (basura).'],
      },
      exercises: [
        { id: 'cpp-1-b1', level: 'Básico', objective: 'Imprime "Hola, Renacer".', solution: 'std::cout << "Hola, Renacer" << "\\n";' },
        { id: 'cpp-1-i1', level: 'Intermedio', objective: 'Recorre del 1 al 5 con un for e imprime cada número.', solution: 'for (int i = 1; i <= 5; i++) {\n  std::cout << i << "\\n";\n}' },
      ],
    },
    {
      id: 'cpp-2', title: 'Nivel 2 · Punteros y Memoria',
      subtopics: ['punteros', 'referencias', 'new/delete'],
      theory: {
        teoria: 'Un puntero guarda una dirección de memoria (int* p = &x). Las referencias (int& r = x) son alias. La memoria dinámica se reserva con new y se libera con delete (cada new necesita su delete).',
        ejemplo: 'int x = 10;\nint* p = &x;\nstd::cout << *p; // 10\nint* arr = new int[5];\ndelete[] arr;',
        buenas: ['Cada new debe tener su delete (evita fugas).', 'Prefiere smart pointers (unique_ptr) en C++ moderno.'],
        errores: ['Fugas de memoria (new sin delete).', 'Desreferenciar punteros nulos.'],
      },
      exercises: [
        { id: 'cpp-2-i1', level: 'Intermedio', objective: 'Declara un entero, un puntero a él e imprime el valor con el puntero.', solution: 'int x = 42;\nint* p = &x;\nstd::cout << *p;' },
      ],
      project: { title: 'Proyecto · Mini sistema de consola', desc: 'Sistema de inventario en C++: clases, vector y un menú interactivo.' },
    },
    {
      id: 'cpp-3', title: 'Nivel 3 · POO y STL',
      subtopics: ['clases', 'vector', 'map', 'encapsulación'],
      theory: {
        teoria: 'C++ soporta POO con class (atributos private + métodos public). La STL ofrece estructuras listas: std::vector (lista dinámica), std::map (clave-valor), y algoritmos.',
        ejemplo: '#include <vector>\nclass Cuenta {\n  double saldo = 0;\npublic:\n  void depositar(double m) { saldo += m; }\n  double getSaldo() { return saldo; }\n};\nstd::vector<int> v = {1, 2, 3};',
        buenas: ['Encapsula: atributos private.', 'Usa la STL antes de implementar estructuras a mano.'],
        errores: ['Exponer atributos public.', 'Acceder a índices fuera del vector.'],
      },
      exercises: [
        { id: 'cpp-3-a1', level: 'Avanzado', objective: 'Crea un vector de enteros, agrégale 3 valores y recórrelo.', solution: 'std::vector<int> v;\nv.push_back(1); v.push_back(2); v.push_back(3);\nfor (int x : v) std::cout << x << " ";' },
      ],
    },
  ],
};

// ════════════════════════ ASSEMBLY x86 ════════════════════════
const ASM: Course = {
  id: 'asm', name: 'Assembly x86', icon: '⚙️', color: '#6e6e6e', tagline: 'El lenguaje del procesador (bajo nivel)',
  levels: [
    {
      id: 'asm-1', title: 'Nivel 1 · Registros e Instrucciones',
      subtopics: ['registros', 'mov', 'add/sub', 'sintaxis'],
      theory: {
        teoria: 'Assembly es el lenguaje más cercano al hardware: das instrucciones directas al procesador. Los registros (EAX, EBX, ECX, EDX) son "variables" del CPU. mov copia valores; add/sub operan.',
        ejemplo: 'mov eax, 5      ; eax = 5\nmov ebx, 3      ; ebx = 3\nadd eax, ebx    ; eax = eax + ebx = 8',
        buenas: ['Comenta cada instrucción (es muy denso).', 'Conoce qué registro usa cada instrucción.'],
        errores: ['Confundir el orden destino/origen (mov dest, src).', 'Olvidar que las operaciones modifican el registro destino.'],
      },
      exercises: [
        { id: 'asm-1-b1', level: 'Básico', objective: 'Mueve 10 a EAX y súmale 5.', solution: 'mov eax, 10\nadd eax, 5    ; eax = 15' },
        { id: 'asm-1-i1', level: 'Intermedio', objective: 'Calcula 7 * 2 usando suma (suma EAX a sí mismo, o usa mul).', solution: 'mov eax, 7\nadd eax, eax  ; eax = 14' },
      ],
    },
    {
      id: 'asm-2', title: 'Nivel 2 · Pila y Control',
      subtopics: ['push/pop', 'cmp/jmp', 'saltos condicionales'],
      theory: {
        teoria: 'La pila guarda valores temporales: push apila, pop desapila (LIFO). El control de flujo se hace con cmp (compara) seguido de saltos: jmp (incondicional), je (si igual), jg (si mayor). ret regresa de una rutina.',
        ejemplo: 'cmp eax, ebx   ; compara\nje iguales     ; salta si eax == ebx\njmp fin\niguales:\n  ; ...\nfin:',
        buenas: ['Equilibra cada push con su pop.', 'Etiqueta los saltos con nombres claros.'],
        errores: ['Pila desbalanceada (push sin pop).', 'Saltar a la etiqueta equivocada.'],
      },
      exercises: [
        { id: 'asm-2-i1', level: 'Intermedio', objective: 'Apila EAX, haz algo, y recupéralo con pop.', solution: 'push eax\n; ... otras operaciones ...\npop eax' },
      ],
    },
  ],
};

// ════════════════════════ ANGULAR ════════════════════════
const ANGULAR: Course = {
  id: 'angular', name: 'Angular', icon: '🅰️', color: '#dd0031', tagline: 'Framework frontend empresarial (TypeScript)',
  requires: [{ courseId: 'javascript', label: 'JavaScript (al menos 50%)' }],
  levels: [
    {
      id: 'angular-1', title: 'Nivel 1 · Componentes y Binding',
      subtopics: ['componentes', 'interpolación', '*ngFor', '*ngIf'],
      theory: {
        teoria: 'Angular es un framework completo en TypeScript. La UI se arma con componentes (clase + plantilla HTML). Interpolación: {{ variable }}. Directivas: *ngFor repite, *ngIf muestra condicionalmente.',
        ejemplo: '@Component({\n  selector: "app-saludo",\n  template: "<h1>Hola, {{ nombre }}</h1>"\n})\nexport class SaludoComponent {\n  nombre = "Cemal";\n}',
        buenas: ['Un componente por responsabilidad.', 'Tipa todo (es TypeScript).'],
        errores: ['Olvidar declarar el componente en el módulo.', 'Lógica pesada en la plantilla.'],
      },
      exercises: [
        { id: 'angular-1-b1', level: 'Básico', objective: 'Interpola una variable titulo en un <h1>.', solution: 'template: "<h1>{{ titulo }}</h1>"' },
        { id: 'angular-1-i1', level: 'Intermedio', objective: 'Renderiza una lista de items con *ngFor.', solution: '<li *ngFor="let item of items">{{ item }}</li>' },
      ],
    },
    {
      id: 'angular-2', title: 'Nivel 2 · Servicios e Inyección',
      subtopics: ['servicios', 'inyección de dependencias', 'HttpClient'],
      theory: {
        teoria: 'Los servicios (@Injectable) guardan lógica reutilizable (datos, llamadas API). Angular los inyecta en el constructor (inyección de dependencias). HttpClient hace peticiones HTTP devolviendo Observables.',
        ejemplo: '@Injectable({ providedIn: "root" })\nexport class ApiService {\n  constructor(private http: HttpClient) {}\n  getUsuarios() { return this.http.get("/api/usuarios"); }\n}',
        buenas: ['Separa la lógica de datos en servicios, no en componentes.', 'Usa providedIn: "root" para singletons.'],
        errores: ['Poner llamadas HTTP directas en el componente.', 'No desuscribirse de Observables manuales.'],
      },
      exercises: [
        { id: 'angular-2-i1', level: 'Intermedio', objective: 'Crea un servicio inyectable con un método que devuelva un saludo.', solution: '@Injectable({ providedIn: "root" })\nexport class SaludoService {\n  saludar(n: string) { return `Hola, ${n}`; }\n}' },
      ],
      project: { title: 'Proyecto · Panel administrativo', desc: 'App Angular con componentes, un servicio que consume una API y routing entre vistas.' },
    },
    {
      id: 'angular-3', title: 'Nivel 3 · Routing',
      subtopics: ['rutas', 'router-outlet', 'routerLink'],
      theory: {
        teoria: 'El Router permite navegar entre vistas sin recargar. Defines un array de rutas (path → componente), pones <router-outlet> donde se renderiza la vista activa, y navegas con [routerLink].',
        ejemplo: 'const routes = [\n  { path: "inicio", component: InicioComponent },\n  { path: "perfil", component: PerfilComponent }\n];\n// plantilla:\n<a routerLink="/perfil">Perfil</a>\n<router-outlet></router-outlet>',
        buenas: ['Organiza rutas por funcionalidad.', 'Usa lazy loading para módulos grandes.'],
        errores: ['Olvidar <router-outlet>.', 'Usar href en vez de routerLink (recarga la página).'],
      },
      exercises: [
        { id: 'angular-3-a1', level: 'Avanzado', objective: 'Define una ruta "perfil" que cargue PerfilComponent.', solution: 'const routes = [\n  { path: "perfil", component: PerfilComponent }\n];' },
      ],
    },
  ],
};

// ════════════════════════ GO ════════════════════════
const GO: Course = {
  id: 'go', name: 'Go', icon: '🐹', color: '#00add8', tagline: 'Rápido y simple, ideal para servidores',
  levels: [
    {
      id: 'go-1', title: 'Nivel 1 · Fundamentos',
      subtopics: ['paquetes', 'variables', 'fmt', 'tipos'],
      theory: {
        teoria: 'Go es compilado, simple y muy rápido. Todo programa pertenece a un package; el ejecutable empieza en func main(). Declaración corta con := (infiere el tipo). fmt.Println imprime.',
        ejemplo: 'package main\nimport "fmt"\nfunc main() {\n  nombre := "Cemal"\n  fmt.Println("Hola,", nombre)\n}',
        buenas: ['Usa gofmt para formatear automáticamente.', 'Nombres cortos y claros.'],
        errores: ['Importar un paquete y no usarlo (Go falla al compilar).', 'Declarar una variable y no usarla.'],
      },
      exercises: [
        { id: 'go-1-b1', level: 'Básico', objective: 'Imprime "Hola, Renacer".', solution: 'package main\nimport "fmt"\nfunc main() { fmt.Println("Hola, Renacer") }' },
        { id: 'go-1-i1', level: 'Intermedio', objective: 'Suma los enteros de un slice con un for-range.', solution: 'total := 0\nfor _, n := range []int{1,2,3,4} { total += n }\nfmt.Println(total)' },
      ],
    },
    {
      id: 'go-2', title: 'Nivel 2 · Funciones y Structs',
      subtopics: ['func', 'structs', 'manejo de errores'],
      theory: {
        teoria: 'Las funciones (func) pueden devolver varios valores, típicamente (resultado, error). Los structs agrupan campos (como objetos sin herencia). Go maneja errores devolviendo un valor error, no con excepciones.',
        ejemplo: 'type Persona struct {\n  Nombre string\n  Edad   int\n}\nfunc dividir(a, b int) (int, error) {\n  if b == 0 { return 0, fmt.Errorf("división por cero") }\n  return a / b, nil\n}',
        buenas: ['Comprueba siempre el error devuelto (if err != nil).', 'Structs pequeños y enfocados.'],
        errores: ['Ignorar el error devuelto.', 'Confundir punteros y valores al modificar structs.'],
      },
      exercises: [
        { id: 'go-2-i1', level: 'Intermedio', objective: 'Define un struct Persona con Nombre y Edad, y crea uno.', solution: 'type Persona struct { Nombre string; Edad int }\np := Persona{Nombre: "Ana", Edad: 30}' },
      ],
      project: { title: 'Proyecto · API REST en Go', desc: 'Servidor HTTP con net/http: endpoints que devuelven JSON y manejan errores.' },
    },
    {
      id: 'go-3', title: 'Nivel 3 · Concurrencia',
      subtopics: ['goroutines', 'channels', 'sync'],
      theory: {
        teoria: 'La gran fortaleza de Go es la concurrencia simple: go funcion() lanza una goroutine (hilo ligero). Los channels (chan) comunican goroutines de forma segura. Es ideal para servidores que atienden muchas peticiones.',
        ejemplo: 'ch := make(chan string)\ngo func() { ch <- "listo" }()\nfmt.Println(<-ch) // espera y recibe',
        buenas: ['Comunica compartiendo por channels, no por memoria compartida.', 'Cierra los channels cuando terminas.'],
        errores: ['Deadlock por esperar de un channel sin emisor.', 'Goroutines que nunca terminan (fugas).'],
      },
      exercises: [
        { id: 'go-3-a1', level: 'Avanzado', objective: 'Lanza una goroutine que envíe un texto por un channel y recíbelo.', solution: 'ch := make(chan string)\ngo func() { ch <- "hola" }()\nfmt.Println(<-ch)' },
      ],
    },
  ],
};

// ════════════════════════ RUST ════════════════════════
const RUST: Course = {
  id: 'rust', name: 'Rust', icon: '🦀', color: '#dea584', tagline: 'Rápido y seguro en memoria',
  levels: [
    {
      id: 'rust-1', title: 'Nivel 1 · Fundamentos y Ownership',
      subtopics: ['variables', 'println!', 'ownership'],
      theory: {
        teoria: 'Rust es rápido y seguro en memoria sin recolector de basura. Las variables son inmutables por defecto (usa mut para cambiarlas). El "ownership" (cada valor tiene un dueño) previene errores de memoria en tiempo de compilación.',
        ejemplo: 'fn main() {\n  let nombre = "Cemal";\n  let mut edad = 25;\n  edad += 1;\n  println!("{} tiene {}", nombre, edad);\n}',
        buenas: ['Deja inmutable lo que no cambie.', 'Escucha al compilador: sus errores enseñan.'],
        errores: ['Intentar mutar una variable sin mut.', 'Usar un valor después de moverlo (move).'],
      },
      exercises: [
        { id: 'rust-1-b1', level: 'Básico', objective: 'Imprime "Hola, Renacer" con println!.', solution: 'fn main() { println!("Hola, Renacer"); }' },
        { id: 'rust-1-i1', level: 'Intermedio', objective: 'Función que sume dos i32 y devuelva el resultado.', solution: 'fn suma(a: i32, b: i32) -> i32 { a + b }' },
      ],
    },
    {
      id: 'rust-2', title: 'Nivel 2 · Structs, Enums y Option',
      subtopics: ['struct', 'enum', 'Option<T>', 'match'],
      theory: {
        teoria: 'Los structs agrupan datos; los enums modelan variantes. Rust no tiene null: usa Option<T> (Some(x) o None). match obliga a manejar todos los casos, evitando errores.',
        ejemplo: 'fn dividir(a: i32, b: i32) -> Option<i32> {\n  if b == 0 { None } else { Some(a / b) }\n}\nmatch dividir(10, 2) {\n  Some(r) => println!("{}", r),\n  None => println!("error"),\n}',
        buenas: ['Usa Option/Result en vez de valores "mágicos".', 'match cubre todos los casos.'],
        errores: ['Hacer unwrap() sin comprobar (puede entrar en pánico).', 'Olvidar una variante en el match.'],
      },
      exercises: [
        { id: 'rust-2-a1', level: 'Avanzado', objective: 'Función que devuelva Option<i32>: Some(mitad) si es par, None si es impar.', solution: 'fn mitad(n: i32) -> Option<i32> {\n  if n % 2 == 0 { Some(n / 2) } else { None }\n}' },
      ],
    },
  ],
};

// ════════════════════════ KOTLIN ════════════════════════
const KOTLIN: Course = {
  id: 'kotlin', name: 'Kotlin', icon: '🟣', color: '#7f52ff', tagline: 'Moderno para Android y JVM',
  levels: [
    {
      id: 'kotlin-1', title: 'Nivel 1 · Fundamentos',
      subtopics: ['val/var', 'tipos', 'println', 'string templates'],
      theory: {
        teoria: 'Kotlin es moderno, conciso y corre sobre la JVM (interopera con Java). val es inmutable, var mutable. El tipo se infiere. Plantillas de string con $variable. Es el lenguaje oficial para Android.',
        ejemplo: 'fun main() {\n  val nombre = "Cemal"\n  var edad = 25\n  println("Hola, $nombre ($edad)")\n}',
        buenas: ['Prefiere val sobre var.', 'Aprovecha la inferencia de tipos.'],
        errores: ['Tratar Kotlin como Java verboso (desaprovecha su concisión).', 'Ignorar la null safety.'],
      },
      exercises: [
        { id: 'kotlin-1-b1', level: 'Básico', objective: 'Imprime "Hola, <nombre>" con string template.', solution: 'val nombre = "Ana"\nprintln("Hola, $nombre")' },
        { id: 'kotlin-1-i1', level: 'Intermedio', objective: 'Recorre del 1 al 5 e imprime cada número.', solution: 'for (i in 1..5) println(i)' },
      ],
    },
    {
      id: 'kotlin-2', title: 'Nivel 2 · Funciones y Null Safety',
      subtopics: ['fun', 'null safety', '?', '?:'],
      theory: {
        teoria: 'Funciones con fun; expresiones cortas con =. La gran ventaja de Kotlin: null safety. String? puede ser null; el operador ?. hace llamadas seguras y ?: da un valor por defecto (Elvis).',
        ejemplo: 'fun saludar(nombre: String?): String {\n  return "Hola, ${nombre ?: "amigo"}"\n}\nval largo = nombre?.length ?: 0',
        buenas: ['Marca como nullable (?) solo lo que de verdad puede ser null.', 'Usa ?: para valores por defecto.'],
        errores: ['Usar !! a la ligera (puede lanzar NullPointerException).', 'No aprovechar la null safety.'],
      },
      exercises: [
        { id: 'kotlin-2-i1', level: 'Intermedio', objective: 'Función que reciba un String? y devuelva su longitud o 0 si es null.', solution: 'fun largo(s: String?): Int = s?.length ?: 0' },
      ],
      project: { title: 'Proyecto · App Android básica', desc: 'Pantalla con lista y detalle en Kotlin (Android): adaptador, datos y navegación.' },
    },
    {
      id: 'kotlin-3', title: 'Nivel 3 · Clases y Data Class',
      subtopics: ['class', 'data class', 'POO'],
      theory: {
        teoria: 'Kotlin soporta POO conciso. Una data class genera automáticamente equals(), hashCode(), toString() y copy() — ideal para modelos de datos. Constructor en la propia línea de la clase.',
        ejemplo: 'data class Usuario(val nombre: String, val edad: Int)\nval u = Usuario("Ana", 30)\nprintln(u) // Usuario(nombre=Ana, edad=30)',
        buenas: ['Usa data class para modelos.', 'Propiedades en el constructor primario.'],
        errores: ['Escribir getters/setters a mano (Kotlin los genera).', 'Mutar data classes en vez de copy().'],
      },
      exercises: [
        { id: 'kotlin-3-a1', level: 'Avanzado', objective: 'Crea una data class Producto con nombre y precio, e instancia una.', solution: 'data class Producto(val nombre: String, val precio: Double)\nval p = Producto("Café", 3.5)' },
      ],
    },
  ],
};

// ════════════════════════ TYPESCRIPT ════════════════════════
const TYPESCRIPT: Course = {
  id: 'typescript', name: 'TypeScript', icon: '🔷', color: '#3178c6', tagline: 'JavaScript con tipos (menos bugs)',
  requires: [{ courseId: 'javascript', label: 'JavaScript (al menos 50%)' }],
  levels: [
    {
      id: 'ts-1', title: 'Nivel 1 · Tipos',
      subtopics: ['tipos básicos', 'inferencia', 'arrays', 'union'],
      theory: {
        teoria: 'TypeScript es JavaScript + tipos estáticos: detecta errores antes de ejecutar y se compila a JS. Anota tipos: let edad: number, nombre: string, activo: boolean. Arrays: number[]. Uniones: string | number.',
        ejemplo: 'let edad: number = 25;\nlet nombres: string[] = ["Ana", "Luis"];\nfunction saludar(n: string): string {\n  return `Hola ${n}`;\n}',
        buenas: ['Deja que TS infiera cuando es obvio.', 'Evita any: pierde toda la seguridad.'],
        errores: ['Usar any por todos lados.', 'Ignorar los errores del compilador.'],
      },
      exercises: [
        { id: 'ts-1-b1', level: 'Básico', objective: 'Declara una variable edad tipada como number con valor 30.', solution: 'let edad: number = 30;' },
        { id: 'ts-1-i1', level: 'Intermedio', objective: 'Función que reciba string y devuelva su longitud (number).', solution: 'function largo(s: string): number {\n  return s.length;\n}' },
      ],
    },
    {
      id: 'ts-2', title: 'Nivel 2 · Interfaces y Genéricos',
      subtopics: ['interface', 'type', 'genéricos'],
      theory: {
        teoria: 'Las interfaces (o type) describen la forma de un objeto. Los genéricos <T> hacen el código reutilizable conservando el tipo. Son la base de código robusto y autocompletado.',
        ejemplo: 'interface Usuario {\n  id: number;\n  nombre: string;\n}\nfunction primero<T>(arr: T[]): T {\n  return arr[0];\n}',
        buenas: ['Modela tus datos con interfaces.', 'Usa genéricos para utilidades reutilizables.'],
        errores: ['Duplicar formas de objeto en vez de una interface.', 'Forzar tipos con as sin necesidad.'],
      },
      exercises: [
        { id: 'ts-2-b1', level: 'Básico', objective: 'Define una interface Usuario con id (number) y nombre (string).', solution: 'interface Usuario {\n  id: number;\n  nombre: string;\n}' },
        { id: 'ts-2-a1', level: 'Avanzado', objective: 'Función genérica identidad que conserve el tipo.', solution: 'function identidad<T>(x: T): T {\n  return x;\n}' },
      ],
    },
    {
      id: 'ts-3', title: 'Nivel 3 · Clases y Utility Types',
      subtopics: ['clases tipadas', 'Partial/Pick', 'enums'],
      theory: {
        teoria: 'TS tipa clases (campos public/private). Los utility types transforman tipos: Partial<T> (todo opcional), Pick<T, K> (algunas props), Readonly<T>. Los enums dan conjuntos de valores con nombre.',
        ejemplo: 'enum Rol { Admin, User }\nclass Cuenta {\n  constructor(private saldo: number) {}\n  depositar(m: number) { this.saldo += m; }\n}\ntype UsuarioParcial = Partial<Usuario>;',
        buenas: ['Usa utility types en vez de redefinir tipos.', 'private para encapsular.'],
        errores: ['Reescribir tipos a mano que Partial/Pick resuelven.', 'Exponer campos que deberían ser private.'],
      },
      exercises: [
        { id: 'ts-3-a1', level: 'Avanzado', objective: 'Crea un enum Estado con Activo e Inactivo.', solution: 'enum Estado {\n  Activo,\n  Inactivo,\n}' },
      ],
    },
  ],
};

// ════════════════════════ DOCKER ════════════════════════
const DOCKER: Course = {
  id: 'docker', name: 'Docker', icon: '🐳', color: '#2496ed', tagline: 'Empaqueta y despliega tus apps',
  levels: [
    {
      id: 'docker-1', title: 'Nivel 1 · Conceptos',
      subtopics: ['imágenes', 'contenedores', 'docker run', 'docker ps'],
      theory: {
        teoria: 'Docker empaqueta una app y su entorno en un contenedor: ligero, aislado y portable ("funciona en mi máquina" deja de ser problema). Una imagen es la plantilla; un contenedor es una instancia en ejecución.',
        ejemplo: '# descargar y correr una imagen\ndocker run -d -p 8080:80 nginx\n# ver contenedores\ndocker ps',
        buenas: ['Un contenedor, un proceso/servicio.', 'Usa imágenes oficiales y ligeras (alpine).'],
        errores: ['Confundir imagen (plantilla) con contenedor (instancia).', 'Guardar datos importantes solo dentro del contenedor.'],
      },
      exercises: [
        { id: 'docker-1-b1', level: 'Básico', objective: 'Escribe el comando para correr nginx mapeando el puerto 8080 al 80.', solution: 'docker run -d -p 8080:80 nginx' },
        { id: 'docker-1-i1', level: 'Intermedio', objective: 'Escribe el comando para listar los contenedores en ejecución.', solution: 'docker ps' },
      ],
    },
    {
      id: 'docker-2', title: 'Nivel 2 · Dockerfile y Compose',
      subtopics: ['Dockerfile', 'build', 'docker-compose'],
      theory: {
        teoria: 'Un Dockerfile define cómo construir tu imagen (FROM base, COPY archivos, RUN comandos, CMD/ENTRYPOINT). docker build crea la imagen. docker-compose orquesta varios servicios (app + BD) con un solo archivo YAML.',
        ejemplo: '# Dockerfile\nFROM eclipse-temurin:21-jre\nWORKDIR /app\nCOPY target/app.jar app.jar\nEXPOSE 8080\nENTRYPOINT ["java", "-jar", "app.jar"]',
        buenas: ['Aprovecha el caché ordenando bien las capas.', 'Usa .dockerignore para no copiar basura.'],
        errores: ['Imágenes enormes por no usar multi-stage.', 'Poner secretos dentro de la imagen.'],
      },
      exercises: [
        { id: 'docker-2-i1', level: 'Intermedio', objective: 'Escribe el comando para construir una imagen llamada "miapp" desde el Dockerfile actual.', hint: 'docker build -t', solution: 'docker build -t miapp .' },
        { id: 'docker-2-a1', level: 'Avanzado', objective: 'Escribe un Dockerfile que empaquete y ejecute un jar de Java 21.', solution: 'FROM eclipse-temurin:21-jre\nWORKDIR /app\nCOPY target/app.jar app.jar\nEXPOSE 8080\nENTRYPOINT ["java", "-jar", "app.jar"]' },
      ],
      project: { title: 'Proyecto · App dockerizada', desc: 'Empaqueta tu API (Java/Go/Node) en una imagen y levántala con docker-compose junto a una base de datos.' },
    },
  ],
};

// ════════════════════════ GIT ════════════════════════
const GIT: Course = {
  id: 'git', name: 'Git & GitHub', icon: '🔧', color: '#f05032', tagline: 'Control de versiones y portafolio',
  levels: [
    {
      id: 'git-1', title: 'Nivel 1 · Básico',
      subtopics: ['init', 'add', 'commit', 'status/log'],
      theory: {
        teoria: 'Git guarda el historial de tu código. Flujo básico: editas → git add (preparas) → git commit (guardas una versión con mensaje). git status muestra qué cambió; git log el historial. Es imprescindible para cualquier dev.',
        ejemplo: 'git init\ngit add .\ngit commit -m "primer commit"\ngit status\ngit log --oneline',
        buenas: ['Commits pequeños y con mensajes claros.', 'Usa .gitignore para no versionar basura/secretos.'],
        errores: ['Subir node_modules o claves al repo.', 'Mensajes de commit vacíos o inútiles ("cambios").'],
      },
      exercises: [
        { id: 'git-1-b1', level: 'Básico', objective: 'Escribe los comandos para guardar todos los cambios en un commit con mensaje "inicio".', solution: 'git add .\ngit commit -m "inicio"' },
        { id: 'git-1-i1', level: 'Intermedio', objective: 'Escribe el comando para ver el historial de commits resumido (una línea por commit).', solution: 'git log --oneline' },
      ],
    },
    {
      id: 'git-2', title: 'Nivel 2 · Ramas',
      subtopics: ['branch', 'checkout', 'merge'],
      theory: {
        teoria: 'Las ramas permiten trabajar en una funcionalidad sin tocar main. Creas una rama (git checkout -b feature), trabajas, y la fusionas (git merge). Así colaboras sin romper el código estable.',
        ejemplo: 'git checkout -b login\n# ... trabajas y haces commits ...\ngit checkout main\ngit merge login',
        buenas: ['Una rama por funcionalidad.', 'Mantén main siempre estable.'],
        errores: ['Trabajar todo en main.', 'No resolver bien los conflictos de merge.'],
      },
      exercises: [
        { id: 'git-2-i1', level: 'Intermedio', objective: 'Crea y cámbiate a una rama llamada "perfil".', solution: 'git checkout -b perfil' },
        { id: 'git-2-a1', level: 'Avanzado', objective: 'Fusiona la rama "login" dentro de main.', hint: 'primero cámbiate a main', solution: 'git checkout main\ngit merge login' },
      ],
    },
    {
      id: 'git-3', title: 'Nivel 3 · Remoto y GitHub',
      subtopics: ['remote', 'push/pull', 'README'],
      theory: {
        teoria: 'GitHub aloja tus repos en la nube. Conectas el remoto (git remote add origin), subes con git push y traes cambios con git pull. Un buen README es tu carta de presentación para reclutadores (clave para Vancouver).',
        ejemplo: 'git remote add origin https://github.com/usuario/repo.git\ngit push -u origin main\ngit pull',
        buenas: ['Sube tus proyectos con un README claro.', 'Haz pull antes de push para evitar conflictos.'],
        errores: ['Subir secretos/tokens al repositorio.', 'Forzar push (--force) sin entender las consecuencias.'],
      },
      exercises: [
        { id: 'git-3-i1', level: 'Intermedio', objective: 'Escribe el comando para traer los últimos cambios del repositorio remoto.', solution: 'git pull' },
        { id: 'git-3-a1', level: 'Avanzado', objective: 'Escribe el comando para subir tu rama main al remoto origin por primera vez.', solution: 'git push -u origin main' },
      ],
    },
  ],
};

// ════════════════════════ CIBERSEGURIDAD ════════════════════════
const CIBER: Course = {
  id: 'ciber', name: 'Ciberseguridad', icon: '🛡️', color: '#10b981', tagline: 'Piensa como atacante, defiende como profesional',
  levels: [
    {
      id: 'ciber-1', title: 'Nivel 1 · Fundamentos',
      subtopics: ['Triada CIA', 'Tipos de malware', 'Ingeniería social', 'Phishing', 'Superficie de ataque'],
      theory: {
        teoria: 'La ciberseguridad protege la información sobre tres pilares (la triada CIA): Confidencialidad (solo quien debe la ve), Integridad (no se altera sin permiso) y Disponibilidad (está accesible cuando se necesita). Las amenazas más comunes son el malware (virus, troyanos, ransomware) y la ingeniería social, donde el atacante engaña a una persona —no a una máquina— para que entregue datos o acceso. El phishing (correos/mensajes falsos que imitan a un banco o empresa) es el vector más usado del mundo.',
        ejemplo: '# Señales de un correo de phishing:\n- Remitente raro: soporte@paypa1-seguridad.com (1 en vez de l)\n- Urgencia: "Tu cuenta será cerrada en 24h"\n- Enlace que NO coincide al pasar el cursor\n- Pide contraseña/código por correo (nunca lo hacen)',
        buenas: ['Verifica el dominio real antes de hacer clic.', 'Activa 2FA en todas tus cuentas importantes.', 'Desconfía de la urgencia: es la herramienta favorita del atacante.'],
        errores: ['Reutilizar la misma contraseña en todos lados.', 'Abrir adjuntos de remitentes desconocidos.', 'Creer que "a mí no me va a pasar".'],
      },
      exercises: [
        { id: 'ciber-1-b1', level: 'Básico', objective: 'Escribe qué significa cada letra de la triada CIA de seguridad.', hint: 'Confidencialidad, Integridad, Disponibilidad.', solution: 'C = Confidencialidad (solo personas autorizadas acceden a la info)\nI = Integridad (los datos no se alteran sin autorización)\nA = Availability / Disponibilidad (la info está accesible cuando se necesita)' },
        { id: 'ciber-1-b2', level: 'Básico', objective: 'Lista 3 señales que delatan un correo de phishing.', hint: 'Dominio, urgencia, enlaces.', solution: '1) Dominio falso parecido al real (paypa1.com)\n2) Sensación de urgencia o amenaza\n3) Enlace cuyo destino real no coincide con el texto\n(+ pide credenciales por correo)' },
        { id: 'ciber-1-i1', level: 'Intermedio', objective: 'Explica la diferencia entre un virus, un troyano y un ransomware.', hint: 'Cómo se propagan / qué hacen.', solution: 'Virus: se adjunta a otro archivo y se replica al ejecutarse.\nTroyano: se disfraza de software legítimo para que lo instales.\nRansomware: cifra tus archivos y exige rescate para devolverlos.' },
      ],
    },
    {
      id: 'ciber-2', title: 'Nivel 2 · Vulnerabilidades Web (OWASP)',
      subtopics: ['SQL injection', 'XSS', 'CSRF', 'OWASP Top 10', 'Validación de entrada'],
      theory: {
        teoria: 'La mayoría de los ataques web nacen de confiar en datos del usuario. SQL injection ocurre cuando concatenas input directo en una consulta y el atacante inyecta SQL malicioso (\' OR 1=1 --). XSS (Cross-Site Scripting) inyecta JavaScript en una página para robar sesiones de otros usuarios. CSRF engaña al navegador para que envíe peticiones autenticadas sin que el usuario quiera. La regla de oro: nunca confíes en la entrada del usuario; valídala y escápala siempre.',
        ejemplo: '// VULNERABLE (NUNCA hagas esto):\nconst q = "SELECT * FROM users WHERE name = \'" + input + "\'";\n\n// SEGURO — consulta preparada (parametrizada):\ndb.query("SELECT * FROM users WHERE name = ?", [input]);',
        buenas: ['Usa consultas preparadas/parametrizadas siempre.', 'Escapa la salida en HTML para frenar XSS.', 'Estudia el OWASP Top 10: es el mapa de los riesgos reales.'],
        errores: ['Concatenar input del usuario en SQL o HTML.', 'Confiar en validación solo del lado del cliente.', 'Mostrar mensajes de error técnicos al usuario final.'],
      },
      exercises: [
        { id: 'ciber-2-i1', level: 'Intermedio', objective: 'Reescribe esta consulta vulnerable a SQLi usando una consulta preparada: "SELECT * FROM users WHERE email = \'" + email + "\'".', hint: 'Usa placeholders ? y un arreglo de parámetros.', solution: 'db.query("SELECT * FROM users WHERE email = ?", [email]);' },
        { id: 'ciber-2-i2', level: 'Intermedio', objective: 'Explica qué hace el payload \' OR 1=1 -- en un login vulnerable.', hint: 'Hace que la condición siempre sea verdadera.', solution: 'Cierra la comilla, agrega OR 1=1 (siempre verdadero) y comenta el resto con --. La consulta devuelve todos los usuarios y permite entrar sin contraseña válida.' },
        { id: 'ciber-2-a1', level: 'Avanzado', objective: 'Da dos defensas concretas contra XSS reflejado en una web.', hint: 'Escapar salida + cabeceras.', solution: '1) Escapar/sanear toda salida que provenga del usuario antes de insertarla en el HTML.\n2) Aplicar una Content-Security-Policy (CSP) que bloquee scripts inline no autorizados.' },
      ],
    },
    {
      id: 'ciber-3', title: 'Nivel 3 · Defensa y Criptografía',
      subtopics: ['Hashing de contraseñas', 'TLS/HTTPS', 'Mínimo privilegio', 'Autenticación 2FA', 'Gestión de secretos'],
      theory: {
        teoria: 'Defender bien es aplicar capas. Las contraseñas jamás se guardan en texto plano: se hashean con algoritmos lentos y con salt (bcrypt, argon2) para que sean inútiles si roban la base de datos. HTTPS cifra el tráfico con TLS para evitar que un intermediario (MITM) lo lea. El principio de mínimo privilegio dice que cada usuario/servicio debe tener solo los permisos estrictamente necesarios. Y los secretos (claves, tokens) van en variables de entorno o un gestor de secretos, nunca en el código ni en Git.',
        ejemplo: '// Node.js — hashear y verificar contraseña\nimport bcrypt from "bcrypt";\nconst hash = await bcrypt.hash(password, 12); // guardar el hash\nconst ok = await bcrypt.compare(intento, hash); // login',
        buenas: ['Hashea con bcrypt/argon2 + salt; nunca MD5/SHA1 para contraseñas.', 'Fuerza HTTPS y 2FA en todo lo sensible.', 'Rota y guarda los secretos fuera del repositorio.'],
        errores: ['Guardar contraseñas o tokens en el código o en Git.', 'Dar permisos de administrador "por comodidad".', 'Implementar tu propia criptografía en vez de usar librerías probadas.'],
      },
      exercises: [
        { id: 'ciber-3-i1', level: 'Intermedio', objective: 'Explica por qué NO se debe guardar una contraseña como SHA1 sin más y qué usar en su lugar.', hint: 'Velocidad del hash + salt.', solution: 'SHA1 es rápido y sin salt: permite ataques de fuerza bruta y rainbow tables. Usa bcrypt o argon2, que son lentos a propósito e incluyen salt, haciendo inviable crackear millones de hashes.' },
        { id: 'ciber-3-a1', level: 'Avanzado', objective: 'Tu API expone su API_KEY en el código subido a GitHub. Describe los 3 pasos de respuesta.', hint: 'Revocar, rotar, mover.', solution: '1) Revocar de inmediato la clave expuesta.\n2) Generar una clave nueva.\n3) Moverla a una variable de entorno / gestor de secretos y limpiar el historial de Git (la clave vieja sigue en el historial).' },
      ],
      project: { title: 'Proyecto · Mini auditoría de seguridad', desc: 'Toma una de tus apps del curso y haz un checklist: ¿hay SQL parametrizado? ¿contraseñas hasheadas? ¿secretos fuera de Git? ¿HTTPS? Documenta hallazgos y arréglalos.' },
    },
  ],
};

// ════════════════════════ REDES ════════════════════════
const REDES: Course = {
  id: 'redes', name: 'Redes', icon: '🌐', color: '#0ea5e9', tagline: 'Cómo viaja la información por internet',
  levels: [
    {
      id: 'redes-1', title: 'Nivel 1 · Fundamentos',
      subtopics: ['Modelo TCP/IP', 'Modelo OSI', 'Direcciones IP', 'Puertos', 'MAC'],
      theory: {
        teoria: 'Una red conecta dispositivos para que intercambien datos. Internet se organiza en capas: el modelo TCP/IP tiene 4 (Aplicación, Transporte, Internet, Enlace); el OSI es la versión académica de 7 capas. Cada dispositivo tiene una dirección IP (ej. 192.168.1.10) que lo identifica en la red, y los servicios escuchan en puertos (HTTP=80, HTTPS=443, SSH=22). La dirección MAC identifica físicamente la tarjeta de red.',
        ejemplo: '# Ver tu IP y configuración de red\nipconfig        # Windows\nifconfig / ip a # Linux\n\n# Una IP:puerto identifica un servicio:\n93.184.216.34:443  -> servidor web por HTTPS',
        buenas: ['Aprende los puertos comunes de memoria (80, 443, 22, 53).', 'Distingue IP (lógica, cambia) de MAC (física, fija).'],
        errores: ['Confundir dirección IP con dirección MAC.', 'Creer que un puerto es un dispositivo (es un servicio).'],
      },
      exercises: [
        { id: 'redes-1-b1', level: 'Básico', objective: '¿Cuántas capas tiene el modelo TCP/IP y cómo se llaman?', hint: 'Son 4.', solution: '4 capas: Aplicación, Transporte, Internet y Enlace (acceso a red).' },
        { id: 'redes-1-b2', level: 'Básico', objective: 'Indica el puerto por defecto de HTTP, HTTPS, SSH y DNS.', hint: '80 / 443 / 22 / 53.', solution: 'HTTP = 80, HTTPS = 443, SSH = 22, DNS = 53.' },
        { id: 'redes-1-i1', level: 'Intermedio', objective: 'Explica la diferencia entre una dirección IP y una dirección MAC.', hint: 'Lógica vs física.', solution: 'IP: dirección lógica de capa de red, puede cambiar según la red. MAC: dirección física grabada en la tarjeta de red, única y fija por dispositivo.' },
      ],
    },
    {
      id: 'redes-2', title: 'Nivel 2 · Protocolos',
      subtopics: ['TCP vs UDP', 'DNS', 'HTTP/HTTPS', 'DHCP', 'Handshake'],
      theory: {
        teoria: 'Los protocolos son las reglas que permiten la comunicación. TCP es fiable y orientado a conexión (hace un "handshake" y reordena/reenvía paquetes perdidos): ideal para web, correo, descargas. UDP es rápido y sin garantías: ideal para video/juegos/llamadas. El DNS traduce nombres (google.com) a direcciones IP. HTTP/HTTPS transportan la web; DHCP asigna IPs automáticamente a los dispositivos al conectarse.',
        ejemplo: '# Resolver un dominio a IP\nnslookup google.com\n\n# Ver la conversación HTTP\ncurl -I https://example.com   # muestra cabeceras de respuesta',
        buenas: ['Usa TCP cuando no puedes perder datos; UDP cuando prima la velocidad.', 'Entiende el handshake TCP (SYN, SYN-ACK, ACK).'],
        errores: ['Pensar que UDP garantiza la entrega (no lo hace).', 'Olvidar que sin DNS tendrías que memorizar IPs.'],
      },
      exercises: [
        { id: 'redes-2-b1', level: 'Básico', objective: 'Da un caso de uso ideal para TCP y otro para UDP.', hint: 'Fiabilidad vs velocidad.', solution: 'TCP: descargar un archivo o cargar una web (no puedes perder bytes). UDP: una videollamada o un juego online (prefieres velocidad a reenviar paquetes viejos).' },
        { id: 'redes-2-i1', level: 'Intermedio', objective: 'Describe los 3 pasos del handshake de TCP.', hint: 'SYN…', solution: '1) Cliente envía SYN.\n2) Servidor responde SYN-ACK.\n3) Cliente responde ACK. Conexión establecida.' },
        { id: 'redes-2-i2', level: 'Intermedio', objective: '¿Qué hace el DNS y qué pasaría sin él?', hint: 'Traduce nombres.', solution: 'El DNS traduce nombres de dominio (ej. github.com) a direcciones IP. Sin él tendrías que escribir la IP numérica de cada sitio de memoria.' },
      ],
    },
    {
      id: 'redes-3', title: 'Nivel 3 · Subredes y Herramientas',
      subtopics: ['Máscara de subred', 'CIDR', 'Router vs switch', 'ping/traceroute', 'NAT', 'Firewall'],
      theory: {
        teoria: 'Una máscara de subred (o notación CIDR /24) separa la parte de red de la parte de host en una IP, definiendo cuántos dispositivos caben. El router conecta redes distintas y enruta paquetes (tu casa → internet); el switch conecta dispositivos dentro de la misma red local. NAT permite que muchos dispositivos compartan una IP pública. Herramientas clave: ping comprueba si un host responde, traceroute muestra el camino de los paquetes, y un firewall filtra qué tráfico entra/sale.',
        ejemplo: '# Diagnóstico de red\nping google.com           # ¿hay conectividad?\ntracert google.com        # ruta (Windows)\ntraceroute google.com     # ruta (Linux)\n\n# 192.168.1.0/24 -> 254 hosts utilizables',
        buenas: ['Usa ping/traceroute para aislar dónde falla la conexión.', 'Entiende CIDR: /24 = 256 direcciones (254 usables).'],
        errores: ['Confundir router (une redes) con switch (une dispositivos).', 'Abrir todos los puertos del firewall "para que funcione".'],
      },
      exercises: [
        { id: 'redes-3-b1', level: 'Básico', objective: 'Escribe el comando para comprobar si tienes conectividad con google.com.', hint: 'ping.', solution: 'ping google.com' },
        { id: 'redes-3-i1', level: 'Intermedio', objective: 'Explica la diferencia entre un router y un switch.', hint: 'Redes vs dispositivos.', solution: 'Router: conecta redes diferentes y enruta paquetes entre ellas (LAN ↔ internet). Switch: conecta dispositivos dentro de la misma red local y reenvía tramas por MAC.' },
        { id: 'redes-3-a1', level: 'Avanzado', objective: '¿Cuántas IPs utilizables tiene una subred /24 y por qué no son 256?', hint: 'Red y broadcast.', solution: '254 utilizables. De las 256 direcciones, la primera es la de red y la última la de broadcast, que no se asignan a hosts.' },
      ],
      project: { title: 'Proyecto · Mapa de tu red', desc: 'Documenta tu red local: tu IP, la del router (gateway), el DNS que usas y un traceroute a un sitio. Explica cada salto.' },
    },
  ],
};

// ════════════════════════ DSA (Algoritmos) ════════════════════════
const DSA: Course = {
  id: 'dsa', name: 'Algoritmos y Estructuras', icon: '🧮', color: '#8b5cf6', tagline: 'La llave para pasar entrevistas técnicas (estilo LeetCode)',
  levels: [
    {
      id: 'dsa-1', title: 'Nivel 1 · Complejidad y Arrays',
      subtopics: ['Notación Big-O', 'Arrays', 'Búsqueda lineal', 'Búsqueda binaria', 'Two pointers'],
      theory: {
        teoria: 'Antes de optimizar hay que medir. La notación Big-O describe cómo crece el costo de un algoritmo según el tamaño de la entrada (n): O(1) constante, O(log n) logarítmica, O(n) lineal, O(n log n), O(n²) cuadrática. Un arreglo permite acceso por índice en O(1) pero buscar un valor cuesta O(n). Si está ordenado, la búsqueda binaria baja a O(log n) partiendo el rango a la mitad. En entrevistas, casi siempre te piden mejorar la complejidad.',
        ejemplo: '// Búsqueda binaria — O(log n)\nfunction binarySearch(arr, target) {\n  let lo = 0, hi = arr.length - 1;\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1;\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n}',
        buenas: ['Siempre indica la complejidad de tiempo y espacio de tu solución.', 'Pregunta restricciones (tamaño de n) antes de codear.', 'Usa la técnica two pointers para problemas de arreglos ordenados.'],
        errores: ['Anidar bucles sin necesidad → O(n²) evitable.', 'Hacer búsqueda binaria sobre datos NO ordenados.', 'Ignorar el costo de memoria (espacio).'],
      },
      exercises: [
        { id: 'dsa-1-b1', level: 'Básico', objective: 'Indica la complejidad Big-O de un bucle que recorre un arreglo de n elementos una sola vez.', hint: 'Una pasada.', solution: 'O(n) — lineal: el trabajo crece proporcional al tamaño de la entrada.' },
        { id: 'dsa-1-i1', level: 'Intermedio', objective: 'Dado un arreglo ordenado, escribe la idea de la búsqueda binaria para encontrar un valor.', hint: 'Partir a la mitad.', solution: 'Comparas con el elemento del medio: si es igual, lo encontraste; si el objetivo es mayor, buscas en la mitad derecha; si es menor, en la izquierda. Repites hasta que el rango se vacíe. Costo O(log n).' },
        { id: 'dsa-1-a1', level: 'Avanzado', objective: 'Con la técnica "two pointers", ¿cómo verificas si un arreglo ordenado tiene dos números que sumen X?', hint: 'Un puntero a cada extremo.', solution: 'Pon un puntero al inicio y otro al final. Si la suma > X, mueves el derecho a la izquierda; si < X, mueves el izquierdo a la derecha; si == X, lo encontraste. Costo O(n) sin estructuras extra.' },
        { id: 'dsa-1-b2', level: 'Básico', objective: 'Ordena de menor a mayor estas complejidades: O(n²), O(1), O(n), O(log n), O(n log n).', hint: 'Constante es la mejor.', solution: 'O(1) < O(log n) < O(n) < O(n log n) < O(n²)' },
        { id: 'dsa-1-i2', level: 'Intermedio', objective: 'Invierte un arreglo in-place (sin crear otro) usando two pointers.', hint: 'Intercambia extremos.', solution: 'let i = 0, j = arr.length - 1;\nwhile (i < j) {\n  [arr[i], arr[j]] = [arr[j], arr[i]];\n  i++; j--;\n}' },
        { id: 'dsa-1-e1', level: 'Experto', objective: 'Encuentra el elemento mayoritario (aparece > n/2 veces) en O(n) y O(1) memoria.', hint: 'Algoritmo de Boyer-Moore.', solution: '// Boyer-Moore voting\nlet cand = null, count = 0;\nfor (const x of nums) {\n  if (count === 0) cand = x;\n  count += (x === cand) ? 1 : -1;\n}\nreturn cand;' },
      ],
    },
    {
      id: 'dsa-2', title: 'Nivel 2 · Pilas, Colas y Listas',
      subtopics: ['Stack (LIFO)', 'Queue (FIFO)', 'Listas enlazadas', 'Hash maps'],
      theory: {
        teoria: 'Las estructuras lineales resuelven familias enteras de problemas. La pila (stack) es LIFO: el último que entra es el primero que sale (deshacer, validar paréntesis, recursión). La cola (queue) es FIFO: primero en entrar, primero en salir (BFS, tareas). Una lista enlazada conecta nodos con punteros: insertar/borrar al inicio es O(1), pero buscar es O(n). El hash map (objeto/Map) da acceso promedio O(1) por clave: tu mejor amigo para contar y memorizar.',
        ejemplo: '// Validar paréntesis con una pila\nfunction valido(s) {\n  const stack = [], par = { ")":"(", "]":"[", "}":"{" };\n  for (const c of s) {\n    if (c in par) { if (stack.pop() !== par[c]) return false; }\n    else stack.push(c);\n  }\n  return stack.length === 0;\n}',
        buenas: ['Usa un hash map para reducir O(n²) a O(n) (problema two-sum).', 'Pila para problemas de "el más reciente" o anidamiento.'],
        errores: ['Confundir LIFO (pila) con FIFO (cola).', 'Recorrer una lista enlazada por índice como si fuera un arreglo.'],
      },
      exercises: [
        { id: 'dsa-2-b1', level: 'Básico', objective: '¿Qué estructura usarías para implementar la función "deshacer" (undo) de un editor y por qué?', hint: 'El último cambio se deshace primero.', solution: 'Una pila (stack), porque es LIFO: el último cambio realizado es el primero que se deshace.' },
        { id: 'dsa-2-i1', level: 'Intermedio', objective: 'Resuelve "two sum" en O(n): dado un arreglo y un target, devuelve los índices de dos números que sumen target.', hint: 'Guarda lo visto en un Map.', solution: 'const map = new Map();\nfor (let i = 0; i < nums.length; i++) {\n  const need = target - nums[i];\n  if (map.has(need)) return [map.get(need), i];\n  map.set(nums[i], i);\n}' },
        { id: 'dsa-2-a1', level: 'Avanzado', objective: 'Explica cómo validar si una cadena de paréntesis "([{}])" está balanceada usando una pila.', hint: 'Apila aperturas, desapila cierres.', solution: 'Recorres la cadena: si es apertura la apilas; si es cierre, sacas el tope y verificas que sea su pareja. Al final la pila debe quedar vacía. Si no coincide o queda algo, no está balanceada.' },
        { id: 'dsa-2-i2', level: 'Intermedio', objective: 'Cuenta cuántas veces aparece cada elemento de un arreglo usando un Map (frecuencias).', hint: 'getOrDefault / has.', solution: 'const freq = new Map();\nfor (const x of arr) freq.set(x, (freq.get(x) || 0) + 1);\nreturn freq;' },
        { id: 'dsa-2-a2', level: 'Avanzado', objective: 'Invierte una lista enlazada simple. Da la idea con punteros prev/curr/next.', hint: 'Tres punteros.', solution: 'let prev = null, curr = head;\nwhile (curr) {\n  const next = curr.next;\n  curr.next = prev;\n  prev = curr;\n  curr = next;\n}\nreturn prev; // nueva cabeza' },
        { id: 'dsa-2-e1', level: 'Experto', objective: 'Encuentra el primer carácter sin repetir en una cadena en O(n).', hint: 'Mapa de conteos en 2 pasadas.', solution: 'const cnt = new Map();\nfor (const c of s) cnt.set(c, (cnt.get(c)||0)+1);\nfor (let i=0;i<s.length;i++) if (cnt.get(s[i])===1) return i;\nreturn -1;' },
      ],
    },
    {
      id: 'dsa-3', title: 'Nivel 3 · Árboles, Grafos y Recursión',
      subtopics: ['Recursión', 'Árboles binarios', 'BFS', 'DFS', 'Grafos', 'Backtracking'],
      theory: {
        teoria: 'La recursión resuelve un problema en términos de versiones más pequeñas de sí mismo; siempre necesita un caso base que la detenga. Un árbol binario tiene nodos con hasta dos hijos; se recorre en orden (izq-raíz-der), preorden o postorden. Un grafo modela relaciones (redes, mapas). Para recorrerlos: BFS usa una cola y explora por niveles (camino más corto sin pesos); DFS usa pila/recursión y va a fondo. El backtracking prueba caminos y retrocede (sudoku, permutaciones).',
        ejemplo: '// Recorrido in-order de un árbol binario\nfunction inOrder(node, out = []) {\n  if (!node) return out;       // caso base\n  inOrder(node.left, out);\n  out.push(node.value);\n  inOrder(node.right, out);\n  return out;\n}',
        buenas: ['Dibuja el árbol/grafo antes de codear.', 'BFS = cola, camino más corto sin pesos; DFS = recursión, explorar todo.', 'En recursión, define primero el caso base.'],
        errores: ['Olvidar el caso base → desbordamiento de pila.', 'No marcar nodos visitados en un grafo → bucles infinitos.'],
      },
      exercises: [
        { id: 'dsa-3-b1', level: 'Básico', objective: 'Escribe una función recursiva que calcule el factorial de n.', hint: 'n! = n * (n-1)!, base: 0! = 1.', solution: 'function factorial(n) {\n  if (n <= 1) return 1; // caso base\n  return n * factorial(n - 1);\n}' },
        { id: 'dsa-3-i1', level: 'Intermedio', objective: '¿Qué estructura de datos usa BFS y qué garantiza encontrar en un grafo sin pesos?', hint: 'Cola + niveles.', solution: 'BFS usa una cola (FIFO) y explora por niveles, por lo que garantiza encontrar el camino más corto (en número de aristas) en un grafo sin pesos.' },
        { id: 'dsa-3-a1', level: 'Avanzado', objective: 'Explica cómo evitar visitar dos veces el mismo nodo al recorrer un grafo.', hint: 'Conjunto de visitados.', solution: 'Mantienes un Set de nodos "visitados". Antes de procesar un nodo verificas si ya está en el set; si lo está, lo saltas; si no, lo agregas y continúas. Esto evita ciclos infinitos.' },
        { id: 'dsa-3-i2', level: 'Intermedio', objective: 'Calcula el n-ésimo Fibonacci con memoización (evitando el O(2ⁿ)).', hint: 'Guarda resultados en un cache.', solution: 'function fib(n, memo = {}) {\n  if (n <= 1) return n;\n  if (memo[n]) return memo[n];\n  return memo[n] = fib(n-1, memo) + fib(n-2, memo);\n}' },
        { id: 'dsa-3-e1', level: 'Experto', objective: 'Calcula la profundidad (altura) máxima de un árbol binario con recursión.', hint: '1 + max(izq, der).', solution: 'function maxDepth(node) {\n  if (!node) return 0;\n  return 1 + Math.max(maxDepth(node.left), maxDepth(node.right));\n}' },
      ],
      project: { title: 'Proyecto · 10 retos LeetCode', desc: 'Resuelve 10 problemas estilo entrevista (2 sum, paréntesis válidos, invertir lista enlazada, BFS en matriz, fibonacci con memo…). Anota la complejidad de cada uno.' },
    },
  ],
};

// ════════════════════════ SYSTEM DESIGN ════════════════════════
const SYSDESIGN: Course = {
  id: 'sysdesign', name: 'System Design', icon: '🏗️', color: '#f97316', tagline: 'Diseña sistemas que escalan (entrevistas mid/senior)',
  requires: [{ courseId: 'redes', label: 'Redes ≥ 50%' }],
  levels: [
    {
      id: 'sys-1', title: 'Nivel 1 · Fundamentos',
      subtopics: ['Escalado vertical vs horizontal', 'Latencia vs throughput', 'Disponibilidad', 'SPOF', 'Cliente-servidor'],
      theory: {
        teoria: 'Diseñar sistemas es tomar decisiones de compromiso (trade-offs), no buscar "la respuesta correcta". Escalar vertical = una máquina más potente (límite y caro); escalar horizontal = más máquinas (lo que usan las grandes). Dos métricas clave: latencia (cuánto tarda una petición) y throughput (cuántas atiende por segundo). La disponibilidad se mide en "nueves" (99.9%). Un SPOF (single point of failure) es un componente que tumba todo si cae: hay que eliminarlos con redundancia.',
        ejemplo: 'Petición de usuario\n   → Load Balancer\n      → Servidor App (x3, escalado horizontal)\n         → Base de datos (con réplica)\n            → Caché (Redis) para lecturas frecuentes',
        buenas: ['Empieza simple y escala cuando los números lo exijan.', 'Pregunta requisitos: usuarios, lecturas/escrituras por segundo, tamaño de datos.', 'Identifica y elimina los SPOF con redundancia.'],
        errores: ['Sobre-ingeniería: microservicios para una app de 10 usuarios.', 'Confundir latencia (tiempo) con throughput (volumen).'],
      },
      exercises: [
        { id: 'sys-1-b1', level: 'Básico', objective: 'Explica la diferencia entre escalado vertical y horizontal.', hint: 'Más grande vs más máquinas.', solution: 'Vertical: dar más recursos (CPU/RAM) a una sola máquina; simple pero tiene tope y es caro. Horizontal: agregar más máquinas que reparten la carga; más complejo pero escala casi sin límite.' },
        { id: 'sys-1-i1', level: 'Intermedio', objective: 'Da un ejemplo de SPOF y cómo lo eliminarías.', hint: 'Redundancia.', solution: 'Una única base de datos es un SPOF: si cae, todo se cae. Se elimina con redundancia: réplicas (failover automático), múltiples servidores tras un balanceador y despliegue en varias zonas.' },
        { id: 'sys-1-a1', level: 'Avanzado', objective: '¿Qué preguntas harías antes de diseñar un acortador de URLs?', hint: 'Estima la escala.', solution: '¿Cuántas URLs por día (escrituras)? ¿Cuántas lecturas/redirecciones? ¿Cuánto deben durar? ¿Largo del código? ¿Necesita analíticas? Con eso estimas almacenamiento, QPS y si necesitas caché.' },
      ],
    },
    {
      id: 'sys-2', title: 'Nivel 2 · Caché, BD y Balanceo',
      subtopics: ['Load balancing', 'Caché (Redis)', 'Réplicas de lectura', 'Sharding', 'CDN', 'SQL vs NoSQL'],
      theory: {
        teoria: 'Para servir a muchos usuarios combinas piezas. Un load balancer reparte las peticiones entre varios servidores. Una caché (Redis/Memcached) guarda en memoria los datos más pedidos y evita golpear la BD (lecturas en microsegundos). Para escalar la base de datos: réplicas de lectura (varias copias para leer) y sharding (partir los datos por clave entre varias BD). Una CDN sirve contenido estático cerca del usuario. SQL para datos relacionales/consistencia; NoSQL para escala y flexibilidad.',
        ejemplo: 'Lectura típica con caché (cache-aside):\n1. ¿Está en Redis? → sí: devolver (rápido)\n2. No: leer de la BD\n3. Guardar en Redis con TTL\n4. Devolver al usuario',
        buenas: ['Cachea lo que se lee mucho y cambia poco.', 'Usa réplicas de lectura cuando dominan las lecturas.', 'Elige SQL vs NoSQL según el patrón de acceso, no por moda.'],
        errores: ['Cachear datos que cambian constantemente (datos obsoletos).', 'No definir TTL ni invalidación de caché.', 'Shardear demasiado pronto (complejidad enorme).'],
      },
      exercises: [
        { id: 'sys-2-b1', level: 'Básico', objective: '¿Para qué sirve una caché y cuándo conviene usarla?', hint: 'Lecturas frecuentes.', solution: 'Guarda en memoria datos solicitados con frecuencia para responder más rápido y reducir carga en la BD. Conviene cuando hay muchas lecturas de datos que cambian poco.' },
        { id: 'sys-2-i1', level: 'Intermedio', objective: 'Describe el patrón cache-aside para una lectura.', hint: 'Mirar caché primero.', solution: '1) Buscar en la caché. 2) Si está (hit), devolver. 3) Si no (miss), leer de la BD, 4) guardar el resultado en la caché con un TTL, 5) devolver. Las siguientes lecturas serán hits.' },
        { id: 'sys-2-a1', level: 'Avanzado', objective: '¿Cuándo elegirías sharding y qué problema introduce?', hint: 'Partir los datos.', solution: 'Cuando una sola BD no aguanta el volumen de datos/escrituras. Partes los datos por una clave (ej. user_id) entre varias BD. Problema: las consultas que cruzan shards y las transacciones se vuelven complejas, y rebalancear es difícil.' },
      ],
    },
    {
      id: 'sys-3', title: 'Nivel 3 · Colas, Microservicios y CAP',
      subtopics: ['Colas de mensajes', 'Async', 'Microservicios', 'Teorema CAP', 'Idempotencia', 'API Gateway'],
      theory: {
        teoria: 'Para desacoplar y aguantar picos se usa procesamiento asíncrono con colas de mensajes (Kafka, RabbitMQ, SQS): el productor encola y el consumidor procesa a su ritmo. Los microservicios dividen la app en servicios pequeños e independientes (despliegue y escala por separado) a costa de complejidad de red. El teorema CAP dice que ante una partición de red solo puedes garantizar dos de Consistencia, Disponibilidad y tolerancia a Partición — en la práctica eliges entre consistencia y disponibilidad. La idempotencia (que repetir una operación no cambie el resultado) es clave en sistemas distribuidos.',
        ejemplo: 'Subida de video:\nUsuario → API (responde "procesando")\n        → Cola (mensaje "transcodificar video 123")\n        → Workers (procesan en segundo plano)\n        → Notifican al terminar',
        buenas: ['Usa colas para tareas lentas (emails, video, reportes).', 'Diseña operaciones idempotentes (reintentos seguros).', 'No vayas a microservicios sin necesidad real (un monolito modular suele bastar).'],
        errores: ['Acoplar servicios con llamadas síncronas en cadena.', 'Ignorar qué pasa si un mensaje se procesa dos veces.', 'Asumir consistencia fuerte en un sistema distribuido.'],
      },
      exercises: [
        { id: 'sys-3-b1', level: 'Básico', objective: 'Da un caso donde usarías una cola de mensajes en vez de procesar en la misma petición.', hint: 'Tarea lenta.', solution: 'Procesar/transcodificar un video subido, enviar miles de correos o generar un reporte pesado: encolas la tarea y respondes al usuario al instante, mientras un worker la procesa en segundo plano.' },
        { id: 'sys-3-i1', level: 'Intermedio', objective: 'Explica con tus palabras el teorema CAP.', hint: 'Elige 2 de 3 ante una partición.', solution: 'Ante una partición de red (P) en un sistema distribuido, debes elegir entre Consistencia (todos ven el mismo dato) y Disponibilidad (todos reciben respuesta). No puedes garantizar ambas a la vez durante la partición.' },
        { id: 'sys-3-a1', level: 'Avanzado', objective: '¿Por qué la idempotencia importa al procesar pagos con reintentos?', hint: 'No cobrar dos veces.', solution: 'En la red un mensaje puede entregarse o reintentarse más de una vez. Si la operación de pago es idempotente (usando un id de transacción único), procesarla dos veces no cobra dos veces: el segundo intento detecta que ya se hizo y no duplica el cargo.' },
      ],
      project: { title: 'Proyecto · Diseña Twitter (a alto nivel)', desc: 'Dibuja el diseño de un feed tipo Twitter: APIs, base de datos, caché, balanceador, cómo generas el timeline (fan-out) y dónde pondrías colas. Justifica cada decisión.' },
    },
  ],
};

// ════════════════════════ LINUX & TERMINAL ════════════════════════
const LINUX: Course = {
  id: 'linux', name: 'Linux & Terminal', icon: '🐧', color: '#facc15', tagline: 'La terminal que todo dev backend domina',
  levels: [
    {
      id: 'linux-1', title: 'Nivel 1 · Navegación y Archivos',
      subtopics: ['ls, cd, pwd', 'mkdir, touch', 'cp, mv, rm', 'cat, less', 'rutas absolutas y relativas'],
      theory: {
        teoria: 'La terminal es más rápida y potente que la interfaz gráfica para desarrollar. Comandos esenciales: pwd (dónde estoy), ls (listar), cd (cambiar de carpeta), mkdir (crear carpeta), touch (crear archivo), cp (copiar), mv (mover/renombrar), rm (borrar), cat/less (ver contenido). Las rutas pueden ser absolutas (/home/user/app) o relativas (./carpeta, .. sube un nivel).',
        ejemplo: 'pwd                 # ¿dónde estoy?\nls -la              # listar todo, con detalles\nmkdir proyecto && cd proyecto\ntouch app.js\nmv app.js index.js  # renombrar',
        buenas: ['ls -la muestra archivos ocultos y permisos.', 'Usa Tab para autocompletar nombres.', 'rm -rf borra sin preguntar: úsalo con MUCHO cuidado.'],
        errores: ['Ejecutar rm -rf en la carpeta equivocada.', 'Confundir ruta relativa (./) con absoluta (/).'],
      },
      exercises: [
        { id: 'linux-1-b1', level: 'Básico', objective: 'Escribe los comandos para crear una carpeta "web", entrar en ella y crear un archivo index.html.', hint: 'mkdir, cd, touch.', solution: 'mkdir web\ncd web\ntouch index.html' },
        { id: 'linux-1-b2', level: 'Básico', objective: '¿Qué comando lista los archivos incluyendo los ocultos y con detalles?', hint: 'flags -l y -a.', solution: 'ls -la  (o ls -al)' },
        { id: 'linux-1-i1', level: 'Intermedio', objective: '¿Qué hace "cd .." y en qué se diferencia de "cd ./carpeta"?', hint: 'Subir vs entrar.', solution: '"cd .." sube un nivel al directorio padre. "cd ./carpeta" entra a una subcarpeta del directorio actual (ruta relativa).' },
      ],
    },
    {
      id: 'linux-2', title: 'Nivel 2 · Permisos y Procesos',
      subtopics: ['chmod / chown', 'usuarios y grupos', 'sudo', 'ps, top, kill', 'df, du'],
      theory: {
        teoria: 'Cada archivo tiene permisos de lectura (r=4), escritura (w=2) y ejecución (x=1) para dueño, grupo y otros. chmod cambia permisos (chmod 755 = dueño rwx, grupo y otros r-x); chown cambia el propietario. sudo ejecuta como administrador (root). Para procesos: ps y top los listan, kill los termina por su PID. df muestra espacio en disco y du el tamaño de carpetas.',
        ejemplo: 'chmod +x script.sh   # hacerlo ejecutable\nchmod 644 datos.txt  # dueño rw, resto r\nps aux | grep node   # buscar procesos node\nkill -9 1234         # forzar fin del proceso 1234',
        buenas: ['Da solo los permisos necesarios (mínimo privilegio).', 'Evita usar sudo si no es imprescindible.'],
        errores: ['chmod 777 a todo "para que funcione" (riesgo de seguridad).', 'Matar procesos del sistema sin saber qué hacen.'],
      },
      exercises: [
        { id: 'linux-2-b1', level: 'Básico', objective: 'Escribe el comando para hacer ejecutable un archivo deploy.sh.', hint: 'chmod +x.', solution: 'chmod +x deploy.sh' },
        { id: 'linux-2-i1', level: 'Intermedio', objective: '¿Qué permisos otorga chmod 755 a dueño, grupo y otros?', hint: '7=rwx, 5=r-x.', solution: 'Dueño: 7 = rwx (leer, escribir, ejecutar). Grupo: 5 = r-x (leer, ejecutar). Otros: 5 = r-x. Típico para scripts y carpetas.' },
        { id: 'linux-2-a1', level: 'Avanzado', objective: 'Escribe una línea para encontrar el proceso de "node" y ver su PID.', hint: 'ps + pipe + grep.', solution: 'ps aux | grep node\n# luego: kill <PID> para terminarlo' },
      ],
    },
    {
      id: 'linux-3', title: 'Nivel 3 · Pipes, Scripts y SSH',
      subtopics: ['pipes |', 'grep, find', 'redirección > >>', 'variables', 'scripts bash', 'ssh'],
      theory: {
        teoria: 'El poder real de la terminal está en combinar comandos. El pipe | pasa la salida de un comando como entrada de otro. grep filtra texto, find busca archivos. La redirección > escribe en un archivo (>> agrega). Un script bash automatiza tareas: empieza con #!/bin/bash (el "shebang"), usa variables (NOMBRE="x") y se ejecuta con ./script.sh. ssh te conecta a servidores remotos de forma segura: la base del despliegue en la nube.',
        ejemplo: '#!/bin/bash\nNOMBRE="Cemal"\necho "Hola, $NOMBRE"\n# contar líneas que contienen "error" en un log\ngrep "error" app.log | wc -l\n# conectarse a un servidor\nssh usuario@servidor.com',
        buenas: ['Encadena comandos con pipes para tareas potentes en una línea.', 'Usa SSH con llaves, no contraseñas.', 'Comenta tus scripts.'],
        errores: ['Subir llaves SSH privadas a Git.', 'Redirigir con > sobre un archivo importante (lo sobrescribe).'],
      },
      exercises: [
        { id: 'linux-3-b1', level: 'Básico', objective: 'Escribe una línea que cuente cuántas veces aparece "error" en app.log.', hint: 'grep + wc -l.', solution: 'grep "error" app.log | wc -l' },
        { id: 'linux-3-i1', level: 'Intermedio', objective: 'Escribe un script bash mínimo que salude a un nombre guardado en una variable.', hint: 'shebang + variable + echo.', solution: '#!/bin/bash\nNOMBRE="Cemal"\necho "Hola, $NOMBRE"' },
        { id: 'linux-3-a1', level: 'Avanzado', objective: 'Escribe el comando para conectarte por SSH al usuario "deploy" en el host 203.0.113.5.', hint: 'ssh usuario@host.', solution: 'ssh deploy@203.0.113.5' },
      ],
      project: { title: 'Proyecto · Script de respaldo', desc: 'Crea un script bash que comprima una carpeta de proyecto con fecha en el nombre y la copie a otra ubicación. Hazlo ejecutable y pruébalo.' },
    },
  ],
};

// ════════════════════════ CLOUD / AWS ════════════════════════
const CLOUD: Course = {
  id: 'cloud', name: 'Cloud / AWS', icon: '☁️', color: '#22d3ee', tagline: 'Despliega en la nube (muy demandado en Canadá)',
  requires: [{ courseId: 'linux', label: 'Linux ≥ 50%' }],
  levels: [
    {
      id: 'cloud-1', title: 'Nivel 1 · Fundamentos Cloud',
      subtopics: ['IaaS / PaaS / SaaS', 'Regiones y zonas', 'Pago por uso', 'Proveedores (AWS/Azure/GCP)', 'Modelo de responsabilidad compartida'],
      theory: {
        teoria: 'La nube es alquilar infraestructura bajo demanda en vez de comprar servidores. Tres modelos: IaaS (infraestructura: tú gestionas el servidor, ej. EC2), PaaS (plataforma: solo subes tu código), SaaS (software listo: Gmail). Los proveedores (AWS líder, luego Azure y GCP) tienen regiones (zonas geográficas) y availability zones (centros de datos redundantes). Pagas por uso (pay-as-you-go). En el modelo de responsabilidad compartida, el proveedor asegura la nube y tú aseguras lo que pones en ella.',
        ejemplo: 'IaaS  → EC2 (una máquina virtual que administras)\nPaaS  → App Runner / Elastic Beanstalk (subes código)\nSaaS  → Gmail, Dropbox (solo lo usas)\n\nRegión: us-east-1, ca-central-1 (Canadá 🍁)',
        buenas: ['Elige la región más cercana a tus usuarios (menor latencia).', 'Empieza con el free tier para aprender sin gastar.', 'Usa ca-central-1 si tus usuarios están en Canadá.'],
        errores: ['Dejar recursos encendidos y recibir una factura sorpresa.', 'Confundir IaaS (gestionas el SO) con PaaS (no lo gestionas).'],
      },
      exercises: [
        { id: 'cloud-1-b1', level: 'Básico', objective: 'Explica la diferencia entre IaaS, PaaS y SaaS con un ejemplo de cada uno.', hint: 'Cuánto gestionas tú.', solution: 'IaaS: alquilas la infraestructura y gestionas el SO (EC2). PaaS: solo subes tu código, la plataforma corre lo demás (Elastic Beanstalk). SaaS: software ya hecho que solo usas (Gmail).' },
        { id: 'cloud-1-b2', level: 'Básico', objective: '¿Qué es una "región" en AWS y por qué elegirías ca-central-1?', hint: 'Ubicación geográfica.', solution: 'Una región es un conjunto de centros de datos en una zona geográfica. Elegirías ca-central-1 (Canadá) para tener menor latencia con usuarios canadienses y cumplir requisitos de residencia de datos.' },
        { id: 'cloud-1-i1', level: 'Intermedio', objective: 'Explica el modelo de responsabilidad compartida.', hint: 'Quién asegura qué.', solution: 'El proveedor (AWS) es responsable de la seguridad DE la nube (hardware, red, instalaciones). El cliente es responsable de la seguridad EN la nube (sus datos, permisos IAM, configuración, parches de su app).' },
      ],
    },
    {
      id: 'cloud-2', title: 'Nivel 2 · Cómputo y Almacenamiento',
      subtopics: ['EC2', 'S3', 'Lambda (serverless)', 'RDS', 'Contenedores (ECS)'],
      theory: {
        teoria: 'Los servicios core de AWS: EC2 son máquinas virtuales que controlas por completo (instalas lo que quieras). S3 guarda objetos/archivos (imágenes, backups, sitios estáticos) con alta durabilidad. Lambda ejecuta tu código sin que administres servidores (serverless): pagas solo por ejecución, ideal para tareas y APIs event-driven. RDS son bases de datos gestionadas (PostgreSQL, MySQL). ECS/EKS orquestan contenedores Docker en la nube.',
        ejemplo: 'Subir un archivo a S3 (CLI):\naws s3 cp foto.jpg s3://mi-bucket/\n\nFunción Lambda (Node):\nexport const handler = async (event) => {\n  return { statusCode: 200, body: "Hola desde Lambda" };\n};',
        buenas: ['Usa S3 para archivos estáticos, no tu servidor.', 'Lambda para cargas esporádicas/event-driven (pagas por uso real).', 'Usa RDS en vez de instalar tu propia BD en EC2.'],
        errores: ['Guardar archivos subidos en el disco de EC2 (se pierden al reiniciar).', 'Dejar buckets S3 públicos por error (fuga de datos).'],
      },
      exercises: [
        { id: 'cloud-2-b1', level: 'Básico', objective: '¿Qué servicio de AWS usarías para alojar las imágenes que suben tus usuarios y por qué?', hint: 'Almacenamiento de objetos.', solution: 'S3: está diseñado para almacenar objetos/archivos con alta durabilidad y escalabilidad, mucho mejor que guardarlos en el disco de un EC2 (que es efímero).' },
        { id: 'cloud-2-i1', level: 'Intermedio', objective: '¿Cuándo elegirías Lambda en vez de un EC2 siempre encendido?', hint: 'Carga esporádica.', solution: 'Cuando la carga es esporádica o event-driven (se ejecuta por eventos, no constante). Con Lambda pagas solo por ejecución y no administras servidores; con EC2 pagas aunque esté inactivo.' },
        { id: 'cloud-2-a1', level: 'Avanzado', objective: 'Tu app en EC2 guarda archivos en su disco local y se pierden al reiniciar. ¿Cómo lo resuelves?', hint: 'Almacenamiento externo.', solution: 'Guardas los archivos en S3 (almacenamiento persistente y externo) en lugar del disco efímero del EC2. Así sobreviven a reinicios, reemplazos de instancia y permiten escalar horizontalmente.' },
      ],
    },
    {
      id: 'cloud-3', title: 'Nivel 3 · Redes, Seguridad y Despliegue',
      subtopics: ['IAM', 'VPC', 'Security Groups', 'CI/CD', 'Infraestructura como código', 'Monitoreo'],
      theory: {
        teoria: 'Para producción necesitas seguridad y automatización. IAM gestiona usuarios, roles y permisos: aplica mínimo privilegio. Una VPC es tu red privada en la nube; los Security Groups son firewalls que controlan qué tráfico entra/sale de tus recursos. El despliegue se automatiza con CI/CD (build, test y deploy automáticos en cada push). La infraestructura como código (IaC) con Terraform o CloudFormation define tus recursos en archivos versionables y reproducibles. El monitoreo (CloudWatch) vigila logs y métricas.',
        ejemplo: '# Pipeline CI/CD típico\npush a main\n  → build\n  → tests\n  → deploy a producción\n\n# IaC con Terraform (fragmento)\nresource "aws_s3_bucket" "web" {\n  bucket = "mi-sitio-web"\n}',
        buenas: ['Aplica mínimo privilegio en IAM (nunca claves de root en el día a día).', 'Define la infraestructura como código para reproducirla.', 'Automatiza pruebas y despliegue con CI/CD.'],
        errores: ['Abrir el puerto 22/0.0.0.0 (SSH a todo internet) en el Security Group.', 'Hardcodear credenciales en el código.', 'Desplegar a mano sin pipeline ni pruebas.'],
      },
      exercises: [
        { id: 'cloud-3-b1', level: 'Básico', objective: '¿Para qué sirve IAM en AWS?', hint: 'Identidad y permisos.', solution: 'IAM (Identity and Access Management) gestiona usuarios, grupos, roles y sus permisos, controlando quién puede hacer qué sobre cada recurso, idealmente con mínimo privilegio.' },
        { id: 'cloud-3-i1', level: 'Intermedio', objective: 'Explica qué es un Security Group y un error común de configuración.', hint: 'Firewall + puerto abierto.', solution: 'Es un firewall virtual que define qué tráfico entra/sale de un recurso. Error común: abrir SSH (puerto 22) a 0.0.0.0/0, exponiéndolo a todo internet; debería limitarse a IPs conocidas.' },
        { id: 'cloud-3-a1', level: 'Avanzado', objective: '¿Qué ventajas da definir tu infraestructura como código (IaC) frente a crearla a mano en la consola?', hint: 'Versionable y reproducible.', solution: 'Es versionable (Git), reproducible (recreas todo el entorno con un comando), revisable en code review, menos propensa a errores manuales y facilita tener entornos idénticos (dev/staging/prod).' },
      ],
      project: { title: 'Proyecto · Despliega tu app en la nube', desc: 'Despliega una de tus apps: sube el frontend estático a S3, corre el backend (EC2 o Lambda), configura un Security Group correcto y documenta los pasos. Bonus: un pipeline CI/CD simple.' },
    },
  ],
};

// ════════════════════════ C# ════════════════════════
const CSHARP: Course = {
  id: 'csharp', name: 'C#', icon: '🟦', color: '#7c3aed', tagline: 'El lenguaje de .NET (backend, juegos con Unity)',
  levels: [
    {
      id: 'csharp-1', title: 'Nivel 1 · Fundamentos',
      subtopics: ['Console', 'variables', 'tipos', 'string interpolation'],
      theory: {
        teoria: 'C# es un lenguaje moderno, tipado y orientado a objetos de Microsoft, que corre sobre .NET. Es muy usado en backend empresarial (ASP.NET), apps de escritorio y videojuegos (Unity). Un programa parte de Main(). Las variables tienen tipo: int, double, bool, string, char.',
        ejemplo: 'using System;\nclass Program {\n  static void Main() {\n    string nombre = "Cemal";\n    int edad = 25;\n    Console.WriteLine($"Hola, {nombre} ({edad})");\n  }\n}',
        buenas: ['Usa string interpolation $"..." en vez de concatenar.', 'Nombra en PascalCase los métodos y clases; camelCase variables.'],
        errores: ['Olvidar using System; para Console.', 'Confundir = (asignar) con == (comparar).'],
      },
      exercises: [
        { id: 'csharp-1-b1', level: 'Básico', objective: 'Imprime "Hola, C#" en consola.', solution: 'Console.WriteLine("Hola, C#");' },
        { id: 'csharp-1-i1', level: 'Intermedio', objective: 'Declara nombre y edad e imprime un saludo con interpolación.', hint: '$"...{var}..."', solution: 'string nombre = "Ana";\nint edad = 30;\nConsole.WriteLine($"Hola, {nombre}, {edad} años");' },
      ],
    },
    {
      id: 'csharp-2', title: 'Nivel 2 · POO',
      subtopics: ['clases', 'propiedades', 'herencia', 'interfaces'],
      theory: {
        teoria: 'C# es totalmente orientado a objetos. Las clases tienen propiedades (con get/set), métodos y constructores. Se hereda con : ClaseBase y se implementan interfaces (que por convención empiezan con I, como IShape). El encapsulamiento se logra con private + propiedades.',
        ejemplo: 'class Persona {\n  public string Nombre { get; set; }\n  public Persona(string n) { Nombre = n; }\n  public void Saludar() => Console.WriteLine($"Hola, soy {Nombre}");\n}\n\nvar p = new Persona("Ana");\np.Saludar();',
        buenas: ['Usa propiedades automáticas { get; set; } en vez de campos públicos.', 'Programa contra interfaces.'],
        errores: ['Exponer campos públicos sin encapsular.', 'Olvidar new al instanciar.'],
      },
      exercises: [
        { id: 'csharp-2-i1', level: 'Intermedio', objective: 'Crea una clase Coche con propiedad Marca y un método que la imprima.', hint: 'public string Marca { get; set; }', solution: 'class Coche {\n  public string Marca { get; set; }\n  public void Mostrar() => Console.WriteLine(Marca);\n}' },
        { id: 'csharp-2-a1', level: 'Avanzado', objective: 'Define una interfaz IFigura con método Area() y una clase Cuadrado que la implemente.', solution: 'interface IFigura { double Area(); }\nclass Cuadrado : IFigura {\n  public double Lado { get; set; }\n  public double Area() => Lado * Lado;\n}' },
      ],
    },
    {
      id: 'csharp-3', title: 'Nivel 3 · Colecciones, LINQ y async',
      subtopics: ['List<T>', 'Dictionary', 'LINQ', 'async/await'],
      theory: {
        teoria: 'Las colecciones genéricas (List<T>, Dictionary<K,V>) guardan datos dinámicos con seguridad de tipos. LINQ permite consultar colecciones de forma declarativa (Where, Select, OrderBy). async/await maneja operaciones asíncronas (E/S, red) sin bloquear el hilo.',
        ejemplo: 'using System.Linq;\nvar nums = new List<int> { 5, 2, 8, 1 };\nvar pares = nums.Where(n => n % 2 == 0).OrderBy(n => n);\nforeach (var n in pares) Console.WriteLine(n);',
        buenas: ['Usa LINQ para filtrar/transformar en vez de bucles manuales.', 'Marca async los métodos que esperan E/S.'],
        errores: ['Bloquear async con .Result (deadlocks).', 'Usar arreglos fijos cuando necesitas tamaño dinámico.'],
      },
      exercises: [
        { id: 'csharp-3-i1', level: 'Intermedio', objective: 'Crea una List<string> con 3 nombres y recórrela con foreach.', solution: 'var nombres = new List<string> { "Ana", "Luis", "Sara" };\nforeach (var n in nombres) Console.WriteLine(n);' },
        { id: 'csharp-3-a1', level: 'Avanzado', objective: 'Con LINQ, obtén los números mayores a 3 de una lista y ordénalos.', hint: 'Where + OrderBy', solution: 'var r = nums.Where(n => n > 3).OrderBy(n => n).ToList();' },
      ],
      project: { title: 'Proyecto · API mínima en ASP.NET', desc: 'Crea una Web API en ASP.NET Core con un endpoint GET que devuelva una lista de objetos en JSON.' },
    },
  ],
};

// ════════════════════════ LUA ════════════════════════
const LUA: Course = {
  id: 'lua', name: 'Lua', icon: '🌙', color: '#2563eb', tagline: 'El lenguaje de Roblox y los videojuegos',
  levels: [
    {
      id: 'lua-1', title: 'Nivel 1 · Fundamentos',
      subtopics: ['print', 'variables', 'tipos', 'comentarios', 'if / for / while'],
      theory: {
        teoria: 'Lua es un lenguaje ligero, simple y rápido, muy usado en videojuegos (Roblox usa Luau, su versión). Es de tipado dinámico. print() imprime; los comentarios de una línea van con --. Variables: local x = 5. Tipos: number, string, boolean, nil, table. ¡OJO! En Lua los índices empiezan en 1, no en 0.',
        ejemplo: '-- esto es un comentario\nlocal nombre = "Cemal"\nlocal edad = 25\nprint("Hola, " .. nombre)  -- .. concatena\n\nif edad >= 18 then\n  print("Mayor de edad")\nend\n\nfor i = 1, 5 do\n  print(i)\nend',
        buenas: ['Usa local para tus variables (evita variables globales).', 'Concatena texto con .. (dos puntos).'],
        errores: ['Pensar que los índices empiezan en 0 (en Lua empiezan en 1).', 'Olvidar end para cerrar if/for/function.'],
      },
      exercises: [
        { id: 'lua-1-b1', level: 'Básico', objective: 'Imprime "Hola, Roblox" en consola.', solution: 'print("Hola, Roblox")' },
        { id: 'lua-1-i1', level: 'Intermedio', objective: 'Imprime los números del 1 al 10 con un for.', hint: 'for i = 1, 10 do … end', solution: 'for i = 1, 10 do\n  print(i)\nend' },
        { id: 'lua-1-a1', level: 'Avanzado', objective: 'Imprime solo los números pares del 1 al 10.', hint: 'if i % 2 == 0 then', solution: 'for i = 1, 10 do\n  if i % 2 == 0 then\n    print(i)\n  end\nend' },
      ],
    },
    {
      id: 'lua-2', title: 'Nivel 2 · Tablas y Funciones',
      subtopics: ['tables', 'arrays', 'diccionarios', 'function', 'pairs / ipairs'],
      theory: {
        teoria: 'La tabla (table) es LA estructura de Lua: sirve como arreglo y como diccionario. Una función se define con function … end y puede devolver valores con return. Para recorrer tablas: ipairs (arreglos, en orden) y pairs (clave-valor).',
        ejemplo: 'local frutas = {"manzana", "pera", "uva"}\nfor i, f in ipairs(frutas) do\n  print(i, f)\nend\n\nlocal persona = { nombre = "Ana", edad = 30 }\nfor clave, valor in pairs(persona) do\n  print(clave, valor)\nend\n\nlocal function sumar(a, b)\n  return a + b\nend\nprint(sumar(2, 3))',
        buenas: ['Usa ipairs para listas ordenadas y pairs para diccionarios.', 'Las funciones pequeñas y con un solo propósito son más fáciles de leer.'],
        errores: ['Mezclar índices numéricos y claves de texto sin cuidado.', 'Olvidar return cuando la función debe devolver algo.'],
      },
      exercises: [
        { id: 'lua-2-b1', level: 'Básico', objective: 'Crea una tabla con 3 nombres e imprímelos con ipairs.', solution: 'local nombres = {"Ana", "Luis", "Sara"}\nfor i, n in ipairs(nombres) do\n  print(n)\nend' },
        { id: 'lua-2-i1', level: 'Intermedio', objective: 'Escribe una función esPar(n) que devuelva true/false.', hint: 'return n % 2 == 0', solution: 'local function esPar(n)\n  return n % 2 == 0\nend' },
        { id: 'lua-2-a1', level: 'Avanzado', objective: 'Cuenta cuántos elementos tiene una tabla con pairs y un contador.', hint: 'recorre con pairs y suma 1', solution: 'local t = {a = 1, b = 2, c = 3}\nlocal n = 0\nfor _ in pairs(t) do\n  n = n + 1\nend\nprint(n)' },
      ],
    },
    {
      id: 'lua-3', title: 'Nivel 3 · Lua en Roblox',
      subtopics: ['Scripts', 'Instance', 'partes', 'eventos (.Touched)', 'Players'],
      theory: {
        teoria: 'En Roblox Studio escribes Scripts en Luau. Todo es un objeto (Instance): partes, modelos, GUIs. Puedes crear cosas con Instance.new("Part"). Los eventos te dejan reaccionar: part.Touched:Connect(function(hit) … end) detecta cuando algo toca una parte; game.Players.PlayerAdded:Connect(...) corre código cuando entra un jugador.',
        ejemplo: '-- Crear una parte por código\nlocal parte = Instance.new("Part")\nparte.Size = Vector3.new(4, 1, 4)\nparte.Position = Vector3.new(0, 5, 0)\nparte.Parent = workspace\n\n-- Dar puntos cuando un jugador la toca\nparte.Touched:Connect(function(hit)\n  local jugador = game.Players:GetPlayerFromCharacter(hit.Parent)\n  if jugador then\n    print(jugador.Name .. " ganó un punto!")\n  end\nend)',
        buenas: ['Organiza: Scripts del servidor en ServerScriptService, los del cliente en StarterPlayerScripts.', 'Prueba seguido con el botón Play de Studio.'],
        errores: ['Poner lógica del servidor en un LocalScript (no corre).', 'Olvidar :Connect() al suscribir un evento.'],
      },
      exercises: [
        { id: 'lua-3-i1', level: 'Intermedio', objective: 'Escribe el código para crear una Part roja en el workspace.', hint: 'Instance.new("Part") + BrickColor', solution: 'local p = Instance.new("Part")\np.BrickColor = BrickColor.new("Bright red")\np.Parent = workspace' },
        { id: 'lua-3-a1', level: 'Avanzado', objective: 'Conecta el evento Touched de una parte para imprimir el nombre de quien la toca.', solution: 'parte.Touched:Connect(function(hit)\n  local plr = game.Players:GetPlayerFromCharacter(hit.Parent)\n  if plr then print(plr.Name) end\nend)' },
      ],
      project: { title: 'Proyecto · Tu primer juego de Roblox', desc: 'Crea un obby (carrera de obstáculos) simple: partes que matan al tocarlas, una meta que da puntos y guardado de récord. Usa el módulo 🎮 Roblox para el paso a paso.' },
    },
  ],
};

export const COURSES: Course[] = [JAVA, PYTHON, JAVASCRIPT, TYPESCRIPT, CSHARP, LUA, HTML, CSS, SQL, PHP, CPP, GO, RUST, KOTLIN, ASM, REACT, ANGULAR, DOCKER, GIT, CIBER, REDES, DSA, SYSDESIGN, LINUX, CLOUD];
