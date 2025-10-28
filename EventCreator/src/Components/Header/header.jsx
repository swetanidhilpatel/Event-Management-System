import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import Avtar from "../utils/Avtar";

const Header = () => {
  const [open, setOpen] = useState(false); // Hamburger menu state
  const [dropdownOpen, setDropdownOpen] = useState(false); // Avatar dropdown state
  const navigate = useNavigate();
  const [avtarData, setAvtarData] = useState({
    firstname: "",
    lastname: "",
  });
  const [isAdmin, setIsAdmin] = useState(false); // Admin state
  axios.defaults.withCredentials = true;

  const token = localStorage.getItem("token");

  // Fetch user data
  useEffect(() => {
    if (token) {
      axios
        .get("https://event-creator-backend.vercel.app/api/v1/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const user = response.data.user;
          setAvtarData({
            lastname: user.lastname,
            firstname: user.firstname,
          });
          setIsAdmin(user.isAdmin); // Check if the user is an admin
        })
        .catch((error) => console.log(error.message));
    }
  }, [token]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    navigate("/login"); // Redirect to login page
  };

  // Toggle the avatar dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="w-full font-['open_sans'] z-20 md:bg-zinc-100 fixed md:px-6 lg:px-[53px]">
      <div className="text-center max-w-screen-xl m-auto bg-[#F4F4F5] pt-4 sm:px-4 md:px-1 py-2 px-5 md:flex justify-between">
        <NavLink to="/" className="pt-2 text-2xl font-semibold">
          <h1 className="text-orange-400 text-start">Indian Events</h1>
        </NavLink>

        {/* Hamburger Menu */}
        <div className="md:hidden flex items-center justify-center gap-2 absolute top-4 right-6 cursor-pointer">
          {token && (
            <div className="relative">
              <div onClick={toggleDropdown}>
                <Avtar
                  firstname={avtarData.firstname}
                  lastname={avtarData.lastname}
                />
              </div>
              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
                  <ul className="py-1">
                    <li
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
          <div onClick={() => setOpen(!open)}>
            {open ? (
              <IoMdClose size={"1.8rem"} />
            ) : (
              <GiHamburgerMenu size={"1.8rem"} />
            )}
          </div>
        </div>

        {/* Navlinks */}
        <div
          className={`flex md:flex-row sm:mt-0 md:items-center z-[-1] md:z-auto w-full md:w-max left-0 bg-zinc-100 absolute md:static gap-5 flex-col transition-all duration-500 ease-in ${
            open ? "top-[55px] " : "top-[-490px]"
          }`}
        >
          {[
            { text: "Home", path: "/" },
            { text: "Contact", path: "/contact" },
            { text: "Book Now", path: "/booknow" },
          ].map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => setOpen(!open)}
              className={({ isActive }) => {
                return `md:text-md text-base text-center md:text-left font-bold tracking-tight font-['open_sans'] ${
                  isActive ? "text-orange-400" : "text-zinc-900"
                } hover:text-white hover:bg-orange-400 px-2 py-2`;
              }}
            >
              {item.text}
            </NavLink>
          ))}

          {/* Participant List visible only to admin */}
          {isAdmin && (
            <NavLink
              to="/participants"
              onClick={() => setOpen(!open)}
              className="md:text-md text-base text-center md:text-left font-bold tracking-tight font-['open_sans'] text-zinc-900 hover:text-white hover:bg-orange-400 px-2 py-2"
            >
              Participant List
            </NavLink>
          )}

          {/* Ticket Scanner visible only to admin */}
          {isAdmin && (
            <NavLink
              to="/adminscannedtickets"
              onClick={() => setOpen(!open)}
              className="md:text-md text-base text-center md:text-left font-bold tracking-tight font-['open_sans'] text-zinc-900 hover:text-white hover:bg-orange-400 px-2 py-2"
            >
              Scanned Tickets
            </NavLink>
          )}

          <div className="text-center text-md font-medium pt-1 pb-2 md:mb-0 md:text-left">
            {token ? (
              <div className="hidden md:block relative">
                <div onClick={toggleDropdown} className="cursor-pointer">
                  <Avtar
                    firstname={avtarData.firstname}
                    lastname={avtarData.lastname}
                  />
                </div>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
                    <ul className="py-1">
                      <li
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
                        onClick={handleLogout}
                      >
                        Logout
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="md:px-6 md:py-2 px-3 py-1 w-max h-min font-['open_sans'] text-white bg-orange-400 rounded hover:bg-white border border-orange-500 hover:text-orange-400"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
