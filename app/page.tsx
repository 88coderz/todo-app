import { Container, Row, Col, Button, Card } from "react-bootstrap"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data: categories } = await supabase.from("categories").select("*").limit(6)

  return (
    <Container>
      <section className="py-5 text-center">
        <h1>Welcome to Task Master</h1>
        <p className="lead">Your complete solution for organizing tasks and getting things done efficiently.</p>
        {!session ? (
          <div className="d-flex justify-content-center gap-3">
            <Button as={Link} href="/auth/register" variant="primary" size="lg">
              Get Started
            </Button>
            <Button as={Link} href="/auth/login" variant="outline-primary" size="lg">
              Login
            </Button>
          </div>
        ) : (
          <Button as={Link} href="/dashboard" variant="success" size="lg">
            Go to My Tasks
          </Button>
        )}
      </section>

      <section className="py-5">
        <h2 className="text-center mb-4">Popular Categories</h2>
        <Row>
          {categories?.map((category) => (
            <Col key={category.id} md={4} className="mb-4">
              <Card
                className="category-card"
                style={{
                  backgroundImage: `url(/images/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}.jpg)`,
                }}
              >
                <div className="category-overlay">{category.name}</div>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-4">
          <Button as={Link} href="/categories" variant="primary">
            View All Categories
          </Button>
        </div>
      </section>

      <section className="py-5">
        <Row>
          <Col md={6}>
            <h2>Why Choose Task Master?</h2>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Organize tasks by categories</li>
              <li className="list-group-item">Schedule tasks with our easy-to-use calendar</li>
              <li className="list-group-item">Track your progress and stay on top of deadlines</li>
              <li className="list-group-item">Access your tasks from anywhere, anytime</li>
              <li className="list-group-item">Collaborate with others on shared tasks</li>
            </ul>
          </Col>
          <Col md={6}>
            <img src="/images/task-management.jpg" alt="Task Management" className="img-fluid rounded shadow" />
          </Col>
        </Row>
      </section>
    </Container>
  )
}

