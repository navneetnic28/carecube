import { Link } from "react-router-dom";
import Logo from "../components/Logo";

function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Logo size="sm" />
            <p className="mt-2 text-sm text-gray-500">
              Book doctor appointments, skip the wait. Search, book, and track your queue token
              in real time.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800">Platform</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li>
                <Link to="/" className="hover:text-blue-600">
                  Find a Doctor
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-blue-600">
                  Register as Patient
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-blue-600">
                  Register as Doctor
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-blue-600">
                  Register your Centre
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li className="hover:text-blue-600">About Us</li>
              <li className="hover:text-blue-600">Contact</li>
              <li className="hover:text-blue-600">Privacy Policy</li>
              <li className="hover:text-blue-600">Terms of Service</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li>support@carecube.app</li>
              <li>+91 90000 00000</li>
              <li>Patna, Bihar, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} CareCube. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
