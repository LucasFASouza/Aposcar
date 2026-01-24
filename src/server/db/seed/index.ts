const year = process.argv[2] ?? "2026";

const validYears = ["2025", "2026"];

if (!validYears.includes(year)) {
  console.error(`Invalid year: ${year}`);
  console.error(`Valid years: ${validYears.join(", ")}`);
  process.exit(1);
}

console.log(`Seeding data for year ${year}...`);

await import(`./${year}.ts`);
