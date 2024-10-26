/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude `onnxruntime-node` from Webpack bundling to let Node handle it
      config.externals.push({
        "onnxruntime-node": "commonjs onnxruntime-node"
      })

      // Optional: Configure node-loader if you need to handle .node files
      config.module.rules.push({
        test: /\.node$/,
        use: "node-loader"
      })
    }
    return config
  }
}

export default nextConfig
