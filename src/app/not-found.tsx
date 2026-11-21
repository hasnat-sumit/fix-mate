import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { PublicFooter } from "@/components/public-footer";
import { PublicNavbar } from "@/components/public-navbar";
import { NotFoundIllustration } from "@/components/repair-illustration";
import { StatusMessage } from "@/components/status-message";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <PublicNavbar />
      <main id="main-content">
        <StatusMessage
          icon={Compass}
          illustration={<NotFoundIllustration className="w-full max-w-[340px]" />}
          eyebrow="Error 404"
          title="This page needs a repair."
          description="The page you’re looking for doesn’t exist or may have moved. Our technicians fix devices, not URLs, so let’s get you back on track."
          actions={
            <>
              <Button asChild className="h-12 rounded-xl px-6">
                <Link href="/">
                  <ArrowLeft aria-hidden="true" className="size-4" /> Back to Home
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-xl px-6">
                <Link href="/services">Browse services</Link>
              </Button>
            </>
          }
        />
      </main>
      <PublicFooter />
    </>
  );
}
