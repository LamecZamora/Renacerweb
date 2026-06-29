export type Quiz = { id: string; q: string; options: string[]; answer: number; explain: string };
export type Lesson = { id: string; title: string; area: string; level: string; quizzes: Quiz[] };

export const ENGLISH_LESSONS: Lesson[] = [
  {
    id: 'a1-tobe', title: 'Verb "to be"', area: 'Grammar', level: 'A1',
    quizzes: [
      { id: 'a1-tobe-1', q: 'I ___ a student.', options: ['am', 'is', 'are', 'be'], answer: 0, explain: '"I" siempre va con "am".' },
      { id: 'a1-tobe-2', q: 'She ___ from Mexico.', options: ['am', 'are', 'is', 'be'], answer: 2, explain: 'He/She/It → "is".' },
      { id: 'a1-tobe-3', q: 'They ___ my friends.', options: ['is', 'am', 'be', 'are'], answer: 3, explain: 'We/You/They → "are".' },
      { id: 'a1-tobe-4', q: '___ you tired?', options: ['Am', 'Are', 'Is', 'Be'], answer: 1, explain: 'Pregunta con "you" → "Are you...?"' },
    ],
  },
  {
    id: 'a1-articles', title: 'Articles a / an', area: 'Grammar', level: 'A1',
    quizzes: [
      { id: 'a1-art-1', q: 'I have ___ apple.', options: ['a', 'an', 'the', '-'], answer: 1, explain: 'Sonido vocálico → "an".' },
      { id: 'a1-art-2', q: 'She is ___ teacher.', options: ['an', 'the', 'a', '-'], answer: 2, explain: 'Sonido consonántico → "a".' },
      { id: 'a1-art-3', q: 'It is ___ hour.', options: ['a', 'an', 'the', '-'], answer: 1, explain: '"hour" empieza con sonido vocálico (h muda).' },
    ],
  },
  {
    id: 'a1-vocab', title: 'Daily vocabulary', area: 'Vocabulary', level: 'A1',
    quizzes: [
      { id: 'a1-voc-1', q: '"Casa" en inglés:', options: ['Car', 'House', 'Horse', 'Hose'], answer: 1, explain: 'House = casa.' },
      { id: 'a1-voc-2', q: '"Manzana" en inglés:', options: ['Orange', 'Apple', 'Grape', 'Pear'], answer: 1, explain: 'Apple = manzana.' },
      { id: 'a1-voc-3', q: '"Lunes" en inglés:', options: ['Sunday', 'Monday', 'Friday', 'Tuesday'], answer: 1, explain: 'Monday = lunes.' },
      { id: 'a1-voc-4', q: '"Agua" en inglés:', options: ['Wine', 'Milk', 'Water', 'Juice'], answer: 2, explain: 'Water = agua.' },
    ],
  },
  {
    id: 'a2-present', title: 'Present Simple', area: 'Grammar', level: 'A2',
    quizzes: [
      { id: 'a2-pre-1', q: 'He ___ coffee every morning.', options: ['drink', 'drinks', 'drinking', 'drank'], answer: 1, explain: '3ª persona → +s.' },
      { id: 'a2-pre-2', q: 'They ___ TV at night.', options: ['watches', 'watch', 'watching', 'watched'], answer: 1, explain: 'They → sin "s".' },
      { id: 'a2-pre-3', q: '___ she like pizza?', options: ['Do', 'Does', 'Is', 'Are'], answer: 1, explain: 'Pregunta 3ª persona → "Does".' },
      { id: 'a2-pre-4', q: 'I ___ not work on Sundays.', options: ['does', 'do', 'am', 'is'], answer: 1, explain: '"I/You/We/They" → "do not".' },
    ],
  },
  {
    id: 'a2-prep', title: 'Prepositions of place', area: 'Grammar', level: 'A2',
    quizzes: [
      { id: 'a2-prep-1', q: 'The cat is ___ the table.', options: ['on', 'in', 'at', 'of'], answer: 0, explain: 'Sobre una superficie → "on".' },
      { id: 'a2-prep-2', q: 'The keys are ___ the box.', options: ['on', 'in', 'at', 'to'], answer: 1, explain: 'Dentro → "in".' },
      { id: 'a2-prep-3', q: 'I am ___ home.', options: ['in', 'on', 'at', 'by'], answer: 2, explain: 'Expresión fija → "at home".' },
    ],
  },
  {
    id: 'b1-pastperf', title: 'Past Simple vs Continuous', area: 'Grammar', level: 'B1',
    quizzes: [
      { id: 'b1-past-1', q: 'While I ___, the phone rang.', options: ['slept', 'was sleeping', 'sleep', 'am sleeping'], answer: 1, explain: 'Acción en progreso → past continuous.' },
      { id: 'b1-past-2', q: 'She ___ to Paris last year.', options: ['was going', 'goes', 'went', 'gone'], answer: 2, explain: 'Acción terminada → past simple.' },
      { id: 'b1-past-3', q: 'They ___ dinner when I arrived.', options: ['had', 'were having', 'have', 'has'], answer: 1, explain: 'En progreso al llegar → were having.' },
    ],
  },
  {
    id: 'b1-phrasal', title: 'Phrasal verbs', area: 'Vocabulary', level: 'B1',
    quizzes: [
      { id: 'b1-ph-1', q: '"Give up" significa:', options: ['Continuar', 'Rendirse', 'Devolver', 'Empezar'], answer: 1, explain: 'Give up = rendirse.' },
      { id: 'b1-ph-2', q: '"Look for" significa:', options: ['Cuidar', 'Mirar arriba', 'Buscar', 'Ignorar'], answer: 2, explain: 'Look for = buscar.' },
      { id: 'b1-ph-3', q: '"Find out" significa:', options: ['Salir', 'Averiguar', 'Perder', 'Entrar'], answer: 1, explain: 'Find out = averiguar.' },
      { id: 'b1-ph-4', q: '"Turn off" significa:', options: ['Encender', 'Girar', 'Apagar', 'Subir'], answer: 2, explain: 'Turn off = apagar.' },
    ],
  },
  {
    id: 'b1-reading', title: 'Reading comprehension', area: 'Reading', level: 'B1',
    quizzes: [
      { id: 'b1-read-1', q: '"Anna works from home and starts at 9." What time does Anna start?', options: ['At home', '9 a.m.', 'Never', 'At night'], answer: 1, explain: 'El texto dice "starts at 9".' },
      { id: 'b1-read-2', q: 'Synonym of "begin":', options: ['Stop', 'End', 'Start', 'Close'], answer: 2, explain: 'Begin = start.' },
    ],
  },
  {
    id: 'b2-conditionals', title: 'Conditionals', area: 'Grammar', level: 'B2',
    quizzes: [
      { id: 'b2-cond-1', q: 'If I ___ rich, I would travel.', options: ['am', 'were', 'will be', 'be'], answer: 1, explain: '2º condicional → "were".' },
      { id: 'b2-cond-2', q: 'If it rains, we ___ inside.', options: ['stayed', 'will stay', 'would stay', 'stay'], answer: 1, explain: '1er condicional → will + verbo.' },
      { id: 'b2-cond-3', q: 'If I had studied, I ___ passed.', options: ['will have', 'would have', 'had', 'have'], answer: 1, explain: '3er condicional → would have + participio.' },
    ],
  },
  {
    id: 'b2-passive', title: 'Passive voice', area: 'Grammar', level: 'B2',
    quizzes: [
      { id: 'b2-pas-1', q: 'The book ___ by millions.', options: ['reads', 'is read', 'reading', 'read'], answer: 1, explain: 'Pasiva presente → is + participio.' },
      { id: 'b2-pas-2', q: 'The house ___ in 1990.', options: ['built', 'was built', 'is built', 'builds'], answer: 1, explain: 'Pasiva pasada → was built.' },
    ],
  },
  {
    id: 'c1-idioms', title: 'Idioms & collocations', area: 'Vocabulary', level: 'C1',
    quizzes: [
      { id: 'c1-id-1', q: '"Break the ice" significa:', options: ['Romper hielo', 'Iniciar conversación', 'Tener frío', 'Fallar'], answer: 1, explain: 'Romper el hielo socialmente.' },
      { id: 'c1-id-2', q: '"Once in a blue moon" significa:', options: ['Cada luna', 'Muy rara vez', 'De noche', 'Siempre'], answer: 1, explain: 'Muy rara vez.' },
      { id: 'c1-id-3', q: '"Make a decision" — el verbo correcto es:', options: ['do', 'make', 'take', 'have'], answer: 1, explain: 'Collocation: make a decision.' },
    ],
  },
  {
    id: 'c2-nuance', title: 'Advanced nuance', area: 'Writing', level: 'C2',
    quizzes: [
      { id: 'c2-nu-1', q: 'Most formal: "I ___ be grateful if you could help."', options: ['will', 'would', 'should', 'can'], answer: 1, explain: '"would" suaviza y formaliza.' },
      { id: 'c2-nu-2', q: 'Choose the precise word: a ___ argument (very convincing).', options: ['cogent', 'big', 'nice', 'long'], answer: 0, explain: 'Cogent = convincente, sólido.' },
    ],
  },
  {
    id: 'a1-numbers', title: 'Numbers & colors', area: 'Vocabulary', level: 'A1',
    quizzes: [
      { id: 'a1-num-1', q: '"Tres" en inglés:', options: ['Free', 'Three', 'Tree', 'Third'], answer: 1, explain: 'Three = tres.' },
      { id: 'a1-num-2', q: '"Rojo" en inglés:', options: ['Red', 'Read', 'Rad', 'Round'], answer: 0, explain: 'Red = rojo.' },
      { id: 'a1-num-3', q: '"Doce" en inglés:', options: ['Twenty', 'Twelve', 'Twelfth', 'Two'], answer: 1, explain: 'Twelve = doce.' },
      { id: 'a1-num-4', q: '"Negro" en inglés:', options: ['Blue', 'Brown', 'Black', 'Block'], answer: 2, explain: 'Black = negro.' },
    ],
  },
  {
    id: 'a2-future', title: 'Future with "will" & "going to"', area: 'Grammar', level: 'A2',
    quizzes: [
      { id: 'a2-fut-1', q: 'I think it ___ rain.', options: ['will', 'going to', 'is', 'would'], answer: 0, explain: 'Predicción/espontáneo → "will".' },
      { id: 'a2-fut-2', q: 'Look at those clouds! It ___ rain.', options: ['will', 'is going to', 'goes', 'rains'], answer: 1, explain: 'Evidencia presente → "going to".' },
      { id: 'a2-fut-3', q: 'They ___ travel next summer (plan).', options: ['will', 'are going to', 'go', 'went'], answer: 1, explain: 'Plan → "going to".' },
      { id: 'a2-fut-4', q: 'I ___ help you, don\'t worry.', options: ['am going to', 'will', 'go', 'would'], answer: 1, explain: 'Decisión en el momento → "will".' },
    ],
  },
  {
    id: 'b1-modals', title: 'Modal verbs', area: 'Grammar', level: 'B1',
    quizzes: [
      { id: 'b1-mod-1', q: 'You ___ smoke here (prohibido).', options: ['must', "mustn't", "don't", 'can'], answer: 1, explain: "mustn't = prohibición." },
      { id: 'b1-mod-2', q: 'You ___ see a doctor (consejo).', options: ['should', 'must', 'can', 'will'], answer: 0, explain: 'should = consejo.' },
      { id: 'b1-mod-3', q: 'She ___ speak three languages (habilidad).', options: ['must', 'should', 'can', 'may'], answer: 2, explain: 'can = habilidad.' },
      { id: 'b1-mod-4', q: '___ I open the window? (permiso)', options: ['Must', 'May', 'Should', 'Will'], answer: 1, explain: 'May = permiso formal.' },
    ],
  },
  {
    id: 'b2-relative', title: 'Relative clauses', area: 'Grammar', level: 'B2',
    quizzes: [
      { id: 'b2-rel-1', q: 'The man ___ called is my boss.', options: ['which', 'who', 'where', 'whose'], answer: 1, explain: 'Persona → "who".' },
      { id: 'b2-rel-2', q: 'The book ___ I read was great.', options: ['who', 'whose', 'which', 'when'], answer: 2, explain: 'Cosa → "which/that".' },
      { id: 'b2-rel-3', q: 'That\'s the city ___ I was born.', options: ['which', 'who', 'where', 'that'], answer: 2, explain: 'Lugar → "where".' },
    ],
  },
  {
    id: 'c1-connectors', title: 'Connectors & cohesion', area: 'Writing', level: 'C1',
    quizzes: [
      { id: 'c1-con-1', q: '___ the rain, we went out.', options: ['Despite', 'Although', 'Because', 'So'], answer: 0, explain: '"Despite" + sustantivo.' },
      { id: 'c1-con-2', q: 'He studied hard; ___, he passed.', options: ['however', 'therefore', 'although', 'despite'], answer: 1, explain: 'Consecuencia → "therefore".' },
      { id: 'c1-con-3', q: '___ being tired, she kept going.', options: ['Despite', 'In spite', 'Although', 'However'], answer: 0, explain: '"Despite" + gerundio.' },
    ],
  },
  {
    id: 'a1-plurals', title: 'Plurals', area: 'Grammar', level: 'A1',
    quizzes: [
      { id: 'a1-pl-1', q: 'One box, two ___.', options: ['boxs', 'boxes', 'boxen', 'box'], answer: 1, explain: 'Termina en -x → +es.' },
      { id: 'a1-pl-2', q: 'One baby, two ___.', options: ['babys', 'babies', 'babyes', 'baby'], answer: 1, explain: 'Consonante + y → -ies.' },
      { id: 'a1-pl-3', q: 'One man, two ___.', options: ['mans', 'men', 'mens', 'man'], answer: 1, explain: 'Plural irregular: man → men.' },
      { id: 'a1-pl-4', q: 'One child, two ___.', options: ['childs', 'childes', 'children', 'child'], answer: 2, explain: 'Irregular: child → children.' },
    ],
  },
  {
    id: 'a1-family', title: 'Family', area: 'Vocabulary', level: 'A1',
    quizzes: [
      { id: 'a1-fam-1', q: '"Hermano" en inglés:', options: ['Brother', 'Father', 'Cousin', 'Uncle'], answer: 0, explain: 'Brother = hermano.' },
      { id: 'a1-fam-2', q: '"Madre" en inglés:', options: ['Mother', 'Daughter', 'Sister', 'Aunt'], answer: 0, explain: 'Mother = madre.' },
      { id: 'a1-fam-3', q: '"Abuelo" en inglés:', options: ['Grandfather', 'Nephew', 'Father', 'Son'], answer: 0, explain: 'Grandfather = abuelo.' },
      { id: 'a1-fam-4', q: '"Hija" en inglés:', options: ['Son', 'Daughter', 'Sister', 'Wife'], answer: 1, explain: 'Daughter = hija.' },
    ],
  },
  {
    id: 'a2-there', title: 'There is / There are', area: 'Grammar', level: 'A2',
    quizzes: [
      { id: 'a2-th-1', q: '___ a book on the table.', options: ['There is', 'There are', 'It is', 'They are'], answer: 0, explain: 'Singular → there is.' },
      { id: 'a2-th-2', q: '___ three apples.', options: ['There is', 'There are', 'It is', 'Have'], answer: 1, explain: 'Plural → there are.' },
      { id: 'a2-th-3', q: '___ any milk?', options: ['Is there', 'Are there', 'There is', 'Have'], answer: 0, explain: 'Incontable singular → is there.' },
      { id: 'a2-th-4', q: 'There ___ many people here.', options: ['is', 'are', 'be', 'am'], answer: 1, explain: 'people → are.' },
    ],
  },
  {
    id: 'a2-food', title: 'Food & drinks', area: 'Vocabulary', level: 'A2',
    quizzes: [
      { id: 'a2-food-1', q: '"Pollo" en inglés:', options: ['Beef', 'Chicken', 'Pork', 'Fish'], answer: 1, explain: 'Chicken = pollo.' },
      { id: 'a2-food-2', q: '"Huevo" en inglés:', options: ['Egg', 'Bread', 'Cheese', 'Rice'], answer: 0, explain: 'Egg = huevo.' },
      { id: 'a2-food-3', q: '"Fresa" en inglés:', options: ['Cherry', 'Strawberry', 'Blueberry', 'Peach'], answer: 1, explain: 'Strawberry = fresa.' },
      { id: 'a2-food-4', q: '"Cuchara" en inglés:', options: ['Fork', 'Knife', 'Spoon', 'Plate'], answer: 2, explain: 'Spoon = cuchara.' },
    ],
  },
  {
    id: 'b1-presperf', title: 'Present Perfect', area: 'Grammar', level: 'B1',
    quizzes: [
      { id: 'b1-pp-1', q: 'I ___ never ___ sushi.', options: ['have / eaten', 'has / ate', 'am / eat', 'did / eat'], answer: 0, explain: 'have + participio.' },
      { id: 'b1-pp-2', q: 'She ___ just ___.', options: ['have / arrive', 'has / arrived', 'is / arrived', 'has / arrive'], answer: 1, explain: '3ª persona → has + participio.' },
      { id: 'b1-pp-3', q: 'How long ___ you lived here?', options: ['did', 'have', 'are', 'do'], answer: 1, explain: 'Duración hasta ahora → have.' },
      { id: 'b1-pp-4', q: 'They ___ finished yet.', options: ["haven't", "didn't", "don't", "aren't"], answer: 0, explain: '"yet" → present perfect negativo.' },
    ],
  },
  {
    id: 'b1-business', title: 'Work & business', area: 'Vocabulary', level: 'B1',
    quizzes: [
      { id: 'b1-biz-1', q: '"Reunión" en inglés:', options: ['Meeting', 'Greeting', 'Setting', 'Building'], answer: 0, explain: 'Meeting = reunión.' },
      { id: 'b1-biz-2', q: '"Plazo / fecha límite":', options: ['Timeline', 'Deadline', 'Headline', 'Outline'], answer: 1, explain: 'Deadline = fecha límite.' },
      { id: 'b1-biz-3', q: '"Contratar" (a alguien):', options: ['Fire', 'Hire', 'Higher', 'Hide'], answer: 1, explain: 'Hire = contratar.' },
      { id: 'b1-biz-4', q: '"Sueldo" en inglés:', options: ['Salary', 'Celery', 'Sale', 'Slary'], answer: 0, explain: 'Salary = sueldo.' },
    ],
  },
  {
    id: 'b2-reported', title: 'Reported speech', area: 'Grammar', level: 'B2',
    quizzes: [
      { id: 'b2-rep-1', q: 'He said he ___ tired. ("I am tired")', options: ['is', 'was', 'were', 'has'], answer: 1, explain: 'Present → past en reported.' },
      { id: 'b2-rep-2', q: 'She told me she ___ call. ("I will call")', options: ['will', 'would', 'shall', 'is'], answer: 1, explain: 'will → would.' },
      { id: 'b2-rep-3', q: 'They asked where I ___. ("Where do you live?")', options: ['live', 'lived', 'living', 'do live'], answer: 1, explain: 'Present → past + orden afirmativo.' },
    ],
  },
  {
    id: 'c1-formal', title: 'Formal vocabulary', area: 'Vocabulary', level: 'C1',
    quizzes: [
      { id: 'c1-for-1', q: 'Más formal que "buy":', options: ['get', 'purchase', 'grab', 'take'], answer: 1, explain: 'Purchase = comprar (formal).' },
      { id: 'c1-for-2', q: 'Más formal que "help":', options: ['assist', 'aid up', 'do', 'back'], answer: 0, explain: 'Assist = ayudar (formal).' },
      { id: 'c1-for-3', q: 'Más formal que "ask for":', options: ['want', 'request', 'beg', 'order'], answer: 1, explain: 'Request = solicitar.' },
    ],
  },
  {
    id: 'a1-greetings', title: 'Greetings & basics', area: 'Vocabulary', level: 'A1',
    quizzes: [
      { id: 'a1-gr-1', q: '"Buenos días" en inglés:', options: ['Good night', 'Good morning', 'Good evening', 'Goodbye'], answer: 1, explain: 'Good morning = buenos días.' },
      { id: 'a1-gr-2', q: '"Gracias" en inglés:', options: ['Please', 'Sorry', 'Thank you', 'Welcome'], answer: 2, explain: 'Thank you = gracias.' },
      { id: 'a1-gr-3', q: '"Adiós" en inglés:', options: ['Hello', 'Goodbye', 'Good', 'Bye-bye baby'], answer: 1, explain: 'Goodbye = adiós.' },
      { id: 'a1-gr-4', q: '"Por favor" en inglés:', options: ['Please', 'Sorry', 'Thanks', 'Excuse'], answer: 0, explain: 'Please = por favor.' },
    ],
  },
  {
    id: 'a2-comparatives', title: 'Comparatives & superlatives', area: 'Grammar', level: 'A2',
    quizzes: [
      { id: 'a2-cmp-1', q: 'This box is ___ than that one.', options: ['big', 'bigger', 'biggest', 'more big'], answer: 1, explain: 'Adjetivo corto + -er.' },
      { id: 'a2-cmp-2', q: 'She is the ___ student in class.', options: ['smart', 'smarter', 'smartest', 'most smart'], answer: 2, explain: 'Superlativo corto → -est.' },
      { id: 'a2-cmp-3', q: 'This movie is ___ interesting than the book.', options: ['more', 'most', 'much', 'the more'], answer: 0, explain: 'Adjetivo largo → more.' },
      { id: 'a2-cmp-4', q: 'Good → ___ (comparativo).', options: ['gooder', 'better', 'best', 'more good'], answer: 1, explain: 'Irregular: good → better.' },
    ],
  },
  {
    id: 'b1-questions', title: 'Question forms', area: 'Grammar', level: 'B1',
    quizzes: [
      { id: 'b1-q-1', q: '___ do you live? (lugar)', options: ['What', 'Where', 'When', 'Who'], answer: 1, explain: 'Where = dónde.' },
      { id: 'b1-q-2', q: '___ does the bus arrive? (tiempo)', options: ['Where', 'Who', 'When', 'Why'], answer: 2, explain: 'When = cuándo.' },
      { id: 'b1-q-3', q: '___ are you tired? (razón)', options: ['How', 'Why', 'What', 'Which'], answer: 1, explain: 'Why = por qué.' },
      { id: 'b1-q-4', q: '___ much does it cost?', options: ['How', 'What', 'Where', 'Who'], answer: 0, explain: 'How much = cuánto cuesta.' },
    ],
  },
  {
    id: 'b1-tech', title: 'Tech & interview English', area: 'Vocabulary', level: 'B1',
    quizzes: [
      { id: 'b1-tech-1', q: '"Desarrollador de software":', options: ['Software builder', 'Software developer', 'Software maker', 'Software writer'], answer: 1, explain: 'Software developer.' },
      { id: 'b1-tech-2', q: 'In an interview, "strengths" means:', options: ['debilidades', 'fortalezas', 'sueldos', 'horarios'], answer: 1, explain: 'Strengths = fortalezas.' },
      { id: 'b1-tech-3', q: '"Deploy the application" significa:', options: ['borrar la app', 'desplegar/publicar la app', 'diseñar la app', 'probar la app'], answer: 1, explain: 'Deploy = desplegar.' },
      { id: 'b1-tech-4', q: '"I have experience with…" se usa para:', options: ['pedir empleo', 'hablar de tu experiencia', 'renunciar', 'preguntar la hora'], answer: 1, explain: 'Frase clave en entrevistas.' },
      { id: 'b1-tech-5', q: '"Bug" en desarrollo es:', options: ['una mejora', 'un error en el código', 'un usuario', 'un servidor'], answer: 1, explain: 'Bug = error/defecto.' },
    ],
  },
  {
    id: 'b2-gerunds', title: 'Gerunds & infinitives', area: 'Grammar', level: 'B2',
    quizzes: [
      { id: 'b2-ger-1', q: 'I enjoy ___ code.', options: ['write', 'to write', 'writing', 'wrote'], answer: 2, explain: 'enjoy + gerundio (-ing).' },
      { id: 'b2-ger-2', q: 'I want ___ a developer.', options: ['become', 'to become', 'becoming', 'became'], answer: 1, explain: 'want + infinitivo (to).' },
      { id: 'b2-ger-3', q: 'She decided ___ to Canada.', options: ['moving', 'to move', 'move', 'moved'], answer: 1, explain: 'decide + to + verbo.' },
    ],
  },
  {
    id: 'c1-phrasal2', title: 'Advanced phrasal verbs', area: 'Vocabulary', level: 'C1',
    quizzes: [
      { id: 'c1-ph2-1', q: '"Carry out" significa:', options: ['cargar', 'llevar a cabo / ejecutar', 'salir', 'continuar'], answer: 1, explain: 'Carry out = ejecutar/realizar.' },
      { id: 'c1-ph2-2', q: '"Come up with" significa:', options: ['subir', 'idear / proponer', 'venir con', 'rendirse'], answer: 1, explain: 'Come up with = idear.' },
      { id: 'c1-ph2-3', q: '"Look into" significa:', options: ['mirar dentro', 'investigar', 'cuidar', 'buscar'], answer: 1, explain: 'Look into = investigar.' },
    ],
  },
];

