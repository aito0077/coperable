/*
 * NoGray JavaScript Library v1.0
 * http://www.NoGray.com
 *
 * Copyright (c) 2009 Wesam Saif
 * http://www.nogray.com/license.php
 */
 
// translation was done using Google Translation
ng.Language.set_language('zh', {
	direction: 'ltr',
	
	numbers: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
	numbers_ordinal: ['', '', '', ''], //['st', 'nd', 'rd', 'th'],
	
	date: {
		date_format: 'm/d/Y',
		time_format: 'h:i a',
		
		days:{
			'char':['周日','周一','周二','周三','周四','周五','周六'],
			short:['周日','周一','周二','周三','周四','周五','周六'],
			mid:['周日','周一','周二','周三','周四','周五','周六'],
			'long':['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
		},
		months:{
			short:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
			'long':['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
		},
		am_pm:{
			lowercase:['上午','下午'],
			uppercase:['上午','下午']
		}	
	},
	
	yes: '是的',
	no: '无',
	
	'open': '打开',
	'close': '关闭',
	clear: '清除'
});

ng.Language.zh_translate_numbers=function(b){var a=ng.Language.get_language("zh").numbers;b=(b+"").replace(/\d+/g,function(d){return c(d);function c(j){j=j+"";if(e(j)){return j.replace(/\d/g,a[0])}var g=["","十","百","千","万","亿"];var f=j.length;var o=false;var m="";if(f>8){m+=c(j.substr(0,f-8))+g[5];j=j.substr(f-8);f=j.length;o=true}if(e(j)){return m}if(f>5){m+=c(j.substr(0,f-5)+"0");j=j.substr(f-5);f=j.length;o=true}var h,p;for(var i=f;i>0;i--){h=j.substr(0,1);p=j.substr(1);if(h=="0"){if(p.substr(0,1)!="0"){m+=a[0]}if(o){m+=g[i-1]}o=false}else{if(h==1){if(p.length!=1){m+=a[h]}}else{if(h!="1"){m+=a[h]}}m+=g[i-1]}if(e(p)){return m}j=p}return m}function e(g){for(var h=0;h<g.length;h++){if(g.charAt(h)!="0"){return false}}return true}});return b};ng.Language.zh_numbers_to_english=function(l){var n=-1,m=-1,f="",h=0;var g=["零","一","二","三","四","五","六","七","八","九","十","百","千","万","亿"];var o=ng.Language.get_language("zh").numbers;var k=l.length;var b=l;var p={};for(var e=0;e<l.length;e++){if(g.has(l.charAt(e))){n=e;for(var d=e;d<l.length;d++){if(!g.has(l.charAt(d))){m=d;break}}if(m==-1){m=l.length}if(n!=m){f=l.substr(n,m-n);p[f]=c(f);l=l.substr(0,n)+(new Array(m-n+1).join("."))+l.substr(m)}n=m=-1}}function c(r){var t=0;r=r+"";if(a(r)==r.length){return new Array(r.length+1).join("0")}var q=["亿","万","千","百","十"];var j=[100000000,10000,1000,100,10];for(var s=0;s<q.length;s++){var w=r.indexOf(q[s]);if(w!=-1){if(w>0){var v=c(r.substr(0,w))}else{var v=1}t+=j[s]*v;r=r.substr(w+1);var u=a(r);if(u>0){r=r.substr(u)}}}for(var s=0;s<o.length;s++){if(r.indexOf(o[s])!=-1){t+=s}}return t}function a(i){var j=0;if(i.length>1){while(i.charAt(j)==o[0]){j++}}return j}ng.obj_each(p,function(j,i){b=b.replace(i,j)});return b};
