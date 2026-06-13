const SKILLS = [
  { key: "reading",  label: "Reading",         current: 186, c1: 180, c2: 200, color: "#22c55e" },
  { key: "uoe",      label: "Use of English",  current: 151, c1: 180, c2: 200, color: "#ef4444" },
  { key: "writing",  label: "Writing",         current: 161, c1: 180, c2: 200, color: "#f59e0b" },
  { key: "listening",label: "Listening",       current: 165, c1: 180, c2: 200, color: "#3b82f6" },
  { key: "speaking", label: "Speaking",        current: 151, c1: 180, c2: 200, color: "#a855f7" },
];

const TABS = ["Home", "Plan", "Tracker", "Errores", "Diario", "Lectura", "SR", "Shadow", "Output"];

const CAT_COLORS = { uoe: "#ef4444", speaking: "#a855f7", writing: "#f59e0b", listening: "#3b82f6", reading: "#22c55e", sr: "#06b6d4", review: "#64748b" };

const TOTAL_WEEKS = 27;
const EXAM_DATE = "26 de septiembre 2026";
const START_DATE = new Date(2026, 2, 23);

const PHASES = [
  { name: "Fase 1: Cerrar brechas",   weeks: [1,2,3,4,5,6],       focus: "UoE 151→170, Speaking 151→170",               target: "Eliminar gaps críticos",        color: "#ef4444", hrs: "2h L-V" },
  { name: "Fase 2: Subir a C1",       weeks: [7,8,9,10,11,12],    focus: "Writing→180, Listening→180, todo arriba",      target: "Todas ≥175",                    color: "#f59e0b", hrs: "2h L-V" },
  { name: "Fase 3: Consolidar C1",    weeks: [13,14,15,16],       focus: "Mocks semanales, pulir debilidades",           target: "Score global ≥185",             color: "#3b82f6", hrs: "2h L-V" },
  { name: "Fase 4: Dominar C1",       weeks: [17,18,19,20],       focus: "Simulacros completos, C1 automático",          target: "C1 asegurado (180+)",           color: "#a855f7", hrs: "2h L-V" },
  { name: "Fase 5: Overtraining C2",  weeks: [21,22,23,24],       focus: "Material CPE — subir ceiling sin mocks CAE",   target: "Entrenar por encima del examen",color: "#ec4899", hrs: "2.5-3h L-V + 2h Sáb" },
  { name: "Fase 6: CAE con nivel C2", weeks: [25,26],             focus: "Volver al formato CAE — ahora se siente fácil",target: "Simulacros a 193+ o 200+",      color: "#8b5cf6", hrs: "2.5-3h L-V + 2h Sáb" },
  { name: "Fase 7: Tapering",         weeks: [27],                focus: "Repaso ligero, descanso mental",               target: "Llegar fresco al 26 sept",      color: "#22c55e", hrs: "1h max" },
];

const REMINDERS = [
  { week: 10, text: "📋 INSCRÍBETE AL CAE — Sesión 26 sept 2026. Centro EC051 4007 Guayaquil.", type: "urgent" },
  { week: 11, text: "📋 ¿Ya te inscribiste al CAE? Hazlo esta semana.",                         type: "urgent" },
  { week: 12, text: "📋 Último recordatorio inscripción CAE 26 sept.",                          type: "urgent" },
  { week: 20, text: "🎯 C1 consolidado. Fase 5: Overtraining C2. Sábados activos.",             type: "info"   },
  { week: 26, text: "🧘 Última semana intensiva. Siguiente es tapering.",                        type: "info"   },
  { week: 27, text: "🧘 TAPERING. Repaso ligero. Examen sábado 26 sept.",                       type: "success"},
];

