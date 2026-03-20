export const SKILLS = [
  { key: "reading", label: "Reading", current: 186, c1: 180, c2: 200, color: "#22c55e" },
  { key: "uoe", label: "Use of English", current: 151, c1: 180, c2: 200, color: "#ef4444" },
  { key: "writing", label: "Writing", current: 161, c1: 180, c2: 200, color: "#f59e0b" },
  { key: "listening", label: "Listening", current: 165, c1: 180, c2: 200, color: "#3b82f6" },
  { key: "speaking", label: "Speaking", current: 151, c1: 180, c2: 200, color: "#a855f7" },
];

export const TABS = ["Home", "Plan", "Tracker", "Errores", "Diario", "Lectura", "SR", "Shadow", "Output", "Config"];

export const CAT_COLORS = { uoe: "#ef4444", speaking: "#a855f7", writing: "#f59e0b", listening: "#3b82f6", reading: "#22c55e", sr: "#06b6d4", review: "#64748b" };

export const TOTAL_WEEKS = 27;
export const EXAM_DATE = "26 de septiembre 2026";
export const START_DATE = new Date(2026, 2, 23);

export const PHASES = [
  { name: "Fase 1: Cerrar brechas", weeks: [1,2,3,4,5,6], focus: "UoE 151→170, Speaking 151→170", target: "Eliminar gaps críticos", color: "#ef4444", hrs: "2h L-V" },
  { name: "Fase 2: Subir a C1", weeks: [7,8,9,10,11,12], focus: "Writing→180, Listening→180, todo arriba", target: "Todas ≥175", color: "#f59e0b", hrs: "2h L-V" },
  { name: "Fase 3: Consolidar C1", weeks: [13,14,15,16], focus: "Mocks semanales, pulir debilidades", target: "Score global ≥185", color: "#3b82f6", hrs: "2h L-V" },
  { name: "Fase 4: Dominar C1", weeks: [17,18,19,20], focus: "Simulacros completos, C1 automático", target: "C1 asegurado (180+)", color: "#a855f7", hrs: "2h L-V" },
  { name: "Fase 5: Overtraining C2", weeks: [21,22,23,24], focus: "Material CPE puro — subir ceiling sin mocks CAE", target: "Entrenar por encima del examen", color: "#ec4899", hrs: "2.5-3h L-V + 2h Sáb" },
  { name: "Fase 6: CAE con nivel C2", weeks: [25,26], focus: "Volver al formato CAE — ahora se siente fácil", target: "Simulacros a 193+ o 200+", color: "#8b5cf6", hrs: "2.5-3h L-V + 2h Sáb" },
  { name: "Fase 7: Tapering", weeks: [27], focus: "Repaso ligero, descanso mental", target: "Llegar fresco al 26 sept", color: "#22c55e", hrs: "1h max" },
];

export const REMINDERS = [
  { week: 10, text: "📋 INSCRÍBETE AL CAE — Sesión 26 sept 2026. Centro EC051 4007 Guayaquil.", type: "urgent" },
  { week: 11, text: "📋 ¿Ya te inscribiste al CAE? Hazlo esta semana.", type: "urgent" },
  { week: 12, text: "📋 Último recordatorio inscripción CAE 26 sept.", type: "urgent" },
  { week: 20, text: "🎯 C1 consolidado. Fase 5: Overtraining C2. Sábados activos.", type: "info" },
  { week: 26, text: "🧘 Última semana intensiva. Siguiente es tapering.", type: "info" },
  { week: 27, text: "🧘 TAPERING. Repaso ligero. Examen sábado 26 sept.", type: "success" },
];

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

