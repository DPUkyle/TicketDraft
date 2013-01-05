uses junit.framework.TestCase
uses com.kylemoore.TicketDraft.Game
uses org.fest.assertions.Assertions
uses java.util.Date
uses com.kylemoore.TicketDraft.TVStation
uses java.text.SimpleDateFormat

/**
 * Created with IntelliJ IDEA.
 * User: moorek
 * Date: 1/5/13
 * Time: 11:06 PM
 * To change this template use File | Settings | File Templates.
 */
class GameTest extends TestCase {

  final static var dummyString = "20130408,2013-04-08,13:20,MIL,WGN"

  function testGameInit() {
    var testGame = Game.init(dummyString)
    Assertions.assertThat(testGame).isNotNull()
    Assertions.assertThat(testGame.UniqueID).isEqualTo("20130408")
    Assertions.assertThat(testGame.GameTime).isEqualTo(new SimpleDateFormat("yyyy-MM-dd hh:mm a zzz").parse("2013-04-08 1:20 PM CDT"))
    Assertions.assertThat(testGame.Opponent).isEqualTo("MIL")
    Assertions.assertThat(testGame.BroadcastNetwork).isEqualTo(TVStation.WGN)
    Assertions.assertThat(testGame.BroadcastNetwork.ChannelNumber).isEqualTo("9")
  }
}