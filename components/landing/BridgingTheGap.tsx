import { GraduationCap, TrendingUp } from "lucide-react";

export default function BridgingTheGap() {
  const features = [
    {
      title: "Academic Alignment",
      desc: "Mapping curriculum outcomes to industry requirements in the Ethiopian tech landscape.",
      icon: GraduationCap,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Market Mapping",
      desc: "Identifying emerging tech hubs within Addis Ababa and the growing digital economy.",
      icon: TrendingUp,
      bg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-center lg:text-left">
              Bridging the Gap
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-slate-500 text-center lg:text-left">
              VentureScope is more than a platform; it's a strategic partner for
              Ethiopia's growing tech ecosystem. We analyze real-time market
              needs to ensure local talent meets global standards.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
            {features.map((f, i) => (
              <div
                key={i}
                className={`rounded-2xl ${f.bg} p-6 sm:p-8 border border-white transition-transform hover:-translate-y-1 flex flex-col items-center text-center sm:items-start sm:text-left`}
              >
                <f.icon className={`mb-4 sm:mb-6 h-8 w-8 ${f.iconColor}`} />
                <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-bold text-slate-900">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
