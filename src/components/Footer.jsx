import {
  HeartPulse,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-black text-white">

      <div className="w-full px-6 lg:px-10">

        <div className="py-16 lg:py-18 grid lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12 lg:gap-16 items-start">

          <div className="max-w-sm">

            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-6 rounded-full bg-[#9ee6bd]"></div>

                <div className="w-2.5 h-4 rounded-full bg-[#c8f3d9]"></div>
              </div>

              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  CareFlow
                </h2>

                <p className="text-[9px] text-white/40 tracking-[0.2em] uppercase">
                  Healthcare
                </p>
              </div>
            </Link>

            <p className="mt-5 text-sm leading-relaxed text-white/50 max-w-xs">
              Making healthcare simpler, more connected, and easier to
              navigate for everyone.
            </p>

            <Link
              to="/register"
              className="group inline-flex items-center gap-3 mt-6 text-sm font-semibold text-[#9ee6bd]"
            >
              Get started

              <span className="w-8 h-8 rounded-full bg-[#9ee6bd] text-black flex items-center justify-center group-hover:translate-x-1 transition">
                <ArrowRight size={15} />
              </span>
            </Link>

          </div>

          <div className="pt-1">

            <h3 className="text-sm font-semibold">
              Explore
            </h3>

            <div className="mt-5 flex flex-col gap-3.5">

              <Link
                to="/"
                className="text-sm text-white/50 hover:text-[#9ee6bd] transition"
              >
                Home
              </Link>

              <Link
                to="/about"
                className="text-sm text-white/50 hover:text-[#9ee6bd] transition"
              >
                About
              </Link>

              <Link
                to="/contact"
                className="text-sm text-white/50 hover:text-[#9ee6bd] transition"
              >
                Contact
              </Link>

            </div>

          </div>

          <div className="pt-1">

            <h3 className="text-sm font-semibold">
              CareFlow
            </h3>

            <div className="mt-5 flex flex-col gap-3.5">

              <Link
                to="/register"
                className="text-sm text-white/50 hover:text-[#9ee6bd] transition"
              >
                Get started
              </Link>

              <Link
                to="/login"
                className="text-sm text-white/50 hover:text-[#9ee6bd] transition"
              >
                Sign in
              </Link>

              <Link
                to="/contact"
                className="text-sm text-white/50 hover:text-[#9ee6bd] transition"
              >
                Support
              </Link>

            </div>

          </div>

          <div className="pt-1">

            <h3 className="text-sm font-semibold">
              Contact
            </h3>

            <div className="mt-5 flex flex-col gap-3.5">

              <div className="flex items-center gap-3">

                <Mail
                  size={16}
                  className="text-[#9ee6bd] shrink-0"
                  strokeWidth={1.8}
                />

                <span className="text-sm text-white/50">
                  support@careflow.com
                </span>

              </div>

              <div className="flex items-center gap-3">

                <Phone
                  size={16}
                  className="text-[#9ee6bd] shrink-0"
                  strokeWidth={1.8}
                />

                <span className="text-sm text-white/50">
                  +254 700 000 000
                </span>

              </div>

              <div className="flex items-center gap-3">

                <MapPin
                  size={16}
                  className="text-[#9ee6bd] shrink-0"
                  strokeWidth={1.8}
                />

                <span className="text-sm text-white/50">
                  Nairobi, Kenya
                </span>

              </div>

            </div>

          </div>

        </div>

        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">

          <p className="text-xs text-white/35">
            &copy; {new Date().getFullYear()} CareFlow. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-xs text-white/35">

            <HeartPulse
              size={14}
              className="text-[#9ee6bd]"
              strokeWidth={1.8}
            />

            Better care. Better flow.

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;