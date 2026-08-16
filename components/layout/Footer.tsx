import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t-2 border-gold bg-neutral-900 text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-white">
              Bella <span className="text-gold">Cucina</span>
            </h3>
            <p className="mt-2 text-sm text-neutral-400">
              Authentic Italian dining, made fresh every day.
            </p>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gold">
              Hours
            </h4>
            <ul className="mt-3 space-y-1 text-sm text-neutral-400">
              <li>Mon–Thu: 11am – 9pm</li>
              <li>Fri–Sat: 11am – 10pm</li>
              <li>Sunday: 12pm – 8pm</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gold">
              Contact
            </h4>
            <ul className="mt-3 space-y-1 text-sm text-neutral-400">
              <li>123 Main Street, Your City</li>
              <li>(555) 123-4567</li>
              <li>hello@bellacucina.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-6 text-sm text-neutral-500 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Bella Cucina. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/about" className="transition-colors hover:text-gold">
              About
            </Link>
            <Link href="/contact" className="transition-colors hover:text-gold">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}