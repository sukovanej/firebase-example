import {
  firestoreDeleteThing,
  firestoreStoreThing,
  ThingWithChange,
} from "./firestore";
import { thingTagFromId } from "./utils";
import { User } from "firebase/auth";
import { ThingInput, ThingTag } from "./schema";
import ThingItem from "./ThingItem";
import NewThingFormModal from "./NewThingFormModal";

interface ThingsProps {
  user: User;
  thingTags: readonly ThingTag[];
  things: readonly ThingWithChange[];
}

export default function Things({ user, thingTags, things }: ThingsProps) {
  const addThing = (newThing: ThingInput) => {
    firestoreStoreThing(newThing, () => console.log("stored"));
  };

  const removeThing = (id: string) => {
    firestoreDeleteThing(id, () => console.log("deleted"));
  };

  return (
    <section>
      <NewThingFormModal
        onSubmit={addThing}
        thingTags={thingTags}
        user={user}
      />
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
    </section>
  );
}
