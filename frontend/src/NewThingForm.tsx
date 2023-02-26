import { ThingInput, ThingTag } from "./schema";
import { useState } from "react";
import { User } from "firebase/auth";
import ThingForm from "./ThingForm";

interface NewThingFormProps {
  onSubmit: (thingInput: ThingInput) => void;
  thingTags: readonly ThingTag[];
  user: User;
}

export default function NewThingForm({
  onSubmit,
  thingTags,
  user,
}: NewThingFormProps) {
  const [thing, setThing] = useState<ThingInput>({ value: "", uid: user.uid });

  return (
    <div className="line-form-group">
      <ThingForm thing={thing} thingTags={thingTags} onChange={setThing} />
      <button className="btn" onClick={() => onSubmit(thing)}>
        Add new thing
      </button>
    </div>
  );
}
