import * as S from "@fp-ts/schema";
import { pipe } from "@effect/data/Function";

const firestoreTimestampSchema = pipe(
  S.struct({ seconds: S.number, nanoseconds: S.number })
);

const thingInputSchema = S.struct({
  value: S.string,
  uid: S.string,
});

export type ThingInput = S.Infer<typeof thingInputSchema>;

const thingSchema = pipe(
  S.struct({
    createdAt: firestoreTimestampSchema,
    id: S.string,
  }),
  S.extend(thingInputSchema)
);

export type Thing = S.Infer<typeof thingSchema>;

export const decodeThing = (input: unknown) =>
  S.decode(thingSchema)(input, { isUnexpectedAllowed: true });

const thingTagInputSchema = S.struct({
  name: S.string,
  color: S.string,
  uid: S.string,
});

export type ThingTagInput = S.Infer<typeof thingTagInputSchema>;

const thingTagSchema = pipe(
  S.struct({
    id: S.string,
    createdAt: firestoreTimestampSchema,
  }),
  S.extend(thingTagInputSchema)
);

export type ThingTag = S.Infer<typeof thingTagSchema>;

export const decodeThingTag = S.decode(thingTagSchema);
