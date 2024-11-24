import esbuild from "esbuild";
import config from "./esbuild.config";
import { copyFileSync } from "fs";

esbuild
  .build(config)
  .then(() => {
    copyFileSync("data/rules.db.json", "dist/rules.db.json");
  })
  .catch(() => process.exit(1));
