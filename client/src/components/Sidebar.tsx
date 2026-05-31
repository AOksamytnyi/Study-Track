import { NavLink } from "react-router-dom";

export function Sidebar() {
  const links = [
    { to: "/dashboard", label: "Dashboard", image: "/dashboard.svg" },
    { to: "/sessions", label: "Sessions", image: "/session.svg" },
  ];

  return (
    <aside className="w-78.5 flex flex-col bg-white text-[#5D7285]">
      <div className="flex flex-col gap-2.5 font-poppins font-semibold text-sm px-8 py-6">
        {links.map((link) => (
          <SidebarLink
            key={link.to}
            to={link.to}
            label={link.label}
            image={link.image}
          />
        ))}
      </div>

      <button className="mt-auto text-sm text-red-500 hover:text-red-700 text-center px-8 py-6">
        Logout
      </button>
    </aside>
  );
}

type SidebarLinkProps = {
  to: string;
  label: string;
  image: string;
};

function SidebarLink({ to, label, image }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex gap-3.5 items-center ${
          isActive ? "text-black font-bold" : "text-gray-600"
        }`
      }>
      <img src={image} alt={label} />
      <span>{label}</span>
    </NavLink>
  );
}
