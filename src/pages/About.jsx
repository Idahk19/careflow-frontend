import {
  ArrowRight,
  CalendarCheck,
  HeartPulse,
  Clock3,
  ShieldCheck,
  UsersRound,
  Stethoscope,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

function About() {
  return (
    <main className="bg-[#f5faf7] text-black">

      <section className="relative overflow-hidden bg-[#bfe8d0]">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#e8f5ee] opacity-70 blur-3xl"></div>

        <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-[#9ee6bd] opacity-40 blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-28">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 text-black text-sm font-medium mb-8">
              <HeartPulse
                size={16}
                strokeWidth={1.8}
              />
              Healthcare, reimagined
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-semibold tracking-[-0.05em] leading-[0.95]">
              Healthcare that
              <span className="block text-black/45">
                flows with you.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg sm:text-xl leading-relaxed text-black/60">
              CareFlow brings patients, doctors, appointments, and care
              together in one simple healthcare experience designed around
              people.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">

              <Link
                to="/register"
                className="group flex items-center gap-3 bg-black text-white px-6 py-3.5 rounded-full text-sm font-semibold hover:translate-y-[-2px] transition-all"
              >
                Get started

                <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-1 transition">
                  <ArrowRight size={16} />
                </span>
              </Link>

              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-full bg-white/60 text-black text-sm font-semibold hover:bg-white transition"
              >
                Talk to us
              </Link>

            </div>

          </div>

        </div>
      </section>

      <section className="px-6 lg:px-10 py-24 lg:py-32">
        <div className="max-w-7xl mx-auto">

          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-24 items-start">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4d9b70]">
                Our purpose
              </p>

              <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">
                Better care starts with a better experience.
              </h2>

            </div>

            <div className="space-y-6 text-lg leading-relaxed text-black/55">

              <p>
                Healthcare can feel complicated. Finding the right doctor,
                managing appointments, keeping track of your care, and staying
                connected can all become overwhelming.
              </p>

              <p>
                CareFlow was created to make that experience simpler. We bring
                the essential parts of healthcare into one connected platform
                so patients can spend less time navigating the system and more
                time focusing on their wellbeing.
              </p>

              <p>
                For healthcare teams, CareFlow provides the tools they need to
                organize appointments, manage patients, and keep care moving
                efficiently.
              </p>

            </div>

          </div>

        </div>
      </section>

      <section className="px-6 lg:px-10 py-24 bg-white">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">

            <div className="max-w-2xl">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4d9b70]">
                How it works
              </p>

              <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">
                Everything you need,
                <span className="block text-black/35">
                  in one flow.
                </span>
              </h2>

            </div>

            <p className="max-w-sm text-black/45 leading-relaxed">
              From booking an appointment to staying connected with your care,
              CareFlow keeps the journey simple.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-5">

            <div className="group rounded-[2rem] bg-[#f5faf7] p-8 border border-black/5 hover:-translate-y-1 transition-all">

              <div className="w-12 h-12 rounded-2xl bg-[#bfe8d0] flex items-center justify-center mb-10">
                <CalendarCheck
                  size={23}
                  strokeWidth={1.8}
                />
              </div>

              <p className="text-sm font-semibold text-black/30">
                01
              </p>

              <h3 className="mt-3 text-2xl font-semibold">
                Book with ease
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-black/50">
                Find available services, doctors, dates, and time slots
                without unnecessary steps.
              </p>

            </div>

            <div className="group rounded-[2rem] bg-[#f5faf7] p-8 border border-black/5 hover:-translate-y-1 transition-all">

              <div className="w-12 h-12 rounded-2xl bg-[#bfe8d0] flex items-center justify-center mb-10">
                <Clock3
                  size={23}
                  strokeWidth={1.8}
                />
              </div>

              <p className="text-sm font-semibold text-black/30">
                02
              </p>

              <h3 className="mt-3 text-2xl font-semibold">
                Stay organized
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-black/50">
                Keep your upcoming and previous appointments organized in one
                place.
              </p>

            </div>

            <div className="group rounded-[2rem] bg-[#f5faf7] p-8 border border-black/5 hover:-translate-y-1 transition-all">

              <div className="w-12 h-12 rounded-2xl bg-[#bfe8d0] flex items-center justify-center mb-10">
                <HeartPulse
                  size={23}
                  strokeWidth={1.8}
                />
              </div>

              <p className="text-sm font-semibold text-black/30">
                03
              </p>

              <h3 className="mt-3 text-2xl font-semibold">
                Focus on your care
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-black/50">
                Stay connected to the information and services that support
                your healthcare journey.
              </p>

            </div>

          </div>

        </div>
      </section>

      <section className="px-6 lg:px-10 py-24">
        <div className="max-w-7xl mx-auto">

          <div className="grid lg:grid-cols-2 gap-6">

            <div className="rounded-[2.5rem] bg-[#bfe8d0] p-8 sm:p-12 min-h-[470px] flex flex-col justify-between">

              <div>

                <div className="w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center">
                  <UsersRound
                    size={23}
                    strokeWidth={1.8}
                  />
                </div>

                <h2 className="mt-10 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">
                  Designed around people.
                </h2>

              </div>

              <p className="max-w-md text-black/60 leading-relaxed">
                From the first appointment to ongoing care, every part of
                CareFlow is designed to make healthcare feel clearer,
                friendlier, and easier to navigate.
              </p>

            </div>

            <div className="grid sm:grid-cols-2 gap-6">

              <div className="rounded-[2.5rem] bg-white border border-black/5 p-8">

                <ShieldCheck
                  size={28}
                  strokeWidth={1.8}
                  className="text-[#4d9b70]"
                />

                <h3 className="mt-8 text-2xl font-semibold">
                  Simple & secure
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-black/50">
                  A focused experience that keeps essential healthcare
                  information organized and accessible.
                </p>

              </div>

              <div className="rounded-[2.5rem] bg-white border border-black/5 p-8">

                <Stethoscope
                  size={28}
                  strokeWidth={1.8}
                  className="text-[#4d9b70]"
                />

                <h3 className="mt-8 text-2xl font-semibold">
                  Connected care
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-black/50">
                  Patients and healthcare teams stay connected through a
                  shared, organized platform.
                </p>

              </div>

              <div className="sm:col-span-2 rounded-[2.5rem] bg-black text-white p-8 sm:p-10 flex items-center justify-between gap-6">

                <div>

                  <p className="text-sm text-white/50">
                    The CareFlow philosophy
                  </p>

                  <h3 className="mt-2 text-2xl sm:text-3xl font-semibold">
                    Less complexity. More care.
                  </h3>

                </div>

                <Sparkles
                  size={32}
                  strokeWidth={1.5}
                  className="shrink-0"
                />

              </div>

            </div>

          </div>

        </div>
      </section>

      <section className="px-6 lg:px-10 pb-28 pt-4">

        <div className="max-w-5xl mx-auto rounded-[3rem] bg-[#e8f5ee] border border-black/5 px-7 py-16 sm:px-14 sm:py-20 text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4d9b70]">
            Your care, your flow
          </p>

          <h2 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight">
            Healthcare should feel
            <span className="block text-[#4d9b70]">
              simpler.
            </span>
          </h2>

          <p className="mt-6 max-w-xl mx-auto text-black/50 leading-relaxed">
            Take the next step toward a more connected healthcare experience.
          </p>

          <Link
            to="/register"
            className="inline-flex items-center gap-3 mt-9 bg-black text-white px-7 py-4 rounded-full text-sm font-semibold hover:translate-y-[-2px] transition-all"
          >
            Get started with CareFlow
            <ArrowRight size={17} />
          </Link>

        </div>

      </section>
     <Footer />
    </main>
  );
}

export default About;