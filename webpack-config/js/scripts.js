// Empty JS for your own code to be here
function getDefaultConfig(){

	return {
	    entry: {
	        app: ['./app'] //结合项目填写
	    },
	    output: {
	        path: "../public/dist/", //结合项目填写
	        filename: "[name].bundle.js", //结合项目填写
	    },
	    module: {
	        loaders: []
	    },
	    plugins: []
	}
} 

function getDefalutePackage(){
	return {
		"webpack": ""
	}
}

function getCustomConfig(){
	var config = getDefaultConfig(),
		package = getDefalutePackage();

	$("input[type=checkbox]").each(function(){	
		
		//如果checked为false或者undefined
		if(!$(this).prop("checked")){
			return true;
		}
			
		var name = $(this).attr("name"),
			obj = getObjByName(name);

		if(!obj){
			return true;
		}

		switch(obj.type) {
			case "loaders": 
				config.module.loaders.push(obj.text);
			break;
			case "main":
				for(var i in obj.text){
					config[i] = obj.text[i]
				} 
			break;
			case "plugins": 
				config.plugins.push(obj.text);
			break;
		}

		for(var i in obj.package) {
			package[i] = obj.package[i];
		}

	});
	$("#config").val(JSON.stringify(config, false, 4));	
	$("#package").val(JSON.stringify(package, false, 4));	
}

function getObjByName(name){
	var list = configJson.list; 
	for (var i = 0, max = list.length; i < max; i++) {
		if(list[i].name == name) {
			return list[i]
		}
	}
}

$("input[type=checkbox]").click(function(){	
	getCustomConfig();
});

$("#config").val(JSON.stringify(getDefaultConfig(), false, 4));
$("#package").val(JSON.stringify(getDefalutePackage(), false, 4));





