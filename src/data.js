export const SKILLS = [
  { key: "reading",  label: "Reading",         current: 186, c1: 180, c2: 200, color: "#22c55e" },
  { key: "uoe",      label: "Use of English",  current: 151, c1: 180, c2: 200, color: "#ef4444" },
  { key: "writing",  label: "Writing",         current: 161, c1: 180, c2: 200, color: "#f59e0b" },
  { key: "listening",label: "Listening",       current: 165, c1: 180, c2: 200, color: "#3b82f6" },
  { key: "speaking", label: "Speaking",        current: 151, c1: 180, c2: 200, color: "#a855f7" },
];

export const TABS = ["Home", "Plan", "Tracker", "Errores", "Diario", "Lectura", "SR", "Shadow", "Output"];

export const CAT_COLORS = { uoe: "#ef4444", speaking: "#a855f7", writing: "#f59e0b", listening: "#3b82f6", reading: "#22c55e", sr: "#06b6d4", review: "#64748b" };

export const TOTAL_WEEKS = 15;
export const EXAM_DATE = "26 de septiembre 2026";
export const START_DATE = new Date(2026, 5, 15); // lunes 15 de junio de 2026

// Versión del esquema de estado. v2 = plan reconstruido a 15 semanas (junio 2026).
export const SCHEMA_VERSION = 2;

export const PHASES = [
  { name: "Fase 1: Cerrar brechas",   weeks: [1,2,3,4],       focus: "UoE 151→172, Speaking 151→170",          target: "Eliminar gaps críticos",          color: "#ef4444", hrs: "3h L-V + 2h Sáb" },
  { name: "Fase 2: Subir a C1",       weeks: [5,6,7,8],       focus: "Writing→180, Listening→180, todo arriba", target: "Todas ≥175",                      color: "#f59e0b", hrs: "3h L-V + 2h Sáb" },
  { name: "Fase 3: Consolidar C1",    weeks: [9,10,11],       focus: "Mocks semanales, pulir debilidades",      target: "Score global ≥183",               color: "#3b82f6", hrs: "3h L-V + 2h Sáb" },
  { name: "Fase 4: Dominar C1",       weeks: [12,13,14],      focus: "Simulacros completos, timing automático", target: "C1 asegurado (180+)",             color: "#a855f7", hrs: "3h L-V + 2h Sáb" },
  { name: "Fase 5: Tapering",         weeks: [15],            focus: "Repaso ligero, descanso mental",          target: "Llegar fresco al 26 sept",        color: "#22c55e", hrs: "1h max" },
];

export const REMINDERS = [
  { week: 8,  text: "📋 INSCRÍBETE AL CAE — Sesión 26 sept 2026. Centro EC051 4007 Guayaquil.", type: "urgent" },
  { week: 9,  text: "📋 ¿Ya te inscribiste al CAE? Confírmalo esta semana.",                     type: "urgent" },
  { week: 10, text: "📋 Último recordatorio inscripción CAE 26 sept.",                          type: "urgent" },
  { week: 12, text: "🎯 C1 en consolidación — simulacros completos cada semana.",               type: "info"   },
  { week: 14, text: "🧘 Último simulacro completo. Siguiente es tapering.",                      type: "info"   },
  { week: 15, text: "🧘 TAPERING. Repaso ligero. Examen sábado 26 sept.",                       type: "success"},
];

