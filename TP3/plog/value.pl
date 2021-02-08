/**
 * Calculates de Value of Board for the player Player. 
 *
 * Game State = Dimensions-Board-PlayerOnMove
 * Player: The Board will be evaluated acording to this player perspective.  
 * Value: An integer representative of the advantage that player Player has over his opponent. 
 *        If Value > 0 then the Player is winning, if Value == 0 then both players are equally developed, if Value < 0 then the Player is losing.
 *        Value takes a huge negative value (~9999999) if the enemy player has connected their sides of the board (meaning Player hsas lost)
 *        Value takes a huge positive value (~9999) if player Player has connected their sides of the board (meaning Player has won).
 *        In the case of both players connecting their respective sides of the board the Value is a negative number (= -9990000), this is because value/3 is 
 *           used to decide the next move of player Player and acording to the rules if a move connects the sides for both players then the one that made the 
 *           move (Player) is declared the loser.
 *
 *
 * Note: GameState is a complex term with Dimensions-Board-PlayerOnMove.
 * This is PlayerOnMove is usually just called Player because on most predicates PlayerOnMove is the one that matters.
 * But value doesn't care about which player is on the move it only evaluates the Board for the given player.
 */
% value(+GameState, +Player, -Value)
value(Dimensions-Board-_, Player, Value):-
    calculate_board_value(Dimensions-Board-Player, 1, Dimensions, [], 0, PositiveCalculatedValue),
    get_representative_value(Dimensions, Player, Player, PositiveCalculatedValue, PositiveValue),
    NextPlayer is -Player,
    calculate_board_value(Dimensions-Board-NextPlayer, 1, Dimensions, [], 0, NegativeCalculatedValue),
    get_representative_value(Dimensions, Player, NextPlayer, NegativeCalculatedValue, NegativeValue),
    Value is PositiveValue - NegativeValue.

/**
 * Ensures that the Value returned by value/3 is representative of a losing situation for the player being evaluated. 
 *
 * Dimensions: is the Board dimensions.
 * CalculatedValue: Value returned by the predicate calculate_board_value.
 * RepresentativeValue: is either 99999 in the case of the CalculatedValue being equal to Dimensions (the player has connected the sides of the Board);
 *       or is CalculatedValue.
 */
% get_representative_value(+Dimensions, +EvaluatedPlayer, +Player, +CalculatedValue, -RepresentativeValue)
get_representative_value(Dimensions, Player, Player, Dimensions, 9999).
get_representative_value(Dimensions, _, _, Dimensions, 9999999).
get_representative_value(_, _, _, CalculatedValue, CalculatedValue).

/**
 * The main predicate of value/3. This Predicate goes through the board looking for white cell clusters. 
 * Once it has found one it hasn't processed before, it calulates the value of that cluster.
 * Once it has reached the end of the board, it returns the Maximum Cluster Value it found as the Value of the Board.
 *
 * Game State = Dimensions-Board-Player
 * Column goes from      1     to Dimensions
 *  Line  goes from Dimensions to      1
 * ListOfCheckedEmptySpaces: is a list of cells (Column-Line) of already processed empty spaces.
 * MaxValue: current max cluster value
 * Final Value: value to be returned
 *
 *
 * In here, the Player in GameState is the player for which 
 *      the Board is being evaluated not necessarily the player on move.
 */

% calculate_board_value(+GameState, +Column, +Line, ListOfCheckedEmptySpaces, MaxValue, -FinalValue)
/* end of board */
calculate_board_value(_-_-_, -1, -1, _, Value, Value).
/* not an empty space */
calculate_board_value(Dimensions-Board-Player, Column, Line, ListOfCheckedEmptySpaces, MaxValue, FinalValue):-
    board_cell(Column-Line, Dimensions-Board, Element),
    Element \= ' ',
    increase_column_and_line(Dimensions, Column, Line, NewColumn, NewLine),
    calculate_board_value(Dimensions-Board-Player, NewColumn, NewLine, ListOfCheckedEmptySpaces, MaxValue, FinalValue).
