/*
/ 2020-2022, Nicholas Chaput (mapler90210 / marche9th)
*/

// TEST_CATEGORIES is not supported anymore, leaving this code here because it would be easy to re-implement and very useful if we make any large changes in the future
// abbreviated list of categories. set USE_TEST_CATEGORIES = true to test with a small subset of leaderboards
// var TEST_CATEGORIES = CATEGORY_DETAILS.filter(category => category.useInTestList);
// var USE_TEST_CATEGORIES = false;

var API_ALL_USERS_URL = 'https://www.speedrun.com/api/v1/users'; // This is currently being used to find all countries that need to potentially be represented in the PR

var CATEGORY_RECORDS = []; // define globally because I'm shoehorning this in at the last moment like a rookie
var CATEGORY_RECORD_SUBCATEGORY_SEPARATION_STRING = ' - '

var FLAG_BASE_URL = 'https://www.speedrun.com/images/flags/'
var FLAG_URL_FILE_EXTENSION = '.png'

/**
* Main function to update the Kirby Power Rankings
*/
function updatePowerRankings() {
  // Initialize our sheet for writing to cells
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var powerRankingSheet = activeSpreadsheet.getSheetByName(SHEET_NAME_POWER_RANKINGS);
  
  var ranking = updateRankingDetails();
  
  // display the power rankings
  var rankingStartingColumn = 2;
  var rankingStartingRow = 31;
  var numColumnsInRanking = 7;
  
  // get the list of 'grandfathered' players, who display on the PR regardless of their current points
  var grandfathers = getGrandfathers();
  
  // map to a format that sheets can use and filter the players to include
  var rank = 0;
  var tieOffset = 0;
  var lastPlayerPoints = 9999999999; // arbitrary number that is unreachably high
  var filteredRanking = ranking.filter(function(player){
    return (
      player['points'] >= POWER_RANKING_INCLUSION_POINTS_CUTOFF
      || grandfathers.includes(player['name'])
    );
  });
  var rankingForDisplay = filteredRanking.map(function(player) {
    var name = replaceGarbageNames(player['name']);
    var countryCode = replaceFlag(player['name'], player['countryCode']);
    if (player['points'] == lastPlayerPoints) {
      tieOffset++;
    } else {
      rank = rank + tieOffset + 1;
      lastPlayerPoints = player['points'];
      tieOffset = 0;
    }
    return [
      rank,
      countryCode,
      FLAG_BASE_URL + countryCode + FLAG_URL_FILE_EXTENSION,
      '=IMAGE("' + FLAG_BASE_URL + countryCode + FLAG_URL_FILE_EXTENSION + '")', //This is the column we need to write the image to
      '',
      name,
      player['points'],
    ];
  });
  
  var powerRankingsResetRange = powerRankingSheet.getRange(rankingStartingRow, rankingStartingColumn, ranking.length * 2, numColumnsInRanking);
  var powerRankingsRange = powerRankingSheet.getRange(rankingStartingRow, rankingStartingColumn, rankingForDisplay.length, numColumnsInRanking);
  
  powerRankingsResetRange.clearContent();
  powerRankingsResetRange.setBorder(false, false, false, false, false, false);
  powerRankingsRange.setValues(rankingForDisplay);
  
  // update the date updated date
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  powerRankingSheet.getRange(DATE_UPDATED_CELL).setValue(date);

  // save new PR players to grandfathers list
  var newGrandfathers = ranking.filter(function(player){
    return (
      player['points'] >= POWER_RANKING_INCLUSION_POINTS_CUTOFF
      && !grandfathers.includes(player['name'])
    );
  }).map(function(player) {
    return [player['name'], date];
  });
  
  if (newGrandfathers.length > 0) {
    saveNewGrandfathers(newGrandfathers);
  }
  
  updateCategoryDetails();
  updateIndividualScores(filteredRanking);
}
  
