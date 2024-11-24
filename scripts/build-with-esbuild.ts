import esbuild from "esbuild";
import config from "./esbuild.config";
import { copyFileSync } from "fs";

esbuild.build(config).catch(() => process.exit(1));

copyFileSync("data/rules.db.json", "dist/rules.db.json");
