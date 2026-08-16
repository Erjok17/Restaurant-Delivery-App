import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const menuItems = [
  { name: "Bruschetta", category: "Starters", price: 9, description: "Grilled bread, tomato, basil, garlic.", image: "/images/bruschetta.avif" },
  { name: "Caprese Salad", category: "Starters", price: 11, description: "Fresh mozzarella, tomato, basil, balsamic.", image: "/images/caprese-salad.avif" },
  { name: "Margherita Pizza", category: "Mains", price: 16, description: "San Marzano tomatoes, mozzarella, basil.", image: "/images/Margherita-Pizza.jpg" },
  { name: "Fettuccine Alfredo", category: "Mains", price: 18, description: "House-made pasta, parmesan cream sauce.", image: "/images/Fettuccine-Alfredo.avif" },
  { name: "Osso Buco", category: "Mains", price: 28, description: "Braised veal shank, saffron risotto.", image: "/images/osso-buco.avif" },
  { name: "Tiramisu", category: "Desserts", price: 9, description: "Espresso-soaked ladyfingers, mascarpone.", image: "/images/Tiramisu.jpg" },
  { name: "Panna Cotta", category: "Desserts", price: 8, description: "Vanilla bean cream, berry compote.", image: "/images/panna-cotta.avif" },
  { name: "Italian Espresso", category: "Drinks", price: 4, description: "Rich, bold, classic.", image: "/images/espresso.avif" },
  { name: "House Red Wine", category: "Drinks", price: 10, description: "Glass of our sommelier's pick.", image: "/images/red-wine.avif" },
];

async function main() {
  console.log("Seeding menu items...");
  for (const item of menuItems) {
    await prisma.menuItem.create({ data: item });
  }
  console.log("Done seeding.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });