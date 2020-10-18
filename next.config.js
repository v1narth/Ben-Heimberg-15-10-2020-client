const path = require("path");
const webpack = require("webpack");

module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    }),
    config.resolve.alias["~"] = path.resolve(__dirname);
    config.resolve.alias["@"] = path.resolve(__dirname + "/components");

    
    return config;
  }
};

