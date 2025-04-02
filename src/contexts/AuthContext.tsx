
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Define role types based on your application requirements
export type UserRole = "sysadmin" | "admin" | "employee" | "customer";

// User interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  storeId?: string; // Optional - only admins and employees would have a store ID
}

// Mock user data for development (will be replaced with Supabase auth)
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "sysadmin@example.com",
    firstName: "System",
    lastName: "Admin",
    role: "sysadmin",
  },
  {
    id: "2",
    email: "admin@example.com",
    firstName: "Store",
    lastName: "Admin",
    role: "admin",
    storeId: "store-1",
  },
  {
    id: "3",
    email: "employee@example.com",
    firstName: "Store",
    lastName: "Employee",
    role: "employee",
    storeId: "store-1",
  },
];

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
  hasRole: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is authenticated on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // In a real application, you would use Supabase auth here
      // For now, we'll simulate a login with mock data
      const mockUser = MOCK_USERS.find(u => u.email === email);
      
      if (mockUser && password === "password") {
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
        
        // Navigate based on role
        switch (mockUser.role) {
          case "sysadmin":
            navigate("/sysadmin");
            break;
          case "admin":
            navigate("/admin");
            break;
          case "employee":
            navigate("/employee");
            break;
          default:
            navigate("/");
        }
        
        toast.success(`Welcome back, ${mockUser.firstName}!`);
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
    toast.info("You have been logged out");
  };

  // Helper function to check if user has a specific role or one of multiple roles
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    
    return user.role === roles;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
