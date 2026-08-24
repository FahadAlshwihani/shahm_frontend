import { API_PATHS } from "./routes";
import fs from "fs";
import path from "path";

describe("active API contracts", () => {
  test("uses the registered JWT refresh endpoint", () => {
    expect(API_PATHS.auth.refresh).toBe("/accounts/refresh/");
  });

  test("uses the registered CMS public search endpoint", () => {
    expect(API_PATHS.cms.publicSearch).toBe("/cms/public/search/");
  });

  test("domain API modules do not embed request paths", () => {
    const excluded = new Set([
      "axiosClient.js",
      "routes.js",
      "routes.test.js",
    ]);
    const offenders = fs
      .readdirSync(__dirname)
      .filter((file) => file.endsWith(".js") && !excluded.has(file))
      .filter((file) => {
        const source = fs.readFileSync(path.join(__dirname, file), "utf8");
        return /\.(?:get|post|put|patch|delete)\(\s*["'`]/m.test(source);
      });

    expect(offenders).toEqual([]);
  });

  test("active source does not bypass centralized API paths", () => {
    const sourceRoot = path.resolve(__dirname, "..");
    const walk = (directory) =>
      fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) return walk(fullPath);
        return /\.(?:js|jsx)$/.test(entry.name) ? [fullPath] : [];
      });

    const offenders = walk(sourceRoot)
      .filter((file) => !file.endsWith("routes.js") && !file.endsWith(".test.js"))
      .filter((file) => {
        const source = fs.readFileSync(file, "utf8");
        return /(?:fetch|\.(?:get|post|put|patch|delete))\(\s*["'`]\/?(?:api\/|accounts\/|blog\/|cms\/|services\/|forms\/|seo\/)/m.test(source);
      })
      .map((file) => path.relative(sourceRoot, file).replaceAll("\\", "/"));

    expect(offenders).toEqual([]);
  });
});
