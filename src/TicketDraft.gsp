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

//CommandLineAccess.initialize(PrefReader)
var pr = PrefReader.init()
pr.importRankings()
var results = pr.doDraft()
results.each( \ elt -> print(elt))
//TODO - make a pretty function to print the results to file
