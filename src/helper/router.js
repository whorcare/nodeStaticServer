const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars'); // 模板文件npm包
const promisify = require('util').promisify; // 让一个回调函数变为promise 风格的函数
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const config = require('../config/defaultConfig');

const tplPath = path.join(__dirname, '../template/dir.tpl'); // __dirname 访问路径
const source = fs.readFileSync(tplPath); // 同步获取文件路径
const template = Handlebars.compile(source.toString());

// 暴露出一个 async方法
// async函数的使用方式，直接在普通函数前面加上async，表示这是一个异步函数，在要异步执行的语句前面加上await，表示后面的表达式需要等待
module.exports = async function (req, res, filePath) {
	try {
		const stats = await stat(filePath); // 获取文件信息

		// 如果是个文件 那么返回文件内容
		if (stats.isFile()) {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'text/plain');
			// createReadStream返回一个readStream（文件读取流，输入流）对象。（可读流）
			// pipe -> 流数据方式
			fs.createReadStream(filePath).pipe(res);
		}
		else if (stats.isDirectory()) { // 如果是一个文件夹
			const files = await readdir(filePath);
			res.statusCode = 200;
			res.setHeader('Content-Type', 'text/html');
			const dir = path.relative(config.root, filePath); // path.relative() 方法返回从 from 到 to 的相对路径（基于当前工作目录）
			const data = {
				title: path.basename(filePath), // 文件名 path.basename() 方法返回一个 path 的最后一部分
				dir: dir ? `/${dir}` : '', 
				files
			};
			res.end(template(data));
			// res.end(files.join(','));
		}
	} 
	catch(ex)  {
			console.log(ex.toString());
			res.statusCode = 404;
			res.setHeader('Content-Type', 'text/plain');
			res.end('文件不存在');
	}
}