"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth/auth-provider"

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phone: "",
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

      if (error) {
        console.error("Error fetching profile:", error)
        return
      }

      setProfile(data)
      setFormData({
        firstName: data.first_name,
        lastName: data.last_name,
        username: data.username,
        phone: data.phone || "",
      })

      if (data.avatar_url) {
        setAvatarPreview(data.avatar_url)
      }
    }

    fetchProfile()
  }, [user, router, supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      let avatarUrl = profile?.avatar_url

      // Upload new avatar if provided
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`

        const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, avatarFile)

        if (uploadError) throw uploadError

        avatarUrl = supabase.storage.from("avatars").getPublicUrl(fileName).data.publicUrl
      }

      // Update profile
      const { error } = await supabase
        .from("user_profiles")
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          username: formData.username,
          phone: formData.phone,
          avatar_url: avatarUrl,
        })
        .eq("id", user.id)

      if (error) throw error

      setSuccess("Profile updated successfully!")
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!profile) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Edit Profile</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row>
        <Col md={8}>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Avatar</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={handleAvatarChange} />
                  {avatarPreview && (
                    <div className="mt-2">
                      <img
                        src={avatarPreview || "/placeholder.svg"}
                        alt="Avatar Preview"
                        style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }}
                      />
                    </div>
                  )}
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body className="text-center">
              {avatarPreview ? (
                <img
                  src={avatarPreview || "/placeholder.svg"}
                  alt="Profile"
                  className="rounded-circle mb-3"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
              ) : (
                <div
                  className="rounded-circle mx-auto mb-3 bg-primary d-flex align-items-center justify-content-center text-white"
                  style={{ width: "150px", height: "150px", fontSize: "3rem" }}
                >
                  {formData.firstName?.[0]}
                  {formData.lastName?.[0]}
                </div>
              )}
              <h4>
                {formData.firstName} {formData.lastName}
              </h4>
              <p className="text-muted">@{formData.username}</p>

              <hr />

              <Button variant="outline-danger" className="w-100" onClick={() => router.push("/dashboard")}>
                Back to Dashboard
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

