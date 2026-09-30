import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Clock3,
  MessageCircle,
  HeartPulse,
} from "lucide-react";
import { Link } from "react-router-dom";

function Contact() {
  return (
    <main className="bg-[#f5faf7] text-black">

      <section className="relative overflow-hidden bg-[#bfe8d0]">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#e8f5ee] opacity-70 blur-3xl"></div>

        <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-[#9ee6bd] opacity-40 blur-3xl"></div>

        <div className="relative w-full px-6 lg:px-10 pt-20 pb-24 lg:pt-24 lg:pb-32">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 text-black text-sm font-medium mb-8">
              <MessageCircle
                size={16}
                strokeWidth={1.8}
              />
              We're here to help
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-semibold tracking-[-0.05em] leading-[0.95]">
              Let's keep
              <span className="block text-black/45">
                care moving.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg sm:text-xl leading-relaxed text-black/60">
              Whether you have a question about CareFlow, need help with your
              account, or simply want to talk to us, we're always happy to
              hear from you.
            </p>

          </div>

        </div>
      </section>

      <section className="px-6 lg:px-10 py-24 lg:py-32">
        <div className="w-full">

          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-24 items-start">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4d9b70]">
                Get in touch
              </p>

              <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">
                We're only a
                <span className="block text-black/35">
                  message away.
                </span>
              </h2>

              <p className="mt-6 max-w-md text-base leading-relaxed text-black/50">
                Choose the way that works best for you. Our team is here to
                help make your CareFlow experience simple and seamless.
              </p>

            </div>

            <div className="grid sm:grid-cols-2 gap-5">

              <a
                href="mailto:support@careflow.com"
                className="group rounded-[2rem] bg-white border border-black/5 p-8 hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#bfe8d0] flex items-center justify-center">
                  <Mail
                    size={23}
                    strokeWidth={1.8}
                  />
                </div>

                <p className="mt-10 text-sm text-black/35">
                  Email us
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  support@careflow.com
                </h3>

                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-[#4d9b70]">
                  Send an email
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition"
                  />
                </div>
              </a>

              <a
                href="tel:+254700000000"
                className="group rounded-[2rem] bg-white border border-black/5 p-8 hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#bfe8d0] flex items-center justify-center">
                  <Phone
                    size={23}
                    strokeWidth={1.8}
                  />
                </div>

                <p className="mt-10 text-sm text-black/35">
                  Call us
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  +254 700 000 000
                </h3>

                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-[#4d9b70]">
                  Give us a call
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition"
                  />
                </div>
              </a>

              <div className="rounded-[2rem] bg-white border border-black/5 p-8">

                <div className="w-12 h-12 rounded-2xl bg-[#bfe8d0] flex items-center justify-center">
                  <MapPin
                    size={23}
                    strokeWidth={1.8}
                  />
                </div>

                <p className="mt-10 text-sm text-black/35">
                  Find us
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  Nairobi, Kenya
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-black/45">
                  Serving patients and healthcare teams through a connected
                  digital experience.
                </p>

              </div>

              <div className="rounded-[2rem] bg-white border border-black/5 p-8">

                <div className="w-12 h-12 rounded-2xl bg-[#bfe8d0] flex items-center justify-center">
                  <Clock3
                    size={23}
                    strokeWidth={1.8}
                  />
                </div>

                <p className="mt-10 text-sm text-black/35">
                  Support hours
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  Monday – Friday
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-black/45">
                  8:00 AM – 5:00 PM
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>

      <section className="px-6 lg:px-10 pb-24">
        <div className="w-full rounded-[2.5rem] bg-black text-white p-8 sm:p-12 lg:p-16">

          <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-center">

            <div>

              <div className="flex items-center gap-3 text-[#9ee6bd]">
                <HeartPulse
                  size={22}
                  strokeWidth={1.8}
                />

                <span className="text-sm font-semibold uppercase tracking-[0.18em]">
                  CareFlow support
                </span>
              </div>

              <h2 className="mt-6 max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">
                Good healthcare starts with
                <span className="text-[#9ee6bd]">
                  {" "}good communication.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-white/50 leading-relaxed">
                Have questions, need assistance, or want to learn more about
                CareFlow? Reach out and let's make your healthcare experience
                easier.
              </p>

            </div>

            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-3 bg-[#9ee6bd] text-black px-7 py-4 rounded-full text-sm font-semibold hover:translate-y-[-2px] transition-all"
            >
              Get started

              <span className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-1 transition">
                <ArrowRight size={16} />
              </span>
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}

export default Contact;