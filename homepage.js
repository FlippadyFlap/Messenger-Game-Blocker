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

const gameMessageClass = '_3_om _3cpq'
const gameTitleClass = '_79d9 _2p_c'

window.onload = function () {
	const chatTabs = document.querySelector('#ChatTabsPagelet')
	const mutationParams = {
		attributes: true,
		characterData: true,
		childList: true,
		subtree: true
	}

	hideInitial(chatTabs);

	var chatTabsObserver = new MutationObserver(mutationCallback)

	chatTabsObserver.observe(chatTabs, mutationParams)
	console.log("Starting Fish Observing")
}

const hideInitial = function (chatTabs) {
	var gameMessages = chatTabs.getElementsByClassName(gameMessageClass);
	Array.from(gameMessages).forEach( (game) => {
		let gameTitle = game.getElementsByClassName(gameTitleClass)
		localBlacklist.forEach((bannedGame)=>{
			if (gameTitle[0] != null && (gameTitle[0].innerText).includes(bannedGame)) {
				game.style.display = 'none'
			}
		})
	})
	console.log("Initial Fish Hidden")
}

const mutationCallback = function(mutations, me){
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