//Written December 26 2018 by Declan Kinsella
window.onload = function(){

		var messengerGame = document.getElementsByClassName('_3_om _3cpq'), i;
		for (var i = 0; i < messengerGame.length; i ++) {
			messengerGame[i].style.display = 'none';
		}



	console.log("Extension Loaded");
	var mutationObserver = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {

			if (typeof mutation.addedNodes != null){
				var node = (mutation.addedNodes)[0];
			}

			if (typeof node == "object" && node.childNodes.length != 0){
				
				var badMessages = node.getElementsByClassName("_3_om _3cpq")
				if (typeof badMessages != null && badMessages != null && badMessages.length != 0){
					// console.log("ladies and gentlemen, we got him")
					for (var i = 0; i < badMessages.length; i++){
						badMessages[i].style.display = 'none';
					}
				}
			}
		});
	});

	mutationObserver.observe(document.querySelector("#ChatTabsPagelet"), {
	  attributes: true,
	  characterData: true,
	  childList: true,
	  subtree: true,
	  attributeOldValue: true,
	  characterDataOldValue: true
	});


}
