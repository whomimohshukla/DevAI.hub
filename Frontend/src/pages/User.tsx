import PageHeader from '../components/PageHeader'
import Card from '../components/Card'

export default function User() {
  const profile = { name: 'Jane Doe', email: 'jane@example.com', role: 'Developer' }
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader title="Account" subtitle="Manage your profile and preferences." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold text-black dark:text-white">Profile</h3>
          <div className="mt-3 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
            <p><span className="text-zinc-500 dark:text-zinc-400">Name:</span> {profile.name}</p>
            <p><span className="text-zinc-500 dark:text-zinc-400">Email:</span> {profile.email}</p>
            <p><span className="text-zinc-500 dark:text-zinc-400">Role:</span> {profile.role}</p>
          </div>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-black dark:text-white">Preferences</h3>
          <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">Theme, notifications and more.</p>
        </Card>
      </div>
    </div>
  )
}
