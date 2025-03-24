import { type JSXElementConstructor, type ReactElement, type ReactNode, type ReactPortal, useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Icon,
  IconButton,
  ProjectLogo,
  Select,
  ThemeSwitch,
} from "@stellar/design-system";
import { useStore } from "@/store/useStore";

import { MainNav } from "@/components/MainNav";
import { WindowContext } from "@/components/layout/LayoutContextProvider";
import { NetworkSelector } from "@/components/layout/NetworkSelector";
import { Hydration } from "@/components/Hydration";
import { Box } from "@/components/layout/Box";
import { FloaterDropdown } from "@/components/FloaterDropdown";
import { ConnectWallet } from "@/components/ConnectWallet";

import { isExternalLink } from "@/helpers/isExternalLink";
import { Routes } from "@/constants/routes";
import { LOCAL_STORAGE_SAVED_THEME } from "@/constants/settings";
import {
  ACCOUNT_NAV_ITEMS,
  ENDPOINTS_NAV_ITEMS,
  SMART_CONTRACTS_NAV_ITEMS,
  TRANSACTION_NAV_ITEMS,
  XDR_NAV_ITEMS,
} from "@/constants/navItems";

const NAV = [
  {
    label: "View XDR",
    subNav: XDR_NAV_ITEMS,
  },
  {
    label: "Account",
    subNav: ACCOUNT_NAV_ITEMS,
  },
  {
    label: "Transactions",
    subNav: TRANSACTION_NAV_ITEMS,
  },
  {
    label: "API Explorer",
    subNav: ENDPOINTS_NAV_ITEMS,
  },
  {
    label: "Smart Contracts",
    subNav: SMART_CONTRACTS_NAV_ITEMS,
  },
];

