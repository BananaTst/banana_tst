var fs = require('fs');
var requireDirectory = require('require-directory');
var routes = requireDirectory(module, '../routes');
var stack = [];

var config = require('../../../../config');
var mount_path = config.routes.mount_path;
var mappings = config.routes.mappings;
var apputils = require('./app_utils');

function mount(app) {
    var r = arguments[1] || routes;
    var pre = arguments[2] || '';

    for (var k in r) {
        var file = '/' + pre + '' + k + '.js';
        var path = '';
        if(typeof r[k] == 'object') {
            mount(app, r[k], pre + k + '/');
        }else if(k === 'index') {
            path = '/'+ pre;
            _use(app, file, path, r[k], '');
        }else {
            path = '/'+ pre;
            _use(app, file, '/' + pre, r[k], k);
        }
    }
}

function _use(app, file, path, handler,suffixPath) {
    if(apputils.wildcard(mount_path, path)) {
        if(mappings[path]) {
            //路由映射
            var newPath = mappings[path] + suffixPath;
                app.use(newPath, handler);
                _track_routes(file, newPath, handler.stack);
        }
    }
}

function _track_routes(file, path, handle) {
    for(var i in handle){
        var _route = handle[i].route;
        for(var j in _route.methods){
            if(_route.path == '/'){
                _cache_to_stack(file, path, j);
            }else{
                if(path == '/') {
                    _cache_to_stack(file, _route.path, j);
                }
                else {
                    _cache_to_stack(file, path + _route.path, j);
                }
            }
        }
    }
}

function _cache_to_stack(file, path, method) {
    stack.push({
        file    : file,
        method  : method,
        path    : path
    });
}

function _dump(routes_folder_path) {
    var Table = require('cli-table');
    var table = new Table({ head: ["File", "Method", "Path"] });

    console.log('\n******************************************************');
    console.log('\t\tMoaJS Apis Dump');
    console.log('******************************************************\n');
    for (var k in stack) {
        var obj = stack[k];
        table.push(
            [routes_folder_path + obj.file, obj.method, obj.path]
        );
    }
    console.log(table.toString());
}

function mount_with_folder(app, routes_folder_path) {
    stack = [];// empty when enter
    var r         = arguments[1] || routes;
    var is_debug  = arguments[2] || false;

    routes = requireDirectory(module, r);
    mount(app) ;

    if(is_debug){
        _dump (routes_folder_path);
    }
}

module.exports = mount_with_folder;