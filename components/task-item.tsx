"use client"

import { useState } from "react"
import { ListGroup, Form, Badge, Button } from "react-bootstrap"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Trash } from "react-bootstrap-icons"

interface TaskItemProps {
  task: any
  userId: string
}

export default function TaskItem({ task, userId }: TaskItemProps) {
  const [completed, setCompleted] = useState(task.completed)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleToggleComplete = async () => {
    setLoading(true)

    try {
      const { error } = await supabase
        .from("user_tasks")
        .update({ completed: !completed })
        .eq("id", task.id)
        .eq("user_id", userId)

      if (error) throw error

      setCompleted(!completed)
    } catch (err) {
      console.error("Error updating task:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return

    setLoading(true)

    try {
      const { error } = await supabase.from("user_tasks").delete().eq("id", task.id).eq("user_id", userId)

      if (error) throw error

      router.refresh()
    } catch (err) {
      console.error("Error deleting task:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ListGroup.Item className="d-flex align-items-center">
      <Form.Check
        type="checkbox"
        checked={completed}
        onChange={handleToggleComplete}
        disabled={loading}
        className="me-3"
      />
      <div className="flex-grow-1">
        <div className={completed ? "text-decoration-line-through text-muted" : ""}>{task.tasks.name}</div>
        <div className="d-flex align-items-center mt-1">
          <Badge bg="secondary" className="me-2">
            {task.tasks.categories.name}
          </Badge>
          {task.scheduled_for && (
            <small className="text-muted">
              {new Date(task.scheduled_for).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
          )}
        </div>
      </div>
      <Button variant="link" className="text-danger p-0 ms-2" onClick={handleDelete} disabled={loading}>
        <Trash />
      </Button>
    </ListGroup.Item>
  )
}

