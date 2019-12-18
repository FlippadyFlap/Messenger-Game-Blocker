let localBlacklist = []


const getBlacklist = function(){
	return new Promise((resolve)=> {
		chrome.storage.local.get("blacklist", function(dbData){
			resolve(dbData.blacklist)
		})
	})
}


const setBlacklist = function(blacklist){
	return new Promise((resolve)=> {
		chrome.storage.local.set({"blacklist" : blacklist}, function(){
			resolve(true)
		})
	})
}


const updateBlacklist = async function(name){
		let newList = await getBlacklist()
		newList.push(name)
		setBlacklist(newList).then(()=>{updateLocalBlacklist()})
}

const removeFromBlacklist = async function(name){
		let newList = await getBlacklist()
		let index = newList.indexOf(name)
		newList.splice(index, 1)
		setBlacklist(newList).then(()=>{updateLocalBlacklist()})
	
} 

const updateLocalBlacklist = async function(){
		localBlacklist = await getBlacklist()
		updateEmptyMessage()
}

const firstTimeSetup = function(name){
	getBlacklist().then((data)=>{
		localBlacklist = data
		populateBlockedList()
	})
}


const populateBlockedList = function(){

	let list = document.getElementById('blockedList')

	localBlacklist.forEach((name)=>{
		list.appendChild(newListItem(name))
	})

	if (localBlacklist.length === 0){
		updateEmptyMessage()
	}
}


window.onload = function() {
	firstTimeSetup()
	
	document.getElementById('submitBtn').addEventListener('click', addListItem)
}

const updateEmptyMessage = function (){
	console.log("EMPTY MESSAGE TEST")
	console.log(localBlacklist)
	if(localBlacklist.length === 0){
		console.log("EMPTY MESSAGE BLACKLIST ENTERED")
		if (document.getElementById("\\BLANK") === null){
			console.log("NO BLANK FOUND")
			let list = document.getElementById('blockedList')
			let blank = document.createElement('li')
			blank.innerText = "There's nothing on your blacklist! Add some in the box below!"
			blank.id = "\\BLANK"
			list.appendChild(blank)
		}
	}
	else if(localBlacklist.length > 0){
		console.log("NON EMPTY MESSAGE BLACKLIST ENTERED")
		if (document.getElementById("\\BLANK") != null)
			console.log("BLANK FOUND")
			document.getElementById("\\BLANK").remove()
	}
}


const removeWhiteSpace = function (name){
	words = name.split(' ')
	nws = words[0]
	for (i = 1; i < words.length; i++){
		nws += '_' + words[i]
	}
	return nws
}

const restoreWhiteSpace = function (name){
	words = name.split('_')
	wws = words[0]
	for (i = 1; i < words.length; i++){
		nws += ' ' + words[i]
	}
	return wws
}

const newListItem = function(name){
	var li = document.createElement('li')
	li.innerText = name
	li.id = removeWhiteSpace(name)
	var removeBtn = document.createElement('button')
	removeBtn.innerText = 'x'
	removeBtn.className = 'removeBtn'
	li.appendChild(removeBtn)
	li.children[0].addEventListener('click', (name)=>{
			removeFromBlacklist(name)
			li.remove()		
	})
	return li
	}
const remove = function (name, li){
	
}


const updateTextBox = function(msg){
	let textBox = document.getElementById("submissionBox")
	textBox.value = msg
}


const verifyTextInput = function(text){
	if (text.includes('\\')){
		updateTextBox("ERROR: Illegal Character (\\)")
	}
	else if (localBlacklist.includes(text)){
		updateTextBox("ERROR: Duplicate Entry!")
	}
	else if (text === ""){
		updateTextBox("ERROR: Please enter a valid string")
	}
	else if((/\W+\s+\W+/).test(text)){
		updateTextBox("ERROR: Do not enter only whitespace characters")
	}
	else{
		updateTextBox("")
		return true
	}
	return  false
}

let addListItem = function(){
	let textBox = document.getElementById("submissionBox")
	let name = textBox.value
	if(verifyTextInput(name)){
	updateBlacklist(name, textBox)

	let list = document.getElementById('blockedList')
	list.appendChild(newListItem(name))
	}
}