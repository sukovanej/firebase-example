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
  const EMPTY_THING = {
    value: "",
    uid: user.uid,
    tags: [],
  } as const;

  const [thing, setThing] = useState<ThingInput>(EMPTY_THING);
  const onFormSubmit = () => {
    onSubmit(thing);
    setThing(EMPTY_THING);
  };

  return (
    <ThingForm
      thing={thing}
      thingTags={thingTags}
      onChange={setThing}
      onSubmit={onFormSubmit}
    />
  );
}
