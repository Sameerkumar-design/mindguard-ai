"use client";

import { motion } from "framer-motion";
import { Activity, Brain, LineChart, MessageSquare, Shield, Zap } from "lucide-react";

const features = [
  {
    title: "Predictive Burnout Detection",
    description: "Our AI models analyze engagement metrics and assignment patterns to forecast burnout risk weeks in advance.",
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20"
  },
  {
    title: "Real-time Sentiment Analysis",
    description: "Ethical, privacy-first processing of student communication to gauge cohort stress levels anonymously.",
    icon: MessageSquare,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20"
  },
  {
    title: "Actionable Interventions",
    description: "Automated, personalized wellness nudges and study optimization suggestions delivered straight to students.",
    icon: Zap,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20"
  },
  {
    title: "Academic Performance Sync",
    description: "Integrates seamlessly with existing LMS platforms to correlate mental wellness with academic outcomes.",
    icon: LineChart,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20"
  },
  {
    title: "Continuous Monitoring",
    description: "24/7 passive monitoring that doesn't add to student workload, ensuring a complete wellness picture.",
    icon: Activity,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20"
  },
  {
    title: "Enterprise-Grade Privacy",
    description: "Built on zero-trust architecture. Student data is anonymized and encrypted at rest and in transit.",
    icon: Shield,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20"
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-black relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900/20 to-black pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Intelligent features for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                proactive care.
              </span>
            </h2>
            <p className="text-zinc-400 text-lg">
              Everything you need to support student wellbeing at scale. Powered by ethical AI, designed for modern educational institutions.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-300 hover:border-white/10"
            >
              {/* Glassmorphism gradient effect on hover */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.border} border flex items-center justify-center mb-6`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              
              <p className="text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
