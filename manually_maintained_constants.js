/*
/ 2020-2022, Nicholas Chaput (mapler90210 / marche9th)
*/

// Sheet names
var SHEET_NAME_POWER_RANKINGS = 'Rankings';
var SHEET_NAME_DETAILS = 'API Pull';
var SHEET_NAME_GRANDFATHERS = 'Grandfathers';
var SHEET_NAME_FLAGS = 'Flag URLs';
var SHEET_NAME_CATEGORY_DETAILS = 'Category Details';
var SHEET_NAME_INDIVIDUAL_SCORES = 'Individual Score Breakdowns';

var DATE_UPDATED_CELL = 'K29'; // Cell on main ranking sheet which contained the date that the PR was last updated

var POINTS_AWARDED_CUTOFF_PERCENTAGE = 50; // percentage of time above the first place time at which players will no longer receive points
var POWER_RANKING_INCLUSION_POINTS_CUTOFF = 300.0 // number of points required to be displayed in the PR

var NUM_COLUMNS_TO_CLEAR_FOR_BOARDS = 300; // Arbitrary value comfortably above the expected maximum columns required to display all boards, including the PR itself
var NUM_ROWS_TO_CLEAR_FOR_BOARDS    = 1000;// Arbitrary value comfortably above the expected maximum rows required to display all players, including the PR itself

// Players who, for whatever reason, need a different display name on the PR than on speedrun.com
var PLAYER_NAMES_TO_REPLACE = [];
PLAYER_NAMES_TO_REPLACE['[jp]黒パン (JetToast)'] = 'JetToast';
PLAYER_NAMES_TO_REPLACE['heikin_fan_club'] = '0xwas';

// Players whose countries we know but isn't populated on speedrun.com
var PLAYER_COUNTRY_CODES_TO_REPLACE = [];
PLAYER_COUNTRY_CODES_TO_REPLACE['[jp]黒パン (JetToast)'] = 'jp';
PLAYER_COUNTRY_CODES_TO_REPLACE['Fretzi'] = 'de';

