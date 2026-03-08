import { FiBell, FiLock, FiTag, FiUser } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

const items = [
  { key: "profile", label: "Profile", icon: FiUser, path: "/settings/profile" },
  { key: "categories", label: "Categories", icon: FiTag, path: "/settings/categories" },
  {
    key: "notifications",
    label: "Notifications",
    icon: FiBell,
    path: "/settings/notifications",
  },
  { key: "security", label: "Security", icon: FiLock, path: "/settings/security" },
];

function isActive(pathname, itemPath) {
  if (itemPath === "/settings/profile") {
    // If the user lands on /settings (redirect), treat the first tab as profile
    return pathname === "/settings" || pathname.startsWith(itemPath);
  }

  return pathname.startsWith(itemPath);
}

function SettingsMenu() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <section className="settings-menu">
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(pathname, item.path);

        return (
          <button
            key={item.key}
            type="button"
            className={`settings-menu-item ${active ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <Icon /> {item.label}
          </button>
        );
      })}
    </section>
  );
}

export default SettingsMenu;
