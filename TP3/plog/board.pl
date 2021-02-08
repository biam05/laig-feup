/**
 --------------------------------------------------------------------------------
 --------------------        Create the Initial Board        --------------------
 --------------------------------------------------------------------------------
**/

/**
 * Creates a list of Dimensions lists
 *      containing all elements from a line (Dimensions elements).
 * Populates all the lists making this board
 *      a valid representation of the starting board of talpa.
 */
% create_initial_board(+Dimensions, -InitialBoard)
create_initial_board(Dimensions, InitialBoard):-
    Dimensions >= 4,
    Dimensions mod 2 =:= 0,
    length(InitialBoard, Dimensions),
    populate_board(InitialBoard, Dimensions, Dimensions).

/**
 * Populates the board with the lists with the elements from a line
 * Goes through the board, initializing all the lines
 */
% populate_board(-Board, +Lines, +Columns)
populate_board([X, Y | Tail], Lines, Columns) :-
    Lines >= 2,
    populate_even_line(X, Columns),
    populate_odd_line(Y, Columns),
    LinesAux is Lines - 2,
    populate_board(Tail, LinesAux, Columns).

populate_board([], _, _).

/**
 * Populates a even line of our board
 * Goes through the line, instanciating the values with the correct symbols
 */
% populate_even_line(-Line, +Columns)
populate_even_line([X , Y | Line], Columns) :-
    Columns >= 2,
    player_symbol(- 1, X),
    player_symbol(  1, Y),
    ColumnsAux is Columns - 2,
    populate_even_line(Line, ColumnsAux).

populate_even_line([], 0).

/**
 * Populates a odd line of our board
 * Goes through the line, instanciating the values with the correct symbols
 */
% populate_odd_line(-Line, +Columns)
populate_odd_line([X, Y | Line], Columns) :-
    Columns >= 2,
    player_symbol(  1, X),
    player_symbol(- 1, Y),
    ColumnsAux is Columns - 2,
    populate_odd_line(Line, ColumnsAux).

populate_odd_line([], 0).

/**
 * Initial Game State
 * GameState = Dimensions-Board-Player
 */
% initial(-GameState)
initial(Dimensions-InitialBoard-1) :-
    create_initial_board(Dimensions, InitialBoard).
