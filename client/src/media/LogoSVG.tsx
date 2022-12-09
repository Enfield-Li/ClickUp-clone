type Props = {};

export default function LogoSVG({}: Props) {
  return (
    <svg width="130" height="155" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient x1="0%" y1="68.01%" y2="68.01%" id="a">
          <stop stop-color="#8930FD" offset="0%" />
          <stop stop-color="#49CCF9" offset="100%" />
        </linearGradient>
        <linearGradient x1="0%" y1="68.01%" y2="68.01%" id="b">
          <stop stop-color="#FF02F0" offset="0%" />
          <stop stop-color="#FFC800" offset="100%" />
        </linearGradient>
      </defs>
      <g fill-rule="nonzero" fill="none">
        <path
          d="M.4 119.12l23.81-18.24C36.86 117.39 50.3 125 65.26 125c14.88 0 27.94-7.52 40.02-23.9l24.15 17.8C112 142.52 90.34 155 65.26 155c-25 0-46.87-12.4-64.86-35.88z"
          fill="url(#a)"
        />
        <path
          fill="url(#b)"
          d="M65.18 39.84L22.8 76.36 3.21 53.64 65.27.16l61.57 53.52-19.68 22.64z"
        />
      </g>
    </svg>
  );
}
