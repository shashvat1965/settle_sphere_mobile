import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"
const SolanaLogo = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={25}
    fill="none"
    {...props}
  >
    <Path
      fill="#232323"
      d="M12.262 0h.02c6.684 0 12.105 5.279 12.105 11.788v.656c0 6.51-5.42 11.789-12.106 11.789h-.02c-6.684 0-12.105-5.28-12.105-11.789v-.656C.156 5.278 5.577 0 12.262 0Z"
    />
    <Path
      fill="url(#a)"
      d="M17.45 9.12a.358.358 0 0 1-.144.096.427.427 0 0 1-.173.034H5.909c-.396 0-.6-.482-.322-.772l1.844-1.906a.403.403 0 0 1 .148-.101.427.427 0 0 1 .174-.034H19.02c.401 0 .6.487.317.777L17.45 9.12Zm0 8.521a.457.457 0 0 1-.317.13H5.909c-.396 0-.6-.472-.322-.752l1.844-1.863a.374.374 0 0 1 .148-.096.426.426 0 0 1 .174-.034H19.02c.401 0 .6.478.317.758L17.45 17.64Zm0-6.78a.457.457 0 0 0-.317-.13H5.909c-.396 0-.6.473-.322.753l1.844 1.863c.04.043.094.077.148.096a.428.428 0 0 0 .174.034H19.02c.401 0 .6-.478.317-.758l-1.888-1.857Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={6.316}
        x2={18.259}
        y1={17.913}
        y2={5.972}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#CF41E8" />
        <Stop offset={1} stopColor="#10F2B0" />
      </LinearGradient>
    </Defs>
  </Svg>
)
export default SolanaLogo
