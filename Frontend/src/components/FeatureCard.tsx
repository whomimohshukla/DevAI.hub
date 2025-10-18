import { CardSpotlight } from './ui/card-spotlight'

type Props = {
  title: string
  desc: string
}


export default function FeatureCard({ title, desc }: Props) {
  return (
    <CardSpotlight>
      <h3 className="text-base font-semibold tracking-tight text-black dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{desc}</p>
    </CardSpotlight>
  )
}
