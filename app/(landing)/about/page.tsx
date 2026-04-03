import {
  CheckCircle,
  Zap,
  Shield,
  Sparkles,
  Award,
  Users,
  Globe,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-24 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="space-y-8">
            <h1 className="text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
              Empowering the <br />
              <span className="text-blue-600">Next Generation</span> of <br />
              Ethiopian Tech.
            </h1>
            <p className="max-w-lg text-lg text-slate-500 leading-relaxed">
              VentureScope is the intelligence layer bridging the gap between
              academic potential and global employability for Ethiopia's rising
              tech talent.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-700 border border-blue-100">
                <CheckCircle className="h-3 w-3" /> Verified Skills
              </div>
              <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-700 border border-blue-100">
                <Zap className="h-3 w-3" /> Real-time Data
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-[32px] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800"
                alt="Ethiopian tech team"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Stat Floating Card */}
            <div className="absolute bottom-[-20px] left-[-20px] rounded-2xl bg-white p-6 shadow-xl border border-slate-100 max-w-[200px]">
              <p className="text-2xl font-bold text-slate-900">10k+</p>
              <p className="text-[10px] text-slate-500 leading-tight">
                Profiles analyzed across the Ethiopian tech ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="bg-slate-50/50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 grid gap-16 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Our Mission
            </h2>
            <p className="text-xl font-medium text-slate-500 italic leading-relaxed">
              "We believe talent is universal, but opportunity is not. We are
              here to change that narrative for every Ethiopian graduate."
            </p>
          </div>
          <div className="lg:col-span-3 space-y-8 pt-2">
            <h3 className="text-xl font-bold text-slate-900">
              Bridging the Academic Gap
            </h3>
            <p className="text-slate-500 leading-relaxed">
              Every year, thousands of brilliant minds graduate from Ethiopian
              universities. Yet, a significant gap remains between their
              academic achievements and the specific requirements of the global
              tech industry.
            </p>
            <p className="text-slate-500 leading-relaxed">
              VentureScope provides the infrastructure to map these achievements
              into actionable career pathways. By quantifying skills and
              predicting potential, we ensure that no talent goes unnoticed and
              no opportunity goes unfilled.
            </p>
          </div>
        </div>
      </section>

      {/* BENTO GRID */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold text-slate-900">
            The Intelligence Layer
          </h2>
          <p className="text-slate-500">
            How we use data to transform career scouting and recruitment.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:auto-rows-[320px]">
          {/* GitHub Analytics Card */}
          <div className="md:col-span-2 rounded-[32px] bg-[#020817] p-8 text-white flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute right-[-40px] bottom-[-40px] opacity-10 group-hover:opacity-20 transition-opacity">
              <Terminal size={180} />
            </div>
            <div className="relative z-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 mb-4">
                <Terminal size={24} />
              </span>
              <h3 className="text-2xl font-bold mb-2">GitHub Analytics</h3>
              <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                We analyze real-world contributions, repository velocity, and
                code quality to verify technical proficiency beyond the CV.
              </p>
            </div>
          </div>

          {/* AI Matching Card */}
          <div className="rounded-[32px] bg-blue-600 p-8 text-white flex flex-col justify-between">
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 mb-4">
                <Sparkles size={24} />
              </span>
              <h3 className="text-2xl font-bold mb-2">AI-Powered Matching</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Predictive algorithms that connect graduates with the roles
                where they are most likely to excel.
              </p>
            </div>
          </div>

          {/* eStudent Data Card */}
          <div className="rounded-[32px] bg-blue-50 p-8 flex flex-col justify-between">
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-200 mb-4">
                <Award size={24} className="text-blue-700" />
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                eStudent Data
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Aggregating academic performance and institutional records to
                build a foundational profile.
              </p>
            </div>
          </div>

          {/* Market Trends Card */}
          <div className="md:col-span-2 rounded-[32px] border border-slate-100 shadow-sm p-1 overflow-hidden relative group">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
              className="w-full h-full object-cover rounded-[31px] transition-transform duration-700 group-hover:scale-110"
              alt="Market trends"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent p-10 flex flex-col justify-end">
              <h3 className="text-xl font-bold text-white">Market Trends</h3>
              <p className="text-slate-200 text-sm">
                Tracking shifts in technology demand to guide students toward
                future-proof skill sets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT SECTION */}
      <section className="bg-[#020817] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">
            Unlocking Impact Across the Ecosystem
          </h2>
          <div className="grid gap-12 lg:grid-cols-3">
            {[
              {
                title: "For Students",
                desc: "Turn your degree into a career roadmap. Get discovered by global firms based on your actual potential and verified skills.",
                icon: Users,
              },
              {
                title: "For Professionals",
                desc: "Continuous career intelligence. Identify skill gaps and benchmark yourself against regional and global standards.",
                icon: Zap,
              },
              {
                title: "For Corporate HR",
                desc: "Eliminate the guesswork in hiring. Access a pre-vetted pipeline of top-tier talent with validated technical backgrounds.",
                icon: Shield,
              },
            ].map((item, i) => (
              <div key={i} className="space-y-4">
                <item.icon className="h-8 w-8 text-blue-500" />
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="flex flex-col justify-between items-end gap-6 mb-12 md:flex-row">
          <h2 className="text-3xl font-bold text-slate-900">
            The Values Driving Us
          </h2>
          <Button
            variant="outline"
            className="rounded-full bg-blue-50 text-blue-600 border-none font-bold hover:bg-blue-100"
          >
            Join the Movement
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              t: "Integrity",
              d: "Radical transparency in our data and matching processes.",
            },
            {
              t: "Excellence",
              d: "Striving for world-class standards in technical verification.",
            },
            {
              t: "Inclusion",
              d: "Democratizing access to high-value global career opportunities.",
            },
            {
              t: "Innovation",
              d: "Using limiting-edge AI to solve the employability paradox.",
            },
          ].map((v, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white p-8 border border-slate-100 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="font-bold text-slate-900 mb-2">{v.t}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VISIONARIES SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8 text-center bg-slate-50/50 rounded-[60px] mb-24">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">
          Our Visionaries
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto mb-16">
          A multidisciplinary team of engineers, educators, and data scientists
          committed to Ethiopia's digital future.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {[
            {
              name: "Samuel Geremew",
              role: "TEAM LEAD - AI ML / FRONTEND",
              img: "https://api.dicebear.com/7.x/avataaars/svg?seed=SamuelG&top=shortFlat&facialHairProbability=40",
            },
            {
              name: "Betsegaw Tesfaye",
              role: "FULL STACK / DATA PIPELINE",
              img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Betsegaw&top=shortWaved&facialHairProbability=40",
            },
            {
              name: "Nikodimos Mekonnen",
              role: "BACKEND / SECURITY",
              img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Niko&top=shortCurly&facialHairProbability=40",
            },
            {
              name: "Mahlet Demeke",
              role: "FRONTEND",
              img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mahlet&top=straight02&facialHairProbability=0&accessoriesProbability=20",
            },
            {
              name: "Samuel Fikadesilassie",
              role: "BACKEND",
              img: "https://api.dicebear.com/7.x/avataaars/svg?seed=SamuelF&top=sides&facialHairProbability=40",
            },
          ].map((t, i) => (
            <div key={i} className="space-y-4">
              <div className="mx-auto h-44 w-44 rounded-full overflow-hidden border-[6px] border-white shadow-xl">
                <img
                  src={t.img}
                  className="h-full w-full object-cover bg-slate-200"
                  alt={t.name}
                />
              </div>
              <div>
                <p className="font-bold text-slate-900">{t.name}</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
