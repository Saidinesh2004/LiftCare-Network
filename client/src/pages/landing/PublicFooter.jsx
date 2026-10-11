import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Wrench,
  ShieldCheck,
  Cpu,
  ArrowRight
} from 'lucide-react';

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  const handleNavScroll = (e, id) => {
    e.preventDefault();
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(id);
    if (elem) {
      const offset = 80;
      const pos = elem.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: pos - offset, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Description Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              to="/"
              onClick={(e) => handleNavScroll(e, 'hero')}
              className="flex items-center gap-2.5 group inline-block"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <span className="text-xl">🛗</span>
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-white block">
                  LiftCare <span className="text-cyan-400 font-bold text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 uppercase">NETWORK</span>
                </span>
                <span className="text-[10px] text-slate-400 block -mt-0.5 font-medium">
                  Commercial Transportation Systems
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              LiftCare Network connects commercial property managers with verified elevator and escalator maintenance specialists, unifying asset registers, service requests, and digital compliance reports.
            </p>

            <div className="pt-2 text-[11px] text-slate-400 font-mono">
              <span>Platform workflows supporting ASME A17.1 &amp; CSA B44 documentation</span>
            </div>
          </div>

          {/* Quick Platform Jump Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-mono">
              Platform Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#hero"
                  onClick={(e) => handleNavScroll(e, 'hero')}
                  className="hover:text-cyan-400 transition"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleNavScroll(e, 'how-it-works')}
                  className="hover:text-cyan-400 transition"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  onClick={(e) => handleNavScroll(e, 'services')}
                  className="hover:text-cyan-400 transition"
                >
                  Platform Services
                </a>
              </li>
              <li>
                <a
                  href="#property-managers"
                  onClick={(e) => handleNavScroll(e, 'property-managers')}
                  className="hover:text-cyan-400 transition"
                >
                  For Property Managers
                </a>
              </li>
              <li>
                <a
                  href="#technicians"
                  onClick={(e) => handleNavScroll(e, 'technicians')}
                  className="hover:text-cyan-400 transition"
                >
                  For Technicians
                </a>
              </li>
              <li>
                <a
                  href="#faqs"
                  onClick={(e) => handleNavScroll(e, 'faqs')}
                  className="hover:text-cyan-400 transition"
                >
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Property Manager Entry Point */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-mono flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Property Portals</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/register?role=PROPERTY_MANAGER"
                  className="hover:text-cyan-400 transition flex items-center gap-1"
                >
                  <span>Register Commercial Account</span>
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-cyan-400 transition">
                  Manager Sign In
                </Link>
              </li>
              <li>
                <a
                  href="#equipment-showcase"
                  onClick={(e) => handleNavScroll(e, 'equipment-showcase')}
                  className="hover:text-cyan-400 transition"
                >
                  Equipment Fleet Preview
                </a>
              </li>
              <li>
                <a
                  href="#problem-solution"
                  onClick={(e) => handleNavScroll(e, 'problem-solution')}
                  className="hover:text-cyan-400 transition"
                >
                  Operational Solutions
                </a>
              </li>
            </ul>
          </div>

          {/* Technician Entry Point */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-mono flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-emerald-400" />
              <span>Technician Portals</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/register?role=TECHNICIAN"
                  className="hover:text-emerald-400 transition flex items-center gap-1 text-emerald-300"
                >
                  <span>Register as a Technician</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition">
                  Technician Sign In
                </Link>
              </li>
              <li>
                <a
                  href="#trust"
                  onClick={(e) => handleNavScroll(e, 'trust')}
                  className="hover:text-emerald-400 transition"
                >
                  Credential Review Policy
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleNavScroll(e, 'how-it-works')}
                  className="hover:text-emerald-400 transition"
                >
                  Technician Workflow
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {currentYear} LiftCare Network. All rights reserved. Commercial Vertical Mobility Platform.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-slate-300 transition">
              Secure Sign In
            </Link>
            <span className="text-slate-700">•</span>
            <Link to="/register" className="hover:text-slate-300 transition">
              New Account Registration
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
