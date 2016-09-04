(function() {


  function readxml() {
	  jQuery.get( "http://gd2.mlb.com/components/game/mlb/year_2016/month_09/day_03/master_scoreboard.xml", function( data ) {
		  console.log("clicked, did xml work?");
          //$( "#xmlhere" ).text( data );
          document.getElementById("xmlhere").text = data;
		  console.log(data);
		  var parsed = jQuery.parseXML( data );
		  console.log(parsed);
          document.getElementById("xmlhere").text = parsed;
	      console.log( "Load was performed." );
      });
  }

  
  
  document.getElementById('xmlhere').addEventListener('click', readxml);

	console.log("this works");
	readxml();
})();