//classpath "../resources"

uses gw.lang.cli.CommandLineAccess
uses com.kylemoore.TicketDraft.PrefReader
uses com.kylemoore.TicketDraft.Game
uses java.util.HashSet
uses java.util.Set
uses org.apache.logging.log4j.LogManager
uses org.apache.logging.log4j.Logger
uses sun.rmi.runtime.Log

/**
 * TicketDraft: Performs an offline draft for season ticket distribution
 * <ul>
 *   <li>Reads a master list of games each with a unique ID</li>
 *   <li>Reads a preference file indicating the aliases of users below and other settings</li>
 *   <li>Reads a list of rankings from each of 2..n users</li>
 *   <li>Perform an ordered draft of the preferences</li>
 * </ul>
 **/

//Read list of games
//print("Begin program execution")
//CommandLineAccess.initialize(PrefReader)
var pr = PrefReader.init()
//PrefReader.loadMasterList()
//PrefReader.AllGames.eachWithIndex( \ game, index -> {
//  print("${index}\tThe Cubs play ${game.Opponent} on ${Game.DateFormat.format(game.GameTime)}, shown on ${game.BroadcastNetwork} (channel ${game.BroadcastNetwork.ChannelNumber})")
//})

pr.loadRankings("../resources/Ranking Template.xls") // TODO refactor to return hashset or ordered list? Stack?
var allGames : Set<Game> = new HashSet<Game>() //TODO initialize hashset of uniqueIDs
//PrefReader.loadRankings("../resources/User Number Two.xls")
// verify subsequent users sets of IDs  match the hashset of UniqueIDs
//print("Program complete")