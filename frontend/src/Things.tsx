import { useEffect, useState } from "react";
import * as RA from "@effect/data/ReadonlyArray";
import {
  DeleteOutlined,
  FieldTimeOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

import {
  firestoreDeleteThing,
  firestoreStoreThing,
  setupThingsSnapshot,
  ThingWithChange,
} from "./firestore";
import { humanReadableDuration } from "./utils";
import { User } from "firebase/auth";
import { ThingInput, ThingTag } from "./schema";
import NewThingForm from "./NewThingForm";

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
          {things.map(({ value, id, createdAt, change }, idx) => {
            const className =
              "list-item" + (change === null ? "" : ` list-item-${change}`);

            if (change === "removed") {
              setTimeout(() => setThings(RA.remove(things, idx)), 500);
            }

            return (
              <li className={className} key={id}>
                {value}
                <div className="thing-meta">
                  <span className="badge">
                    <FieldTimeOutlined />
                    {humanReadableDuration(createdAt.seconds * 1000)}
                  </span>
                  <button
                    onClick={() => removeThing(id)}
                    className="delete-btn btn"
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