/**
* Update the ranking details sheet and return the power ranking data
*
* returns array The ordered list of runners and their power ranking data
*/
function updateRankingDetails() {
  // Initialize our sheet for writing to cells
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var detailsSheet = activeSpreadsheet.getSheetByName(SHEET_NAME_DETAILS);
  
  //Increment update counter to help keep track of script execution
  var range =  detailsSheet.getRange("B5");
  var currentValue = range.getValue();
  range.setValue(currentValue + 1);
  
  // initialize variables that need to persist throughout our iterations over the leaderboard
  var runnerPoints = {};
  var leaderboardStartingColumn = 3;
  var leaderboardColumnOffset = 0;
  var numColumnsPerLeaderboard = 6;
  var numColumnsInPowerRanking = 5;
  var leaderboardHeaderRow = 8;
  var leaderboardColumnOffsetDelta = numColumnsPerLeaderboard + 1; // Set this higher than numColumnsPerLeaderboard to add spacer columns between boards
  
  // clear the current space for the individual game leaderboards. We clear a larger area than we can possibly use to ensure we always properly reset it
  var leaderboardResetRange = detailsSheet.getRange(leaderboardHeaderRow - 1, leaderboardStartingColumn + leaderboardColumnOffsetDelta, NUM_ROWS_TO_CLEAR_FOR_BOARDS, NUM_COLUMNS_TO_CLEAR_FOR_BOARDS);
  leaderboardResetRange.clearContent();
  
  // iterate through each category to look up its leaderboard and calculate PR points
  CATEGORY_DETAILS.forEach(function(currentCategory) {
    // get the leaderboard for this category.
    var leaderboard = getLeaderboardForCategory(currentCategory);   

    console.log(leaderboard.length) 
    
    // Display the leaderboard for debug purposes
    leaderboardColumnOffset = leaderboardColumnOffset + leaderboardColumnOffsetDelta; // Apply the offset delta beforehand to leave room for the actual Power Rankings list at the start
    var gameTitleRange = detailsSheet.getRange(leaderboardHeaderRow - 1, leaderboardStartingColumn + leaderboardColumnOffset, 1, 1);
    var leaderboardHeaderRange = detailsSheet.getRange(leaderboardHeaderRow, leaderboardStartingColumn + leaderboardColumnOffset, 1, numColumnsPerLeaderboard);
    var leaderboardRange = detailsSheet.getRange(leaderboardHeaderRow + 1, leaderboardStartingColumn + leaderboardColumnOffset, leaderboard.length, numColumnsPerLeaderboard);
    var leaderboardToDisplay = leaderboard.map(function(run) {
      return [run['place'], run['runnerCountryCode'], run['runnerID'], run['runnerName'], run['time'], run['points']];
    });
    gameTitleRange.setValues([[currentCategory.gameName]]);
    leaderboardHeaderRange.setValues([['Place', 'Country', 'Runner ID', 'Runner Name', 'Time(s)', 'Points']]);
    leaderboardRange.setValues(leaderboardToDisplay);
    
    // expected structure of each run is {'place':x, 'runnerID':x, 'runnerName':x, 'runnerCountryCode':x, 'time':x, 'points':x}, see getLeaderboardForCategory() for more details
    leaderboard.forEach(function(currentRun) {
      // initialize the points array for this runner we haven't encountered them before
      runnerPoints[currentRun['runnerID']] = runnerPoints[currentRun['runnerID']] || {};
      
      // initialize individual runs array if needed
      if (!Array.isArray(runnerPoints[currentRun['runnerID']]['individualRuns']) || !runnerPoints[currentRun['runnerID']]['individualRuns'].length) {
        runnerPoints[currentRun['runnerID']]['individualRuns'] = [];
      }
      
      // set simple values
      runnerPoints[currentRun['runnerID']]['id'] = currentRun['runnerID'];
      runnerPoints[currentRun['runnerID']]['name'] = currentRun['runnerName'];
      runnerPoints[currentRun['runnerID']]['countryCode'] = currentRun['runnerCountryCode'];
      
      // set their new point total
      var currentPoints = runnerPoints[currentRun['runnerID']]['points'] || 0;
      runnerPoints[currentRun['runnerID']]['points'] = currentPoints + currentRun['points'];
      
      // push the current run to the runner's individual scores
      var currentRunIndividualScoreInfo = {
        'category': currentRun['useSubcategoryName'] ? (currentCategory.categoryLongName + ' (' + currentRun['subcategory'] + ')') : currentCategory.categoryLongName,
        'time': currentRun['time'],
        'percentOffRecord': currentRun['percentOffRecord'],
        'categoryMultiplier': (currentCategory.categoryWeight / 100),
        'points': currentRun['points'],
        'useMilliseconds': currentCategory.useMilliseconds
      }
      runnerPoints[currentRun['runnerID']]['individualRuns'].push(currentRunIndividualScoreInfo);
    });
  });
  
  // convert to array to allow easier iteration
  var powerRanking = [];
  for (var runnerID in runnerPoints) {
    powerRanking.push(runnerPoints[runnerID]);
  }
  
  // sort by highest points first
  powerRanking.sort(function(player1, player2) {
    return player2['points'] - player1['points'];
  });
  
  // generate a simple array from the data we've collected so far to allow sheets to display it
  var placing = 1;
  var powerRankingForDisplay = powerRanking.map(function(player) {
    return [
      placing++,
      player['countryCode'],
      player['id'],
      player['name'],
      player['points'],
    ];
  });
  
  // display the power rankings
  var powerRankingsRange = detailsSheet.getRange(leaderboardHeaderRow + 1, leaderboardStartingColumn, powerRanking.length, numColumnsInPowerRanking);
  var powerRankingsResetRange = detailsSheet.getRange(leaderboardHeaderRow + 1, leaderboardStartingColumn, NUM_ROWS_TO_CLEAR_FOR_BOARDS, leaderboardColumnOffsetDelta);
  
  powerRankingsResetRange.clearContent();
  powerRankingsRange.setValues(powerRankingForDisplay);
      
  return powerRanking;
}