export function defaultState() {
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

export function getWeekPlan(w) {
  const mk = (d, tasks) => ({ d, tasks });
  const t = (text, cat, tech) => ({ t: text, cat, technique: tech });

  if (w <= 6) return [
    mk("Lunes", [t("UoE: Word formation + Open cloze ×20 (40 min)", "uoe", "Active Recall — sin mirar reglas primero"), t("Speaking: Monólogo 3 min grabado → transcribe → marca errores (30 min)", "speaking", "Output Hypothesis — transcribir fuerza noticing"), t("Vocab: 12 collocations + oración propia cada una (20 min)", "uoe", "Elaborative Interrogation"), t("SR: Tarjetas pendientes (10 min)", "sr", "Spaced Repetition SM-2")]),
    mk("Martes", [t("Listening: Podcast C1 + note-taking en inglés (35 min)", "listening", "Comprehensible Input i+1"), t("UoE: Key word transformations ×12 mezclando gramática (30 min)", "uoe", "Interleaving"), t("Speaking con IA: Debate — forzar linking phrases (25 min)", "speaking", "Pushed Output"), t("SR: 5 tarjetas nuevas de errores del día (10 min)", "sr", "Error→SR pipeline")]),
    mk("Miércoles", [t("Writing: Essay C1 completo cronometrado 45 min", "writing", "Output Hypothesis"), t("UoE: Open cloze ×2 + análisis de POR QUÉ cada respuesta (25 min)", "uoe", "Elaborative Interrogation"), t("Grammar: Inversions, mixed conditionals, cleft sentences (20 min)", "uoe", "Explicit instruction → producción"), t("SR: Phrasal verbs en contexto (10 min)", "sr", "Spaced Repetition")]),
    mk("Jueves", [t("Reading: 2 textos CAE + extraer 10 expresiones C1 (35 min)", "reading", "Noticing"), t("Speaking con partner/IA: Long turn 1 min + discussion 2 min (30 min)", "speaking", "Formato examen — transiciones y opiniones"), t("Shadowing: 10 min TED Talk imitar TODO (25 min)", "listening", "Shadowing — prosodia y processing speed"), t("SR: Collocations de la semana (10 min)", "sr", "Spaced Repetition")]),
    mk("Viernes", [t("UoE: Mini mock Parts 1-4 cronometrado (45 min)", "uoe", "Testing Effect"), t("Writing: Re-leer essay miércoles + reescribir intro/conclusión (20 min)", "writing", "Error Analysis"), t("Speaking: Resumen oral 5 min de la semana (15 min)", "speaking", "Output + Metacognición"), t("Revisión semanal: Errores + ajustar plan (20 min)", "review", "Metacognición")])
  ];
  if (w <= 12) return [
    mk("Lunes", [t("Writing: Report o Proposal C1 cronometrado (45 min)", "writing", "Output — todos los formatos CAE Part 2"), t("UoE: Word formation + multiple choice cloze (25 min)", "uoe", "Interleaving Parts 1-4"), t("Listening: Parts 1+2 CAE (25 min)", "listening", "Active Recall — predice antes de 2da escucha"), t("SR: Errores de writing → tarjetas (10 min)", "sr", "Error→SR")]),
    mk("Martes", [t("Listening: Parts 3+4 CAE cronometrado (40 min)", "listening", "Testing Effect"), t("Speaking: Collaborative task + discussion (25 min)", "speaking", "Pushed Output — negocia y persuade"), t("UoE: Key word transformations C1 ×15 (25 min)", "uoe", "Active Recall — máx 90seg cada una"), t("SR: Academic vocabulary AWL (10 min)", "sr", "Spaced Repetition")]),
    mk("Miércoles", [t("Writing: Review o Letter formal C1 (45 min)", "writing", "Output — ciclar formatos"), t("Grammar: Subjunctive, emphasis, participle clauses (25 min)", "uoe", "Explicit → 5 oraciones con cada estructura"), t("UoE: Open cloze + MCQ timed (20 min)", "uoe", "Testing Effect"), t("SR: Discourse markers (10 min)", "sr", "Spaced Repetition")]),
    mk("Jueves", [t("Listening: Podcast C1 + resumen escrito 100 palabras (35 min)", "listening", "Input→Output integrado"), t("Speaking: 3 Long turns diferentes, 1 min cada uno grabados (30 min)", "speaking", "Output — identifica muletillas"), t("Shadowing: News 10 min sin pausar (25 min)", "listening", "Shadowing avanzado"), t("SR: Errores recurrentes (10 min)", "sr", "Error→SR")]),
    mk("Viernes", [t("MOCK PARCIAL: UoE completo + 1 Writing (55 min)", "review", "Testing Effect — condiciones reales"), t("Análisis detallado: categorizar cada error (25 min)", "review", "Error Analysis"), t("Speaking: Reflexión oral 5 min (10 min)", "speaking", "Metacognición"), t("Revisión semanal (10 min)", "review", "Metacognición")])
  ];
  if (w <= 16) return [
    mk("Lunes", [t("MOCK CAE: Reading + UoE completo (60 min)", "review", "Testing Effect máximo"), t("Análisis del mock: score + errores categorizados (25 min)", "review", "Error Analysis"), t("Speaking: Interview practice (25 min)", "speaking", "Output C1"), t("SR: Weak areas del mock (10 min)", "sr", "Targeted SR")]),
    mk("Martes", [t("Writing: 2 tasks CAE bajo presión (50 min)", "writing", "Testing Effect"), t("Listening: Full CAE Listening test (40 min)", "listening", "Exam simulation"), t("UoE: Top 15 error patterns dirigido (15 min)", "uoe", "Deliberate Practice"), t("SR: Consolidación (10 min)", "sr", "SR")]),
    mk("Miércoles", [t("Speaking: Mock Speaking 4 parts grabado (25 min)", "speaking", "Output — criterios oficiales"), t("UoE: Retest 20 errores más frecuentes (30 min)", "uoe", "Active Recall total"), t("Writing: Autocorrección con rúbrica oficial (25 min)", "writing", "Error Analysis"), t("Material C2: 1 artículo CPE + 5 expresiones (20 min)", "reading", "Input i+2")]),
    mk("Jueves", [t("FULL MOCK CAE — timing exacto, todas las partes (2h)", "review", "Dress rehearsal")]),
    mk("Viernes", [t("Análisis completo mock jueves (40 min)", "review", "Error Analysis + plan acción"), t("Speaking: Practicar solo partes débiles (20 min)", "speaking", "Deliberate Practice"), t("UoE: Errores mock → tarjetas SR (15 min)", "uoe", "Error→SR"), t("Revisión semanal (15 min)", "review", "Metacognición")])
  ];
  if (w <= 20) return [
    mk("Lunes", [t("Full Reading + UoE mock cronometrado estricto (60 min)", "review", "Exam simulation"), t("Análisis rápido: solo errores nuevos o recurrentes (20 min)", "review", "Triage"), t("Speaking: 2 Long turns + discussion grabado (20 min)", "speaking", "Fluidez y confianza"), t("SR: Solo tarjetas que sigues fallando (10 min)", "sr", "SR selectivo")]),
    mk("Martes", [t("Full Writing mock — 2 tasks timing exacto (50 min)", "writing", "Testing Effect"), t("Full Listening mock (40 min)", "listening", "Exam conditions"), t("Revisión rápida: errores críticos (15 min)", "review", "Triage")]),
    mk("Miércoles", [t("Speaking: Mock completo 4 parts con timer (20 min)", "speaking", "Simula nervios"), t("UoE: Banco de errores — los 30 más importantes (30 min)", "uoe", "Active Recall final"), t("Writing: Lee tus mejores essays — internaliza tu nivel (20 min)", "writing", "Priming"), t("Shadowing: 10 min material rápido (15 min)", "listening", "Mantener oído")]),
    mk("Jueves", [t("FULL CAE MOCK — examen completo sin interrupciones (2h)", "review", "Simulacro final")]),
    mk("Viernes", [t("Análisis final: score estimado realista (30 min)", "review", "Evaluación honesta"), t("Plan ajustes (15 min)", "review", "Deliberate Practice"), t("Speaking: Conversación libre relajada (20 min)", "speaking", "Fluency + confianza"), t("Preparación mental (15 min)", "review", "Performance psychology")])
  ];
  if (w <= 24) return [
    mk("Lunes", [t("UoE nivel C2: Key word transformations CPE ×15 (35 min)", "uoe", "Active Recall C2"), t("Writing: Essay argumentativo C2 — hedging, concession (40 min)", "writing", "Output complejidad académica"), t("Listening: Lecture CPE — acentos variados (30 min)", "listening", "Input i+2"), t("Speaking: Tema abstracto/filosófico con IA (25 min)", "speaking", "Output ideas complejas"), t("SR: Vocabulario C2 — 10 tarjetas mínimo (10 min)", "sr", "SR intensivo")]),
    mk("Martes", [t("Reading: Textos literarios nivel CPE (40 min)", "reading", "Input C2 — matices y tono"), t("UoE: Word formation C2 + open cloze CPE (30 min)", "uoe", "Interleaving C2"), t("Grammar: Ellipsis, substitution, fronting (25 min)", "uoe", "Explicit → producción"), t("Shadowing: Academic lecture 15 min (20 min)", "listening", "Shadowing C2"), t("SR: Collocations C2 (10 min)", "sr", "SR")]),
    mk("Miércoles", [t("Writing CPE: Summary writing (45 min)", "writing", "Output C2 — comprimir y reformular"), t("UoE: KWT CPE ×12 las más difíciles (30 min)", "uoe", "Si dominas esto, CAE es fácil"), t("Speaking: Monólogo académico 5 min grabado (25 min)", "speaking", "Coherencia extendida"), t("Listening: Podcast C2 + resumen escrito (20 min)", "listening", "Input→Output"), t("SR: Errores UoE persistentes (10 min)", "sr", "Targeted SR")]),
    mk("Jueves", [t("Reading CPE: Gapped text + cross-referencing (40 min)", "reading", "Razonamiento textual complejo"), t("Speaking: Debate filosófico 20 min (30 min)", "speaking", "Argumentación sofisticada"), t("UoE: Banco errores — retest con nivel C2 (25 min)", "uoe", "Active Recall total"), t("Writing: Reescribir essay al nivel más alto (25 min)", "writing", "Elevar ceiling"), t("SR: Backlog (10 min)", "sr", "Consolidación")]),
    mk("Viernes", [t("Grammar C2: Cleft, subjunctive, mixed patterns (30 min)", "uoe", "Automatizar estructuras C2"), t("Writing: Letter/Proposal nivel CPE (30 min)", "writing", "Dominar todos los registros"), t("Speaking: Presentación 5 min tema técnico (25 min)", "speaking", "Domain expertise"), t("Revisión semanal (15 min)", "review", "Metacognición"), t("SR: Errores nuevos (10 min)", "sr", "Error→SR")]),
    mk("Sábado", [t("Reading + UoE nivel CPE — análisis profundo (1.5h)", "review", "Overtraining — absorber nivel"), t("Crear tarjetas SR de todo lo nuevo (30 min)", "sr", "Input C2 → SR")])
  ];
  if (w <= 26) return [
    mk("Lunes", [t("Full CAE mock mentalidad 200+ cronometrado (2.5h)", "review", "CAE se siente más fácil post-CPE"), t("Análisis: compara con fase 4 — ¿cuántos errores eliminaste? (30 min)", "review", "Medir efecto overtraining")]),
    mk("Martes", [t("UoE CAE Parts 1-4 — apunta a 0-2 errores (40 min)", "uoe", "Ya conoces estos patterns"), t("Writing CAE: 2 tasks — aplica complejidad C2 (50 min)", "writing", "Estructuras C2 en formato C1"), t("Speaking: Mock Speaking CAE grabado (25 min)", "speaking", "Vocabulario C2 en formato C1"), t("SR: Tarjetas que fallas (10 min)", "sr", "SR selectivo")]),
    mk("Miércoles", [t("Listening: Full CAE test — debería ser cómodo (40 min)", "listening", "Post-CPE esto es relajado"), t("Reading: Full CAE Reading — velocidad + precisión (35 min)", "reading", "Time management perfecto"), t("UoE: Banco errores completo — retest TODO (30 min)", "uoe", "Zero errors"), t("Grammar: Repaso estructuras C1 automáticas (15 min)", "uoe", "Automatización")]),
    mk("Jueves", [t("FULL CAE MOCK — completo sin interrupciones (2.5h)", "review", "Mide tu score real con nivel C2")]),
    mk("Viernes", [t("Análisis mock jueves — score por parte (40 min)", "review", "¿193+? ¿200+?"), t("Speaking: Partes débiles (20 min)", "speaking", "Deliberate Practice"), t("Writing: Reescribir peor task al máximo (25 min)", "writing", "Elevar floor"), t("Comparar con mocks fase 4 (15 min)", "review", "Cuantificar mejora")]),
    mk("Sábado", [t("Mock CAE #2 de la semana (2h)", "review", "2 mocks/semana estas 2 semanas"), t("Análisis + ajuste final (30 min)", "review", "Error Analysis")])
  ];
  return [
    mk("Lunes", [t("Repaso ligero: mejores essays + errores dominados (30 min)", "review", "Priming — recuerda tu mejor nivel"), t("SR: Última pasada tarjetas difíciles (15 min)", "sr", "SR final")]),
    mk("Martes", [t("Speaking: Conversación libre 30 min sin corrección (30 min)", "speaking", "Fluency y confianza"), t("Listening: Podcast entretenido en inglés (20 min)", "listening", "Input relajado")]),
    mk("Miércoles", [t("UoE: Repaso visual top 20 errores — solo leer (20 min)", "uoe", "Reconsolidación pasiva"), t("Writing: Lee 1 model answer C1 (15 min)", "writing", "Priming")]),
    mk("Jueves", [t("Logística: hora, lugar, documentos, ruta (20 min)", "review", "Preparación práctica"), t("Speaking: Monólogo 3 min — por qué vas a pasar (10 min)", "speaking", "Visualiza el éxito")]),
    mk("Viernes", [t("Descanso total. No estudies. Duerme bien. Mañana es tu día.", "review", "Tapering completo")])
  ];
}