// ─── Week themes: vocabulary + grammar focus + podcast ────────────────────────
export const WEEK_DATA = {
  1:  { vocab: "work & career",               grammar: "Word Formation: sufijos nominales y adjetivales (-tion/-ment/-ness/-ful/-less)", podcast: "BBC 6 Minute English",     podcastQ: "bbc 6 minute english career work 2024",            writing: "essay" },
  2:  { vocab: "technology & communication",  grammar: "Open Cloze: preposiciones en frases fijas (rely on, result in…) + linkers (although, whereas)", podcast: "TED Talk", podcastQ: "TED talk technology future innovation transcript", writing: "essay" },
  3:  { vocab: "environment & sustainability",grammar: "KWT: causative have/get something done + passive avanzado + comparisons", podcast: "BBC 6 Minute English",     podcastQ: "bbc 6 minute english environment climate change",  writing: "essay" },
  4:  { vocab: "health & wellbeing",          grammar: "Multiple Choice Cloze: collocations de salud + idioms y set phrases del CAE", podcast: "BBC The English We Speak", podcastQ: "bbc the english we speak health body idioms",      writing: "report" },
  5:  { vocab: "education & society",         grammar: "Inversions: Not only…, Rarely…, Hardly…when, No sooner…than",       podcast: "TED Talk",                 podcastQ: "TED talk education school future learning",        writing: "proposal" },
  6:  { vocab: "arts & culture",              grammar: "Cleft sentences (It was X who… / What I need is…) + participle clauses", podcast: "Intelligence Squared",     podcastQ: "intelligence squared arts culture debate",         writing: "review" },
  7:  { vocab: "society & relationships",     grammar: "Reporting verbs (suggest/deny/accuse) + ellipsis and substitution", podcast: "The Economist",            podcastQ: "the economist podcast society values",             writing: "letter" },
  8:  { vocab: "crime & justice",             grammar: "Mixed conditionals + wish/if only/it's time + modal perfects (should/must have)", podcast: "BBC In Our Time", podcastQ: "bbc in our time crime law justice",                writing: "article" },
  9:  { vocab: "travel & global cultures",    grammar: "Full UoE Parts 1-4 mixto — drilling cronometrado (todos los patrones)", podcast: "Stuff You Should Know",    podcastQ: "stuff you should know podcast travel culture",     writing: "report" },
  10: { vocab: "science & innovation",        grammar: "UoE speed: máx 60 sec/pregunta — repaso de todos los patrones débiles", podcast: "Science Weekly",           podcastQ: "guardian science weekly podcast 2025",             writing: "review" },
  11: { vocab: "integrated review",           grammar: "Banco de errores: retest dirigido de patrones que siguen fallando", podcast: "BBC Global News",          podcastQ: "bbc global news podcast society",                  writing: "essay" },
  12: { vocab: "exam simulation",             grammar: "Mock completo — objetivo 0 errores en UoE",                        podcast: "TED Talk",                 podcastQ: "TED talk science innovation artificial intelligence", writing: "proposal" },
  13: { vocab: "exam simulation",             grammar: "Mock completo — timing exacto por parte",                          podcast: "The Economist",            podcastQ: "the economist podcast economy finance 2025",       writing: "letter" },
  14: { vocab: "exam simulation",             grammar: "Mock completo — ajuste fino final",                                podcast: "cualquiera favorito",      podcastQ: "english podcast entertaining",                     writing: "article" },
  15: { vocab: "light review",                grammar: "Repaso visual — sin ejercicios nuevos",                            podcast: "cualquiera favorito",      podcastQ: "english podcast entertaining",                     writing: "any" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const C = {
  grammar: (g, v) =>
    `💬 Claude: "I'm preparing for CAE C1 Advanced. Teach me: ${g}. Vocab context: ${v}. Do this: (1) Explain the rule with 3 real CAE examples. (2) Give me 15 practice exercises (transformations / gap-fill). (3) Correct me after each answer. (4) Finish with 5 key collocations about '${v}' using this grammar pattern."`,
  vocab: (v) =>
    `💬 Claude: "I'm a CAE C1 student. Topic: '${v}'. Give me: (1) 12 essential C1 collocations with example sentences. (2) 5 useful phrasal verbs for this topic. (3) 3 idiomatic expressions. Then quiz me — ask me 10 questions using this vocabulary and correct my answers."`,
  speaking: (topic) =>
    `💬 Claude: "Be a CAE Part 2 examiner. Topic: '${topic}'. Give me a long turn task (describe & compare two situations). I'll write my response. Then give me feedback on: (1) speculation language (might/could/seem/appear), (2) vocabulary range, (3) linking phrases, (4) what I could add to sound more C1."`,
  debate: (topic) =>
    `💬 Claude: "Have a debate with me about '${topic}'. I'll argue one side, you argue the other. After 6 exchanges, give me feedback: repeated words I overused, grammar mistakes, and 3 C1 expressions I could have used instead."`,
  writing: (type, topic) =>
    `💬 Claude: "You are a CAE Writing examiner. I'll paste my ${type} about '${topic}'. Score it using the official CAE rubric: Content (0-5), Communicative Achievement (0-5), Organisation (0-5), Language (0-5). Then show me 3 specific sentences from my text and rewrite them at C1 level."`,
  shadow: (q) =>
    `📺 YouTube: busca "${q}" → 1ª escucha completa normal → shadowing 10 min (repite todo con 1-2s de retraso) → grábate 1 min y compara tu ritmo`,
  podcast: (name, q) =>
    `🎧 ${name} → busca en Spotify/YouTube: "${q}" → 1ª escucha SIN subs (anota 5 ideas) → 2ª escucha CON transcript (subraya 5 expresiones C1) → añade las mejores al Log de Lectura`,
  google: (q) =>
    `🔍 Google: "${q}"`,
};

const mk  = (d, tasks) => ({ d, tasks });
const t   = (text, cat, tech, steps = [], resource = '') => ({ t: text, cat, technique: tech, steps, resource });

// ─── Phase generators ─────────────────────────────────────────────────────────

function phase1(w) {
  const wd = WEEK_DATA[w];
  return [
    mk("Lunes", [
      t(
        `UoE: ${wd.grammar} — 25 ejercicios (45 min)`,
        "uoe", "Active Recall — sin mirar reglas primero",
        [
          `Inicia sesión en Claude con el prompt de abajo`,
          `Resuelve los 25 ejercicios que Claude te proponga SIN mirar notas`,
          `Cada error → crea tarjeta SR: [forma errónea] → [correcta + regla]`,
        ],
        C.grammar(wd.grammar, wd.vocab)
      ),
      t(
        `Speaking: Monólogo 3 min grabado — "${wd.vocab}" (30 min)`,
        "speaking", "Output Hypothesis — transcribir fuerza noticing",
        [
          `Grábate hablando 3 min ininterrumpidos sobre "${wd.vocab}"`,
          `Transcribe 1 min del audio — subraya cada error o repetición`,
          `Comprueba: ¿usaste especulación (might/seem/appear)? ¿Linking phrases?`,
        ],
        C.speaking(wd.vocab)
      ),
      t(
        `Vocab: 12 collocations de "${wd.vocab}" + oraciones propias (25 min)`,
        "uoe", "Elaborative Interrogation — crea contexto propio",
        [
          `Pide las 12 collocations a Claude (prompt abajo)`,
          `Escribe 1 oración propia con cada una — en contexto real, no artificial`,
          `Las 3 más difíciles → tarjetas SR desde el Banco de Errores`,
        ],
        C.vocab(wd.vocab)
      ),
      t(
        `Speaking con Claude: debate "${wd.vocab}" (30 min)`,
        "speaking", "Pushed Output — fuerza vocabulario nuevo",
        [
          `Debate 20 min usando mínimo 5 collocations de hoy`,
          `Al terminar: pide a Claude qué palabras repetiste más`,
          `Anota 3 alternativas C1 que Claude sugiera`,
        ],
        C.debate(wd.vocab)
      ),
      t(
        `UoE extra: Open cloze ×1 + razona cada gap en voz alta (30 min)`,
        "uoe", "Elaborative Interrogation — razona cada respuesta",
        [
          `1 open cloze completo (8 gaps) — sin ayuda`,
          `Para cada gap di en voz alta el tipo (preposición / linker / pronombre…)`,
          `Errores → Banco de Errores + tarjeta SR`,
        ],
        C.google(`CAE open cloze practice test site:flo-joe.co.uk OR site:cambridgeenglish.org`)
      ),
      t("SR: Tarjetas pendientes del día (15 min)", "sr", "Spaced Repetition SM-2",
        [`Haz TODAS las tarjetas que salgan hoy — sé honesto con la calificación`], ""),
    ]),
    mk("Martes", [
      t(
        `Listening: ${wd.podcast} — tema "${wd.vocab}" (35 min)`,
        "listening", "Comprehensible Input i+1",
        [
          `1ª escucha SIN subtítulos — anota en inglés 5 ideas principales`,
          `2ª escucha CON transcript — subraya expresiones C1 que no usarías tú`,
          `Registra 3 expresiones en el Log de Lectura → botón "→ SR"`,
        ],
        C.podcast(wd.podcast, wd.podcastQ)
      ),
      t(
        `UoE: ${wd.grammar} — KWT ×15 (35 min)`,
        "uoe", "Interleaving — mezcla patrones distintos",
        [
          `15 transformaciones con el patrón de esta semana`,
          `Máximo 90 seg por pregunta — simula el tiempo del examen`,
          `Cada error: di en voz alta POR QUÉ la respuesta correcta es esa`,
        ],
        C.grammar(wd.grammar, wd.vocab)
      ),
      t(
        `Speaking: Long turn 1 min ×3 — temas variados (30 min)`,
        "speaking", "Testing Effect — formato examen real",
        [
          `Pide a Claude 3 prompts distintos de Part 2`,
          `1 min cada uno sin parar — foco: linking phrases y especulación`,
          `Transcribe el que salió peor → ¿cuántas expresiones C1 usaste?`,
        ],
        `💬 Claude: "Give me 3 different CAE Part 2 photo tasks (one at a time). I'll respond to each with a 1-minute spoken answer (I'll write it). After each, tell me: linking phrases used, speculation language, and one thing to improve."`
      ),
      t(
        `Reading: 1 texto C1 sobre "${wd.vocab}" — extrae 10 expresiones (30 min)`,
        "reading", "Noticing — activa el filtro de input",
        [
          `Busca 1 artículo C1 sobre "${wd.vocab}" (The Guardian / BBC / The Economist)`,
          `Lee activamente: extrae 10 expresiones que TÚ no usarías espontáneamente`,
          `Guárdalas en el Log de Lectura — botón "→ SR" para las mejores`,
        ],
        C.google(`"${wd.vocab}" site:theguardian.com OR site:bbc.com/news`)
      ),
      t("SR: 5 tarjetas nuevas desde errores de hoy (15 min)", "sr", "Error→SR pipeline",
        [`Convierte errores del día en tarjetas SR desde el Banco de Errores`], ""),
      t(
        `Speaking: Resumen oral 2 min del texto leído (15 min)`,
        "speaking", "Input→Output — reusa el vocabulario nuevo",
        [`Graba 2 min resumiendo el texto, forzando 5 de las expresiones extraídas`], ""
      ),
    ]),
    mk("Miércoles", [
      t(
        `Writing: CAE Essay cronometrado — "${wd.vocab}" (45 min)`,
        "writing", "Output Hypothesis — producción bajo presión real",
        [
          `Escribe el essay (220-260 palabras) con timer en 45 min`,
          `Incluye mínimo 4 collocations del tema "${wd.vocab}"`,
          `Al terminar: pega el texto en Claude con el prompt de abajo`,
        ],
        C.writing("CAE essay (Part 1, for/against)", wd.vocab)
      ),
      t(
        `UoE: Open cloze ×2 + multiple-choice cloze ×1 (35 min)`,
        "uoe", "Elaborative Interrogation — razona cada respuesta",
        [
          `2 open cloze (16 gaps) + 1 MCQ cloze — sin ayuda`,
          `Para cada gap di en voz alta el tipo (preposición / linker / collocation…)`,
          `Errores → Banco de Errores + tarjeta SR`,
        ],
        C.google(`CAE open cloze and multiple choice cloze practice test site:flo-joe.co.uk`)
      ),
      t(
        `Grammar: ${wd.grammar} — escribe 5 oraciones propias (25 min)`,
        "uoe", "Explicit instruction → producción inmediata",
        [
          `5 oraciones propias usando el patrón de esta semana`,
          `Contexto: tema "${wd.vocab}" — oraciones realistas`,
          `Claude las corrige y muestra una versión C1 mejorada de cada una`,
        ],
        `💬 Claude: "I've written 5 sentences using '${wd.grammar}'. Topic: '${wd.vocab}'. Correct each one and rewrite it at C1 level, explaining what you changed."`
      ),
      t(
        `Speaking: Describe & compare (Part 2) ×2 (30 min)`,
        "speaking", "Pushed Output — formato Part 2",
        [
          `2 tareas describe & compare — 1 min cada una`,
          `Foco: lenguaje de especulación y comparación`,
        ],
        C.speaking(wd.vocab)
      ),
      t("SR: Phrasal verbs + collocations del tema (20 min)", "sr", "Spaced Repetition",
        [`Revisa pendientes + añade 3 phrasal verbs relacionados con "${wd.vocab}"`], ""),
      t(
        `Writing: Reescribir intro + conclusión del essay con el feedback (20 min)`,
        "writing", "Error Analysis — elevar el nivel",
        [
          `Lee el feedback de Claude del essay de hoy`,
          `Reescribe la intro y la conclusión aplicando las sugerencias`,
        ],
        C.writing("revised CAE essay", wd.vocab)
      ),
    ]),
    mk("Jueves", [
      t(
        `UoE: Mini-mock Parts 1-4 cronometrado (45 min)`,
        "uoe", "Testing Effect — condiciones reales",
        [
          `Parts 1-4 completas sin ayuda — timer estricto`,
          `Auto-corrección: clasifica cada error por tipo (word form / preposition / collocation…)`,
          `Score de esta semana vs semana pasada — ¿cuántos errores menos?`,
        ],
        C.google(`CAE Use of English Parts 1-4 full practice test PDF`)
      ),
      t(
        `Listening: ${wd.podcast} + resumen escrito 100 palabras de memoria (35 min)`,
        "listening", "Input→Output integrado",
        [
          `Escucha el podcast sobre "${wd.vocab}" sin subtítulos`,
          `Escribe un resumen de 100 palabras solo de memoria`,
          `Compara con el transcript — ¿qué información perdiste?`,
        ],
        C.podcast(wd.podcast, wd.podcastQ)
      ),
      t(
        `Speaking: Long turn 1 min ×3 + feedback de muletillas (30 min)`,
        "speaking", "Output — identifica repeticiones",
        [
          `3 temas distintos — 1 min cada uno sin parar`,
          `Pide a Claude las muletillas que más repites (basically, like, you know…)`,
        ],
        `💬 Claude: "Give me 3 different CAE Part 2 prompts, one at a time. I'll write my spoken answers. After all 3, identify any filler words or phrases I overused."`
      ),
      t(
        `Shadowing: 10-15 min — prosodia y ritmo (25 min)`,
        "listening", "Shadowing — prosodia y processing speed",
        [
          `Busca el clip (prompt abajo) — 1ª escucha completa sin repetir`,
          `Shadowing: repite TODO con 1-2 seg de retraso — en voz alta`,
          `Grábate 1 min shadoweando — ¿coincide el ritmo y la entonación?`,
        ],
        C.shadow(`${wd.vocab} BBC Learning English OR TED Talk transcript`)
      ),
      t(
        `Vocab: 8 idioms / set phrases de "${wd.vocab}" (20 min)`,
        "uoe", "Elaborative Interrogation — set phrases del CAE",
        [`Pide 8 idioms del tema, escribe 1 oración con cada uno; difíciles → SR`],
        C.vocab(wd.vocab)
      ),
      t("SR: Tarjetas falladas 2+ veces (15 min)", "sr", "Spaced Repetition — foco en lo débil",
        [`Repasa las tarjetas que has fallado más de 2 veces`], ""),
    ]),
    mk("Viernes", [
      t(
        `UoE: Mock parcial Parts 1-4 + análisis por tipo de error (50 min)`,
        "uoe", "Testing Effect — condiciones reales",
        [
          `Parts 1-4 completas sin ayuda — timer estricto`,
          `Clasifica cada error por tipo (word form / preposition / collocation / KWT)`,
          `¿Hay un patrón repetido? → sesión dedicada el sábado`,
        ],
        C.google(`CAE Use of English Parts 1-4 full practice test PDF`)
      ),
      t(
        `Writing: Reescribe el essay de la semana al máximo nivel (30 min)`,
        "writing", "Error Analysis — elevar el nivel",
        [
          `Toma el essay del miércoles y reescríbelo entero aplicando todo el feedback`,
          `v1 vs v2: cuenta cuántas estructuras C1 nuevas añadiste`,
        ],
        C.writing("revised CAE essay", wd.vocab)
      ),
      t(
        `Speaking: Mock Part 1 (interview) + Part 2 con Claude (35 min)`,
        "speaking", "Testing Effect — formato examen",
        [
          `Part 1: 5 preguntas de entrevista. Part 2: 1 long turn con timer de 1 min`,
          `Pide feedback breve de fluidez, gramática y vocabulario`,
        ],
        `💬 Claude: "Be a CAE Speaking examiner. Ask me 5 Part 1 interview questions, then give me a Part 2 task (1 min). After each, brief feedback on fluency, grammar, vocabulary."`
      ),
      t(
        `Vocab review: ¿cuántas collocations recuerdas sin mirar? (20 min)`,
        "uoe", "Active Recall — autoevaluación",
        [`Recita de memoria las collocations del tema; las olvidadas → vuelven a SR`], ""
      ),
      t(
        `Revisión semanal: errores + plan semana siguiente (25 min)`,
        "review", "Metacognición",
        [
          `Banco de Errores: marca como "Dominado" los que ya controlas`,
          `¿Cuántas collocations del tema recuerdas sin mirar?`,
          `Define 2 objetivos específicos para la próxima semana`,
        ], ""
      ),
    ]),
    mk("Sábado", [
      t(
        `UoE: 30 KWT mixtas de toda la semana — cronometrado (45 min)`,
        "uoe", "Testing Effect — consolidación bajo presión",
        [
          `30 transformaciones mezclando todos los patrones de la semana`,
          `Máx 90 seg por pregunta — sin mirar notas`,
          `Errores → tarjeta SR el mismo día`,
        ],
        C.grammar(wd.grammar, wd.vocab)
      ),
      t(
        `Speaking: conversación libre 20 min con Claude (35 min)`,
        "speaking", "Fluency sin presión + feedback final",
        [
          `Habla 20 min sobre temas que disfrutes — sin corrección en vivo`,
          `Al terminar: pide a Claude tus 3 errores más significativos`,
        ],
        `💬 Claude: "Let's have a relaxed 20-minute conversation in English about a topic I enjoy. Don't correct me during the chat. Afterwards, give me feedback on just the 3 most significant language issues."`
      ),
      t("SR: backlog completo + crea 10 tarjetas de lo aprendido (40 min)", "sr", "Spaced Repetition — consolidar la semana",
        [`Haz el backlog completo, luego crea 10 tarjetas de las mejores expresiones de la semana`], ""),
    ]),
  ];
}

function phase2(w) {
  const wd = WEEK_DATA[w];
  const writingTypes = { report: "Report", proposal: "Proposal", review: "Review", letter: "Formal Letter", article: "Article" };
  const wType = writingTypes[wd.writing] || "Essay";
  return [
    mk("Lunes", [
      t(
        `Writing: CAE ${wType} cronometrado — "${wd.vocab}" (45 min)`,
        "writing", "Output — dominar todos los formatos CAE Part 2",
        [
          `${wType}: estructura correcta (headings si aplica) + 220-260 palabras + timer`,
          `Usa mínimo 2 discourse markers formales y 3 collocations del tema`,
          `Pega en Claude para corrección con rúbrica oficial CAE`,
        ],
        C.writing(`CAE ${wType}`, wd.vocab)
      ),
      t(
        `UoE: ${wd.grammar} — 20 ejercicios (35 min)`,
        "uoe", "Interleaving — mezcla Parts 1-4",
        [
          `Sesión en Claude: enfoque en "${wd.grammar}"`,
          `20 ejercicios de práctica — registra todos los errores`,
          `Errores → Banco de Errores + tarjeta SR`,
        ],
        C.grammar(wd.grammar, wd.vocab)
      ),
      t(
        `Listening: ${wd.podcast} — predice antes de la 2ª escucha (30 min)`,
        "listening", "Active Recall — predice antes de segunda escucha",
        [
          `1ª escucha: predice las respuestas antes de escuchar de nuevo`,
          `2ª escucha: confirma y anota expresiones C1 sobre "${wd.vocab}"`,
          `Log de Lectura: registra 3 expresiones → botón "→ SR"`,
        ],
        C.podcast(wd.podcast, wd.podcastQ)
      ),
      t(
        `Speaking: Collaborative task CAE Part 3 + discussion (30 min)`,
        "speaking", "Pushed Output — negocia y persuade",
        [
          `Pide a Claude un Part 3 task sobre "${wd.vocab}"`,
          `Negocia: argumenta, acepta parcialmente, redirige`,
          `Feedback: ¿turn-taking? ¿negotiation phrases?`,
        ],
        `💬 Claude: "Be my partner for CAE Speaking Part 3 about '${wd.vocab}'. Give me the task prompt, then we discuss (I'll write my turns). Feedback on: turn-taking, negotiation phrases, vocabulary range, fluency."`
      ),
      t(
        `Reading: 1 texto C1 sobre "${wd.vocab}" — extrae 8 expresiones (25 min)`,
        "reading", "Noticing",
        [`Lee 1 artículo C1, extrae 8 expresiones → Log de Lectura → SR`],
        C.google(`"${wd.vocab}" site:theguardian.com OR site:bbc.com/news`)
      ),
      t("SR: Errores de writing → tarjetas (15 min)", "sr", "Error→SR pipeline",
        [`Convierte los errores del essay de hoy en tarjetas SR`], ""),
    ]),
    mk("Martes", [
      t(
        `Listening: CAE Parts 3+4 cronometradas (40 min)`,
        "listening", "Testing Effect — condiciones reales",
        [
          `Parts 3 (matching) y 4 (multiple choice) con timer estricto`,
          `Después: analiza por qué te equivocaste en cada respuesta incorrecta`,
          `Vocabulario nuevo → Log de Lectura`,
        ],
        C.google(`CAE Listening Parts 3 4 practice test site:cambridgeenglish.org OR site:flo-joe.co.uk`)
      ),
      t(
        `Speaking: Collaborative Part 3 + discussion Part 4 (30 min)`,
        "speaking", "Pushed Output — negocia y persuade",
        [
          `Part 3 collaborative + Part 4 discussion sobre "${wd.vocab}"`,
          `Foco: justificar opiniones y desarrollar respuestas`,
        ],
        `💬 Claude: "Run CAE Speaking Part 3 (collaborative) then Part 4 (discussion) about '${wd.vocab}'. I'll write my turns. Feedback on developing answers and justifying opinions."`
      ),
      t(
        `UoE: ${wd.grammar} — KWT ×15 (30 min)`,
        "uoe", "Active Recall — máx 90 seg cada una",
        [
          `15 transformaciones del patrón "${wd.grammar}"`,
          `Sin ayuda externa — solo lápiz y timer`,
          `Verifica: ¿usaste exactamente las palabras requeridas? (máx 5)`,
        ],
        C.grammar(wd.grammar, wd.vocab)
      ),
      t(
        `Writing: Planifica un 2º formato — outline detallado (30 min)`,
        "writing", "Planning — estructura antes de escribir",
        [
          `Elige un formato distinto al del lunes (Report→Review / Proposal→Letter…)`,
          `Escribe el outline: propósito, párrafos, conectores, 4 collocations a usar`,
        ],
        C.writing(`second CAE Part 2 format outline`, wd.vocab)
      ),
      t(
        `Vocab académico del tema "${wd.vocab}" (25 min)`,
        "uoe", "Elaborative Interrogation",
        [`12 collocations académicas + 1 oración propia con cada una; difíciles → SR`],
        C.vocab(wd.vocab)
      ),
      t("SR: Academic vocabulary del tema (15 min)", "sr", "Spaced Repetition",
        [`Revisa pendientes + añade el vocabulario académico de hoy`], ""),
    ]),
    mk("Miércoles", [
      t(
        `Writing: CAE Part 2 diferente — "${wd.vocab}" (45 min)`,
        "writing", "Output — ciclar todos los formatos",
        [
          `Escribe el 2º formato planificado el martes`,
          `Foco de hoy: Organization — párrafos claros, conectores apropiados`,
          `Compara con el del lunes: ¿cuál tiene mejor Organization score?`,
        ],
        C.writing(`second CAE Part 2 format`, wd.vocab)
      ),
      t(
        `Grammar avanzada: ${wd.grammar} — 5 oraciones originales (30 min)`,
        "uoe", "Explicit → producción con nivel",
        [
          `Escribe 5 oraciones originales usando "${wd.grammar}"`,
          `Contexto: "${wd.vocab}" — que suenen a texto real del CAE`,
          `Claude las evalúa y muestra una versión C1 superior de cada una`,
        ],
        `💬 Claude: "I've written 5 sentences using '${wd.grammar}'. Topic: '${wd.vocab}'. For each: (1) is it grammatically correct? (2) how would a strong C1 speaker improve it? Show the upgrade."`
      ),
      t(
        `Vocab: 12 collocations + 5 phrasal verbs de "${wd.vocab}" (25 min)`,
        "uoe", "Elaborative Interrogation",
        [
          `Obtén collocations y phrasal verbs del tema (Claude o Google)`,
          `Escribe 1 oración con cada una — en contexto del CAE`,
          `Difíciles → tarjetas SR`,
        ],
        C.vocab(wd.vocab)
      ),
      t(
        `Speaking: 3 Long turns (1 min c/u) — temas variados (30 min)`,
        "speaking", "Testing Effect — formato examen",
        [`3 prompts de Part 2; foco en linking phrases y especulación`],
        `💬 Claude: "Give me 3 different CAE Part 2 tasks, one at a time. After each, feedback on linking phrases and speculation language."`
      ),
      t(
        `UoE: Open cloze ×2 + razona cada gap (30 min)`,
        "uoe", "Elaborative Interrogation",
        [`2 open cloze (16 gaps); di el tipo de cada gap; errores → SR`],
        C.google(`CAE open cloze practice test site:flo-joe.co.uk OR site:cambridgeenglish.org`)
      ),
      t("SR: Discourse markers y linkers (20 min)", "sr", "Spaced Repetition",
        [`Revisa pendientes + añade linkers C1 que usaste esta semana`], ""),
    ]),
    mk("Jueves", [
      t(
        `Listening: Podcast + resumen escrito 100 palabras (35 min)`,
        "listening", "Input→Output integrado",
        [
          `Escucha el podcast (sin subs) sobre "${wd.vocab}"`,
          `Escribe un resumen de 100 palabras en inglés — solo de memoria`,
          `Compara tu resumen con el transcript — ¿qué información perdiste?`,
        ],
        C.podcast(wd.podcast, wd.podcastQ)
      ),
      t(
        `Speaking: 3 Long turns grabados + muletillas (35 min)`,
        "speaking", "Output — identifica muletillas y repeticiones",
        [
          `3 temas distintos — pide los prompts a Claude`,
          `Grábate 1 min sin parar en cada uno`,
          `Escucha los 3: ¿cuáles muletillas repites? (basically, like, you know…)`,
        ],
        `💬 Claude: "Give me 3 different CAE Part 2 photo prompts, one at a time. I'll write my spoken answers. After all 3, identify any filler words or phrases I overused across the three responses."`
      ),
      t(
        `Shadowing: 10-15 min — nivel C1 (30 min)`,
        "listening", "Shadowing avanzado",
        [
          `Busca un clip natural (no scripted) sobre "${wd.vocab}"`,
          `Shadowing x2: primera pasada lenta, segunda a velocidad normal`,
          `Foco de hoy: entonación y pronunciación de palabras largas`,
        ],
        C.shadow(`${wd.vocab} documentary OR lecture English`)
      ),
      t(
        `UoE: Multiple-choice cloze ×2 (30 min)`,
        "uoe", "Active Recall — collocations y phrasal verbs",
        [`2 MCQ cloze completos; cada error → Banco de Errores + SR`],
        C.google(`CAE multiple choice cloze Part 1 practice test PDF`)
      ),
      t(
        `Reading: 2 textos C1 sobre "${wd.vocab}" — 10 expresiones (30 min)`,
        "reading", "Noticing",
        [`Lee 2 textos C1, extrae 10 expresiones → Log de Lectura → SR`],
        C.google(`"${wd.vocab}" site:theguardian.com OR site:economist.com`)
      ),
      t("SR: Errores recurrentes (15 min)", "sr", "Error→SR — patrones persistentes",
        [`Foco en las tarjetas que has fallado más de 2 veces`], ""),
    ]),
    mk("Viernes", [
      t(
        `MOCK PARCIAL: UoE completo + 1 Writing (55 min)`,
        "review", "Testing Effect — condiciones de examen reales",
        [
          `UoE Parts 1-4 completo (45 min) + 1 Writing Part 1 (sin tiempo extra)`,
          `Sin diccionario, sin Google, sin Claude — solo tú y el papel`,
          `Califica y categoriza cada error: ¿es de vocab / gramática / falta de tiempo?`,
        ],
        C.google(`CAE Use of English full mock test PDF filetype:pdf Cambridge`)
      ),
      t(
        `Análisis del mock: categoriza cada error (30 min)`,
        "review", "Error Analysis",
        [
          `Clasifica errores: collocation / word form / preposition / KWT pattern`,
          `¿Hay un patrón? Si fallaste 3+ del mismo tipo → sesión extra el sábado`,
          `Registra en Banco de Errores los nuevos`,
        ],
        `💬 Claude: "I got these answers wrong in my CAE mock: [lista tus errores]. Explain why each one is wrong, what rule I missed, and give me 3 similar exercises to practice that specific pattern."`
      ),
      t(
        `Listening: 1 parte débil del mock — práctica dirigida (25 min)`,
        "listening", "Deliberate Practice — solo lo débil",
        [`Repite la parte de Listening donde más fallaste; analiza distractores`],
        C.google(`CAE Listening practice ${wd.vocab} test`)
      ),
      t(
        `Speaking: Reflexión oral 5 min + goals semana siguiente (20 min)`,
        "speaking", "Metacognición",
        [
          `¿Qué mejoró esta semana? ¿Qué sigue débil?`,
          `Establece 1 objetivo medible para la próxima semana`,
        ], ""
      ),
      t("SR + Banco de errores: actualiza dominados (20 min)", "sr", "Spaced Repetition",
        [`Haz pendientes y marca como dominados los errores que ya controlas`], ""),
    ]),
    mk("Sábado", [
      t(
        `Mock parcial: Reading + Listening cronometrado (60 min)`,
        "review", "Testing Effect — secciones que menos practicaste entre semana",
        [
          `1 Reading completo + 1 Listening completo con timer oficial`,
          `Corrige y categoriza cada error por tipo`,
        ],
        C.google(`CAE Reading and Listening practice test PDF with answers`)
      ),
      t(
        `Análisis del mock con Claude (25 min)`,
        "review", "Error Analysis",
        [`Pega tus errores y pide patrones + 5 ejercicios dirigidos por tipo`],
        `💬 Claude: "Here are my errors from a CAE Reading + Listening mock: [lista]. Identify patterns and give me 5 targeted exercises per error type."`
      ),
      t("SR: backlog + 8 tarjetas nuevas de la semana (35 min)", "sr", "Spaced Repetition",
        [`Haz el backlog y añade 8 expresiones nuevas del Log de Lectura`], ""),
    ]),
  ];
}

function phase3(w) {
  const wd = WEEK_DATA[w];
  return [
    mk("Lunes", [
      t(
        `MOCK CAE: Reading + UoE completo — condiciones reales (60 min)`,
        "review", "Testing Effect máximo — un mock por semana",
        [
          `Reading Part 1-4 + UoE Parts 1-4 sin interrupciones — timer estricto`,
          `Nada de Claude, Google ni diccionario durante el mock`,
          `Al terminar: score estimado y categoriza errores`,
        ],
        C.google(`Cambridge CAE Reading Use of English full mock test PDF`)
      ),
      t(
        `Análisis del mock: puntuación + plan de acción (25 min)`,
        "review", "Error Analysis — triage inteligente",
        [
          `Score por sección: Reading R1/2/3/4, UoE Parts 1/2/3/4`,
          `Identifica los 3 tipos de error más frecuentes`,
          `Crea sesión en Claude para trabajar esos 3 tipos HOY`,
        ],
        `💬 Claude: "I just did a CAE mock. My errors were: [lista]. For each error type, (1) explain the rule, (2) give 5 targeted practice exercises, (3) suggest how to avoid this in the exam."`
      ),
      t(
        `Speaking: Interview practice + long turn (25 min)`,
        "speaking", "Output C1 — fluidez bajo presión",
        [
          `CAE Part 1 interview: pide a Claude que te haga preguntas del examen`,
          `Part 2: 1 long turn completo con timer de 1 min`,
          `Foco: ¿empezaste bien? ¿llenaste el minuto? ¿especulaste?`,
        ],
        `💬 Claude: "Be a CAE Speaking examiner. Start with Part 1 interview questions (ask me 5 questions about myself, interests, future plans). Then give me a Part 2 task. After each section give me brief feedback on fluency, grammar, vocabulary."`
      ),
      t(
        `UoE: dirigido a los 3 tipos de error del mock (30 min)`,
        "uoe", "Deliberate Practice — solo lo débil",
        [
          `Trabaja solo los 3 tipos de error más frecuentes del mock de hoy`,
          `15-20 ejercicios dirigidos — ¿bajó la tasa de error?`,
        ],
        C.grammar(wd.grammar, wd.vocab)
      ),
      t("SR: Weak areas del mock de hoy (20 min)", "sr", "Targeted SR",
        [`Convierte los errores del mock en tarjetas SR y haz los pendientes`], ""),
    ]),
    mk("Martes", [
      t(
        `Writing: 2 tasks CAE bajo presión — timing exacto (50 min)`,
        "writing", "Testing Effect — condiciones de examen",
        [
          `Part 1 essay + Part 2 — divide los 50 min o elige uno y cronométralo`,
          `Enfoca en Communicative Achievement: ¿cumples el propósito del texto?`,
          `Claude corrección con rúbrica oficial`,
        ],
        C.writing(`CAE Writing Part 1 and Part 2`, wd.vocab)
      ),
      t(
        `Listening: CAE test completo (40 min)`,
        "listening", "Exam simulation — 4 partes seguidas",
        [
          `Parts 1-4 del CAE Listening en secuencia — sin pausas`,
          `Anota las respuestas — luego verifica y categoriza errores`,
          `¿Problemas con acentos? ¿Con velocidad? ¿Con distractores?`,
        ],
        C.google(`CAE Listening full test Parts 1 2 3 4 with audio Cambridge`)
      ),
      t(
        `UoE: ${wd.grammar} — top error patterns dirigido (30 min)`,
        "uoe", "Deliberate Practice — solo lo débil",
        [
          `Solo ejercicios del tipo "${wd.grammar}" que te sigue costando`,
          `Ejercicios rápidos — comprueba si mejoró vs semana pasada`,
        ],
        C.grammar(wd.grammar, wd.vocab)
      ),
      t(
        `Speaking: Collaborative Part 3 + discussion (30 min)`,
        "speaking", "Pushed Output — negocia y desarrolla",
        [`Part 3 + Part 4 sobre "${wd.vocab}"; feedback de turn-taking y desarrollo`],
        `💬 Claude: "Run CAE Speaking Part 3 (collaborative) and Part 4 (discussion) about '${wd.vocab}'. I'll write my turns. Feedback on turn-taking, negotiation, and developing answers."`
      ),
      t("SR: Consolidación semana (20 min)", "sr", "Spaced Repetition",
        [`Revisa todas las tarjetas pendientes`], ""),
    ]),
    mk("Miércoles", [
      t(
        `Speaking: Mock Speaking completo CAE (4 parts) grabado (30 min)`,
        "speaking", "Output — criterios oficiales CAE",
        [
          `Parts 1→4 simuladas con Claude: interview, long turn, collaborative, discussion`,
          `Grábate o escribe tus respuestas — no releas antes de terminar`,
          `Feedback de Claude: ¿qué parte estuvo más débil?`,
        ],
        `💬 Claude: "Simulate a full CAE Speaking exam (Parts 1-4). I'll write all my answers as if speaking. Part 1: ask me 4 personal questions. Part 2: give me a photo task (1 min). Part 3: collaborative task (2 min). Part 4: follow-up discussion (2 min). Then give me an overall assessment for each part."`
      ),
      t(
        `UoE: ${wd.grammar} — retest 25 patrones más frecuentes (40 min)`,
        "uoe", "Active Recall total — ¿qué sigue fallando?",
        [
          `25 ejercicios mixtos — todos los patrones de las semanas anteriores`,
          `Sin ayuda — compara score con el mock del lunes`,
          `¿Qué patrón sigue siendo el más débil?`,
        ],
        C.google(`CAE Use of English Parts 1-4 mixed practice exercises`)
      ),
      t(
        `Writing: Autocorrección con rúbrica oficial (30 min)`,
        "writing", "Error Analysis — interioriza los criterios",
        [
          `Toma un essay de la semana pasada y evalúatelo tú mismo (0-5 cada criterio)`,
          `Luego pégalo en Claude — ¿coincide tu evaluación con la de Claude?`,
          `Diferencias entre tu nota y la de Claude = zonas ciegas`,
        ],
        C.writing(`self-assessed CAE essay`, wd.vocab)
      ),
      t(
        `Listening: 1 parte débil del mock — práctica dirigida (30 min)`,
        "listening", "Deliberate Practice — solo lo débil",
        [`Repite la parte de Listening donde más fallaste; analiza los distractores`],
        C.google(`CAE Listening Part practice test with answers`)
      ),
      t("SR + Banco de errores: actualiza dominados (30 min)", "sr", "Spaced Repetition",
        [`Haz pendientes y marca como dominados los errores que ya controlas`], ""),
    ]),
    mk("Jueves", [
      t(
        `FULL MOCK CAE — timing exacto, todas las partes (2h)`,
        "review", "Dress rehearsal — condiciones de examen reales",
        [
          `Reading + UoE + Writing + Listening — en orden y con timing oficial`,
          `Sin pausas, sin teléfono, sin Claude — exactamente como el día del examen`,
          `Anota el score estimado de cada sección al terminar`,
        ],
        C.google(`CAE Cambridge C1 Advanced full mock exam PDF 2024 2025`)
      ),
      t("SR: pasada ligera tras el mock (15 min)", "sr", "Spaced Repetition",
        [`Haz solo las tarjetas pendientes — no crees nuevas hoy, descansa la mente`], ""),
    ]),
    mk("Viernes", [
      t(
        `Análisis completo del mock del jueves (40 min)`,
        "review", "Error Analysis + plan de acción",
        [
          `Score por sección — compara con los mocks anteriores`,
          `Los 5 errores más evitables: ¿por qué los cometiste? (tiempo / vocab / falta atención)`,
          `Plan concreto para la próxima semana basado en este análisis`,
        ],
        `💬 Claude: "I completed a full CAE mock. Here are my errors by section: [lista]. (1) Identify patterns. (2) Prioritize what to work on this week. (3) Give me 5 specific targeted exercises."`
      ),
      t(
        `Speaking: Practica solo las partes débiles (30 min)`,
        "speaking", "Deliberate Practice — solo los puntos débiles",
        [
          `Identifica tu parte más débil del mock de ayer`,
          `Práctica intensiva en esa parte específica con 3 tasks`,
          `Pide feedback de Claude — ¿mejoró respecto a ayer?`,
        ],
        `💬 Claude: "I struggled most with CAE Speaking [Part X] in my mock. Give me 3 different tasks of that specific part and give me detailed feedback after each response I write."`
      ),
      t(
        `UoE / Writing: corrige los errores del mock con Claude (40 min)`,
        "review", "Error Analysis — cierra las brechas del mock",
        [
          `Trabaja los errores de UoE y Writing del mock del jueves`,
          `Por cada tipo: regla + 5 ejercicios dirigidos`,
        ],
        `💬 Claude: "From my CAE mock, here are my UoE and Writing errors: [lista]. For each, explain the rule and give me 5 targeted exercises."`
      ),
      t(
        `Revisión semanal + score tracker (20 min)`,
        "review", "Metacognición",
        [
          `Registra el score del mock en el Tracker`,
          `¿Cuántos puntos ganaste vs la semana 1 del plan?`,
          `Define el objetivo de score para la próxima semana`,
        ], ""
      ),
    ]),
    mk("Sábado", [
      t(
        `Reading + UoE bajo presión — test diferente (75 min)`,
        "review", "Overtraining ligero — segundo contacto con condiciones reales",
        [
          `Usa un test distinto al mock del jueves — timing oficial`,
          `Compara el score con el del jueves: ¿consistente?`,
        ],
        C.google(`Cambridge CAE Reading Use of English full practice test 2025 PDF`)
      ),
      t(
        `Análisis + SR de errores (45 min)`,
        "sr", "Error→SR pipeline",
        [
          `Categoriza los errores del sábado y crea tarjetas SR`,
          `Foco en los patrones que aparecieron también el jueves`,
        ], ""
      ),
    ]),
  ];
}

function phase4(w) {
  const wd = WEEK_DATA[w];
  return [
    mk("Lunes", [
      t(
        `Full Reading + UoE mock cronometrado estricto (60 min)`,
        "review", "Exam simulation — automatiza el timing",
        [
          `Reading Parts 1-4 + UoE Parts 1-4 — timer oficial`,
          `Enfoca en speed: si no sabes una respuesta en 60 seg, pasa`,
          `Score y análisis rápido — solo errores nuevos o recurrentes`,
        ],
        C.google(`CAE C1 Advanced Reading Use of English full test 2025 PDF`)
      ),
      t(
        `Análisis rápido: triage de errores (20 min)`,
        "review", "Triage — distingue errores evitables de difíciles",
        [
          `Clasifica: "evitable" (descuido, tiempo) vs "no sé" (vocab/gramática)`,
          `Solo trabaja los "no sé" — los evitables se corrigen solos con práctica`,
          `Errores "no sé" → sesión Claude hoy mismo`,
        ],
        `💬 Claude: "I got these wrong in my CAE mock and I genuinely didn't know the answer: [lista]. Explain each one clearly and give me 3 exercises per error type."`
      ),
      t(
        `Análisis rápido: triage de errores (25 min)`,
        "review", "Triage — distingue errores evitables de difíciles",
        [
          `Clasifica: "evitable" (descuido, tiempo) vs "no sé" (vocab/gramática)`,
          `Solo trabaja los "no sé" — los evitables se corrigen solos con práctica`,
        ],
        `💬 Claude: "I got these wrong in my CAE mock and I genuinely didn't know the answer: [lista]. Explain each clearly and give me 3 exercises per error type."`
      ),
      t(
        `Speaking: 2 Long turns + discussion grabados (30 min)`,
        "speaking", "Fluidez y confianza bajo presión",
        [
          `2 Long turns distintos — 1 min cada uno sin parar`,
          `Discussion de 2 min sobre un tema relacionado`,
          `¿Suenas seguro? ¿El ritmo es natural? ¿Pausas largas?`,
        ],
        C.speaking(wd.vocab)
      ),
      t(
        `Writing: 1 task con foco en LANGUAGE (40 min)`,
        "writing", "Output — variedad de estructuras sin repetir vocab",
        [
          `1 task CAE cronometrado; hoy el objetivo es la riqueza de lenguaje`,
          `Claude corrige con foco específico en el Language score`,
        ],
        C.writing(`CAE writing focus on Language range`, wd.vocab)
      ),
      t("SR: Solo tarjetas que sigues fallando (15 min)", "sr", "SR selectivo — foco en zonas débiles",
        [`Filtra tarjetas con calificación "No sé" repetida`], ""),
    ]),
    mk("Martes", [
      t(
        `Full Writing mock — 2 tasks timing exacto (50 min)`,
        "writing", "Testing Effect — presión real",
        [
          `Part 1 (essay) + Part 2 (formato variado) — timing exacto`,
          `Hoy enfoca en LANGUAGE: variedad de estructuras, sin repetir vocab`,
          `Corrección Claude con foco específico en Language score`,
        ],
        C.writing(`CAE Writing full mock (Part 1 + Part 2)`, wd.vocab)
      ),
      t(
        `Full Listening mock (40 min)`,
        "listening", "Exam conditions — mantén la concentración 40 min",
        [
          `Parts 1-4 sin pausas — simula la fatiga del examen real`,
          `Después: ¿en qué parte bajó más tu concentración?`,
          `Trabajo específico en esa parte débil`,
        ],
        C.google(`CAE C1 Advanced Listening test full audio mp3 OR youtube`)
      ),
      t(
        `UoE: Banco de errores — retest top 30 (35 min)`,
        "uoe", "Active Recall final — zero errors target",
        [
          `Abre el Banco de Errores — pendientes más repetidos`,
          `30 ejercicios de esos errores específicos`,
          `¿Cuántos siguen fallando? ↓ = progreso`,
        ],
        C.grammar(wd.grammar, wd.vocab)
      ),
      t(
        `Speaking: Mock completo 4 parts con timer (25 min)`,
        "speaking", "Simula los nervios — tiempo real",
        [
          `Mock de 4 partes en tiempo real — no pares`,
          `Feedback general de Claude por parte`,
        ],
        `💬 Claude: "Run a timed CAE Speaking exam simulation. Parts 1-4, I'll write all responses. Be strict on timing. Afterwards give me a score estimate for each part (0-5) with brief feedback."`
      ),
      t("SR: Consolidación + errores críticos (20 min)", "sr", "Spaced Repetition",
        [`Haz pendientes; revisa los 5 errores más repetidos de los últimos mocks`], ""),
    ]),
    mk("Miércoles", [
      t(
        `Speaking: Mock completo 4 parts con timer + feedback (30 min)`,
        "speaking", "Simula los nervios — tiempo real",
        [
          `Completa el mock de 4 partes en tiempo real — no pares`,
          `Pide feedback general de Claude por parte`,
          `¿Cuál parte sientes menos segura? → practica ×2 esa parte`,
        ],
        `💬 Claude: "Run a timed CAE Speaking exam simulation. Parts 1-4, I'll write all responses. Be strict on timing. Afterwards give me a score estimate for each part (0-5) with brief feedback."`
      ),
      t(
        `UoE: Banco de errores — retest TODO lo pendiente (35 min)`,
        "uoe", "Active Recall final — zero errors target",
        [
          `Retest de todos los errores pendientes del banco`,
          `¿Cuántos siguen sin dominar? Esos son tu foco para el examen`,
        ],
        C.grammar(wd.grammar, wd.vocab)
      ),
      t(
        `Writing: Lee tus mejores essays — interioriza tu nivel (30 min)`,
        "writing", "Priming — activa tu mejor nivel antes de un mock",
        [
          `Lee los 3 essays/writings con mejor puntuación del Output Lab`,
          `Subraya 5 estructuras C1 que puedes replicar en el examen`,
        ],
        `💬 Claude: "These are my best CAE writing samples [pega 2]: what structural and language patterns make them C1? Give me 5 things I should replicate in every CAE writing task."`
      ),
      t(
        `Reading: Full Reading — velocidad + precisión por parte (35 min)`,
        "reading", "Time management perfecto",
        [
          `CAE Reading Parts 1-4 con timing estricto por parte`,
          `P1 (8 min), P2 (9 min), P3 (15 min), P4 (13 min) — ¿terminaste a tiempo?`,
        ],
        C.google(`CAE Reading Parts 1-4 practice test 2025 PDF`)
      ),
      t(
        `Shadowing: 10 min material rápido — processing speed (15 min)`,
        "listening", "Mantener el oído activo",
        [
          `Clip a velocidad normal (noticias, podcast real)`,
          `Shadowing sin guión: repite lo que escuchas`,
        ],
        C.shadow(`BBC News English podcast OR The Daily New York Times English`)
      ),
      t("SR: tarjetas que sigues fallando (15 min)", "sr", "SR selectivo",
        [`Solo las tarjetas con calificación "No sé" repetida`], ""),
    ]),
    mk("Jueves", [
      t(
        `FULL CAE MOCK — examen completo sin interrupciones (2h)`,
        "review", "Simulacro final — condiciones perfectas",
        [
          `Reading + UoE + Writing + Listening — en orden, timing oficial`,
          `Apaga el teléfono, siéntate en un lugar tranquilo`,
          `Anota la hora de inicio y fin — ¿terminaste a tiempo?`,
        ],
        C.google(`CAE Cambridge C1 Advanced complete mock exam 2024 2025`)
      ),
      t("SR: pasada ligera tras el mock (15 min)", "sr", "Spaced Repetition",
        [`Haz solo las tarjetas pendientes — descansa la mente tras el mock`], ""),
    ]),
    mk("Viernes", [
      t(
        `Análisis final: score estimado realista (40 min)`,
        "review", "Evaluación honesta — sin exagerar ni minimizar",
        [
          `Calcula el score por sección con la escala oficial CAE`,
          `Compara con los mocks anteriores — ¿cuánto subiste?`,
          `¿Estás en 180+ en todas? Si no, ¿cuál sección necesita más trabajo?`,
        ],
        `💬 Claude: "Help me interpret my CAE mock results. My scores by section: [lista]. Is this sufficient to pass C1 Advanced? What are my highest-risk sections and what should I prioritize?"`
      ),
      t(
        `Speaking: Conversación libre relajada (25 min)`,
        "speaking", "Fluency + confianza sin presión",
        [
          `Conversación libre con Claude — tema que te interese en inglés`,
          `Sin corrección en tiempo real — solo fluye`,
          `Al final: pide feedback de los 3 errores más notables`,
        ],
        `💬 Claude: "Let's have a relaxed conversation in English about [tema que quieras]. Don't correct me during the conversation. Afterwards, give me feedback on just the 3 most significant language issues you noticed."`
      ),
      t(
        `Writing: Reescribe tu peor task al máximo nivel (30 min)`,
        "writing", "Elevar el floor — que todo sea bueno",
        [
          `Coge el writing con peor score de los mocks`,
          `Reescríbelo aplicando todo lo que sabes — ¿subió el score?`,
        ],
        C.writing(`CAE writing rewrite to maximum level`, wd.vocab)
      ),
      t(
        `Preparación mental + plan de la última fase (25 min)`,
        "review", "Performance psychology",
        [
          `Escribe (en inglés) lo que más has mejorado desde la semana 1`,
          `Define el foco de la última fase antes del examen`,
        ], ""
      ),
    ]),
    mk("Sábado", [
      t(
        `FULL MOCK #2 de la semana — test distinto (90 min)`,
        "review", "Dress rehearsal — el ensayo más cercano al examen real",
        [
          `Examen completo con un test diferente al del jueves — timing oficial`,
          `Silencio, sin teléfono, sin ayuda — como el día del examen`,
          `Anota score por sección`,
        ],
        C.google(`CAE C1 Advanced official past papers full exam PDF`)
      ),
      t(
        `Análisis + ajuste final (30 min)`,
        "review", "Error Analysis — últimos retoques",
        [`Los 3 errores más repetidos de ambos mocks → mini-plan con Claude`],
        `💬 Claude: "These are the errors I keep making in my CAE mocks: [lista]. With only [días] days left, what is the single most impactful thing to practice this week?"`
      ),
    ]),
  ];
}

function phase5() {
  return [
    mk("Lunes", [
      t(
        `Repaso ligero: mejores essays + errores dominados (30 min)`,
        "review", "Priming — activa tu mejor nivel",
        [
          `Lee los 3 mejores essays/writings del Output Lab`,
          `Revisa el Banco de Errores: celebra los que ya dominas`,
          `Recuerda mentalmente el nivel que alcanzaste`,
        ], ""
      ),
      t("SR: Última pasada tarjetas difíciles (15 min)", "sr", "SR final — reconsolidación",
        [`Solo las tarjetas que más te costaron — última revisión`], ""),
    ]),
    mk("Martes", [
      t(
        `Speaking: Conversación libre 30 min — sin corrección (30 min)`,
        "speaking", "Fluency y confianza — no technique",
        [
          `Habla en inglés con Claude sobre cualquier tema que disfrutes`,
          `Sin pedirle corrección — solo fluye y disfruta el idioma`,
          `Objetivo: sentirte seguro y natural`,
        ],
        `💬 Claude: "Let's have a relaxed, enjoyable conversation in English. I'm taking an English exam in a few days and I want to feel confident and natural. Talk to me about anything interesting — you choose the topic."`
      ),
      t(
        `Listening: Podcast favorito en inglés (20 min)`,
        "listening", "Input relajado — mantén el oído calibrado",
        [
          `Cualquier podcast que disfrutes — no hay tarea de analysis`,
          `Solo escucha y disfruta`,
        ],
        `🎧 Elige el podcast que más hayas disfrutado durante el plan`
      ),
    ]),
    mk("Miércoles", [
      t(
        `UoE: Repaso visual top 20 errores — solo leer (20 min)`,
        "uoe", "Reconsolidación pasiva",
        [
          `Abre el Banco de Errores — lee (no hagas ejercicios) los 20 más importantes`,
          `Solo leer y recordar — sin estrés, sin presión`,
        ], ""
      ),
      t(
        `Writing: Lee 1 model answer C1 — absorbe el estilo (15 min)`,
        "writing", "Priming — activa los patrones correctos",
        [
          `Busca 1 model answer CAE oficial`,
          `Léelo despacio — visualízate escribiendo a ese nivel`,
        ],
        C.google(`CAE Writing model answer official Cambridge C1 Advanced`)
      ),
    ]),
    mk("Jueves", [
      t(
        `Logística del examen: hora, lugar, documentos, ruta (20 min)`,
        "review", "Preparación práctica — no lo improvises",
        [
          `Centro EC051 4007 Guayaquil — confirma hora exacta de presentación`,
          `Prepara: documento de identidad, lápices/bolígrafos, borrador`,
          `Haz la ruta mentalmente o en Google Maps — llega 20 min antes`,
        ], ""
      ),
      t(
        `Speaking: Monólogo 3 min — "Por qué voy a pasar el CAE" (10 min)`,
        "speaking", "Visualización positiva — performance psychology",
        [
          `Habla 3 min en inglés sobre todo lo que has trabajado estos 6 meses`,
          `Termina con: "I am ready for this exam"`,
        ], ""
      ),
    ]),
    mk("Viernes", [
      t(
        `DESCANSO TOTAL — no estudies inglés hoy (0 min)`,
        "review", "Tapering completo — el descanso ES parte del entrenamiento",
        [
          `No abras la app de inglés. No escuches podcasts "para estudiar".`,
          `Haz algo completamente diferente que disfrutes`,
          `Duerme 8 horas. Mañana es tu día — llegás fresco y preparado.`,
        ], ""
      ),
    ]),
  ];
}

// ─── Public API ───────────────────────────────────────────────────────────────
export function weekDate(w) {
  const start = new Date(START_DATE);
  start.setDate(start.getDate() + (w - 1) * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  const fmt = d => `${d.getDate()} ${months[d.getMonth()]}`;
  return `${fmt(start)} — ${fmt(end)}`;
}

export function daysUntilExam() {
  const exam = new Date(2026, 8, 26);
  return Math.max(0, Math.ceil((exam - new Date()) / 86400000));
}

// Semana del plan (1..TOTAL_WEEKS) según la fecha actual vs START_DATE.
export function currentWeekFromDate(now = Date.now()) {
  const diffDays = Math.floor((now - START_DATE.getTime()) / 86400000);
  const wk = Math.floor(diffDays / 7) + 1;
  return Math.min(TOTAL_WEEKS, Math.max(1, wk));
}

/**
 * Migra el estado crudo cargado (de cualquier backend) al esquema actual.
 * Recibe el objeto crudo (sin mergear con defaults) para poder detectar la
 * versión vieja. En v1→v2: descarta dailyChecks (apuntaban a las 27 semanas)
 * y recalcula currentWeek por fecha; conserva el resto (scores, errores, SR,
 * diario, logs, totalMinutes).
 */
export function migrateState(raw, def) {
  const base = def || defaultState();
  if (!raw || typeof raw !== 'object') return base;
  const merged = { ...base, ...raw };
  if (raw.schemaVersion !== SCHEMA_VERSION) {
    merged.dailyChecks = {};
    merged.currentWeek = currentWeekFromDate();
    merged.schemaVersion = SCHEMA_VERSION;
  }
  return merged;
}

export function defaultState() {
  return {
    scores: SKILLS.reduce((a, s) => ({
      ...a, [s.key]: [{ week: 0, score: s.current, date: "15/6/2026" }]
    }), {}),
    dailyChecks: {},
    errors: [],
    diary: [],
    srCards: [],
    shadowLog: [],
    outputLog: [],
    readingLog: [],
    totalMinutes: 0,
    dismissedReminders: [],
    currentWeek: currentWeekFromDate(),
    schemaVersion: SCHEMA_VERSION,
  };
}

export function getWeekPlan(w) {
  if (w <= 4)  return phase1(w);   // F1 · Cerrar brechas
  if (w <= 8)  return phase2(w);   // F2 · Subir a C1
  if (w <= 11) return phase3(w);   // F3 · Consolidar C1
  if (w <= 14) return phase4(w);   // F4 · Dominar C1
  return phase5();                 // F5 · Tapering (semana 15)
}
