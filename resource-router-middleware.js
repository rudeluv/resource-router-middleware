var Router = require('express').Router;

var keyed = ['get', 'read', 'put', 'patch', 'update', 'del', 'delete'],
	map = { index:'get', list:'get', read:'get', create:'post', update:'put', modify:'patch' };

module.exports = function ResourceRouter(route) {
	var router = Router(),
		key, fn, url;

	// if (route.middleware) router.use(route.middleware);

	if (route.load) {
		router.param(route.id, function(req, res, next, id) {
			route.load(req, id, function(err, data) {
				if (err) return res.status(404).send(err);
				req[route.id] = data;
				next();
			});
		});
	}

	for (key in route) {
		var middleware = route.middleware && route.middleware[key] ? route.middleware[key] : [];
		console.log(middleware);
		fn = map[key] || key;
		if (typeof router[fn]==='function') {
			url = ~keyed.indexOf(key) ? ('/:'+route.id) : '/';
			router[fn](url, ...middleware, route[key]);
		}
	}

	return router;
};

module.exports.keyed = keyed;
