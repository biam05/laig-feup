:- ensure_loaded('board.pl').
:- ensure_loaded('display.pl').
:- ensure_loaded('path_finder.pl').
:- ensure_loaded('moves.pl').

/**
 --------------------------------------------------------------------------------
 --------------------               TALPA Game               --------------------
 --------------------------------------------------------------------------------
**/

/**
 * Talpa Game
 * Dimensions = Size of the Board
 * Players    = RedBot-BlueBot
 * RedBot     = Red  Player Difficulty
 * BlueBot    = Blue Player Difficulty
 * Bots Difficulty:
 *      0 - Player
 *      1 - Random
 *      2 - Greedy
 * 
 * Game State = Dimensions-Board-Player
 * BoardInfo  = Dimensions-Board
 */
% talpa(+Dimensions, +Players)
talpa(Dimensions, Players) :-
    initial(Dimensions-Board-Player),
    game(Dimensions-Board-Player, Players).

/**
 * Game Loop
 * Keeps Playing the Game until Game Over
 */
game(GameState, _) :-
    game_over(GameState, Winner),
    Winner \= 0,
    display_game_winner(GameState, Winner).

game(GameState, Players) :-
    display_game(GameState, _),
    choose_player_level(GameState, Players, Level),
    choose_move(GameState, _, Level, Move),
    move(GameState, Move, NewGameState),
    game(NewGameState, Players).

/**
 * Choose Player Level / Difficulty
 */
% choose_player_level(+GameState, +Players, -Level)
choose_player_level(_-_-( 1),  RedBot-_,  RedBot).
choose_player_level(_-_-(-1), _-BlueBot, BlueBot).

/**
 --------------------------------------------------------------------------------
 --------------------                Game Over               --------------------
 --------------------------------------------------------------------------------
**/

/**
 * Decides the Winner of the Game based on the Current GameState
 * GameState = Dimensions-Board-Player
 * 
 * Winner:
 *        0 -> not gameover yet
 *        1 -> red  player wins
 *      - 1 -> blue player wins
 */
% game_over(+GameState, -Winner)
game_over(Dimensions-Board-PlayerOnMove, Winner) :-
    find_path_blue_blue(Dimensions-Board, BluePath),
    find_path_red_red(Dimensions-Board, RedPath),
    find_winner(BluePath-RedPath, PlayerOnMove, Winner).

/**
 * Choose the Winner based on the Existing Path Between the Edges
 */
% find_winner(+Paths, +PlayerOnMove, -Winner)
find_winner(0-0, _,  0).
find_winner(1-0, _, -1).
find_winner(0-1, _,  1).
find_winner(1-1, Winner, Winner).
