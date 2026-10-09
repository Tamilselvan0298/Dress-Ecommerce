import { redirect } from "next/navigation";

interface Props {
  params: { id: string };
}

export default function ProductDetailPage({ params }: Props) {
  redirect(`/admin/products/${params.id}/edit`);
}

