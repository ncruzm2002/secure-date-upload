import { useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import { MainForm } from "@/components/MainForm";

interface User {
  username: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (credentials: { username: string; password: string }) => {
    setIsLoading(true);
    setLoginError("");

    try {
      // Simular autenticación
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Validación simple (en producción esto sería contra un servidor)
      if (credentials.username === "admin" && credentials.password === "1234") {
        setUser({ username: credentials.username });
      } else {
        setLoginError("Credenciales incorrectas. Usa admin/1234 para acceder.");
      }
    } catch (error) {
      setLoginError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setLoginError("");
  };

  if (user) {
    return <MainForm onLogout={handleLogout} username={user.username} />;
  }

  return (
    <LoginForm 
      onLogin={handleLogin} 
      error={loginError} 
      isLoading={isLoading} 
    />
  );
};

export default Index;
