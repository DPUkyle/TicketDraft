package com.kylemoore.TicketDraft

//uses com.google.common.collect.ImmutableSet
uses java.io.File
uses java.util.Set
uses java.util.HashSet
uses java.io.FileInputStream
uses org.apache.logging.log4j.Logger
uses org.apache.poi.hssf.usermodel.HSSFCell
uses org.apache.poi.hssf.usermodel.HSSFDateUtil
uses org.apache.poi.hssf.usermodel.HSSFRow
uses org.apache.poi.hssf.usermodel.HSSFSheet
uses org.apache.poi.hssf.usermodel.HSSFWorkbook
uses org.apache.logging.log4j.LogManager
uses java.util.Properties
uses java.util.Map
uses java.util.HashMap
uses java.lang.Integer
uses java.util.TreeSet
uses java.util.ArrayList
uses gw.util.Stack
uses java.lang.Exception

/**
 * Arguments for TicketReader
 */
class PrefReader {

  //static var _masterList : File as readonly MasterList

  //static var _allGames : ImmutableSet<Game> as readonly AllGames

  static var logger : Logger = LogManager.getLogger("") // root logger

  private var _numUsers : int as readonly NumUsers
  private var _userList : List<User> as readonly UserList //Order matters!
  private var _picks : HashMap<User, Stack<String>> as readonly Picks
  private var _numGames : int as readonly NumGames

  /**
   * Direct instantiation not allowed
   **/
  private construct() {
    logger.debug("Constructing PerfReader")
    var propsMap : Map<String, String> = initProperties() //new Properties()
    propsMap.eachKeyAndValue( \ k, v -> {
      logger.debug("Dumping propsMap ${k}:${v}")
    })
    //get num users
    _numUsers = propsMap.get("NumberOfUsers").toInt()
    logger.info("Number of users is set to ${NumUsers}")

    //read draft order
    var draftOrder : String[] = propsMap.get("DraftOrder").split(",")

    //create objects for each user in the order of their draft picks
    _userList = new ArrayList<User>()

    for(i in draftOrder) {
      _userList.add(new User(propsMap.get("UserName${i}")))
    }

    UserList.eachWithIndex( \ u, i -> {
      logger.info("Initialized User: ${u.UserName} with ${DraftOrderEnum.values()[i]} draft pick.")
    } )

    logger.info("User initialization complete.")
  }

  public static function init() : PrefReader {
    return new PrefReader()
  }

  public function importRankings() {
    // Initialize Picks, a Map where the user is Key and a Stack of Game UniqueIDs is the Value.
    // The lowest-ranked picks are pushed onto the stack first, meaning the first popped element is the highest choice
    _picks = new HashMap<User, Stack<String>>()

    // Load draft picks for each user into Picks
    UserList.each( \ user -> {
      Picks.put(user, loadDraftPicksForUser(user))
    } )

    //Picks.eachValue( \ value -> print(value.Count))
    //check that all stacks have the same number of elements
    _numGames = validateRankings()

  }

  public function doDraft() : List<String> {
    logger.info("Entering Draft mode, will be distributing ${NumGames} games over ${NumRounds} rounds.")
    //push each ranking to a Stack in descending order (numgames..1)
    // set number of "rounds" equal to numgames
    //following draft-order, pop for that user until an available game is found
      // available will be a property of allGames?
    //do teh draft
    var pickedGames : Set<String> = new HashSet<String>() //TODO convert to ordered list of DraftResult objects
    var results : List<String> = new ArrayList<String>()
    var userPicks : Stack<String>
    var selection : String
    var madeSelection : Boolean

    for(i in 1..NumRounds) {
      UserList.each( \ user -> {
        madeSelection = false
        userPicks = Picks.get(user)

        while(userPicks.HasElements and !madeSelection) {
          selection = userPicks.pop()
          user.incrementDraftCount()
          if(pickedGames.contains(selection)) {
            logger.info("Round ${i}: ${user.UserName} wanted ${selection} (his #${user.DraftCount} choice) but it wasn't available.")
          } else {
           pickedGames.add(selection)
           madeSelection = true
           logger.info("Round ${i}: ${user.UserName} chooses ${selection}, his #${user.DraftCount} choice")
          }
        } //end while
      }) //end turn
    } //end round
    return results
  }

//  static function loadMasterList() {
//    _masterList = new File("../resources/2013.csv")
//    print(MasterList.AbsolutePath)
//    var ml = MasterList.read()
//    //print(ml)
//    _allGames = ImmutableSet.of(new Game(), new Game())
//    var ct = 0
//    MasterList.eachLine( \ line -> {
//      print("line ${ct}: ${line}")
//      if(ct > 0) {
//        _allGames.add(Game.init(line))
//      }
//      ct++
//    })
//  }

