import { useState } from "react";
import { useRouter } from "next/router";
import { Container, Form, Button } from "react-bootstrap";
import { useAuthStore } from "../stores/authStore";


const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleLogin = (): void => {
    // Handle login logic here
    if (email === process.env.NEXT_PUBLIC_LOGIN && password === process.env.NEXT_PUBLIC_PASSWORD) {
      const SECRET = process.env.NEXT_PUBLIC_SECRET || "";
      const ACCESS_TOKEN = process.env.NEXT_PUBLIC_ACCESS_TOKEN || "";
      setAuth(SECRET, ACCESS_TOKEN);
      router.push("/library"); // Redirect to library page after successful login
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <Container>
      <h1>Login</h1>
      <Form>
        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" onClick={handleLogin}>
          Login
        </Button>
      </Form>
    </Container>
  );
}

export default Login;
