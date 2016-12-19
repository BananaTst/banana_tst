var project_url_prefix = "/project";
var config = {
    routes:{
        mount_path:'*/routes/*',// 路由挂载路径
        is_debug:true,// 是否开启调试模式
        mappings: {
            '/common/core/routes/': project_url_prefix,//默认路径
            '/project/routes/': project_url_prefix + '/api/'
        },
        welcome_path: 'index'
    },
}
module.exports = config;
