

//XMLHttpRequest response array and input array
var response;
var input;

//Ready html for later use
var resultsParents = "<div class=searchResultsRelatives><p class=results>Parents:</p></div>";
var resultsGrandparents = "<div class=searchResultsRelatives><p class=results>Grandparents:</p></div>";
var resultsSiblings = "<div class=searchResultsRelatives><p class=results>Siblings:</p></div>";

//On page load
$( document ).ready(function() {

  //Loads json
  loadJson();

  //Search for matches
  $( "#search" ).click(function() {
    searchForMatch();
  });

  //Bind enter for search
  $(document).keypress(function(e) {
    if(e.which == 13) {
        $( "#search" ).trigger( "click" );
    }
  });

  //Empty inputField on pageload
  $("#inputField" ).val(null);

});

//Loads JSON
function loadJson(){

  var xmlhttp = new XMLHttpRequest();
  var url = "http://it-hekuma.protacon.fi/family_tree.json" + "?callback=?";

  xmlhttp.onreadystatechange = function() {

    if (this.readyState == 4 && this.status == 200) {

        response = JSON.parse(this.responseText);

    }

    else {

      console.log("ERROR " + xmlhttp.readyState + " " + xmlhttp.status);

    }
  };

  xmlhttp.open("GET", "https://cors.io/?" + url, true);
  xmlhttp.send();

}

//Searches for a match
function searchForMatch(){

  //Remove old information on new search
  $( ".searchResults" ).remove();
  $( ".searchResultsMain" ).remove();
  $( ".searchResultsRelatives" ).remove();
  $( ".searchResultsSide" ).remove();

  var noResults = "No results :(";
  var found = false;

  //Split input into array
  input = $("#inputField" ).val().split(" ");

  //Iterate over response array looking for matches
  $.each( response, function( i ) {

    if(input[0] == response[i].firstName && input[1] == response[i].lastName){

      found = true;

      $( ".inputWrapper" ).append( "<div class=searchResultsMain>" + $("#inputField" ).val() + "</div>" );

      //Search parents
      parents(i);

    }

  });

  //No results
  if(found == false){
    $( ".inputWrapper" ).append( "<div class=searchResultsMain>" + noResults + "</div>" );
  }

}

//Search parents
function parents(i){

  //If searched person has parents
  if(response[i].father != null || response[i].mother){

    $( ".inputWrapper" ).append( resultsParents );

    //Add father if not null
    if(response[i].father != null){

      var fatherIndex = response[i].father;
      var father = response[fatherIndex - 1].firstName + " " + response[fatherIndex - 1].lastName;

      $( ".inputWrapper" ).append( "<div class=searchResults>Father: " + father + "</div>" );

    }

    //Add mother if not null
    if(response[i].mother != null){

      var motherIndex = response[i].mother;
      var mother = response[motherIndex - 1].firstName + " " + response[motherIndex - 1].lastName;

      $( ".inputWrapper" ).append( "<div class=searchResults>Mother: " + mother + "</div>" );

    }
  }

  //Search for grandparents, father and mother index to help searching
  grandParents(fatherIndex, motherIndex);
  //Search for siblings, fatherindex, mother index and input array to help searching
  siblings(fatherIndex, motherIndex, input);

}

//Search grandparents
function grandParents(fatherIndex, motherIndex){

  //If has grandparents
  if(response[fatherIndex].father != null || response[fatherIndex].mother != null || response[motherIndex].mother != null || response[fatherIndex].father != null){

    $( ".inputWrapper" ).append( resultsGrandparents );

    var addedInfoFather = 0;
    var addedInfoMother = 0;

    //If fathers side grandfather not null
    if(response[fatherIndex].father != null){
      addedInfoFather++;
      var grandfatherFatherSideIndex = response[fatherIndex - 1].father;
      var grandfatherFatherSide = response[grandfatherFatherSideIndex - 1].firstName + " " + response[grandfatherFatherSideIndex - 1].lastName;

      //Add info if not already added
      if(addedInfoFather == 1){
        $( ".inputWrapper" ).append( "<div class=searchResultsSide>Father's side:");
      }
      $( ".inputWrapper" ).append( "<div class=searchResults>Grandfather: " + grandfatherFatherSide + "</div>" );
    }

    //if fathers side grandmother not null
    if(response[fatherIndex].mother != null){
      addedInfoFather++;
      var grandmotherFatherSideIndex = response[fatherIndex - 1].mother;
      var grandmotherFatherSide = response[grandmotherFatherSideIndex - 1].firstName + " " + response[grandmotherFatherSideIndex - 1].lastName;

      //Add info if not already added
      if(addedInfoFather == 1){
        $( ".inputWrapper" ).append( "<div class=searchResultsSide>Father's side:");
      }
      $( ".inputWrapper" ).append( "<div class=searchResults>Grandmother: " + grandmotherFatherSide + "</div>" );
    }

    //If mothers side mother not null
    if(response[motherIndex].mother != null){
      addedInfoMother++;
      var grandmotherMothderSideIndex = response[motherIndex - 1].mother;
      var grandmotherMotherSide = response[grandmotherMothderSideIndex - 1].firstName + " " + response[grandmotherMothderSideIndex - 1].lastName;

      //Add info if not already added
      if(addedInfoMother == 1){
        $( ".inputWrapper" ).append( "<div class=searchResultsSide>Mother's side:");
      }
      $( ".inputWrapper" ).append( "<div class=searchResults>Grandmother: " + grandmotherMotherSide + "</div>" );

    }

    //If mothers side father not null
    if(response[motherIndex].father != null){
      addedInfoMother++;
      var grandfatherMotherSideIndex = response[motherIndex - 1].father;
      var grandfatherMotherSide = response[grandfatherMotherSideIndex - 1].firstName + " " + response[grandfatherMotherSideIndex - 1].lastName;

      //Add info if not already added
      if(addedInfoMother == 1){
        $( ".inputWrapper" ).append( "<div class=searchResultsSide>Mother's side:");
      }
      $( ".inputWrapper" ).append( "<div class=searchResults>Grandfather: " + grandfatherMotherSide + "</div>" );
    }
  }
}

//Search for siblings
function siblings(fatherIndex, motherIndex, input){

  //Iterate and search for same parents
  $.each( response, function( i ) {

    if(response[i].father == fatherIndex && response[i].mother == motherIndex && response[i].firstName != input[0] && response[i] != input[1]){
      $( ".inputWrapper" ).append( resultsSiblings );
      console.log("OSUMA " + response[i].firstName + " " + response[i].lastName);
      $( ".inputWrapper" ).append( "<div class=searchResults>" + response[i].firstName + " " + response[i].lastName + "</div>" );
    }

  });

}
