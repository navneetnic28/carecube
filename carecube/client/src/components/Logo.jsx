import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import logoIcon from "../assets/logo-icon.png";

const HEIGHTS = { sm: "h-8", md: "h-11", lg: "h-14" };

// CareCube brand logo — always links to the home page.
// variant "full" = cube + wordmark, "icon" = cube only.
function Logo({ size = "md", variant = "full", className = "" }) {
  return (
    <Link to="/" aria-label="CareCube home" className={`inline-block ${className}`}>
      <img
        src={variant === "icon" ? logoIcon : logo}
        alt="CareCube — Your Health, Our Priority"
        className={`${HEIGHTS[size]} w-auto`}
      />
    </Link>
  );
}

export default Logo;
