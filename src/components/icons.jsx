// lucide-style inline icons — не тянуть lucide-react ради трёх стрелок
export const ArrowUpRight = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M7 17 17 7" /><path d="M7 7h10v10" />
  </svg>
)
export const Check = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
)
export const Asterisk = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2v20M4 6l16 12M20 6 4 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" />
  </svg>
)

// Ниже — иконки, выкачанные из фреймов Veritas в Figma (логотип, bookmark, eye-off)
export const VeritasLogo = (props) => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M34.6667 0H5.33333C2.38781 0 0 2.38781 0 5.33333V34.6667C0 37.6122 2.38781 40 5.33333 40H34.6667C37.6122 40 40 37.6122 40 34.6667V5.33333C40 2.38781 37.6122 0 34.6667 0Z" fill="#720A18" />
    <path d="M4.16931 11.5419C4.01197 10.2258 4.95051 9.02443 6.26557 8.85859L19.0515 7.24605C20.3666 7.08019 21.5602 8.01267 21.7175 9.32877L24.2601 30.5981C24.4174 31.9144 23.4789 33.1157 22.1638 33.2816L9.37784 34.8941C8.06277 35.06 6.86917 34.1275 6.71184 32.8115L4.16931 11.5419Z" fill="white" />
    <path d="M7.30955 13.9471L7.3412 14.2119L19.04 12.7365L19.0084 12.4717L18.9767 12.2069L7.27792 13.6823L7.30955 13.9471Z" fill="#ADADAD" />
    <path d="M7.74061 17.552L7.77227 17.8168L19.4711 16.3414L19.4394 16.0766L19.4078 15.8118L7.70896 17.2873L7.74061 17.552Z" fill="#ADADAD" />
    <path d="M8.17147 21.157L8.20312 21.4217L19.9019 19.9463L19.8703 19.6815L19.8386 19.4167L8.13981 20.8922L8.17147 21.157Z" fill="#ADADAD" />
    <g filter="url(#veritas-book-shadow)">
      <path d="M17.6595 8.53723C17.7046 7.21251 18.8149 6.17715 20.1395 6.22464L33.0117 6.68637C34.3365 6.73387 35.3739 7.84629 35.3288 9.17101L34.6005 30.5888C34.5555 31.9136 33.4453 32.9491 32.1205 32.9013L19.2483 32.4397C17.9237 32.3923 16.8863 31.2797 16.9314 29.9552L17.6595 8.53723Z" fill="white" />
    </g>
    <path d="M31.4992 8.07275L32.0085 9.56131L33.4584 10.1732L31.9707 10.6797L31.3613 12.1281L30.852 10.6395L29.4024 10.0277L30.8901 9.5212L31.4992 8.07275Z" fill="#720A18" />
    <path d="M22.2862 8.26667L20.4153 18.7591H16L22.2862 8.26667Z" fill="#720A18" />
    <path d="M17.9645 29.2515L19.8355 18.7591H24.2507L17.9645 29.2515Z" fill="#720A18" />
    <defs>
      <filter id="veritas-book-shadow" x="9.92995" y="6.22307" width="26.4003" height="34.6798" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dx="-3" dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_8" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_8" result="shape" />
      </filter>
    </defs>
  </svg>
)

export const Bookmark = (props) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M11.3337 2C11.6874 2 12.0266 2.14048 12.2766 2.39053C12.5267 2.64058 12.6672 2.97973 12.6672 3.33336V13.3335C12.6672 13.4503 12.6365 13.565 12.5782 13.6661C12.5199 13.7673 12.4361 13.8514 12.3351 13.91C12.2341 13.9686 12.1195 13.9996 12.0027 14C11.886 14.0004 11.7711 13.9701 11.6698 13.9122L8.66141 12.1935C8.45997 12.0785 8.23199 12.0179 8 12.0179C7.76801 12.0179 7.54003 12.0785 7.33859 12.1935L4.33025 13.9122C4.22886 13.9701 4.11405 14.0004 3.99729 14C3.88053 13.9996 3.76592 13.9686 3.66493 13.91C3.56394 13.8514 3.48011 13.7673 3.42182 13.6661C3.36354 13.565 3.33284 13.4503 3.3328 13.3335V3.33336C3.3328 2.97973 3.47329 2.64058 3.72337 2.39053C3.97345 2.14048 4.31262 2 4.66629 2H11.3337Z" strokeWidth="1.6" strokeLinecap="round" stroke="#720A18" />
  </svg>
)

export const EyeOff = (props) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#veritas-eye-off-clip)">
      <path d="M8.05009 3.80694C9.7971 3.59873 11.5642 3.96807 13.0817 4.85856C14.5991 5.74906 15.7834 7.11176 16.4537 8.73859C16.5162 8.90699 16.5162 9.09223 16.4537 9.26063C16.1781 9.92893 15.8138 10.5571 15.3707 11.1283M10.5631 10.6186C10.1388 11.0285 9.57041 11.2553 8.98048 11.2502C8.39054 11.2451 7.82622 11.0084 7.40906 10.5912C6.9919 10.174 6.75527 9.60966 6.75014 9.01967C6.74502 8.42967 6.9718 7.86128 7.38165 7.43689M13.1089 13.1244C12.114 13.7138 11.004 14.0823 9.85418 14.2048C8.70437 14.3273 7.54166 14.2011 6.44493 13.8346C5.34821 13.4682 4.34313 12.8701 3.49791 12.0809C2.65268 11.2917 1.98709 10.33 1.54628 9.26086C1.48377 9.09246 1.48377 8.90722 1.54628 8.73882C2.21124 7.12608 3.38126 5.77252 4.88073 4.88126M1.50013 1.4994L16.4999 16.5006" strokeWidth="1.6" strokeLinecap="round" stroke="#85857D" />
    </g>
    <defs>
      <clipPath id="veritas-eye-off-clip">
        <rect width="18" height="18" fill="white" />
      </clipPath>
    </defs>
  </svg>
)
