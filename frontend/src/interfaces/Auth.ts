export interface AuthContextProps {
  user: any;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}