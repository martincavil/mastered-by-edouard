import { useState } from "react";

export function ServicesSubject() {
  const [expandedService, setExpandedService] = useState<number | null>(null);

  const services = [
    {
      title: "Mastering",
      description: "Professional audio mastering services for your tracks.",
    },
    {
      title: "Mixing",
      description: "High-quality mixing to bring your music to life.",
    },
    {
      title: "Production",
      description: "Full music production from concept to completion.",
    },
    {
      title: "Consultation",
      description: "Expert advice on audio production and engineering.",
    },
  ];

  return (
    <>
      <div className="text-white space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Services</h2>
        {services.map((service, index) => (
          <div key={index} className="border-b border-white/20">
            <button
              onClick={() =>
                setExpandedService(expandedService === index ? null : index)
              }
              className="w-full text-left py-4 flex justify-between items-center hover:text-red transition-colors"
            >
              <span className="text-xl md:text-2xl font-medium">
                {service.title}
              </span>
              <span className="text-2xl">
                {expandedService === index ? "−" : "+"}
              </span>
            </button>
            {expandedService === index && (
              <div className="pb-4 text-lg opacity-80">
                {service.description}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="relative w-full h-[400px]">
        {/* Image placeholder - to be added later */}
      </div>
    </>
  );
}
