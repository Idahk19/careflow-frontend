import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  HeartPulse,
  MessageSquareText,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-[#f5faf7] text-black">
      <main>

        <section className="relative overflow-hidden bg-[#f5faf7]">
          <div className="w-full px-3 sm:px-5 lg:px-6 pt-14 lg:pt-20">

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">

              <div className="max-w-5xl">

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/45 mb-7">
                  Healthcare, reimagined
                </p>

                <h1 className="text-[clamp(4rem,9vw,8.5rem)] font-bold tracking-[-0.07em] leading-[0.84]">
                  Healthcare
                  <span className="block text-black/35">
                    in one flow.
                  </span>
                </h1>

              </div>

              <div className="lg:max-w-sm lg:pb-3">

                <p className="text-base lg:text-lg leading-7 text-black/55">
                  CareFlow brings appointments, doctors, queues and
                  follow-up care together in one simple healthcare
                  experience.
                </p>

                <Link
                  to="/register"
                  className="inline-flex items-center gap-3 mt-7 text-sm font-semibold group"
                >
                  Get started

                  <span className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center group-hover:translate-x-1 transition">
                    <ArrowRight size={17} />
                  </span>
                </Link>

              </div>

            </div>

            <div className="mt-14 lg:mt-20 relative">

              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#bfe8d0] rounded-t-[4rem] sm:rounded-t-[6rem]"></div>

              <div className="relative w-full">

                <div className="bg-white rounded-t-[2rem] sm:rounded-t-[3rem] shadow-[0_-10px_60px_rgba(0,0,0,0.06)] overflow-hidden">

                  <div className="flex items-center justify-between px-5 sm:px-8 lg:px-10 py-5 border-b border-black/5">

                    <div className="flex items-center gap-3">

                      <div className="flex items-center gap-1">

                        <div className="w-2.5 h-6 rounded-full bg-[#8bcfa9]"></div>

                        <div className="w-2.5 h-4 rounded-full bg-[#bfe8d0]"></div>

                      </div>

                      <span className="font-bold">
                        CareFlow
                      </span>

                    </div>

                    <div className="hidden sm:flex items-center gap-8 text-xs text-black/45">
                      <span>Dashboard</span>
                      <span>Appointments</span>
                      <span>My Care</span>
                    </div>

                    <div className="w-9 h-9 rounded-full bg-[#e8f5ee] flex items-center justify-center">
                      <HeartPulse size={17} />
                    </div>

                  </div>

                  <div className="grid lg:grid-cols-[1.1fr_0.9fr] min-h-[430px]">

                    <div className="p-7 sm:p-10 lg:p-14 flex flex-col justify-between">

                      <div>

                        <p className="text-xs uppercase tracking-[0.18em] text-black/35">
                          Good morning
                        </p>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-3">
                          Your care,
                          <span className="text-black/35">
                            {" "}connected.
                          </span>
                        </h2>

                      </div>

                      <div className="mt-12">

                        <div className="flex items-center justify-between">

                          <div>

                            <p className="text-xs uppercase tracking-widest text-black/35">
                              Upcoming appointment
                            </p>

                            <p className="text-2xl font-bold mt-2">
                              Dr. Sarah Mwangi
                            </p>

                            <p className="text-sm text-black/45 mt-1">
                              Cardiology
                            </p>

                          </div>

                          <div className="w-14 h-14 rounded-full bg-[#bfe8d0] flex items-center justify-center">
                            <Stethoscope size={24} />
                          </div>

                        </div>

                        <div className="mt-7 flex flex-wrap gap-3">

                          <span className="px-4 py-2 bg-[#f5faf7] rounded-full text-sm">
                            Today
                          </span>

                          <span className="px-4 py-2 bg-[#f5faf7] rounded-full text-sm">
                            10:30 AM
                          </span>

                          <span className="px-4 py-2 bg-[#e8f5ee] rounded-full text-sm font-medium">
                            Booked
                          </span>

                        </div>

                      </div>

                    </div>

                    <div className="bg-black text-white p-7 sm:p-10 lg:p-14 flex flex-col justify-between">

                      <div>

                        <div className="flex items-center justify-between">

                          <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                            Queue
                          </p>

                          <Clock3 size={20} />

                        </div>

                        <p className="text-[6rem] sm:text-[7rem] lg:text-[8rem] font-bold tracking-[-0.08em] leading-none mt-10">
                          #04
                        </p>

                        <p className="text-white/50 mt-3">
                          Your current position
                        </p>

                      </div>

                      <div className="mt-12">

                        <div className="h-1 bg-white/15 rounded-full overflow-hidden">
                          <div className="h-full w-[65%] bg-[#bfe8d0] rounded-full"></div>
                        </div>

                        <div className="flex justify-between mt-4 text-sm">

                          <span className="text-white/45">
                            3 patients ahead
                          </span>

                          <span className="text-[#bfe8d0]">
                            In progress
                          </span>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>
        </section>

        <section className="bg-white py-24 lg:py-36">

          <div className="w-full px-3 sm:px-5 lg:px-6">

            <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-12 lg:gap-24">

              <div>

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/35">
                  The CareFlow experience
                </p>

              </div>

              <div>

                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-[-0.05em] leading-[0.95] max-w-5xl">
                  Less waiting.
                  <span className="text-black/30">
                    {" "}Less complexity.
                  </span>
                  <br />
                  More connected care.
                </h2>

                <p className="mt-9 max-w-2xl text-lg leading-8 text-black/50">
                  From finding the right doctor to following up after your
                  appointment, CareFlow keeps every part of your healthcare
                  journey connected.
                </p>

                <div className="mt-14 flex flex-wrap gap-x-12 gap-y-7">

                  <div className="flex items-center gap-3">
                    <CalendarCheck size={21} strokeWidth={1.7} />
                    <span className="font-medium">
                      Simple booking
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock3 size={21} strokeWidth={1.7} />
                    <span className="font-medium">
                      Queue visibility
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <MessageSquareText size={21} strokeWidth={1.7} />
                    <span className="font-medium">
                      Connected feedback
                    </span>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        <section className="bg-[#f5faf7] py-24 lg:py-32 overflow-hidden">

          <div className="w-full px-3 sm:px-5 lg:px-6">

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

              <div>

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/35">
                  How it works
                </p>

                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.05em] mt-4">
                  One journey.
                  <span className="block text-black/30">
                    Five simple steps.
                  </span>
                </h2>

              </div>

              <p className="max-w-sm text-black/50 leading-7">
                Healthcare doesn't have to feel complicated. CareFlow keeps
                the journey clear from start to finish.
              </p>

            </div>

            <div className="mt-20">

              {[
                {
                  number: "01",
                  icon: CalendarCheck,
                  title: "Book your appointment",
                  text: "Choose your service, doctor and available time.",
                },
                {
                  number: "02",
                  icon: CheckCircle2,
                  title: "Check in",
                  text: "Arrive and check in for your appointment.",
                },
                {
                  number: "03",
                  icon: Clock3,
                  title: "Follow your queue",
                  text: "Know where you are and stay informed while you wait.",
                },
                {
                  number: "04",
                  icon: Stethoscope,
                  title: "See your doctor",
                  text: "Get the care and attention you need.",
                },
                {
                  number: "05",
                  icon: MessageSquareText,
                  title: "Continue your care",
                  text: "Access feedback, recommendations and follow-up.",
                },
              ].map((item) => {

                const Icon = item.icon;

                return (
                  <div
                    key={item.number}
                    className="group border-t border-black/10 py-7 lg:py-9 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-10"
                  >

                    <span className="text-sm text-black/30 w-10">
                      {item.number}
                    </span>

                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 group-hover:bg-[#bfe8d0] transition">
                      <Icon size={20} />
                    </div>

                    <h3 className="text-2xl lg:text-3xl font-semibold tracking-tight sm:w-[38%]">
                      {item.title}
                    </h3>

                    <p className="text-black/45 leading-7 max-w-md">
                      {item.text}
                    </p>

                    <ArrowRight
                      size={21}
                      className="hidden lg:block ml-auto opacity-30 group-hover:translate-x-2 group-hover:opacity-100 transition"
                    />

                  </div>
                );

              })}

            </div>

          </div>

        </section>

        <section className="bg-white py-24 lg:py-36">

          <div className="w-full px-3 sm:px-5 lg:px-6">

            <div className="grid lg:grid-cols-2 gap-16 lg:gap-28 items-center">

              <div>

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/35">
                  For patients
                </p>

                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-[-0.06em] leading-[0.9] mt-5">
                  Your health.
                  <span className="block text-black/30">
                    Your information.
                  </span>
                  <span className="block">
                    Your flow.
                  </span>
                </h2>

                <p className="text-lg leading-8 text-black/50 max-w-xl mt-8">
                  Everything important about your appointments and care stays
                  within reach, without making the experience feel
                  overwhelming.
                </p>

                <Link
                  to="/register"
                  className="inline-flex items-center gap-3 mt-9 font-semibold group"
                >
                  Start your care journey

                  <span className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center group-hover:translate-x-1 transition">
                    <ArrowRight size={17} />
                  </span>
                </Link>

              </div>

              <div className="relative min-h-[500px] flex items-center justify-center">

                <div className="absolute w-[360px] h-[360px] sm:w-[500px] sm:h-[500px] rounded-full bg-[#bfe8d0]"></div>

                <div className="relative w-[85%] sm:w-[75%] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.1)] rounded-[2rem] p-7 sm:p-10 rotate-2">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-xs uppercase tracking-widest text-black/35">
                        My Care
                      </p>

                      <h3 className="text-2xl font-bold mt-2">
                        Your health overview
                      </h3>

                    </div>

                    <div className="w-11 h-11 rounded-full bg-[#e8f5ee] flex items-center justify-center">
                      <HeartPulse size={20} />
                    </div>

                  </div>

                  <div className="mt-10">

                    <p className="text-xs uppercase tracking-widest text-black/30">
                      Upcoming
                    </p>

                    <div className="mt-4 flex items-center justify-between">

                      <div>

                        <p className="font-bold text-lg">
                          Dr. Sarah Mwangi
                        </p>

                        <p className="text-sm text-black/45 mt-1">
                          Cardiology
                        </p>

                      </div>

                      <span className="text-sm font-medium">
                        10:30 AM
                      </span>

                    </div>

                    <div className="h-px bg-black/10 my-7"></div>

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-xs uppercase tracking-widest text-black/30">
                          Queue position
                        </p>

                        <p className="text-5xl font-bold mt-2">
                          #04
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="text-sm text-black/40">
                          Status
                        </p>

                        <p className="font-semibold mt-1">
                          In progress
                        </p>

                      </div>

                    </div>

                    <div className="mt-8 h-2 rounded-full bg-[#f5faf7] overflow-hidden">
                      <div className="h-full w-[65%] bg-[#8bcfa9] rounded-full"></div>
                    </div>

                  </div>

                </div>

                <div className="absolute bottom-8 right-0 sm:right-3 bg-black text-white rounded-2xl px-5 py-4 shadow-xl -rotate-3">

                  <div className="flex items-center gap-3">

                    <MessageSquareText size={19} />

                    <div>

                      <p className="text-xs text-white/45">
                        Latest update
                      </p>

                      <p className="text-sm font-semibold">
                        Doctor feedback available
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        <section className="bg-black text-white py-24 lg:py-36">

          <div className="w-full px-3 sm:px-5 lg:px-6">

            <div className="grid lg:grid-cols-2 gap-16 items-center">

              <div>

                <div className="flex items-center gap-3 text-[#9ee6bd]">

                  <HeartPulse
                    size={22}
                    strokeWidth={1.8}
                  />

                  <span className="text-sm font-semibold uppercase tracking-[0.18em]">
                    For healthcare providers
                  </span>

                </div>

                <h2 className="mt-6 max-w-3xl text-4xl sm:text-5xl lg:text-7xl font-bold tracking-[-0.06em] leading-[0.9]">
                  Better tools.
                  <span className="block text-white/30">
                    Better flow.
                  </span>
                </h2>

                <p className="mt-7 max-w-xl text-lg leading-8 text-white/50">
                  CareFlow gives doctors and healthcare teams a clearer way
                  to manage appointments, patients, queues and follow-up
                  information.
                </p>

              </div>

              <div className="lg:pt-4">

                <div className="border-t border-white/10 py-6 flex items-center gap-5">

                  <CalendarCheck
                    size={21}
                    strokeWidth={1.8}
                    className="text-[#9ee6bd]"
                  />

                  <span className="text-xl">
                    Appointment management
                  </span>

                </div>

                <div className="border-t border-white/10 py-6 flex items-center gap-5">

                  <UsersRound
                    size={21}
                    strokeWidth={1.8}
                    className="text-[#9ee6bd]"
                  />

                  <span className="text-xl">
                    Patient management
                  </span>

                </div>

                <div className="border-t border-white/10 py-6 flex items-center gap-5">

                  <Clock3
                    size={21}
                    strokeWidth={1.8}
                    className="text-[#9ee6bd]"
                  />

                  <span className="text-xl">
                    Queue management
                  </span>

                </div>

                <div className="border-y border-white/10 py-6 flex items-center gap-5">

                  <MessageSquareText
                    size={21}
                    strokeWidth={1.8}
                    className="text-[#9ee6bd]"
                  />

                  <span className="text-xl">
                    Appointment feedback
                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>

        <section className="bg-[#f5faf7] py-24 lg:py-32">

          <div className="max-w-4xl mx-auto px-6 text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/35">
              Start with CareFlow
            </p>

            <h2 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-[-0.07em] leading-[0.88] mt-5">
              Healthcare
              <span className="block text-black/30">
                should feel simple.
              </span>
            </h2>

            <p className="max-w-xl mx-auto text-lg text-black/50 leading-8 mt-8">
              Book your appointment, follow your care journey and stay
              connected with the people taking care of you.
            </p>

            <Link
              to="/register"
              className="inline-flex items-center gap-3 mt-9 px-7 py-4 bg-black text-white rounded-full font-semibold group"
            >
              Get Started

              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition"
              />
            </Link>

          </div>

        </section>

        <Footer />

      </main>
    </div>
  );
}

export default Home;