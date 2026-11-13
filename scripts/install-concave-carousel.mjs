import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");
if (!process.env.REACTBITS_LICENSE_KEY?.trim()) {
  console.error(
    "Concave Carousel installation is pending: set REACTBITS_LICENSE_KEY in .env.local. No key was printed or sent.",
  );
  process.exit(1);
}
const result = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["shadcn@latest", "add", "@reactbits-starter/concave-carousel-tw", "--yes"],
  { stdio: "inherit", env: process.env, shell: process.platform === "win32" },
);
if (result.error)
  console.error(
    "The component installer could not start. Check that npm is installed and available.",
  );
process.exit(result.status ?? 1);
