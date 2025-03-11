import { Container, Row, Col, ListGroup, Button } from "react-bootstrap"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function CategoryPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: category } = await supabase.from("categories").select("*").eq("id", params.id).single()

  if (!category) {
    notFound()
  }

  const { data: tasks } = await supabase.from("tasks").select("*").eq("category_id", params.id)

  return (
    <Container className="py-5">
      <h1 className="mb-4">{category.name}</h1>

      <Row>
        <Col md={8}>
          <ListGroup className="mb-4">
            {tasks && tasks.length > 0 ? (
              tasks.map((task) => (
                <ListGroup.Item key={task.id} className="d-flex justify-content-between align-items-center">
                  {task.name}
                  <Link href={`/create-todo?task=${task.id}`} className="btn btn-sm btn-primary">
                    Add to My List
                  </Link>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No tasks available for this category</ListGroup.Item>
            )}
          </ListGroup>
        </Col>
        <Col md={4}>
          <div className="bg-light p-4 rounded">
            <h4>About {category.name}</h4>
            <p>
              This category includes various tasks related to {category.name.toLowerCase()}. Browse the available tasks
              or create your own custom task.
            </p>
            <Button as={Link} href="/create-todo" variant="success" className="w-100">
              Create Custom Task
            </Button>
          </div>
        </Col>
      </Row>

      <div className="mt-4">
        <Button as={Link} href="/categories" variant="outline-secondary">
          Back to Categories
        </Button>
      </div>
    </Container>
  )
}

