export default function PlaceholderStep({
  label,
}: Readonly<{ label: string }>) {
  return (
    <div className="py-8 text-center text-gray-400">
      Etapa "{label}" — em breve
    </div>
  )
}
