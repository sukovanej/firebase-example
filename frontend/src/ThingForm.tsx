import { ThingInput, ThingTag } from "./schema";
import Select, { StylesConfig } from "react-select";
import { thingTagFromId } from "./utils";

interface ThingFormProps {
  thing: ThingInput;
  onChange: (thingInput: ThingInput) => void;
  onSubmit: () => void;
  thingTags: readonly ThingTag[];
}

const colourStyles: StylesConfig<ThingTag, true> = {
  control: (styles) => ({ ...styles, backgroundColor: "white", height: 50 }),
  option: (styles, { data, isDisabled }) => ({
    ...styles,
    backgroundColor: "#fff",
    color: data.color,
    cursor: isDisabled ? "not-allowed" : "default",
  }),
  multiValue: (styles, { data }) => ({
    ...styles,
    backgroundColor: data.color,
    borderRadius: "3px",
    padding: "4px",
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

const thingTagToOption = (thingTag: ThingTag) => ({
  ...thingTag,
  label: thingTag.name,
  value: thingTag.id,
});

export default function ThingForm({
  thing,
  onChange,
  onSubmit,
  thingTags,
}: ThingFormProps) {
  const thingTagOptions = thingTags.map(thingTagToOption);
  const selectedOptions = thing.tags
    .map(thingTagFromId(thingTags))
    .map(thingTagToOption);

  return (
    <div className="thing-form">
      <textarea
        className="input"
        onChange={(e) => onChange({ ...thing, value: e.currentTarget.value })}
        rows={10}
        value={thing.value}
      />

      <Select
        placeholder="Tags"
        className="thing-tags-select"
        closeMenuOnSelect={false}
        value={selectedOptions}
        onChange={(tags) =>
          onChange({ ...thing, tags: tags.map(({ id }) => id) })
        }
        isMulti
        options={thingTagOptions}
        styles={colourStyles}
      />
      <button className="btn full-width" onClick={onSubmit}>
        Add new thing
      </button>
    </div>
  );
}