/* already processed empty space */
calculate_board_value(Dimensions-Board-Player, Column, Line, ListOfCheckedEmptySpaces, MaxValue, FinalValue):-
    board_cell(Column-Line, Dimensions-Board, ' '),
    member(Column-Line, ListOfCheckedEmptySpaces),
    increase_column_and_line(Dimensions, Column, Line, NewColumn, NewLine),
    calculate_board_value(Dimensions-Board-Player, NewColumn, NewLine, ListOfCheckedEmptySpaces, MaxValue, FinalValue).
/* new cluster of empty spaces found */
calculate_board_value(Dimensions-Board-Player, Column, Line, ListOfCheckedEmptySpaces, MaxValue, FinalValue):-
    board_cell(Column-Line, Dimensions-Board, ' '),
    \+member(Column-Line, ListOfCheckedEmptySpaces),
    explore_empty_cell_cluster(Dimensions-Board-Player, [Column-Line], [], ClusterCells),
    calculate_cluster_value(Player, ClusterCells, [], PossibleMaxValue),
    NewMaxValue is max(PossibleMaxValue, MaxValue),
    append(ClusterCells, ListOfCheckedEmptySpaces, NewListOfCheckedEmptySpaces),
    increase_column_and_line(Dimensions, Column, Line, NewColumn, NewLine),
    calculate_board_value(Dimensions-Board-Player, NewColumn, NewLine, NewListOfCheckedEmptySpaces, NewMaxValue, FinalValue).


/**
 * This predicate explores an empty cell cluster.
 * It finds all the adjacent empty cells to the starting one
 *      and keeps exploring each new empty cell to find the ones adjacent to that one.
 *
 * Game State = Dimensions-Board-Player
 * CellsToExplore: is a list of empty cells (Column-Line) not already processed.
 * ListOfCheckedEmptySpacesSoFar: is a list of empty cells (Column-Line) already processed, used to avoid loops
 * ClusterCells: list of all empty cells (Column-Line) in the cluster
 *
 *
 * In here, the Player in GameState is the player for which 
 *      the Board is being evaluated not necessarily the player on move.
 */
% explore_empty_cell_cluster(+GameState, CellsToExplore, ListOfCheckedEmptySpacesSoFar, -ClusterCells)
/* no more empty cells to process */
explore_empty_cell_cluster(_, [], ClusterCells, ClusterCells).
/* already processed empty cell, skip */
explore_empty_cell_cluster(GameState, [Cell | CellsToExploreTail], ListOfCheckedEmptySpacesSoFar, ClusterCells):-
    member(Cell, ListOfCheckedEmptySpacesSoFar),
    explore_empty_cell_cluster(GameState, CellsToExploreTail, ListOfCheckedEmptySpacesSoFar, ClusterCells).
/* get all adjacent cells to Head cell */
explore_empty_cell_cluster(GameState, [Cell | CellsToExploreTail], ListOfCheckedEmptySpacesSoFar, ClusterCells):-
    \+member(Cell, ListOfCheckedEmptySpacesSoFar),
    findall(X-Y, adjacent_empty_cell(GameState, Cell, X-Y), MoreEmptyCells),
    append(CellsToExploreTail, MoreEmptyCells, CellsToExplore),
    explore_empty_cell_cluster(GameState, CellsToExplore, [Cell | ListOfCheckedEmptySpacesSoFar], ClusterCells).




/**
 * This predicate is responsible for calculating the cluster value.
 * In order to do that it projects the cluster on to the column-axis for the blue player (- 1) or on to the line-axis for the red player (1).
 * The value of the cluster will be the range of that projection.
 * 
 * Player - Perspective of wich the Board is being valued 
 * ClusterCells - List containing the empty cells (Column-Line) of the cluster. 
 * ListofDiferentRelevantCoordinates : The Projection of the cluster; it takes the from of a list of cell cordinates: for the red (1) player its a list
 *       of Line(s) and for the blue (- 1) player its a list of Column(s).   
 * Value - value of the cluster
 */

% calculate_cluster_value(+Player, +ClusterCells, ListofDiferentRelevantCoordinates, -Value)
/* finished processing the cluster cells */
calculate_cluster_value(_, [], ListofDiferentRelevantCoordinates, Value):-
    length(ListofDiferentRelevantCoordinates, Value).
