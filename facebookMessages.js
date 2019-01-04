//Declan Kinsella, December 2018

window.onload = function(){
	fishBundle();

	// listen for messages sent from background.js, to reset the mutaition observer
	//when the active chat is changed
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		fishBundle();
	});
}

//Waits for message window to load, then hides initial messages, as well as
//begins observing for new messages
function fishBundle(){
		observeInitial();

		async function call(){
			var loaded = await observeInitial();
			if (loaded){
			  	hideInitial();
			}
		}
}

//Observes the DOM for the element which contains messages
//The returned promise will allow the rest of code which deals with
//hiding messages to run.
function observeInitial(){
	var observer = new MutationObserver(function (mutations, me) {
		//js_1 is the id of the tag under which all messages are stored
		 var js1 = document.getElementById('js_1');

		//if js1 is found, the page has loaded far enough to start hiding initial messages
	 	if (js1) {
	 		console.log("Big Fish Loaded");
		    hideInitial();

		    //stop observing, since the observer on js_1 is not needed after the page has
		    //loaded
		    me.disconnect();
		    return new Promise (jsLoaded => {jsLoaded(true);});
	  	}
	});	

	// start observing the document as new elements are added
	observer.observe(document, {
	  childList: true,
	  subtree: true
	});
}


//Once the page has loaded the messages window, find all elements with the class
//characteristic of a big fish message, and hide those messages.
//afterwards it calls a fishObserving, which will continually monitor the messages window
//for new messages.

//A big fish message is characterized by a div tag with the class 
//_52mr _2poz _ui9 _4skb _5i_d _4niv _205d _28rg and a child tag with the 
//class _79da _2p_c and text content including "big fish"

function hideInitial(){
	var messengerGame = document.getElementsByClassName('_52mr _2poz _ui9 _4skb _5i_d _4niv _205d _28rg'), i;
	for (var i = 0; i < messengerGame.length; i ++) {

		if ((messengerGame[i].getElementsByClassName("_79da _2p_c")[0].textContent).includes("Big Fish")){
			messengerGame[i].style.display = 'none';
		}
	}
	console.log("Initial Fish Hidden");
	fishObserving();
}


//Once intial messages have been hidden, set up a mutation observer on the messages window.
//Whenever new messages are loaded, they are compared to the big fish characteristics outlined
//earlier, and hidden if they satisfy them.

function fishObserving(){
	console.log("Starting Fish Observing");


	var mutationObserver = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {

			//If the DOM mutation has added any nodes, store that in a variable 'node'
			//Note, addedNodes is type HTMLCollection, not a typical array
			if (typeof mutation.addedNodes != null){
				var node = (mutation.addedNodes)[0];
			}

			//check if node is the expected type and that it is not empty, to avoid errors in future
			//classifying steps
			if (typeof node == "object" && node.childNodes.length != 0){
				
				var badMessages = node.getElementsByClassName("_52mr _2poz _ui9 _4skb _5i_d _4niv _205d _28rg")

				//An HTMLCollection of elements is gathered from the elements characteristic of a facebook game.
				//This collection is then screened to avoid errors in future classifying steps.
				if (badMessages[0] != undefined && badMessages != null && badMessages.length != 0){
					
					//iterates through each "bad message" to see if a specified class has text 
					//content referring to Big Fish. If so, the element is hidden.
					for (var i = 0; i < badMessages.length; i++){
						var fishBox = (badMessages[i].getElementsByClassName("_79da _2p_c"))

						if (fishBox[0] != undefined){
							if((fishBox[0].textContent).includes("Big Fish")){
								badMessages[i].style.display = 'none';
							}	
						}
					}
				}
			}
		});
	});

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