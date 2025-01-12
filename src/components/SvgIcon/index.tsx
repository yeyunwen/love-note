import styles from "./index.module.scss";
import { type BasicComponent, ComponentDefaults } from "@/utils/components";
import clsx from "clsx";

interface SvgIconProps extends BasicComponent {
  prefix?: string;
  width?: number;
  height?: number;
  color?: string;
  name?: string;
}

const defaultSvgIconProps: SvgIconProps = {
  ...ComponentDefaults,
  prefix: "icon",
  width: 24,
  height: 24,
};

const SvgIcon = (props: SvgIconProps) => {
  const {
    prefix = "icon",
    width = 24,
    height = 24,
    color,
    name,
    className,
    style,
  } = {
    ...defaultSvgIconProps,
    ...props,
  };
  const symbolId = `#${prefix}-${name}`;

  return (
    <svg
      className={clsx(styles.svgIcon, className)}
      width={width}
      height={height}
      fill={color}
      style={style}
    >
      <use href={symbolId} fill={color} />
    </svg>
  );
};

export default SvgIcon;
