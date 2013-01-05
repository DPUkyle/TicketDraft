package com.kylemoore.TicketDraft

uses java.util.Date
uses apple.awt.ClientPropertyApplicator.Property
uses java.lang.Enum
uses java.util.Calendar
uses java.text.DateFormat
uses javax.swing.text.DateFormatter

class Game {

  private var _uid : String as UniqueID
  private var _gametime : Date as readonly GameTime
  private var _opponent : String as Opponent
  private var _broadcastNetwork : TVStation as BroadcastNetwork

  property set Date(dt : Date) {
    _gametime.setDate(2) //TODO what's this do?
  }

  property set Time(time : Calendar) {
    _gametime.setTime(12345) //TODO what's this do?
  }

  static function init(gamedatastring : String) : Game {
    var gamedata : String[] = gamedatastring.split(",")
    var gm = new Game()
    gm.UniqueID = gamedata[0]
    //gm.Date = DateFormat.(gamedata[1])
    gm.Opponent = gamedata[3]
    gm.BroadcastNetwork = TVStation.valueOf(gamedata[4])
    return gm
  }

}