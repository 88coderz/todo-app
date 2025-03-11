"use client"

import { Container, Card, Alert } from "react-bootstrap"
import Link from "next/link"

export default function VerifyPage() {
  return (
    <Container className="py-5">
      <Card className="mx-auto" style={{ maxWidth: "600px" }}>
        <Card.Body className="p-4 text-center">
          <h1 className="mb-4">Verify Your Email</h1>

          <Alert variant="info">
            <p>We've sent a verification email to your inbox.</p>
            <p>Please check your email and click the verification link to complete your registration.</p>
          </Alert>

          <p className="mt-4">
            Once verified, you can <Link href="/auth/login">login to your account</Link>.
          </p>
        </Card.Body>
      </Card>
    </Container>
  )
}

