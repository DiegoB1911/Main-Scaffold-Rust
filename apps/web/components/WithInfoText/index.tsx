"use client";

import type React from "react";
import { useState } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import "./styles.scss";

interface WithInfoTextProps {
  children: React.ReactNode;
  infoText: string;
  className?: string;
  infoClassName?: string;
}

export const WithInfoText = ({
  children,
  infoText,
  className,
  infoClassName,
}: WithInfoTextProps) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className={cn("with-info-text-container relative", className)}>
      {children}
      <div
        className="info-icon-container"
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
        onFocus={() => setShowInfo(true)}
        onBlur={() => setShowInfo(false)}
      >
        <Info className="info-icon" size={16} />
      </div>
      {showInfo && (
        <div className={cn("info-text", infoClassName)}>{infoText}</div>
      )}
    </div>
  );
};

export default WithInfoText;
