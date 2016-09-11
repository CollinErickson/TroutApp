(function() {
	
	
	var dbName = 'todos-vanillajs';
	var namesStorage = [];
	var previousNames = [];

	function any(iterable) {
		for (var index = 0; index < iterable.length; ++index) {
			if (iterable[index]) return true;
		}
    return false;
	}
	
	function pad(n) {
		return (n < 10) ? ("0" + n) : n;
	}
	
	Array.prototype.compare = function(testArr) {
		if (this.length != testArr.length) return false;
		for (var i = 0; i < testArr.length; i++) {
			if (this[i].compare) { //To test values in nested arrays
				if (!this[i].compare(testArr[i])) return false;
			}
			else if (this[i] !== testArr[i]) return false;
		}
		return true;
	}
	
	function anyNew(newarr, oldarr) {
		if (newarr.length == 0) {return false;}
		if (oldarr.length == 0) {return true;}
		for (var i = 0; i < newarr.length; i++) {
			var notInOld = true;
			for (var j = 0; j < oldarr.length; j++) {
				if (newarr[i] == oldarr[j]) {
					notInOld = false;
				}
			}
			if (notInOld) {
				return true;
			}
		}
		return false;
	}
	
	function sleep (time) {
		return new Promise((resolve) => setTimeout(resolve, time));
	}
	
	function isNameInNamesToCheck(last, first, namesToCheckLast, namesToCheckFirst) {
		// loop over names
		for (var i = 0; i < namesToCheckLast.length; i++) {
			var thisLast = namesToCheckLast[i];
			var thisFirst = namesToCheckFirst[i];
			if (last == thisLast) { // make sure last is right
				if (thisFirst== null) {return true;} // If no first given, return true
				if (first.indexOf(thisFirst) == 0) {return true;} // If it matches first part of first given, return true
			}
		}
		return false; // No matches, return false
	}
 
	
	// 1: get the names from the todo list
	function getNames(alarmName) {
		chrome.storage.local.get('todos-vanillajs', 
			function(storage) {
				stor = storage[dbName];
				todos = stor.todos;
				names = [];
				for (var i = 0; i<todos.length; i++) {
					names.push(todos[i].title);
				}
				namesStorage = names;
				getXML();
			}
		);
	}
	
	// 2: get the XML
	function getXML() {
		var xhr = new XMLHttpRequest();
		var td = new Date();
		var master_scoreboardURL = 'http://gd2.mlb.com/components/game/mlb/year_' + td.getFullYear() + '/month_' + pad(td.getMonth() + 1) + '/day_' + pad(td.getDate()) + '/master_scoreboard.xml';
		xhr.open('GET', master_scoreboardURL);
		xhr.onload = function() {
			if (xhr.status === 200) {
				//console.log('User\'s name is ' + xhr.status);
			}
			else {
				console.log('Request failed.  Returned status of ' + xhr.status);
			}
		};
		var data;
		//var anyTrout = null;
		xhr.onreadystatechange = function () {
				//console.log('state change' + xhr.DONE + xhr.status);
				if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { // this waits until it is done, so no sleep
					//console.log(xhr.status, xhr.DONE);
					data = xhr.responseXML;
					checkForNames(data);
				}
		};
		xhr.send();
	}
	
	// 3: after having names and XML, check for names and notify as appropriate
	function checkForNames(data) {
		//console.log("names to check are");
		//console.log(namesStorage);
		var checksBatting = [];
		var checksBattingDetails = {};
		var namesStored = namesStorage;
		var namesToCheckLast = [];
		var namesToCheckFirst = [];
		for (var i = 0; i < namesStored.length; i++) {
			if (namesStored[i].indexOf("_") > -1) { // split first and last
				var nameSplit = namesStored[i].split("_");
				namesToCheckLast.push(nameSplit[1]);
				namesToCheckFirst.push(nameSplit[0]);
			} else { // Only last given
				namesToCheckLast.push(namesStored[i]);
				namesToCheckFirst.push(null);
			}
		}
		//console.log(namesToCheckLast);console.log(namesToCheckFirst);
		var namesToCheck = namesStored;
		var anyTrout = false;
		var gameList = data.getElementsByTagName("game");
		var battersAllNames = []; // Just for logging to console
		for (var igame = 0; igame< gameList.length; igame++) {
			var game = gameList[igame]
			var batterList = game.getElementsByTagName("batter");
			if (batterList.length > 0) { // there is one batter, single game so shouldn't be more
				var batter = batterList[0];
				//console.log('batting now is ' + batter.getAttribute('first') + ' ' + batter.getAttribute('last'));
				battersAllNames.push(batter.getAttribute('first') + '_' + batter.getAttribute('last'));
				var thisLast = batter.getAttribute('last');
				var thisFirst = batter.getAttribute('first');
				var nameInNamesToCheck = isNameInNamesToCheck(thisLast, thisFirst, namesToCheckLast, namesToCheckFirst);
				if (nameInNamesToCheck) {
					anyTrout = true;
					checksBatting.push(thisLast);
					//console.log("HERE ");console.log(batter);
					thisDetails = {};
					thisDetails['last'] = batter.getAttribute('last');
					thisDetails['first'] = batter.getAttribute('first');
					thisDetails['h'] = batter.getAttribute('h');
					thisDetails['ab'] = batter.getAttribute('ab');
					thisDetails['home_name_abbrev'] = game.getAttribute('home_name_abbrev');
					thisDetails['away_name_abbrev'] = game.getAttribute('away_name_abbrev');
					var status = game.getElementsByTagName("status")[0];
					thisDetails['inning'] = status.getAttribute('inning');
					thisDetails['top_inning'] = status.getAttribute('top_inning');
					thisDetails['status'] = status.getAttribute('status');
					var runs = game.getElementsByTagName("r")[0];
					thisDetails['runsHome'] = runs.getAttribute('home');
					thisDetails['runsAway'] = runs.getAttribute('away');
					var links = game.getElementsByTagName("links")[0];
					var fullLink = links.getAttribute("mlbtv");
					var partLink = fullLink.split("'")[1];
					var mlbtvLink = "http://m.mlb.com/tv/e" + partLink;	
					thisDetails['mlbtvLink'] = mlbtvLink;
					checksBattingDetails[thisLast] = thisDetails;
				}
			}
		}
		console.log(battersAllNames);
		//if (anyTrout && !checksBatting.compare(previousNames)) {
		if (anyTrout && anyNew(checksBatting, previousNames)) { // This version won't notify again if 2 were batting then it drops to 1.
			console.log("new names are ");// + checksBatting);
			//chrome.notifications.create('batters', {
			/*createOrUpdate('batters', {
				type: 'basic',
				iconUrl: 'icon_128.png',
				title: "Batting",
				message: checksBatting + ' is batting!'
				}, function(notificationId) {}
			 );*/
			 makeNotification(checksBatting, checksBattingDetails);
		} else {
			console.log("Nothing new");
		}
		previousNames = checksBatting;
		return anyTrout;
	}
	
	// 4: Make notification
	var buttonLinks = []; // keep this outside function so when pressed it gives right link
	var buttonPressed = []; // use this to prevent multiple tabs from opening, which happened a lot
	function makeNotification(checksBatting, checksBattingDetails) {
		var items = [];
		var buttonTitles = [];
		buttonLinks = [];
		buttonPressed = [];
		for (var i = 0; i < checksBatting.length; i++) {
			var dets = checksBattingDetails[checksBatting[i]];
			var inningTB = null; if (dets['top_inning'] == "Y") {inningTB = "T";} else {inningTB = "B";};
			var itemTitle = dets['first'] + ' ' + dets['last']; //checksBatting[i];
			var itemMessage = dets['h'] + "/" + dets['ab'] + " " + 
				dets['away_name_abbrev'] + " " + dets['runsAway']+ " - " + dets['home_name_abbrev'] + 
				" " + dets['runsHome'] + " " + inningTB + dets['inning']; // + dets['mlbtvLink'];
			var item = {title: itemTitle, message: itemMessage };
			items.push(item);
			var buttonTitle = {title: itemTitle + " " + itemMessage};
			buttonTitles.push(buttonTitle);
			buttonLinks.push(dets['mlbtvLink']);
			buttonPressed.push(false);
		}
		
		var opt = {
		  type: "list",
		  title: "Batting",
		  message: "Primary message to display",
		  iconUrl: "baseballbatter_128.png",//"icon_128.png",
		  items: items,
		  //buttons: [{title: "Yes, get me there"}, {title: "Get out of my way"}]
		  buttons: buttonTitles
		}
		var myNotificationID = null;// not using, should remove this
		createOrUpdate('batters', opt, function(id) {myNotificationID = id;}); 
		chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
			//console.log(notifId, btnIdx, myNotificationID);
			if (notifId === "batters" && !buttonPressed[btnIdx]) {
				console.log(buttonLinks[btnIdx], btnIdx);
				buttonPressed[btnIdx] = true; // make sure it won't be opened multiple times
				window.open(buttonLinks[btnIdx]);
				/*if (btnIdx === 0) {
					window.open(checksBattingDetails[checksBatting[0]]['mlbtvLink']);
				} else if (btnIdx === 1) {
					console.log(2);
				}*/
			}
		});
		
	}
	
	
	
	
	function createOrUpdate(id, options, callback) {
	  // Try to lower priority to minimal "shown" priority
	  chrome.notifications.update(id, {priority: 0}, function(existed) {
		if(existed) {
		  var targetPriority = options.priority || 0;
		  options.priority = 1;
		  // Update with higher priority
		  chrome.notifications.update(id, options, function() {
			chrome.notifications.update(id, {priority: targetPriority}, function() {
			  callback(true); // Updated
			});
		  });
		} else {
		  chrome.notifications.create(id, options, function() {
			callback(false); // Created
		  });
		}
	  });
	}
	
	chrome.alarms.create("Trout", {
	   delayInMinutes: 0.2, periodInMinutes: 0.2});
	chrome.alarms.onAlarm.addListener(getNames);
	
  
	document.getElementById('Trouts').onclick = function() {previousNames = []; getNames('From onclick');};
	
	
	

  
})();