export const ENGLISH_TOTAL = ENGLISH_LESSONS.reduce((n, l) => n + l.quizzes.length, 0);
export const ENGLISH_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

// ── Teoría esencial por lección (solo lo importante) ──
export const LESSON_THEORY: Record<string, string> = {
  'a1-tobe': 'El verbo "to be" (ser/estar) cambia según el sujeto: I am, you/we/they are, he/she/it is. Para preguntar, invierte: "Are you…?".',
  'a1-articles': 'Usa "a" antes de sonido consonántico (a cat) y "an" antes de sonido vocálico (an apple). "the" es para algo específico.',
  'a1-vocab': 'Memoriza vocabulario básico del día a día asociándolo a imágenes y a frases, no a palabras sueltas.',
  'a1-numbers': 'Practica números y colores en voz alta. Son la base para precios, horas y descripciones.',
  'a1-plurals': 'Plural regular = +s. Si termina en -s/-x/-ch/-sh → +es. Consonante + y → -ies. Hay irregulares: man→men, child→children.',
  'a1-family': 'Vocabulario de familia: padre/madre, hermano/a, abuelo/a, hijo/a. Útil para presentarte y hablar de ti.',
  'a2-present': 'Present Simple = rutinas y verdades. En 3ª persona (he/she/it) el verbo lleva -s. Pregunta/negación con do/does.',
  'a2-prep': 'Preposiciones de lugar: in (dentro), on (sobre una superficie), at (punto/lugar concreto, "at home").',
  'a2-future': '"will" para decisiones del momento o predicciones; "going to" para planes y evidencia presente.',
  'a2-there': '"There is" para singular/incontable; "There are" para plural. Existencia ("hay").',
  'a2-food': 'Vocabulario de comida y utensilios: clave para restaurantes y pedir.',
  'b1-pastperf': 'Past Simple = acción terminada (went). Past Continuous = acción en progreso en el pasado (was going).',
  'b1-phrasal': 'Los phrasal verbs (verbo + partícula) cambian de significado. Apréndelos como una unidad, en contexto.',
  'b1-reading': 'En comprensión lectora, busca primero la idea general y luego datos concretos. No traduzcas palabra por palabra.',
  'b1-presperf': 'Present Perfect (have/has + participio) conecta pasado y presente: experiencias, algo reciente o no terminado.',
  'b1-business': 'Vocabulario laboral esencial: meeting, deadline, hire, salary. Útil en entrevistas y correos.',
  'b1-modals': 'Modales: can (habilidad), should (consejo), must/mustn\'t (obligación/prohibición), may (permiso).',
  'b2-conditionals': '1er cond. (real): if + presente, will. 2º (irreal presente): if + pasado, would. 3º (pasado): if + had + part., would have.',
  'b2-passive': 'Pasiva = be + participio. El foco pasa a la acción/objeto: "The book is read".',
  'b2-relative': 'Relativos: who (personas), which/that (cosas), where (lugar), whose (posesión).',
  'b2-reported': 'Estilo indirecto: el tiempo "retrocede" (am→was, will→would) y cambian pronombres y orden en preguntas.',
  'c1-idioms': 'Los idioms no se traducen literal. Aprende los más comunes y úsalos con naturalidad.',
  'c1-connectors': 'Conectores dan cohesión: however (contraste), therefore (consecuencia), despite/although (concesión).',
  'c1-formal': 'En contextos formales: purchase (buy), assist (help), request (ask for). Suben el registro.',
  'c2-nuance': 'En C2 importa el matiz: elegir la palabra precisa y el registro adecuado (would, cogent…).',
};

