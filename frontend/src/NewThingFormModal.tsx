import { User } from "firebase/auth";
import { useState } from "react";
import Modal from "./Modal";
import NewThingForm from "./NewThingForm";
import { ThingInput, ThingTag } from "./schema";

interface ThingFormProps {
  onSubmit: (thing: ThingInput) => void;
  thingTags: readonly ThingTag[];
  user: User;
}

export default function NewThingFormModal({
  onSubmit,
  thingTags,
  user,
}: ThingFormProps) {
  const [show, setShow] = useState(false);

  return (
    <>
      <button className="btn" onClick={() => setShow(true)}>
        Add thing
      </button>

      <Modal show={show} title="Add thing" onClose={() => setShow(false)}>
        <NewThingForm onSubmit={onSubmit} thingTags={thingTags} user={user} />
      </Modal>
    </>
  );
}
