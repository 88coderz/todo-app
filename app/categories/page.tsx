import { Container, Row, Col } from "react-bootstrap"
import { createClient } from "@/lib/supabase/server"
import CategoryCard from "@/components/category-card"
import CategoryCarousel from "@/components/category-carousel"

export default async function CategoriesPage() {
  const supabase = createClient()

  const { data: categories } = await supabase.from("categories").select("*")

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Service Categories</h1>

      {/* Mobile View - Carousel */}
      <div className="d-block d-md-none">
        <CategoryCarousel categories={categories || []} />
      </div>

      {/* Desktop View - Grid */}
      <div className="d-none d-md-block">
        <Row>
          {categories?.map((category) => (
            <Col key={category.id} md={4} className="mb-4">
              <CategoryCard category={category} />
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  )
}

