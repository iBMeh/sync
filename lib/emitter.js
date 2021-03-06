function MakeEmitter(obj) {
    obj.__evHandlers = {};

    obj.on = function (ev, fn) {
        if (!(ev in this.__evHandlers)) {
            this.__evHandlers[ev] = [];
        }
        this.__evHandlers[ev].push({
            fn: fn,
            remove: false
        });
    };

    obj.once = function (ev, fn) {
        if (!(ev in this.__evHandlers)) {
            this.__evHandlers[ev] = [];
        }
        this.__evHandlers[ev].push({
            fn: fn,
            remove: true
        });
    };

    obj.emit = function (ev /*, arguments */) {
        var self = this;
        var handlers = self.__evHandlers[ev];
        if (!(handlers instanceof Array)) {
            handlers = [];
        } else {
            handlers = Array.prototype.slice.call(handlers);
        }

        var args = Array.prototype.slice.call(arguments);
        args.shift();

        handlers.forEach(function (handler) {
            setImmediate(function () {
                handler.fn.apply(self, args);
            });

            if (handler.remove) {
                var i = self.__evHandlers[ev].indexOf(handler);
                if (i >= 0) {
                    self.__evHandlers[ev].splice(i, 1);
                }
            }
        });
    };
}

module.exports = MakeEmitter;
