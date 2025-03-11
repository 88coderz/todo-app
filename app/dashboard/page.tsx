import { Container, Row, Col, Card, ListGroup, Badge, Button } from "react-bootstrap"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import TaskItem from "@/components/task-item"

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  const { data: userTasks } = await supabase
    .from("user_tasks")
    .select(`
      id,
      completed,
      scheduled_for,
      tasks (
        id,
        name,
        categories (
          id,
          name
        )
      )
    `)
    .eq("user_id", session.user.id)
    .order("scheduled_for", { ascending: true })

  // Group tasks by date
  const tasksByDate: Record<string, any[]> = {}

  userTasks?.forEach((userTask) => {
    const date = userTask.scheduled_for ? new Date(userTask.scheduled_for).toDateString() : "Unscheduled"

    if (!tasksByDate[date]) {
      tasksByDate[date] = []
    }

    tasksByDate[date].push(userTask)
  })

  // Get user profile
  const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", session.user.id).single()

  return (
    <Container className="py-5">
      <Row>
        <Col md={8}>
          <h1 className="mb-4">My Tasks</h1>

          {Object.keys(tasksByDate).length > 0 ? (
            Object.entries(tasksByDate).map(([date, tasks]) => (
              <Card key={date} className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">
                    {date === "Unscheduled"
                      ? "Unscheduled"
                      : new Date(date).toLocaleDateString(undefined, {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                  </h5>
                </Card.Header>
                <ListGroup variant="flush">
                  {tasks.map((task) => (
                    <TaskItem key={task.id} task={task} userId={session.user.id} />
                  ))}
                </ListGroup>
              </Card>
            ))
          ) : (
            <Card>
              <Card.Body className="text-center py-5">
                <h4>No tasks found</h4>
                <p>You haven't added any tasks to your to-do list yet.</p>
                <Button as={Link} href="/create-todo" variant="primary">
                  Create To-Do List
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url || "/placeholder.svg"}
                    alt="Profile"
                    className="rounded-circle me-3"
                    style={{ width: "60px", height: "60px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="rounded-circle me-3 bg-primary d-flex align-items-center justify-content-center text-white"
                    style={{ width: "60px", height: "60px" }}
                  >
                    {profile?.first_name?.[0]}
                    {profile?.last_name?.[0]}
                  </div>
                )}
                <div>
                  <h5 className="mb-0">
                    {profile?.first_name} {profile?.last_name}
                  </h5>
                  <p className="text-muted mb-0">@{profile?.username}</p>
                </div>
              </div>

              <hr />

              <div className="d-grid gap-2">
                <Button as={Link} href="/create-todo" variant="primary">
                  Create New To-Do List
                </Button>
                <Button as={Link} href="/profile" variant="outline-secondary">
                  Edit Profile
                </Button>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>Task Summary</Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Total Tasks:</span>
                <Badge bg="primary">{userTasks?.length || 0}</Badge>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Completed:</span>
                <Badge bg="success">{userTasks?.filter((task) => task.completed).length || 0}</Badge>
              </div>
              <div className="d-flex justify-content-between">
                <span>Pending:</span>
                <Badge bg="warning">{userTasks?.filter((task) => !task.completed).length || 0}</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

