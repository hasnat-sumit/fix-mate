import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { PublicFooter } from "@/components/public-footer";
import { PublicNavbar } from "@/components/public-navbar";
import { StatusMessage } from "@/components/status-message";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <PublicNavbar />
      <main id="main-content">
        <StatusMessage
          icon={Compass}
          eyebrow="Error 404"
          title="This page took a wrong turn."
          description="The page you’re looking for doesn’t exist or may have moved. Let’s get you back on track."
          actions={
            <>
              <Button asChild className="h-12 rounded-xl px-6">
                <Link href="/">
                  <ArrowLeft aria-hidden="true" className="size-4" /> Back to homepage
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
