import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

import {
  firestoreDeleteDeletedThing,
  setupDeletedThingsSnapshot,
  ThingWithChange,
} from "./firestore";
import { thingTagFromId } from "./utils";
import { User } from "firebase/auth";
import ThingItem from "./ThingItem";
import { ThingTag } from "./schema";

interface DeletedThingsProps {
  user: User;
  thingTags: readonly ThingTag[];
}

export default function DeletedThings({ user, thingTags }: DeletedThingsProps) {
  const [error, setError] = useState<null | string>(null);
  const [things, setThings] = useState<null | readonly ThingWithChange[]>(null);

  const isLoading = error === null && things === null;

  useEffect(
    () =>
      setupDeletedThingsSnapshot(user.uid, setThings, (error) => {
        setError(error);
        setThings(null);
        console.error(error);
      }),
    [setupDeletedThingsSnapshot]
  );

  const removeDeletedThing = (id: string) => {
    firestoreDeleteDeletedThing(id, () => console.log("deleted"));
  };

  return (
    <section>
      {error && (
        <div className="error-box">
          <header>Error</header>
          <p>{error}</p>
        </div>
      )}
      {isLoading && <LoadingOutlined async />}

      {things && things.length == 0 && <em>No deleted things yet.</em>}

      {things && things.length > 0 && (
        <ul className="list">
          {things.map((thing) => (
            <ThingItem
              key={thing.id}
              thing={thing}
              onRemove={removeDeletedThing}
              getTag={thingTagFromId(thingTags)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
