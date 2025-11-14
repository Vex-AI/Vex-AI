import { formatDate } from "@/lib/utils";
import { DateSeparatorProps } from "@/types";

const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
  return (
<div
  style={{
    display: "flex",
    alignItems: "center",
    margin: "1.5rem 0",
    color: "#999",
    fontSize: "0.85rem",
    fontWeight: 500,
  }}
>
  <div style={{ flex: 1, height: 1, background: "#333" }} />
  <span style={{ padding: "0 12px" }}>{formatDate(date)}</span>
  <div style={{ flex: 1, height: 1, background: "#333" }} />
</div>

  );
};

export default DateSeparator;
