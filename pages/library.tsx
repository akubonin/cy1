import { useAuthStore } from "../stores/authStore";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import TrackUpload from "../components/TrackUpload";
import LibraryTable from "../components/LibraryTable";

const Library: React.FC = () => {
  const { ACCESS_TOKEN } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!ACCESS_TOKEN) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [ACCESS_TOKEN, router]);

  return (
    <Container>
      <h1>Library</h1>
      <TrackUpload />
      <LibraryTable />
    </Container>
  );
};

export default Library;