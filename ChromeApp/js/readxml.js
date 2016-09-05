(function() {


  function readxml() {
	  jQuery.get( "http://gd2.mlb.com/components/game/mlb/year_2016/month_09/day_03/master_scoreboard.xml", function( data ) {
		  console.log("clicked, did xml work?");
          //$( "#xmlhere" ).text( data );
          document.getElementById("xmlhere").text = data;
		  console.log(data);
		  //console.log($(data));
		  var parsed = jQuery.parseXML( data );
		  console.log(parsed);
		  console.log(jQuery.find(parsed, find('game')));
		  //console.log($(data).find('game'));
		  console.log(data.toString());
		  
		  
		  
		  
		  
		  
		  
		  var full = '<linescore><inning away="1" home="0"/><inning away="0" home="0"/><inning away="0" home="0"/><inning away="1" home="0"/><inning away="0" home="1"/><inning away="1" home="1"/><inning away="0" home="0"/><inning away="0" home="0"/><inning away="0" home="0"/><r away="3" home="2" diff="1"/><h away="4" home="7"/><e away="1" home="1"/><hr away="0" home="0"/><sb away="2" home="1"/><so away="12" home="8"/></linescore>';
		  var par = jQuery.parseXML(full);
		  
		  
    tmp = new DOMParser();
    xml = tmp.parseFromString( full , "text/xml" );
	console.log(xml);
	console.log(xml.getElementsByTagName("inning")[1].attributes());
	
		  console.log(par);
		  console.log($(par).find("inning"));
		  
var xml = "<rss version='2.0'><channel><title>RSS Title</title></channel></rss>",
  xmlDoc = jQuery.parseXML( xml ),
  $xml = ( xmlDoc ),
  $title = $xml.find( "title" );
  
		  console.log($(data.toString()).contents());
		  console.log(jQuery.parseXML(data.toString()));
          document.getElementById("xmlhere").text = parsed;
	      console.log( "Load was performed." );
      });
  }

  
  
  document.getElementById('xmlhere').addEventListener('click', readxml);

	console.log("this works");
	readxml();
})();