// ─── Week themes: vocabulary + grammar focus + podcast ────────────────────────
const WEEK_DATA = {
  1:  { vocab: "work & career",               grammar: "Word Formation: sufijos nominales (-tion/-ment/-ness/-ity/-ance)",    podcast: "BBC 6 Minute English",    podcastQ: "bbc 6 minute english career work 2024",           writing: "essay" },
  2:  { vocab: "work & career",               grammar: "Word Formation: sufijos adjetivales y verbales (-ful/-less/-ous/-ify)",podcast: "BBC 6 Minute English",    podcastQ: "bbc 6 minute english money business salary",      writing: "essay" },
  3:  { vocab: "technology & communication",  grammar: "Open Cloze: preposiciones en frases fijas (rely on, result in…)",    podcast: "TED Talk",                podcastQ: "TED talk technology future innovation transcript", writing: "essay" },
  4:  { vocab: "technology & communication",  grammar: "Open Cloze: linking words (although, whereas, nevertheless…)",       podcast: "TED Talk",                podcastQ: "TED talk social media digital life",              writing: "essay" },
  5:  { vocab: "environment & sustainability",grammar: "KWT: causative have/get something done + passive avanzado",          podcast: "BBC 6 Minute English",    podcastQ: "bbc 6 minute english environment climate change",  writing: "essay" },
  6:  { vocab: "environment & sustainability",grammar: "KWT: comparisons, so/such/too/enough, result clauses",               podcast: "BBC Global News",         podcastQ: "bbc global news environment sustainability",      writing: "essay" },
  7:  { vocab: "health & wellbeing",          grammar: "Multiple Choice Cloze: collocations de salud y cuerpo",              podcast: "TED Talk",                podcastQ: "TED talk health mental health wellbeing transcript",writing: "report" },
  8:  { vocab: "health & wellbeing",          grammar: "Multiple Choice Cloze: idioms y set phrases del CAE",                podcast: "BBC The English We Speak", podcastQ: "bbc the english we speak health body idioms",      writing: "proposal" },
  9:  { vocab: "education & society",         grammar: "Inversions: Not only…, Rarely…, Hardly…when, No sooner…than",       podcast: "TED Talk",                podcastQ: "TED talk education school future learning",        writing: "review" },
  10: { vocab: "education & society",         grammar: "Cleft sentences: It was X who/that…, What I need is…",              podcast: "BBC In Our Time",         podcastQ: "bbc in our time education society podcast",       writing: "letter" },
  11: { vocab: "arts & culture",              grammar: "Participle clauses: Having done…, Built in…, Feeling tired…",       podcast: "TED Talk",                podcastQ: "TED talk art creativity culture design",          writing: "article" },
  12: { vocab: "arts & culture",              grammar: "Reporting verbs: suggest/recommend/deny/accuse + structures",        podcast: "Intelligence Squared",    podcastQ: "intelligence squared arts culture debate",        writing: "report" },
  13: { vocab: "society & relationships",     grammar: "Mixed conditionals + wish/if only/it's (high) time",                podcast: "BBC Global News",         podcastQ: "bbc global news podcast society",                 writing: "essay" },
  14: { vocab: "society & relationships",     grammar: "Ellipsis and substitution (so/not, do/did, one/ones)",              podcast: "The Economist",           podcastQ: "the economist podcast society values",            writing: "proposal" },
  15: { vocab: "crime & justice",             grammar: "Fronting: On no account…, Under no circumstances…, Not until…",    podcast: "BBC In Our Time",         podcastQ: "bbc in our time crime law justice",               writing: "letter" },
  16: { vocab: "crime & justice",             grammar: "Modal perfects: should/must/can't/needn't have + perfect infinitive",podcast: "Intelligence Squared",    podcastQ: "intelligence squared crime justice punishment",    writing: "article" },
  17: { vocab: "travel & global cultures",    grammar: "Full UoE Parts 1-4 mixtos — drilling cronometrado",                podcast: "Stuff You Should Know",   podcastQ: "stuff you should know podcast travel culture",    writing: "report" },
  18: { vocab: "travel & global cultures",    grammar: "KWT speed: máx 60 sec/pregunta — todos los patrones",               podcast: "TED Talk",                podcastQ: "TED talk travel culture perspectives identity",   writing: "review" },
  19: { vocab: "science & innovation",        grammar: "Parts 1-4 full mock — target: 0 errores",                          podcast: "Science Weekly",          podcastQ: "guardian science weekly podcast 2025",            writing: "essay" },
  20: { vocab: "science & innovation",        grammar: "Parts 1-4 en condiciones estrictas de examen",                     podcast: "TED Talk",                podcastQ: "TED talk science innovation artificial intelligence",writing: "proposal"},
  21: { vocab: "global economy (C2)",         grammar: "Nominalization: the rise of, a tendency to, an awareness of",      podcast: "The Economist",           podcastQ: "the economist podcast economy finance 2025",       writing: "essay" },
  22: { vocab: "global economy (C2)",         grammar: "Complex concession: Much as…, Albeit, Notwithstanding, For all…",  podcast: "FT News Briefing",        podcastQ: "financial times news briefing podcast",           writing: "report" },
  23: { vocab: "psychology & philosophy (C2)",grammar: "Discourse cohesion: lexical chains, referencing, substitution",    podcast: "Philosophy Bites",        podcastQ: "philosophy bites podcast mind consciousness",      writing: "article" },
  24: { vocab: "psychology & philosophy (C2)",grammar: "Register shift: formal↔informal — transformaciones totales",       podcast: "BBC In Our Time",         podcastQ: "bbc in our time philosophy mind free will",        writing: "letter" },
  25: { vocab: "integrated review",           grammar: "CAE Parts 1-4 — nivel C2, target 0-1 errores",                    podcast: "BBC Global News",         podcastQ: "bbc global news podcast",                         writing: "essay" },
  26: { vocab: "integrated review",           grammar: "KWT al máximo — todos los patrones en velocidad",                  podcast: "Intelligence Squared",    podcastQ: "intelligence squared debate full episode",         writing: "report" },
  27: { vocab: "light review",                grammar: "Repaso visual — sin ejercicios nuevos",                            podcast: "cualquiera favorito",     podcastQ: "english podcast entertaining",                    writing: "any" },
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
        `UoE: ${wd.grammar} — 20 ejercicios (40 min)`,
        "uoe", "Active Recall — sin mirar reglas primero",
        [
          `Inicia sesión en Claude con el prompt de abajo`,
          `Resuelve los 20 ejercicios que Claude te proponga SIN mirar notas`,
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
        `Vocab: 12 collocations de "${wd.vocab}" + oraciones propias (20 min)`,
        "uoe", "Elaborative Interrogation — crea contexto propio",
        [
          `Pide las 12 collocations a Claude (prompt abajo)`,
          `Escribe 1 oración propia con cada una — en contexto real, no artificial`,
          `Las 3 más difíciles → tarjetas SR desde el Banco de Errores`,
        ],
        C.vocab(wd.vocab)
      ),
      t("SR: Tarjetas pendientes del día (10 min)", "sr", "Spaced Repetition SM-2",
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
        `UoE: ${wd.grammar} — KWT ×12 (30 min)`,
        "uoe", "Interleaving — mezcla patrones distintos",
        [
          `12 transformaciones con el patrón de esta semana`,
          `Máximo 90 seg por pregunta — simula el tiempo del examen`,
          `Cada error: di en voz alta POR QUÉ la respuesta correcta es esa`,
        ],
        C.grammar(wd.grammar, wd.vocab)
      ),
      t(
        `Speaking con Claude: debate "${wd.vocab}" (25 min)`,
        "speaking", "Pushed Output — fuerza vocabulario nuevo",
        [
          `Debate 15 min usando mínimo 5 collocations del lunes`,
          `Al terminar: pide a Claude qué palabras repetiste más`,
          `Anota 3 alternativas C1 que Claude sugiera`,
        ],
        C.debate(wd.vocab)
      ),
      t("SR: 5 tarjetas nuevas desde errores de hoy (10 min)", "sr", "Error→SR pipeline",
        [`Convierte errores del día en tarjetas SR desde el Banco de Errores`], ""),
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
        `UoE: Open cloze ×2 + analiza POR QUÉ cada gap (25 min)`,
        "uoe", "Elaborative Interrogation — razona cada respuesta",
        [
          `Resuelve 2 open cloze completos (16 gaps) — sin ayuda`,
          `Para cada gap: di en voz alta el tipo (preposición / linker / pronombre…)`,
          `Errores → Banco de Errores + tarjeta SR`,
        ],
        C.google(`CAE open cloze practice test site:flo-joe.co.uk OR site:cambridgeenglish.org`)
      ),
      t(
        `Grammar: ${wd.grammar} — escribe 5 oraciones propias (20 min)`,
        "uoe", "Explicit instruction → producción inmediata",
        [
          `5 oraciones propias usando el patrón de esta semana`,
          `Contexto: tema "${wd.vocab}" — oraciones realistas`,
          `Claude las corrige y muestra una versión C1 mejorada de cada una`,
        ],
        `💬 Claude: "I've written 5 sentences using '${wd.grammar}'. Topic: '${wd.vocab}'. Correct each one and rewrite it at C1 level, explaining what you changed."`
      ),
      t("SR: Phrasal verbs del tema (10 min)", "sr", "Spaced Repetition",
        [`Revisa pendientes + añade 3 phrasal verbs relacionados con "${wd.vocab}"`], ""),
    ]),
    mk("Jueves", [
      t(
        `Reading: 2 textos C1 sobre "${wd.vocab}" — extrae 10 expresiones (35 min)`,
        "reading", "Noticing — activa el filtro de input",
        [
          `Busca 2 artículos C1/C2 sobre "${wd.vocab}" (The Guardian / BBC / The Economist)`,
          `Lee activamente: extrae 10 expresiones que TÚ no usarías espontáneamente`,
          `Guárdalas en el Log de Lectura — botón "→ SR" para las mejores`,
        ],
        C.google(`"${wd.vocab}" site:theguardian.com OR site:bbc.com/news`)
      ),
      t(
        `Speaking: Long turn 1 min ×3 — temas variados (30 min)`,
        "speaking", "Testing Effect — formato examen real",
        [
          `Pide a Claude 3 prompts distintos de Part 2 con foto situations`,
          `1 min cada uno sin parar — foco: linking phrases y especulación`,
          `Transcribe el que salió peor → ¿cuántas expresiones C1 usaste?`,
        ],
        `💬 Claude: "Give me 3 different CAE Part 2 photo tasks (one at a time). I'll respond to each with a 1-minute spoken answer (I'll write it). After each, tell me: linking phrases used, speculation language, and one thing to improve."`
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
      t("SR: Collocations de la semana (10 min)", "sr", "Spaced Repetition",
        [`Repasa las collocations del lunes y martes`], ""),
    ]),
    mk("Viernes", [
      t(
        `UoE: Mini-mock Parts 1-4 cronometrado (45 min)`,
        "uoe", "Testing Effect — condiciones reales",
        [
          `Parts 1-4 completas sin ayuda — timer estricto (45 min)`,
          `Auto-corrección: clasifica cada error por tipo (word form / preposition / collocation…)`,
          `Score de esta semana vs semana pasada — ¿cuántos errores menos?`,
        ],
        C.google(`CAE Use of English Parts 1-4 full practice test PDF`)
      ),
      t(
        `Writing: Reescribir intro + conclusión del essay del miércoles (20 min)`,
        "writing", "Error Analysis — elevar el nivel",
        [
          `Lee el feedback de Claude del miércoles`,
          `Reescribe la intro y la conclusión aplicando las sugerencias`,
          `v1 vs v2: cuenta cuántas estructuras C1 nuevas añadiste`,
        ],
        C.writing("revised CAE essay", wd.vocab)
      ),
      t(
        `Speaking: Resumen oral 5 min de la semana (15 min)`,
        "speaking", "Output + Metacognición",
        [
          `Habla 5 min sobre qué aprendiste — vocabulario, gramática, expresiones`,
          `Fuerza: usa el vocabulario de "${wd.vocab}" en el resumen`,
        ], ""
      ),
      t(
        `Revisión semanal: errores + plan semana siguiente (20 min)`,
        "review", "Metacognición",
        [
          `Banco de Errores: marca como "Dominado" los que ya controlas`,
          `¿Cuántas collocations del tema recuerdas sin mirar?`,
          `Define 2 objetivos específicos para la próxima semana`,
        ], ""
      ),
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
        `UoE: ${wd.grammar} — 20 ejercicios (30 min)`,
        "uoe", "Interleaving — mezcla Parts 1-4",
        [
          `Sesión en Claude: enfoque en "${wd.grammar}"`,
          `20 ejercicios de práctica — registra todos los errores`,
          `Errores → Banco de Errores + tarjeta SR`,
        ],
        C.grammar(wd.grammar, wd.vocab)
      ),
      t(
        `Listening: ${wd.podcast} — "${wd.vocab}" (25 min)`,
        "listening", "Active Recall — predice antes de segunda escucha",
        [
          `1ª escucha: predice las respuestas antes de escuchar de nuevo`,
          `2ª escucha: confirma y anota expresiones C1 sobre "${wd.vocab}"`,
          `Log de Lectura: registra 3 expresiones → botón "→ SR"`,
        ],
        C.podcast(wd.podcast, wd.podcastQ)
      ),
      t("SR: Errores de writing → tarjetas (10 min)", "sr", "Error→SR pipeline",
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
        `Speaking: Collaborative task CAE Part 3 + discussion (25 min)`,
        "speaking", "Pushed Output — negocia y persuade",
        [
          `Pide a Claude un Part 3 task sobre "${wd.vocab}"`,
          `Negocia con Claude: argumenta, acepta parcialmente, redirige`,
          `Pide feedback: ¿interrumpiste bien? ¿usaste negotiation phrases?`,
        ],
        `💬 Claude: "Be my partner for CAE Speaking Part 3 about '${wd.vocab}'. Give me the task prompt, then we discuss together (I'll write my turns). Afterwards, give me feedback on: turn-taking, negotiation phrases, vocabulary range, and fluency."`
      ),
      t(
        `UoE: ${wd.grammar} — KWT ×15 (25 min)`,
        "uoe", "Active Recall — máx 90 seg cada una",
        [
          `15 transformaciones del patrón "${wd.grammar}"`,
          `Sin ayuda externa — solo lápiz y timer`,
          `Verifica: ¿usaste exactamente las palabras requeridas? (máx 5)`,
        ],
        C.grammar(wd.grammar, wd.vocab)
      ),
      t("SR: Academic vocabulary del tema (10 min)", "sr", "Spaced Repetition",
        [`Revisa pendientes + añade vocabulary académico del tema "${wd.vocab}"`], ""),
    ]),
    mk("Miércoles", [
      t(
        `Writing: CAE Part 2 diferente — "${wd.vocab}" (45 min)`,
        "writing", "Output — ciclar todos los formatos",
        [
          `Elige un formato distinto al del lunes (Report→Review / Proposal→Letter…)`,
          `Foco de hoy: Organization — párrafos claros, conectores apropiados`,
          `Compara con el del lunes: ¿cuál tiene mejor Organization score?`,
        ],
        C.writing(`second CAE Part 2 format`, wd.vocab)
      ),
      t(
        `Grammar avanzada: ${wd.grammar} — 5 oraciones originales (25 min)`,
        "uoe", "Explicit → producción con nivel",
        [
          `Escribe 5 oraciones originales usando "${wd.grammar}"`,
          `Contexto: "${wd.vocab}" — que suenen a texto real del CAE`,
          `Claude las evalúa y muestra cómo sonarían en un C2`,
        ],
        `💬 Claude: "I've written 5 sentences using '${wd.grammar}'. Topic: '${wd.vocab}'. For each: (1) is it grammatically correct? (2) how would a C2 speaker improve it? Show the upgrade."`
      ),
      t(
        `Vocab: 12 collocations + 5 phrasal verbs de "${wd.vocab}" (20 min)`,
        "uoe", "Elaborative Interrogation",
        [
          `Obtén collocations y phrasal verbs del tema (Claude o Google)`,
          `Escribe 1 oración con cada una — en contexto del CAE`,
          `Difíciles → tarjetas SR`,
        ],
        C.vocab(wd.vocab)
      ),
      t("SR: Discourse markers y linkers (10 min)", "sr", "Spaced Repetition",
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
        `Speaking: 3 Long turns grabados — 1 min cada uno (30 min)`,
        "speaking", "Output — identifica muletillas y repeticiones",
        [
          `3 temas distintos — pide los prompts a Claude`,
          `Grábate 1 min sin parar en cada uno`,
          `Escucha los 3: ¿cuáles muletillas repites? (basically, like, you know…)`,
        ],
        `💬 Claude: "Give me 3 different CAE Part 2 photo prompts, one at a time. I'll write my spoken answers. After all 3, identify any filler words or phrases I overused across the three responses."`
      ),
      t(
        `Shadowing: 10-15 min — nivel C1/C2 (25 min)`,
        "listening", "Shadowing avanzado",
        [
          `Busca un clip natural (no scripted) sobre "${wd.vocab}"`,
          `Shadowing x2: primera pasada lenta, segunda a velocidad normal`,
          `Foco de hoy: entonación y pronunciación de palabras largas`,
        ],
        C.shadow(`${wd.vocab} documentary OR lecture English`)
      ),
      t("SR: Errores recurrentes (10 min)", "sr", "Error→SR — patrones persistentes",
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
        `Análisis del mock: categoriza cada error (25 min)`,
        "review", "Error Analysis",
        [
          `Clasifica errores: collocation / word form / preposition / KWT pattern`,
          `¿Hay un patrón? Si fallaste 3+ del mismo tipo → sesión extra esa semana`,
          `Registra en Banco de Errores los nuevos`,
        ],
        `💬 Claude: "I got these answers wrong in my CAE mock: [lista tus errores]. Explain why each one is wrong, what rule I missed, and give me 3 similar exercises to practice that specific pattern."`
      ),
      t(
        `Speaking: Reflexión oral 5 min + goals semana siguiente (15 min)`,
        "speaking", "Metacognición",
        [
          `¿Qué mejoró esta semana? ¿Qué sigue débil?`,
          `Establece 1 objetivo medible para la próxima semana`,
        ], ""
      ),
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
      t("SR: Weak areas del mock de hoy (10 min)", "sr", "Targeted SR",
        [`Convierte los errores del mock en tarjetas SR`], ""),
    ]),
    mk("Martes", [
      t(
        `Writing: 2 tasks CAE bajo presión — timing exacto (50 min)`,
        "writing", "Testing Effect — condiciones de examen",
        [
          `Part 1 essay (45 min) + Part 2 (45 min) — hoy solo tienes 50 min total, elige 1 o divídelo`,
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
        `UoE: ${wd.grammar} — top 15 error patterns dirigido (15 min)`,
        "uoe", "Deliberate Practice — solo lo débil",
        [
          `Solo ejercicios del tipo "${wd.grammar}" que te sigue costando`,
          `15 ejercicios rápidos — comprueba si mejoró vs semana pasada`,
        ],
        C.grammar(wd.grammar, wd.vocab)
      ),
      t("SR: Consolidación semana (10 min)", "sr", "Spaced Repetition",
        [`Revisa todas las tarjetas pendientes`], ""),
    ]),
    mk("Miércoles", [
      t(
        `Speaking: Mock Speaking completo CAE (4 parts) grabado (25 min)`,
        "speaking", "Output — criterios oficiales CAE",
        [
          `Parts 1→4 simuladas con Claude: interview, long turn, collaborative, discussion`,
          `Grábate o escribe tus respuestas — no releas antes de terminar`,
          `Feedback de Claude: ¿qué parte estuvo más débil?`,
        ],
        `💬 Claude: "Simulate a full CAE Speaking exam (Parts 1-4). I'll write all my answers as if speaking. Part 1: ask me 4 personal questions. Part 2: give me a photo task (1 min). Part 3: collaborative task (2 min). Part 4: follow-up discussion (2 min). Then give me an overall assessment for each part."`
      ),
      t(
        `UoE: ${wd.grammar} — retest 20 patrones más frecuentes (30 min)`,
        "uoe", "Active Recall total — ¿qué sigue fallando?",
        [
          `20 ejercicios mixtos — todos los patrones de las semanas anteriores`,
          `Sin ayuda — compara score con el mock del lunes`,
          `¿Qué patrón sigue siendo el más débil?`,
        ],
        C.google(`CAE Use of English Parts 1-4 mixed practice exercises`)
      ),
      t(
        `Writing: Autocorrección con rúbrica oficial (25 min)`,
        "writing", "Error Analysis — interioriza los criterios",
        [
          `Toma un essay de la semana pasada y evalúatelo tú mismo (0-5 cada criterio)`,
          `Luego pégalo en Claude — ¿coincide tu evaluación con la de Claude?`,
          `Diferencias entre tu nota y la de Claude = zonas ciegas`,
        ],
        C.writing(`self-assessed CAE essay`, wd.vocab)
      ),
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
        `Speaking: Practica solo las partes débiles (20 min)`,
        "speaking", "Deliberate Practice — solo los puntos débiles",
        [
          `Identifica tu parte más débil del mock de ayer`,
          `10 min de práctica intensiva en esa parte específica`,
          `Pide feedback de Claude — ¿mejoró respecto a ayer?`,
        ],
        `💬 Claude: "I struggled most with CAE Speaking [Part X] in my mock. Give me 3 different tasks of that specific part and give me detailed feedback after each response I write."`
      ),
      t(
        `Revisión semanal + score tracker (15 min)`,
        "review", "Metacognición",
        [
          `Registra el score del mock en el Tracker`,
          `¿Cuántos puntos ganaste vs la semana 1 del plan?`,
          `Define el objetivo de score para la próxima semana`,
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
        `Speaking: 2 Long turns + discussion grabados (20 min)`,
        "speaking", "Fluidez y confianza bajo presión",
        [
          `2 Long turns distintos — 1 min cada uno sin parar`,
          `Discussion de 2 min sobre un tema relacionado`,
          `¿Suenas seguro? ¿El ritmo es natural? ¿Pausas largas?`,
        ],
        C.speaking(wd.vocab)
      ),
      t("SR: Solo tarjetas que sigues fallando (10 min)", "sr", "SR selectivo — foco en zonas débiles",
        [`Filtra tarjetas con calificación "No sé" repetida`], ""),
    ]),
    mk("Martes", [
      t(
        `Full Writing mock — 2 tasks timing exacto (50 min)`,
        "writing", "Testing Effect — presión real",
        [
          `Part 1 (essay) + Part 2 (formato variado) — 45 min cada uno`,
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
        `Revisión rápida: solo errores críticos (15 min)`,
        "review", "Triage rápido",
        [
          `Revisa los 5 errores más repetidos en los últimos mocks`,
          `¿Mejoraron? Si no: sesión dedicada esta semana`,
        ], ""
      ),
    ]),
    mk("Miércoles", [
      t(
        `Speaking: Mock completo 4 parts con timer (20 min)`,
        "speaking", "Simula los nervios — tiempo real",
        [
          `Completa el mock de 4 partes en tiempo real — no pares`,
          `Después: pide feedback general de Claude por parte`,
          `¿Cuál parte sientes menos segura? → practica ×2 esa parte`,
        ],
        `💬 Claude: "Run a timed CAE Speaking exam simulation. Parts 1-4, I'll write all responses. Be strict on timing. Afterwards give me a score estimate for each part (0-5) with brief feedback."`
      ),
      t(
        `UoE: Banco de errores — retest top 30 (30 min)`,
        "uoe", "Active Recall final — zero errors target",
        [
          `Abre el Banco de Errores — pendientes más repetidos`,
          `30 transformaciones/ejercicios de esos errores específicos`,
          `¿Cuántos siguen fallando? ↓ = progreso, = = necesita más trabajo`,
        ],
        C.grammar(wd.grammar, wd.vocab)
      ),
      t(
        `Writing: Lee tus mejores essays — interioriza tu nivel (20 min)`,
        "writing", "Priming — activa tu mejor nivel antes de un mock",
        [
          `Lee los 3 essays/writings con mejor puntuación del Output Lab`,
          `Subraya 5 estructuras C1 que puedes replicar en el examen`,
          `Menciones Claude: estos son mis mejores textos, ¿qué tienen en común?`,
        ],
        `💬 Claude: "These are my best CAE writing samples [pega 2]: what structural and language patterns make them C1? Give me a list of 5 things I should replicate in every CAE writing task."`
      ),
      t(
        `Shadowing: 10 min material rápido — processing speed (15 min)`,
        "listening", "Mantener el oído activo",
        [
          `Busca un clip a velocidad normal (no TED lento) — noticias, podcast real`,
          `Shadowing sin guión: repite lo que escuchas`,
        ],
        C.shadow(`BBC News English podcast OR The Daily New York Times English`)
      ),
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
    ]),
    mk("Viernes", [
      t(
        `Análisis final: score estimado realista (30 min)`,
        "review", "Evaluación honesta — sin exagerar ni minimizar",
        [
          `Calcula el score por sección con la escala oficial CAE`,
          `Compara con el mock de la semana 13 — ¿cuánto subiste?`,
          `¿Estás en 180+ en todas? Si no, ¿cuál sección necesita más trabajo?`,
        ],
        `💬 Claude: "Help me interpret my CAE mock results. My scores by section: [lista]. Is this sufficient to pass C1 Advanced? What are my highest-risk sections and what should I prioritize?"`
      ),
      t(
        `Speaking: Conversación libre relajada (20 min)`,
        "speaking", "Fluency + confianza sin presión",
        [
          `Conversación libre con Claude — tema que te interese en inglés`,
          `Sin corrección en tiempo real — solo fluye`,
          `Al final: pide feedback de los 3 errores más notables`,
        ],
        `💬 Claude: "Let's have a relaxed conversation in English about [tema que quieras]. Don't correct me during the conversation. Afterwards, give me feedback on just the 3 most significant language issues you noticed."`
      ),
      t(
        `Preparación mental + plan Fase 5 (15 min)`,
        "review", "Performance psychology",
        [
          `Escribe (en inglés) lo que más has mejorado desde la semana 1`,
          `Define 1 objetivo específico para cada semana de la Fase 5`,
        ], ""
      ),
    ]),
  ];
}

