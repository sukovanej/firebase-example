import {
  firestoreDeleteDeletedThing,
  firestoreStoreThing,
  ThingWithChange,
} from "./firestore";
import { thingTagFromId } from "./utils";
import ThingItem from "./ThingItem";
import { Thing, ThingTag } from "./schema";

interface DeletedThingsProps {
  thingTags: readonly ThingTag[];
  things: readonly ThingWithChange[];
}

export default function DeletedThings({
  thingTags,
  things,
}: DeletedThingsProps) {
  const removeDeletedThing = (id: string) => {
    firestoreDeleteDeletedThing(id, () => console.log("deleted"));
  };

  const recoverDeletedThing = (thing: Thing) => {
    firestoreDeleteDeletedThing(thing.id, () => console.log("deleted"));
    firestoreStoreThing(thing, () => console.log("recovered"));
  };

  return (
    <section>
      <ul className="list">
        {things.map((thing) => (
          <ThingItem
            key={thing.id}
            thing={thing}
            onRemove={removeDeletedThing}
            onRecover={recoverDeletedThing}
            getTag={thingTagFromId(thingTags)}
          />
        ))}
      </ul>
    </section>
  );
}
