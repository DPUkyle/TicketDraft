package com.kylemoore.TicketDraft

uses java.io.File

/**
 * Created with IntelliJ IDEA.
 * User: kmoore
 * Date: 2013/01/12
 * Time: 23:43
 * To change this template use File | Settings | File Templates.
 */
class User {

  private var _userName : String as readonly UserName

  property get DataFileName() : String {
    return "../resources/2013 Draft Choices - ${UserName}.xls"
  }

  property get DataFile() : File {
    return new File(DataFileName)
  }

  construct(userName: String) {
    _userName = userName
  }

}