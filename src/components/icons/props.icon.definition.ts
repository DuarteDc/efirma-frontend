import type { ReactNode } from "react";
interface PropsIconDefinition {
  width?: number;
  height?: number;
  props?: unknown;
  className?: string;
  fill?: string;
}

export type Icon = ({ width, height }: PropsIconDefinition) => ReactNode;
