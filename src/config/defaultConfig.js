module.exports = {
	root: process.cwd(), // process cwd()方法返回 Node.js 进程当前工作的目录。
	hostname: '127.0.0.1',
	port: 9527,
	compress: /\.(html|js|css|md)/,
	cache: {
		maxAge: 600,
		expires: true,
		cacheControl: true,
		lastModified: true,
		etag: true,
	}
}