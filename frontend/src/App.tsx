import "./App.css";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { LoadingOutlined } from "@ant-design/icons";

import { auth, signIn } from "./firebase";
import AppLogged from "./AppLogged";

type UserState =
  | { type: "unknown" }
  | { type: "out" }
  | { type: "in"; user: User };

const userStateIs = <T extends UserState["type"]>(
  userState: UserState,
  type: T
): userState is Extract<UserState, { type: T }> => userState.type === type;

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserState>({
    type: "unknown",
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      const userState =
        user === null
          ? ({ type: "out" } as const)
          : ({ type: "in", user } as const);
      setCurrentUser(userState);
    });
  }, [onAuthStateChanged]);

  const onLoginClick = () => signIn();
  const onLogout = () => auth.signOut();

  return (
    <main>
      {userStateIs(currentUser, "unknown") && <LoadingOutlined />}

      {userStateIs(currentUser, "out") && (
        <button className="btn" onClick={() => onLoginClick()}>
          Login
        </button>
      )}

      {userStateIs(currentUser, "in") && (
        <AppLogged user={currentUser.user} onLogout={onLogout} />
      )}
    </main>
  );
}
