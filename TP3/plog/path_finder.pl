
/**
 --------------------------------------------------------------------------------
 --------------------               Path Finder              --------------------
 --------------------------------------------------------------------------------
**/

/**
 * Creates a Visited Board
 *          0 - not visited
 *          1 - visited
 */
% create_visited(+Dimensions, -Visited)
create_visited(Dimensions, Visited) :-
    create_visited_line(Dimensions, BoardLine),
    create_visited_board(Dimensions, BoardLine, Visited).

/**
 * Creates a Visited Board Based on a Board Line
 */
% create_visited_board(+Line, +BoardLine, -Visited)
create_visited_board(Line, BoardLine, [BoardLine | Visited]) :-
    Line > 0,
    NextLine is Line - 1,
    create_visited_board(NextLine, BoardLine, Visited).

create_visited_board(0, _, []).

/**
 * Creates a Visited Line
 */
% create_visited_line(+Column, -VisitedLine)
create_visited_line(Column, [0 | Line]) :-
    Column > 0,
    NextColumn is Column - 1,
    create_visited_line(NextColumn, Line).

create_visited_line(0, []).

/**
 * Checks if a Path exists between the Red Edges (up and down)
 * BoardInfo = Dimensions-Board
 * Return Values:
 *          0 - no path
 *          1 - path
 */
% find_path_red_red(+BoardInfo, -Path)
find_path_red_red(Dimensions-Board, 1) :-
    create_visited(Dimensions, Visited),
    find_red_path(1, Dimensions, Board, Visited).

find_path_red_red(_, 0).

/**
 * Finds a Path between Red Edges
 */
% find_red_path(+Column, +Dimensions, +Board, +Visited)
find_red_path(Column, Dimensions, Board, Visited) :-
    Column =< Dimensions,
    find_path_up_down(Column-Dimensions, Dimensions, Board, Visited).

find_red_path(Column, Dimensions, Board, Visited) :-
    Column =< Dimensions,
    NextColumn is Column + 1,
    find_red_path(NextColumn, Dimensions, Board, Visited).

/**
 * Tries to Find a Path between the Edges UP and DOWN
 */
% find_path_up_down(+Cell, +Dimensions, +Board, +Visited)
find_path_up_down(Cell, Dimensions, Board, Visited) :-
    board_cell(Cell, Dimensions-Board, ' '),
    board_cell(Cell, Dimensions-Visited, 0),
    replace(Cell, 1, Dimensions-Visited, NextVisited),
    find_path_up_down_adjacent(Cell, Dimensions, Board, NextVisited).

find_path_up_down(_-0, _, _, _).

/**
 * Tries to find a UP-DOWN Path through All the Adjacent Positions
 */
% find_path_up_down_adjacent(+Cell, +Dimensions, +Board, +Visited)
find_path_up_down_adjacent(Cell, Dimensions, Board, Visited) :-
    adjacent_position(Cell, r, NextCell),
    find_path_up_down(NextCell, Dimensions, Board, Visited).

find_path_up_down_adjacent(Cell, Dimensions, Board, Visited) :-
    adjacent_position(Cell, l, NextCell),
    find_path_up_down(NextCell, Dimensions, Board, Visited).

find_path_up_down_adjacent(Cell, Dimensions, Board, Visited) :-
    adjacent_position(Cell, u, NextCell),
    find_path_up_down(NextCell, Dimensions, Board, Visited).

find_path_up_down_adjacent(Cell, Dimensions, Board, Visited) :-
    adjacent_position(Cell, d, NextCell),
    find_path_up_down(NextCell, Dimensions, Board, Visited).

/**
 * Checks if a Path exists between the Blue Edges (left and right)
 * BoardInfo = Dimensions-Board
 * Return Values:
 *          0 - no path
 *          1 - path
 */
% find_path_blue_blue(+BoardInfo, -Path)
find_path_blue_blue(Dimensions-Board, 1) :-
    create_visited(Dimensions, Visited),
    find_blue_path(1, Dimensions, Board, Visited).

find_path_blue_blue(_, 0).

/**
 * Finds a Path between Blue Edges
 */
% find_blue_path(+BoardInfo)
find_blue_path(Line, Dimensions, Board, Visited) :-
    Line =< Dimensions,
    find_path_left_right(1-Line, Dimensions, Board, Visited).

find_blue_path(Line, Dimensions, Board, Visited) :-
    Line =< Dimensions,
    NextLine is Line + 1,
    find_blue_path(NextLine, Dimensions, Board, Visited).


/**
 * Tries to Find a Path between the Edges LEFT and RIGHT
 */
% find_path_left_right(+Cell, +Dimensions, +Board, +Visited)
find_path_left_right(Cell, Dimensions, Board, Visited) :-
    board_cell(Cell, Dimensions-Board, ' '),
    board_cell(Cell, Dimensions-Visited, 0),
    replace(Cell, 1, Dimensions-Visited, NextVisited),
    find_path_left_right_adjacent(Cell, Dimensions, Board, NextVisited).

find_path_left_right(OutOfDimensions-_, Dimensions, _, _) :-
    OutOfDimensions is Dimensions + 1.

/**
 * Tries to find a LEFT-RIGHT Path through All the Adjacent Positions
 */
% find_path_left_right_adjacent(+Cell, +Dimensions, +Board, +Visited)
find_path_left_right_adjacent(Cell, Dimensions, Board, Visited) :-
    adjacent_position(Cell, r, NextCell),
    find_path_left_right(NextCell, Dimensions, Board, Visited).

find_path_left_right_adjacent(Cell, Dimensions, Board, Visited) :-
    adjacent_position(Cell, l, NextCell),
    find_path_left_right(NextCell, Dimensions, Board, Visited).

find_path_left_right_adjacent(Cell, Dimensions, Board, Visited) :-
    adjacent_position(Cell, u, NextCell),
    find_path_left_right(NextCell, Dimensions, Board, Visited).

find_path_left_right_adjacent(Cell, Dimensions, Board, Visited) :-
    adjacent_position(Cell, d, NextCell),
    find_path_left_right(NextCell, Dimensions, Board, Visited).
