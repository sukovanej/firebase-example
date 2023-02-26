import { LoadingOutlined, LogoutOutlined } from "@ant-design/icons";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import * as RA from "@effect/data/ReadonlyArray";

import Things from "./Things";
import DeletedThings from "./DeletedThings";
import Tags from "./Tags";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  setupDeletedThingsSnapshot,
  setupThingsSnapshot,
  setupThingTagsSnapshot,
  ThingWithChange,
} from "./firestore";
import { ThingTag } from "./schema";
import { pipe } from "@effect/data/Function";

interface AppLoggedProps {
  user: User;
  onLogout: () => void;
}

export default function AppLogged({ user, onLogout }: AppLoggedProps) {
  const [error, setError] = useState<null | string>(null);
  const [tags, setTags] = useState<null | readonly ThingTag[]>(null);
  const [things, setThings] = useState<null | readonly ThingWithChange[]>(null);
  const [deletedThings, setDeletedThings] = useState<
    null | readonly ThingWithChange[]
  >(null);

  useEffect(() => {
    const unsubscribeTags = setupThingTagsSnapshot(user.uid, setTags, setError);
    const unsubscribeThings = setupThingsSnapshot(
      user.uid,
      (things) => {
        setThings(things);
        setTimeout(onThingsChangesRendered, 500);
      },
      setError
    );
    const unsubscribeDeletedThings = setupDeletedThingsSnapshot(
      user.uid,
      (things) => {
        setDeletedThings(things);
        setTimeout(onDeletedThingsChangesRendered, 500);
      },
      setError
    );

    return () => {
      unsubscribeTags();
      unsubscribeThings();
      unsubscribeDeletedThings();
    };
  }, [user.uid]);

  const transformThingsAfterRendered = (
    things: readonly ThingWithChange[] | null
  ) =>
    pipe(
      things ?? [],
      RA.filter(({ change }) => change !== "removed"),
      RA.map((thing) => ({ ...thing, change: null }))
    );

  const onDeletedThingsChangesRendered = () =>
    setDeletedThings(transformThingsAfterRendered);

  const onThingsChangesRendered = () => setThings(transformThingsAfterRendered);

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

      {(tags === null || things === null || deletedThings === null) && (
        <LoadingOutlined async />
      )}

      {tags && things && deletedThings && (
        <BrowserRouter>
          <nav>
            <NavLink to="/">Things</NavLink>
            <NavLink to="/tags">Tags</NavLink>
            <NavLink to="/deleted-things">Deleted things</NavLink>
          </nav>

          <Routes>
            <Route
              path="/"
              element={<Things user={user} thingTags={tags} things={things} />}
            />
            <Route path="/tags" element={<Tags user={user} />} />
            <Route
              path="/deleted-things"
              element={
                <DeletedThings things={deletedThings} thingTags={tags} />
              }
            />
          </Routes>
        </BrowserRouter>
      )}
    </main>
  );
}
