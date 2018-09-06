// 数据库管理服务

// 文件位置
var curPath = require.resolve("./index.js").replace("index.js", "");

// LZR 子模块加载
LZR.load([
	"LZR.Node.Util",
	"LZR.Node.Router",
	"LZR.Base.Json",
	"LZR.Base.Time",
	"LZR.Node.Router.ComTmp",
	"LZR.Node.Router.QryTmp"
]);

// 创建路由
var r = new LZR.Node.Router ({
	path: curPath
});

// 需要用到的工具
var tools = {
	utTim: LZR.getSingleton(LZR.Base.Time),
	utNode: LZR.getSingleton(LZR.Node.Util),
	qryRo: new LZR.Node.Router.QryTmp({
		ro: r,
		conf: (process.env.OPENSHIFT_MONGODB_DB_URL || "mongodb://localhost:27017/test"),	// 数据库连接字
		pvs: {
			"tim": 1,	// 数值型
			"_id": 2	// id
		},
		addC: {		// 此处设置的属性保证唯一值
			tim: null
		}
	}),
	tmpRo: new LZR.Node.Router.ComTmp({		// 常用模板
		ro: r,
		dmIds: "io_home"	// 模板中用到的域名
	})
};

// 用于给主路由使用自己的工具类
r.getTls = function () {
	return tools;
}

/**************** 模板 **********************/
r.get("/v/qry_vs/", function (req, res, next) {
	var o = LZR.fillPro(req, "qpobj.tmpo.qry");
	o.k = "tim";
	next();
});

tools.qryRo.init("/v/");

tools.tmpRo.initTmp("/v/", "tmp", {
	utJson: LZR.getSingleton(LZR.Base.Json),
	utTim: tools.utTim
});

tools.tmpRo.initDms();

module.exports = r;
