import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "cjs",
    intend: false
  },
  external: ["lodash", "redux", "reselect"],
  plugins: [resolve(), typescript({ useTsconfigDeclarationDir: true })]
};