/**
* Queries the speedrun API for the given category's leaderboard.
*
* Returns an array of runs, where each run is an object with the following columns:
*  column 0 - 'place'             - The run's placing on the leaderboard
*  column 1 - 'runnerID'          - The speedrun.com user id for the runner
*  column 2 - 'runnerName'        - The speedrun.com name of the runner (international name by default, japanese name if international name is missing)
*  column 3 - 'runnerCountryCode' - The speedrun.com country code of the runner (or 'unknown' if they're a guest runner)
*  column 4 - 'time'              - The time of the run in seconds
*  column 5 - 'points'            - The number of Power Ranking points the runner receives for this run
*/
function getLeaderboardForCategory(category) {
  /*
  / Grab the list of laederboard URLs for this category. Most categories only have one URL.
  / Multiple URLs mean that there are variations of the category that are similar enough to combine them on the PR.
  / In such a case, we will check what PR score the player would get from each leaderboard and take the largest one.
  */
  var categoryURLs = category.apiURLsBySubcategory;

  var leaderboardByRunnerID = {};

  // Determine fastest overall time for a category with subcategories, there's probably a more efficient way to do this without having to add a second API pull but as far as I can tell it doesn't add that much runtime
  var fastestTime = 0.0;
  if (category.hasSubCategories) {
    categoryURLs.forEach(function(getFastestSubcategory) {
       var response = UrlFetchApp.fetch(getFastestSubcategory.url, {'muteHttpExceptions': true});
       var data = JSON.parse(response.getContentText())
       var wr = data['data']['runs'][0]['run']['times']['primary_t'];
       if (fastestTime == 0.0 || wr < fastestTime) {
        fastestTime = wr
       }
    });
  }

  categoryURLs.forEach(function(urlBySubcategory) {
    // Query the API with the given leaderboard URL
    var response = UrlFetchApp.fetch(urlBySubcategory.url, {'muteHttpExceptions': true});
    var data = JSON.parse(response.getContentText())
    
    // Extract the player list from the appended data and store it against the runner ID for easy access. We need both the player name and their country code
    var players = data['data']['players']['data'];
    var playerNamesById = [];
    players.forEach(function(currentPlayer) {
      // there's a guest player entity with no name data, so confirm that we have data before we fetch the name. ignore entries where the data is missing
      if ('names' in currentPlayer) {
        // use the japanese name as a backup if international is missing
        var playerName = currentPlayer['names']['international'] || currentPlayer['names']['japanese'];
        var playerID = currentPlayer['id'];
        playerNamesById[playerID] = playerName;
      }
    });

    players.forEach(function(currentPlayer) {
      // there are guest player entities with no ID, so confirm that we have data before we fetch the name. ignore entries where the data is missing
      if ('rel' in currentPlayer && currentPlayer['rel'] === 'user'
        && 'names' in currentPlayer && currentPlayer['names']) {
        // use the japanese name as a backup if international is missing
        var playerName = currentPlayer['names']['international'] || currentPlayer['names']['japanese'];
        var playerID = currentPlayer['id'];
        var playerCountryCode = 'unknown';
        if ('location' in currentPlayer && currentPlayer['location']
          && 'country' in currentPlayer['location'] && currentPlayer['location']['country']
          && 'code' in currentPlayer['location']['country'] && currentPlayer['location']['country']['code']) {
          // add country code if available
          playerCountryCode = currentPlayer['location']['country']['code'];
        }
        playerNamesById[playerID] = {
          'playerName': playerName,
          'playerCountryCode': playerCountryCode
        };
      }
    });
    
    // extract the run data
    var runs = data['data']['runs'];
    
    // get the first place time in seconds for points calculations, and save it to the global constant
    var firstPlaceTime = runs[0]['run']['times']['primary_t'];
    CATEGORY_RECORDS[getCategoryRecordKeyForCategory(category, urlBySubcategory.subcategoryName)] = firstPlaceTime;
    
    // build the leaderboard of runs
    runs.forEach(function(currentRun) {
      // get the placing of the run
      var place = currentRun['place'];
      
      // get the player ID. this is their speedrun.com user id if applicable, otherwise it's their display name on the leaderboard
      var runnerID = (currentRun['run']['players'][0]['rel'] === 'user') ? currentRun['run']['players'][0]['id'] : currentRun['run']['players'][0]['name'];
      
      // get the player name. this is their speedrun.com username if applicable, otherwise it's their display name on the leaderboard
      var runnerName = (currentRun['run']['players'][0]['rel'] === 'user') ? playerNamesById[currentRun['run']['players'][0]['id']]['playerName'] : currentRun['run']['players'][0]['name'];
      
      // get the player's country code, if available
      var runnerCountryCode = (currentRun['run']['players'][0]['rel'] === 'user') ? playerNamesById[currentRun['run']['players'][0]['id']]['playerCountryCode'] : 'unknown';
      
      // get the time of the run in seconds
      var time = currentRun['run']['times']['primary_t'];
      
      // get the number of Power Ranking points the runner receives for this run
      var points = Math.pow(Math.max((1 - ((100 / POINTS_AWARDED_CUTOFF_PERCENTAGE) * ((time / firstPlaceTime) - 1))), 0), 2) * category.categoryWeight;
      
      // calculate how far off the record this run is
      var percentOffRecord = ((time / firstPlaceTime) - 1) * 100;
      
      // form the run object
      var run = {
        'place': place,
        'runnerID': runnerID,
        'runnerName': runnerName,
        'runnerCountryCode': runnerCountryCode,
        'time': time,
        'points': points,
        'percentOffRecord': percentOffRecord,
        'useMilliseconds': category.useMilliseconds,
        'useSubcategoryName': category.hasSubCategories,
        'subcategory': urlBySubcategory.subcategoryName,
        'fasterSubcategory': urlBySubcategory.isFastest
      };

      /*
      * In case this category has multiple leaderboards count for it, we need to check if we already saw this runner on a previous leaderboard.
      * If yes, we need to check how many points they earned in the existing run object, and if the new run object awards more points, overwrite the existing one
      * If no, we need to add this run object as a new entry on the board
      */
      /* Leaving this code here since it more explicitly follows the above instructions, but rewrote it to be more concise after
        if (runnerID in leaderboardByRunnerID) {
          if (run['points'] > leaderboardByRunnerID[runnerID]['points']) {
            leaderboardByRunnerID[runnerID] = run
          }
        } else {
          leaderboardByRunnerID[runnerID] = run
        }
      */
      // MK note May 3 2023: Also shoehorned in the point correction for slow runs in theoretically faster subcategories here lol
      if (!(runnerID in leaderboardByRunnerID) || (run['points'] > leaderboardByRunnerID[runnerID]['points'])) {
        if (run['fasterSubcategory'] && run['time'] > fastestTime) {
          run['points'] = Math.pow(Math.max((1 - ((100 / POINTS_AWARDED_CUTOFF_PERCENTAGE) * ((time / fastestTime) - 1))), 0), 2) * category.categoryWeight;
        }
        leaderboardByRunnerID[runnerID] = run;
      }
    });
  });

  // Extract only the run objects for the leaderboard
  var leaderboard = Object.values(leaderboardByRunnerID)
  
  return leaderboard;
}

