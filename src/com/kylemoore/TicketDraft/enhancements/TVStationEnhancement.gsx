package com.kylemoore.TicketDraft.enhancements

uses com.kylemoore.TicketDraft.TVStationEnum
uses java.lang.String

enhancement TVStationEnhancement: com.kylemoore.TicketDraft.TVStationEnum {

  property get ChannelNumber() : String {
    switch(this) {
      case TVStationEnum.CSN:
        return "1740"
      case TVStationEnum.WCIU:
        return "6"
      case TVStationEnum.WGN:
        return "9"
      default:
        return ""
    }
  }

}