// ── Pronunciación (micrófono) ──
export type Speak = { id: string; level: string; phrase: string; es: string };
export const SPEAKING: Speak[] = [
  { id: 'sp-a1-1', level: 'A1', phrase: 'Hello, my name is Ana', es: 'Hola, me llamo Ana' },
  { id: 'sp-a1-2', level: 'A1', phrase: 'I am from Mexico', es: 'Soy de México' },
  { id: 'sp-a1-3', level: 'A1', phrase: 'Nice to meet you', es: 'Mucho gusto' },
  { id: 'sp-a2-1', level: 'A2', phrase: 'I usually wake up at seven', es: 'Normalmente me despierto a las siete' },
  { id: 'sp-a2-2', level: 'A2', phrase: 'I would like a coffee, please', es: 'Quisiera un café, por favor' },
  { id: 'sp-b1-1', level: 'B1', phrase: 'I have been studying English for two years', es: 'Llevo dos años estudiando inglés' },
  { id: 'sp-b1-2', level: 'B1', phrase: 'Could you tell me the way to the station', es: '¿Podrías indicarme el camino a la estación?' },
  { id: 'sp-b2-1', level: 'B2', phrase: 'If I had more time, I would travel more', es: 'Si tuviera más tiempo, viajaría más' },
  { id: 'sp-c1-1', level: 'C1', phrase: 'I would appreciate it if you could help me', es: 'Agradecería que pudieras ayudarme' },
  { id: 'sp-b1-3', level: 'B1', phrase: 'I have three years of experience as a developer', es: 'Tengo tres años de experiencia como desarrollador' },
  { id: 'sp-b2-2', level: 'B2', phrase: 'I am confident I can solve this problem', es: 'Estoy seguro de que puedo resolver este problema' },
  { id: 'sp-b2-3', level: 'B2', phrase: 'Could you tell me more about the role?', es: '¿Podrías contarme más sobre el puesto?' },
  { id: 'sp-c1-2', level: 'C1', phrase: 'I would be glad to walk you through my project', es: 'Con gusto te explico mi proyecto paso a paso' },
  { id: 'sp-c2-1', level: 'C2', phrase: 'Despite the setbacks, we managed to succeed', es: 'A pesar de los contratiempos, logramos tener éxito' },
];
export const SPEAKING_TOTAL = SPEAKING.length;