/**
* Return the Category Record Key for a given category
*
* returns string, key for category record array for the given category
*/
function getCategoryRecordKeyForCategory(category, subcategoryName) {
  var appendSubcategory = CATEGORY_RECORD_SUBCATEGORY_SEPARATION_STRING + subcategoryName;
  var categoryRecordKeyForCategory = category.categoryLongName;
  if (category.hasSubCategories) {
    categoryRecordKeyForCategory = categoryRecordKeyForCategory + appendSubcategory;
  }
  return categoryRecordKeyForCategory;
}

/**
* Get a list of players who have earned the right to be permanently displayed in the PR, regardless of current points
*
* returns array of strings, names of players to display unconditionally
*/
function getGrandfathers() {
  var grandfathersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_GRANDFATHERS);
  var lastRow = grandfathersSheet.getLastRow();
  var grandfathersNameRange = grandfathersSheet.getRange(2, 1, lastRow - 1, 1);
  var grandfathers = grandfathersNameRange.getValues();
    
  return grandfathers.map(function(granddaddy) {
    return granddaddy[0];
  });
}
  
/**
* Save new players to the grandfathers list so that they'll always be displayed in future updates
*
* @param newGrandfathers [][] Array of arrays of the form ['PlayerName', currentdate]
*
* returns void
*/
function saveNewGrandfathers(newGrandfathers) {
  var grandfathersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_GRANDFATHERS);
  var lastRow = grandfathersSheet.getLastRow();
  var newGrandfathersRange = grandfathersSheet.getRange(lastRow + 1, 1, newGrandfathers.length, 2);
  
  newGrandfathersRange.setValues(newGrandfathers);
}
  
