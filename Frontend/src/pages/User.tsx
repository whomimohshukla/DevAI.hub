import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import ThemeToggle from '../components/ThemeToggle'
import { useAuth } from '../contexts/AuthContext'
import { ApiError, userApi } from '../lib/api'
import { ErrorMessage, PageSpinner, Spinner } from '../components/Feedback'

export default function User() {
  const navigate = useNavigate()
  const { user, logout, apiKey, refreshUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [deleteText, setDeleteText] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState<'profile' | 'password' | 'delete' | null>(null)

  if (!user) return <PageSpinner label="Loading account" />

  const handleProfile = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setProfileMessage('')
    setBusy('profile')
    try {
      await userApi.updateMe(name)
      await refreshUser()
      setProfileMessage('Profile updated.')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not update profile')
    } finally {
      setBusy(null)
    }
  }

  const handlePassword = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setPasswordMessage('')
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match')
      return
    }
    setBusy('password')
    try {
      await userApi.changePassword(currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordMessage('Password updated.')
      await refreshUser()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not change password')
    } finally {
      setBusy(null)
    }
  }

  const handleDelete = async () => {
    if (deleteText !== user.email) return
    setError('')
    setBusy('delete')
    try {
      await userApi.deleteMe()
      logout()
      navigate('/')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not delete account')
      setBusy(null)
    }
  }

  const copyKey = async () => {
    if (!apiKey) return
    await navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader title="Profile" subtitle="Keep your account details, security settings, and current session key in one place." />
      <ErrorMessage message={error} />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Card>
          <div className="flex items-start gap-4">
            {user.profileImage ? (
              <img src={user.profileImage} alt="" className="h-16 w-16 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-zinc-800" />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-black dark:text-white">{user.name}</h2>
              <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">{user.email}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold capitalize text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {user.subscriptionPlan} plan
                </span>
                <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold capitalize text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                  {user.authProvider === 'google' ? 'Google sign-in' : 'Password sign-in'}
                </span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          <dl className="mt-6 grid gap-3 border-t border-zinc-100 pt-5 text-sm dark:border-zinc-800">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-zinc-500 dark:text-zinc-400">Credits</dt>
              <dd className="font-semibold text-black dark:text-white">{user.credits?.toLocaleString() ?? 0}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-zinc-500 dark:text-zinc-400">Role</dt>
              <dd className="font-medium capitalize text-zinc-800 dark:text-zinc-200">{user.role}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-zinc-500 dark:text-zinc-400">Member since</dt>
              <dd className="text-zinc-800 dark:text-zinc-200">{new Date(user.createdAt).toLocaleDateString()}</dd>
            </div>
          </dl>

          <div className="mt-6 flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-800">
            <div>
              <p className="text-sm font-medium text-black dark:text-white">Theme</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Use your preferred display mode.</p>
            </div>
            <ThemeToggle />
          </div>
        </Card>

        <div className="grid gap-6">
          <Card>
            <form onSubmit={handleProfile}>
              <h3 className="text-sm font-semibold text-black dark:text-white">Profile details</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">This name appears in your dashboard and navigation.</p>
              <label className="mt-4 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Display name</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
              <div className="mt-4 flex items-center gap-3">
                <button disabled={busy === 'profile'} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60">
                  {busy === 'profile' ? <Spinner label="Saving" /> : 'Save profile'}
                </button>
                {profileMessage && <span className="text-sm text-emerald-600 dark:text-emerald-400">{profileMessage}</span>}
              </div>
            </form>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-black dark:text-white">Current session key</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              This key signs requests from this browser. Use the API Keys page for long-lived production keys.
            </p>
            {apiKey && (
              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                <code className="min-w-0 truncate rounded-lg bg-zinc-100 px-3 py-2 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                  {showKey ? apiKey : `${apiKey.slice(0, 12)}........................`}
                </code>
                <button onClick={() => setShowKey((value) => !value)} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  {showKey ? 'Hide' : 'Show'}
                </button>
                <button onClick={copyKey} className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            )}
            <Link to="/keys" className="mt-3 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              Manage all API keys
            </Link>
          </Card>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <form onSubmit={handlePassword}>
            <h3 className="text-sm font-semibold text-black dark:text-white">Change password</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Google-only accounts can set a password here. Password accounts must enter the current password.
            </p>
            {user.authProvider !== 'google' && (
              <>
                <label className="mt-4 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Current password</label>
                <input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
              </>
            )}
            <label className="mt-4 block text-xs font-medium text-zinc-700 dark:text-zinc-300">New password</label>
            <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
            <label className="mt-4 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Confirm new password</label>
            <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
            <div className="mt-4 flex items-center gap-3">
              <button disabled={busy === 'password'} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60">
                {busy === 'password' ? <Spinner label="Updating" /> : 'Update password'}
              </button>
              {passwordMessage && <span className="text-sm text-emerald-600 dark:text-emerald-400">{passwordMessage}</span>}
            </div>
          </form>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-red-600 dark:text-red-400">Delete account</h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            This deactivates your account and revokes every API key, including this browser session.
          </p>
          <label className="mt-4 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Type your email to confirm
          </label>
          <input value={deleteText} onChange={(event) => setDeleteText(event.target.value)} placeholder={user.email} className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
          <button
            onClick={handleDelete}
            disabled={deleteText !== user.email || busy === 'delete'}
            className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/20"
          >
            {busy === 'delete' ? <Spinner label="Deleting" /> : 'Delete account'}
          </button>
        </Card>
      </div>
    </div>
  )
}
