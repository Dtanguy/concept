var stringSimilarity = require('string-similarity');
var concepts = [];
var verbose = true;

function init(op){
	if(op){
		verbose = op.verbose;
	}
}

function add(name, syn){
	
	if(name && syn){		
		//If doesn't exist, create the concept
		if(!concepts[name]){
			concepts[name] = [];
		}
		
		//If parameter is an array
		if(Array.isArray(syn)){
			for(var i = 0; i < syn.length; i++){
				concepts[name].push(syn[i]);
			}		
		//else
		}else{
			concepts[name].push(syn);
		}
	}
	
}

function rm(name, syn){
	if(name && syn){
	
	}
}

function get(name){
	if(!concepts[name]){
		return [];
	}
	return concepts[name];
}



function findCmd(delim, str){
	
	if(!delim || ! str){
		return;
	}
	
	//Cleaning
	var cleanStr = cleanString(str);
	if (verbose){
		console.log('cleanStr : ' + cleanStr.join(' '));
	}
	
	//FindRepet
	var repeatStr = FindRepet(cleanStr);
	if (verbose){
		console.log('FindRepet : ' + repeatStr.join(' '));
	}
	
	//Extract direct cmd
	var cmd = extractCmd(delim, repeatStr);
	if (verbose){
		console.log('cmd : ' + cmd.join(', '));
	}
	
	return cmd;
}



function find(str, param){
	
	if(! str){
		return;
	}
	
	//Cleaning
	var cleanStr = cleanString(str);
	if (verbose){
		console.log('cleanStr : ' + cleanStr.join(' '));
	}
	
	//FindRepet
	var repeatStr = FindRepet(cleanStr);
	if (verbose){
		console.log('FindRepet : ' + repeatStr.join(' '));
	}
	
	//Generate possibility array
	var gArray = generateArray(repeatStr);
	if (verbose){
		console.log('gArray : \n' + gArray.join('\n') );
	}
	
	//add additional parameter
	if(param){
		if(Array.isArray(param)){
			for(var i = 0; i < param.length; i++){
				gArray.push(param[i]);
			}		
		}else{
			gArray.push(param);
		}
	}

	//Extract concepts		
	var findConspt = extractConspt(gArray);
	if (verbose){
		console.log('concepts : ' + findConspt.join(', '));	
	}	
	return findConspt;	
}



/********************************************************* Analyse *******************************************************/

/* cleaning the input */
function cleanString(str){
	var tmp = str.toLowerCase();
	tmp = RemoveAccents(tmp);
	tmp = tmp.replace(/'/g, "' ");		
	var toSpace = ['.','?','!',',',';','+','-','/','*','(',')','[',']','{','}','"',':','>','<']; //'='
	for(var i = 0; i < toSpace.length; i++){
		tmp = tmp.replace(toSpace[i], ' ' + toSpace[i] + ' ');
	}
	tmp = ' ' + tmp + ' ';
	tmp = tmp.replace(/ {2,}/g, ' ');		
	var sentence = tmp.split(" ");
	sentence.shift();
	sentence.splice(-1,1);	
	return sentence;	
}


/* FindRepet */
function FindRepet(str){
	var res = [];
	for(var i = 0; i < str.length; i++){
		
		var word = str[i][0];
		for(var j = 1; j < str[i].length; j++){			
			if (str[i][j] != str[i][j-1]){
				word += str[i][j];
			}			
		}
		
		res.push(str[i]);
		if(word != str[i]){
			res.push(word);
		}		
		
	}
	return res;
}


/* extract direct cmd */
function extractCmd(delim, wordArray){
	var tmpCmd = [];
	for(var i = 0; i < wordArray.length; i++){
		if(wordArray[i][0] == delim){
			tmpCmd.push(wordArray[i]);
		}
	}
	return tmpCmd;
}


/* Generate array with all the word or sentence possibility */
function generateArray(str){	
	var testAr = [];
		for(var i = 0; i <= str.length; i++){
			for(var j = i; j <= str.length; j++){				
			var tmp = str.slice(i, j);
			if (tmp != '' /*&& testAr.indexOf(tmp) < 0*/){
				testAr.push(tmp.join(' '));
			}				
		}
	}
	return testAr;
}


/* if the array contain at least one element of the other array */
function contain(gArray, keyWord){
	if(!gArray || !keyWord || keyWord.length == 0 || gArray.length ==0){
		return false;
	}
	for(var i = 0; i < keyWord.length; i++){
		keyWord[i] = RemoveAccents(keyWord[i].toLowerCase());
	}
	for(var i = 0; i < gArray.length; i++){
		var res = stringSimilarity.findBestMatch(gArray[i], keyWord).bestMatch;		
		if (res && res.rating > 0.7) {
			return true;
		}
	}
	return false;
}


/* return a random menber of the array */
function respond(keyWord){
	var nb = Math.trunc(Math.random() * keyWord.length);	
	return keyWord[nb];
}


/* extract concepts cmd */
function extractConspt(gArray){
	var tmpConspt = [];	
	for(cons in concepts){
		if (contain(gArray, concepts[cons])){
			tmpConspt.push(cons);
			//console.log('Find : ' + cons);
		}		
	}
	return tmpConspt;
}


/* remove accent */
function RemoveAccents(strAccents) {
	var strAccents = strAccents.split('');
	var strAccentsOut = new Array();
	var strAccentsLen = strAccents.length;
	var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
	var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
	for (var y = 0; y < strAccentsLen; y++) {
	if (accents.indexOf(strAccents[y]) != -1) {
		strAccentsOut[y] = accentsOut.substr(accents.indexOf(strAccents[y]), 1);
	} else
		strAccentsOut[y] = strAccents[y];
	}
	strAccentsOut = strAccentsOut.join('');
	return strAccentsOut;
}


function strcmp(str1, str2){
	if(!str1 || !str2){
		return 0;
	}
	var str3 = [];
	str3.push(str2);
	var res = stringSimilarity.findBestMatch(str1, str3).bestMatch;
	return res.rating;
}


module.exports.strcmp = strcmp;
module.exports.init = init;
module.exports.add = add;
module.exports.rm = rm;
module.exports.get = get;
module.exports.findCmd = findCmd;
module.exports.find = find;
