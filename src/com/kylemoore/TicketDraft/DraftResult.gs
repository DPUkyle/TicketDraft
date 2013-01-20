package com.kylemoore.TicketDraft

class DraftResult {

  private var _game : Game
  private var _user : User
  private var _round : int
  private var _picknum : int
  private var _failedpick : boolean as readonly FailedPick

  /**
   * Shortened constructor for successful pick cases
  */
  construct (game : Game, user : User, round : int, picknum : int) {
    this(game, user, round, picknum, false)
  }

  /**
   * Full constructor, can be used when the pick is successful or unsuccessful by setting 'failedpick'
  */
  construct (game : Game, user : User, round : int, picknum : int, failedpick : boolean) {
    _game = game
    _user = user
    _round = round
    _picknum = picknum
    _failedpick = failedpick
  }

}