export const LayoutHeader = () => {
  const { windowWidth } = useContext(WindowContext);
  const { setTheme } = useStore();
  const route = useRouter();
  const pathname = usePathname();

  // Adjusting format to remove nested sub-sections (RPC Methods, for example)
  // We cannot have nested optgroup in select
  const formattedNav = NAV.map((mainNav) => {
    type NavItem = {
      route: Routes;
      label: string;
      nestedItems?: { route: Routes; label: string }[];
    };

    const formatNavItems = (navItems: NavItem[]) => {
      return navItems.map((ni) => ({
        label: ni.label,
        value: ni.route,
      }));
    };

    const hasSubSection = Boolean(
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      mainNav.subNav.find((sn: any) => sn.instruction),
    );

    if (hasSubSection) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const rootItems = mainNav.subNav.filter((sn: any) => !sn.instruction);
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const subSecs = mainNav.subNav.filter((sn: any) => (sn as any).instruction);

      const subItems = subSecs.map((ss: { navItems: { route: Routes; label: string; nestedItems?: { route: Routes; label: string; }[]; }[]; }) => {
        const items = ss.navItems as NavItem[];
        const hasNestedItems = Boolean(items[0]?.nestedItems?.length);

        if (hasNestedItems) {
          const nestedFormatted = items.map((i) => {
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            const nestedItems = formatNavItems(i.nestedItems!);

            return {
              groupTitle: i.label,
              options: nestedItems,
            };
          });

          return [
            {
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              groupTitle: (ss as any).instruction,
              options: [],
            },
            ...nestedFormatted,
          ];
        }

        return [
          {
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            groupTitle: (ss as any).instruction,
            options: formatNavItems(ss.navItems),
          },
        ];
      });

      return [
        {
          groupTitle: mainNav.label,
          options: rootItems
            .map((ri: { navItems: { route: Routes; label: string; nestedItems?: { route: Routes; label: string; }[]; }[]; }) => formatNavItems(ri.navItems))
            // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                        .reduce((r: any, c: any) => [...r, ...c], []),
        },
        // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                ...subItems.reduce((r: any, c: any) => [...r, ...c], []),
      ];
    }

    return [
      {
        groupTitle: mainNav.label,
        options: mainNav.subNav
          .map((sn: { navItems: { route: Routes; label: string; nestedItems?: { route: Routes; label: string; }[]; }[]; }) => formatNavItems(sn.navItems))
          // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    .reduce((r: any, c: any) => [...r, ...c], []),
      },
    ];
  });

  const flattenFormattedNav = formattedNav.reduce(
    // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
    (res, cur) => [...res, ...cur],
    [],
  );

  const handleNavChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    route.push(event.target.value);
  };

  const renderNav = () => {
    return (
      <>
        <option value={Routes.ROOT}>Introduction</option>

        {flattenFormattedNav.map((fn, groupIdx) => (
          <optgroup key={`${fn.groupTitle}-${groupIdx}`} label={fn.groupTitle}>
            {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
            {fn.options.map((op: { value: string | number | readonly string[] | undefined; label: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
              <option key={`${fn.groupTitle}-${op.value}`} value={op.value}>
                {op.label}
              </option>
            ))}
          </optgroup>
        ))}
      </>
    );
  };

  const renderTheme = (isDarkMode: boolean) => {
    const theme = isDarkMode ? "sds-theme-dark" : "sds-theme-light";
    setTheme(theme);
  };

  const renderSettingsDropdown = () => {
    return (
      <FloaterDropdown
        triggerEl={<IconButton icon={<Icon.Menu01 />} altText="Menu" />}
        offset={14}
      >
        <>
          <div className="LabLayout__header__dropdown__item">
            <div className="LabLayout__header__dropdown__item__label">
              <ConnectWallet />
            </div>
          </div>

          <DropdownItem label="Theme">
            <Hydration>
              <ThemeSwitch
                storageKeyId={LOCAL_STORAGE_SAVED_THEME}
                onActionEnd={renderTheme}
              />
            </Hydration>
          </DropdownItem>

          <DropdownItem
            label="View documentation"
            href="https://developers.stellar.org/"
          />

          <DropdownItem
            label="Got product feedback?"
            href="https://github.com/stellar/laboratory/issues"
          />

          <DropdownItem
            label="GitHub"
            href="https://github.com/stellar/laboratory"
          />
        </>
      </FloaterDropdown>
    );
  };

  if (!windowWidth) {
    return null;
  }

  // Mobile
  if (windowWidth < 940) {
    return (
      <div className="LabLayout__header">
        <header className="LabLayout__header__main">
          <Select
            id="mobile-nav"
            fieldSize="md"
            onChange={handleNavChange}
            value={pathname || undefined}
          >
            {renderNav()}
          </Select>

          <Box gap="md" direction="row" align="center">
            <NetworkSelector />
            {renderSettingsDropdown()}
          </Box>
        </header>
      </div>
    );
  }

  // Show hamburger menu
  if (windowWidth < 1230) {
    return (
      <div className="LabLayout__header">
        <header className="LabLayout__header__main">
          <ProjectLogo
            title="Lab"
            link="/"
            customAnchor={<Link href="/" prefetch={true} />}
          />

          <MainNav excludeDocs={true} />

          <div className="LabLayout__header__settings">
            <Box gap="md" direction="row" align="center">
              <NetworkSelector />
              {renderSettingsDropdown()}
            </Box>
          </div>
        </header>
      </div>
    );
  }

  // Desktop
  return (
    <div className="LabLayout__header">
      <header className="LabLayout__header__main">
        <ProjectLogo
          title="Lab"
          link="/"
          customAnchor={<Link href="/" prefetch={true} />}
        />

        <MainNav />

        <div className="LabLayout__header__settings">
          <Hydration>
            <ThemeSwitch
              storageKeyId={LOCAL_STORAGE_SAVED_THEME}
              onActionEnd={renderTheme}
            />
          </Hydration>
          <NetworkSelector />
          <ConnectWallet />
        </div>
      </header>
    </div>
  );
};

const DropdownItem = ({
  label,
  children,
  href,
}: {
  label: React.ReactNode;
  children?: React.ReactNode;
  href?: string;
}) => {
  const renderContent = (content?: React.ReactNode) => {
    const _content = content || children;

    return (
      <>
        <div className="LabLayout__header__dropdown__item__label">{label}</div>
        {_content ? (
          <div className="LabLayout__header__dropdown__item__value">
            {_content}
          </div>
        ) : null}
      </>
    );
  };

  if (href) {
    const isExternal = isExternalLink(href);
    const externalLinkProps = isExternal
      ? { rel: "noreferrer noopener", target: "_blank" }
      : {};

    return (
      <Link
        className="LabLayout__header__dropdown__item LabLayout__header__dropdown__item--link"
        href={href}
        prefetch={true}
        {...externalLinkProps}
      >
        {renderContent(isExternal ? <Icon.LinkExternal01 /> : null)}
      </Link>
    );
  }

  return (
    <div className="LabLayout__header__dropdown__item">{renderContent()}</div>
  );
};
