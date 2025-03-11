"use client"

import { useState, useEffect } from "react"
import { Navbar, Container, Nav, Button } from "react-bootstrap"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import Image from "next/image"

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [showBanner, setShowBanner] = useState(true)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <>
      {showBanner && (
        <div className="parallax-banner" style={{ backgroundImage: "url(/images/banner.jpg)" }}>
          <div className="parallax-overlay"></div>
          <div className="parallax-content">
            <h1>Task Master</h1>
            <p>Organize your tasks efficiently</p>
            <Button variant="primary" onClick={() => setShowBanner(false)}>
              Get Started
            </Button>
          </div>
        </div>
      )}

      <Navbar
        bg={scrolled ? "dark" : "transparent"}
        variant={scrolled ? "dark" : "light"}
        expand="lg"
        fixed="top"
        className={scrolled ? "shadow" : ""}
        style={{ transition: "all 0.3s ease" }}
      >
        <Container>
          <Navbar.Brand as={Link} href="/">
            <Image src="/images/logo.png" alt="Task Master Logo" width={30} height={30} className="me-2" />
            Task Master
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} href="/" className={pathname === "/" ? "active" : ""}>
                Home
              </Nav.Link>
              <Nav.Link as={Link} href="/categories" className={pathname === "/categories" ? "active" : ""}>
                Categories
              </Nav.Link>
              {user && (
                <Nav.Link as={Link} href="/dashboard" className={pathname === "/dashboard" ? "active" : ""}>
                  My Tasks
                </Nav.Link>
              )}
            </Nav>
            <Nav>
              {user ? (
                <>
                  <Nav.Link as={Link} href="/profile">
                    {user.user_metadata.username || user.email}
                  </Nav.Link>
                  <Button variant="outline-light" onClick={signOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} href="/auth/login">
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} href="/auth/register">
                    Register
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div style={{ height: showBanner ? "50vh" : "56px" }}></div>
    </>
  )
}

