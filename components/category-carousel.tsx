"use client"

import { Carousel } from "react-bootstrap"
import Link from "next/link"

interface CategoryCarouselProps {
  categories: {
    id: number
    name: string
  }[]
}

export default function CategoryCarousel({ categories }: CategoryCarouselProps) {
  return (
    <Carousel>
      {categories.map((category) => (
        <Carousel.Item key={category.id}>
          <div
            style={{
              height: "300px",
              backgroundImage: `url(/images/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            ></div>
          </div>
          <Carousel.Caption>
            <h3>{category.name}</h3>
            <Link href={`/categories/${category.id}`} className="btn btn-primary mt-2">
              View Tasks
            </Link>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

