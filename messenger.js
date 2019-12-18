//Declan Kinsella, December 2018
let localBlacklist = []

const getBlacklist = function(){
	return new Promise((resolve)=> {
		chrome.storage.local.get("blacklist", function(dbData){
			resolve(dbData.blacklist)
		})
	})
}


const updateLocalBlacklist = async function(){
		localBlacklist = await getBlacklist()
}
updateLocalBlacklist()
const gameMessageClass = '_52mr _2poz _ui9 _4skb _5i_d _4niv _205d _28rg'
const gameTitleClass = '_79da _2p_c'

window.onload = function () {

	observeInitial()

	// listen for messages sent from background.js, to reset the mutaition observer
	//when the active chat is changed
	chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
		//console.log(request);
		updateLocalBlacklist()
		observeInitial(request.url);
	});
}

//Observes the DOM for the element which contains messages
//The returned promise will allow the rest of code which deals with
//hiding messages to run.
const observeInitial = function(url) {
	var observer = new MutationObserver(js1Callback)

	// start observing the document as new elements are added
	observer.observe(document, {
		childList: true,
		subtree: true
	});
}

const js1Callback = function (mutations, me) {
		//js_1 is the id of the tag under which all messages are stored
		var js1 = document.querySelector('#js_1');

		//if js1 is found, the page has loaded far enough to start hiding initial messages
		if (js1) {
			console.log("Big Fish Loaded MESSENGER CLIENTS");
			hideInitial(js1);
			//stop observing, since the observer on js_1 is not needed after the page has
			//loaded
		
			me.disconnect();
	}
}


//Once the page has loaded the messages window, find all elements with the class
//characteristic of a big fish message, and hide those messages.
//afterwards it calls a fishObserving, which will continually monitor the messages window
//for new messages.

//A big fish message is characterized by a div tag with the class 
//_52mr _2poz _ui9 _4skb _5i_d _4niv _205d _28rg and a child tag with the 
//////Update October 2019, facebook homepage messages have class _3e7u _3al _n4o _1a6y _5z-5 _6dm2
//class _79da _2p_c and text content including "big fish"

const hideInitial = function(root) {
	let gameMessages = root.getElementsByClassName(gameMessageClass)	
	for(i = 0; i < gameMessages.length; i ++){
		localBlacklist.forEach((bannedGame)=>{
			if(gameMessages[i].children[0].children[0].children[0].innerText.includes(bannedGame)){
				gameMessages[i].style.display = 'none'
			}
		})
	}

	console.log("Initial Fish Hidden");

	fishObserving();
}


//Once intial messages have been hidden, set up a mutation observer on the messages window.
//Whenever new messages are loaded, they are compared to the big fish characteristics outlined
//earlier, and hidden if they satisfy them.

const fishObserving = function () {
	console.log("Starting Fish Observing");
	console.log(localBlacklist);


	var mutationObserver = new MutationObserver(passiveObservingCallBack)

	//Creates a mutation observer which looks at the html element within which 
	//all message related html is stored (the messages window)

	mutationObserver.observe(document.querySelector('#js_1'), {
		attributes: true,
		characterData: true,
		childList: true,
		subtree: true,
		attributeOldValue: true,
		characterDataOldValue: true
	});

}


const passiveObservingCallBack = function (mutations) {
	let nodeMutations = []
	Array.from(mutations).forEach((candidate)=>{
		if (candidate.addedNodes.length != 0)
			nodeMutations.push(candidate)
	})
	Array.from(nodeMutations).forEach((node)=>{

		let gameMessages = node.target.getElementsByClassName(gameMessageClass)

		Array.from(gameMessages).forEach((game) => {
			let gameTitle = game.getElementsByClassName(gameTitleClass)

			localBlacklist.forEach((bannedGame)=>{
				if (gameTitle[0] != null && (gameTitle[0].innerText).includes(bannedGame)) {
					game.style.display = 'none'
				}
			})
		})
	})
}