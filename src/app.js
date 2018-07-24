const http = require('http');
const chalk = require('chalk');
const path = require('path');
const conf = require('./config/defaultConfig');
const router = require('./helper/router');

const server = http.createServer((req, res) => {
	const url = req.url; // 用户路径
	// path.join() 方法使用平台特定的分隔符把全部给定的 path 片段连接到一起，并规范化生成的路径。
	const filePath = path.join(conf.root, url); // 拿到用户访问的路径

	router(req, res, filePath);
});

// 开启HTTP服务器监听连接。方法与net.Server的server.listen()相同
server.listen(conf.port, conf.hostname, () => {
	const addr = `http://${conf.hostname}:${conf.port}`;

	console.info(`Server started at ${chalk.green(addr)}`)
});