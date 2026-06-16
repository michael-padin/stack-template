import { prisma } from "../client";
import { exampleItems } from "./example-data";

// Idempotent, re-runnable seed. There's no natural unique key on Item, so we
// find-or-update by title — re-running never duplicates rows.
async function main() {
  console.log(`Seeding ${exampleItems.length} example items…`);

  for (const item of exampleItems) {
    const existing = await prisma.item.findFirst({
      where: { title: item.title, deletedAt: null },
      select: { id: true },
    });

    if (existing) {
      await prisma.item.update({
        where: { id: existing.id },
        data: { description: item.description, status: item.status },
      });
    } else {
      await prisma.item.create({ data: item });
    }
  }

  console.log(`✓ Seeded ${exampleItems.length} items.`);
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
