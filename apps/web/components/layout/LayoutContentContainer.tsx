"use client";

import type React from "react";
import { Card } from "@stellar/design-system";
import { PageHeader } from "@/components/layout/PageHeader";

interface LayoutContentContainerProps {
  children: React.ReactNode;
}

export const LayoutContentContainer = ({ children }: LayoutContentContainerProps) => {
  return (
    <div className="container mx-auto py-8 px-4">
      {children}
    </div>
  );
}

export const PageCard = ({
  heading,
  headingInfoLink,
  headingAs = "h1",
  children,
  rightElement,
}: {
  heading?: React.ReactNode;
  headingInfoLink?: string;
  headingAs?: "h1" | "h2";
  children: React.ReactNode;
  rightElement?: React.ReactNode;
}) => (
  <Card>
    <div className="PageBody">
      {heading || rightElement ? (
        <PageHeader
          heading={heading}
          headingInfoLink={headingInfoLink}
          rightElement={rightElement}
          as={headingAs}
        />
      ) : null}

      {children}
    </div>
  </Card>
);