function phase5(w) {
  const wd = WEEK_DATA[w];
  return [
    mk("Lunes", [
      t(
        `UoE nivel C2: ${wd.grammar} — KWT CPE ×15 (35 min)`,
        "uoe", "Active Recall C2 — si dominas esto, el CAE es fácil",
        [
          `Sesión Claude con foco en "${wd.grammar}" a nivel CPE`,
          `15 KWT de CPE (Cambridge C2 Proficiency) — son más difíciles que el CAE`,
          `Cada error → tarjeta SR: añade también las variantes C2`,
        ],
        C.grammar(`C2-level ${wd.grammar}`, wd.vocab)
      ),
      t(
        `Writing: Essay académico C2 — "${wd.vocab}" (40 min)`,
        "writing", "Output complejidad académica — hedging y concesión",
        [
          `Essay argumentativo 250-280 palabras con: hedging, nominalization, concession`,
          `Usa estructuras C2: "It could be argued that…", "Notwithstanding…", "A tendency towards…"`,
          `Claude corrección: ¿parece un texto académico nativo de C2?`,
        ],
        C.writing(`C2 academic essay`, wd.vocab)
      ),
      t(
        `Listening: Lecture CPE — acentos variados (30 min)`,
        "listening", "Input i+2 — difícil a propósito",
        [
          `Busca una lecture/debate de nivel C2 sobre "${wd.vocab}"`,
          `Escucha sin transcript — anota el argumento principal y 3 ejemplos`,
          `Compara tus notas con el transcript — ¿cuánto captaste?`,
        ],
        C.podcast("Intelligence Squared / TED", `${wd.podcastQ} advanced lecture debate`)
      ),
      t(
        `Speaking: Tema abstracto — "${wd.vocab}" (25 min)`,
        "speaking", "Output ideas complejas — nivel C2",
        [
          `Debate filosófico/abstracto sobre "${wd.vocab}" con Claude`,
          `Fuerza estructuras C2: hedging, distancing, nominalization`,
          `Grábate 2 min y escucha: ¿suenas a nivel C2?`,
        ],
        `💬 Claude: "Have a sophisticated C2-level discussion with me about '${wd.vocab}'. Challenge my ideas, ask me to justify my positions. After the discussion, identify any language that sounds more B2 than C2 and suggest C2 alternatives."`
      ),
      t("SR: Vocabulario C2 — mínimo 10 tarjetas nuevas (10 min)", "sr", "SR intensivo C2",
        [`Añade 10 expresiones/estructuras C2 aprendidas hoy`], ""),
    ]),
    mk("Martes", [
      t(
        `Reading: Textos literarios/académicos CPE (40 min)`,
        "reading", "Input C2 — matices, tono y registro",
        [
          `Lee 1 texto literario o académico de nivel C2 sobre "${wd.vocab}"`,
          `Foco en: tono (formal/irónico/argumentativo), register, implicit meaning`,
          `Extrae 10 expresiones → Log de Lectura → botón "→ SR"`,
        ],
        C.google(`CPE reading text ${wd.vocab} formal academic English C2`)
      ),
      t(
        `UoE: Word formation C2 + open cloze CPE (30 min)`,
        "uoe", "Interleaving C2 — máxima dificultad",
        [
          `Word formation CPE level: palabras de registro formal/académico`,
          `Open cloze CPE: gaps más ambiguos que en CAE`,
          `Errors → Banco de Errores + tarjeta SR con explicación de registro`,
        ],
        C.google(`CPE Use of English Part 1 Part 2 practice test PDF`)
      ),
      t(
        `Grammar C2: ${wd.grammar} — en producción escrita (25 min)`,
        "uoe", "Explicit → producción inmediata",
        [
          `5 oraciones con "${wd.grammar}" en un contexto académico real`,
          `Integra en un párrafo coherente (no frases sueltas)`,
          `Claude evalúa: ¿suena nativo C2 o forzado?`,
        ],
        `💬 Claude: "I'm practicing C2 grammar: '${wd.grammar}'. I'll write a short paragraph (5-6 sentences) on '${wd.vocab}' using this structure. Evaluate: does it sound like natural C2 academic English? What would a native C2 speaker do differently?"`
      ),
      t(
        `Shadowing: Academic lecture 15 min (20 min)`,
        "listening", "Shadowing C2 — velocidad y precisión",
        [
          `Lecture académica en inglés sobre "${wd.vocab}"`,
          `Shadowing a velocidad normal — sin reducir la velocidad`,
          `Foco: pronunciación de términos técnicos`,
        ],
        C.shadow(`${wd.vocab} academic lecture Oxford Cambridge OR TED`)
      ),
      t("SR: Collocations C2 del tema (10 min)", "sr", "SR C2",
        [`Añade collocations académicas/formales encontradas hoy`], ""),
    ]),
    mk("Miércoles", [
      t(
        `Writing CPE: Summary writing — "${wd.vocab}" (45 min)`,
        "writing", "Output C2 — comprimir y reformular",
        [
          `Lee 2 textos C2 sobre "${wd.vocab}" — resúmelos en 120-150 palabras`,
          `Integra puntos de ambos textos sin copiar las frases originales`,
          `Reformula en tu propio vocabulario académico`,
        ],
        C.writing(`CPE summary writing task`, wd.vocab)
      ),
      t(
        `UoE: KWT CPE ×12 — las más difíciles (30 min)`,
        "uoe", "Si dominas esto, el CAE es sencillo",
        [
          `12 KWT de CPE — busca específicamente las que implican inversión o concesión`,
          `Sin ayuda — cronometrado`,
          `Verifica: los patrones CAE que dominabas, ¿siguen siendo fáciles?`,
        ],
        C.google(`CPE key word transformation practice exercises C2 PDF`)
      ),
      t(
        `Speaking: Monólogo académico 5 min grabado (25 min)`,
        "speaking", "Coherencia extendida — nivel C2",
        [
          `5 min de monólogo sin parar sobre un tema de "${wd.vocab}"`,
          `Estructura: introduce → develop → exemplify → evaluate → conclude`,
          `Escúchate: ¿hay un hilo argumental claro? ¿cambias de tema abruptamente?`,
        ],
        `💬 Claude: "Give me a C2 speaking task: an extended monologue (5 minutes) on '${wd.vocab}'. I'll write my response as if I'm speaking. Evaluate: coherence, argument development, vocabulary range, and whether it sounds C2 or C1."`
      ),
      t("SR: Errores UoE persistentes (10 min)", "sr", "Targeted SR — patrones que siguen fallando",
        [`Foco en tarjetas con calificación ≤3 repetida`], ""),
    ]),
    mk("Jueves", [
      t(
        `Reading CPE: Gapped text + cross-referencing (40 min)`,
        "reading", "Razonamiento textual complejo",
        [
          `CPE Reading Part 2 (gapped text) — el más difícil del examen`,
          `Técnica: busca referencia cohesiva (pronombres, lexical chains) antes de elegir`,
          `Score y análisis: ¿fallaste por vocab o por coherencia?`,
        ],
        C.google(`CPE Reading Part 2 gapped text practice test PDF`)
      ),
      t(
        `Speaking: Debate filosófico 20 min — "${wd.vocab}" (30 min)`,
        "speaking", "Argumentación sofisticada C2",
        [
          `Debate con Claude sobre una pregunta abstracta relacionada con "${wd.vocab}"`,
          `Usa: hedging, concession, reformulation, distancing language`,
          `¿Cuántas veces dijiste "I think"? → reemplaza con más sofisticado`,
        ],
        `💬 Claude: "Debate with me the question: 'Is [abstract question about ${wd.vocab}]?' Push back on my arguments. After 8 exchanges, list all the hedging and distancing phrases I used, and suggest 5 more sophisticated alternatives I could have used."`
      ),
      t(
        `UoE: Banco errores completo — retest nivel C2 (25 min)`,
        "uoe", "Active Recall total",
        [
          `Retest de todos los errores pendientes del Banco de Errores`,
          `¿Cuántos siguen fallando vs la semana anterior? Mide progreso`,
        ], ""
      ),
      t("SR: Backlog — tarjetas acumuladas (10 min)", "sr", "Consolidación",
        [`Haz el backlog completo — no te saltes tarjetas`], ""),
    ]),
    mk("Sábado", [
      t(
        `Reading + UoE nivel CPE — análisis profundo (1.5h)`,
        "review", "Overtraining — absorber el nivel C2",
        [
          `1 test completo de CPE Reading + CPE UoE — timing oficial`,
          `Análisis exhaustivo: cada error con explicación en Claude`,
          `Identifica: ¿qué del CPE ya dominas que también aparece en el CAE?`,
        ],
        C.google(`Cambridge C2 Proficiency CPE full practice test 2024 PDF`)
      ),
      t(
        `Crear tarjetas SR de todo lo aprendido esta semana (30 min)`,
        "sr", "Input C2 → SR — consolidar el overtraining",
        [
          `Revisa el Log de Lectura y el Banco de Errores de la semana`,
          `Crea tarjetas SR de las 10 expresiones C2 más útiles`,
          `Estas tarjetas te seguirán apareciendo hasta el examen`,
        ], ""
      ),
    ]),
  ];
}

