import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@stellar/design-system";

import { Routes } from "@/constants/routes";
import { NextLink } from "@/components/NextLink";

type NavLink = {
  href: Routes | string;
  label: string;
  icon?: ReactNode;
};

const primaryNavLinks: NavLink[] = [
  {
    href: Routes.ROOT,
    label: "Introduction",
  },
  {
    href: Routes.VIEW_XDR,
    label: "View XDR",
  },
  {
    href: Routes.ACCOUNT_CREATE,
    label: "Account",
  },
  {
    href: Routes.BUILD_TRANSACTION,
    label: "Transactions",
  },
  {
    href: Routes.ENDPOINTS,
    label: "API Explorer",
  },
  {
    href: Routes.SMART_CONTRACTS_CONTRACT_EXPLORER,
    label: "Smart Contracts",
  },
  {
    href: "https://developers.stellar.org/",
    label: "View Docs",
    icon: <Icon.LinkExternal01 />,
  },
];

export const MainNav = ({ excludeDocs }: { excludeDocs?: boolean }) => {
  const pathname = usePathname();

  const isActiveRoute = (link: string) => {
    if (link.startsWith("http")) {
      return false;
    }

    return pathname?.split("/")[1] === link.split("/")[1];
  };

  const NavItem = ({ link }: { link: NavLink }) => (
    <NextLink
      href={link.href}
      className={`NavLink ${isActiveRoute(link.href) ? "NavLink--active" : ""}`}
    >
      {link.label}

      {link.icon ? <span className="NavLink__icon">{link.icon}</span> : null}
    </NextLink>
  );

  const links = excludeDocs
    ? primaryNavLinks.filter((l) => l.label !== "View Docs")
    : primaryNavLinks;

  return (
    <nav className="LabLayout__header__nav">
      <div className="LabLayout__header__nav--primary">
        {links.map((l) => (
          <NavItem key={l.href} link={l} />
        ))}
      </div>
    </nav>
  );
};
