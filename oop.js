Function.prototype.EXTEND = function(clazz, prot) {
	var thisf = this;

	function tmpf() {
		for (var prop in prot) {
			this[prop] = prot[prop];
		}
	}
	tmpf.prototype = clazz.prototype;

	function result() {
		var arga = Array.prototype.slice.call(arguments);
		arga.unshift(clazz.bind(this));
		thisf.apply(this, arga);
		if (this.constructor === tmpf && this.__init__ instanceof Function) {
			this.__init__();
			delete this.__init__; /* Give this method no chance to be called twice */
		}
	}
	result.prototype = new tmpf();
	result.prototype.constructor = tmpf;

	return result;
};

Function.prototype.STATIC = function(staticInitializer) {
	staticInitializer.call(this);
	return this;
};

function OVERRIDE(obj, overridingFunctions) {
	for (var funName in overridingFunctions) {
		obj[funName] = overridingFunctions[funName].bind(obj, obj[funName].bind(obj));
	}
}

function __INIT__(obj, init) {
	var inheritedInit = obj.__init__;
	if (inheritedInit instanceof Function) {
		obj.__init__ = function() {
			inheritedInit.call(this);
			init.call(this);
		};
	} else {
		obj.__init__ = init;
	}
}
