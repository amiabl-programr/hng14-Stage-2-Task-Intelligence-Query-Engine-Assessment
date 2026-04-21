import {prisma} from './src/lib/prisma.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {  uuidv7 } from 'uuidv7';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


interface SeedProfile {
  name: string;
  gender: string;
  gender_probability: number;
  age: number;
  age_group: string;
  country_id: string;
  country_name: string;
  country_probability: number;
}

async function main() {
  try {
    console.log('Starting seed...');

    // Read the seed file
    const seedPath = path.join(__dirname, 'seed_profiles.json');
    const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

    const profiles: SeedProfile[] = seedData.profiles;

    console.log(`Found ${profiles.length} profiles to seed`);

    // Check existing profiles to avoid duplicates
    const existingCount = await prisma.profile.count();
    console.log(`Existing profiles in database: ${existingCount}`);

    // Seed profiles - skip if name already exists
    let createdCount = 0;
    let skippedCount = 0;

    for (const profile of profiles) {
      const existing = await prisma.profile.findUnique({
        where: { name: profile.name },
      });

      if (existing) {
        skippedCount++;
        continue;
      }

      await prisma.profile.create({
        data: {
          id: uuidv7(),
          name: profile.name,
          gender: profile.gender,
          gender_probability: profile.gender_probability,
          age: profile.age,
          age_group: profile.age_group,
          country_id: profile.country_id,
          country_name: profile.country_name,
          country_probability: profile.country_probability,
        },
      });

      createdCount++;

      // Log progress every 100 records
      if ((createdCount + skippedCount) % 100 === 0) {
        console.log(`Progress: ${createdCount + skippedCount}/${profiles.length}`);
      }
    }

    console.log(`\nSeed completed!`);
    console.log(`Created: ${createdCount} profiles`);
    console.log(`Skipped: ${skippedCount} profiles (already exist)`);
    console.log(`Total in database: ${await prisma.profile.count()}`);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