/* projection of the cluster on to Lines, used for the red (1) player */
calculate_cluster_value(1, [_-Line | ClusterCellsTail], ListofDiferentRelevantCoordinates, Value):-
    member(Line, ListofDiferentRelevantCoordinates),
    calculate_cluster_value(1, ClusterCellsTail, ListofDiferentRelevantCoordinates, Value).
calculate_cluster_value(1, [_-Line | ClusterCellsTail], ListofDiferentRelevantCoordinates, Value):-
    \+member(Line, ListofDiferentRelevantCoordinates),
    calculate_cluster_value(1, ClusterCellsTail, [Line | ListofDiferentRelevantCoordinates], Value).
/* projection of the cluster on to Columnss, used for the blue (- 1) player */
calculate_cluster_value(-1, [Column-_ | ClusterCellsTail], ListofDiferentRelevantCoordinates, Value):-
    member(Column, ListofDiferentRelevantCoordinates),
    calculate_cluster_value(-1, ClusterCellsTail, ListofDiferentRelevantCoordinates, Value).
calculate_cluster_value(-1, [Column-_ | ClusterCellsTail], ListofDiferentRelevantCoordinates, Value):-
    \+member(Column, ListofDiferentRelevantCoordinates),
    calculate_cluster_value(-1, ClusterCellsTail, [Column | ListofDiferentRelevantCoordinates], Value).

/**
 * Auxiliar Predicate
 * Used to calculate the next cell on the board after receiving the current Column and Line.
 * If Board as ended it returns -1, -1.
 *
 * Dimensions = Board dimensions
 *  Line  goes from Dimensions to      1
 * Column goes from      1     to Dimensions
 *  NewLine  goes from Dimensions to      1      or -1
 * NewColumn goes from      1     to Dimensions  or -1
 *
 * cell NewColumn-NewLine is next to cell Column-Line on the board
 */
% increase_column_and_line(+Dimensions, +Column, +Line, -NewColumn, -NewLine)
increase_column_and_line(Dimensions, Dimensions, 1, -1, -1).
increase_column_and_line(Dimensions, Column, Line, 1, NewLine):-
    Dimensions < Column + 1,
    0 < Line - 1,
    NewLine is Line - 1.   
increase_column_and_line(Dimensions, Column, Line, NewColumn, Line):-
    Dimensions >= Column + 1,
    NewColumn is Column + 1.


/**
 * This predicate was designed to be called on a findall.
 * By doing this we can get all the adjacent empty cells to an initial cell.
 * 
 * Game State = Dimensions-Board-Player
 * InitialCell  : complex term Column-Line that gives the location of the cell being processed
 * AdjacentCell : complex term Column-Line that gives the location of the adjacent cell
 */

% adjacent_empty_cell(+GameState, +InitialCell, -AdjacentCell)
adjacent_empty_cell(Dimensions-Board-_, X-Y, X-DownY):-
    X >= 1, X =< Dimensions,
    Y >= 1, Y =< Dimensions,
    DownY is Y + 1,
    DownY =< Dimensions,
    board_cell(X-DownY, Dimensions-Board, ' ').

adjacent_empty_cell(Dimensions-Board-_, X-Y, RightX-Y):-
    X >= 1, X =< Dimensions,
    Y >= 1, Y =< Dimensions,
    RightX is X + 1,
    RightX =< Dimensions,
    board_cell(RightX-Y, Dimensions-Board, ' ').

adjacent_empty_cell(Dimensions-Board-_, X-Y, X-UpY):-
    X >= 1, X =< Dimensions,
    Y >= 1, Y =< Dimensions,
    UpY is Y - 1,
    UpY >= 1,
    board_cell(X-UpY, Dimensions-Board, ' ').

adjacent_empty_cell(Dimensions-Board-_, X-Y, LeftX-Y):-
    X >= 1, X =< Dimensions,
    Y >= 1, Y =< Dimensions,
    LeftX is X - 1,
    LeftX >= 1,
    board_cell(LeftX-Y, Dimensions-Board, ' ').
