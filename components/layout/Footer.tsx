import Link from "next/link";
import { Brain, Globe, Mail, MessageSquare } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">MindGuard AI</span>
            </Link>
            <p className="text-zinc-500 text-sm mb-6">
              Empowering institutions with predictive AI to eliminate student burnout and foster resilient minds.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <MessageSquare className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-zinc-400 hover:text-white text-sm transition-colors">Features</Link></li>
              <li><Link href="#" className="text-zinc-400 hover:text-white text-sm transition-colors">Integrations</Link></li>
              <li><Link href="#" className="text-zinc-400 hover:text-white text-sm transition-colors">Security</Link></li>
              <li><Link href="#" className="text-zinc-400 hover:text-white text-sm transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-zinc-400 hover:text-white text-sm transition-colors">Case Studies</Link></li>
              <li><Link href="#" className="text-zinc-400 hover:text-white text-sm transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-zinc-400 hover:text-white text-sm transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-zinc-400 hover:text-white text-sm transition-colors">Help Center</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-zinc-400 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-zinc-400 hover:text-white text-sm transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-zinc-400 hover:text-white text-sm transition-colors">Cookie Policy</Link></li>
              <li><Link href="#" className="text-zinc-400 hover:text-white text-sm transition-colors">HIPAA Compliance</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm">
            © {currentYear} MindGuard AI Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