function phase6(w) {
  const wd = WEEK_DATA[w];
  return [
    mk("Lunes", [
      t(
        `Full CAE mock mentalidad 200+ cronometrado (2.5h)`,
        "review", "CAE se siente más fácil post-C2",
        [
          `Mock completo: Reading + UoE + Writing + Listening — timing oficial`,
          `Mentalidad: "Esto es fácil comparado con el CPE que hice la semana pasada"`,
          `Score estimado: ¿llegaste a 193+? ¿200?`,
        ],
        C.google(`CAE C1 Advanced full mock test 2025 PDF with answers`)
      ),
      t(
        `Análisis: compara con mock de Fase 4 (30 min)`,
        "review", "Medir el efecto del overtraining C2",
        [
          `Score Fase 4 mock vs score hoy — ¿cuánto subiste gracias al CPE?`,
          `¿Qué sección mejoró más? ¿Cuál quedó igual?`,
          `Claude: analiza los errores restantes — ¿son evitables o de conocimiento?`,
        ],
        `💬 Claude: "Compare these two CAE mock results: Fase 4: [scores], Fase 6: [scores]. What improved? What still needs work? What are the most common remaining error types and how do I eliminate them in the next 2 weeks?"`
      ),
    ]),
    mk("Martes", [
      t(
        `UoE CAE Parts 1-4 — apunta a 0-2 errores (40 min)`,
        "uoe", "Los patrones CAE ya los conoces — demuéstralo",
        [
          `CAE UoE parts 1-4 cronometrado sin ayuda`,
          `Con tus habilidades C2, esto debería sentirse manejable`,
          `Cualquier error > analiza si es descuido o zona débil real`,
        ],
        C.google(`CAE Use of English Parts 1-4 practice 2025`)
      ),
      t(
        `Writing CAE: 2 tasks — aplica complejidad C2 (50 min)`,
        "writing", "Estructuras C2 en formato C1 — diferenciador clave",
        [
          `Essay + 1 Part 2 — usa nominalization, hedging, inversión donde corresponda`,
          `Evaluación Claude: ¿el lenguaje es claramente superior a C1 básico?`,
          `¿Cumples los criterios CAE sin perder el registro correcto?`,
        ],
        C.writing(`CAE Writing applying C2 language level`, wd.vocab)
      ),
      t(
        `Speaking: Mock Speaking CAE grabado (25 min)`,
        "speaking", "Vocabulario C2 en formato C1",
        [
          `Mock completo 4 partes — escribe o graba`,
          `¿Tu vocabulario es notablemente más rico que hace 2 meses?`,
          `Foco: dar respuestas que suenen naturalmente avanzadas`,
        ],
        `💬 Claude: "Run a full CAE Speaking exam simulation (Parts 1-4). After my responses, compare my vocabulary and grammar level to what you'd expect from C1 Basic vs C2. Am I using the C2 skills I've developed?"`
      ),
      t("SR: Tarjetas que aún fallas (10 min)", "sr", "SR selectivo final",
        [`Solo tarjetas con calificación ≤3 — las que quedan pendientes`], ""),
    ]),
    mk("Miércoles", [
      t(
        `Listening: Full CAE test — debería sentirse cómodo (40 min)`,
        "listening", "Post-CPE el CAE Listening es más relajado",
        [
          `CAE Listening parts 1-4 — timer oficial`,
          `¿La velocidad te parece lenta comparado con el CPE? Bien, así debe sentirse`,
          `Score: si < 85%, revisa qué parte específica falla`,
        ],
        C.google(`CAE Listening full test audio 2025 youtube OR cambridgeenglish.org`)
      ),
      t(
        `Reading: Full CAE Reading — velocidad + precisión (35 min)`,
        "reading", "Time management perfecto",
        [
          `CAE Reading parts 1-4 — timing estricto por parte`,
          `P1 (8 min), P2 (9 min), P3 (15 min), P4 (13 min)`,
          `¿Terminaste en tiempo? Velocidad de lectura C2 > C1`,
        ],
        C.google(`CAE Reading Parts 1-4 practice test 2025 PDF`)
      ),
      t(
        `UoE: Banco errores completo — retest TODO (30 min)`,
        "uoe", "Zero errors — eliminar los últimos patrones débiles",
        [
          `Todos los errores pendientes del banco — retest cronometrado`,
          `¿Cuántos quedan "sin dominar"? Esos son tu foco para el examen`,
        ], ""
      ),
    ]),
    mk("Jueves", [
      t(
        `FULL CAE MOCK — completo sin interrupciones (2.5h)`,
        "review", "Mide tu score real con nivel C2",
        [
          `Condiciones de examen perfectas — silencio, timer, sin ayuda`,
          `Esta es tu predicción más realista del score del 26 sept`,
          `Anota scores por sección`,
        ],
        C.google(`CAE Cambridge C1 Advanced full mock exam with answers 2025`)
      ),
    ]),
    mk("Viernes", [
      t(
        `Análisis mock del jueves — score por sección (40 min)`,
        "review", "¿193+? ¿200? Evalúa honestamente",
        [
          `Score oficial estimado por sección`,
          `Compara con todos los mocks anteriores — curva de progreso`,
          `Registra en el Score Tracker de la app`,
        ],
        `💬 Claude: "My final pre-exam mock scores: [lista por sección]. What is my predicted CAE grade (A/B/C/fail)? What are the 3 highest-impact improvements I can still make this week?"`
      ),
      t(
        `Writing: Reescribir peor task al máximo (25 min)`,
        "writing", "Elevar el floor — que todo sea bueno",
        [
          `Coge el writing con peor score de los mocks`,
          `Reescríbelo aplicando todo lo que sabes de C2`,
          `¿Subió el score? Eso es lo que puedes hacer el día del examen`,
        ],
        C.writing(`CAE writing rewrite to maximum level`, wd.vocab)
      ),
      t(
        `Comparar mocks Fase 4 vs Fase 6 (15 min)`,
        "review", "Cuantificar la mejora del overtraining",
        [
          `Semana 20 vs semana actual — ¿cuánto subiste?`,
          `El overtraining C2 funcionó: ¿cómo de fácil se siente el CAE ahora?`,
        ], ""
      ),
    ]),
    mk("Sábado", [
      t(
        `Mock CAE #2 de la semana (2h)`,
        "review", "2 mocks por semana estas últimas 2 semanas",
        [
          `Segundo mock completo — usa un test diferente al del jueves`,
          `Foco: consistency — ¿mantienes el mismo nivel en los 2 mocks?`,
          `Si hay diferencia grande, identifica qué varió (cansancio, tema, timing)`,
        ],
        C.google(`CAE C1 Advanced official past papers 2023 2024 PDF`)
      ),
      t(
        `Análisis + ajuste final (30 min)`,
        "review", "Error Analysis — últimos ajustes",
        [
          `Los 3 errores más repetidos de ambos mocks → sesión Claude`,
          `Plan concreto para la última semana de intensidad`,
        ],
        `💬 Claude: "These are the errors I keep making in my CAE mocks: [lista]. With only [días] days left, what is the single most impactful thing to practice? Give me a 3-day mini plan."`
      ),
    ]),
  ];
}

