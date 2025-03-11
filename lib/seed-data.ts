import { createClient } from "@/lib/supabase/server"

export async function seedDatabase() {
  const supabase = createClient()

  // Seed categories
  const categories = [
    { name: "ELECTRICAL" },
    { name: "PLUMBING" },
    { name: "MOUNTING" },
    { name: "PRESSURE WASH" },
    { name: "ASSEMBLY" },
    { name: "HAULING" },
    { name: "CLEANING" },
    { name: "HOME REPAIRS" },
    { name: "WELDING" },
    { name: "AUTOMOTIVE" },
    { name: "LANDSCAPING" },
    { name: "DEMOLITION" },
  ]

  const { data: existingCategories } = await supabase.from("categories").select("name")

  if (!existingCategories || existingCategories.length === 0) {
    await supabase.from("categories").insert(categories)
  }

  // Seed tasks
  const tasks = [
    // ELECTRICAL
    { name: "ceiling fans & lights", category_name: "ELECTRICAL" },
    { name: "switches & outlets", category_name: "ELECTRICAL" },
    { name: "smoke detectors", category_name: "ELECTRICAL" },

    // PLUMBING
    { name: "sinks & faucets", category_name: "PLUMBING" },
    { name: "floats & valves", category_name: "PLUMBING" },
    { name: "toilets & wax rings", category_name: "PLUMBING" },

    // MOUNTING
    { name: "tv & sound system", category_name: "MOUNTING" },
    { name: "shelving", category_name: "MOUNTING" },
    { name: "art & mirrors", category_name: "MOUNTING" },
    { name: "hand & shower rails", category_name: "MOUNTING" },

    // PRESSURE WASH
    { name: "residential", category_name: "PRESSURE WASH" },
    { name: "commercial", category_name: "PRESSURE WASH" },
    { name: "auto & RV", category_name: "PRESSURE WASH" },
    { name: "boat & dock", category_name: "PRESSURE WASH" },

    // ASSEMBLY
    { name: "office pieces", category_name: "ASSEMBLY" },
    { name: "furniture", category_name: "ASSEMBLY" },
    { name: "trampolines", category_name: "ASSEMBLY" },
    { name: "sports equiptment", category_name: "ASSEMBLY" },
    { name: "playscapes", category_name: "ASSEMBLY" },

    // HAULING
    { name: "help moving", category_name: "HAULING" },
    { name: "pickups", category_name: "HAULING" },
    { name: "deliveries", category_name: "HAULING" },
    { name: "hot shot", category_name: "HAULING" },

    // CLEANING
    { name: "construction", category_name: "CLEANING" },
    { name: "make ready (rentals)", category_name: "CLEANING" },
    { name: "home & auto", category_name: "CLEANING" },

    // HOME REPAIRS
    { name: "flashing & trim", category_name: "HOME REPAIRS" },
    { name: "drywall patching", category_name: "HOME REPAIRS" },
    { name: "calking & grout", category_name: "HOME REPAIRS" },
    { name: "door locks & frame", category_name: "HOME REPAIRS" },

    // WELDING
    { name: "fence repairs", category_name: "WELDING" },
    { name: "railing repairs", category_name: "WELDING" },
    { name: "gate repairs", category_name: "WELDING" },

    // AUTOMOTIVE
    { name: "tune ups", category_name: "AUTOMOTIVE" },
    { name: "tire, battery & lights", category_name: "AUTOMOTIVE" },
    { name: "simple repairs", category_name: "AUTOMOTIVE" },

    // LANDSCAPING
    { name: "cuts, edge & clean", category_name: "LANDSCAPING" },
    { name: "mulching & weeding", category_name: "LANDSCAPING" },
    { name: "clearing & de-stump", category_name: "LANDSCAPING" },

    // DEMOLITION
    { name: "bathrooms", category_name: "DEMOLITION" },
    { name: "kitchens", category_name: "DEMOLITION" },
    { name: "decks & stairs", category_name: "DEMOLITION" },
  ]

  const { data: existingTasks } = await supabase.from("tasks").select("name")

  if (!existingTasks || existingTasks.length === 0) {
    // Get category IDs
    const { data: categoryData } = await supabase.from("categories").select("id, name")

    if (categoryData) {
      const categoryMap = new Map(categoryData.map((cat) => [cat.name, cat.id]))

      // Map tasks with category IDs
      const tasksWithCategoryIds = tasks.map((task) => ({
        name: task.name,
        category_id: categoryMap.get(task.category_name),
      }))

      await supabase.from("tasks").insert(tasksWithCategoryIds)
    }
  }

  return { success: true }
}

