import { Container, Row, Col } from "react-bootstrap"

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={4}>
            <h5>Task Master</h5>
            <p>Your complete solution for task management and organization.</p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-light">
                  Home
                </a>
              </li>
              <li>
                <a href="/categories" className="text-light">
                  Categories
                </a>
              </li>
              <li>
                <a href="/auth/login" className="text-light">
                  Login
                </a>
              </li>
              <li>
                <a href="/auth/register" className="text-light">
                  Register
                </a>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact Us</h5>
            <p>Email: support@taskmaster.com</p>
            <p>Phone: (123) 456-7890</p>
          </Col>
        </Row>
        <Row>
          <Col className="text-center mt-3">
            <p>&copy; {new Date().getFullYear()} Task Master. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

