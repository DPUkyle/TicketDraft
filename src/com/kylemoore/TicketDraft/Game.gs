package com.kylemoore.TicketDraft

uses java.util.Date
uses apple.awt.ClientPropertyApplicator.Property
uses java.lang.Enum
uses java.util.Calendar
uses java.text.SimpleDateFormat
uses javax.swing.text.DateFormatter
uses java.util.TimeZone
uses javax.print.attribute.standard.DateTimeAtCompleted

class Game {

  private var _uid : String as UniqueID
  private var _gametime : Date as readonly GameTime
  private var _opponent : String as Opponent
  private var _broadcastNetwork : TVStation as BroadcastNetwork

  public static final var DateFormat : SimpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm zzz")

  static function init(gamedatastring : String) : Game {
    var gamedata : String[] = gamedatastring.split(",")
    var gm = new Game()
    gm.UniqueID = gamedata[0]
    gm.setGameTime(gamedata[1], gamedata[2])
    gm.Opponent = gamedata[3]
    gm.BroadcastNetwork = TVStation.valueOf(gamedata[4])
    return gm
  }

  //---------------------- private methods -------------------------//

  private function setGameTime(date : String, time : String) {
    var datetime = "${date} ${time} CDT"
    _gametime = DateFormat.parse(datetime)
  }

}