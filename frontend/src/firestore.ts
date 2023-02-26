import { pipe } from "@effect/data/Function";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentChangeType,
  DocumentData,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  Timestamp,
  where,
} from "firebase/firestore";

import * as E from "@effect/data/Either";
import * as RA from "@effect/data/ReadonlyArray";
import * as O from "@effect/data/Option";
import { formatErrors } from "@fp-ts/schema/formatter/Tree";
import {
  decodeThing,
  decodeThingTag,
  Thing,
  ThingInput,
  ThingTag,
  ThingTagInput,
} from "./schema";
import { app } from "./firebase";

const firestore = getFirestore(app);

const thingsCollection = collection(firestore, "things");
const thingTagsCollection = collection(firestore, "tags");
const deletedThingsCollection = collection(firestore, "deletedThings");

export const firestoreStoreThing = (
  thingInput: ThingInput,
  onSuccess: () => void
) => {
  const data = {
    ...thingInput,
    createdAt: Timestamp.fromDate(new Date()),
  };

  addDoc(thingsCollection, data).then(onSuccess);
};

export type ThingWithChange = Thing & {
  change: DocumentChangeType | null;
};

const eitherTraverseArray = RA.traverse(E.Applicative);

export const firestoreDeleteThing = (id: string, onSuccess: () => void) =>
  deleteDoc(doc(firestore, "things", id)).then(onSuccess);

export const setupThingsSnapshot = (
  uid: string,
  onSuccess: (things: readonly ThingWithChange[]) => void,
  onError: (error: string) => void
) => {
  let isFirstLoad = true;

  return onSnapshot(
    query(
      thingsCollection,
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    ),
    (snapshot) => {
      pipe(
        handleThingsSnapshot(snapshot),
        E.match(onError, ([things, changes]) =>
          onSuccess(
            assignChangesToThings(things, (isFirstLoad && []) || changes)
          )
        )
      );
      isFirstLoad = false;
    },
    (error) => onError(error.message)
  );
};

export const firestoreDeleteDeletedThing = (
  id: string,
  onSuccess: () => void
) => deleteDoc(doc(firestore, "deletedThings", id)).then(onSuccess);

export const setupDeletedThingsSnapshot = (
  uid: string,
  onSuccess: (things: readonly ThingWithChange[]) => void,
  onError: (error: string) => void
) => {
  let isFirstLoad = true;

  return onSnapshot(
    query(
      deletedThingsCollection,
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    ),
    (snapshot) => {
      pipe(
        handleThingsSnapshot(snapshot),
        E.match(onError, ([things, changes]) =>
          onSuccess(
            assignChangesToThings(things, (isFirstLoad && []) || changes)
          )
        )
      );
      isFirstLoad = false;
    },
    (error) => onError(error.message)
  );
};

export const handleThingsSnapshot = (snapshot: QuerySnapshot<DocumentData>) => {
  const changes = pipe(
    snapshot.docChanges(),
    eitherTraverseArray((data) =>
      pipe(
        decodeThing({ ...data.doc.data(), id: data.doc.id }),
        E.map((thing) => ({
          thing,
          type: data.type,
          index: data.oldIndex,
        })),
        E.mapLeft(
          (error) => `for ${JSON.stringify(data)} --- ${formatErrors(error)}`
        )
      )
    )
  );

  const things = pipe(
    snapshot.docs.map((data) => ({ ...data.data(), id: data.id })),
    eitherTraverseArray((data) =>
      pipe(
        decodeThing(data),
        E.mapLeft(
          (error) => `for ${JSON.stringify(data)} --- ${formatErrors(error)}`
        )
      )
    )
  );

  return E.tuple(things, changes);
};

const assignChangesToThings = (
  things: readonly Thing[],
  changes: readonly {
    thing: Thing;
    type: DocumentChangeType;
    index: number;
  }[]
): ThingWithChange[] =>
  pipe(
    things,
    RA.map((thing) =>
      pipe(
        changes,
        RA.findFirst((change) => change.thing.id === thing.id),
        O.match(
          () => ({ ...thing, change: null }),
          ({ type }) => ({ ...thing, change: type })
        )
      )
    ),
    (things) =>
      pipe(
        changes,
        RA.filter(({ type }) => type === "removed"),
        RA.reduce(things, (things, { index, thing }) =>
          pipe(
            things,
            RA.insertAt(index, { ...thing, change: "removed" as const }),
            O.getOrThrow
          )
        )
      )
  );

export const firestoreStoreThingTag = (
  thingTagInput: ThingTagInput,
  onSuccess: () => void
) => {
  const data = {
    ...thingTagInput,
    createdAt: Timestamp.fromDate(new Date()),
  };

  addDoc(thingTagsCollection, data).then(onSuccess);
};

export const setupThingTagsSnapshot = (
  uid: string,
  onSuccess: (things: readonly ThingTag[]) => void,
  onError: (error: string) => void
) =>
  onSnapshot(
    query(thingTagsCollection, where("uid", "==", uid), orderBy("name")),
    (snapshot) =>
      pipe(
        snapshot.docs,
        RA.map((data) => ({ ...data.data(), id: data.id })),
        eitherTraverseArray((data) =>
          pipe(
            decodeThingTag(data),
            E.mapLeft(
              (error) =>
                `for ${JSON.stringify(data)} --- ${formatErrors(error)}`
            )
          )
        ),
        E.match(onError, onSuccess)
      ),
    (error) => onError(error.message)
  );
