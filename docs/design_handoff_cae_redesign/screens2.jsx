/* global React, Icon, ProgressBar, Pill, EmptyState, ScreenHead, sm2, SKILL_VAR, CAT_LABEL, fmtDate */
// ============================================================
// Screens: Práctica hub, SR, Errores, Lectura, Shadow, Output, Más, Config
// ============================================================
const D2 = window.CAEData;
const { useState: uS2 } = React;

function Collapsible({ open, label, icon, onToggle, children }) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <button className="between block" onClick={onToggle} style={{ padding: 14, textAlign: 'left' }}>
        <span className="row" style={{ gap: 9, fontSize: 13.5, fontWeight: 700 }}>
          <span style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--accent-soft)', color: 'var(--accent-2)', display: 'grid', placeItems: 'center' }}><Icon name={icon} size={16} /></span>
          {label}
        </span>
        <Icon name={open ? 'up' : 'plus'} size={18} color="var(--text-3)" />
      </button>
      {open && <div style={{ padding: '0 14px 14px' }}>{children}</div>}
    </div>
  );
}

function SkillSelect({ value, onChange }) {
  return (
    <select className="inp" value={value} onChange={e => onChange(e.target.value)}>
      {D2.SKILLS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
    </select>
  );
}

// ============================================================
// PRÁCTICA hub
// ============================================================
function PracticaScreen({ state, go }) {
  const due = state.srCards.filter(c => c.nextReview <= Date.now()).length;
  const pendErr = state.errors.filter(e => !e.mastered).length;
  const reads = (state.readingLog || []).length;
  const shadowMin = state.shadowLog.reduce((a, s) => a + (s.duration || 0), 0);
  const outW = state.outputLog.filter(o => o.type === 'writing').length;
  const outS = state.outputLog.filter(o => o.type.startsWith('speaking')).length;

  const items = [
    { route: 'sr', icon: 'layers', tone: 'var(--accent-2)', title: 'Repaso espaciado', sub: 'Flashcards SM-2', badge: due ? `${due} hoy` : 'al día', badgeTone: due ? 'warn' : 'success' },
    { route: 'errores', icon: 'alert', tone: 'var(--sk-uoe)', title: 'Banco de errores', sub: 'Registra y domina fallos', badge: `${pendErr} activos`, badgeTone: pendErr ? '' : 'success' },
    { route: 'lectura', icon: 'book', tone: 'var(--sk-reading)', title: 'Log de lectura', sub: 'Expresiones C1/C2', badge: `${reads} textos`, badgeTone: '' },
    { route: 'shadow', icon: 'headphones', tone: 'var(--sk-speaking)', title: 'Shadowing', sub: 'Prosodia y ritmo', badge: `${Math.floor(shadowMin / 60)}h ${shadowMin % 60}m`, badgeTone: '' },
    { route: 'output', icon: 'pen', tone: 'var(--sk-writing)', title: 'Output Lab', sub: 'Writing y Speaking', badge: `${outW}W · ${outS}S`, badgeTone: '' },
  ];

  return (
    <div className="page">
      <ScreenHead title="Práctica" />
      <p style={{ fontSize: 12.5, color: 'var(--text-3)', margin: '0 2px 14px', lineHeight: 1.5 }}>Tus herramientas de estudio activo. El repaso espaciado primero, lo nuevo después.</p>
      <div style={{ display: 'grid', gap: 12 }}>
        {items.map(it => (
          <button key={it.route} className="card block" onClick={() => go(it.route)}
            style={{ display: 'flex', alignItems: 'center', gap: 13, textAlign: 'left', cursor: 'pointer' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, display: 'grid', placeItems: 'center', background: `color-mix(in oklab, ${it.tone} 16%, transparent)`, color: it.tone }}>
              <Icon name={it.icon} size={21} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{it.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{it.sub}</div>
            </div>
            <Pill tone={it.badgeTone}>{it.badge}</Pill>
            <Icon name="right" size={17} color="var(--text-4)" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// SR / Repaso
// ============================================================
const GRADES = [
  { q: 1, l: 'No sé', tone: 'var(--danger)' },
  { q: 3, l: 'Difícil', tone: 'var(--warn)' },
  { q: 4, l: 'Bien', tone: 'var(--sk-listening)' },
  { q: 5, l: 'Fácil', tone: 'var(--success)' },
];

function SRScreen({ state, up, onBack }) {
  const [form, setForm] = uS2({ front: '', back: '', skill: 'uoe', context: '' });
  const [open, setOpen] = uS2(false);
  const [show, setShow] = uS2(false);

  const due = state.srCards.filter(c => c.nextReview <= Date.now()).sort((a, b) => a.nextReview - b.nextReview);
  const upcoming = state.srCards.filter(c => { const d = (c.nextReview - Date.now()) / 86400000; return d > 0 && d <= 7; }).length;
  const card = due[0];

  const grade = (q) => {
    up(s => ({ srCards: s.srCards.map(c => c.id !== card.id ? c : { ...c, ...sm2(c, q) }) }));
    setShow(false);
  };
  const addCard = () => {
    if (!form.front.trim()) return;
    up(s => ({ srCards: [...s.srCards, { ...form, id: Date.now(), interval: 1, nextReview: Date.now() + 86400000, ease: 2.5, reps: 0 }] }));
    setForm({ front: '', back: '', skill: 'uoe', context: '' }); setOpen(false);
  };
  const del = (id) => up(s => ({ srCards: s.srCards.filter(c => c.id !== id) }));

  return (
    <div className="page">
      <ScreenHead title="Repaso espaciado" onBack={onBack} />
      <div className="row" style={{ gap: 7, marginBottom: 14, flexWrap: 'wrap' }}>
        <Pill tone={due.length ? 'warn' : 'success'} icon="clock">{due.length} pendientes</Pill>
        <Pill icon="calendar">{upcoming} en 7 días</Pill>
        <Pill icon="layers">{state.srCards.length} total</Pill>
      </div>

      {/* Review */}
      {card ? (
        <div className="card" style={{ padding: 18, border: '1px solid var(--accent-line)' }}>
          <div className="between" style={{ marginBottom: 14 }}>
            <span className="row" style={{ gap: 6, fontSize: 11.5, fontWeight: 700, color: SKILL_VAR[card.skill] }}>
              <span className="dot" style={{ background: SKILL_VAR[card.skill] }} />{CAT_LABEL[card.skill]}
            </span>
            <span className="tnum" style={{ fontSize: 11, color: 'var(--text-4)' }}>rep {card.reps} · {card.interval}d</span>
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, textAlign: 'center', padding: '18px 6px', lineHeight: 1.4 }}>{card.front}</div>
          {!show ? (
            <button className="btn primary block" onClick={() => setShow(true)}>Mostrar respuesta</button>
          ) : (
            <>
              <div style={{ background: 'var(--success-soft)', borderRadius: 12, padding: '14px 16px', textAlign: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--success)', lineHeight: 1.4 }}>{card.back}</div>
                {card.context && <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 6 }}>{card.context}</div>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 7 }}>
                {GRADES.map(g => (
                  <button key={g.q} onClick={() => grade(g.q)} className="btn sm" style={{ flexDirection: 'column', gap: 2, padding: '9px 4px', background: `color-mix(in oklab, ${g.tone} 18%, transparent)`, color: g.tone, border: 'none', fontWeight: 700 }}>
                    {g.l}
                  </button>
                ))}
              </div>
            </>
          )}
          <div className="tnum" style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-4)', marginTop: 14 }}>{due.length} restantes hoy</div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: 28 }}>
          <Icon name="checkCircle" size={34} color="var(--success)" />
          <p style={{ fontSize: 15, fontWeight: 700, marginTop: 10 }}>¡Repaso al día!</p>
          <p style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 4 }}>No tienes tarjetas pendientes hoy. Vuelve mañana.</p>
        </div>
      )}

      {/* Add */}
      <div style={{ marginTop: 12 }}>
        <Collapsible open={open} onToggle={() => setOpen(o => !o)} label="Nueva tarjeta" icon="plus">
          <SkillSelect value={form.skill} onChange={v => setForm(p => ({ ...p, skill: v }))} />
          <input className="inp" style={{ marginTop: 8 }} placeholder="Frente (pregunta / error / expresión)" value={form.front} onChange={e => setForm(p => ({ ...p, front: e.target.value }))} />
          <input className="inp" style={{ marginTop: 8 }} placeholder="Reverso (respuesta / corrección)" value={form.back} onChange={e => setForm(p => ({ ...p, back: e.target.value }))} />
          <input className="inp" style={{ marginTop: 8 }} placeholder="Contexto (opcional)" value={form.context} onChange={e => setForm(p => ({ ...p, context: e.target.value }))} />
          <button className="btn primary block" style={{ marginTop: 10 }} onClick={addCard}><Icon name="plus" size={16} /> Crear tarjeta</button>
        </Collapsible>
      </div>

      {/* List */}
      <div className="section-label">Todas las tarjetas ({state.srCards.length})</div>
      {state.srCards.length === 0 ? <EmptyState icon="layers" text="Aún no tienes tarjetas" /> : (
        [...state.srCards].sort((a, b) => a.nextReview - b.nextReview).map(c => {
          const d = Math.ceil((c.nextReview - Date.now()) / 86400000);
          return (
            <div key={c.id} className="card" style={{ padding: '10px 12px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="dot" style={{ background: SKILL_VAR[c.skill] }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.front}</div>
                <div style={{ fontSize: 11, color: 'var(--text-4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.back}</div>
              </div>
              <span className="tnum" style={{ fontSize: 10.5, fontWeight: 700, color: d <= 0 ? 'var(--warn)' : 'var(--text-4)', flexShrink: 0 }}>{d <= 0 ? 'hoy' : `${d}d`}</span>
              <button className="icon-btn" style={{ width: 30, height: 30 }} onClick={() => del(c.id)}><Icon name="x" size={15} /></button>
            </div>
          );
        })
      )}
    </div>
  );
}

// ============================================================
// ERRORES
// ============================================================
function ErroresScreen({ state, up, onBack }) {
  const [form, setForm] = uS2({ skill: 'uoe', text: '', correction: '', rule: '', why: '' });
  const [open, setOpen] = uS2(false);
  const [filter, setFilter] = uS2('pending');

  const counts = D2.SKILLS.reduce((a, s) => ({ ...a, [s.key]: state.errors.filter(e => e.skill === s.key && !e.mastered).length }), {});
  const add = () => {
    if (!form.text.trim()) return;
    up(s => ({ errors: [...s.errors, { ...form, id: Date.now(), date: fmtDate(Date.now()), mastered: false }] }));
    setForm({ skill: 'uoe', text: '', correction: '', rule: '', why: '' }); setOpen(false);
  };
  const toggle = id => up(s => ({ errors: s.errors.map(e => e.id === id ? { ...e, mastered: !e.mastered } : e) }));
  const toSR = err => up(s => ({ srCards: [...s.srCards, { id: Date.now(), skill: err.skill, front: err.text, back: err.correction || '(sin corrección)', context: err.why || err.rule || '', interval: 1, nextReview: Date.now() + 86400000, ease: 2.5, reps: 0 }] }));

  const visible = [...state.errors].reverse().filter(e => filter === 'all' ? true : filter === 'mastered' ? e.mastered : !e.mastered);

  return (
    <div className="page">
      <ScreenHead title="Banco de errores" onBack={onBack} />
      <Collapsible open={open} onToggle={() => setOpen(o => !o)} label="Registrar error" icon="alert">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <SkillSelect value={form.skill} onChange={v => setForm(p => ({ ...p, skill: v }))} />
          <input className="inp" placeholder="Categoría" value={form.rule} onChange={e => setForm(p => ({ ...p, rule: e.target.value }))} />
        </div>
        <textarea className="inp" rows={2} style={{ marginTop: 8 }} placeholder="Frase con error" value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))} />
        <textarea className="inp" rows={2} style={{ marginTop: 8 }} placeholder="Corrección" value={form.correction} onChange={e => setForm(p => ({ ...p, correction: e.target.value }))} />
        <input className="inp" style={{ marginTop: 8 }} placeholder="¿Por qué es un error?" value={form.why} onChange={e => setForm(p => ({ ...p, why: e.target.value }))} />
        <button className="btn primary block" style={{ marginTop: 10 }} onClick={add}><Icon name="plus" size={16} /> Agregar error</button>
      </Collapsible>

      {/* counts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 7, margin: '12px 0' }}>
        {D2.SKILLS.map(s => (
          <div key={s.key} className="card" style={{ padding: '9px 4px', textAlign: 'center' }}>
            <div className="tnum" style={{ fontSize: 17, fontWeight: 800, color: SKILL_VAR[s.key] }}>{counts[s.key]}</div>
            <div style={{ fontSize: 9, color: 'var(--text-4)', fontWeight: 700, marginTop: 1 }}>{s.label.split(' ')[0]}</div>
          </div>
        ))}
      </div>

      <div className="row" style={{ gap: 7, marginBottom: 12 }}>
        {[['pending', `Activos (${state.errors.filter(e => !e.mastered).length})`], ['mastered', `Dominados (${state.errors.filter(e => e.mastered).length})`], ['all', `Todos (${state.errors.length})`]].map(([f, l]) => (
          <button key={f} className={'chip' + (filter === f ? ' active' : '')} onClick={() => setFilter(f)}>{l}</button>
        ))}
      </div>

      {visible.length === 0 ? <EmptyState icon="shield" text="Sin errores aquí. ¡Bien!" /> : visible.map(err => {
        const inSR = state.srCards.some(c => c.front === err.text);
        return (
          <div key={err.id} className="card" style={{ padding: 13, marginBottom: 8, opacity: err.mastered ? 0.62 : 1 }}>
            <div className="between" style={{ marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
              <span className="row" style={{ gap: 6 }}>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: SKILL_VAR[err.skill], textTransform: 'uppercase', letterSpacing: '0.03em' }}>{CAT_LABEL[err.skill]}</span>
                {err.rule && <span style={{ fontSize: 10, color: 'var(--text-3)', background: 'var(--surface-2)', padding: '2px 7px', borderRadius: 6, fontWeight: 600 }}>{err.rule}</span>}
              </span>
              <span className="tnum" style={{ fontSize: 10, color: 'var(--text-4)' }}>{err.date}</span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--danger)', lineHeight: 1.5 }}>✗ {err.text}</div>
            {err.correction && <div style={{ fontSize: 12.5, color: 'var(--success)', lineHeight: 1.5, marginTop: 3 }}>✓ {err.correction}</div>}
            {err.why && <div style={{ fontSize: 11.5, color: 'var(--text-3)', fontStyle: 'italic', marginTop: 5 }}>{err.why}</div>}
            <div className="row" style={{ gap: 7, marginTop: 11 }}>
              <button className="btn sm" disabled={inSR} onClick={() => toSR(err)} style={{ flex: 1 }}>
                <Icon name={inSR ? 'check' : 'layers'} size={14} />{inSR ? 'En repaso' : '→ Repaso'}
              </button>
              <button className="btn sm" onClick={() => toggle(err.id)} style={{ flex: 1, background: err.mastered ? 'var(--success-soft)' : 'var(--surface-2)', color: err.mastered ? 'var(--success)' : 'var(--text-2)', border: 'none' }}>
                <Icon name={err.mastered ? 'checkCircle' : 'flag'} size={14} />{err.mastered ? 'Dominado' : 'Marcar dominado'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// LECTURA
// ============================================================
const READ_TYPES = { article: 'Artículo', cae_text: 'Texto CAE', book: 'Libro', podcast_transcript: 'Transcripción', other: 'Otro' };
const LEVELS = ['B2', 'C1', 'C2'];
const LEVEL_VAR = { B2: 'var(--sk-reading)', C1: 'var(--sk-listening)', C2: 'var(--sk-speaking)' };

function LecturaScreen({ state, up, onBack }) {
  const [form, setForm] = uS2({ title: '', type: 'article', level: 'C1', expressions: '', notes: '' });
  const [open, setOpen] = uS2(false);
  const log = [...(state.readingLog || [])].reverse();
  const exprCount = (state.readingLog || []).reduce((a, e) => a + (e.expressions ? e.expressions.split(',').filter(x => x.trim()).length : 0), 0);

  const add = () => {
    if (!form.title.trim()) return;
    up(s => ({ readingLog: [...(s.readingLog || []), { ...form, id: Date.now(), date: fmtDate(Date.now()), week: s.currentWeek }] }));
    setForm({ title: '', type: 'article', level: 'C1', expressions: '', notes: '' }); setOpen(false);
  };
  const toSR = (entry) => {
    const exprs = entry.expressions.split(',').map(e => e.trim()).filter(Boolean);
    if (!exprs.length) return;
    up(s => ({ srCards: [...s.srCards, ...exprs.map(ex => ({ id: Date.now() + Math.random(), skill: 'reading', front: ex, back: `(contexto: ${entry.title})`, context: `${READ_TYPES[entry.type]} — ${entry.level}`, interval: 1, nextReview: Date.now() + 86400000, ease: 2.5, reps: 0 }))] }));
  };

  return (
    <div className="page">
      <ScreenHead title="Log de lectura" onBack={onBack} />
      <div className="row" style={{ gap: 7, marginBottom: 12 }}>
        <Pill tone="success" icon="book">{state.readingLog?.length || 0} textos</Pill>
        <Pill icon="bookmark">{exprCount} expresiones</Pill>
      </div>
      <Collapsible open={open} onToggle={() => setOpen(o => !o)} label="Registrar lectura" icon="book">
        <input className="inp" placeholder="Título o fuente" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
          <select className="inp" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
            {Object.entries(READ_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <div className="segmented">
            {LEVELS.map(l => <button key={l} className={form.level === l ? 'active' : ''} onClick={() => setForm(p => ({ ...p, level: l }))}>{l}</button>)}
          </div>
        </div>
        <textarea className="inp" rows={2} style={{ marginTop: 8 }} placeholder="Expresiones C1/C2 (separadas por comas)" value={form.expressions} onChange={e => setForm(p => ({ ...p, expressions: e.target.value }))} />
        <textarea className="inp" rows={2} style={{ marginTop: 8 }} placeholder="Notas, resumen, ideas" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
        <button className="btn primary block" style={{ marginTop: 10 }} onClick={add}><Icon name="plus" size={16} /> Registrar</button>
      </Collapsible>

      <div style={{ marginTop: 12 }}>
        {log.length === 0 ? <EmptyState icon="book" text="Primera lectura pendiente" /> : log.map(entry => {
          const exprs = entry.expressions ? entry.expressions.split(',').map(e => e.trim()).filter(Boolean) : [];
          return (
            <div key={entry.id} className="card" style={{ padding: 13, marginBottom: 8 }}>
              <div className="between" style={{ marginBottom: 8, gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{entry.title}</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: LEVEL_VAR[entry.level], flexShrink: 0 }}>{entry.level}</span>
              </div>
              <div className="row" style={{ gap: 6, marginBottom: exprs.length ? 8 : 0 }}>
                <span style={{ fontSize: 10, color: 'var(--text-3)', background: 'var(--surface-2)', padding: '2px 7px', borderRadius: 6, fontWeight: 600 }}>{READ_TYPES[entry.type]}</span>
                <span className="tnum" style={{ fontSize: 10, color: 'var(--text-4)' }}>Sem {entry.week} · {entry.date}</span>
              </div>
              {exprs.length > 0 && (
                <div className="row" style={{ flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
                  {exprs.map((ex, i) => <span key={i} style={{ fontSize: 11, color: 'var(--sk-reading)', background: 'color-mix(in oklab, var(--sk-reading) 14%, transparent)', padding: '2px 8px', borderRadius: 6 }}>{ex}</span>)}
                </div>
              )}
              {entry.notes && <div style={{ fontSize: 11.5, color: 'var(--text-3)', fontStyle: 'italic', marginBottom: exprs.length ? 8 : 0 }}>{entry.notes}</div>}
              {exprs.length > 0 && <button className="btn sm block" onClick={() => toSR(entry)}><Icon name="layers" size={14} /> Enviar {exprs.length} a Repaso</button>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// SHADOWING
// ============================================================
function ShadowScreen({ state, up, onBack }) {
  const [form, setForm] = uS2({ source: '', duration: 10, difficulty: 3, notes: '' });
  const [open, setOpen] = uS2(false);
  const total = state.shadowLog.reduce((a, s) => a + (s.duration || 0), 0);
  const add = () => {
    if (!form.source.trim()) return;
    up(s => ({ shadowLog: [...s.shadowLog, { ...form, id: Date.now(), date: fmtDate(Date.now()) }] }));
    setForm({ source: '', duration: 10, difficulty: 3, notes: '' }); setOpen(false);
  };
  return (
    <div className="page">
      <ScreenHead title="Shadowing" onBack={onBack} />
      <div className="row" style={{ marginBottom: 12 }}><Pill tone="accent" icon="headphones">{Math.floor(total / 60)}h {total % 60}min en total</Pill></div>
      <Collapsible open={open} onToggle={() => setOpen(o => !o)} label="Nueva sesión" icon="headphones">
        <input className="inp" placeholder="Fuente (TED, podcast, noticia…)" value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 8, marginTop: 8 }}>
          <div>
            <span className="field-label">Minutos</span>
            <input type="number" className="inp" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: parseInt(e.target.value) || 0 }))} />
          </div>
          <div>
            <span className="field-label">Dificultad</span>
            <div className="segmented" style={{ width: '100%' }}>
              {[1, 2, 3, 4, 5].map(n => <button key={n} className={form.difficulty === n ? 'active' : ''} onClick={() => setForm(p => ({ ...p, difficulty: n }))}>{n}</button>)}
            </div>
          </div>
        </div>
        <textarea className="inp" rows={2} style={{ marginTop: 8 }} placeholder="¿Qué fue difícil? ¿Qué mejorar?" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
        <button className="btn primary block" style={{ marginTop: 10 }} onClick={add}><Icon name="plus" size={16} /> Registrar sesión</button>
      </Collapsible>
      <div style={{ marginTop: 12 }}>
        {state.shadowLog.length === 0 ? <EmptyState icon="headphones" text="Primera sesión pendiente" /> : [...state.shadowLog].reverse().map(s => (
          <div key={s.id} className="card" style={{ padding: 13, marginBottom: 8 }}>
            <div className="between" style={{ marginBottom: s.notes ? 6 : 0 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{s.source}</span>
              <span className="tnum" style={{ fontSize: 10.5, color: 'var(--text-4)', flexShrink: 0 }}>{s.duration}min · dif {s.difficulty}/5</span>
            </div>
            {s.notes && <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>{s.notes}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// OUTPUT
// ============================================================
const OUT_TYPES = { writing: 'Writing', speaking_solo: 'Speaking (solo)', speaking_partner: 'Speaking (partner)', speaking_ai: 'Speaking (IA)' };

function OutputScreen({ state, up, onBack }) {
  const [form, setForm] = uS2({ type: 'writing', prompt: '', text: '', selfScore: 3 });
  const [open, setOpen] = uS2(false);
  const [exp, setExp] = uS2(null);
  const add = () => {
    if (!form.text.trim()) return;
    up(s => ({ outputLog: [...s.outputLog, { ...form, id: Date.now(), date: fmtDate(Date.now()), week: s.currentWeek }] }));
    setForm({ type: 'writing', prompt: '', text: '', selfScore: 3 }); setOpen(false);
  };
  const wC = state.outputLog.filter(o => o.type === 'writing').length;
  const sC = state.outputLog.filter(o => o.type.startsWith('speaking')).length;
  return (
    <div className="page">
      <ScreenHead title="Output Lab" onBack={onBack} />
      <div className="row" style={{ gap: 7, marginBottom: 12 }}>
        <Pill tone="warn" icon="pen">{wC} writing</Pill>
        <Pill tone="" icon="mic">{sC} speaking</Pill>
      </div>
      <Collapsible open={open} onToggle={() => setOpen(o => !o)} label="Nuevo output" icon="pen">
        <select className="inp" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
          {Object.entries(OUT_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <span className="field-label" style={{ marginTop: 10 }}>Autoevaluación</span>
        <div className="segmented" style={{ width: '100%' }}>
          {[1, 2, 3, 4, 5].map(n => <button key={n} className={form.selfScore === n ? 'active' : ''} onClick={() => setForm(p => ({ ...p, selfScore: n }))}>{n}</button>)}
        </div>
        <input className="inp" style={{ marginTop: 8 }} placeholder="Tema / consigna" value={form.prompt} onChange={e => setForm(p => ({ ...p, prompt: e.target.value }))} />
        <textarea className="inp" rows={5} style={{ marginTop: 8 }} placeholder="Tu output + gaps identificados" value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))} />
        <button className="btn primary block" style={{ marginTop: 10 }} onClick={add}><Icon name="plus" size={16} /> Guardar output</button>
      </Collapsible>
      <div style={{ marginTop: 12 }}>
        {state.outputLog.length === 0 ? <EmptyState icon="pen" text="Primer output pendiente" /> : [...state.outputLog].reverse().map(o => (
          <div key={o.id} className="card" style={{ padding: 13, marginBottom: 8 }}>
            <div className="between" style={{ marginBottom: 6 }}>
              <span className="row" style={{ gap: 6, fontSize: 10.5, fontWeight: 800, color: o.type === 'writing' ? 'var(--sk-writing)' : 'var(--sk-speaking)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                <Icon name={o.type === 'writing' ? 'pen' : 'mic'} size={13} />{OUT_TYPES[o.type]}
              </span>
              <span className="row" style={{ gap: 6 }}>
                <span style={{ color: 'var(--warn)', fontSize: 11, letterSpacing: 1 }}>{'★'.repeat(o.selfScore)}<span style={{ color: 'var(--surface-3)' }}>{'★'.repeat(5 - o.selfScore)}</span></span>
                <span className="tnum" style={{ fontSize: 10, color: 'var(--text-4)' }}>Sem {o.week}</span>
              </span>
            </div>
            {o.prompt && <div style={{ fontSize: 11.5, color: 'var(--accent-2)', marginBottom: 5, fontWeight: 600 }}>{o.prompt}</div>}
            <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.55, whiteSpace: 'pre-wrap', cursor: 'pointer' }} onClick={() => setExp(exp === o.id ? null : o.id)}>
              {exp === o.id || o.text.length <= 180 ? o.text : o.text.slice(0, 180) + '…'}
              {o.text.length > 180 && <span style={{ color: 'var(--accent-2)', fontWeight: 700, marginLeft: 5 }}>{exp === o.id ? 'menos' : 'más'}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// MÁS (menu) + CONFIG
// ============================================================
function MasScreen({ state, go }) {
  const rows = [
    { route: 'config', icon: 'settings', title: 'Ajustes y respaldo', sub: 'Exportar, importar y reiniciar datos' },
    { route: 'sr', icon: 'layers', title: 'Repaso espaciado', sub: 'Flashcards SM-2' },
    { route: 'errores', icon: 'alert', title: 'Banco de errores', sub: 'Registra y domina fallos' },
    { route: 'lectura', icon: 'book', title: 'Log de lectura', sub: 'Expresiones C1/C2' },
    { route: 'shadow', icon: 'headphones', title: 'Shadowing', sub: 'Prosodia y ritmo' },
    { route: 'output', icon: 'pen', title: 'Output Lab', sub: 'Writing y Speaking' },
  ];
  return (
    <div className="page">
      <ScreenHead title="Más" />
      <div className="card" style={{ padding: 6 }}>
        {rows.map((r, i) => (
          <button key={r.route} className="between block" onClick={() => go(r.route)}
            style={{ padding: '12px 10px', textAlign: 'left', borderBottom: i < rows.length - 1 ? '1px solid var(--hairline)' : 'none' }}>
            <span className="row" style={{ gap: 12 }}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-2)', color: 'var(--text-2)', display: 'grid', placeItems: 'center' }}><Icon name={r.icon} size={18} /></span>
              <span>
                <span style={{ display: 'block', fontSize: 13.5, fontWeight: 700 }}>{r.title}</span>
                <span style={{ display: 'block', fontSize: 11.5, color: 'var(--text-3)' }}>{r.sub}</span>
              </span>
            </span>
            <Icon name="right" size={17} color="var(--text-4)" />
          </button>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 22, color: 'var(--text-4)', fontSize: 11, fontWeight: 600 }}>
        <Icon name="cap" size={22} style={{ marginBottom: 6, opacity: 0.6 }} />
        <div>CAE Mastery · rediseño 2026</div>
        <div style={{ marginTop: 2 }}>Tus datos se guardan en este dispositivo</div>
      </div>
    </div>
  );
}

function ConfigScreen({ state, setState, onBack }) {
  const fileRef = React.useRef(null);
  const latest = k => state.scores[k][state.scores[k].length - 1].score;
  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = `cae-mastery-${fmtDate(Date.now()).replace(/\//g, '-')}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const importData = async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    try { const data = JSON.parse(await f.text()); setState(prev => ({ ...prev, ...data })); alert('Datos importados correctamente.'); }
    catch (err) { alert('Error al importar: ' + err.message); }
  };
  const stats = [
    { label: 'Minutos estudiados', value: `${state.totalMinutes} (${Math.floor(state.totalMinutes / 60)}h)` },
    { label: 'Entradas de diario', value: state.diary.length },
    { label: 'Errores (dominados)', value: `${state.errors.length} (${state.errors.filter(e => e.mastered).length})` },
    { label: 'Tarjetas de repaso', value: state.srCards.length },
    { label: 'Sesiones de shadowing', value: state.shadowLog.length },
    { label: 'Outputs guardados', value: state.outputLog.length },
    { label: 'Lecturas', value: (state.readingLog || []).length },
    { label: 'Promedio actual', value: Math.round(D2.SKILLS.reduce((a, s) => a + latest(s.key), 0) / 5) },
  ];
  return (
    <div className="page">
      <ScreenHead title="Ajustes y respaldo" onBack={onBack} />
      <div className="card">
        <div className="card-h"><span className="card-title row" style={{ gap: 7 }}><Icon name="download" size={16} color="var(--accent-2)" /> Respaldo de datos</span></div>
        <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5, marginBottom: 12 }}>Exporta todo como archivo JSON para guardarlo o moverlo a otro dispositivo. Importa para restaurar.</p>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn primary" style={{ flex: 1 }} onClick={exportData}><Icon name="download" size={16} /> Exportar</button>
          <button className="btn" style={{ flex: 1 }} onClick={() => fileRef.current?.click()}><Icon name="upload" size={16} /> Importar</button>
          <input ref={fileRef} type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
        </div>
      </div>

      <div className="card">
        <div className="card-h"><span className="card-title row" style={{ gap: 7 }}><Icon name="trend" size={16} color="var(--text-2)" /> Estadísticas globales</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 14px' }}>
          {stats.map(s => (
            <div key={s.label}>
              <div className="tnum" style={{ fontSize: 17, fontWeight: 800 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ border: '1px solid color-mix(in oklab, var(--danger) 30%, transparent)' }}>
        <div className="card-h"><span className="card-title" style={{ color: 'var(--danger)' }}>Zona peligrosa</span></div>
        <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5, marginBottom: 12 }}>Restablece el prototipo a los datos de ejemplo. No se puede deshacer.</p>
        <button className="btn danger block" onClick={() => { if (window.confirm('¿Restablecer todos los datos a los de ejemplo?')) setState(window.seedStateFn()); }}>
          <Icon name="rotate" size={16} /> Reiniciar datos
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { PracticaScreen, SRScreen, ErroresScreen, LecturaScreen, ShadowScreen, OutputScreen, MasScreen, ConfigScreen, Collapsible });
