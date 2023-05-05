import { AuthStateType } from "../stores/useAuth";
import { login } from "./networkCalls";

export function autoLogin(authState: AuthStateType) {
  login({ email: "user1@gmail.com", password: "user1user1" }, (res) => {
    authState.loginUser(res);
  });
}