/**
* DO NOT USE. PLAYERS THROUGH THIS URL ARE PAGINATED AND I CANNOT FIND A WAY AROUND THAT, AND IT MAKES THIS APPROACH USELESS
* Save new players to the grandfathers list so that they'll always be displayed in future updates
*
* @param newGrandfathers [][] Array of arrays of the form ['PlayerName', currentdate]
*
* returns void
*/
function updateFlagList() {
  var flagSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_FLAGS);
  var lastRow = flagSheet.getLastRow();
  var currentCountryList = [];
  if (lastRow > 1) {
    var currentFlagsRange = flagSheet.getRange(2, 1, lastRow - 1, 1);
  
    currentCountryList = currentFlagsRange.getValues().map(function(country) {
      return country[0];
    });
  }
  
  // Query the API with the given categories URL
  var response = UrlFetchApp.fetch(API_ALL_USERS_URL, {'muteHttpExceptions': true});
  var data = JSON.parse(response.getContentText())["data"];
  
  var newCountries = [];
  data.forEach(function(country){
    var countryName = '';
    var countryCode = '';
    if ('location' in country && country["location"]
        && 'country' in country["location"] && country["location"]["country"]
        && 'names' in country["location"]["country"] && country["location"]["country"]["names"]
        && 'code' in country["location"]["country"] && country["location"]["country"]["code"]
        && 'international' in country["location"]["country"]["names"]) {
      countryName = country["location"]["country"]["names"]["international"] || '';
      countryCode = country["location"]["country"]["code"] || '';
      Logger.log(countryName);
    }
    if (countryName !== '' && countryCode !== '' && !currentCountryList.includes(countryName) && !newCountries.includes(countryName)) {
      newCountries.push([countryName, countryCode]); 
    }
  });
  
  if (newCountries.length > 0) {
    var newFlagsRange = flagSheet.getRange(lastRow + 1, 1, newCountries.length, 2);
    newFlagsRange.setValues(newCountries);
  }
}

/**
* Some players have garbage names on SRC so we need to replace them with a version that isn't dogshit
*
* @param playerName String The name we need to check for potential replacements
*
* returns string The replacement name if needed, otherwise the same name passed in
*/  
function replaceGarbageNames(playerName) {
    return PLAYER_NAMES_TO_REPLACE[playerName] || playerName;
}
  
/**
* Some players have missing flags on SRC so we need to add them if we know them
*
* @param playerName        String The name we need to check for hardcoded country codes
* @param playerCountryCode String The country code we currently have for this player, based on src data
*
* returns string The replacement code if needed, otherwise the code that was passed in
*/  
function replaceFlag(playerName, playerCountryCode) {
    return PLAYER_COUNTRY_CODES_TO_REPLACE[playerName] || playerCountryCode;
}
  
