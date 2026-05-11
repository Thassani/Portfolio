/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  Menu, 
  X, 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  ExternalLink,
  Briefcase,
  GraduationCap,
  Award,
  Gamepad2,
  Dumbbell,
  Languages,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  Cpu,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types for better structure
interface TimelineItem {
  date: string;
  title: string;
  company: string;
  location: string;
  type: 'Mission' | 'Formation';
  tasks: string[];
}

export default function App() {
  const [activeSection, setActiveSection] = useState('accueil');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = ['accueil', 'a-propos', 'parcours', 'alternance', 'epreuve-e4', 'epreuve-e5', 'veille', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'ACCUEIL', id: 'accueil' },
    { label: 'A PROPOS', id: 'a-propos', hasDropdown: true },
    { label: 'MON PARCOURS', id: 'parcours' },
    { label: 'ALTERNANCE', id: 'alternance' },
    { label: 'EPREUVE E4', id: 'epreuve-e4' },
    { label: 'EPREUVE E5', id: 'epreuve-e5' },
    { label: 'VEILLE', id: 'veille' },
    { label: 'CONTACT', id: 'contact', hasDropdown: true },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const timelineItems: TimelineItem[] = [
    {
      date: "SEPT. 2024 — PRÉSENT",
      title: "Alternant Technicien Support",
      company: "DS Avocats",
      location: "Paris",
      type: "Mission",
      tasks: [
        "Déploiement & configuration OS (PC/mobiles)",
        "Gestion de parc via Microsoft Admin Center",
        "Administration vSphere & Citrix DaaS",
        "Support technique de proximité & à distance",
        "Administration messagerie Exchange"
      ]
    },
    {
      date: "SEPT. 2024 — PRÉSENT",
      title: "BTS SIO option SISR",
      company: "ESTIAM",
      location: "Paris",
      type: "Formation",
      tasks: [
        "Active Directory, Linux, Cisco",
        "Virtualisation & sécurité",
        "TCP/IP, Réseaux"
      ]
    },
    {
      date: "NOV. — DÉC. 2023",
      title: "Technicien de maintenance",
      company: "Les Réparateurs Mac & PC",
      location: "Montreuil",
      type: "Mission",
      tasks: [
        "Montage PC sur mesure",
        "Diagnostic matériel & pannes",
        "Création clés boot BIOS/UEFI"
      ]
    },
    {
      date: "2021 — 2024",
      title: "Bac Systèmes Numériques",
      company: "Lycée Alfred Costes",
      location: "Bobigny",
      type: "Formation",
      tasks: [
        "Option RISC — Réseaux & Systèmes Communicants"
      ]
    },
    {
      date: "MAI — JUIN 2023",
      title: "Électricien de maintenance",
      company: "Helbul",
      location: "Paris",
      type: "Mission",
      tasks: [
        "Câblage & installation électrique",
        "Diagnostic et maintenance"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#06080e] text-white font-sans selection:bg-purple-500/30">
      {/* Header / Navigation */}
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-[#06080e]/90 backdrop-blur-md border-b border-white/5 py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center">
          <div className="text-xl font-black tracking-tighter text-white cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            PORTFOLIO
          </div>

          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2.5 text-[11px] font-bold tracking-widest transition-all rounded-sm flex items-center gap-1.5 ${
                  activeSection === item.id 
                    ? 'bg-[#7c3aed] text-white shadow-lg shadow-purple-500/20' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
                {item.hasDropdown && <ChevronDown size={12} className="mt-0.5 opacity-60" />}
              </button>
            ))}
          </nav>

          <button 
            className="lg:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="accueil" className="relative pt-32 pb-16 md:pt-40 md:pb-20 px-8 overflow-hidden">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-64 h-64 md:w-[450px] md:h-[450px]"
          >
            <div className="absolute inset-0 bg-[#7c3aed]/20 rounded-3xl rotate-6 -z-10 shadow-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl -rotate-3 -z-10"></div>
            {/* 📸 TA PHOTO DE PROFIL :
                1. Mets ton fichier "photo-pro.png" dans le dossier "public"
                2. Le code ci-dessous l'affichera automatiquement
            */}
            <img 
              src="photo-pro.png" 
              alt="Profile"
              className="w-full h-full object-cover rounded-3xl shadow-2xl transition-all duration-700"
            />
          </motion.div>

          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 justify-center md:justify-start mb-6">
                <span className="w-10 h-[2px] bg-[#7c3aed]"></span>
                <span className="text-[14px] font-bold tracking-[0.2em] text-purple-400 uppercase">Technicien Support — Alternant</span>
              </div>
              <h1 className="text-4xl md:text-[60px] font-black leading-none tracking-tighter mb-8 uppercase">
                TAWAB<br/><span className="text-purple-500/40 outline-text">HASSANI</span>
              </h1>
              <p className="max-w-2xl text-base text-gray-400 mb-10 leading-relaxed font-medium">
                Étudiant en <span className="text-white font-bold">BTS SIO SISR</span> à l'Estiam Paris, spécialisé en <span className="text-white">infrastructure réseau</span> et <span className="text-white">cybersécurité</span>. En alternance chez <span className="text-purple-400">DS Avocats</span>.
              </p>
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-12">
                <a 
                  href="https://www.linkedin.com/in/tawab-hassani" 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-6 py-3 bg-[#0a66c2]/10 text-[#0a66c2] text-xs font-bold rounded-full border border-[#0a66c2]/20 tracking-widest uppercase flex items-center gap-2 hover:bg-[#0a66c2]/20 transition-all"
                >
                  <Linkedin size={14} /> Profile LinkedIn
                </a>
                <a 
                  href="CV_Tawab_HASSANI.pdf" 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-6 py-3 bg-purple-500/10 text-purple-400 text-xs font-bold rounded-full border border-purple-500/20 tracking-widest uppercase flex items-center gap-2 hover:bg-purple-500/20 transition-all"
                >
                  <ExternalLink size={14} /> Télécharger mon CV
                </a>
              </div>

              <div className="flex gap-4 justify-center md:justify-start">
                <button onClick={() => scrollToSection('contact')} className="bg-[#7c3aed] text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#6d28d9] transition-all shadow-xl shadow-purple-500/20 active:scale-95">
                  Me contacter <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Presentation */}
      <section id="a-propos" className="py-20 md:py-32 px-8 bg-[#0a0c10]">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-16">
            <span className="text-[12px] font-bold text-purple-400 tracking-[0.3em] uppercase">À PROPOS</span>
            <h2 className="text-3xl font-black mt-2 leading-tight">Présentation</h2>
            <div className="w-20 h-1 bg-[#7c3aed] mt-4"></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 p-10 bg-white/2 border border-white/5 rounded-[40px] relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-purple-500 opacity-20"></div>
              <p className="text-lg leading-relaxed text-gray-300 font-medium">
                Étudiant en <span className="text-white font-black uppercase tracking-tight">BTS SIO SISR</span> à l'Estiam Paris. Passionné par les <span className="text-white font-bold">infrastructures IT</span> et la <span className="text-white font-bold">cybersécurité</span>, je combine formation théorique et expérience pratique en alternance chez <span className="text-purple-400 font-bold uppercase transition-colors group-hover:text-purple-300">DS Avocats</span>, un cabinet d'avocats international à Paris.
              </p>

              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 pt-10">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">FORMATION</span>
                  <p className="font-bold text-base uppercase">BTS SIO SISR 2024-26</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">ALTERNANCE</span>
                  <p className="font-bold text-base uppercase">DS Avocats, Paris</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">OBJECTIF</span>
                  <p className="font-bold text-base uppercase">Bachelor Cybersécurité</p>
                </div>
              </div>
            </div>

            <div className="p-10 bg-[#0f1116] border border-white/5 rounded-[40px]">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-10 text-center">ATOUTS</span>
              <div className="space-y-10">
                {[
                  { title: "Sens du service", desc: "Écoute active & pédagogie" },
                  { title: "Rigueur", desc: "Analyse méthodique & documentation" },
                  { title: "Adaptabilité", desc: "Montée en compétences rapide" }
                ].map((atout, index) => (
                  <div key={index} className="flex gap-6 items-center">
                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl border border-purple-500/30 flex items-center justify-center bg-purple-500/5">
                      <CheckCircle2 size={16} className="text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base uppercase tracking-tight">{atout.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{atout.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[
              { icon: <Dumbbell />, title: "Sport & Coaching", desc: "Musculation et course à pied", color: "purple" },
              { icon: <Gamepad2 />, title: "Gaming & Hardware", desc: "Montage et optimisation PC", color: "blue" },
              { icon: <Languages />, title: "Langues", desc: "Anglais (intermédiaire) · Swahili", color: "emerald" }
            ].map((interest, idx) => (
              <div key={idx} className="p-10 bg-white/2 border border-white/5 rounded-[40px] flex items-center gap-8 hover:bg-white/5 transition-all cursor-default">
                <div className={`p-5 bg-${interest.color}-500/10 text-${interest.color}-400 rounded-3xl`}>
                  {interest.icon}
                </div>
                <div>
                  <h4 className="font-black text-lg uppercase tracking-tighter">{interest.title}</h4>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{interest.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section id="parcours" className="py-20 md:py-40 px-8">
        <div className="max-w-[1000px] mx-auto">
          <div className="mb-24 text-center">
            <span className="text-[12px] font-bold text-purple-400 tracking-[0.3em] uppercase underline decoration-purple-500 underline-offset-8">CHRONOLOGIE</span>
            <h2 className="text-4xl font-black mt-8 tracking-tighter">MON PARCOURS</h2>
          </div>

          <div className="relative space-y-16">
            <div className="absolute left-[39px] top-10 bottom-10 w-[2px] bg-gradient-to-b from-purple-500/50 via-white/5 to-purple-500/50"></div>
            {timelineItems.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative flex gap-12 group"
              >
                <div className={`mt-2 z-10 w-[60px] h-[60px] flex-shrink-0 rounded-[22px] border transition-all duration-500 bg-[#0f1116] border-purple-500/30 group-hover:scale-110 flex items-center justify-center`}>
                  <div className={`w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.8)]`}></div>
                </div>
                
                <div className="flex-1 p-10 bg-white/2 border border-white/5 rounded-[48px] group-hover:border-purple-500/20 group-hover:bg-white/5 transition-all duration-500">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <span className="text-[11px] font-black tracking-[0.3em] text-purple-400 mb-3 md:mb-0 uppercase">{item.date}</span>
                  </div>
                  <h3 className="text-xl font-black mb-2 uppercase tracking-tighter group-hover:text-purple-400 transition-colors uppercase">{item.title}</h3>
                  <p className="text-gray-500 text-xs mb-8 uppercase tracking-[0.1em] font-bold">{item.company} — {item.location}</p>
                  
                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
                    {item.tasks.map((task, tIdx) => (
                      <div key={tIdx} className="flex items-start gap-4 text-[13px] text-gray-400 font-medium">
                        <div className="mt-1.5 w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div>
                        {task}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Apprenticeship Detail */}
      <section id="alternance" className="py-20 md:py-32 px-8 bg-[#0a0c10]">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-16">
            <span className="text-[12px] font-bold text-purple-400 tracking-[0.3em] uppercase">DS AVOCATS — PARIS</span>
            <h2 className="text-4xl font-black mt-4 tracking-tighter">Mon Alternance</h2>
            <div className="flex gap-4 mt-6">
              <div className="w-24 h-1.5 bg-[#7c3aed] rounded-full"></div>
              <div className="w-12 h-1.5 bg-emerald-500/30 rounded-full"></div>
            </div>
          </div>

          <div className="p-12 bg-white/2 border border-white/10 rounded-[60px] mb-12 flex flex-col items-center gap-10">
             <div className="flex flex-col md:flex-row items-center gap-12 w-full">
                <div className="w-32 h-32 bg-[#0f1116] border border-white/10 rounded-[40px] flex items-center justify-center font-black text-5xl shadow-2xl">DS</div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">DS Avocats — Paris</h3>
                  <p className="text-[11px] font-black text-purple-400 uppercase tracking-[0.3em] mb-8">Cabinet d'avocats international · Depuis Sept. 2024</p>
                  <p className="text-lg text-gray-400 font-medium leading-relaxed">
                    Intégré à l'équipe informatique comme <span className="text-white font-black uppercase">alternant technicien support</span>. Déploiement de postes, <span className="text-white font-bold">gestion de parc</span>, administration via <span className="text-purple-400 font-black tracking-tight underline decoration-purple-500/50 underline-offset-8">Microsoft Admin Center</span> et <span className="text-purple-400 font-black tracking-tight underline decoration-purple-500/50 underline-offset-8">vSphere</span>, support aux avocats.
                  </p>
                </div>
             </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="p-12 bg-white/2 border border-white/5 rounded-[60px]">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-purple-500/10 rounded-2xl"><Briefcase size={22} className="text-purple-400" /></div>
                <h4 className="font-black text-lg tracking-widest uppercase text-gray-500">MISSIONS PRINCIPALES</h4>
              </div>
              <div className="grid gap-6">
                {[
                  "Déploiement OS & logiciels (PC/mobiles)",
                  "Gestion de parc & inventaire des actifs",
                  "Administration vSphere & Citrix DaaS",
                  "Support utilisateur proximité & distance",
                  "Administration messagerie Exchange",
                  "Comptes via Microsoft Admin Center"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-6 group">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/5 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold transition-all group-hover:bg-purple-500 group-hover:text-white">
                      {idx + 1}
                    </div>
                    <span className="text-lg font-bold text-gray-300 uppercase tracking-tight">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-12 bg-white/2 border border-white/5 rounded-[60px]">
              <div className="flex items-center gap-4 mb-12">
                <div className="p-3 bg-emerald-500/10 rounded-2xl"><Cpu size={22} className="text-emerald-400" /></div>
                <h4 className="font-black text-lg tracking-widest uppercase text-gray-500">ORGANIGRAMME DSI</h4>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full max-w-[340px] p-6 bg-[#0f1116] border border-white/10 rounded-3xl text-center mb-8 shadow-xl">
                  <h5 className="font-black text-lg uppercase tracking-tighter">Benjamin Gerard</h5>
                  <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-[0.3em] font-bold">Directeur DSI</p>
                </div>
                <div className="w-[2px] h-12 bg-gradient-to-b from-white/20 to-transparent mb-8"></div>
                <div className="w-full max-w-[340px] p-6 bg-[#0f1116] border border-white/10 rounded-3xl text-center mb-8 shadow-xl">
                  <h5 className="font-black text-lg uppercase tracking-tighter">Jonathan Benyair</h5>
                  <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-[0.3em] font-bold">Responsable SI & DPO</p>
                </div>
                <div className="w-[2px] h-12 bg-gradient-to-b from-white/20 to-transparent mb-8"></div>
                <div className="flex gap-8 w-full justify-center">
                  <div className="w-[200px] p-5 bg-[#0f1116] border border-white/10 rounded-3xl text-center shadow-lg">
                    <h5 className="font-black text-base uppercase">Karesh V.</h5>
                    <p className="text-[9px] text-gray-600 mt-2 uppercase tracking-widest">Alternant</p>
                  </div>
                  <div className="w-[200px] p-5 bg-purple-900/40 border-2 border-purple-500/40 rounded-3xl text-center shadow-purple-500/10 shadow-2xl">
                    <h5 className="font-black text-base uppercase text-purple-200">Tawab H.</h5>
                    <p className="text-[9px] text-purple-400 mt-2 uppercase tracking-widest font-black">Alternant · moi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exams Sections */}
      <section className="py-20 md:py-32 px-8 overflow-hidden bg-[#06080e]">
        <div className="max-w-[1400px] mx-auto">
          {/* EPREUVE E4 */}
          <motion.div 
            id="epreuve-e4" 
            initial={{ opacity: 0, y: 50 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="mb-32"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-8">
              <div>
                <span className="text-[12px] font-black text-purple-400 tracking-[0.4em] uppercase mb-4 block">PORTFOLIO PROFESSIONNEL</span>
                <h2 className="text-5xl font-black tracking-tighter uppercase">ÉPREUVE E4</h2>
              </div>
              <p className="text-gray-500 text-sm font-medium mt-4 md:mt-0 max-w-md">
                Parcours de professionnalisation : Projets réalisés en formation et en entreprise.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 bg-[#0f1116] border border-white/10 p-10 md:p-12 rounded-[50px] relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 opacity-20"></div>
                <h3 className="text-xl font-black bg-white text-black inline-block px-6 py-2 mb-12 skew-x-[-10deg] uppercase tracking-widest">Compétences & Réalisations</h3>
                
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h4 className="text-purple-400 font-black mb-8 uppercase tracking-[0.4em] text-[10px]">ENVIRONNEMENT FORMATION:</h4>
                    <div className="space-y-4">
                      {[
                        "Configuration AD DS, DNS, DHCP",
                        "Supervision Nagios XI & Netdata",
                        "Administration Serveur Web Apache",
                        "Gestion de parc GLPI & OCS",
                        "Pfsense & Authentification LDAPS",
                        "VLAN, Routage Inter Vlan & VTP",
                        "Protocoles Redondance HSRP",
                        "Routage Dynamique OSPF / RIP"
                      ].map((p, i) => (
                        <div key={i} className="flex items-center gap-4 text-xs text-gray-500 font-bold uppercase tracking-tight">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-emerald-400 font-black mb-8 uppercase tracking-[0.4em] text-[10px]">RETOUR D'EXPÉRIENCE ENTREPRISE:</h4>
                    <div className="space-y-4">
                      {[
                        "Déploiement Master Windows 10 Pro",
                        "Migration client Outlook 365",
                        "Gestion de profils Active Directory",
                        "Déploiement via MDT / WDS",
                        "Support utilisateur niveau 1 & 2"
                      ].map((p, i) => (
                        <div key={i} className="flex items-center gap-4 text-xs text-gray-500 font-bold uppercase tracking-tight">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0f1116] border border-white/10 p-10 rounded-[50px]">
                <h4 className="text-blue-400 font-black mb-10 uppercase tracking-[0.4em] text-[10px] flex items-center gap-3">
                  <ExternalLink size={14} /> DOCUMENTS ÉPREUVE E4 :
                </h4>
                <div className="space-y-4">
                  {/* ########################################################################## */}
                  {/* 📂 SECTION DOCUMENTS E4 : MODIFIEZ LES LIENS ICI                             */}
                  {/* 1. Mettez vos fichiers PDF (ex: tableau.pdf) dans le dossier "public"      */}
                  {/* 2. Remplacez '#' par le nom du fichier (ex: "tableau.pdf")                 */}
                  {/* ########################################################################## */}
                  {[
                    { label: "Tableau de synthèse", type: "PDF", link: "tableau.pdf" },
                    { label: "Fiche descriptive 1", type: "PDF", link: "fiche1.pdf" },
                    { label: "Fiche descriptive 2", type: "PDF", link: "fiche2.pdf" }
                  ].map((doc, i) => (
                    <a 
                      key={i} 
                      href={doc.link} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-5 bg-white/2 border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/5 hover:border-blue-500/30 transition-all transition-transform active:scale-95"
                    >
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold uppercase tracking-tight text-gray-300 group-hover:text-white transition-colors">{doc.label}</span>
                        <span className="text-[9px] text-gray-600 mt-1 uppercase font-black">{doc.type}</span>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-all">
                        <ChevronDown size={14} className="-rotate-90" />
                      </div>
                    </a>
                  ))}
                  {/* --- FIN SECTION DOCUMENTS --- */}
                </div>
                <div className="mt-10 p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl">
                  <p className="text-[10px] text-blue-400 font-bold leading-relaxed uppercase tracking-widest text-center">
                    Cliquez sur les liens pour consulter les documents officiels.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* EPREUVE E5 */}
          <motion.div 
            id="epreuve-e5" 
            initial={{ opacity: 0, y: 50 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-8">
                <div>
                  <span className="text-[12px] font-black text-purple-400 tracking-[0.4em] uppercase mb-4 block">RÉALISATION DE SOLUTIONS</span>
                  <h2 className="text-5xl font-black tracking-tighter uppercase">ÉPREUVE E5</h2>
                </div>
                <p className="text-gray-500 text-sm font-medium mt-4 md:mt-0 max-w-md">
                  Cette épreuve porte sur la conception, l'exploitation et la maintenance de solutions d'infrastructure, de services et de réseaux au sein d'un système d'information.
                </p>
              </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* ########################################################################## */}
              {/* SECTION PROJETS E5 : MODIFIEZ LES DESCRIPTIONS OU LES LIENS ICI           */}
              {/* Les fichiers PDF des projets doivent être mis dans le dossier "public"     */}
              {/* puis remplacez '#' par leur nom (ex: "/projet1.pdf")                      */}
              {/* ########################################################################## */}
              {[
                { 
                  id: 1, 
                  title: "Nextcloud & OpenLDAP", 
                  desc: "Mise en œuvre d'un service Cloud collaboratif avec authentification centralisée et supervision système.", 
                  link: "#",
                  tags: ["Linux", "LDAP", "Proxmox", "Netdata"],
                  color: "purple"
                },
                { 
                  id: 2, 
                  title: "GLPI & Gestion Inventaire", 
                  desc: "Automatisation de l'inventaire matériel et logiciel avec déploiement d'agents et système de Ticketing.", 
                  link: "#",
                  tags: ["Debian", "GLPI", "Asset Management", "Support"],
                  color: "blue"
                }
              ].map((project) => (
                <div key={project.id} className="p-10 bg-[#0f1116] border border-white/5 rounded-[50px] relative overflow-hidden group hover:border-white/10 transition-all duration-500">
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-${project.color}-500/5 rounded-bl-[100px] -z-10 group-hover:scale-150 transition-transform duration-1000`}></div>
                  
                  <div className="flex items-center justify-between mb-8">
                    <span className={`px-4 py-1.5 bg-${project.color}-500/10 text-${project.color}-400 rounded-lg text-[10px] font-black uppercase tracking-widest`}>PROJET {project.id}</span>
                  </div>

                  <h4 className="font-black text-2xl uppercase tracking-tighter mb-6 group-hover:text-white transition-colors">{project.title}</h4>
                  <p className="text-base text-gray-400 leading-relaxed font-medium mb-10">
                    {project.desc}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/5 text-gray-500 text-[9px] font-black uppercase tracking-widest rounded-md border border-white/5">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Veille Technologique - THE BIG REQUESTED SECTION */}
      <section id="veille" className="py-20 md:py-32 px-8 bg-[#0a0c10]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-[12px] font-black text-purple-400 tracking-[0.4em] uppercase underline decoration-purple-500 decoration-2 underline-offset-[12px]">VEILLE TECHNOLOGIQUE — 2024/2026</span>
            <h2 className="text-5xl font-black mt-12 tracking-tighter leading-[1.1] uppercase">L'IA dans le Sport & <br/><span className="text-purple-500/30">les montres connectées</span></h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-32">
            <div className="space-y-8">
              <h3 className="text-2xl font-black uppercase tracking-tight">Qu'est ce que la veille technologique ?</h3>
              <p className="text-lg text-gray-400 leading-relaxed font-medium">
                La veille technologique consiste à surveiller les évolutions techniques, les innovations et les nouveaux produits dans un secteur donné. Elle permet de rester compétitif, d'anticiper les changements et de sécuriser les infrastructures.
              </p>
              <div className="p-8 bg-white/2 border border-white/10 rounded-[40px] italic text-gray-300 text-sm leading-relaxed border-l-4 border-l-purple-500">
                « La veille technologique se doit de prévenir et alerter tout responsable d'un changement, d'une nouveauté ou d'une innovation qu'elle soit technique ou scientifique. »
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* DESSOUS : Vous pouvez changer les images de la veille ici (copiez vos photos dans "public") */}
              {[
                { title: "Strava Health AI", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400" },
                { title: "Garmin AI Coach", img: "https://images.unsplash.com/photo-1575311373937-040b8e19f727?auto=format&fit=crop&q=80&w=400" },
                { title: "Biometric AI Labs", img: "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&q=80&w=400" },
                { title: "Smart Coaching", img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400" }
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="relative aspect-[4/5] rounded-3xl overflow-hidden group shadow-2xl"
                >
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover grayscale opacity-50 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06080e] via-transparent to-transparent flex items-end p-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {[
              { 
                title: "Coaching Adaptatif", 
                desc: "L'IA crée des entraînements qui s'ajustent en temps réel selon la fatigue et les données biométriques.", 
                icon: <Activity />,
                color: "purple"
              },
              { 
                title: "Analyse de Récupération", 
                desc: "Prédiction précise du temps de repos nécessaire pour éviter les blessures (IA prédictive évolutive).", 
                icon: <Clock />,
                color: "blue"
              },
              { 
                title: "Prédiction de Performance", 
                desc: "Analyse des données historiques pour estimer un temps sur marathon ou triathlon avec fiabilité.", 
                icon: <TrendingUp />,
                color: "emerald"
              }
            ].map((trend, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="p-10 bg-[#0f1116] border border-white/5 rounded-[50px] group"
              >
                <div className={`w-16 h-16 bg-${trend.color}-500/10 text-${trend.color}-400 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110`}>
                  {trend.icon}
                </div>
                <h4 className="text-xl font-black mb-4 uppercase tracking-tighter">{trend.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed font-medium uppercase tracking-tight">{trend.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="p-12 bg-white/2 border border-white/5 rounded-[60px]">
            <h4 className="text-3xl font-black mb-12 uppercase tracking-tighter text-center">Pourquoi l'IA aide le sportif ?</h4>
            <div className="grid md:grid-cols-3 gap-12 text-center">
              {[
                { label: "Simplicité", desc: "Conseils en langage naturel plutôt que graphiques complexes." },
                { label: "Sécurité", desc: "Réduction drastique des risques de surentraînement." },
                { label: "Sur-mesure", desc: "Suivi personnalisé equivalent à celui d'un professionnel." }
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-purple-400 font-black mb-4 uppercase tracking-[0.3em] text-xs underline underline-offset-8 decoration-purple-500/30">{item.label}</p>
                  <p className="text-xs text-gray-500 font-bold uppercase leading-relaxed tracking-tight">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-40 px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-20">
            <span className="text-[12px] font-bold text-purple-400 tracking-[0.3em] uppercase underline decoration-purple-500 underline-offset-8">ME CONTACTER</span>
          </div>

          <div className="grid lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-2 space-y-6">
              {[
                { icon: <Mail size={20} />, label: "Email", info: "hassanitawab@gmail.com", link: "mailto:hassanitawab@gmail.com" },
                { icon: <Linkedin size={20} />, label: "LinkedIn", info: "tawab-hassani", link: "https://www.linkedin.com/in/tawab-hassani" },
                { icon: <MapPin size={20} />, label: "Localisation", info: "Île-de-France", link: null }
              ].map((item, idx) => (
                <div key={idx} className="p-10 bg-[#0f1116] border border-white/5 rounded-[40px] flex items-center gap-8 group hover:border-purple-500/40 transition-all duration-500 shadow-xl shadow-black/40">
                  <div className="p-5 bg-purple-500/10 text-purple-400 rounded-2xl group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all duration-500">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] block mb-2">{item.label}</span>
                    {item.link ? (
                      <a href={item.link} className="font-black text-base uppercase tracking-tight hover:text-purple-400 transition-all">{item.info}</a>
                    ) : (
                      <span className="font-black text-base uppercase tracking-tight">{item.info}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-3 p-6 md:p-12 bg-[#0f1116] border border-white/5 rounded-[40px] md:rounded-[60px] relative overflow-hidden shadow-2xl">
               <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                 <div className="flex items-center gap-6">
                   <div className="w-14 h-14 rounded-[20px] border border-purple-500/30 flex items-center justify-center p-1 overflow-hidden">
                     {/* 📸 PETITE PHOTO FORMULAIRE */}
                     <img src="photo-pro.png" className="w-full h-full object-cover rounded-[15px]" alt="Avatar" />
                   </div>
                   <div>
                     <h4 className="font-black text-lg uppercase tracking-tight">Tawab Hassani</h4>
                     <p className="text-[10px] text-emerald-500 flex items-center gap-2 uppercase tracking-widest font-black"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Open to hiring</p>
                   </div>
                 </div>
                 <div className="p-3 bg-white/5 rounded-xl cursor-not-allowed opacity-30"><X size={18} /></div>
               </div>

               <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] px-2">FULL NAME</label>
                      <input type="text" placeholder="Votre nom" className="w-full bg-white/2 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:border-purple-500/50 focus:bg-white/5 focus:ring-0 outline-none transition-all placeholder:text-gray-700" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] px-2">EMAIL ADDRESS</label>
                      <input type="email" placeholder="votre@email.com" className="w-full bg-white/2 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:border-purple-500/50 focus:bg-white/5 focus:ring-0 outline-none transition-all placeholder:text-gray-700" />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] px-2">MESSAGE</label>
                    <textarea rows={5} placeholder="Comment puis-je vous aider ?" className="w-full bg-white/2 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:border-purple-500/50 focus:bg-white/5 focus:ring-0 outline-none transition-all resize-none placeholder:text-gray-700"></textarea>
                 </div>
                 <button className="group w-full bg-[#7c3aed] text-white py-6 rounded-2xl font-black text-sm uppercase tracking-[0.4em] hover:bg-[#6d28d9] transition-all flex items-center justify-center gap-4 active:scale-95 shadow-2xl shadow-purple-500/30">
                   SUBMIT REQUEST <Mail size={18} className="group-hover:translate-x-2 transition-transform" />
                 </button>
               </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-24 px-8 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center flex-wrap gap-x-16 gap-y-6 mb-12">
            {[
              { label: 'LinkedIn', url: 'https://www.linkedin.com/in/tawab-hassani' },
              { label: 'GitHub', url: 'https://github.com/thassani/Portfolio' }
            ].map((link) => (
              <a key={link.label} href={link.url} className="hover:text-purple-400 transition-colors text-xs font-black uppercase tracking-[0.4em] text-gray-600 underline-offset-8 hover:underline">{link.label}</a>
            ))}
          </div>
          <p className="text-[10px] uppercase tracking-[0.5em] font-black text-gray-700">© DESIGNED & CODED BY TAWAB HASSANI</p>
        </div>
      </footer>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-[#06080e] flex items-center justify-center p-12 lg:hidden"
          >
            <button className="absolute top-10 right-10 p-4 text-white" onClick={() => setMobileMenuOpen(false)}>
              <X size={48} />
            </button>
            <div className="flex flex-col space-y-10 items-center text-center">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollToSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-5xl font-black tracking-tighter uppercase transition-transform active:scale-90 ${
                    activeSection === item.id ? 'text-[#7c3aed] underline decoration-8' : 'text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

