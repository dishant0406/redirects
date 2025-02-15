import Image from 'next/image';

type Props = {
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
};

const Logo = ({ width = 50, height = 50, className, onClick, style }: Props) => {
  return (
    <Image
      alt={'Redirect Logo'}
      className={className}
      height={height}
      src={'/Logo.png'}
      style={style}
      width={width}
      onClick={onClick}
    />
  );
};

export default Logo;
