uses junit.framework.TestCase
uses com.kylemoore.TicketDraft.Game
uses org.fest.assertions.Assertions
uses java.util.Date
uses com.kylemoore.TicketDraft.TVStation

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
    //Assertions.assertThat(testGame.GameTime).isEqualTo(new Date("2013-04-08 13:20 CDT"))
    Assertions.assertThat(testGame.Opponent).isEqualTo("MIL")
    Assertions.assertThat(testGame.BroadcastNetwork).isEqualTo(TVStation.WGN)
    Assertions.assertThat(testGame.BroadcastNetwork.ChannelNumber).isEqualTo("9")
  }
}