// See https://docs.google.com/document/d/1zaa6thWEEsQrQYN26ji6-saAZ6Pe6Vf9Y-PD1goGqSc/edit for instructions on adding/editing API URLs
var CATEGORY_DETAILS = [
  {
    'gameName': 'Kirby\'s Dream Land',
    'categoryLongName': 'KDL Normal Mode',
    'categoryShortName': 'Normal Mode',
    'categoryWeight': 150,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': true,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/m9do0odp/category/9kvxqo2g?embed=players'
        }
      ]
  },
  {
    'gameName': 'Kirby\'s Dream Land',
    'categoryLongName': 'KDL Extra Mode',
    'categoryShortName': 'Extra Mode',
    'categoryWeight': 125,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': true,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/m9do0odp/category/ndx4y612?embed=players'
        }
      ]
  },
  {
    'gameName': 'Kirby\'s Adventure',
    'categoryLongName': 'KA Any% NMG',
    'categoryShortName': 'Any%',
    'categoryWeight': 150,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': true,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/om1mkxd2/category/rklg9ndn?embed=players'
        }
      ]
  },
  {
    'gameName': 'Kirby\'s Adventure',
    'categoryLongName': 'KA 100% NMG',
    'categoryShortName': '100% NMG',
    'categoryWeight': 125,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': true,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/om1mkxd2/category/ndx8erkq?embed=players'
        }
      ]
  },
  {
    'gameName': 'Kirby\'s Adventure',
    'categoryLongName': 'KA Any% NSG',
    'categoryShortName': 'Any%',
    'categoryWeight': 50,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': true,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/om1mkxd2/category/wkpj47gk?embed=players'
        }
      ]
  },
  {
    'gameName': 'Kirby\'s Adventure',
    'categoryLongName': 'KA Any%',
    'categoryShortName': 'Any%',
    'categoryWeight': 25,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': true,
    'useMilliseconds': true,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/om1mkxd2/category/w20z85dn?embed=players'
        }
      ]
  },
    {
    'gameName': 'Kirby\'s Adventure',
    'categoryLongName': 'KA 100%',
    'categoryShortName': '100%',
    'categoryWeight': 25,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': true,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/om1mkxd2/category/7dgyvr4d?embed=players'
        }
      ]
  },
  {
    'gameName': 'Kirby\'s Dream Land 2',
    'categoryLongName': 'KDL2 Best Ending',
    'categoryShortName': 'Best Ending',
    'categoryWeight': 100,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/kyd42k6e/category/z27g6r02?embed=players'
        }
      ]
  },
  {
    'gameName': 'Kirby\'s Dream Land 2',
    'categoryLongName': 'KDL2 Any%',
    'categoryShortName': 'Any%',
    'categoryWeight': 125,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/kyd42k6e/category/wdmq9o2q?embed=players'
        }
      ]
  },
  {
    'gameName': 'Kirby\'s Dream Land 2',
    'categoryLongName': 'KDL2 100%',
    'categoryShortName': '100%',
    'categoryWeight': 75,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/kyd42k6e/category/vdo4zv2p?embed=players'
        }
      ]
  },
  {
    'gameName': 'Kirby Super Star',
    'categoryLongName': 'KSS Any%',
    'categoryShortName': 'Any%',
    'categoryWeight': 150,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/l3dxny1y/category/wkpy9wkr?embed=players'
        }
      ]
  },
  {
    'gameName': 'Kirby Super Star',
    'categoryLongName': 'KSS 100%',
    'categoryShortName': '100%',
    'categoryWeight': 150,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': true,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/l3dxny1y/category/7dggxpd4?embed=players'
        }
      ]
  },
  {
    'gameName': 'Kirby\'s Dream Land 3',
    'categoryLongName': 'KDL3 Best Ending',
    'categoryShortName': 'Best Ending',
    'categoryWeight': 125,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': true,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'No 2P',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/xv1p9p68/category/5dwp9lkg?embed=players&var-2lgz4z68=5lee835l',
          'isFastest': false
        },
        {
          'subcategoryName': '2P',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/xv1p9p68/category/5dwp9lkg?embed=players&var-2lgz4z68=0q528xmq',
          'isFastest': true
        }
      ]
  },
  {
    'gameName': 'Kirby\'s Dream Land 3',
    'categoryLongName': 'KDL3 Any%',
    'categoryShortName': 'Any%',
    'categoryWeight': 125,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/xv1p9p68/category/mke5v6k6?embed=players'
        }
      ]
  },
  {
    'gameName': 'Kirby\'s Dream Land 3',
    'categoryLongName': 'KDL3 100%',
    'categoryShortName': '100%',
    'categoryWeight': 50,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/xv1p9p68/category/ndx80v5k?embed=players'
        }
      ]
  },
  {
    'gameName': ' Kirby 64: The Crystal Shards',
    'categoryLongName': 'K64 Any%',
    'categoryShortName': 'Any%',
    'categoryWeight': 125,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/946wq96r/category/wk6j0xd1?embed=players'
        }
      ]
  },
  {
    'gameName': ' Kirby 64: The Crystal Shards',
    'categoryLongName': 'K64 100%',
    'categoryShortName': '100%',
    'categoryWeight': 150,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/946wq96r/category/n2y1e82o?embed=players'
        }
      ]
  },
  {
    'gameName': 'Kirby: Nightmare in Dream Land',
    'categoryLongName': 'KNiDL Any%',
    'categoryShortName': 'Any%',
    'categoryWeight': 150,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/576rzld8/category/7kjrox23?embed=players'
        }
      ]
  },
  {
    'gameName': 'Kirby: Nightmare in Dream Land',
    'categoryLongName': 'KNiDL 100%',
    'categoryShortName': '100%',
    'categoryWeight': 125,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/576rzld8/category/xk9lwyk0?embed=players'
        }
      ]
  },
  {
    'gameName': ' Kirby & The Amazing Mirror',
    'categoryLongName': 'KatAM Any%',
    'categoryShortName': 'Any%',
    'categoryWeight': 150,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/4pd00lde/category/9kvx882g?embed=players'
        }
      ]
  },
  {
    'gameName': ' Kirby & The Amazing Mirror',
    'categoryLongName': 'KatAM 100%',
    'categoryShortName': '100%',
    'categoryWeight': 125,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/4pd00lde/category/rklg5ndn?embed=players'
        }
      ]
  },
  {
    'gameName': ' Kirby: Squeak Squad',
    'categoryLongName': 'KSqSq Any%',
    'categoryShortName': 'Any%',
    'categoryWeight': 125,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/4pdvyvdw/category/vdo45v2p?embed=players'
        }
      ]
  },
  {
    'gameName': ' Kirby: Squeak Squad',
    'categoryLongName': 'KSqSq 100%',
    'categoryShortName': '100%',
    'categoryWeight': 125,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/4pdvyvdw/category/wkpy5wkr?embed=players'
        }
      ]
  },
  {
    'gameName': 'Kirby Super Star Ultra',
    'categoryLongName': 'KSSU Beat RotK',
    'categoryShortName': 'Beat RotK',
    'categoryWeight': 100,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/8m1z8x10/category/824xlwnd?embed=players'
        }
      ]
  },
  {
    'gameName': 'Kirby Super Star Ultra',
    'categoryLongName': 'KSSU 100%',
    'categoryShortName': '100%',
    'categoryWeight': 100,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/8m1z8x10/category/mke5x6k6?embed=players'
        }
      ]
  },
  {
    'gameName': 'Kirby\'s Return to Dream Land',
    'categoryLongName': 'KRtDL Any%',
    'categoryShortName': 'Any%',
    'categoryWeight': 125,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/n4d7yld7/category/7kjrgx23?embed=players&var-789ko7ql=5q8gg76l'
        }
      ]
  },
  {
    'gameName': 'Kirby\'s Return to Dream Land',
    'categoryLongName': 'KRtDL 100%',
    'categoryShortName': '100%',
    'categoryWeight': 125,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/n4d7yld7/category/xk9lxyk0?embed=players&var-2lgzjwq8=mln556nl'
        }
      ]
  },
  {
    'gameName': 'Kirby\'s Return to Dream Land',
    'categoryLongName': 'KRtDL Kirby Master',
    'categoryShortName': 'Kirby Master',
    'categoryWeight': 50,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/n4d7yld7/category/ndx7e352?embed=players'
        }
      ]
  },
  {
    'gameName': ' Kirby\'s Dream Collection: Special Edition',
    'categoryLongName': 'KDC All Challenges',
    'categoryShortName': 'All Challenges',
    'categoryWeight': 100,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/268xe71p/category/vdo0vnod?embed=players'
        }
      ]
  },
  {
    'gameName': ' Kirby\'s Dream Collection: Special Edition',
    'categoryLongName': 'KDC King\'s Trophy',
    'categoryShortName': 'King\'s Trophy',
    'categoryWeight': 50,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/268xe71p/category/jdz4g3kv?embed=players'
        }
      ]
  },
  {
    'gameName': ' Kirby: Triple Deluxe',
    'categoryLongName': 'KTD Any%',
    'categoryShortName': 'Any%',
    'categoryWeight': 100,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/29d3z91l/category/z277vg20?embed=players'
        }
      ]
  },
  {
    'gameName': ' Kirby: Triple Deluxe',
    'categoryLongName': 'KTD All Sunstones',
    'categoryShortName': 'All Sunstones',
    'categoryWeight': 50,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/29d3z91l/category/zdnqyqdq?embed=players'
        }
      ]
  },
  {
    'gameName': ' Kirby: Triple Deluxe',
    'categoryLongName': 'KTD 100%',
    'categoryShortName': '100%',
    'categoryWeight': 50,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/29d3z91l/category/q25418do?embed=players'
        }
      ]
  },
  {
    'gameName': ' Kirby: Planet Robobot',
    'categoryLongName': 'KPR Any%',
    'categoryShortName': 'Any%',
    'categoryWeight': 100,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/m1mgxp12/category/rklggm8d?embed=players'
        }
      ]
  },
  {
    'gameName': ' Kirby: Planet Robobot',
    'categoryLongName': 'KPR All Code Cubes',
    'categoryShortName': 'All Code Cubes',
    'categoryWeight': 50,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/m1mgxp12/category/ndx88lvk?embed=players'
        }
      ]
  },
  {
    'gameName': ' Kirby: Planet Robobot',
    'categoryLongName': 'KPR 100%',
    'categoryShortName': '100%',
    'categoryWeight': 50,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/m1mgxp12/category/vdo44g92?embed=players'
        }
      ]
  },
  {
    'gameName': ' Kirby: Star Allies',
    'categoryLongName': 'KSA Any%',
    'categoryShortName': 'Any%',
    'categoryWeight': 125,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/j1ne4y91/category/rklq1l62?embed=players'
        }
      ]
  },
  {
    'gameName': ' Kirby: Star Allies',
    'categoryLongName': 'KSA All Big Pieces + Switches',
    'categoryShortName': 'ABPS',
    'categoryWeight': 50,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/j1ne4y91/category/zd3xynyd?embed=players'
        }
      ]
  },
    {
    'gameName': ' Kirby: Star Allies',
    'categoryLongName': 'KSA 100%',
    'categoryShortName': '100%',
    'categoryWeight': 50,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/j1ne4y91/category/xk9g4o4d?embed=players&var-5lyee9g8=139xrek1'
        }
      ]
  },
  {
    'gameName': ' Kirby: Star Allies',
    'categoryLongName': 'KSA Crown%',
    'categoryShortName': 'Crown%',
    'categoryWeight': 50,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/j1ne4y91/category/xk9g4o4d?embed=players&var-5lyee9g8=qvvxdw5q'
        }
      ]
  },
  {
    'gameName': ' Super Kirby Clash',
    'categoryLongName': 'SKC Any%',
    'categoryShortName': 'Any%',
    'categoryWeight': 50,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/268em2y6/category/rklleowk?embed=players'
        }
      ]
  },
  {
    'gameName': ' Kirby and the Forgotten Land',
    'categoryLongName': 'KFL Any%',
    'categoryShortName': 'Any%',
    'categoryWeight': 150,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/46w2wo76/category/w20no45d?embed=players'
        }
      ]
  },
  {
    'gameName': ' Kirby and the Forgotten Land',
    'categoryLongName': 'KFL True Ending',
    'categoryShortName': 'True Ending',
    'categoryWeight': 50,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/46w2wo76/category/9d8lmpw2?embed=players'
        }
      ]
  },
  {
    'gameName': ' Kirby and the Forgotten Land',
    'categoryLongName': 'KFL All Waddle Dees',
    'categoryShortName': 'All Waddle Dees',
    'categoryWeight': 100,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/46w2wo76/category/jdzng3rd?embed=players'
        }
      ]
  },
  {
    'gameName': ' Kirby and the Forgotten Land',
    'categoryLongName': 'KFL All Waddle Dees + Souls',
    'categoryShortName': 'All Waddle Dees + Souls',
    'categoryWeight': 25,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/46w2wo76/category/02qr1g7k?embed=players'
        }
      ]
  },
  {
    'gameName': ' Kirby and the Forgotten Land',
    'categoryLongName': 'KFL 100%',
    'categoryShortName': '100%',
    'categoryWeight': 50,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': false,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'N/A (no subcategory)',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/46w2wo76/category/8248vxek?embed=players'
        }
      ]
  },
  {
    'gameName': 'Kirby\'s Return to Dream Land Deluxe',
    'categoryLongName': 'KRtDLDX Any%',
    'categoryShortName': 'Any%',
    'categoryWeight': 100,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': true,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'Restricted',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/o6gn20n1/category/vdogojv2?embed=players&var-789d9p0n=1dkj794l',
          'isFastest': false
        },
        {
          'subcategoryName': 'Unrestricted',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/o6gn20n1/category/vdogojv2?embed=players&var-789d9p0n=q8kx7jgq',
          'isFastest': true
        }
      ]
  },
    {
    'gameName': 'Kirby\'s Return to Dream Land Deluxe',
    'categoryLongName': 'KRtDLDX 100%',
    'categoryShortName': '100%',
    'categoryWeight': 75,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': true,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'Restricted',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/o6gn20n1/category/xd1olq8k?embed=players&var-onv4kgrn=qyzved41',
          'isFastest': false
        },
        {
          'subcategoryName': 'Unrestricted',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/o6gn20n1/category/xd1olq8k?embed=players&var-onv4kgrn=ln846p0l',
          'isFastest': true
        }
      ]
  },
  {
    'gameName': 'Kirby\'s Return to Dream Land Deluxe',
    'categoryLongName': 'KRtDLDX Kirby Master',
    'categoryShortName': 'Kirby Master',
    'categoryWeight': 50,
    'categoryRecord': null, // DO NOT POPULATE MANUALLY. This is populated automatically when the API is called
    'useInTestList': false,
    'useMilliseconds': false,
    'hasSubCategories': true,
    'apiURLsBySubcategory': [
        {
          'subcategoryName': 'Restricted',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/o6gn20n1/category/9kv37l02?embed=players&var-789d9o6n=q659kn3l',
          'isFastest': false
        },
        {
          'subcategoryName': 'Unrestricted',
          'url': 'https://www.speedrun.com/api/v1/leaderboards/o6gn20n1/category/9kv37l02?embed=players&var-789d9o6n=lmorjvj1',
          'isFastest': true
        }
      ]
  }
];
