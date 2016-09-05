(function() {
	function any(iterable) {
		for (var index = 0; index < iterable.length; ++index) {
			if (iterable[index]) return true;
		}
    return false;
}

	function readxml() {
		jQuery.get( "http://gd2.mlb.com/components/game/mlb/year_2016/month_09/day_03/master_scoreboard.xml", function( data ) {
			console.log(data.getElementsByTagName("inning")[1]);
			//var full = '<linescore><inning away="1" home="0"/><inning away="0" home="0"/><inning away="0" home="0"/><inning away="1" home="0"/><inning away="0" home="1"/><inning away="1" home="1"/><inning away="0" home="0"/><inning away="0" home="0"/><inning away="0" home="0"/><r away="3" home="2" diff="1"/><h away="4" home="7"/><e away="1" home="1"/><hr away="0" home="0"/><sb away="2" home="1"/><so away="12" home="8"/></linescore>';
			//var par = jQuery.parseXML(full);
		    //tmp = new DOMParser();
			//xml = tmp.parseFromString( full , "text/xml" );
			//console.log(xml);
			//console.log(xml.getElementsByTagName("inning")[1]);
			i1 = data.getElementsByTagName("inning")[1];
			console.log(i1.attributes['away']);
		  
			console.log( "Load was performed." );
		});
	}
  
	function didTroutHitHR() {
		console.log("Running Trout HR");
		//var req = new XMLHttpRequest();
		//req.setRequestHeader("Authorization", "");
		////xhr.setRequestHeader('Authorization', ' ');
		//var anyTrout = null;
		var anyTrout = jQuery.get( "http://gd2.mlb.com/components/game/mlb/year_2016/month_09/day_03/master_scoreboard.xml", function( data ) {
			console.log(data.getElementsByTagName("inning")[1]);
			
			data.getElementsByTagName("home_runs").each(console.log);
			
			// use loops here
			var anyTrout = false;
			//console.log(data.getElementsByTagName("home_runs"));
			var hrs_list = data.getElementsByTagName("home_runs");
			for (var ihr = 0; ihr < hrs_list.length; ihr++) {
				var hrs = hrs_list[ihr];
				//console.log(hrs);
				var player_list = hrs.getElementsByTagName("player");
				for (var iplayer = 0; iplayer < player_list.length; iplayer++) {
					var player = player_list[iplayer];
					if (player.getAttribute('id') == '545361') {anyTrout = true;}
				}
			}
			console.log("Trout hit HR? ", anyTrout);
			//console.log( "Load was performed." );
			return anyTrout;
		});
		return "hit Trout hr" + anyTrout;
	}	
  
	document.getElementById('xmlhere').addEventListener('click', didTroutHitHR);
	document.getElementById('xmlhere').onclick = didTroutHitHR;//function(aa){console.log(123)};
	document.getElementById('xmlhere').onclick = function(aa){console.log(123)};
	//console.log("this works");
	readxml();
	didTroutHitHR();
	
	
	
	
	
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