const fs = require('fs');
const Handlebars = require('handlebars');
const promisify = require('util').promisify; // 让一个回调函数变为promise 风格的函数
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

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
			res.setHeader('Content-Type', 'text/plain');
			res.end(files.join(','));
		}
	} 
	catch(ex)  {
			res.statusCode = 404;
			res.setHeader('Content-Type', 'text/plain');
			res.end('文件不存在');
	}
}