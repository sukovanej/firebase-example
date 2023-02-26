import { DeleteOutlined, FieldTimeOutlined } from "@ant-design/icons";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { ThingWithChange } from "./firestore";
import { ThingTag } from "./schema";
import ThingTagBadge from "./ThingTagBadge";
import { humanReadableDuration } from "./utils";

interface ThingItemProps {
  thing: ThingWithChange;
  onRemove: (id: string) => void;
  getTag: (id: string) => ThingTag;
}

export default function ThingItem({ thing, getTag, onRemove }: ThingItemProps) {
  const [show, setShow] = useState(true);

  const { change, value, id, createdAt, tags } = thing;
  const className = change === null ? "" : ` list-item-${change}`;
  const dataChangeId = `${change}-${id}`;

  if (change === "removed") {
    setTimeout(() => setShow(false), 500);
  }

  if (!show) {
    return <></>;
  }

  return (
    <li className={className} key={id}>
      <span id={dataChangeId}>
        <ReactMarkdown children={value} remarkPlugins={[remarkGfm]} />

        <div className="thing-tags-with-meta">
          <div className="thing-tags">
            {tags.map(getTag).map(({ id, name, color }) => (
              <ThingTagBadge key={id} name={name} color={color} />
            ))}
          </div>

          <div className="thing-meta">
            <span className="badge">
              <FieldTimeOutlined />
              {humanReadableDuration(createdAt.seconds * 1000)}
            </span>

            <button onClick={() => onRemove(id)} className="delete-btn btn">
              <DeleteOutlined />
            </button>
          </div>
        </div>
      </span>
    </li>
  );
}