// ── Listening: escucha un texto en inglés (TTS) y responde una pregunta de comprensión ──
export type Listen = { id: string; level: string; text: string; q: string; options: string[]; answer: number };
export const LISTENING: Listen[] = [
  { id: 'lis-1', level: 'A2', text: 'My name is Ana. I am from Mexico. I am a student and I love learning English.', q: 'Where is Ana from?', options: ['Spain', 'Mexico', 'Canada', 'Japan'], answer: 1 },
  { id: 'lis-2', level: 'A2', text: 'I usually wake up at seven, drink coffee, and check my email before work.', q: 'What does the person drink?', options: ['Tea', 'Juice', 'Coffee', 'Water'], answer: 2 },
  { id: 'lis-3', level: 'A2', text: 'Yesterday I went to the gym in the morning. After that, I studied programming for two hours.', q: 'What did the person do after the gym?', options: ['Slept', 'Studied programming', 'Watched TV', 'Cooked'], answer: 1 },
  { id: 'lis-4', level: 'B1', text: 'I have been learning to code for three years. My goal is to become a developer and move to Canada.', q: "What is the person's goal?", options: ['Travel for fun', 'Become a developer in Canada', 'Open a restaurant', 'Learn to cook'], answer: 1 },
  { id: 'lis-5', level: 'B1', text: 'The meeting is scheduled for nine in the morning. Please bring your laptop and the report.', q: 'What should you bring?', options: ['Lunch and a pen', 'Laptop and the report', 'Nothing', 'A book'], answer: 1 },
  { id: 'lis-6', level: 'B1', text: 'Could you tell me how to get to the train station? Go straight and turn left at the second corner.', q: 'Where do you turn left?', options: ['First corner', 'Second corner', 'Third corner', 'You turn right'], answer: 1 },
  { id: 'lis-7', level: 'B2', text: 'Although the project was delayed, the team managed to deliver it on time by working extra hours.', q: 'How did the team deliver on time?', options: ['They canceled it', 'By working extra hours', 'They asked for more time', 'They hired more people'], answer: 1 },
  { id: 'lis-8', level: 'B2', text: 'In the interview, they asked me about my experience with React and how I solve problems under pressure.', q: 'What did they ask about?', options: ['Salary only', 'React experience and problem-solving', 'His hobbies', 'The weather'], answer: 1 },
  { id: 'lis-9', level: 'A2', text: 'My favorite hobby is playing video games. I also enjoy reading and going for walks.', q: "What is the person's favorite hobby?", options: ['Reading', 'Walking', 'Playing video games', 'Cooking'], answer: 2 },
  { id: 'lis-10', level: 'B1', text: 'The store opens at nine and closes at six, but on Sundays it is closed all day.', q: 'When is the store closed?', options: ['On Mondays', 'At nine', 'On Sundays', 'At six'], answer: 2 },
  { id: 'lis-11', level: 'B2', text: 'Even though I was nervous, the interview went well and they offered me the job.', q: 'What was the result of the interview?', options: ['He was rejected', 'They offered him the job', 'It was canceled', 'He left early'], answer: 1 },
  { id: 'lis-12', level: 'C1', text: 'I would appreciate it if you could send me the report by tomorrow morning at the latest.', q: 'When is the report due?', options: ['Tonight', 'Tomorrow morning', 'Next week', 'In an hour'], answer: 1 },
];
export const LISTENING_TOTAL = LISTENING.length;

