// 压缩文件gzip
const {createGzip, createDeflate} = require('zlib'); // node封装好的压缩方法

module.exports = (rs, req, res) => {
	// 获取浏览器支持的压缩方式
	const acceptEncoding = req.headers['accept-encoding'];

	if (!acceptEncoding || acceptEncoding.match(/\b(gzip|deflate)\b/)) { // 如果浏览器不支持
		return rs;
	} else if (acceptEncoding.match(/\bgzip\b/)) {
		res.setHeader('Content-Encoding', 'gzip');
		return rs.pipe(createGzip());
	} else if (acceptEncoding.match(/\bdeflate\b/)) {
		res.setHeader('Content-Encoding', 'deflate');
		return rs.pipe(createDeflate());
	}
};