import style from "./index.module.scss";

type SvgIconProps = {
  prefix?: string;
  width?: number;
  height?: number;
  color?: string;
  name?: string;
};

const SvgIcon = (props: SvgIconProps) => {
  const { prefix = "icon", width = 24, height = 24, color, name } = props;
  const symbolId = `#${prefix}-${name}`;

  return (
    <svg className={style.svgIcon} width={width} height={height} fill={color}>
      <use href={symbolId} fill={color} />
    </svg>
  );
};

export default SvgIcon;
