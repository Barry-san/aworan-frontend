export default function FormError({ error }: { error: string | undefined }) {
	if (error) return <p className="text-red-400 text-xs md:text-sm">{error}</p>;
	return null;
}
