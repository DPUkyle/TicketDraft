package com.kylemoore.TicketDraft

final enum TVStationEnum {
  CSN(1741),
  CSNPLUS(1742),
  ESPN(1602),
  FOX(1011),
  WCIU(-1),
  WGN(1180)

  private var _channelNumber : int

  private construct(channelNumber : int) {
    _channelNumber = channelNumber
  }

  property get ChannelNumber() : int {
    return _channelNumber
  }

}

