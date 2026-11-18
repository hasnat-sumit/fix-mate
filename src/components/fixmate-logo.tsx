import Image from "next/image";
import Link from "next/link";

type FixMateLogoProps = {
  light?: boolean;
};

export function FixMateLogo({ light = false }: FixMateLogoProps) {
  return (
    <Link
      href="/"
      className="inline-flex shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
      aria-label="FixMate home"
    >
      {light ? (
        <Image
          src="/images/fixmate-logo-dark.svg"
          alt=""
          width={260}
          height={58}
          className="h-11 w-auto"
        />
      ) : (
        <>
          <Image
            src="/images/fixmate-logo.svg"
            alt=""
            width={260}
            height={58}
            className="h-11 w-auto dark:hidden"
          />
          <Image
            src="/images/fixmate-logo-dark.svg"
            alt=""
            width={260}
            height={58}
            className="hidden h-11 w-auto dark:block"
          />
        </>
      )}
    </Link>
  );
}
