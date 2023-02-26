import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { TwitterPicker } from "react-color";
import { firestoreStoreThingTag, setupThingTagsSnapshot } from "./firestore";
import { ThingTag } from "./schema";

import ThingTagBadge from "./ThingTagBadge";

interface TagsProps {
  user: User;
}

export default function Tags({ user }: TagsProps) {
  const [color, setColor] = useState("#22194D");
  const [name, setName] = useState("");
  const [thingTags, setThingTags] = useState<null | readonly ThingTag[]>(null);
  const [error, setError] = useState<null | string>(null);

  useEffect(
    () => setupThingTagsSnapshot(user.uid, setThingTags, setError),
    [setupThingTagsSnapshot]
  );

  const addNewTag = () => {
    firestoreStoreThingTag({ uid: user.uid, color, name }, () =>
      console.log("done")
    );
  };

  return (
    <section>
      {error && (
        <div className="error-box">
          <header>Error</header>
          <p>{error}</p>
        </div>
      )}

      <div className="thing-tags">
        {thingTags &&
          thingTags.map(({ name, color }) => (
            <ThingTagBadge name={name} color={color} />
          ))}
      </div>

      <h2>New tag</h2>
      <div className="form">
        <input
          className="input"
          type="text"
          value={name}
          placeholder="Tag name"
          onChange={(e) => setName(e.currentTarget.value)}
        />
        <div className="color-picker">
          <ThingTagBadge name={name} color={color} />
          <TwitterPicker
            color={color}
            onChange={(value) => setColor(value.hex)}
          />
        </div>

        <button className="btn" onClick={() => addNewTag()}>
          Add new tag
        </button>
      </div>
    </section>
  );
}
