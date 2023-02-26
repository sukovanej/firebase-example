import * as RA from "@effect/data/ReadonlyArray";
import { FieldTimeOutlined, LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

import { setupDeletedThingsSnapshot, ThingWithChange } from "./firestore";
import { humanReadableDuration } from "./utils";
import { User } from "firebase/auth";

interface DeletedThingsProps {
  user: User;
}

export default function DeletedThings({ user }: DeletedThingsProps) {
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

  return (
    <section>
      {error && (
        <div className="error-box">
          <header>Error</header>
          <p>{error}</p>
        </div>
      )}
      {isLoading && <LoadingOutlined async />}

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
                <span className="badge">
                  <FieldTimeOutlined />
                  {humanReadableDuration(createdAt.seconds * 1000)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