/**
* Updates the category details sheet with information on the categories in the Power Rankings including their point value, current record, and minimum time to earn points
*/  
function updateCategoryDetails() {
  var categoryDetailsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_CATEGORY_DETAILS);

  // reset and display the category details
  var categoryDetailsStartingRow = 2;
  var categoryDetailsStartingColumn = 1;
  var categoryDetailsNumColumns = 4
  var categoryDetailsResetRange = categoryDetailsSheet.getRange(categoryDetailsStartingRow, categoryDetailsStartingColumn, CATEGORY_DETAILS.length * 3, categoryDetailsNumColumns);
  
  categoryDetailsResetRange.clearContent();

  var currentRow = categoryDetailsStartingRow;
  
  var categoryDetailsForDisplay = CATEGORY_DETAILS.map(function(category) {
    if (category.hasSubCategories) {
      var categoryDetails = [[
        category.categoryLongName,
        category.categoryWeight/100,
        '',
        ''
      ]];
      var categoryNameRange = categoryDetailsSheet.getRange(currentRow, categoryDetailsStartingColumn, 1, 1);
      var categoryDetailsRange = categoryDetailsSheet.getRange(currentRow, categoryDetailsStartingColumn, 1, categoryDetailsNumColumns);
      categoryNameRange.setHorizontalAlignment("left");
      categoryDetailsRange.setValues(categoryDetails);
      currentRow = currentRow + 1;

      category.apiURLsBySubcategory.forEach(function(subcategory) {
        var record = category.useMilliseconds ? toHHMMSSMMM(CATEGORY_RECORDS[getCategoryRecordKeyForCategory(category, subcategory.subcategoryName)]) : toHHMMSS(CATEGORY_RECORDS[getCategoryRecordKeyForCategory(category, subcategory.subcategoryName)]);
        var maximumTimeToEarnPoints = category.useMilliseconds ? toHHMMSSMMM(CATEGORY_RECORDS[getCategoryRecordKeyForCategory(category, subcategory.subcategoryName)] * 1.5 - 0.001) : toHHMMSS(Math.ceil(CATEGORY_RECORDS[getCategoryRecordKeyForCategory(category, subcategory.subcategoryName)] * 1.5) - 1);

        var categoryDetails = [[
          subcategory.subcategoryName,
          '',
          record,
          maximumTimeToEarnPoints
        ]];
        var categoryNameRange = categoryDetailsSheet.getRange(currentRow, categoryDetailsStartingColumn, 1, 1);
        var categoryDetailsRange = categoryDetailsSheet.getRange(currentRow, categoryDetailsStartingColumn, 1, categoryDetailsNumColumns);
        categoryNameRange.setHorizontalAlignment("right");
        categoryDetailsRange.setValues(categoryDetails);
        currentRow = currentRow + 1;
      });
    } else {
      var record = category.useMilliseconds ? toHHMMSSMMM(CATEGORY_RECORDS[getCategoryRecordKeyForCategory(category, category.apiURLsBySubcategory[0].subcategoryName)]) : toHHMMSS(CATEGORY_RECORDS[getCategoryRecordKeyForCategory(category, category.apiURLsBySubcategory[0].subcategoryName)]);
      var maximumTimeToEarnPoints = category.useMilliseconds ? toHHMMSSMMM(CATEGORY_RECORDS[getCategoryRecordKeyForCategory(category, category.apiURLsBySubcategory[0].subcategoryName)] * 1.5 - 0.001) : toHHMMSS(Math.ceil(CATEGORY_RECORDS[getCategoryRecordKeyForCategory(category, category.apiURLsBySubcategory[0].subcategoryName)] * 1.5) - 1);

      var categoryDetails = [[
        category.categoryLongName,
        category.categoryWeight/100,
        record,
        maximumTimeToEarnPoints
      ]];
      var categoryNameRange = categoryDetailsSheet.getRange(currentRow, categoryDetailsStartingColumn, 1, 1);
      var categoryDetailsRange = categoryDetailsSheet.getRange(currentRow, categoryDetailsStartingColumn, 1, categoryDetailsNumColumns);
      categoryNameRange.setHorizontalAlignment("left");
      categoryDetailsRange.setValues(categoryDetails);
      currentRow = currentRow + 1;
    }
  });
}
  
