/**
 * Portfolio — Tawab HASSANI
 * Direction visuelle : dark premium / luxe digital / tech raffinée
 *
 * ── SCROLL DETECTION ──────────────────────────────────────────────────────────
 * Passive scroll listener sur <main>. À chaque événement on calcule :
 *   detectionLine = containerRect.top + clientHeight * 0.38
 * Puis on trouve la section dont le centre viewport (getBoundingClientRect)
 * est le plus proche de cette ligne. Un seul gagnant, déterministe.
 * Aucun IntersectionObserver, aucun scroll-snap CSS → zéro saut de section.
 * ──────────────────────────────────────────────────────────────────────────────
 */

import React, {
  useState, useRef, useEffect, useCallback,
  ChangeEvent, useMemo,
} from 'react';
import {
  Mail, ChevronRight, ExternalLink, Cloud, Network,
  Linkedin, MapPin, Gamepad2, Dumbbell, Languages, Send,
  Camera, Menu, X, FolderKanban, Building2, Shield,
  CheckCircle2, Terminal, HardDrive, MessageSquare,
  Home, User, Map, Zap, GraduationCap, FileText,
  Briefcase, Eye, Search, Award, ChevronDown, ArrowRight,
  Lock, Wifi, Server, Code2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & UTILS
// ═══════════════════════════════════════════════════════════════════════════════

type Section =
  | 'Accueil' | 'Présentation' | 'Mon Parcours' | 'Alternances'
  | 'Compétences' | 'BTS SIO' | 'Épreuve E5' | 'Épreuve E6'
  | 'Projets' | 'Veille' | 'Contact';

const toId = (name: string) =>
  name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');

const pad2 = (n: number) => String(n).padStart(2, '0');

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

const navItems: { name: Section; icon: React.ElementType; code: string }[] = [
  { name: 'Accueil',      icon: Home,         code: '01' },
  { name: 'Présentation', icon: User,         code: '02' },
  { name: 'Mon Parcours', icon: Map,          code: '03' },
  { name: 'Alternances',  icon: Building2,    code: '04' },
  { name: 'Compétences',  icon: Zap,          code: '05' },
  { name: 'BTS SIO',      icon: GraduationCap,code: '06' },
  { name: 'Épreuve E5',   icon: FileText,     code: '07' },
  { name: 'Épreuve E6',   icon: FileText,     code: '08' },
  { name: 'Projets',      icon: FolderKanban, code: '09' },
  { name: 'Veille',       icon: Search,       code: '10' },
  { name: 'Contact',      icon: Mail,         code: '11' },
];

const BOOT_LINES = [
  '> INITIATING SECURE_BOOT v2.0...',
  '> KERNEL: HASSANI_OS [BUILD_2025]',
  '> SCANNING IDENTITY_MATRIX...',
  '> ID: TAWAB_HASSANI ─────────── [VERIFIED ✓]',
  '> ROLE: TECHNICIEN_SUPPORT_ALTERNANT',
  '> CLEARANCE: BTS_SIO // OPTION_SISR',
  '> AFFECTATION: DS_AVOCATS_PARIS',
  '> MODULES: [RÉSEAUX] [VIRTUALISATION] [SÉCURITÉ]',
  '> STATUS: DISPONIBLE_ALTERNANCE_2025',
  '> ESTABLISHING_SECURE_CHANNEL...',
  '> ACCESS_GRANTED — BIENVENUE',
];

type SkillColor = 'violet' | 'cyan' | 'indigo' | 'emerald';

const skillDomains: { icon: React.ElementType; label: string; color: SkillColor; skills: string[] }[] = [
  {
    icon: Network,
    label: 'Systèmes & Réseaux',
    color: 'violet',
    skills: ['Linux', 'Windows Server', 'Active Directory', 'DNS / DHCP', 'TCP/IP', 'VMware vSphere', 'Citrix DaaS'],
  },
  {
    icon: HardDrive,
    label: 'Hardware & Support',
    color: 'cyan',
    skills: ['Microsoft Admin Center', 'Exchange Administration', 'Montage PC', 'Diagnostic pannes', 'BIOS / UEFI'],
  },
  {
    icon: Shield,
    label: 'Sécurité & Infrastructure',
    color: 'indigo',
    skills: ['Sécurité réseaux', 'VPN & Pare-feu', 'Gestion des accès', 'VLAN & Segmentation'],
  },
  {
    icon: Terminal,
    label: 'Outils & Scripting',
    color: 'emerald',
    skills: ['PowerShell', 'Bash', 'Cisco Packet Tracer', 'GLPI / ITSM'],
  },
];

const timelineData = [
  {
    period: 'Sept. 2024 → Présent', active: true, type: 'work',
    title: 'Alternant Technicien Support', org: 'DS Avocats — Paris',
    points: [
      'Déploiement & configuration OS (PC/mobiles)',
      'Gestion de parc via Microsoft Admin Center',
      'Administration vSphere & Citrix DaaS',
      'Support technique de proximité & à distance',
      'Administration messagerie Exchange',
    ],
  },
  {
    period: 'Sept. 2024 → Présent', active: true, type: 'edu',
    title: 'BTS SIO option SISR', org: 'ESTIAM — Paris',
    points: ['Active Directory, Linux, Cisco', 'Virtualisation & sécurité', 'TCP/IP, Réseaux'],
  },
  {
    period: 'Nov. — Déc. 2023', active: false, type: 'work',
    title: 'Technicien de maintenance', org: 'Les Réparateurs Mac & PC — Montreuil',
    points: ['Montage PC sur mesure', 'Diagnostic matériel & pannes', 'Création clés boot BIOS/UEFI'],
  },
  {
    period: '2021 → 2024', active: false, type: 'edu',
    title: 'Bac Systèmes Numériques', org: 'Lycée Alfred Costes — Bobigny',
    points: ['Option RISC — Réseaux & Systèmes Communicants'],
  },
  {
    period: 'Mai — Juin 2023', active: false, type: 'work',
    title: 'Électricien de maintenance', org: 'Helbul — Paris',
    points: ['Câblage & installation électrique', 'Diagnostic et maintenance'],
  },
];

const projects = [
  {
    code: 'PRJ-01', status: 'DÉPLOYÉ',
    title: 'Cloud Privé — Nextcloud',
    desc: "Déploiement d'une solution de cloud privé auto-hébergée. Alternative sécurisée et souveraine aux services cloud grand public, avec gestion avancée des utilisateurs et des accès.",
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
    icon: Cloud,
    tech: ['Nextcloud', 'Linux', 'Apache', 'SSL/TLS', 'MariaDB'],
  },
  {
    code: 'PRJ-02', status: 'ARCHIVÉ',
    title: 'Infrastructure Réseau Sécurisée',
    desc: "Mise en œuvre d'une infrastructure réseau segmentée avec VLANs, filtrage par pare-feu et accès distant sécurisé via VPN. Simulation complète sur Cisco Packet Tracer.",
    img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200',
    icon: Network,
    tech: ['VLANs', 'Pare-feu', 'VPN', 'Cisco IOS', 'Packet Tracer'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MOTION VARIANTS
// ═══════════════════════════════════════════════════════════════════════════════

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MICRO-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// ── Subtle corner brackets ────────────────────────────────────────────────────
const CornerAccents = ({
  size = 10, color = 'border-violet-500/25', className = '',
}: {
  size?: number; color?: string; className?: string;
}) => (
  <>
    <span className={`absolute top-0 left-0 corner-tl ${color} ${className}`} style={{ width: size, height: size }} />
    <span className={`absolute top-0 right-0 corner-tr ${color} ${className}`} style={{ width: size, height: size }} />
    <span className={`absolute bottom-0 left-0 corner-bl ${color} ${className}`} style={{ width: size, height: size }} />
    <span className={`absolute bottom-0 right-0 corner-br ${color} ${className}`} style={{ width: size, height: size }} />
  </>
);

// ── Section label (elegant, discreet) ────────────────────────────────────────
const SectionLabel = ({ sub }: { sub: string }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="h-px w-6 bg-violet-500/50" />
    <span className="font-sys text-[10px] text-violet-400/60 tracking-[0.28em] uppercase">{sub}</span>
  </div>
);

// ── Section heading — large, imposing ────────────────────────────────────────
const SectionHeading = ({ title, sub }: { title: string; sub?: string }) => (
  <div className="mb-16">
    {sub && <SectionLabel sub={sub} />}
    <h2 className="text-5xl lg:text-7xl font-black tracking-tighter text-white leading-[0.92]">
      {title}
    </h2>
    <div className="mt-5 flex items-center gap-3">
      <div className="h-[2px] w-16 bg-gradient-to-r from-violet-500 to-violet-500/0" />
      <div className="h-[2px] w-6 bg-cyan-500/40" />
    </div>
  </div>
);

// ── Premium 3D Tilt card wrapper ─────────────────────────────────────────────
const Tilt = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref     = useRef<HTMLDivElement>(null);
  const specRef = useRef<HTMLDivElement>(null);

  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !specRef.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    const rx = (x - 0.5) * 8;
    const ry = (y - 0.5) * 8;
    ref.current.style.transform =
      `perspective(1400px) rotateY(${rx}deg) rotateX(${-ry}deg) translateZ(6px)`;
    ref.current.style.boxShadow =
      `${-rx * 2}px ${ry * 2}px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.08)`;
    specRef.current.style.background =
      `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.07) 0%, transparent 55%)`;
    specRef.current.style.opacity = '1';
  };

  const reset = () => {
    if (ref.current) {
      ref.current.style.transform = '';
      ref.current.style.boxShadow = '';
    }
    if (specRef.current) specRef.current.style.opacity = '0';
  };

  return (
    <div ref={ref} onMouseMove={move} onMouseLeave={reset}
      className={`relative transition-all duration-500 ease-out ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div
        ref={specRef}
        className="absolute inset-0 pointer-events-none z-[5] opacity-0 transition-opacity duration-200"
      />
      {children}
    </div>
  );
};

// ── Premium card base ─────────────────────────────────────────────────────────
const Card = ({
  children, className = '', accent = 'violet', hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: 'violet' | 'cyan' | 'indigo' | 'emerald' | 'none';
  hover?: boolean;
}) => {
  const accents = {
    violet:  'hover:border-violet-500/25 hover:bg-white/[0.04]',
    cyan:    'hover:border-cyan-500/20 hover:bg-white/[0.04]',
    indigo:  'hover:border-indigo-500/20 hover:bg-white/[0.04]',
    emerald: 'hover:border-emerald-500/20 hover:bg-white/[0.04]',
    none:    '',
  };
  return (
    <div className={`
      relative border border-white/[0.07] bg-white/[0.025] p-7
      transition-all duration-400
      ${hover ? accents[accent] : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

// ── Skill domain card ─────────────────────────────────────────────────────────
const SkillDomainCard = ({
  domain,
}: {
  domain: typeof skillDomains[number];
}) => {
  const cfg = {
    violet:  { border: 'border-violet-500/20',  iconBg: 'bg-violet-500/10',  iconClr: 'text-violet-400',  tag: 'bg-violet-500/10 border-violet-500/20 text-violet-300',  heading: 'bg-violet-500' },
    cyan:    { border: 'border-cyan-500/15',    iconBg: 'bg-cyan-500/10',    iconClr: 'text-cyan-400',    tag: 'bg-cyan-500/8 border-cyan-500/15 text-cyan-300',       heading: 'bg-cyan-500' },
    indigo:  { border: 'border-indigo-500/20',  iconBg: 'bg-indigo-500/10',  iconClr: 'text-indigo-400',  tag: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300', heading: 'bg-indigo-500' },
    emerald: { border: 'border-emerald-500/15', iconBg: 'bg-emerald-500/8',  iconClr: 'text-emerald-400', tag: 'bg-emerald-500/8 border-emerald-500/15 text-emerald-300',heading: 'bg-emerald-500' },
  };
  const c = cfg[domain.color];
  return (
    <motion.div variants={fadeUp}>
      <Tilt className="h-full">
        <div className={`
          relative border ${c.border} bg-white/[0.025] p-7
          hover:bg-white/[0.04] transition-all duration-400 h-full
        `}>
          {/* Icon + label */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${c.iconBg} shrink-0`}>
              <domain.icon size={20} className={c.iconClr} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">{domain.label}</h3>
              <div className={`mt-1.5 h-[2px] w-8 ${c.heading} opacity-60`} />
            </div>
          </div>
          {/* Skill tags */}
          <div className="flex flex-wrap gap-2">
            {domain.skills.map(skill => (
              <span key={skill}
                className={`
                  text-xs px-3 py-1.5 rounded-full border font-medium
                  tracking-wide transition-all duration-200
                  ${c.tag}
                `}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PREMIUM BACKGROUND
// ═══════════════════════════════════════════════════════════════════════════════

const PremiumBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none noise" aria-hidden>
    {/* Base deep dark */}
    <div className="absolute inset-0 bg-[#06060f]" />

    {/* Top center radial light source */}
    <div className="ambient-pulse absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px]"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(109,40,217,0.13) 0%, transparent 65%)' }}
    />

    {/* Ambient color blobs */}
    <div className="blob-1 absolute -top-40 -left-40 w-[800px] h-[800px] rounded-full"
      style={{ background: 'radial-gradient(circle, rgba(109,40,217,0.1) 0%, transparent 60%)' }}
    />
    <div className="blob-2 absolute top-1/3 -right-32 w-[550px] h-[550px] rounded-full"
      style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 60%)' }}
    />
    <div className="blob-3 absolute -bottom-20 left-1/4 w-[700px] h-[700px] rounded-full"
      style={{ background: 'radial-gradient(circle, rgba(67,56,202,0.07) 0%, transparent 60%)' }}
    />
    <div className="blob-4 absolute top-2/3 -left-20 w-[400px] h-[400px] rounded-full"
      style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 60%)' }}
    />

    {/* Vignette */}
    <div className="absolute inset-0"
      style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.6) 100%)' }}
    />

    {/* Very subtle horizontal gradient bands */}
    <div className="absolute inset-0 opacity-[0.015]"
      style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(139,92,246,1) 80px, rgba(139,92,246,1) 81px)',
      }}
    />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// BOOT SEQUENCE
// ═══════════════════════════════════════════════════════════════════════════════

const BootSequence = ({ onDone }: { onDone: () => void }) => {
  const [lines, setLines]     = useState<string[]>([]);
  const [pct, setPct]         = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let i = 0;
    const tick = () => {
      if (i < BOOT_LINES.length) {
        setLines(prev => [...prev, BOOT_LINES[i]]);
        setPct(Math.round(((i + 1) / BOOT_LINES.length) * 100));
        i++;
        setTimeout(tick, 50 + Math.random() * 75);
      } else {
        setTimeout(() => {
          setExiting(true);
          setTimeout(onDone, 450);
        }, 300);
      }
    };
    const t = setTimeout(tick, 250);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-[#06060f] flex flex-col overflow-hidden"
      animate={exiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      {/* Subtle grid bg */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(139,92,246,1) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col justify-center px-8 lg:px-28 max-w-3xl mx-auto w-full">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-sys text-[10px] text-emerald-400 tracking-[0.3em] uppercase">
            SECURE_TERMINAL — NODE_PORTFOLIO
          </span>
          <div className="flex-1 h-px bg-emerald-400/15" />
        </div>

        <div className="space-y-1.5 mb-10">
          {lines.map((line, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.12 }}
              className={`font-sys text-[12px] lg:text-sm leading-relaxed ${
                line.includes('ACCESS_GRANTED')
                  ? 'text-emerald-400 font-bold'
                  : line.includes('[VERIFIED')
                  ? 'text-cyan-400'
                  : line.includes('DISPONIBLE')
                  ? 'text-violet-400'
                  : 'text-slate-400'
              }`}
            >
              {line}
            </motion.div>
          ))}
          {!exiting && (
            <span className="inline-block w-2 h-4 bg-violet-400 cursor-blink ml-1 align-middle" />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between font-sys text-[10px] text-slate-600">
            <span>LOADING PROFILE DATA</span>
            <span>{pct}%</span>
          </div>
          <div className="h-[2px] bg-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-600 to-cyan-400"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.08 }}
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 px-8 py-4 flex justify-between font-sys text-[9px] text-slate-800">
        <span>{new Date().toISOString()}</span>
        <span>TH.PORTFOLIO // v2.0.25</span>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// FLOATING NAV (desktop right-edge dots)
// ═══════════════════════════════════════════════════════════════════════════════

const FloatingNav = ({
  active, navigateTo,
}: {
  active: Section;
  navigateTo: (s: Section) => void;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="hidden lg:flex fixed right-5 top-1/2 -translate-y-1/2 z-[80] flex-col gap-2 items-end"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {navItems.map(({ name }, i) => {
        const isActive = active === name;
        return (
          <button
            key={name}
            onClick={() => navigateTo(name)}
            className="flex items-center gap-2.5 group"
            title={name}
          >
            <AnimatePresence>
              {hovered && (
                <motion.span
                  initial={{ opacity: 0, x: 8, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: 'auto' }}
                  exit={{ opacity: 0, x: 8, width: 0 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className={`text-[10px] tracking-wider whitespace-nowrap overflow-hidden font-medium ${
                    isActive ? 'text-white' : 'text-slate-600 group-hover:text-slate-400'
                  }`}
                >
                  {name}
                </motion.span>
              )}
            </AnimatePresence>
            <div
              className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                isActive
                  ? 'w-7 h-7 border border-violet-400/60 bg-violet-500/20 glow-flicker'
                  : 'w-4 h-4 border border-white/[0.12] bg-white/[0.03] hover:border-violet-500/40 hover:bg-violet-600/10 hover:w-5 hover:h-5'
              }`}
            >
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-violet-300" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MOBILE MENU
// ═══════════════════════════════════════════════════════════════════════════════

const MobileMenu = ({
  isOpen, onClose, active, navigateTo,
}: {
  isOpen: boolean; onClose: () => void;
  active: Section; navigateTo: (s: Section) => void;
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        key="mobile-menu"
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="lg:hidden fixed inset-0 z-[150] bg-[#06060f]/98 backdrop-blur-md flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/[0.05]">
          <span className="text-sm font-bold text-white tracking-wider">Navigation</span>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 py-4 overflow-y-auto">
          {navItems.map(({ name }, i) => (
            <motion.button
              key={name}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              onClick={() => { navigateTo(name); onClose(); }}
              className={`flex items-center justify-between py-4 border-b border-white/[0.04] text-left group w-full ${
                active === name ? 'border-violet-500/20' : ''
              }`}
            >
              <span className={`text-lg font-bold tracking-tight transition-colors ${
                active === name ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
              }`}>
                {name}
              </span>
              {active === name && (
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              )}
            </motion.button>
          ))}
        </div>

        <div className="p-6 border-t border-white/[0.05]">
          <span className="text-xs text-slate-700">Tawab Hassani — Portfolio 2025</span>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SCROLL PROGRESS (left edge)
// ═══════════════════════════════════════════════════════════════════════════════

const ScrollProgress = ({ pct }: { pct: number }) => (
  <div className="fixed left-0 top-0 bottom-0 z-[90] w-[2px] bg-white/[0.03] hidden lg:block">
    <motion.div
      className="w-full origin-top bg-gradient-to-b from-violet-500 via-indigo-500 to-cyan-400"
      style={{ scaleY: pct, height: '100%' }}
    />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// AVATAR
// ═══════════════════════════════════════════════════════════════════════════════

const ScanAvatar = ({ src, onClick }: { src: string; onClick: () => void }) => (
  <div className="relative w-52 h-52 lg:w-72 lg:h-72 shrink-0 cursor-pointer group" onClick={onClick}>
    {/* Slow conic ring */}
    <div className="conic-spin absolute -inset-3 rounded-2xl opacity-50"
      style={{ background: 'conic-gradient(from 0deg, rgba(124,58,237,0.9), rgba(6,182,212,0.6), rgba(124,58,237,0.9))' }}
    />
    <div className="conic-spin-rev absolute -inset-[5px] rounded-2xl opacity-25"
      style={{ background: 'conic-gradient(from 90deg, rgba(67,56,202,0.7), transparent 55%, rgba(67,56,202,0.7))' }}
    />
    {/* Image */}
    <div className="relative w-full h-full overflow-hidden rounded-xl border border-white/10 bg-[#0a0818]">
      <img src={src} alt="Tawab HASSANI"
        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
        referrerPolicy="no-referrer"
        style={{ filter: 'grayscale(15%) contrast(1.05)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-violet-900/30 via-transparent to-transparent pointer-events-none" />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
        <Camera size={22} className="text-white" />
      </div>
    </div>
    {/* Scan beam */}
    <div className="absolute left-0 right-0 h-[2px] scan-beam pointer-events-none z-10 rounded-full"
      style={{ background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.8), transparent)' }}
    />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════════════════════════

const HeroSection = ({
  id, profileImage, onContact, onProjects, onImageUpload,
}: {
  id: string; profileImage: string | null;
  onContact: () => void; onProjects: () => void; onImageUpload: () => void;
}) => {
  const name1 = 'TAWAB'.split('');
  const name2 = 'HASSANI'.split('');

  return (
    <section id={id}
      className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center gap-14 lg:gap-24 px-6 lg:px-24 py-28"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-14 lg:gap-24">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <ScanAvatar src={profileImage || './me.png'} onClick={onImageUpload} />
        </motion.div>

        {/* Identity */}
        <div className="flex-1">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-px w-8 bg-violet-500" />
            <span className="font-sys text-[10px] text-violet-400/70 tracking-[0.28em] uppercase">
              Technicien Support — Alternant
            </span>
          </motion.div>

          {/* Name */}
          <div className="mb-7">
            <div className="flex gap-1.5 lg:gap-2 mb-1 flex-wrap">
              {name1.map((ch, i) => (
                <motion.span key={i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.055, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="text-6xl lg:text-8xl font-black tracking-[0.06em] text-white leading-none"
                >
                  {ch}
                </motion.span>
              ))}
            </div>
            <div className="flex gap-1.5 lg:gap-2 flex-wrap">
              {name2.map((ch, i) => (
                <motion.span key={i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.68 + i * 0.055, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="text-6xl lg:text-8xl font-black tracking-[0.06em] shimmer-text leading-none"
                >
                  {ch}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="origin-left h-px bg-gradient-to-r from-violet-500 via-cyan-400/40 to-transparent mb-6"
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="text-slate-400 text-base leading-relaxed mb-8 max-w-lg"
          >
            Étudiant en <span className="text-white font-semibold">BTS SIO SISR</span> à l'Estiam Paris,
            spécialisé en <span className="text-white font-semibold">infrastructure réseau</span> et{' '}
            <span className="text-white font-semibold">cybersécurité</span>. En alternance chez{' '}
            <span className="text-violet-300 font-semibold">DS Avocats</span>.
          </motion.p>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="flex flex-wrap gap-3 mb-9"
          >
            {[
              { label: 'Disponible 2025', color: 'text-emerald-400 border-emerald-500/25 bg-emerald-500/5' },
              { label: 'Île-de-France',   color: 'text-slate-300 border-white/10 bg-white/[0.03]' },
              { label: 'Bachelor Cyber',  color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5' },
            ].map(b => (
              <span key={b.label}
                className={`text-sm font-medium px-4 py-1.5 border rounded-full tracking-wide ${b.color}`}
              >
                {b.label}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.45, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <button onClick={onContact}
              className="group relative flex items-center justify-center gap-2 px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm tracking-wider rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:scale-[1.02] overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative">Me contacter</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={onProjects}
              className="flex items-center justify-center gap-2 px-8 py-3.5 border border-white/10 hover:border-violet-500/40 text-slate-300 hover:text-white font-bold text-sm tracking-wider rounded-lg transition-all duration-300 hover:bg-violet-600/10"
            >
              Voir mes projets
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-slate-700 tracking-[0.3em] uppercase font-medium">Défiler</span>
        <div className="w-px h-10 bg-gradient-to-b from-violet-500/50 to-transparent float-y" />
      </motion.div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRESENTATION SECTION
// ═══════════════════════════════════════════════════════════════════════════════

const IdentitySection = ({ id }: { id: string }) => (
  <section id={id} className="relative min-h-screen flex flex-col justify-center px-6 lg:px-24 py-28">
    <div className="max-w-7xl mx-auto w-full">
      <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.06 }}>
        <motion.div variants={fadeUp}>
          <SectionHeading title="Présentation" sub="À propos" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main bio */}
          <motion.div variants={fadeUp} className="lg:col-span-2">
            <Tilt>
              <Card accent="violet" className="h-full">
                <CornerAccents color="border-violet-500/20" />
                <p className="text-slate-300 leading-relaxed text-base mb-7">
                  Étudiant en <span className="text-white font-semibold">BTS SIO SISR</span> à l'Estiam Paris.
                  Passionné par les <span className="text-white font-semibold">infrastructures IT</span> et la{' '}
                  <span className="text-white font-semibold">cybersécurité</span>, je combine formation théorique
                  et expérience pratique en alternance chez{' '}
                  <span className="text-violet-300 font-semibold">DS Avocats</span>, un cabinet d'avocats
                  international à Paris.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-6 border-t border-white/[0.05]">
                  {[
                    { k: 'Formation',  v: 'BTS SIO SISR 2024–26' },
                    { k: 'Alternance', v: 'DS Avocats, Paris' },
                    { k: 'Objectif',   v: 'Bachelor Cybersécurité' },
                  ].map(({ k, v }) => (
                    <div key={k}>
                      <div className="text-[11px] text-slate-600 uppercase tracking-widest mb-1 font-medium">{k}</div>
                      <div className="text-sm text-white font-bold">{v}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </Tilt>
          </motion.div>

          {/* Qualities */}
          <motion.div variants={fadeUp}>
            <Tilt className="h-full">
              <Card accent="cyan" className="h-full">
                <CornerAccents color="border-cyan-500/15" />
                <div className="text-[11px] text-slate-600 uppercase tracking-widest mb-6 font-medium">Atouts</div>
                <ul className="space-y-5">
                  {[
                    { t: 'Sens du service', d: 'Écoute active & pédagogie' },
                    { t: 'Rigueur',         d: 'Analyse méthodique & documentation' },
                    { t: 'Adaptabilité',    d: 'Montée en compétences rapide' },
                  ].map(a => (
                    <li key={a.t} className="flex gap-3">
                      <CheckCircle2 size={16} className="text-violet-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-sm font-bold text-white">{a.t}</div>
                        <div className="text-[12px] text-slate-500 mt-0.5">{a.d}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </Tilt>
          </motion.div>

          {/* Interests */}
          <motion.div variants={fadeUp} className="lg:col-span-3">
            <Card accent="none" className="border-white/[0.05]">
              <div className="text-[11px] text-slate-600 uppercase tracking-widest mb-6 font-medium">Centres d'intérêt</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { Icon: Dumbbell,  t: 'Sport & Coaching',   d: 'Musculation et course à pied',     c: 'text-orange-400 bg-orange-500/10' },
                  { Icon: Gamepad2,  t: 'Gaming & Hardware',  d: 'Montage et optimisation PC',        c: 'text-blue-400 bg-blue-500/10' },
                  { Icon: Languages, t: 'Langues',            d: 'Anglais (intermédiaire) · Swahili', c: 'text-emerald-400 bg-emerald-500/10' },
                ].map(({ Icon, t, d, c }) => (
                  <div key={t} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${c.split(' ')[1]}`}>
                      <Icon size={18} className={c.split(' ')[0]} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{t}</div>
                      <div className="text-[12px] text-slate-500 mt-0.5">{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// PARCOURS SECTION
// ═══════════════════════════════════════════════════════════════════════════════

const ArchiveSection = ({ id }: { id: string }) => (
  <section id={id} className="relative min-h-screen flex flex-col justify-center px-6 lg:px-24 py-28">
    <div className="max-w-7xl mx-auto w-full">
      <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.04 }}>
        <motion.div variants={fadeUp}>
          <SectionHeading title="Mon Parcours" sub="Chronologie" />
        </motion.div>

        <div className="relative max-w-4xl">
          {/* Vertical line */}
          <div className="absolute left-[11px] top-0 bottom-0 w-px bg-gradient-to-b from-violet-500 via-violet-500/30 to-transparent" />

          <div className="space-y-5">
            {timelineData.map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="relative pl-12">
                {/* Node */}
                <div className={`absolute left-0 top-5 w-[23px] h-[23px] rounded-md border flex items-center justify-center transition-all ${
                  item.active
                    ? 'border-violet-500/70 bg-violet-600/20 shadow-[0_0_14px_rgba(139,92,246,0.55)]'
                    : 'border-slate-700/60 bg-[#06060f]'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${item.active ? 'bg-violet-300' : 'bg-slate-700'}`} />
                </div>

                <Tilt>
                  <div className="relative border border-white/[0.06] hover:border-violet-500/15 transition-all duration-300 p-6 bg-white/[0.025] group">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-4">
                      <div className="flex-1">
                        <div className={`text-[11px] tracking-[0.18em] mb-1 font-medium uppercase ${
                          item.active ? 'text-violet-400' : 'text-slate-600'
                        }`}>
                          {item.period}
                        </div>
                        <h4 className="text-base font-bold text-white tracking-tight">{item.title}</h4>
                        <div className="text-[12px] text-slate-500 mt-0.5 font-medium">{item.org}</div>
                      </div>
                      <span className={`text-[10px] tracking-widest px-3 py-1 border rounded-full shrink-0 font-medium ${
                        item.type === 'edu'
                          ? 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5'
                          : 'text-violet-400 border-violet-500/20 bg-violet-500/5'
                      }`}>
                        {item.type === 'edu' ? 'Formation' : 'Mission'}
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {item.points.map((p, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-[12px] text-slate-500">
                          <ChevronRight size={11} className="text-violet-600 mt-0.5 shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// ALTERNANCES SECTION
// ═══════════════════════════════════════════════════════════════════════════════

const MissionSection = ({ id }: { id: string }) => (
  <section id={id} className="relative min-h-screen flex flex-col justify-center px-6 lg:px-24 py-28">
    <div className="max-w-7xl mx-auto w-full">
      <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.04 }}>
        <motion.div variants={fadeUp}>
          <SectionHeading title="Mon Alternance" sub="DS Avocats — Paris" />
        </motion.div>

        {/* Main card */}
        <motion.div variants={fadeUp} className="max-w-5xl mb-8">
          <Tilt>
            <div className="relative border border-violet-500/20 p-9 bg-gradient-to-br from-violet-600/6 via-transparent to-indigo-600/6">
              <CornerAccents size={14} color="border-violet-500/30" />
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="w-16 h-16 border border-white/10 flex items-center justify-center shrink-0 bg-white/[0.03] rounded-xl">
                  <span className="text-xl font-black text-white">DS</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white mb-1 tracking-tight">DS Avocats — Paris</h3>
                  <p className="text-[11px] text-violet-400 tracking-[0.18em] mb-5 font-medium uppercase">
                    Cabinet d'avocats international · Depuis sept. 2024
                  </p>
                  <p className="text-slate-400 leading-relaxed max-w-2xl">
                    Intégré à l'équipe informatique comme{' '}
                    <span className="text-white font-semibold">alternant technicien support</span>.
                    Déploiement de postes,{' '}
                    <span className="text-white font-semibold">gestion de parc</span>, administration via{' '}
                    <span className="text-violet-300 font-semibold">Microsoft Admin Center</span> et{' '}
                    <span className="text-violet-300 font-semibold">vSphere</span>, support aux avocats.
                  </p>
                </div>
              </div>
            </div>
          </Tilt>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-5xl mb-10">
          {/* Missions */}
          <motion.div variants={fadeUp}>
            <Tilt className="h-full">
              <Card accent="violet" className="h-full">
                <div className="flex items-center gap-2 text-[11px] text-slate-500 uppercase tracking-widest mb-5 font-medium">
                  <Terminal size={12} className="text-violet-400" /> Missions
                </div>
                <ul className="space-y-3">
                  {[
                    'Déploiement OS & logiciels (PC/mobiles)',
                    'Gestion de parc & inventaire des actifs',
                    'Administration vSphere & Citrix DaaS',
                    'Support utilisateur proximité & distance',
                    'Administration messagerie Exchange',
                    'Comptes via Microsoft Admin Center',
                  ].map((m, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13px] text-slate-400">
                      <ChevronRight size={12} className="text-violet-500 mt-0.5 shrink-0" />
                      {m}
                    </li>
                  ))}
                </ul>
              </Card>
            </Tilt>
          </motion.div>

          {/* Org chart */}
          <motion.div variants={fadeUp}>
            <Tilt className="h-full">
              <Card accent="cyan" className="h-full">
                <div className="flex items-center gap-2 text-[11px] text-slate-500 uppercase tracking-widest mb-6 font-medium">
                  <Network size={12} className="text-cyan-400" /> Organigramme SI
                </div>
                <div className="flex flex-col items-center gap-3">
                  {[
                    { n: 'Benjamin Gerard',  r: 'Directeur DSI' },
                    { n: 'Jonathan Benyair', r: 'Responsable SI & DPO' },
                  ].map((p, i) => (
                    <div key={p.n} className="flex flex-col items-center gap-2 w-full">
                      <div className="w-full px-4 py-3 border border-white/[0.07] bg-white/[0.02] text-center rounded-lg">
                        <div className="text-sm font-bold text-white">{p.n}</div>
                        <div className="text-[11px] text-slate-600 mt-0.5">{p.r}</div>
                      </div>
                      {i < 1 && <div className="w-px h-4 bg-violet-500/30" />}
                    </div>
                  ))}
                  <div className="w-px h-4 bg-violet-500/30" />
                  <div className="flex flex-wrap justify-center gap-3 w-full">
                    <div className="px-4 py-3 border border-white/[0.07] bg-white/[0.02] text-center rounded-lg">
                      <div className="text-sm font-bold text-white">Karesh V.</div>
                      <div className="text-[11px] text-slate-600">Alternant</div>
                    </div>
                    <div className="px-4 py-3 border border-violet-500/35 bg-violet-600/10 text-center rounded-lg">
                      <div className="text-sm font-bold text-white">Tawab H.</div>
                      <div className="text-[11px] text-violet-400 font-medium">Alternant · moi</div>
                    </div>
                  </div>
                </div>
              </Card>
            </Tilt>
          </motion.div>
        </div>

        {/* Gallery */}
        <motion.div variants={fadeUp} className="max-w-5xl">
          <div className="text-[11px] text-slate-700 tracking-[0.25em] uppercase mb-4 font-medium flex items-center gap-2">
            <Camera size={11} /> Photos
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800', l: 'vSphere & Citrix' },
              { src: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200', l: 'Câblage réseau' },
              { src: 'https://images.unsplash.com/photo-1521791136064-7986c2923216?auto=format&fit=crop&q=80&w=800', l: 'Support utilisateur' },
              { src: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80&w=800', l: 'Salle serveur' },
            ].map(img => (
              <div key={img.l}
                className="group relative aspect-video overflow-hidden border border-white/[0.05] hover:border-violet-500/20 transition-all duration-300 rounded-lg"
              >
                <img src={img.src} alt={img.l}
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-75 transition-all duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 rounded-lg">
                  <span className="text-[11px] text-white font-medium">{img.l}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// COMPÉTENCES SECTION — domaines d'expertise premium
// ═══════════════════════════════════════════════════════════════════════════════

const ArsenalSection = ({ id }: { id: string }) => (
  <section id={id} className="relative min-h-screen flex flex-col justify-center px-6 lg:px-24 py-28">
    <div className="max-w-7xl mx-auto w-full">
      <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.04 }}>
        <motion.div variants={fadeUp}>
          <SectionHeading title="Compétences" sub="Domaines d'expertise" />
        </motion.div>

        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl">
          {skillDomains.map(domain => (
            <SkillDomainCard key={domain.label} domain={domain} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// BTS SIO SECTION
// ═══════════════════════════════════════════════════════════════════════════════

const SystemSection = ({ id }: { id: string }) => (
  <section id={id} className="relative min-h-screen flex flex-col justify-center px-6 lg:px-24 py-28">
    <div className="max-w-7xl mx-auto w-full">
      <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.04 }}>
        <motion.div variants={fadeUp}>
          <SectionHeading title="BTS SIO" sub="Diplôme Bac+2" />
        </motion.div>

        <motion.div variants={fadeUp} className="max-w-4xl mb-9">
          <Card accent="none" className="border-white/[0.06]">
            <p className="text-slate-400 leading-relaxed">
              Le <span className="text-white font-semibold">Brevet de Technicien Supérieur SIO</span>{' '}
              (Services informatiques aux Organisations) forme en{' '}
              <span className="text-white font-semibold">2 ans</span> aux métiers d'administrateur réseau
              ou développeur. Niveau <span className="text-white font-semibold">Bac+2</span> préparé{' '}
              <span className="text-white font-semibold">en alternance</span>. Deux spécialités :{' '}
              <span className="text-violet-400 font-semibold">SISR</span> &{' '}
              <span className="text-cyan-400 font-semibold">SLAM</span>.
            </p>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
          {[
            {
              option: 'SISR', full: "Solutions d'Infrastructure, Systèmes et Réseaux",
              desc: 'Réseaux, équipements, sécurité, administration des infrastructures.',
              roles: ["Administrateur sys. & réseaux", "Technicien support & déploiement", "Technicien d'infrastructure", "Technicien micro & réseaux"],
              color: 'violet' as const, mine: true,
            },
            {
              option: 'SLAM', full: 'Solutions Logicielles et Applications Métiers',
              desc: "Développement d'applications, de l'analyse à la maintenance.",
              roles: ["Développeur d'applications", "Analyste programmeur", "Responsable des services applicatifs", "Chargé d'études informatiques"],
              color: 'cyan' as const, mine: false,
            },
          ].map(opt => (
            <motion.div key={opt.option} variants={fadeUp}>
              <Tilt className="h-full">
                <div className={`relative border p-8 h-full bg-white/[0.025] ${
                  opt.mine ? 'border-violet-500/25' : 'border-white/[0.07]'
                }`}>
                  <CornerAccents color={opt.mine ? 'border-violet-500/25' : 'border-white/[0.08]'} />
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h3 className={`text-3xl font-black mb-1.5 ${
                        opt.color === 'violet' ? 'text-violet-400' : 'text-cyan-400'
                      }`}>
                        {opt.option}
                      </h3>
                      <p className="text-[11px] text-slate-600 tracking-wide font-medium">{opt.full}</p>
                    </div>
                    {opt.mine && (
                      <span className="text-[10px] border border-violet-500/30 bg-violet-600/10 text-violet-300 px-3 py-1 rounded-full shrink-0 font-medium tracking-wider">
                        Ma voie
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 leading-relaxed mb-6 text-sm">{opt.desc}</p>
                  <ul className="space-y-2.5">
                    {opt.roles.map(r => (
                      <li key={r} className="flex items-center gap-2.5 text-[13px] text-slate-400">
                        <ChevronRight size={12} className={opt.color === 'violet' ? 'text-violet-500' : 'text-cyan-500'} />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// PLACEHOLDER (E5 / E6 / Veille)
// ═══════════════════════════════════════════════════════════════════════════════

const DossierPlaceholder = ({ id, name, sub }: { id: string; name: string; sub: string }) => (
  <section id={id} className="relative min-h-screen flex flex-col justify-center px-6 lg:px-24 py-28">
    <div className="max-w-7xl mx-auto w-full">
      <SectionHeading title={name} sub={sub} />
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl"
      >
        <div className="relative border border-white/[0.06] p-16 text-center bg-white/[0.02] rounded-xl">
          <CornerAccents size={12} color="border-white/[0.08]" />
          <div className="w-14 h-14 border border-white/[0.07] flex items-center justify-center mx-auto mb-6 rounded-xl bg-white/[0.02]">
            <Lock size={22} className="text-slate-700" />
          </div>
          <div className="text-base font-bold text-slate-500 mb-2">{name}</div>
          <p className="text-[12px] text-slate-700 tracking-wide">Contenu en cours de rédaction</p>
        </div>
      </motion.div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// PROJETS SECTION
// ═══════════════════════════════════════════════════════════════════════════════

const ProjectCard = ({
  proj, index,
}: {
  proj: typeof projects[number]; index: number;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div variants={fadeUp}
      className="border border-white/[0.07] hover:border-violet-500/20 transition-all duration-300 bg-white/[0.025] rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 text-left group"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/15 flex items-center justify-center shrink-0">
            <proj.icon size={18} className="text-violet-400" />
          </div>
          <div className="min-w-0">
            <div className="font-sys text-[10px] text-slate-600 mb-0.5">{proj.code}</div>
            <h3 className="font-bold text-white text-base tracking-tight truncate">{proj.title}</h3>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className={`text-[11px] border px-3 py-1 rounded-full font-medium ${
            proj.status === 'DÉPLOYÉ'
              ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
              : 'border-slate-600/50 text-slate-500 bg-white/[0.02]'
          }`}>
            {proj.status}
          </span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="w-7 h-7 border border-white/[0.08] rounded-md flex items-center justify-center group-hover:border-violet-500/30"
          >
            <ChevronDown size={13} className="text-slate-500" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/[0.05]"
          >
            <div className="p-7 grid grid-cols-1 lg:grid-cols-5 gap-7">
              <div className="lg:col-span-3">
                <p className="text-slate-400 leading-relaxed mb-6">{proj.desc}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {proj.tech.map(t => (
                    <span key={t}
                      className="text-[12px] border border-violet-500/15 text-violet-300 px-3 py-1.5 bg-violet-500/5 rounded-full font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <button className="group flex items-center gap-2 text-sm text-white border border-white/10 hover:border-violet-500/40 px-5 py-2.5 hover:bg-violet-600/10 transition-all rounded-lg font-medium">
                  Voir le dossier
                  <ExternalLink size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
              <div className="lg:col-span-2 relative h-40 border border-white/[0.06] overflow-hidden rounded-lg">
                <img src={proj.img} alt={proj.title}
                  className="w-full h-full object-cover grayscale opacity-30 hover:opacity-50 hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <proj.icon size={32} className="text-violet-400/30" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const OperationsSection = ({ id }: { id: string }) => (
  <section id={id} className="relative min-h-screen flex flex-col justify-center px-6 lg:px-24 py-28">
    <div className="max-w-7xl mx-auto w-full">
      <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.04 }}>
        <motion.div variants={fadeUp}>
          <SectionHeading title="Projets" sub="Réalisations" />
        </motion.div>

        <div className="space-y-4 max-w-4xl">
          {projects.map((proj, i) => (
            <ProjectCard key={proj.code} proj={proj} index={i} />
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT SECTION
// ═══════════════════════════════════════════════════════════════════════════════

const TransmissionSection = ({
  id, profileImage,
}: {
  id: string; profileImage: string | null;
}) => (
  <section id={id} className="relative min-h-screen flex flex-col justify-center px-6 lg:px-24 py-28">
    <div className="max-w-7xl mx-auto w-full">
      <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.04 }}>
        <motion.div variants={fadeUp}>
          <SectionHeading title="Contact" sub="Me contacter" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-5xl">
          {/* Channels */}
          <motion.div variants={stagger} className="space-y-3">
            {[
              { href: 'mailto:hassanitawab@gmail.com', icon: Mail,    label: 'Email',     val: 'hassanitawab@gmail.com', c: 'text-violet-400 bg-violet-500/10' },
              { href: 'https://www.linkedin.com/in/tawab-hassani', icon: Linkedin, label: 'LinkedIn', val: 'tawab-hassani',           c: 'text-blue-400 bg-blue-500/10' },
              { href: undefined, icon: MapPin, label: 'Localisation', val: 'Île-de-France',           c: 'text-orange-400 bg-orange-500/10' },
            ].map(link => {
              const Inner = (
                <>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${link.c.split(' ')[1]}`}>
                    <link.icon size={16} className={link.c.split(' ')[0]} />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-600 mb-0.5 font-medium">{link.label}</div>
                    <div className="text-sm text-slate-300 font-bold">{link.val}</div>
                  </div>
                </>
              );
              return link.href ? (
                <motion.a key={link.label} variants={fadeUp} href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-5 border border-white/[0.06] hover:border-violet-500/20 hover:bg-white/[0.03] transition-all rounded-xl"
                >{Inner}</motion.a>
              ) : (
                <motion.div key={link.label} variants={fadeUp}
                  className="flex items-center gap-4 p-5 border border-white/[0.06] rounded-xl"
                >{Inner}</motion.div>
              );
            })}

            {/* Status */}
            <motion.div variants={fadeUp}
              className="relative p-5 border border-emerald-500/20 bg-emerald-500/[0.03] rounded-xl">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm text-emerald-400 font-bold tracking-wide">Disponible</span>
              </div>
              <p className="text-[12px] text-slate-600 leading-relaxed">
                Recherche alternance 2025 en cybersécurité ou infrastructure.
              </p>
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div variants={fadeUp} className="lg:col-span-2">
            <div className="relative border border-white/[0.07] bg-white/[0.025] overflow-hidden rounded-xl">
              <CornerAccents color="border-violet-500/15" />

              <div className="flex items-center justify-between p-5 border-b border-white/[0.05] bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={profileImage || './me.png'} alt="Tawab"
                      className="w-9 h-9 object-cover border border-white/10 grayscale rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#06060f] rounded-full" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white tracking-wide">Tawab Hassani</div>
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> En ligne
                    </div>
                  </div>
                </div>
                <MessageSquare size={15} className="text-slate-600" />
              </div>

              <form action="https://formspree.io/f/mqakpoyv" method="POST" className="p-7 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { id: 'name',  label: 'Nom',   type: 'text',  ph: 'Votre nom' },
                    { id: 'email', label: 'Email',  type: 'email', ph: 'votre@email.com' },
                  ].map(f => (
                    <div key={f.id}>
                      <label htmlFor={f.id}
                        className="text-[11px] text-slate-600 tracking-wide block mb-2 font-medium uppercase"
                      >
                        {f.label}
                      </label>
                      <input type={f.type} id={f.id} name={f.id} required placeholder={f.ph}
                        className="w-full bg-white/[0.03] border border-white/[0.07] px-4 py-3 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-all rounded-lg"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label htmlFor="message"
                    className="text-[11px] text-slate-600 tracking-wide block mb-2 font-medium uppercase"
                  >
                    Message
                  </label>
                  <textarea id="message" name="message" required rows={4}
                    placeholder="Votre message..."
                    className="w-full bg-white/[0.03] border border-white/[0.07] px-4 py-3 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-all resize-none rounded-lg"
                  />
                </div>
                <button type="submit"
                  className="group w-full py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm tracking-wider transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_24px_rgba(139,92,246,0.4)] rounded-lg relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative">Envoyer le message</span>
                  <Send size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [booted, setBooted] = useState(() => sessionStorage.getItem('th-booted') === '1');

  const [activeSection, setActiveSection] = useState<Section>('Accueil');
  const [profileImage,  setProfileImage]  = useState<string | null>(null);
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [scrollPct,     setScrollPct]     = useState(0);
  const [mousePos,      setMousePos]      = useState({ x: 0, y: 0 });

  const mainRef = useRef<HTMLElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Persist profile image ─────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('profileImage');
    if (saved) setProfileImage(saved);
  }, []);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const b64 = reader.result as string;
      setProfileImage(b64);
      localStorage.setItem('profileImage', b64);
    };
    reader.readAsDataURL(file);
  };

  // ── Scroll detection ─────────────────────────────────────────────────────
  //
  // getBoundingClientRect approach — immune to offsetParent nesting,
  // scroll-snap side effects, and multi-entry IntersectionObserver races.
  // Finds the section whose vertical midpoint is closest to 38% of viewport.
  //
  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;

    const detect = () => {
      const cRect      = container.getBoundingClientRect();
      const targetLine = cRect.top + cRect.height * 0.38;

      let best: Section = 'Accueil';
      let minDist = Infinity;

      navItems.forEach(({ name }) => {
        const el = document.getElementById(toId(name));
        if (!el) return;
        const r    = el.getBoundingClientRect();
        const mid  = r.top + r.height / 2;
        const dist = Math.abs(mid - targetLine);
        if (dist < minDist) { minDist = dist; best = name; }
      });

      setActiveSection(best);

      const { scrollTop, scrollHeight, clientHeight } = container;
      setScrollPct(scrollHeight > clientHeight ? scrollTop / (scrollHeight - clientHeight) : 0);
    };

    container.addEventListener('scroll', detect, { passive: true });
    detect();
    return () => container.removeEventListener('scroll', detect);
  }, []);

  // ── Mouse spotlight ───────────────────────────────────────────────────────
  useEffect(() => {
    const t = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', t, { passive: true });
    return () => window.removeEventListener('mousemove', t);
  }, []);

  // ── Navigation ───────────────────────────────────────────────────────────
  const navigateTo = useCallback((section: Section) => {
    setMenuOpen(false);
    const el = document.getElementById(toId(section));
    const c  = mainRef.current;
    if (!el || !c) return;
    const cRect = c.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    c.scrollTo({ top: c.scrollTop + (eRect.top - cRect.top), behavior: 'smooth' });
  }, []);

  const handleBoot = useCallback(() => {
    sessionStorage.setItem('th-booted', '1');
    setBooted(true);
  }, []);

  return (
    <div className="flex h-screen bg-[#06060f] text-white font-sans overflow-hidden">
      {/* Boot sequence */}
      {!booted && <BootSequence onDone={handleBoot} />}

      {/* Mouse spotlight */}
      <div className="pointer-events-none fixed inset-0 z-[15] hidden lg:block"
        style={{
          background: `radial-gradient(700px circle at ${mousePos.x}px ${mousePos.y}px, rgba(124,58,237,0.05), transparent 40%)`,
        }}
      />

      <PremiumBackground />

      <ScrollProgress pct={scrollPct} />
      <FloatingNav active={activeSection} navigateTo={navigateTo} />

      <input type="file" ref={fileRef} onChange={handleUpload} accept="image/*" className="hidden" />

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 z-[100] bg-[#06060f]/95 backdrop-blur-sm border-b border-white/[0.04] flex items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <img src={profileImage || './me.png'} alt="TH"
            className="w-7 h-7 object-cover border border-white/10 grayscale rounded-lg"
          />
          <span className="text-sm font-bold tracking-widest text-slate-300">TH</span>
        </div>
        <button onClick={() => setMenuOpen(v => !v)} className="text-slate-400 hover:text-white transition-colors p-1">
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)}
        active={activeSection} navigateTo={navigateTo}
      />

      {/* Main content */}
      <main ref={mainRef}
        className="flex-1 h-screen overflow-y-auto relative z-10 pt-14 lg:pt-0"
      >
        <HeroSection
          id="accueil"
          profileImage={profileImage}
          onContact={() => navigateTo('Contact')}
          onProjects={() => navigateTo('Projets')}
          onImageUpload={() => fileRef.current?.click()}
        />
        <IdentitySection   id="presentation" />
        <ArchiveSection    id="mon-parcours" />
        <MissionSection    id="alternances"  />
        <ArsenalSection    id="competences"  />
        <SystemSection     id="bts-sio"      />
        <DossierPlaceholder id="epreuve-e5" name="Épreuve E5" sub="Dossier E5" />
        <DossierPlaceholder id="epreuve-e6" name="Épreuve E6" sub="Dossier E6" />
        <OperationsSection id="projets"      />
        <DossierPlaceholder id="veille"     name="Veille Technologique" sub="Veille" />
        <TransmissionSection id="contact" profileImage={profileImage} />
      </main>
    </div>
  );
}
