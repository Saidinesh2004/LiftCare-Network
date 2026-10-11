import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0); // first item open by default
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: 'What is LiftCare Network?',
      answer:
        'LiftCare Network is a dedicated commercial software platform connecting building property managers with verified elevator and escalator maintenance specialists. It provides centralized fleet asset tracking, maintenance dispatching, real-time job monitoring, and permanent digital service records.'
    },
    {
      question: 'Who can use the platform?',
      answer:
        'The platform is designed for commercial property managers, facility directors, and licensed vertical-transportation technicians. Dedicated role-based portals exist for Property Managers (to manage buildings and request services), Technicians (to receive jobs and file reports), and Platform Administrators (to verify credentials and maintain system integrity).'
    },
    {
      question: 'How can a property manager register equipment?',
      answer:
        'Once logged in, property managers add their commercial properties, then navigate to the Equipment module to register individual elevators and escalators. You can specify equipment type (traction, hydraulic, escalator, freight), manufacturer, floor coverage, and scheduled maintenance intervals.'
    },
    {
      question: 'How do I request elevator or escalator maintenance?',
      answer:
        'Managers can initiate a request directly from their dashboard or the "Maintenance Requests" page by clicking "Create Service Request". Select the specific building and equipment unit, choose the service type (Preventive Maintenance or Repair), set the priority level, and describe the issue.'
    },
    {
      question: 'How are technician credentials reviewed?',
      answer:
        'During onboarding, technicians submit state mechanic license numbers, years of experience, and credentials. Platform administrators independently evaluate these details in the administrative verification queue before approving the technician account for eligible job dispatches.'
    },
    {
      question: 'Can technicians choose their service areas?',
      answer:
        'Yes. Technicians specify their technical specialties (such as traction lifts, hydraulic systems, or escalators) and their operational service territories, which are reflected on the interactive geospatial service map.'
    },
    {
      question: 'How can I track a maintenance request?',
      answer:
        'Every maintenance request displays live progress through auditable states: Submitted → Matched → In Progress → Completed. Live status updates and in-app notifications keep property teams informed at each stage of the service lifecycle.'
    },
    {
      question: 'Where can I find completed service reports?',
      answer:
        'Completed service reports are permanently cataloged within each equipment asset profile and the centralized Reports repository. Reports detail diagnostic observations, corrective actions taken, and replaced components for ongoing compliance readiness.'
    },
    {
      question: 'Can I request emergency maintenance?',
      answer:
        'Yes. The platform provides an expedited Emergency Request option for passenger entrapments and critical equipment outages, automatically tagging the dispatch with high priority to alert qualified nearby technicians immediately.'
    },
    {
      question: 'How do I get started?',
      answer:
        'Click "Get Started" in the navigation bar or select "Find a Technician" if you manage property, or "Join as a Technician" if you are a certified elevator/escalator mechanic. Registration takes less than two minutes and immediately provides access to your role-specific portal.'
    }
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faqs" className="py-20 bg-slate-950/80 border-t border-slate-800/80 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            Clear Answers
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Everything you need to know about LiftCare Network workflows, verification standards, and equipment record keeping.
          </p>

          {/* Search filter input */}
          <div className="relative max-w-md mx-auto mt-6">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. equipment, reports, emergency)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-900/60 rounded-xl border border-slate-800">
              No matching questions found for "{searchQuery}".
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`rounded-xl border transition duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-slate-950/40'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    id={`faq-question-${index}`}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-xl"
                  >
                    <span className="text-sm sm:text-base font-bold text-white leading-snug">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-cyan-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-cyan-300' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                      className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3 animate-fadeIn"
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
