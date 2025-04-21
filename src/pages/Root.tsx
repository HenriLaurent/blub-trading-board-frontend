import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCurrentUser } from "../api/auth";
import { useTheme } from "../context/ThemeContext";

export default function Root() {
  const { data: user } = useCurrentUser();

  const { theme } = useTheme();

  console.log(theme, "theme");

  return (
    <div className="min-h-screen flex flex-col relative bg-[#ecd4df] dark:bg-slate-800 ">
      <div className="grain"></div>

      <Header user={user} />
      <main className="py-8 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
