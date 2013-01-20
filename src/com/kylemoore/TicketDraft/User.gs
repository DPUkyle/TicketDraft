package com.kylemoore.TicketDraft

uses java.io.File

class User {

  private var _userName : String as readonly UserName
  private var _draftCount : int as readonly DraftCount

  property get DataFileName() : String {
    return "../resources/2013 Draft Choices - ${UserName}.xls"
  }

  property get DataFile() : File {
    return new File(DataFileName)
  }

  construct(userName: String) {
    _userName = userName
    _draftCount = 0
  }

  function incrementDraftCount() {
    _draftCount++
  }

}