// ── Exámenes por nivel (más difíciles; corte 80%) ──
export type EngExamQ = { id: string; q: string; options: string[]; answer: number };
export type EngExam = { pass: number; questions: EngExamQ[] };

export const ENGLISH_EXAMS: Record<string, EngExam> = {
  A1: { pass: 80, questions: [
    { id: 'ex-a1-1', q: '___ she from Canada?', options: ['Am', 'Is', 'Are', 'Do'], answer: 1 },
    { id: 'ex-a1-2', q: 'I have ___ orange and ___ banana.', options: ['a / a', 'an / a', 'a / an', 'an / an'], answer: 1 },
    { id: 'ex-a1-3', q: 'They ___ my parents.', options: ['is', 'am', 'are', 'be'], answer: 2 },
    { id: 'ex-a1-4', q: '"Jueves" en inglés:', options: ['Tuesday', 'Thursday', 'Wednesday', 'Saturday'], answer: 1 },
    { id: 'ex-a1-5', q: 'Negative: "She is happy." →', options: ['She not is happy', 'She isn\'t happy', 'She don\'t happy', 'She no happy'], answer: 1 },
    { id: 'ex-a1-6', q: 'There ___ two books on the table.', options: ['is', 'are', 'be', 'am'], answer: 1 },
    { id: 'ex-a1-7', q: 'Plural of "child":', options: ['childs', 'children', 'childes', 'child'], answer: 1 },
    { id: 'ex-a1-8', q: 'She ___ a car.', options: ['have', 'has', 'haves', 'having'], answer: 1 },
    { id: 'ex-a1-9', q: 'The day after Monday is…', options: ['Sunday', 'Tuesday', 'Wednesday', 'Friday'], answer: 1 },
    { id: 'ex-a1-10', q: 'Negative: "I am a teacher." →', options: ['I not am a teacher', 'I am not a teacher', 'I no am a teacher', 'Not I am a teacher'], answer: 1 },
    { id: 'ex-a1-11', q: '"This is ___ apple and that is ___ book."', options: ['a / an', 'an / a', 'a / a', 'an / an'], answer: 1 },
    { id: 'ex-a1-12', q: '"Agua" en inglés:', options: ['Wine', 'Water', 'Milk', 'Juice'], answer: 1 },
  ] },
  A2: { pass: 80, questions: [
    { id: 'ex-a2-1', q: 'Yesterday I ___ to the cinema.', options: ['go', 'goed', 'went', 'gone'], answer: 2 },
    { id: 'ex-a2-2', q: 'She ___ TV right now.', options: ['watch', 'watches', 'is watching', 'watched'], answer: 2 },
    { id: 'ex-a2-3', q: 'I am taller ___ my brother.', options: ['that', 'than', 'then', 'as'], answer: 1 },
    { id: 'ex-a2-4', q: 'There ___ some milk in the fridge.', options: ['are', 'is', 'have', 'be'], answer: 1 },
    { id: 'ex-a2-5', q: '___ he like football?', options: ['Do', 'Is', 'Does', 'Has'], answer: 2 },
    { id: 'ex-a2-6', q: 'Comparative of "good":', options: ['gooder', 'more good', 'better', 'best'], answer: 2 },
    { id: 'ex-a2-7', q: 'She has ___ to Japan twice.', options: ['been', 'be', 'being', 'went'], answer: 0 },
    { id: 'ex-a2-8', q: 'I was reading when the phone ___.', options: ['rings', 'rang', 'was ringing', 'ring'], answer: 1 },
    { id: 'ex-a2-9', q: '"___ water do you drink a day?"', options: ['How many', 'How much', 'How long', 'How often'], answer: 1 },
    { id: 'ex-a2-10', q: 'Future: "I ___ call you later."', options: ['will', 'am', 'do', 'have'], answer: 0 },
    { id: 'ex-a2-11', q: 'Past simple of "buy":', options: ['buyed', 'bought', 'buied', 'buy'], answer: 1 },
    { id: 'ex-a2-12', q: '"There isn\'t ___ milk left."', options: ['some', 'any', 'many', 'a'], answer: 1 },
  ] },
  B1: { pass: 80, questions: [
    { id: 'ex-b1-1', q: 'I have lived here ___ 2019.', options: ['for', 'since', 'from', 'ago'], answer: 1 },
    { id: 'ex-b1-2', q: 'If it rains, we ___ at home.', options: ['stay', 'will stay', 'would stay', 'stayed'], answer: 1 },
    { id: 'ex-b1-3', q: "She's the person ___ helped me.", options: ['which', 'who', 'whose', 'whom'], answer: 1 },
    { id: 'ex-b1-4', q: 'I used ___ smoke, but I quit.', options: ['to', 'for', 'at', 'in'], answer: 0 },
    { id: 'ex-b1-5', q: 'The report ___ by Friday.', options: ['must finish', 'must be finished', 'must finished', 'must to finish'], answer: 1 },
    { id: 'ex-b1-6', q: 'Reported: He said, "I am tired." → He said he ___ tired.', options: ['is', 'was', 'were', 'be'], answer: 1 },
    { id: 'ex-b1-7', q: '2nd conditional: "If I ___ rich, I would travel."', options: ['am', 'was', 'were', 'will be'], answer: 2 },
    { id: 'ex-b1-8', q: 'I look forward to ___ from you.', options: ['hear', 'hearing', 'heard', 'be hearing'], answer: 1 },
    { id: 'ex-b1-9', q: '"I ___ him last week." (tiempo definido)', options: ['have seen', 'saw', 'seen', 'have saw'], answer: 1 },
    { id: 'ex-b1-10', q: 'Used to: "I ___ play football as a kid."', options: ['use to', 'used to', 'am used to', 'using to'], answer: 1 },
    { id: 'ex-b1-11', q: 'Zero conditional: "If you heat ice, it ___."', options: ['melts', 'will melt', 'melted', 'would melt'], answer: 0 },
    { id: 'ex-b1-12', q: 'Present perfect continuous: "I ___ studying all day."', options: ['have been', 'has been', 'am', 'was'], answer: 0 },
  ] },
  B2: { pass: 80, questions: [
    { id: 'ex-b2-1', q: 'By next year, I ___ here for a decade.', options: ['will work', 'will have worked', 'have worked', 'work'], answer: 1 },
    { id: 'ex-b2-2', q: 'He suggested ___ earlier.', options: ['to leave', 'leaving', 'leave', 'left'], answer: 1 },
    { id: 'ex-b2-3', q: 'I wish I ___ more free time.', options: ['have', 'had', 'will have', 'would have'], answer: 1 },
    { id: 'ex-b2-4', q: 'The project, ___ was delayed, is done now.', options: ['that', 'who', 'which', 'what'], answer: 2 },
    { id: 'ex-b2-5', q: 'You ___ have told me earlier!', options: ['should', 'must', 'would', 'will'], answer: 0 },
    { id: 'ex-b2-6', q: '3rd conditional: "If she had studied, she ___ passed."', options: ['would', 'would have', 'will have', 'had'], answer: 1 },
    { id: 'ex-b2-7', q: 'Passive: "They built it in 1990." → "It ___ in 1990."', options: ['was built', 'is built', 'built', 'has built'], answer: 0 },
    { id: 'ex-b2-8', q: 'By the time we arrived, the film ___.', options: ['started', 'had started', 'has started', 'starts'], answer: 1 },
    { id: 'ex-b2-9', q: 'Reported: "She asked me where I ___."', options: ['live', 'lived', 'am living', 'do live'], answer: 1 },
    { id: 'ex-b2-10', q: 'Causative: "I had my car ___."', options: ['repair', 'repaired', 'repairing', 'to repair'], answer: 1 },
    { id: 'ex-b2-11', q: '"Despite ___ tired, he finished the project."', options: ['be', 'being', 'was', 'to be'], answer: 1 },
    { id: 'ex-b2-12', q: '"I\'d rather you ___ smoke here."', options: ["don't", "didn't", 'not', 'wouldn\'t'], answer: 1 },
  ] },
  C1: { pass: 80, questions: [
    { id: 'ex-c1-1', q: '___ harder, he would have passed.', options: ['If he studied', 'Had he studied', 'Did he study', 'Were he study'], answer: 1 },
    { id: 'ex-c1-2', q: "She's used to ___ under pressure.", options: ['work', 'working', 'worked', 'to work'], answer: 1 },
    { id: 'ex-c1-3', q: "It's high time we ___ a decision.", options: ['make', 'made', 'will make', 'making'], answer: 1 },
    { id: 'ex-c1-4', q: 'Not only ___ late, but he also forgot the keys.', options: ['he was', 'was he', 'he is', 'is he'], answer: 1 },
    { id: 'ex-c1-5', q: "I'd rather you ___ that again.", options: ["don't do", "didn't do", 'not do', "won't do"], answer: 1 },
    { id: 'ex-c1-6', q: 'Inversion: "Seldom ___ such talent."', options: ['I have seen', 'have I seen', 'I saw', 'did I saw'], answer: 1 },
    { id: 'ex-c1-7', q: 'No sooner ___ when it started to rain.', options: ['had we left', 'we had left', 'we left', 'did we leave'], answer: 0 },
    { id: 'ex-c1-8', q: 'Choose the natural phrasal verb: "We need to ___ the meeting (posponer)."', options: ['put off', 'put on', 'put up', 'put out'], answer: 0 },
    { id: 'ex-c1-9', q: 'Cleft sentence: "It was John ___ broke the window."', options: ['who', 'which', 'whom', 'what'], answer: 0 },
    { id: 'ex-c1-10', q: 'Mixed conditional: "If I had saved money, I ___ rich now."', options: ['would be', 'would have been', 'will be', 'am'], answer: 0 },
    { id: 'ex-c1-11', q: 'Phrasal verb: "She ___ a fortune (heredó)."', options: ['came into', 'came across', 'came up', 'came over'], answer: 0 },
    { id: 'ex-c1-12', q: 'Subjunctive: "I suggest that he ___ on time."', options: ['is', 'be', 'was', 'will be'], answer: 1 },
  ] },
};

