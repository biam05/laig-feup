:- use_module(library(lists)).

/**
 --------------------------------------------------------------------------------
 --------------------                  Input                 --------------------
 --------------------------------------------------------------------------------
**/

/**
 * Obtain an empty input
 */
% obtain_empty_input
obtain_empty_input :-
    get_code(Code),
    skip_rest_of_line(Code).

/**
 * Skips the rest of the line
 */
% skip_rest_of_line(+Code)
skip_rest_of_line(Code) :-
    Code \= 10, % \n
    skip_line.
skip_rest_of_line(10).

/**
 --------------------------------------------------------------------------------
 --------------------              Player Symbol             --------------------
 --------------------------------------------------------------------------------
**/

/**
 * Player Symbol
 * Red  Player (  1) is X
 * Blue Player (- 1) is O
 */
% player_symbol(+Player, -Symbol)
player_symbol(  1, 'X').
player_symbol(- 1, 'O').


/**
 --------------------------------------------------------------------------------
 --------------------                 Replace                --------------------
 --------------------------------------------------------------------------------
**/

/**
 * Replace the Cell Value in Board for Element
 * BoardInfo = Dimensions-Board
 * In the board, Column goes from      1     to Dimensions
 *           and  Line  goes from Dimensions to      1
 */
% replace(+Cell, +Element, +BoardInfo, -NewBoard)
replace(Column-Line, Element, Dimensions-Board, NewBoard) :-
    replace_on_board(Column-Line, Dimensions, Element, Board, NewBoard).

/**
 * Replaces the TargetCell value for Element
 * Helper Function for replace/4
 */
% replace_on_board(+TargetCell, +CurrentLine, +Element, +Board, -NewBoard)
replace_on_board(TargetColumn-TargetLine, CurrentLine, Element, [Line | Board], [Line | NewBoard]) :-
    CurrentLine > TargetLine,
    NextLine is CurrentLine - 1,
    replace_on_board(TargetColumn-TargetLine, NextLine, Element, Board, NewBoard).

replace_on_board(TargetColumn-TargetLine, TargetLine, Element, [Line | Board], [NewLine | Board]) :-
    replace_on_line(TargetColumn, 1, Element, Line, NewLine).

/**
 * Replaces the TargetColumn cell value for Element
 * Helper Function for replace_on_board/5
 */
% replace_on_line(+TargetColumn, +CurrentColumn, +Element, +Line, -NewLine)
replace_on_line(TargetColumn, CurrentColumn, Element, [Cell | Line],  [Cell | NewLine]) :-
    CurrentColumn < TargetColumn,
    NextColumn is CurrentColumn + 1,
    replace_on_line(TargetColumn, NextColumn, Element, Line, NewLine).

replace_on_line(TargetColumn, TargetColumn, Element, [_ | Line], [Element | Line]).

/**
 --------------------------------------------------------------------------------
 --------------------        Position Inside the Board       --------------------
 --------------------------------------------------------------------------------
**/

/**
 * Verifies if the Position is Inside the Board
 */
% inside_board(+Position, +Dimensions)
inside_board(Column-Line, Dimensions) :-
    Column > 0,
    Column =< Dimensions,
    Line > 0,
    Line =< Dimensions.

/**
 --------------------------------------------------------------------------------
 --------------------               Board Cell               --------------------
 --------------------------------------------------------------------------------
**/

/**
 * Obtains the Element in the Cell
 * BoardInfo = Dimensions-Board
 *  Line  goes from Dimensions to      1
 * Column goes from      1     to Dimensions
 */
% board_cell(+Position, +BoardInfo, ?Element)
board_cell(Column-Line, Dimensions-Board, Element) :-
    inside_board(Column-Line, Dimensions),
    !,
    LineNumber is Dimensions - Line + 1,
    nth1(LineNumber, Board, BoardLine),
    nth1(Column, BoardLine, Element).

board_cell(_, _, '-').

/**
 --------------------------------------------------------------------------------
 --------------------            Adjacent Position           --------------------
 --------------------------------------------------------------------------------
**/

/**
 * Calculates the Position of the Adjacent Piece
 * Adjacency:
 *      Up    : u
 *      Down  : d
 *      Left  : l
 *      Right : r
 */
% adjacent_position(+Cell, +Adjacency, -NewCell)
adjacent_position(Column-Line, u, Column-NextLine) :-
    NextLine is Line + 1.

adjacent_position(Column-Line, d, Column-NextLine) :-
    NextLine is Line - 1.

adjacent_position(Column-Line, l, NextColumn-Line) :-
    NextColumn is Column - 1.

adjacent_position(Column-Line, r, NextColumn-Line) :-
    NextColumn is Column + 1.

/**
 --------------------------------------------------------------------------------
 --------------------              Adjacent Cell             --------------------
 --------------------------------------------------------------------------------
**/

/**
 * Obtains the Adjacent Element
 * BoardInfo = Dimensions-Board
 * Element:
 *      ' ' - empty
 *      '-' - outside of board
 */
% adjacent_cell(+Position, +Adjacency, +BoardInfo, -Element)
adjacent_cell(Position, Adjacency, BoardInfo, Element) :-
    adjacent_position(Position, Adjacency, NextPosition),
    board_cell(NextPosition, BoardInfo, Element).

/**
 --------------------------------------------------------------------------------
 --------------------              Player Pieces             --------------------
 --------------------------------------------------------------------------------
**/

/**
 * Obtain All the Pieces' Positions on the Board from the Player
 *  Line  goes from Dimensions to      1
 * Column goes from     1     to Dimensions
 */
% get_pieces_from_player(+GameState, -Pieces)
get_pieces_from_player(Dimensions-Board-Player, Pieces) :-
    player_symbol(Player, PlayerSymbol),
    get_pieces_from_player_on_board(Dimensions, Board, PlayerSymbol, [], Pieces).

/**
 * Obtain the Line for the Piece's Positions
 */
% get_pieces_from_player_on_board(+Line, +Board, +PlayerSymbol, +Pieces, -NewPieces)
get_pieces_from_player_on_board(Line, [BoardLine | Board], PlayerSymbol, Pieces, NewPieces) :-
    get_pieces_from_player_on_line(1-Line, BoardLine, PlayerSymbol, Pieces, AuxPieces),
    NextLine is Line - 1,
    get_pieces_from_player_on_board(NextLine, Board, PlayerSymbol, AuxPieces, NewPieces).

get_pieces_from_player_on_board(0, [], _, Pieces, Pieces).

/**
 * Obtain the Column for the Piece's Positions
 */
% get_pieces_from_player_on_line(+Position, +BoardLine, +PlayerSymbol, +Pieces, -NewPieces)
get_pieces_from_player_on_line(Column-Line, [Element | BoardLine],
                                PlayerSymbol, Pieces, NewPieces) :-
    Element \= PlayerSymbol,
    NextColumn is Column + 1,
    get_pieces_from_player_on_line(NextColumn-Line, BoardLine, PlayerSymbol, Pieces, NewPieces).

get_pieces_from_player_on_line(Column-Line, [PlayerSymbol | BoardLine],
                                PlayerSymbol, Pieces, [Column-Line | NewPieces]) :-
    NextColumn is Column + 1,
    get_pieces_from_player_on_line(NextColumn-Line, BoardLine, PlayerSymbol, Pieces, NewPieces).

get_pieces_from_player_on_line(_, [], _, Pieces, Pieces).
