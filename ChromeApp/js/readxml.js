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
	
	function sleep (time) {
		return new Promise((resolve) => setTimeout(resolve, time));
	}
 
	
	function didTroutHitHR2() {
		// Uses XMLHttpRequest
		// Has issue with async loading, forcing it to sleep helps it work, will need to fix later
		console.log("Running Trout HR 2");
		jQuery.ajaxSetup();
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://gd2.mlb.com/components/game/mlb/year_2016/month_09/day_03/master_scoreboard.xml');
		xhr.onload = function() {
			if (xhr.status === 200) {
				console.log('User\'s name is ' + xhr.status);
			}
			else {
				console.log('Request failed.  Returned status of ' + xhr.status);
			}
		};
		var data;
		var anyTrout = null;
		xhr.onreadystatechange = function () {
				sleep(50).then(() => {
				if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
					console.log(xhr.status, xhr.DONE);
				}
				data = xhr.responseXML;

				anyTrout = false;
				var hrs_list = data.getElementsByTagName("home_runs");
				for (var ihr = 0; ihr < hrs_list.length; ihr++) {
					var hrs = hrs_list[ihr];
					var player_list = hrs.getElementsByTagName("player");
					for (var iplayer = 0; iplayer < player_list.length; iplayer++) {
						var player = player_list[iplayer];
						if (player.getAttribute('id') == '545361') {anyTrout = true;}
					}
				}
				console.log("Trout hit HR 2 ? ", anyTrout);
			})
		};
		xhr.send();
		
		return "hit Trout hr" + anyTrout;
	}	
	
		
	
	function isTroutBatting(alarmName) {
		console.log("Alarm name is " + alarmName);
		// Uses XMLHttpRequest
		// Has issue with async loading, forcing it to sleep helps it work, will need to fix later
		var namesToCheck = ["Trout", "Dozier", "Judge", "Plouffe", "Votto", "Mauer", "Sano", "Buxton", "Pujols"];
		namesStorage = 'abcd';
		chrome.storage.local.get('todos-vanillajs',function(a){namesStorage = a;});
		console.log(namesStorage);
		
		console.log("isTroutBatting");
		jQuery.ajaxSetup();
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://gd2.mlb.com/components/game/mlb/year_2016/month_09/day_05/master_scoreboard.xml');
		xhr.onload = function() {
			if (xhr.status === 200) {
				console.log('User\'s name is ' + xhr.status);
			}
			else {
				console.log('Request failed.  Returned status of ' + xhr.status);
			}
		};
		var data;
		//var anyTrout = null;
		xhr.onreadystatechange = function () {
				console.log('state change' + xhr.DONE + xhr.status);
				//sleep(250).then(() => {
					if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { // this waits until it is done, so no sleep
						console.log(xhr.status, xhr.DONE);
						data = xhr.responseXML;

						var checksBatting = [];
						//for (var iLast = 0; iLast < namesToCheck.length; iLast++) {
						//	lastToCheck = namesToCheck[iLast];
						//	console.log("Checking for " + lastToCheck);
							var anyTrout = false;
							var hrs_list = data.getElementsByTagName("batter");
							for (var ihr = 0; ihr < hrs_list.length; ihr++) {
								var hrs = hrs_list[ihr];
								console.log('batting now is ' + hrs.getAttribute('last'));
								//if (hrs.getAttribute('id') == '545361') {anyTrout = true;}
								//if (hrs.getAttribute('last') == lastToCheck) {anyTrout = true;}
								var thisLast = hrs.getAttribute('last');
								if (jQuery.inArray(thisLast, namesToCheck) >= 0) {
									anyTrout = true;
									checksBatting.push(thisLast);
								}
							}
							console.log("Trout is batting: ", anyTrout);
							if (anyTrout) {
								//chrome.notifications.create('batters', {
								createOrUpdate('batters', {
									type: 'basic',
									iconUrl: 'icon_128.png',
									title: "Batting",
									message: checksBatting + ' is batting!'
									}, function(notificationId) {}
								 );
							}
						//}
					}
				//})
		};
		xhr.send();
		
		return "Leaving check for Trout";// + anyTrout;
	}	
	
	// 1: get the names from the todo list
	function getNames(alarmName) {
		console.log("Alarm name is " + alarmName);
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
		xhr.open('GET', 'http://gd2.mlb.com/components/game/mlb/year_2016/month_09/day_05/master_scoreboard.xml');
		xhr.onload = function() {
			if (xhr.status === 200) {
				console.log('User\'s name is ' + xhr.status);
			}
			else {
				console.log('Request failed.  Returned status of ' + xhr.status);
			}
		};
		var data;
		//var anyTrout = null;
		xhr.onreadystatechange = function () {
				console.log('state change' + xhr.DONE + xhr.status);
				//sleep(250).then(() => {
					if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { // this waits until it is done, so no sleep
						console.log(xhr.status, xhr.DONE);
						data = xhr.responseXML;
						checkForNames(data);
					}
				//})
		};
		xhr.send();
	}
	
	// 3: after having names and XML, check for names and notify as appropriate
	function checkForNames(data) {
		console.log("names to check are");
		console.log(namesStorage);
		var checksBatting = [];
		var namesToCheck = namesStorage;
		var anyTrout = false;
		var hrs_list = data.getElementsByTagName("batter");
		for (var ihr = 0; ihr < hrs_list.length; ihr++) {
			var hrs = hrs_list[ihr];
			console.log('batting now is ' + hrs.getAttribute('last'));
			//if (hrs.getAttribute('id') == '545361') {anyTrout = true;}
			//if (hrs.getAttribute('last') == lastToCheck) {anyTrout = true;}
			var thisLast = hrs.getAttribute('last');
			if (jQuery.inArray(thisLast, namesToCheck) >= 0) {
				anyTrout = true;
				checksBatting.push(thisLast);
			}
		}
		console.log("Trout is batting: ", anyTrout);
		if (anyTrout && !checksBatting.compare(previousNames)) {
			console.log("new names are " + checksBatting);
			//chrome.notifications.create('batters', {
			createOrUpdate('batters', {
				type: 'basic',
				iconUrl: 'icon_128.png',
				title: "Batting",
				message: checksBatting + ' is batting!'
				}, function(notificationId) {}
			 );
		} else {
			console.log("Nothing new");
		}
		previousNames = checksBatting;
		return anyTrout;
	}
	
	
	
	function beginChecking() {
		chrome.alarms.create("Trout", {
		   delayInMinutes: 0.1, periodInMinutes: 0.1});
		chrome.alarms.onAlarm.addListener(isTroutBatting);
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
	   delayInMinutes: 0.1, periodInMinutes: 0.1});
	chrome.alarms.onAlarm.addListener(getNames);
	
  
	document.getElementById('xmlhere').addEventListener('click', function(aa) {console.log("Running Trout batting");console.log(isTroutBatting())});
	document.getElementById('Trouts').onclick = beginChecking;  //didTroutHitHR2//didTroutHitHR2;//function(aa){console.log(123)};
	document.getElementById('xmlhere').onclick = function(aa){console.log(123)};
	document.getElementById('names').onclick = getNames;
	//console.log("this works");
	//readxml();
	//didTroutHitHR();
	didTroutHitHR2();
	
	
	
	
	
  function doExportToDisk2() {
	  console.log("In export to disk 2");
	  console.log(didTroutHitHR());

		/*chrome.fileSystem.chooseEntry( {
		  type: 'saveFile',
		  suggestedName: 'todos.txt',
		  accepts: [ { description: 'Text files (*.txt)',
					   extensions: ['txt']} ],
		  acceptsAllTypes: true
		}, exportToFileEntry);*/

	  
  }
  
  
  document.getElementById('Trouts').addEventListener('click', doExportToDisk2);
  
  
})();