export interface AuthContextProps {
  user: any;
  token: string | null;
  login: (token: string, name?: string) => void;
  logout: () => void;
}