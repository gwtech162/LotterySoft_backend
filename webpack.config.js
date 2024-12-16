const path = require("path");

module.exports = {
  target: "node",
  mode: "production",
  entry: "./index.js", // Replace with the entry point of your application
  output: {
    path: path.resolve(__dirname, "dist"), // Replace with the desired output directory
    filename: "backend.js", // Replace with the desired output filename
  },
  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      fs: false,
      child_process: false,
      querystring: require.resolve("querystring-es3"),
      http: require.resolve("stream-http"),
      net: require.resolve("net-browserify"),
      zlib: require.resolve("browserify-zlib"),
      assert: require.resolve("assert"),
    },
  },
};
