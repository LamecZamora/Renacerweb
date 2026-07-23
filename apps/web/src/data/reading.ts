// Lecturas (Reading) por nivel con comprensión calificada. Lee Y escucha (TTS).
export type ReadingQ = { q: string; options: string[]; answer: number };
export type ReadingPassage = { id: string; level: string; title: string; text: string; questions: ReadingQ[] };

export const READINGS: ReadingPassage[] = [
  {
    id: 'read-a1', level: 'A1', title: 'My Daily Routine',
    text: "My name is Leo. I am a student and I also work. Every day, I wake up at six o'clock. I eat breakfast and I go to work. In the afternoon, I study computer science. At night, I write code for my own projects. I want to move to Canada next year. I am learning English every day.",
    questions: [
      { q: 'What does Leo study?', options: ['Medicine', 'Computer science', 'History', 'Art'], answer: 1 },
      { q: 'What time does he wake up?', options: ["Six o'clock", "Seven o'clock", "Eight o'clock", "Nine o'clock"], answer: 0 },
      { q: 'What does he do at night?', options: ['He sleeps', 'He watches TV', 'He writes code', 'He studies medicine'], answer: 2 },
      { q: 'Where does he want to move?', options: ['The USA', 'Canada', 'Spain', 'Brazil'], answer: 1 },
      { q: 'What is he learning every day?', options: ['French', 'English', 'Math', 'Music'], answer: 1 },
    ],
  },
  {
    id: 'read-a2', level: 'A2', title: 'A New Opportunity',
    text: "Last year, my friend moved to another country to find a better job. He didn't speak English very well, but he studied every day for six months. He watched videos, listened to podcasts, and talked to people online. It was difficult at first, but he didn't give up. Now he works as a developer and he is going to buy a house next year. His story shows that hard work and patience can change your life.",
    questions: [
      { q: 'Why did the friend move?', options: ['For vacation', 'To find a better job', 'To study art', 'To visit family'], answer: 1 },
      { q: 'How long did he study English?', options: ['Two months', 'Six months', 'One year', 'Two years'], answer: 1 },
      { q: 'What did he NOT do to learn English?', options: ['Watch videos', 'Listen to podcasts', 'Talk to people online', 'Take a formal class'], answer: 3 },
      { q: 'What is his job now?', options: ['Teacher', 'Developer', 'Doctor', 'Chef'], answer: 1 },
      { q: 'What is he going to do next year?', options: ['Move again', 'Buy a house', 'Change jobs', 'Study more'], answer: 1 },
    ],
  },
  {
    id: 'read-b1', level: 'B1', title: 'Remote Work and Moving Abroad',
    text: "More and more developers are working remotely for companies in other countries. This has changed the way people plan their careers. If you have strong technical skills, you can often find a job before you even move. However, moving to a new country is not only about money — it also requires adapting to a different culture, learning how people communicate at work, and sometimes waiting months for visa approval. Many people who succeed abroad say that patience and consistent daily effort matter more than natural talent. It's never too late to build the skills you need.",
    questions: [
      { q: 'What has changed how people plan their careers?', options: ['Higher salaries', 'Remote work', 'Shorter visas', 'New universities'], answer: 1 },
      { q: 'Besides money, what do you need to move abroad?', options: ['A car', 'Cultural adaptation', 'A degree', 'A visa lawyer'], answer: 1 },
      { q: 'What do successful people say matters most?', options: ['Natural talent', 'Luck', 'Patience and consistent effort', 'Family connections'], answer: 2 },
      { q: 'What can sometimes take months?', options: ['Learning to code', 'Visa approval', 'Finding an apartment', 'Making friends'], answer: 1 },
      { q: 'What is the main message of the text?', options: ["It's too late to start", 'Skills can be built with effort over time', "English isn't necessary", 'Talent beats effort'], answer: 1 },
    ],
  },
  {
    id: 'read-b2', level: 'B2', title: 'Adapting to a New Work Culture',
    text: "When developers move from Latin America to Canada, one of the biggest adjustments isn't technical — it's cultural. In many Canadian workplaces, feedback is given indirectly, disagreements are expressed politely, and silence in a meeting doesn't necessarily mean agreement. Newcomers are often surprised by how much emphasis is placed on written communication; a poorly worded email can be misread as unprofessional, even if the technical work is excellent. Some companies also expect employees to speak up in meetings, which can feel uncomfortable for people who were taught that deferring to seniority was a sign of respect. The good news is that this adjustment period is temporary, and most people adapt within their first year.",
    questions: [
      { q: 'What is one of the biggest adjustments for newcomers?', options: ['Learning new languages', 'Cultural communication style', 'Finding housing', 'The weather'], answer: 1 },
      { q: 'How is feedback typically given in Canadian workplaces?', options: ['Very directly', 'Indirectly and politely', 'Only in writing', 'Never given'], answer: 1 },
      { q: 'What can be misread as unprofessional?', options: ['A poorly worded email', 'Being late once', 'Asking questions', 'Working remotely'], answer: 0 },
      { q: 'What do some companies expect in meetings?', options: ['Total silence', 'Employees to speak up', 'No questions', 'Only the boss talks'], answer: 1 },
      { q: 'How long does adaptation typically take?', options: ['A few weeks', 'Their first year', 'Five years', 'It never happens'], answer: 1 },
    ],
  },
  {
    id: 'read-c1', level: 'C1', title: "The Myth of 'Just Being Fluent'",
    text: "There's a persistent myth that fluency is a fixed destination you eventually reach, after which communication becomes effortless. In reality, even highly proficient non-native speakers continue to encounter friction: idioms that don't translate cleanly, humor that relies on cultural references, and the subtle difference between what is said and what is meant. A Canadian colleague might respond to a bad idea with 'that's certainly an interesting approach,' and a newcomer unfamiliar with this understatement might take the comment at face value, entirely missing the polite criticism within it. What separates confident communicators isn't the absence of these moments, but the ability to recover from them gracefully — to ask for clarification without embarrassment, and to treat every misunderstanding as data rather than failure.",
    questions: [
      { q: 'What myth does the text challenge?', options: ['That English is hard', 'That fluency is a fixed destination with no friction', 'That Canadians are polite', "That grammar doesn't matter"], answer: 1 },
      { q: "What does the colleague's comment illustrate?", options: ['Direct criticism', 'Polite understatement hiding real meaning', 'A compliment', 'An insult'], answer: 1 },
      { q: 'What separates confident communicators?', options: ['Perfect grammar', 'Never making mistakes', 'Recovering gracefully from misunderstandings', 'Living abroad a decade'], answer: 2 },
      { q: 'How does the text suggest treating misunderstandings?', options: ['As failures to hide', 'As data, not failure', 'As reasons to stop', "As proof you're not ready"], answer: 1 },
      { q: 'What kind of friction do proficient speakers still face?', options: ['Basic vocabulary', 'Idioms, humor, and implied meaning', 'The alphabet', 'Numbers'], answer: 1 },
    ],
  },
];
