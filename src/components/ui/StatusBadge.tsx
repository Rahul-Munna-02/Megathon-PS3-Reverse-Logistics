import { Badge, type BadgeTone } from "./primitives";

export default function StatusBadge({ status, tone = "neutral" }: { status: string; tone?: BadgeTone }) {
	return <Badge tone={tone}><span className="status-dot" />{status}</Badge>;
}
