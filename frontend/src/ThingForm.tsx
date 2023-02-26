import { ThingInput, ThingTag } from "./schema";
import Select, { StylesConfig } from "react-select";

interface ThingFormProps {
  thing: ThingInput;
  onChange: (thingInput: ThingInput) => void;
  thingTags: readonly ThingTag[];
}

const colourStyles: StylesConfig<ThingTag, true> = {
  control: (styles) => ({ ...styles, backgroundColor: "white" }),
  option: (styles, { data, isDisabled }) => ({
    ...styles,
    backgroundColor: "#fff",
    color: data.color,
    cursor: isDisabled ? "not-allowed" : "default",
  }),
  multiValue: (styles, { data }) => ({
    ...styles,
    backgroundColor: data.color,
  }),
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    backgroundColor: data.color,
    color: "#fff",
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: "#fff",
    ":hover": {
      opacity: 0.9,
    },
  }),
};

export default function ThingForm({
  thing,
  onChange,
  thingTags,
}: ThingFormProps) {
  const thingTagOptions = thingTags.map((thingTag) => ({
    ...thingTag,
    label: thingTag.name,
    value: thingTag.id,
  }));

  return (
    <>
      <input
        className="input"
        type="text"
        value={thing.value}
        onChange={(e) => onChange({ ...thing, value: e.currentTarget.value })}
      />
      <Select
        className="thing-tags-select"
        closeMenuOnSelect={false}
        defaultValue={[]}
        isMulti
        options={thingTagOptions}
        styles={colourStyles}
      />
    </>
  );
}
