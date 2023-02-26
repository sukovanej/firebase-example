import { LoadingOutlined, LogoutOutlined } from "@ant-design/icons";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";

import Things from "./Things";
import DeletedThings from "./DeletedThings";
import Tags from "./Tags";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { setupThingTagsSnapshot } from "./firestore";
import { ThingTag } from "./schema";

interface AppLoggedProps {
  user: User;
  onLogout: () => void;
}

export default function AppLogged({ user, onLogout }: AppLoggedProps) {
  const [error, setError] = useState<null | string>(null);
  const [tags, setTags] = useState<null | readonly ThingTag[]>(null);

  useEffect(
    () => setupThingTagsSnapshot(user.uid, setTags, setError),
    [user.uid]
  );

  return (
    <main>
      <header>
        <h1>Things</h1>

        <span className="user">
          <p>Logged as {user.email}</p>
          <button className="btn" onClick={() => onLogout()}>
            <LogoutOutlined /> Log out
          </button>
        </span>
      </header>

      {error && (
        <div className="error-box">
          <header>Error</header>
          <p>{error}</p>
        </div>
      )}

      {tags === null && <LoadingOutlined async />}

      {tags && (
        <BrowserRouter>
          <nav>
            <NavLink to="/">Things</NavLink>
            <NavLink to="/tags">Tags</NavLink>
            <NavLink to="/deleted-things">Deleted things</NavLink>
          </nav>

          <Routes>
            <Route path="/" element={<Things user={user} thingTags={tags} />} />
            <Route path="/tags" element={<Tags user={user} />} />
            <Route
              path="/deleted-things"
              element={<DeletedThings user={user} />}
            />
          </Routes>
        </BrowserRouter>
      )}
    </main>
  );
}
