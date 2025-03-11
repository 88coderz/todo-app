"use client"

import type React from "react"

import { useState } from "react"
import { Form } from "react-bootstrap"

interface TaskSchedulerProps {
  onDateSelect: (date: string | null) => void
}

export default function TaskScheduler({ onDateSelect }: TaskSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value
    setSelectedDate(date)
    updateScheduledDateTime(date, selectedTime)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value
    setSelectedTime(time)
    updateScheduledDateTime(selectedDate, time)
  }

  const updateScheduledDateTime = (date: string, time: string) => {
    if (date && time) {
      const dateTime = `${date}T${time}:00`
      onDateSelect(dateTime)
    } else {
      onDateSelect(null)
    }
  }

  // Generate next 14 days for the date picker
  const generateDateOptions = () => {
    const dates = []
    const today = new Date()

    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const formattedDate = date.toISOString().split("T")[0]
      dates.push(formattedDate)
    }

    return dates
  }

  return (
    <div>
      <Form.Group className="mb-3">
        <Form.Label>Select Date</Form.Label>
        <Form.Control
          type="date"
          min={new Date().toISOString().split("T")[0]}
          value={selectedDate}
          onChange={handleDateChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Select Time</Form.Label>
        <Form.Control type="time" value={selectedTime} onChange={handleTimeChange} />
      </Form.Group>

      {selectedDate && selectedTime && (
        <div className="alert alert-info">
          Scheduled for: {new Date(`${selectedDate}T${selectedTime}`).toLocaleString()}
        </div>
      )}
    </div>
  )
}

