// Banco de preguntas para el simulador de entrevista técnica (en inglés, con respuesta modelo).
export type IntCategory = 'Behavioral' | 'Backend' | 'Frontend' | 'DSA' | 'System Design';

export type IntQuestion = {
  id: string;
  category: IntCategory;
  q: string;        // pregunta en inglés (como en la entrevista real)
  tip: string;      // consejo en español de cómo responder
  answer: string;   // respuesta modelo / puntos clave en inglés
};

export const INT_CATEGORIES: IntCategory[] = ['Behavioral', 'Backend', 'Frontend', 'DSA', 'System Design'];

export const INTERVIEW_QUESTIONS: IntQuestion[] = [
  // ── Behavioral (método STAR) ──
  { id: 'b1', category: 'Behavioral', q: 'Tell me about yourself.', tip: 'Fórmula presente → pasado → futuro, en 60-90s. Termina conectando con el puesto.',
    answer: "I'm a software developer with about 3 years of experience building web applications with JavaScript, React and backend services. Recently I've focused on TypeScript and system design to grow as a full-stack engineer. I'm looking to bring that experience to a team in Vancouver where I can keep growing and deliver real value." },
  { id: 'b2', category: 'Behavioral', q: 'Tell me about a challenging bug you fixed.', tip: 'Usa STAR: Situation, Task, Action, Result. Sé concreto y mide el resultado.',
    answer: 'Situation: our app crashed intermittently in production. Task: I had to find the root cause with limited logs. Action: I reproduced it locally, added structured logging, and traced it to a race condition in async calls. Result: I fixed it with proper awaiting, and crashes dropped to zero. I also added a test to prevent regressions.' },
  { id: 'b3', category: 'Behavioral', q: 'Why do you want to work here / in Canada?', tip: 'Investiga la empresa. Menciona algo específico de ellos, no solo "quiero emigrar".',
    answer: "I admire how your team builds reliable products and invests in engineering quality. Canada has a strong, collaborative tech culture and I want to grow long-term in an environment like Vancouver's, contributing my full-stack skills while learning from senior engineers." },
  { id: 'b4', category: 'Behavioral', q: 'Tell me about a time you disagreed with a teammate.', tip: 'Muestra respeto y enfoque en datos, no en ego. El resultado debe ser positivo.',
    answer: 'A teammate wanted to add a library I felt was overkill. Instead of arguing, I proposed we compare bundle size and maintenance cost. We measured it together, agreed the native solution was enough, and shipped a lighter feature. The key was staying objective and respectful.' },

  // ── Backend ──
  { id: 'k1', category: 'Backend', q: 'What is the difference between SQL and NoSQL databases?', tip: 'Da la diferencia y cuándo usar cada una. Los ejemplos suman.',
    answer: 'SQL databases are relational, with a fixed schema and strong consistency (Postgres, MySQL) — great for structured data and transactions. NoSQL is flexible and scales horizontally (MongoDB, Redis) — good for large volume or evolving schemas. I choose based on the access pattern and consistency needs.' },
  { id: 'k2', category: 'Backend', q: 'How do you secure a REST API?', tip: 'Menciona autenticación, validación, HTTPS y rate limiting. Conecta con OWASP.',
    answer: 'Use HTTPS everywhere, authenticate with tokens (JWT/OAuth), authorize per route, validate and sanitize all input, hash passwords with bcrypt, use parameterized queries to prevent SQL injection, and add rate limiting and proper CORS. Never expose secrets in code.' },
  { id: 'k3', category: 'Backend', q: 'What is the difference between PUT and POST?', tip: 'Idempotencia es la palabra clave que esperan oír.',
    answer: 'POST creates a new resource and is not idempotent — calling it twice creates two resources. PUT replaces a resource at a known URL and is idempotent — calling it twice has the same effect as once. Use PATCH for partial updates.' },
  { id: 'k4', category: 'Backend', q: 'What happens when you type a URL and press Enter?', tip: 'Demuestra que entiendes la red de punta a punta. Resume las etapas.',
    answer: 'The browser resolves the domain via DNS to an IP, opens a TCP connection (and a TLS handshake for HTTPS), sends an HTTP request, the server processes it and returns a response, then the browser parses the HTML, requests assets, and renders the page.' },

  // ── Frontend ──
  { id: 'f1', category: 'Frontend', q: 'What is the virtual DOM in React?', tip: 'Explica el qué y el porqué (rendimiento por diffing).',
    answer: 'The virtual DOM is an in-memory representation of the UI. When state changes, React builds a new virtual tree, diffs it against the previous one, and updates only the changed real DOM nodes. This minimizes expensive DOM operations and keeps the UI fast.' },
  { id: 'f2', category: 'Frontend', q: 'Explain the difference between let, const and var.', tip: 'Scope y reasignación. Recomienda const por defecto.',
    answer: 'var is function-scoped and hoisted, which causes bugs. let and const are block-scoped. const cannot be reassigned. Best practice: use const by default and let only when you need to reassign; avoid var.' },
  { id: 'f3', category: 'Frontend', q: 'What are React hooks? Give examples.', tip: 'Define hooks y menciona useState/useEffect con un caso de uso.',
    answer: 'Hooks let function components use state and lifecycle features. useState manages local state, useEffect runs side effects like data fetching, useMemo/useCallback optimize performance. The rules: only call hooks at the top level and from React functions.' },
  { id: 'f4', category: 'Frontend', q: 'How would you optimize a slow web page?', tip: 'Habla de medir primero, luego optimizar (bundle, imágenes, lazy load).',
    answer: 'First measure with Lighthouse/DevTools. Then reduce bundle size with code-splitting and lazy loading, optimize and lazy-load images, cache assets via a CDN, minimize re-renders with memoization, and defer non-critical JavaScript.' },

  // ── DSA ──
  { id: 'd1', category: 'DSA', q: 'How do you find if an array has a pair that sums to a target?', tip: 'Empieza por la fuerza bruta O(n²), luego optimiza a O(n) con un hash.',
    answer: 'Brute force is O(n²) with nested loops. The optimal solution is O(n): iterate once, and for each number check if (target − number) is already in a hash set/map; if so, return the pair, otherwise store the number. One pass, O(n) time and space.' },
  { id: 'd2', category: 'DSA', q: 'Explain Big-O notation and give examples.', tip: 'Define complejidad y da ejemplos O(1), O(n), O(log n), O(n²).',
    answer: 'Big-O describes how runtime or memory grows with input size n. O(1) is constant (array index), O(log n) is binary search, O(n) is a single loop, O(n log n) is efficient sorting, and O(n²) is nested loops. It helps compare algorithm scalability.' },
  { id: 'd3', category: 'DSA', q: 'When would you use a stack vs a queue?', tip: 'LIFO vs FIFO con casos de uso reales.',
    answer: 'A stack is LIFO — useful for undo features, parsing parentheses, and recursion. A queue is FIFO — useful for task scheduling and breadth-first search. I pick based on whether I need the most recent or the oldest item first.' },
  { id: 'd4', category: 'DSA', q: 'How does binary search work and what is its complexity?', tip: 'Requiere arreglo ordenado. Explica el dividir a la mitad.',
    answer: "Binary search works on a sorted array. You compare the target with the middle element; if equal you're done, if the target is larger you search the right half, otherwise the left half, halving the range each step. That gives O(log n) time." },

  // ── System Design ──
  { id: 's1', category: 'System Design', q: 'How would you design a URL shortener?', tip: 'Aclara requisitos, estima escala, y habla de BD, caché y generación de IDs.',
    answer: "I'd clarify scale (reads vs writes), then store a mapping from a short code to the long URL in a database, generate unique short codes (base62 of an ID), cache hot URLs in Redis for fast redirects, and add a load balancer. I'd discuss handling collisions and analytics." },
  { id: 's2', category: 'System Design', q: 'How do you scale a web application to millions of users?', tip: 'Horizontal scaling, caché, réplicas de BD y CDN. Menciona los cuellos de botella.',
    answer: 'Scale horizontally behind a load balancer, add caching (Redis) for frequent reads, use read replicas and sharding for the database, serve static assets from a CDN, and move slow tasks to async queues. I always identify the bottleneck with metrics before scaling.' },
  { id: 's3', category: 'System Design', q: 'What is caching and what are its trade-offs?', tip: 'Acelera lecturas pero arriesga datos obsoletos. Habla de TTL e invalidación.',
    answer: 'Caching stores frequently accessed data in fast memory to reduce latency and database load. The trade-off is staleness: cached data can become outdated, so I use TTLs and a clear invalidation strategy. Caching works best for read-heavy data that changes rarely.' },
];
