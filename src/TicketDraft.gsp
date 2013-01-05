uses gw.lang.cli.CommandLineAccess
uses com.kylemoore.TicketDraft.PrefReader

/**
 * TicketDraft: Performs an offline draft for season ticket distribution
 * <ul>
 *   <li>Reads a master list of games each with a unique ID</li>
 *   <li>Reads a preference file indicating the aliases of users below and other settings</li>
 *   <li>Reads a list of rankings from each of two users</li>
 *   <li>Perform an ordered draft of the preferences</li>
 * </ul>
 **/

//Read list of games
print("Begin program execution")
CommandLineAccess.initialize(PrefReader)

PrefReader.loadMasterList()
PrefReader.AllGames.eachWithIndex( \ game, index -> {
  print("${index}\tThe Cubs play ${game.Opponent} on ${game.UniqueID}, shown on ${game.BroadcastNetwork}")
})
print("Program complete")