"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Container, Form, Button, Card, Row, Col, ListGroup, Alert } from "react-bootstrap"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth/auth-provider"
import TaskScheduler from "@/components/task-scheduler"

export default function CreateTodoPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedTasks, setSelectedTasks] = useState<number[]>([])
  const [customTask, setCustomTask] = useState("")
  const [scheduledDate, setScheduledDate] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const taskId = searchParams.get("task")
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("*")
      if (data) {
        setCategories(data)
      }
    }

    fetchCategories()
  }, [supabase])

  useEffect(() => {
    if (taskId) {
      const fetchTask = async () => {
        const { data: task } = await supabase.from("tasks").select("*, categories(*)").eq("id", taskId).single()

        if (task) {
          setSelectedCategory(task.category_id)
          setSelectedTasks([task.id])
        }
      }

      fetchTask()
    }
  }, [taskId, supabase])

  useEffect(() => {
    if (selectedCategory) {
      const fetchTasks = async () => {
        const { data } = await supabase.from("tasks").select("*").eq("category_id", selectedCategory)

        if (data) {
          setTasks(data)
        }
      }

      fetchTasks()
    } else {
      setTasks([])
    }
  }, [selectedCategory, supabase])

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = Number.parseInt(e.target.value)
    setSelectedCategory(categoryId || null)
    setSelectedTasks([])
  }

  const handleTaskToggle = (taskId: number) => {
    setSelectedTasks((prev) => {
      if (prev.includes(taskId)) {
        return prev.filter((id) => id !== taskId)
      } else {
        return [...prev, taskId]
      }
    })
  }

  const handleAddCustomTask = async () => {
    if (!customTask.trim() || !selectedCategory) return

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          name: customTask,
          category_id: selectedCategory,
        })
        .select()

      if (error) throw error

      if (data && data[0]) {
        setTasks((prev) => [...prev, data[0]])
        setSelectedTasks((prev) => [...prev, data[0].id])
        setCustomTask("")
      }
    } catch (err) {
      console.error("Error adding custom task:", err)
      setError("Failed to add custom task")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      router.push("/auth/login")
      return
    }

    if (selectedTasks.length === 0) {
      setError("Please select at least one task")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const userTasks = selectedTasks.map((taskId) => ({
        user_id: user.id,
        task_id: taskId,
        completed: false,
        scheduled_for: scheduledDate,
      }))

      const { error } = await supabase.from("user_tasks").insert(userTasks)

      if (error) throw error

      setSuccess("Tasks added to your to-do list successfully!")
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      console.error("Error creating to-do list:", err)
      setError("Failed to create to-do list")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Create To-Do List</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={8}>
            <Card className="mb-4">
              <Card.Body>
                <h4>1. Select a Category</h4>
                <Form.Group className="mb-4">
                  <Form.Select value={selectedCategory || ""} onChange={handleCategoryChange}>
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {selectedCategory && (
                  <>
                    <h4>2. Select Tasks</h4>
                    <ListGroup className="mb-4">
                      {tasks.map((task) => (
                        <ListGroup.Item key={task.id} className="d-flex align-items-center">
                          <Form.Check
                            type="checkbox"
                            id={`task-${task.id}`}
                            checked={selectedTasks.includes(task.id)}
                            onChange={() => handleTaskToggle(task.id)}
                            label={task.name}
                          />
                        </ListGroup.Item>
                      ))}
                    </ListGroup>

                    <h4>3. Add Custom Task (Optional)</h4>
                    <div className="d-flex mb-4">
                      <Form.Control
                        type="text"
                        placeholder="Enter custom task"
                        value={customTask}
                        onChange={(e) => setCustomTask(e.target.value)}
                      />
                      <Button variant="outline-primary" onClick={handleAddCustomTask} className="ms-2">
                        Add
                      </Button>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Body>
                <h4>4. Schedule Tasks</h4>
                <TaskScheduler onDateSelect={setScheduledDate} />

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mt-4"
                  disabled={loading || selectedTasks.length === 0}
                >
                  {loading ? "Creating..." : "Create To-Do List"}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  )
}

