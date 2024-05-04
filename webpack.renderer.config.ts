import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";

rules.push(
  {
    test: /\.css$/,
    use: [{ loader: "style-loader" }, { loader: "css-loader" }],
  },
  {
    test: /\.svg$/,
    use: [
      {
        loader: "@svgr/webpack",
      },
    ],
  },
  {
    test: /\.(png|jpe?g|gif|ico)$/i,
    use: [
      {
        loader: "file-loader",
      },
    ],
  }
);

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
  },
};
