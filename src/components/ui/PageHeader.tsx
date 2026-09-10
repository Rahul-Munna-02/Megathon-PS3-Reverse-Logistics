import type { ReactNode } from "react";

export default function PageHeader({ title, description, eyebrow, action }: { title: string; description?: string; eyebrow?: string; action?: ReactNode }) {
	return <div className="page-header"><div>{eyebrow && <div className="eyebrow muted">{eyebrow}</div>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>;
}
