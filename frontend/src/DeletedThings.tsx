import { firestoreDeleteDeletedThing, ThingWithChange } from "./firestore";
import { thingTagFromId } from "./utils";
import ThingItem from "./ThingItem";
import { ThingTag } from "./schema";

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

  return (
    <section>
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
    </section>
  );
}