/**
* Updates the individual scores sheet with details on what runs players did to earn their points
*/  
function updateIndividualScores(ranking) {
  var individualScoresSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_INDIVIDUAL_SCORES);
  individualScoresSheet.clear({ formatOnly: false, contentsOnly: true });
  
  var numColumns = 5;
  var currentRow = 2;
  
  var firstColumn = individualScoresSheet.getRange(currentRow, 1, 1000, 1);
  firstColumn.setFontWeight("normal");
  
  var restOfSheet = individualScoresSheet.getRange(currentRow, 2, 1000, 5);
  restOfSheet.setHorizontalAlignment("right");
  
  ranking.forEach(function(currentPlayer) {
    var currentRange = individualScoresSheet.getRange(currentRow, 1, 1, numColumns);
    
    var name = replaceGarbageNames(currentPlayer['name']);
    
    var playerHeader = [
      name,
      'Time',
      '% off WR',
      'Multiplier',
      'Score'
    ];
    currentRange.setValues([playerHeader]);
    
    var playerNameCell = individualScoresSheet.getRange(currentRow, 1, 1, 1);
    playerNameCell.setFontWeight("bold");
    
    var individualDataHeaders = individualScoresSheet.getRange(currentRow, 2, 1, 5);
    individualDataHeaders.setHorizontalAlignment("left");
    
    currentRow = currentRow + 1;
    
    currentPlayer['individualRuns'].forEach(function(currentRun) {
      currentRange = individualScoresSheet.getRange(currentRow, 1, 1, numColumns);
      
      var runTime = currentRun['useMilliseconds'] ? toHHMMSSMMM(currentRun['time']) : toHHMMSS(currentRun['time']);
      
      var runToDisplay = [
        currentRun['category'],
        runTime,
        currentRun['percentOffRecord'],
        currentRun['categoryMultiplier'],
        currentRun['points']
      ];
      
      currentRange.setValues([runToDisplay]);
      
      currentRow = currentRow + 1;
    });
    
    currentRange = individualScoresSheet.getRange(currentRow, numColumns, 1, 1);
    currentRange.setValues([[currentPlayer['points']]]);
    currentRow = currentRow + 2;
  });
}

/**
* Converts a time in seconds to a variable ((HH:)MM:)SS format that is more friendly for viewing
*
* Logic adapted from a method posted by stackoverflow's Santiago Hernández, originally found at: https://stackoverflow.com/a/34841026
*
* returns String the formatted time string
*/
function toHHMMSS(time) {
  var timeComponents = [];
  var firstComponentAdded = false; // we want to ignore leading zeroes on the first component, but keep them on subsequent components
  
  if (time >= 3600) {
    timeComponents.push(Math.floor(time / 3600));
    firstComponentAdded = true;
  }
  
  if (time >= 60) {
    var component = Math.floor(time / 60) % 60;
    timeComponents.push((component < 10 && firstComponentAdded) ? "0" + component : component);
    firstComponentAdded = true;
  }
  
  var component = Math.floor(time % 60);
  timeComponents.push((component < 10 && firstComponentAdded) ? "0" + component : component);
  
  return timeComponents.join(':');
}
  
/**
* Converts a time in seconds to a variable (((HH:)MM:)SS).MMM format that is more friendly for viewing
*
* Logic adapted from a method posted by stackoverflow's Santiago Hernández, originally found at: https://stackoverflow.com/a/34841026
*
* returns String the formatted time string
*/
function toHHMMSSMMM(time) {
  var timeComponents = [];
  var firstComponentAdded = false; // we want to ignore leading zeroes on the first component, but keep them on subsequent components
  
  if (time >= 3600) {
    timeComponents.push(Math.floor(time / 3600) + ':');
    firstComponentAdded = true;
  }
  
  if (time >= 60) {
    var component = Math.floor(time / 60) % 60;
    timeComponents.push(((component < 10 && firstComponentAdded) ? "0" + component : component) + ':');
    firstComponentAdded = true;
  }
  
  if (time >= 1) {
    var component = Math.floor(time) % 60;
    timeComponents.push(((component < 10 && firstComponentAdded) ? "0" + component : component) + '.');
    firstComponentAdded = true;
  }
  
  var component = Math.ceil((time % 1) * 1000);
  if (firstComponentAdded) {
    if (component < 10) {
      component = '00' + component;
    } else if (component < 100) {
      component = '0' + component;
    }
  }
  timeComponents.push(component);
  
  return timeComponents.join('');
}