import type { Status } from "@/lib/types";

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`badge ${status === "S" ? "success" : "muted"}`}>
      {status === "S" ? "Ativo" : "Inativo"}
    </span>
  );
}
