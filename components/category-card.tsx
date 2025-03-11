import { Card } from "react-bootstrap"
import Link from "next/link"

interface CategoryProps {
  category: {
    id: number
    name: string
  }
}

export default function CategoryCard({ category }: CategoryProps) {
  const imagePath = `/images/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}.jpg`

  return (
    <Link href={`/categories/${category.id}`} style={{ textDecoration: "none" }}>
      <Card className="category-card" style={{ backgroundImage: `url(${imagePath})` }}>
        <div className="category-overlay">{category.name}</div>
      </Card>
    </Link>
  )
}

