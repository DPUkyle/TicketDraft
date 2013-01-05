package com.kylemoore.TicketDraft

uses gw.lang.cli.Required
uses java.io.File
uses java.util.Set
uses java.util.HashSet

/**
 * Arguments for TicketReader
 */
class PrefReader {

  static var _masterList : File as readonly MasterList

  static var _allGames : Set<Game> as readonly AllGames

  static function loadMasterList() {
    _masterList = new File("resources/2013.csv")
    print(MasterList.AbsolutePath)
    var ml = MasterList.read()
    //print(ml)
    _allGames = new HashSet<Game>()
    var ct = 0
    MasterList.eachLine( \ line -> {
      print("line ${ct}: ${line}")
      if(ct > 0) {
        _allGames.add(Game.init(line))
      }
      ct++
    })
  }

}