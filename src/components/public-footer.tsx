import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, Camera, MessageCircle } from "lucide-react";
import { Container } from "@/components/container";
import { FixMateLogo } from "@/components/fixmate-logo";

const footerLinks = {
  Explore: [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#categories" },
    { label: "How it works", href: "#how-it-works" },
  ],
  Services: [
    { label: "Phones & computers", href: "#categories" },
    { label: "Home appliances", href: "#categories" },
    { label: "Home services", href: "#categories" },
  ],
};

const socialPlaceholders = [
  { label: "Community updates — coming soon", Icon: MessageCircle },
  { label: "Photo updates — coming soon", Icon: Camera },
  { label: "Professional network — coming soon", Icon: BriefcaseBusiness },
];

export function PublicFooter() {
  return (
    <footer id="footer" className="bg-footer text-white">
      <Container className="py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-10">
          <div className="max-w-sm">
            <FixMateLogo light />
            <p className="mt-5 max-w-[280px] text-sm leading-6 text-white/65">Repair with Confidence. A little more care for the devices and appliances you rely on every day.</p>
            <div className="mt-6 flex items-center gap-2.5">
              {socialPlaceholders.map(({ label, Icon }) => (
                <span key={label} aria-label={label} title={label} className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/65">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-white/45">{heading}</h2>
              <ul className="mt-5 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-white/75 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-white/45">Get in touch</h2>
            <p className="mt-5 text-sm font-semibold text-white/85">We’re building a better repair experience.</p>
            <p className="mt-2 text-sm leading-6 text-white/55">Contact details will be available soon.</p>
            <Link href="#technicians" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-hero-highlight hover:text-white">
              Join our network <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 FixMate. All rights reserved.</p>
          <p>Thoughtful repairs. Done right.</p>
        </div>
      </Container>
    </footer>
  );
}
