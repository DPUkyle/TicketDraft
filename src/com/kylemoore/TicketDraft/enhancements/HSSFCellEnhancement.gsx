package com.kylemoore.TicketDraft.enhancements

uses org.apache.poi.hssf.usermodel.HSSFCell
/**
 * Created with IntelliJ IDEA.
 * User: kmoore
 * Date: 2013/01/13
 * Time: 01:46
 * To change this template use File | Settings | File Templates.
 */
enhancement HSSFCellEnhancement : HSSFCell {

  property get isString() : boolean {
    return this.CellType == HSSFCell.CELL_TYPE_STRING ? true : false
  }

//  property get isInt() : boolean {
//    return this.
//    if(HSSFDateUtil.isCellDateFormatted(cell)) {
//      print("it's a date: " + cell.DateCellValue)
//    } else {
//      print("numeric " + cell.NumericCellValue)
//    }
//  }
}
