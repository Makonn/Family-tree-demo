

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

  //Eventlistener for search
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


  //Listener for click on inputfield to show and not to show list
  $("#inputField").click( function(event){
        event.stopPropagation();
        $(".proposalsUl").toggle();
        $("#inputField" ).val(null);
    });

    $(document).click( function(){
        $(".proposalsUl").hide();
    });

  //Listener for proposals
  $( "#inputField" ).keyup(function() {
    proposalFilter();
  });

});

//Loads JSON
function loadJson(){

  var xmlhttp = new XMLHttpRequest();
  var url = "http://it-hekuma.protacon.fi/family_tree.json" + "?callback=?";

  xmlhttp.onreadystatechange = function() {

    if (this.readyState == 4 && this.status == 200) {

        response = JSON.parse(this.responseText);

        //Add proposal list after loading
        addToProposals();

    }

    else {

      console.log("ERROR " + xmlhttp.readyState + " " + xmlhttp.status);

    }
  };

  //Open and send request, change proxy solution to something else
  xmlhttp.open("GET", "https://cors.io/?" + url, true);
  xmlhttp.send();

}

//Searches for a match
function searchForMatch(proposaInput){

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

  console.log("veijjo");

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

    //Search for grandparents, father and mother index to help searching
    grandParents(fatherIndex, motherIndex);
    //Search for siblings, fatherindex, mother index and input array to help searching
    siblings(fatherIndex, motherIndex, input);

  }
  $( ".inputWrapper" ).append( "<div class=searchResults id=noFurtherResults><p id=noFurtherResults>*No further information about relatives</p></div>" );
}

//Search grandparents
function grandParents(fatherIndex, motherIndex){

  //If has grandparents
  if(response[fatherIndex - 1].father != null || response[fatherIndex - 1].mother != null || response[motherIndex - 1].mother != null || response[fatherIndex - 1].father != null){

    $( ".inputWrapper" ).append( resultsGrandparents );

    var addedInfoFather = 0;
    var addedInfoMother = 0;

    //If fathers side grandfather not null
    if(response[fatherIndex - 1].father != null){
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
    if(response[fatherIndex - 1].mother != null){
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
    if(response[motherIndex - 1].mother != null){

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
    if(response[motherIndex - 1].father != null){
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

  var added = 0;

  //Iterate and search for same parents
  $.each( response, function( i ) {

    if(response[i].father == fatherIndex && response[i].mother == motherIndex && response[i].firstName != input[0] && response[i] != input[1]){
      if(added == 0){
        $( ".inputWrapper" ).append( resultsSiblings );
        added++;
      }
      $( ".inputWrapper" ).append( "<div class=searchResults>" + response[i].firstName + " " + response[i].lastName + "</div>" );
    }
  });

}

//Add proposals to list
function addToProposals(){

  $.each( response, function( i ) {
    $(".proposalsUl").css("width", $( "#inputField" ).outerWidth());
    $( ".proposalsUl" ).append( "<li class=proposalResults>" + response[i].firstName + " " + response[i].lastName + "</li>" );
  });

  $( ".proposalResults" ).click(function() {
    $("#inputField" ).val($(this).text());
    searchForMatch($(this).text());

  });
}

//Filter search
function proposalFilter() {

  // Declare variables
  var input, filter, li, i;

  input = document.getElementById("inputField");
  filter = input.value.toUpperCase();
  li = document.getElementsByTagName('li');

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {

    if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    }
    else {
      li[i].style.display = "none";
    }
  }
}