  private function loadDraftPicksForUser(user : User) : Stack<String> {
    logger.info("Loading draft picks for ${user.UserName}")
    var myxls = new FileInputStream(user.DataFileName) //"../resources/Ranking Template.xls")
    //any reason for a try/catch ?  We want the program to terminate anyway if there's a FNF, so maybe not
    var wb : HSSFWorkbook = new HSSFWorkbook(myxls)
    var sheet : HSSFSheet = wb.getSheetAt(0)
    var rows : List<HSSFRow> = sheet.rowIterator().toList() as List<HSSFRow>

    //special handling for the header row
    var headerRow : HSSFRow = rows.first()
    var headerCells : List<HSSFCell> = headerRow.cellIterator().toList() as List<HSSFCell>
    var uniqueIDIndex : int
    var rankIndex : int
    //determine which columns hold the "UniqueID" and "Rank" values, which is all we really care about
    headerCells.each( \ cell -> {
      if(cell.isString) {
        if(cell.StringCellValue == "UniqueID") {
          uniqueIDIndex = cell.ColumnIndex
        } else if (cell.StringCellValue == "Rank") {
            rankIndex = cell.ColumnIndex
        }
      }
    } )
    logger.debug("UniqueID is column ${uniqueIDIndex}")
    logger.debug("Rank is column ${rankIndex}")

    var rankings = new HashMap<Integer, String>()
    for(i in 1..|rows.Count) {
      var theRow = rows.get(i)
      //logger.debug(theRow.getCell(rankIndex).NumericCellValue as int)
      //logger.debug(theRow.getCell(uniqueIDIndex).isString)
      rankings.put(theRow.getCell(rankIndex).NumericCellValue as int,
                   theRow.getCell(uniqueIDIndex).StringCellValue)
      //print(rows.get(i).getCell(rankIndex).NumericCellValue as int)
    }

    var keys = rankings.Keys
    if(!isValidChecksum(keys)) {
      throw new Exception("Not a sequential list of values")
    }

    //make a stack based on the reverse-sorted set of keys
    var rankingStack : Stack<String> = new Stack<String>()
    keys.orderDescending().each( \ i -> {
      rankingStack.push(rankings.get(i))
    } )
    //#1 pick should be on top
    logger.info("${user.UserName}'s draft picks are loaded.  ${rankingStack.peek()} is the top pick.")

    return rankingStack
  }

  /**
   * Given a set of keys of size n, verify that it contains a sequential list from 1..n
   * Not really a checksum but I couldn't figure out what else to call it :)
   */
  private function isValidChecksum(keys : Set<Integer>) : boolean {
    var ct = keys.Count
    return keys.sum() == (ct * (ct+1))/2
  }

  /**
   * Check that all Ranking lists have the same number of elements.
   * Set comparisons would've been a better way to do this...
   */
  @Returns("int value of the number of elements in each Stack of Picks")
  private function validateRankings() : int{
    var compareToPreviousUser : User = null
    Picks.eachKeyAndValue( \ user, values -> {
      if(compareToPreviousUser == null) {
        //do nothing
      } else if(values.Count != Picks.get(compareToPreviousUser).Count) {
          throw new Exception("Picks for ${user.UserName}:${values.Count} and ${compareToPreviousUser.UserName}:${Picks.get(compareToPreviousUser).Count} have different counts.")
      }
      compareToPreviousUser = user
    } )
    return Picks.get(compareToPreviousUser).Count
  }

//  private function loadRankings(filename : String) {
//    var myxls = new FileInputStream(filename)
//    var wb : HSSFWorkbook = new HSSFWorkbook(myxls)
//    var sheet : HSSFSheet = wb.getSheetAt(0)
//    var rows : List<HSSFRow> = sheet.rowIterator().toList() as List<HSSFRow>
//    var headerRow : HSSFRow = rows.get(1)//first()
//    var rowCt : int = 1
//    var maxRows : int = sheet.LastRowNum
//    print("sheet.LastRowNum: ${maxRows} - ${headerRow}")
//    var headerCells : List<HSSFCell> = headerRow.cellIterator().toList() as List<HSSFCell>
//    headerCells.each( \ cell -> {
//      switch (cell.CellType) {
//        case HSSFCell.CELL_TYPE_BLANK:
//          print("This shit's blank")
//          break
//        case HSSFCell.CELL_TYPE_BOOLEAN:
//          print("Boolean cell " + cell.BooleanCellValue)
//          break
//        case HSSFCell.CELL_TYPE_FORMULA:
//          print("式")
//          break
//        case HSSFCell.CELL_TYPE_NUMERIC:
//          if(HSSFDateUtil.isCellDateFormatted(cell)) {
//            print("it's a date: " + cell.DateCellValue)
//          } else {
//            print("numeric " + cell.NumericCellValue)
//          }
//          break
//        case HSSFCell.CELL_TYPE_STRING:
//          print("strang " + cell.StringCellValue)
//          break
//        default:
//          print("errorz")
//      }
//    } )
//  }

  private function initProperties() : Map<String, String> {
    return Properties.readFromPropertiesFile(new File("../resources/user.properties"))
  }

  @Returns("Number of rounds for the draft - rounds up to add an additional round if appropriate")
  private property get NumRounds() : int {
    return (NumGames + NumUsers - 1 ) / NumUsers
  }
}