/* global React */
// ============================================================
// Icon set — line icons (stroke), Lucide-style geometry
// ============================================================
const ICON_PATHS = {
  // navigation
  today:    '<path d="M3 12h4l2 5 4-12 2 7h6"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  practice: '<path d="M14.5 6.5 17 4l3 3-2.5 2.5M9.5 17.5 7 20l-3-3 2.5-2.5"/><path d="m8.5 8.5 7 7"/><path d="m4 7 3-3 2 2M20 17l-3 3-2-2"/>',
  progress: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
  more:     '<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',
  grid:     '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  // dashboard
  flame:    '<path d="M12 3c.5 3 3 4.5 3 8a3 3 0 0 1-6 0c0-1 .3-1.7.6-2.3C8 9.5 7 11 7 13.5A5 5 0 0 0 17 14c0-4-3-6.5-5-11Z"/>',
  clock:    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  target:   '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  layers:   '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
  alert:    '<path d="M10.3 4 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 4a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
  bulb:     '<path d="M9 18h6M10 22h4"/><path d="M12 2a6 6 0 0 0-4 10.5c.7.7 1 1.3 1 2.5h6c0-1.2.3-1.8 1-2.5A6 6 0 0 0 12 2Z"/>',
  book:     '<path d="M2 4h6a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H2Z"/><path d="M22 4h-6a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H22Z"/>',
  mic:      '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 19v3"/>',
  pen:      '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 0 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H1a2 2 0 0 1 0-4h.1A1.6 1.6 0 0 0 2.6 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 7 2.6h.1A1.6 1.6 0 0 0 8.7 1a2 2 0 0 1 4 0v.1A1.6 1.6 0 0 0 15 2.6a1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1A1.6 1.6 0 0 0 23 8.7a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 2.3Z" transform="translate(0.5 0.5) scale(0.96)"/>',
  // chevrons / actions
  left:     '<path d="m15 18-6-6 6-6"/>',
  right:    '<path d="m9 18 6-6-6-6"/>',
  down:     '<path d="m6 9 6 6 6-6"/>',
  up:       '<path d="m6 15 6-6 6 6"/>',
  plus:     '<path d="M12 5v14M5 12h14"/>',
  check:    '<path d="m20 6-11 11-5-5"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 5-5"/>',
  x:        '<path d="M18 6 6 18M6 6l12 12"/>',
  arrow:    '<path d="M5 12h14M13 6l6 6-6 6"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M3 19h18"/>',
  upload:   '<path d="M12 15V3M7 8l5-5 5 5"/><path d="M3 19h18"/>',
  trash:    '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
  bell:     '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  cap:      '<path d="M22 9 12 4 2 9l10 5 10-5Z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/>',
  trend:    '<path d="m3 17 6-6 4 4 7-7"/><path d="M17 7h4v4"/>',
  spark:    '<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="M6.3 6.3 9 9M15 15l2.7 2.7M17.7 6.3 15 9M9 15l-2.7 2.7"/>',
  copy:     '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  search:   '<circle cx="11" cy="11" r="7"/><path d="m21 21-4-4"/>',
  video:    '<rect x="2" y="5" width="20" height="14" rx="3"/><path d="m10 9 5 3-5 3Z"/>',
  chat:     '<path d="M21 11.5a8 8 0 0 1-11.5 7.1L3 21l2.4-6.5A8 8 0 1 1 21 11.5Z"/>',
  flag:     '<path d="M4 22V4s1-1 4-1 5 2 8 2 4-1 4-1v10s-1 1-4 1-5-2-8-2-4 1-4 1"/>',
  rotate:   '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  zap:      '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
  bookmark: '<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/>',
  filter:   '<path d="M3 5h18l-7 8v6l-4-2v-4Z"/>',
  star:     '<path d="m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18l-5.8 3 1.1-6.5L2.6 9.8l6.5-.9Z"/>',
  list:     '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  shield:   '<path d="M12 2 4 5v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3Z"/>',
  edit:     '<path d="M11 4H4v16h16v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4Z"/>',
  globe:    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z"/>',
  headphones:'<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2" y="14" width="5" height="7" rx="2"/><rect x="17" y="14" width="5" height="7" rx="2"/>',
};

function Icon({ name, size = 20, color, style, strokeWidth = 1.85, className }) {
  const inner = ICON_PATHS[name];
  return React.createElement('svg', {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: color || 'currentColor',
    strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round',
    className, style,
    dangerouslySetInnerHTML: { __html: inner || '' },
  });
}

window.Icon = Icon;
