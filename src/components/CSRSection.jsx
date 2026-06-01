import React from "react";

const CSRSection = () => {
  const initiatives = [
    {
      heading: "Social Inclusion",
      title: "Jamii Stawi",
      text: "Empowering lives through health equity, educational support, and economic dignity for neighboring communities.",
    },
    {
      heading: "Climate Resilience",
      title: "Uhifadhi Action",
      text: "Active reforestation, waste circularity, and plastic neutrality to preserve Africa’s untamed landscapes.",
    },
    {
      heading: "Mentorship",
      title: "Mvuto Network",
      text: "Fostering the next generation of African conservationists and ethical hospitality leaders through mentorship.",
    },
  ];

  return (
    <section className="relative bg-[#f8f5ef] overflow-hidden pt-32 pb-52 px-6 md:px-20">

      {/* SOFT LIGHTING */}
      <div className="absolute top-[-200px] right-[-100px] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[160px]" />

      <div className="absolute bottom-[-250px] left-[-100px] w-[500px] h-[500px] bg-[#061a17]/5 rounded-full blur-[160px]" />

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto relative z-10">

        {/* TOP LABEL */}
        <div className="flex items-center gap-4 mb-8">

          <div className="w-16 h-px bg-accent" />

          <span className="uppercase tracking-[0.38em] text-[11px] font-semibold text-[#8f7740]">
            Corporate Responsibility
          </span>

        </div>

        {/* TITLE ROW */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12 mb-24">

          <div>

            <h2 className="text-6xl md:text-8xl font-bold leading-[0.9] text-[#111]">
              Kovu{" "}
              <span className="text-accent italic font-medium">
                Afrika
              </span>
            </h2>

          </div>

          <div className="max-w-xl">

            <p className="text-[#555] text-lg md:text-xl leading-relaxed">
              <span className="font-semibold text-[#111]">
                Healing Landscapes, Empowering Lives.
              </span>{" "}
              Kovu Afrika reflects our commitment to sustainable
              tourism, ethical luxury, and creating meaningful impact
              throughout Africa’s communities and ecosystems.
            </p>

          </div>

        </div>

        {/* CARDS */}
        <div className="grid lg:grid-cols-3 gap-8">

          {initiatives.map((item, index) => (
            <div
              key={index}
              className="group relative bg-white border border-black/5 rounded-[2.2rem] p-10 overflow-hidden transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_35px_80px_rgba(0,0,0,0.08)]"
            >

              {/* TOP GLOW */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700" />

              {/* NUMBER */}
              <div className="absolute top-8 right-8 text-[70px] font-bold text-black/[0.03] leading-none">
                0{index + 1}
              </div>

              {/* MINI TAG */}
              <div className="inline-flex items-center gap-2 mb-8">

                <div className="w-8 h-[2px] bg-accent" />

                <span className="uppercase tracking-[0.28em] text-[10px] font-semibold text-[#9b8450]">
                  Initiative
                </span>

              </div>

              {/* HEADING */}
              <h3 className="text-[30px] leading-tight font-bold text-[#111] mb-4">
                {item.heading}
              </h3>

              {/* TITLE */}
              <p className="text-accent text-lg font-semibold italic mb-6">
                {item.title}
              </p>

              {/* TEXT */}
              <p className="text-[#666] leading-relaxed text-[15px]">
                {item.text}
              </p>

              {/* BOTTOM LINE */}
              <div className="mt-10 w-14 h-[2px] bg-black/10 group-hover:w-24 group-hover:bg-accent transition-all duration-500" />

            </div>
          ))}

        </div>

      </div>

      {/* PREMIUM BOTTOM SECTION */}
      <div className="absolute bottom-0 left-0 w-full">

        {/* CURVED TRANSITION */}
        <div className="relative h-32 overflow-hidden">

          <div
            className="absolute inset-0"
            style={{
              clipPath: "ellipse(72% 100% at 50% 100%)",
              background:
                "linear-gradient(to right, rgba(6,26,23,0.03), rgba(6,26,23,0.12), rgba(6,26,23,0.03))",
            }}
          />

        </div>

        {/* LUXURY BAND */}
        <div className="relative h-48 bg-[#efe7d7] border-t border-[#e3d6bc] overflow-hidden flex items-center justify-center">

          {/* HUGE WATERMARK */}
          <h3 className="absolute text-[140px] md:text-[220px] font-black tracking-[-0.06em] text-[#061a17]/[0.06] whitespace-nowrap select-none leading-none">
            KOVU
          </h3>

          {/* GOLD LIGHT */}
          <div className="absolute w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px]" />

          {/* CENTER CONTENT */}
          <div className="relative flex flex-col items-center">

            {/* TOP LINE */}
            <div className="w-40 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent mb-8" />

            {/* PREMIUM DOTS */}
            <div className="flex items-center gap-5">

              {Array.from({ length: 9 }).map((_, index) => (
                <div
                  key={index}
                  className={`rounded-full transition-all duration-500 ${
                    index === 4
                      ? "w-4 h-4 bg-accent shadow-[0_0_25px_rgba(200,162,72,0.5)]"
                      : "w-2.5 h-2.5 bg-[#061a17]/20"
                  }`}
                />
              ))}

            </div>

            {/* BOTTOM LINE */}
            <div className="w-40 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent mt-8" />

          </div>

        </div>

      </div>

    </section>
  );
};

export default CSRSection;