function phase7() {
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
        `🎧 Elige el podcast que más hayas disfrutado durante las 27 semanas`
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
function weekDate(w) {
  const start = new Date(START_DATE);
  start.setDate(start.getDate() + (w - 1) * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  const fmt = d => `${d.getDate()} ${months[d.getMonth()]}`;
  return `${fmt(start)} — ${fmt(end)}`;
}

function daysUntilExam() {
  const exam = new Date(2026, 8, 26);
  return Math.max(0, Math.ceil((exam - new Date()) / 86400000));
}

function defaultState() {
  return {
    scores: SKILLS.reduce((a, s) => ({
      ...a, [s.key]: [{ week: 0, score: s.current, date: "23/3/2026" }]
    }), {}),
    dailyChecks: {},
    errors: [],
    diary: [],
    srCards: [],
    currentWeek: 1,
    shadowLog: [],
    outputLog: [],
    readingLog: [],
    totalMinutes: 0,
    dismissedReminders: [],
  };
}

function getWeekPlan(w) {
  if (w <= 6)  return phase1(w);
  if (w <= 12) return phase2(w);
  if (w <= 16) return phase3(w);
  if (w <= 20) return phase4(w);
  if (w <= 24) return phase5(w);
  if (w <= 26) return phase6(w);
  return phase7();
}


// ─── Exposed as a classic-script global ──────────────────────────────────────
window.CAEData = {
  SKILLS, TABS, CAT_COLORS, TOTAL_WEEKS, EXAM_DATE, START_DATE,
  PHASES, REMINDERS, WEEK_DATA,
  weekDate, daysUntilExam, defaultState, getWeekPlan,
};
