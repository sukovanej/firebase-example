import { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";

import {
  firestoreDeleteThing,
  firestoreStoreThing,
  setupThingsSnapshot,
  ThingWithChange,
} from "./firestore";
import { thingTagFromId } from "./utils";
import { User } from "firebase/auth";
import { ThingInput, ThingTag } from "./schema";
import NewThingForm from "./NewThingForm";
import ThingItem from "./ThingItem";

interface ThingsProps {
  user: User;
  thingTags: readonly ThingTag[];
}

export default function Things({ user, thingTags }: ThingsProps) {
  const [error, setError] = useState<null | string>(null);
  const [things, setThings] = useState<null | readonly ThingWithChange[]>(null);

  useEffect(
    () =>
      setupThingsSnapshot(user.uid, setThings, (error) => {
        setError(error);
        setThings(null);
        console.error(error);
      }),
    [setupThingsSnapshot]
  );

  const addThing = (newThing: ThingInput) => {
    firestoreStoreThing(newThing, () => console.log("stored"));
  };

  const removeThing = (id: string) => {
    firestoreDeleteThing(id, () => console.log("deleted"));
  };

  return (
    <section>
      <NewThingForm onSubmit={addThing} thingTags={thingTags} user={user} />

      {error && (
        <div className="error-box">
          <header>Error</header>
          <p>{error}</p>
        </div>
      )}

      {things === null && <LoadingOutlined async />}

      {things && (
        <ul className="list">
          {things.map((thing) => (
            <ThingItem
              key={thing.id}
              thing={thing}
              onRemove={removeThing}
              getTag={thingTagFromId(thingTags)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
