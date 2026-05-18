"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    quote: "MindGuard AI transformed how we support our engineering cohort. We saw a 40% reduction in reported burnout symptoms within the first semester of implementation.",
    author: "Dr. Sarah Jenkins",
    role: "Dean of Student Affairs",
    institution: "Tech University",
    image: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    quote: "The predictive alerts are game-changing. We can now reach out to students before they hit a crisis point, rather than reacting after the fact.",
    author: "Michael Chang",
    role: "Head of Counseling",
    institution: "State College",
    image: "https://i.pravatar.cc/150?u=michael"
  },
  {
    quote: "As a student, I appreciate the gentle nudges. It feels like someone is looking out for my wellbeing without being intrusive or demanding.",
    author: "Elena Rodriguez",
    role: "Computer Science Senior",
    institution: "Global Institute",
    image: "https://i.pravatar.cc/150?u=elena"
  }
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-black relative overflow-hidden">
      {/* Background flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by leading <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                institutions.
              </span>
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm flex flex-col"
            >
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-purple-500 text-purple-500" />
                ))}
              </div>
              
              <p className="text-zinc-300 text-lg mb-8 flex-1 italic">
                &quot;{t.quote}&quot;
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20">
                  <Image 
                    src={t.image} 
                    alt={t.author} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-white font-semibold">{t.author}</h4>
                  <div className="text-sm text-zinc-400">{t.role}</div>
                  <div className="text-xs text-purple-400">{t.institution}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
