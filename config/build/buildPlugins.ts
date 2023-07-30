import HTMLWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";
import {BuildOptions} from "./types/config";
// @ts-ignore
import ModuleFederationPlugin from 'webpack/lib/container/ModuleFederationPlugin'
const { name, dependencies: deps } = require('../../package.json')

export function buildPlugins({paths}: BuildOptions): webpack.WebpackPluginInstance[] {

    return [
        new ModuleFederationPlugin({
            name,
            shared: { 'react@^18.2.0': { singleton: true }, 'react-dom@^18.2.0': { singleton: true } },
            filename: 'remoteEntry.js',
            exposes: {
                "./WeatherBlock": "./src/components/WeatherWidget",
            },
            remotes: {},
        }),
        new HTMLWebpackPlugin({
            template: paths.html,
        }),
        new webpack.ProgressPlugin(),
    ]
}
