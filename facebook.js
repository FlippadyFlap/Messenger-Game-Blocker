//Declan Kinsella, December 2018

window.onload = function(){

		//finds all instances of classes characteristic of a facebook game message and hides them

		var bigFish = document.getElementsByClassName('_3_om _3cpq'), i;
		for (var i = 0; i < bigFish.length; i ++) {
			var fishBox = (bigFish[i].getElementsByClassName("_79d9 _2p_c"))
			if (fishBox[0] != undefined){
				if((fishBox[0].textContent).includes("Big Fish")){
					bigFish[i].style.display = 'none';
				}	
			}
		}



	console.log("Big Fish Loaded");

	//when a new elements are added to the DOM under the chat tabs pagelet, check if any are characteristic of
	//a messenger game. If so, hide them 

	var mutationObserver = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {

			if (typeof mutation.addedNodes != null){
				var node = (mutation.addedNodes)[0];
			}

			if (typeof node == "object" && node.childNodes.length != 0){
				
				var badMessages = node.getElementsByClassName("_3_om _3cpq")

				if (badMessages[0] != undefined && badMessages != null && badMessages.length != 0){
					
					//iterates through each "bad message" to see if a specified class has text content referring to Big Fish
					for (var i = 0; i < badMessages.length; i++){
						var fishBox = (badMessages[i].getElementsByClassName("_79d9 _2p_c"))

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

	//Creates a mutation observer which looks at the html element on the facebook homepage within which 
	//all message related html is stored

	mutationObserver.observe(document.querySelector("#ChatTabsPagelet"), {
	  attributes: true,
	  characterData: true,
	  childList: true,
	  subtree: true,
	  attributeOldValue: true,
	  characterDataOldValue: true
	});


}