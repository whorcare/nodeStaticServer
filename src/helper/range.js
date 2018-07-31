// range范围请求

module.exports =  (totalSize, req, res) => {
	// 在请求头部中拿到range
	const range = req.headers['range'];

	if (!range) { // 如果没有range 直接返回200
		return {code: 200};
	}

	const sizes = range.match(/bytes=(\d*)-(\d*)/);
	const end = sizes[2] || totalSize -1;
	const start = sizes[1] || totalSize - end;

	if (start > end || start < 0 || end > totalSize) {
		return {code: 200};
	}

	res.setHeader('Accept-Ranges', 'bytes');
	res.setHeader('Content-Range', `bytes ${start}-${end}/${totalSize}`);
	res.setHeader('Content-Length', end - start);
	return {
		code: 200,
		start: parseInt(start),
		end: parseInt(end)
	}
}