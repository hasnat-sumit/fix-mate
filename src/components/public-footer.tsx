import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/container";
import { FixMateLogo } from "@/components/fixmate-logo";
import { FacebookLogo, InstagramLogo, LinkedInLogo, XLogo } from "@/components/social-icons";
import { categoryHref } from "@/data/service-categories";

// Demo contact details and social profiles: replace with the project's real ones before going live.
const contact = {
  email: "support@fixmate.demo",
  phone: "+880 1700-000000",
  address: "House 12, Road 7, Dhanmondi, Dhaka 1205",
};

const socialLinks = [
  { label: "FixMate on X", href: "https://x.com/", Icon: XLogo },
  { label: "FixMate on Facebook", href: "https://www.facebook.com/", Icon: FacebookLogo },
  { label: "FixMate on LinkedIn", href: "https://www.linkedin.com/", Icon: LinkedInLogo },
  { label: "FixMate on Instagram", href: "https://www.instagram.com/", Icon: InstagramLogo },
];

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "How It Works", href: "/#how-it-works" },
];

const popularCategories = (["Smartphone", "Laptop & PC", "AC", "Refrigerator", "Washing Machine", "Electrical"] as const).map((name) => ({
  label: name,
  href: categoryHref(name),
}));

const linkClass = "text-sm text-white/75 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded";

function LinkColumn({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  return (
    <nav aria-label={heading}>
      <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-white/45">{heading}</h2>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className={linkClass}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function PublicFooter() {
  return (
    <footer id="footer" className="bg-footer text-white">
      <Container className="py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1.3fr] lg:gap-10">
          <div className="max-w-sm">
            <FixMateLogo light />
            <p className="mt-5 max-w-[300px] text-sm leading-6 text-white/65">
              Repair with confidence. Verified technicians for your devices and home appliances, with every job tracked and paid only after it’s done.
            </p>
            <ul className="mt-6 flex items-center gap-2.5" aria-label="Social media">
              {socialLinks.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="flex size-10 items-center justify-center rounded-full border border-white/15 text-white/75 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <Icon className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <LinkColumn heading="Quick links" links={quickLinks} />
          <LinkColumn heading="Popular categories" links={popularCategories} />

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-white/45">Contact</h2>
            <address className="mt-5 space-y-3.5 text-sm not-italic text-white/75">
              <a href={`mailto:${contact.email}`} className={`flex items-center gap-3 ${linkClass}`}>
                <Mail aria-hidden="true" className="size-4 shrink-0 text-hero-highlight" /> {contact.email}
              </a>
              <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className={`flex items-center gap-3 ${linkClass}`}>
                <Phone aria-hidden="true" className="size-4 shrink-0 text-hero-highlight" /> {contact.phone}
              </a>
              <p className="flex items-start gap-3">
                <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-hero-highlight" /> {contact.address}
              </p>
            </address>
            <Link href="/sign-up?role=technician" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-hero-highlight hover:text-white">
              Become a FixMate technician <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 FixMate. All rights reserved.</p>
          <p>Fix it right. Pay after it’s done.</p>
        </div>
      </Container>
    </footer>
  );
}
