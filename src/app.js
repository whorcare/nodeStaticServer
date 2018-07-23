const http = require('http');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const promisify = require('util').promisify; // 让一个回调函数变为promise 风格的函数
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const conf = require('./config/defaultConfig');

const server = http.createServer((req, res) => {
	const url = req.url; // 用户路径

	// path.join() 方法使用平台特定的分隔符把全部给定的 path 片段连接到一起，并规范化生成的路径。
	const filePath = path.join(conf.root, url); // 拿到用户访问的路径

	// 获取文件信息
	fs.stat(filePath, (err, stats) => {
		if (err) {
			res.statusCode = 404;
			res.setHeader('Content-Type', 'text/plain');
			res.end('文件不存在');
			return;
		}

		// 如果是个文件 那么返回文件内容
		if (stats.isFile()) {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'text/plain');
			// createReadStream返回一个readStream（文件读取流，输入流）对象。（可读流）
			// pipe -> 流数据方式
			fs.createReadStream(filePath).pipe(res);
		} 
		else if (stats.isDirectory()) { // 如果是一个文件夹
			fs.readdir(filePath, (err, files) => { // 异步的readdir  files=>文件名数组
				res.statusCode = 200;
				res.setHeader('Content-Type', 'text/plain');
				res.end(files.join(','));
			})
		}
	});
});

// 开启HTTP服务器监听连接。方法与net.Server的server.listen()相同
server.listen(conf.port, conf.hostname, () => {
	const addr = `http://${conf.hostname}:${conf.port}`;

	console.info(`Server started at ${chalk.green(addr)}`)
});