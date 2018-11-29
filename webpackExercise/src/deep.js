import {myVue} from './vue.js';
var tS = Object.prototype.toString;
export function deepMerge(from,to){
	// debugger
	if(tS.call(to) === '[object Object]'){
		from = from ? from : {};
		for(var key in to){
			from[key] = deepMerge({},to[key]);
		}
		// debugger;
		return from;
	}else if(tS.call(to) === '[object Array]'){
		from = from ? from : [];
		for(var i = 0;i < to.length;i++){
			from[i] = deepMerge([],to[i]);
		}
		return from;
	}else{
		return to;
	}
}