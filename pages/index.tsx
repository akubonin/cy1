import { useAuthStore } from "../stores/authStore";
import { useEffect } from "react";
import { useRouter } from "next/router";

const HomePage: React.FC = () => {
  const { ACCESS_TOKEN } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (ACCESS_TOKEN) {
      router.push("/library"); // Redirect to library page if authenticated
    } else {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [ACCESS_TOKEN, router]);

  return null;
};

export default HomePage;