import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCurrentUser } from "../api/auth";

export default function Root() {
  const { data: user } = useCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={user} />
      <main className="py-8 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
