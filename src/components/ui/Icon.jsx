import {
  CalendarCheck, CalendarDays, GraduationCap, TrendingUp, Menu, LayoutGrid,
  Flame, Clock, Target, Layers, AlertTriangle, Lightbulb, BookOpen, Mic, PenLine,
  Settings, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Plus, Check,
  CheckCircle2, X, ArrowRight, Download, Upload, Trash2, Bell, Sparkles, Copy,
  Search, Video, MessageCircle, Flag, RotateCcw, Zap, Bookmark, Filter, Star,
  List, Shield, Pencil, Globe, Headphones, Circle,
} from 'lucide-react';

// Mapeo de nombres del handoff → componentes lucide-react.
const MAP = {
  today: CalendarCheck, calendar: CalendarDays, practice: GraduationCap,
  progress: TrendingUp, more: Menu, grid: LayoutGrid, flame: Flame, clock: Clock,
  target: Target, layers: Layers, alert: AlertTriangle, bulb: Lightbulb,
  book: BookOpen, mic: Mic, pen: PenLine, settings: Settings,
  left: ChevronLeft, right: ChevronRight, up: ChevronUp, down: ChevronDown,
  plus: Plus, check: Check, checkCircle: CheckCircle2, x: X, arrow: ArrowRight,
  download: Download, upload: Upload, trash: Trash2, bell: Bell, cap: GraduationCap,
  trend: TrendingUp, spark: Sparkles, copy: Copy, search: Search, video: Video,
  chat: MessageCircle, flag: Flag, rotate: RotateCcw, zap: Zap, bookmark: Bookmark,
  filter: Filter, star: Star, list: List, shield: Shield, edit: Pencil,
  globe: Globe, headphones: Headphones,
};

export default function Icon({ name, size = 18, color, strokeWidth = 1.85, ...rest }) {
  const Cmp = MAP[name] || Circle;
  return <Cmp size={size} color={color} strokeWidth={strokeWidth} {...rest} />;
}
