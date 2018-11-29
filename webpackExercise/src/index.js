import _ from 'lodash';
import {myVue} from './vue.js';
import {deepMerge} from './deep.js';
import {square,cube} from './math.js';
// import {print} from './print.js';

function component(){
	console.log(myVue);
	var element = document.createElement('div');
	var btn = document.createElement('button');

	btn.innerHTML = "Click me";

	btn.onclick = function(){
		var obj = deepMerge({name:'jack'},{
			names:{
				name1:"jack",
				name2:"tom"
			},
			age:12
		});
		var age = square(obj.age);
		print(obj);
		print(age);
		require.ensure(['./another.js'],function(require){
			console.log(num)
			console.log(require('./jquery.js'))
		},'jq')
	}
	element.appendChild(btn);
	return element;
}

document.body.appendChild(component());