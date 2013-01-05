package com.kylemoore.TicketDraft.enhancements

uses com.kylemoore.TicketDraft.TVStation
uses java.lang.String

/**
 * Created with IntelliJ IDEA.
 * User: moorek
 * Date: 1/5/13
 * Time: 10:36 PM
 * To change this template use File | Settings | File Templates.
 */
enhancement TVStationEnhancement: com.kylemoore.TicketDraft.TVStation {

  property get ChannelNumber() : String {
    switch(this) {
      case TVStation.CSN:
        return "1740"
      case TVStation.WCIU:
        return "6"
      case TVStation.WGN:
        return "9"
      default:
        return ""
    }
  }

}
