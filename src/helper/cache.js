// 服务器缓存设置

const {cache} = require('../config/defaultConfig');

function refreshRes(stats, res) {
	const {maxAge, expires, cacheControl, lastModified, etag} = cache;

	if (expires) {
		res.setHeader('Expires', newDate(Date.now() + maxAge * 1000).toUTCString());
	}

	if (cacheControl) { // 在多少时间内可用缓存
		res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
	}

	if (lastModified) {
		res.setHeader('Last-Modified', stats.mtime);
	}

	if (etag) {
		res.setHeader('ETag', `${stats.size}-${stats.mtime}`);
	}
}

module.exports = function isFresh(stats, req, res) {
	refreshRes(stats, res);

	const lastModified = req.headers['if-modifed-since'];
	const etag = res.headers['if-none-match'];

	// 如果客户端俩个信息都没有 说明是第一次请求
	if (!lastModified && !etag) {
		return false;
	}

	if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
		return false;
	}

	return true;
};