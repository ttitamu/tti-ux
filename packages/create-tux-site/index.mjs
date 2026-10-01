#!/usr/bin/env node

/**
 * create-tux-site — Interactive project generator for TTI Design System (TUX)
 * Usage:
 *   npm create @tti/ux [project-directory]
 */

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log("\n=======================================================");
  console.log("  TTI-UX Project Scaffolder — Texas A&M Transportation Institute");
  console.log("=======================================================\n");

  const targetDir = process.argv[2] || (await ask("Project directory name: ")) || "my-tux-site";
  const absPath = path.resolve(process.cwd(), targetDir);

  if (fs.existsSync(absPath)) {
    console.error(`\nError: Directory '${targetDir}' already exists.`);
    process.exit(1);
  }

  console.log("\nSelect your target platform:");
  console.log("  [1] Nuxt 4 + Nuxt Studio (Content site / Microsite / Docs)");
  console.log("  [2] React (Vite + @tti/tti-ux-react)");
  console.log("  [3] ASP.NET Core (.NET 8/9 Razor Pages + Tag Helpers)");
  console.log("  [4] Blazor (WebAssembly / Server with Tti.Tux.Blazor)");
  console.log("  [5] WordPress Child Theme (Kadence theme + tti-ux-core plugin)");

  const choice = (await ask("\nEnter choice [1-5] (default 1): ")) || "1";

  fs.mkdirSync(absPath, { recursive: true });

  switch (choice.trim()) {
    case "2":
      scaffoldReact(absPath, targetDir);
      break;
    case "3":
      scaffoldDotNetRazor(absPath, targetDir);
      break;
    case "4":
      scaffoldBlazor(absPath, targetDir);
      break;
    case "5":
      scaffoldWordPress(absPath, targetDir);
      break;
    case "1":
    default:
      scaffoldNuxtStudio(absPath, targetDir);
      break;
  }

  rl.close();
}

function scaffoldNuxtStudio(targetPath, name) {
  const pkg = {
    name,
    private: true,
    type: "module",
    scripts: {
      dev: "nuxt dev",
      build: "nuxt build",
      generate: "nuxt generate",
    },
    dependencies: {
      "@tti/tti-ux": "^2.2.0",
      "@nuxt/content": "^2.13.4",
      "@nuxthq/studio": "^2.0.7",
      nuxt: "^4.4.2",
    },
  };
  fs.writeFileSync(path.join(targetPath, "package.json"), JSON.stringify(pkg, null, 2) + "\n");

  const nuxtConfig = `export default defineNuxtConfig({
  extends: ["@tti/tti-ux"],
  modules: ["@nuxt/content", "@nuxthq/studio"],
});\n`;
  fs.writeFileSync(path.join(targetPath, "nuxt.config.ts"), nuxtConfig);

  const contentDir = path.join(targetPath, "content");
  fs.mkdirSync(contentDir, { recursive: true });

  const indexMd = `---
title: Welcome to ${name}
---

::tux-page-header{eyebrow="TTI Research" title="${name}"}
Empowering transportation innovation.
::

::tux-big-stat{value="100" suffix="%" label="TUX Brand Conformance" tone="maroon"}
::
`;
  fs.writeFileSync(path.join(contentDir, "index.md"), indexMd);

  console.log(`\nCreated Nuxt Studio site in '${targetPath}'.`);
  console.log("To get started:");
  console.log(`  cd ${name}`);
  console.log("  npm install");
  console.log("  npm run dev\n");
}

function scaffoldReact(targetPath, name) {
  const pkg = {
    name,
    private: true,
    type: "module",
    scripts: {
      dev: "vite",
      build: "vite build",
    },
    dependencies: {
      "@tti/tti-ux-react": "^2.2.0",
      react: "^19.0.0",
      "react-dom": "^19.0.0",
    },
    devDependencies: {
      vite: "^6.0.0",
      "@vitejs/plugin-react": "^4.3.0",
    },
  };
  fs.writeFileSync(path.join(targetPath, "package.json"), JSON.stringify(pkg, null, 2) + "\n");

  const appTsx = `import React from 'react';
import { TuxBigStat, useTuxTheme } from '@tti/tti-ux-react';
import '@tti/tti-ux-react/styles.css';

export default function App() {
  const { theme, toggleTheme } = useTuxTheme();
  return (
    <div style={{ padding: '2rem' }}>
      <h1>${name}</h1>
      <button onClick={toggleTheme}>Toggle Theme (current: {theme})</button>
      <TuxBigStat value="47.2" suffix="TB" label="Indexed corpora" tone="maroon" />
    </div>
  );
}
`;
  const srcDir = path.join(targetPath, "src");
  fs.mkdirSync(srcDir, { recursive: true });
  fs.writeFileSync(path.join(srcDir, "App.tsx"), appTsx);

  console.log(`\nCreated React site in '${targetPath}'.`);
  console.log("To get started:");
  console.log(`  cd ${name}`);
  console.log("  npm install");
  console.log("  npm run dev\n");
}

function scaffoldDotNetRazor(targetPath, name) {
  console.log(`\nTo scaffold ASP.NET Core Razor Pages with TUX Tag Helpers:`);
  console.log(`  dotnet new webapp -n ${name}`);
  console.log(`  cd ${name}`);
  console.log(`  dotnet add package Tti.Tux.AspNetCore --source https://code.tti.tamu.edu/api/packages/tti/nuget/index.json`);
  console.log(`  # Add '@addTagHelper *, Tti.Tux.AspNetCore' to _ViewImports.cshtml\n`);
}

function scaffoldBlazor(targetPath, name) {
  console.log(`\nTo scaffold Blazor with TUX Component Library:`);
  console.log(`  dotnet new blazor -n ${name}`);
  console.log(`  cd ${name}`);
  console.log(`  dotnet add package Tti.Tux.Blazor --source https://code.tti.tamu.edu/api/packages/tti/nuget/index.json\n`);
}

function scaffoldWordPress(targetPath, name) {
  console.log(`\nTo set up a TTI WordPress site:`);
  console.log(`  1. Install Kadence Theme: https://www.kadencewp.com/`);
  console.log(`  2. Install the 'tti-ux-core' plugin from packages/wordpress/tti-ux-core`);
  console.log(`  3. Activate Kadence Child Theme and enable TUX Block Patterns in Gutenberg.\n`);
}

main().catch(console.error);
