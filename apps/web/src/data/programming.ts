export type Challenge = {
  id: string;
  lang: string;
  title: string;
  difficulty: number; // 1-5
  prompt: string;
  solution: string;
};

export const CHALLENGES: Challenge[] = [
  // ── Python ──
  { id: 'py-1', lang: 'Python', title: 'Hola mundo', difficulty: 1, prompt: 'Imprime "Hola, Renacer" por consola.', solution: 'print("Hola, Renacer")' },
  { id: 'py-2', lang: 'Python', title: 'Par o impar', difficulty: 1, prompt: 'Función que devuelve True si un número es par.', solution: 'def es_par(n):\n    return n % 2 == 0' },
  { id: 'py-3', lang: 'Python', title: 'Suma de lista', difficulty: 2, prompt: 'Suma todos los elementos de una lista sin usar sum().', solution: 'def suma(lst):\n    t = 0\n    for x in lst:\n        t += x\n    return t' },
  { id: 'py-4', lang: 'Python', title: 'FizzBuzz', difficulty: 2, prompt: 'Del 1 al 100: "Fizz" si múltiplo de 3, "Buzz" de 5, "FizzBuzz" de ambos.', solution: 'for i in range(1, 101):\n    print("Fizz"*(i%3==0) + "Buzz"*(i%5==0) or i)' },
  { id: 'py-5', lang: 'Python', title: 'Palíndromo', difficulty: 3, prompt: 'Indica si una cadena es palíndromo.', solution: 'def es_palindromo(s):\n    s = s.lower().replace(" ", "")\n    return s == s[::-1]' },
  { id: 'py-6', lang: 'Python', title: 'Diccionario de frecuencias', difficulty: 3, prompt: 'Cuenta cuántas veces aparece cada palabra en un texto.', solution: 'from collections import Counter\ndef frecuencias(texto):\n    return Counter(texto.split())' },

  // ── JavaScript ──
  { id: 'js-1', lang: 'JavaScript', title: 'Saludo', difficulty: 1, prompt: 'Función que recibe un nombre y devuelve "Hola, <nombre>".', solution: 'const saludo = (n) => `Hola, ${n}`;' },
  { id: 'js-2', lang: 'JavaScript', title: 'Máximo de array', difficulty: 2, prompt: 'Devuelve el número mayor de un array.', solution: 'const maximo = (a) => Math.max(...a);' },
  { id: 'js-3', lang: 'JavaScript', title: 'Filtrar pares', difficulty: 2, prompt: 'Devuelve solo los números pares de un array.', solution: 'const pares = (a) => a.filter((x) => x % 2 === 0);' },
  { id: 'js-4', lang: 'JavaScript', title: 'Invertir cadena', difficulty: 2, prompt: 'Invierte una cadena de texto.', solution: 'const invertir = (s) => [...s].reverse().join("");' },
  { id: 'js-5', lang: 'JavaScript', title: 'Debounce', difficulty: 4, prompt: 'Implementa una función debounce(fn, ms).', solution: 'function debounce(fn, ms) {\n  let t;\n  return (...args) => {\n    clearTimeout(t);\n    t = setTimeout(() => fn(...args), ms);\n  };\n}' },

  // ── SQL ──
  { id: 'sql-1', lang: 'SQL', title: 'Seleccionar todo', difficulty: 1, prompt: 'Trae todas las columnas de la tabla "users".', solution: 'SELECT * FROM users;' },
  { id: 'sql-2', lang: 'SQL', title: 'Filtrar y ordenar', difficulty: 2, prompt: 'Usuarios mayores de 18, ordenados por nombre.', solution: 'SELECT * FROM users\nWHERE age > 18\nORDER BY name;' },
  { id: 'sql-3', lang: 'SQL', title: 'Contar por grupo', difficulty: 3, prompt: 'Cuenta cuántos usuarios hay por país.', solution: 'SELECT country, COUNT(*) AS total\nFROM users\nGROUP BY country;' },
  { id: 'sql-4', lang: 'SQL', title: 'JOIN', difficulty: 3, prompt: 'Une "orders" con "users" por user_id.', solution: 'SELECT u.name, o.total\nFROM orders o\nJOIN users u ON u.id = o.user_id;' },

  // ── Java ──
  { id: 'java-1', lang: 'Java', title: 'Main', difficulty: 1, prompt: 'Programa que imprime "Renacer" por consola.', solution: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Renacer");\n  }\n}' },
  { id: 'java-2', lang: 'Java', title: 'Factorial', difficulty: 3, prompt: 'Método recursivo que calcula el factorial de n.', solution: 'static long fact(int n) {\n  return n <= 1 ? 1 : n * fact(n - 1);\n}' },

  // ── C / C++ ──
  { id: 'c-1', lang: 'C', title: 'Suma de dos', difficulty: 1, prompt: 'Función que suma dos enteros.', solution: 'int suma(int a, int b) {\n  return a + b;\n}' },
  { id: 'cpp-1', lang: 'C++', title: 'Vector y bucle', difficulty: 2, prompt: 'Recorre un vector e imprime cada elemento.', solution: 'for (int x : v) {\n  std::cout << x << "\\n";\n}' },

  // ── HTML / CSS ──
  { id: 'html-1', lang: 'HTML', title: 'Lista', difficulty: 1, prompt: 'Crea una lista no ordenada con 3 elementos.', solution: '<ul>\n  <li>Uno</li>\n  <li>Dos</li>\n  <li>Tres</li>\n</ul>' },
  { id: 'css-1', lang: 'CSS', title: 'Centrar con flex', difficulty: 2, prompt: 'Centra un elemento horizontal y verticalmente.', solution: '.box {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}' },

  // ── Algoritmos / Estructuras ──
  { id: 'algo-1', lang: 'Algoritmos', title: 'Búsqueda binaria', difficulty: 4, prompt: 'Implementa búsqueda binaria en un array ordenado.', solution: 'def binaria(a, x):\n    lo, hi = 0, len(a) - 1\n    while lo <= hi:\n        m = (lo + hi) // 2\n        if a[m] == x: return m\n        if a[m] < x: lo = m + 1\n        else: hi = m - 1\n    return -1' },
  { id: 'algo-2', lang: 'Algoritmos', title: 'Fibonacci eficiente', difficulty: 3, prompt: 'Calcula el n-ésimo Fibonacci sin recursión.', solution: 'def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a' },
  { id: 'algo-3', lang: 'Algoritmos', title: 'Anagrama', difficulty: 3, prompt: '¿Dos cadenas son anagramas?', solution: 'def anagrama(a, b):\n    return sorted(a) == sorted(b)' },

  // ── Más retos ──
  { id: 'py-7', lang: 'Python', title: 'Vocales', difficulty: 2, prompt: 'Cuenta cuántas vocales tiene una cadena.', solution: 'def vocales(s):\n    return sum(c.lower() in "aeiou" for c in s)' },
  { id: 'py-8', lang: 'Python', title: 'Lista plana', difficulty: 3, prompt: 'Aplana una lista de listas en una sola lista.', solution: 'def aplanar(lst):\n    return [x for sub in lst for x in sub]' },
  { id: 'js-6', lang: 'JavaScript', title: 'Agrupar por', difficulty: 3, prompt: 'Agrupa un array de objetos por una clave.', solution: 'const groupBy = (arr, key) =>\n  arr.reduce((acc, o) => {\n    (acc[o[key]] ??= []).push(o);\n    return acc;\n  }, {});' },
  { id: 'js-7', lang: 'JavaScript', title: 'Capitalizar', difficulty: 1, prompt: 'Pon en mayúscula la primera letra de cada palabra.', solution: 'const cap = (s) => s.replace(/\\b\\w/g, (c) => c.toUpperCase());' },
  { id: 'ts-1', lang: 'TypeScript', title: 'Tipo genérico', difficulty: 3, prompt: 'Función identidad genérica que conserve el tipo.', solution: 'function identity<T>(x: T): T {\n  return x;\n}' },
  { id: 'sql-5', lang: 'SQL', title: 'Top 3', difficulty: 3, prompt: 'Los 3 productos más caros.', solution: 'SELECT name, price\nFROM products\nORDER BY price DESC\nLIMIT 3;' },
  { id: 'go-1', lang: 'Go', title: 'Suma slice', difficulty: 2, prompt: 'Suma los enteros de un slice.', solution: 'func suma(nums []int) int {\n  t := 0\n  for _, n := range nums {\n    t += n\n  }\n  return t\n}' },
  { id: 'rust-1', lang: 'Rust', title: 'Mayor', difficulty: 3, prompt: 'Devuelve el mayor de un vector de i32.', solution: 'fn mayor(v: &[i32]) -> i32 {\n    *v.iter().max().unwrap()\n}' },
  { id: 'php-1', lang: 'PHP', title: 'Invertir array', difficulty: 1, prompt: 'Invierte el orden de un array.', solution: '$invertido = array_reverse($arr);' },
  { id: 'algo-4', lang: 'Algoritmos', title: 'MCD (Euclides)', difficulty: 3, prompt: 'Máximo común divisor de dos números.', solution: 'def mcd(a, b):\n    while b:\n        a, b = b, a % b\n    return a' },
  { id: 'algo-5', lang: 'Algoritmos', title: 'Bubble sort', difficulty: 4, prompt: 'Ordena una lista con el método burbuja.', solution: 'def bubble(a):\n    for i in range(len(a)):\n        for j in range(len(a)-1-i):\n            if a[j] > a[j+1]:\n                a[j], a[j+1] = a[j+1], a[j]\n    return a' },

  // ── Tanda extra ──
  { id: 'js-8', lang: 'JavaScript', title: 'Sumar dos', difficulty: 1, prompt: 'Función que suma dos números y la imprime con console.log.', solution: 'const sumar = (a, b) => a + b;\nconsole.log(sumar(2, 3));' },
  { id: 'js-9', lang: 'JavaScript', title: 'Contar vocales', difficulty: 2, prompt: 'Cuenta las vocales de una cadena.', solution: 'const vocales = (s) => (s.match(/[aeiou]/gi) || []).length;\nconsole.log(vocales("Renacer"));' },
  { id: 'js-10', lang: 'JavaScript', title: 'FizzBuzz', difficulty: 2, prompt: 'Imprime FizzBuzz del 1 al 20.', solution: 'for (let i = 1; i <= 20; i++) {\n  let s = (i % 3 ? "" : "Fizz") + (i % 5 ? "" : "Buzz");\n  console.log(s || i);\n}' },
  { id: 'js-11', lang: 'JavaScript', title: 'Quitar duplicados', difficulty: 2, prompt: 'Devuelve un array sin elementos repetidos.', solution: 'const unicos = (a) => [...new Set(a)];\nconsole.log(unicos([1,1,2,3,3]));' },
  { id: 'js-12', lang: 'JavaScript', title: 'Suma de array', difficulty: 2, prompt: 'Suma todos los números de un array con reduce.', solution: 'const suma = (a) => a.reduce((t, x) => t + x, 0);\nconsole.log(suma([1,2,3,4]));' },
  { id: 'py-9', lang: 'Python', title: 'Mayúsculas', difficulty: 1, prompt: 'Convierte un texto a mayúsculas.', solution: 'print("renacer".upper())' },
  { id: 'py-10', lang: 'Python', title: 'Máximo', difficulty: 1, prompt: 'Devuelve el mayor de una lista.', solution: 'def mayor(a):\n    return max(a)' },
  { id: 'py-11', lang: 'Python', title: 'Primos', difficulty: 4, prompt: '¿Un número es primo?', solution: 'def es_primo(n):\n    if n < 2: return False\n    for i in range(2, int(n**0.5)+1):\n        if n % i == 0: return False\n    return True' },
  { id: 'py-12', lang: 'Python', title: 'Invertir palabras', difficulty: 3, prompt: 'Invierte el orden de las palabras de una frase.', solution: 'def invertir(f):\n    return " ".join(f.split()[::-1])' },
  { id: 'sql-6', lang: 'SQL', title: 'Promedio', difficulty: 2, prompt: 'Precio promedio de los productos.', solution: 'SELECT AVG(price) AS promedio\nFROM products;' },
  { id: 'sql-7', lang: 'SQL', title: 'Filtro LIKE', difficulty: 2, prompt: 'Usuarios cuyo nombre empieza por "A".', solution: "SELECT * FROM users\nWHERE name LIKE 'A%';" },
  { id: 'java-3', lang: 'Java', title: 'Bucle for', difficulty: 2, prompt: 'Imprime los números del 1 al 5.', solution: 'for (int i = 1; i <= 5; i++) {\n  System.out.println(i);\n}' },
  { id: 'cpp-2', lang: 'C++', title: 'Intercambiar', difficulty: 2, prompt: 'Intercambia dos variables.', solution: 'int a = 1, b = 2;\nstd::swap(a, b);' },
  { id: 'html-2', lang: 'HTML', title: 'Enlace e imagen', difficulty: 1, prompt: 'Crea un enlace con una imagen dentro.', solution: '<a href="https://ejemplo.com">\n  <img src="logo.png" alt="Logo" />\n</a>' },
  { id: 'css-2', lang: 'CSS', title: 'Grid 3 columnas', difficulty: 2, prompt: 'Crea una cuadrícula de 3 columnas iguales.', solution: '.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1rem;\n}' },
  { id: 'ts-2', lang: 'TypeScript', title: 'Interface', difficulty: 2, prompt: 'Define una interface User con id y name.', solution: 'interface User {\n  id: number;\n  name: string;\n}' },
  { id: 'go-2', lang: 'Go', title: 'Hola mundo', difficulty: 1, prompt: 'Programa que imprime "Renacer".', solution: 'package main\nimport "fmt"\nfunc main() {\n  fmt.Println("Renacer")\n}' },
  { id: 'rust-2', lang: 'Rust', title: 'Suma', difficulty: 2, prompt: 'Función que suma dos i32.', solution: 'fn suma(a: i32, b: i32) -> i32 {\n    a + b\n}' },
  { id: 'php-2', lang: 'PHP', title: 'Eco', difficulty: 1, prompt: 'Imprime "Hola" en PHP.', solution: '<?php echo "Hola"; ?>' },
  { id: 'algo-6', lang: 'Algoritmos', title: 'Suma de dígitos', difficulty: 2, prompt: 'Suma los dígitos de un número.', solution: 'def suma_digitos(n):\n    return sum(int(d) for d in str(abs(n)))' },
  { id: 'algo-7', lang: 'Algoritmos', title: 'Potencia rápida', difficulty: 4, prompt: 'Calcula a^b de forma eficiente.', solution: 'def potencia(a, b):\n    r = 1\n    while b:\n        if b & 1: r *= a\n        a *= a\n        b >>= 1\n    return r' },
];

export const CODE_TOTAL = CHALLENGES.length;
export const CODE_LANGS = [...new Set(CHALLENGES.map((c) => c.lang))];

// ── Teoría esencial por lenguaje (solo lo importante) ──
export const LANG_THEORY: Record<string, string> = {
  Python: 'Lenguaje claro y versátil. Indentación obligatoria define bloques. Tipado dinámico. Ideal para empezar, IA y automatización. print() imprime, def define funciones.',
  JavaScript: 'El lenguaje de la web (corre en el navegador). Tipado dinámico. console.log() imprime. Funciones flecha: const f = (x) => x. Asíncrono con promesas/async-await.',
  TypeScript: 'JavaScript + tipos estáticos. Detecta errores antes de ejecutar. Se compila a JS. Usa interface/type para describir datos.',
  SQL: 'Lenguaje para bases de datos. SELECT columnas FROM tabla WHERE condición. GROUP BY agrupa, JOIN une tablas, ORDER BY ordena.',
  Java: 'Tipado estático y orientado a objetos. Todo vive en clases; el punto de entrada es main(). Compila a bytecode (JVM). Muy usado en empresas y Android.',
  C: 'Lenguaje de bajo nivel, rápido y cercano al hardware. Manejo manual de memoria con punteros. Base de muchos sistemas operativos.',
  'C++': 'C con orientación a objetos y más potencia. Usado en videojuegos y software de alto rendimiento. Cuidado con la memoria.',
  HTML: 'Estructura de las páginas web con etiquetas. No es programación, es marcado: <h1>, <p>, <a>, <img>. La base de todo sitio.',
  CSS: 'Da estilo al HTML: colores, tipografías y layout. Flexbox y Grid posicionan elementos. Selector { propiedad: valor; }.',
  Go: 'Compilado, simple y muy rápido. Excelente para servidores y concurrencia (goroutines). Sintaxis minimalista.',
  Rust: 'Rápido y seguro en memoria sin recolector de basura. El "borrow checker" evita errores comunes. Curva de aprendizaje alta pero potente.',
  PHP: 'Lenguaje de servidor muy usado en webs (WordPress). Se mezcla con HTML. Variables empiezan con $.',
  Algoritmos: 'No es un lenguaje: es la lógica para resolver problemas (búsqueda, ordenación, recursión). Lo importante es el razonamiento, no la sintaxis.',
};
