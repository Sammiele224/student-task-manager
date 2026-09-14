import { useRef, useState } from 'react'
import { Camera, Eye, EyeOff, Pencil, X } from 'lucide-react'
import Button from '../components/ui/Button'
import { PageContainer, PageHeader } from '../components/layout'
import '../styles/features/User/Profile.css'

const CURRENT_USER = {
  username: 'alexmorgan',
  email: 'alex@school.edu',
  avatarUrl: '', 
}

function getInitials(name = '') {
  const parts = name.trim().split(/[\s._-]+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export default function Profile() {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const [username] = useState(CURRENT_USER.username)
  const [email] = useState(CURRENT_USER.email)

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [avatarUrl, setAvatarUrl] = useState(CURRENT_USER.avatarUrl)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const fileInputRef = useRef(null)

  const initials = getInitials(username)
  const displayedAvatar = avatarPreview || avatarUrl

  function handleEditClick() {
    setEditing(true)
  }

  function handleCancel() {
    setPassword('')
    setShowPassword(false)
    setAvatarPreview(null)
    setEditing(false)
  }

  function handleAvatarClick() {
    if (!editing) return
    fileInputRef.current?.click()
  }

  function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setAvatarPreview(url)
  }

  async function handleUpdate() {
    setSaving(true)
    try {
      // call api
      await new Promise((resolve) => setTimeout(resolve, 600))
      if (avatarPreview) setAvatarUrl(avatarPreview)
      setAvatarPreview(null)
      setPassword('')
      setShowPassword(false)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageContainer className="profile">
      <PageHeader
        eyebrow="Account"
        title="Your profile"
        subtitle="Manage your account details and password."
        actions={
          !editing ? (
            <Button iconLeft={<Pencil size={16} />} onClick={handleEditClick}>
              Edit
            </Button>
          ) : (
            <div className="profile__actions">
              <Button
                variant="ghost"
                iconLeft={<X size={16} />}
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={saving}>
                {saving ? 'Saving…' : 'Update'}
              </Button>
            </div>
          )
        }
      />

      <div className="profile__grid">
        {/* --- left side --- */}
        <div className="profile__avatar-block">
          <button
            type="button"
            className={`profile__avatar ${editing ? 'is-editable' : ''}`}
            onClick={handleAvatarClick}
            disabled={!editing}
            aria-label={editing ? 'Change avatar' : undefined}
          >
            {displayedAvatar ? (
              <img src={displayedAvatar} alt="" className="profile__avatar-img" />
            ) : (
              <span className="profile__avatar-fallback">{initials}</span>
            )}

            {editing && (
              <span className="profile__avatar-overlay">
                <Camera size={22} />
              </span>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleAvatarChange}
            hidden
          />

          <p className="profile__avatar-name">{username}</p>
          {editing && (
            <p className="profile__avatar-hint">
              Click the avatar to upload a JPG or PNG, up to 5MB.
            </p>
          )}
        </div>

        {/* --- right side --- */}
        <div className="profile__card profile__fields">
          <label className="profile__field">
            <span className="profile__label">Username</span>
            <input
              type="text"
              value={username}
              disabled
              className="profile__input"
            />
          </label>

          <label className="profile__field">
            <span className="profile__label">Email</span>
            <input
              type="email"
              value={email}
              disabled
              className="profile__input"
            />
          </label>

          <label className="profile__field">
            <span className="profile__label">Password</span>
            <div className="profile__password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                value={editing ? password : '••••••••'}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!editing}
                placeholder={editing ? 'Enter a new password' : undefined}
                className="profile__input"
              />
              {editing && (
                <button
                  type="button"
                  className="profile__password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              )}
            </div>
            {editing && (
              <span className="profile__hint">
                Leave blank to keep your current password.
              </span>
            )}
          </label>
        </div>
      </div>
    </PageContainer>
  )
}