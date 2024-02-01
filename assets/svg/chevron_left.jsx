import * as React from "react"
import Svg, { Path } from "react-native-svg"
const ChevronLeft = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={27}
    fill="none"
    {...props}
  >
    <Path
      fill="#fff"
      d="M.532 12.263a1.75 1.75 0 0 0 0 2.474L11.67 25.874a1.75 1.75 0 0 0 2.475-2.474l-9.9-9.9 9.9-9.9a1.75 1.75 0 0 0-2.475-2.474L.532 12.263Zm4.697-.513H1.77v3.5h3.46v-3.5Z"
    />
  </Svg>
)
export default ChevronLeft
