package com.kylemoore.TicketDraft

uses com.google.common.collect.ImmutableSet
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

/**
 * Arguments for TicketReader
 */
class PrefReader {

  static var _masterList : File as readonly MasterList

  static var _allGames : ImmutableSet<Game> as readonly AllGames

  static var logger : Logger = LogManager.getLogger("") // root logger

  private var _numUsers : int as readonly NumUsers
  private var _userList : List<User> as readonly UserList //Order matters!

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
    // read file for first pick

    // validate its rankings match the number of rows using n!, then set numgames property below
    // initialize allgames based on this file, producing numgames property (allgames.Count)

    // read file for subsequent picks
    // validate against numgames property and this check: n(n+1) / 2; i.e. sum of ranks on 81 rows should equal 81(82) / 2
    // validate set of games matches allgames
  }

  public function doDraft() {
    //push each ranking to a Stack in descending order (numgames..1)
    // set number of "rounds" equal to numgames
    //following draft-order, pop for that user until an available game is found
      // available will be a property of allGames?
    //do teh draft
  }

  static function loadMasterList() {
    _masterList = new File("../resources/2013.csv")
    print(MasterList.AbsolutePath)
    var ml = MasterList.read()
    //print(ml)
    _allGames = ImmutableSet.of(new Game(), new Game())
    var ct = 0
    MasterList.eachLine( \ line -> {
      print("line ${ct}: ${line}")
      if(ct > 0) {
        _allGames.add(Game.init(line))
      }
      ct++
    })
  }

  /*static*/ function loadRankings(filename : String) {
    var myxls = new FileInputStream(filename)
    var wb : HSSFWorkbook = new HSSFWorkbook(myxls) //WorkbookFactory.create(new File(filename))
    var sheet : HSSFSheet = wb.getSheetAt(0)
    var rows : List<HSSFRow> = sheet.rowIterator().toList() as List<HSSFRow>
    var headerRow : HSSFRow = rows.get(1)//first()
    var rowCt : int = 1
    var maxRows : int = sheet.LastRowNum
    print("sheet.LastRowNum: ${maxRows} - ${headerRow}")
    var headerCells : List<HSSFCell> = headerRow.cellIterator().toList() as List<HSSFCell>
    headerCells.each( \ cell -> {
      switch (cell.CellType) {
        case HSSFCell.CELL_TYPE_BLANK:
          print("This shit's blank")
          break
        case HSSFCell.CELL_TYPE_BOOLEAN:
          print("Boolean cell " + cell.BooleanCellValue)
          break
        case HSSFCell.CELL_TYPE_FORMULA:
          print("式")
          break
        case HSSFCell.CELL_TYPE_NUMERIC:
          if(HSSFDateUtil.isCellDateFormatted(cell)) {
            print("it's a date: " + cell.DateCellValue)
          } else {
            print("numeric " + cell.NumericCellValue)
          }
          break
        case HSSFCell.CELL_TYPE_STRING:
          print("strang " + cell.StringCellValue)
          break
        default:
          print("errorz")
      }
      //print("${cell.ColumnIndex}:${cell.CellType}")
    } )
/*
    while(rows.hasNext()) {
      var row : HSSFRow = rows.next()
      if(rowCt == 0) {
        headerRow = row as HSSFRow
      }
      var cells = row.cellIterator()
      while(cells.hasNext()) {
        var cell = cells.next()
        print("${cell.ColumnIndex}:${cell.CellType}")
      }
      print("") //end of line
      rowCt++
    }
*/

  }

  private function initProperties() : Map<String, String> {
    return Properties.readFromPropertiesFile(new File("../resources/user.properties"))
  }

}