// ── Deletreo (Spelling): palabras tramposas para escuchar y escribir ──
export type SpellWord = { id: string; word: string; hint: string };
export const SPELLING_WORDS: SpellWord[] = [
  { id: 'spw-1', word: 'necessary', hint: 'necesario/a' },
  { id: 'spw-2', word: 'definitely', hint: 'definitivamente' },
  { id: 'spw-3', word: 'separate', hint: 'separar / separado' },
  { id: 'spw-4', word: 'receive', hint: 'recibir' },
  { id: 'spw-5', word: 'beginning', hint: 'comienzo / principio' },
  { id: 'spw-6', word: 'environment', hint: 'entorno / medio ambiente' },
  { id: 'spw-7', word: 'recommend', hint: 'recomendar' },
  { id: 'spw-8', word: 'embarrassed', hint: 'avergonzado/a' },
  { id: 'spw-9', word: 'rhythm', hint: 'ritmo' },
  { id: 'spw-10', word: 'restaurant', hint: 'restaurante' },
  { id: 'spw-11', word: 'schedule', hint: 'horario / agenda' },
  { id: 'spw-12', word: 'knowledge', hint: 'conocimiento' },
  { id: 'spw-13', word: 'business', hint: 'negocio / empresa' },
  { id: 'spw-14', word: 'government', hint: 'gobierno' },
  { id: 'spw-15', word: 'immediately', hint: 'inmediatamente' },
  { id: 'spw-16', word: 'foreign', hint: 'extranjero/a' },
  { id: 'spw-17', word: 'colleague', hint: 'colega / compañero de trabajo' },
  { id: 'spw-18', word: 'experience', hint: 'experiencia' },
  { id: 'spw-19', word: 'available', hint: 'disponible' },
  { id: 'spw-20', word: 'successful', hint: 'exitoso/a' },
];
