export default function Feedback({
  message,
  type = "error",
}: {
  message: string | null;
  type?: "error" | "success";
}) {
  if (!message) return null;
  return <div className={`feedback ${type}`}>{message}</div>;
}
