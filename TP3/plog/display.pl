:- ensure_loaded('utils.pl').

/*
 --------------------------------------------------------------------------------
 --------------------   Helper Functions To Draw the Board   --------------------
 --------------------------------------------------------------------------------
**/

/*
 * Clear the Board
 */
% clr
clr :- write('\33\[2J').

/*
 * Prints N Empty Lines to the Screen
 */
% new_line(+N)
new_line(N) :-
    N > 1,
    nl,
    Next is N - 1,
    new_line(Next).
new_line(1) :- nl.

/*
 * Prints N Spaces to the Screen
 */
% space(+N)
space(N) :-
    N > 1,
    write(' '),
    Next is N - 1,
    space(Next).
space(1) :- write(' ').

/**
 * Prints a Vertical Division
 */
% print_vertical_division
print_vertical_division :-
    space(1),
    write('|'),
    space(1).

/**
 * Prints a Number of Horizontal Divisions
 */
% print_horizontal_division(+N)
print_horizontal_division(N) :-
    N > 0,
    write('----'),
    Next is N - 1,
    print_horizontal_division(Next).
print_horizontal_division(0) :- write('-').

/**
 * Print the Column Marking
 */
% print_column_marking(+Columns, +Letter)
print_column_marking(Columns, Letter) :-
    Columns > 0,
    space(2),
    put_code(Letter),
    space(1),
    ColumnsAux is Columns - 1,
    LetterAux is Letter + 1,
    print_column_marking(ColumnsAux, LetterAux).
print_column_marking(0, _).

/**
 * Print all the Columns Markings
 */
% print_column_markings(+Columns)
print_column_markings(Columns) :-
    print_column_marking(Columns, 65).

/**
 * Print Line Marking
 */
% print_line_marking(+Line)
print_line_marking(Line) :- write(Line).

/*
 --------------------------------------------------------------------------------
 --------------------             Draw the Board             --------------------
 --------------------------------------------------------------------------------
**/
/**
 * Display a Header for our Talpa Game Board
 */
% display_header
display_header :- display_header(8).

% display_header(+Dimensions)

display_header(6) :-
    write('*********************************\n'),
    write('****                         ****\n'),
    write('****          TALPA          ****\n'),
    write('****                         ****\n'),
    write('*********************************\n').

display_header(8) :-
    write('*****************************************\n'),
    write('****                                 ****\n'),
    write('****              TALPA              ****\n'),
    write('****                                 ****\n'),
    write('*****************************************\n').

display_header(10) :-
    write('*************************************************\n'),
    write('****                                         ****\n'),
    write('****                  TALPA                  ****\n'),
    write('****                                         ****\n'),
    write('*************************************************\n').


/**
 * Display the Current Player
 *   1 is Red
 * - 1 is Blue
 */
% display_player(+Player)
display_player(  1) :-
    player_symbol(  1, Symbol),
    space(4),
    write('Red ('),
    write(Symbol),
    write(') on move').
display_player(- 1) :-
    player_symbol(- 1, Symbol),
    space(4),
    write('Blue ('),
    write(Symbol),
    write(') on move').

/**
 * Display the Winner
 *   1 is Red
 * - 1 is Blue
 */
% display_winner(+Winner)
display_winner(  1) :-
    player_symbol(  1, Symbol),
    space(4),
    write('Red ('),
    write(Symbol),
    write(') won!!!!!').
display_winner(- 1) :-
    player_symbol(- 1, Symbol),
    space(4),
    write('Blue ('),
    write(Symbol),
    write(') won!!!!!').

/**
 * Print All the Lines on the Board
 */
% print_board(+Board, +Columns, +LineNumber)
print_board([Line | Board], Columns, LineNumber) :-
    print_board_line(Line, LineNumber),
    new_line(1),
    space(4),
    print_horizontal_division(Columns),
    new_line(1),
    LineNumberAux is LineNumber - 1,
    print_board(Board, Columns, LineNumberAux).
print_board([], _, 0).

/**
 * Print a Line
 */
% print_board_line(+Line, +LineNumber)
print_board_line(Line, LineNumber) :-
    LineNumber < 10,
    space(2),
    print_line_marking(LineNumber),
    print_vertical_division,
    print_board_line_elements(Line),
    print_line_marking(LineNumber).

print_board_line(Line, LineNumber) :-
    LineNumber >= 10,
    space(1),
    print_line_marking(LineNumber),
    print_vertical_division,
    print_board_line_elements(Line),
    print_line_marking(LineNumber).

/**
 * Print All the Pieces on the Line
 */
% print_board_line_elements(+Line)
print_board_line_elements([Element | Line]) :-
    write(Element),
    print_vertical_division,
    print_board_line_elements(Line).
print_board_line_elements([]).

/**
 * Display the Game Board
 */
% display_board(+Board, +Dimensions)
display_board(Board, Dimensions) :-
    space(4),
    print_column_markings(Dimensions),
    new_line(1),

    space(4),
    print_horizontal_division(Dimensions),
    new_line(1),
    
    print_board(Board, Dimensions, Dimensions),

    space(4),
    print_column_markings(Dimensions),
    new_line(1).

/**
 * Display the Game State on Screen
 * GameState       - complex member made of Dimensions, Board and Player ( Dimensions-Board-Player )
 * Dimensions      - dimension of the square board
 * Board           - list of lists that represents the square board of the game
 * Player          - the next player to move
 */
% display_game(+GameState, +Player)
display_game(Dimensions-Board-Player, _) :-
    clr,
    display_header(Dimensions),
    display_player(Player),
    new_line(2),
    display_board(Board, Dimensions),
    new_line(2).

/**
 * Display the Winner and the Game Board on Screen
 * GameState       - complex member made of Dimensions, Board and Player ( Dimensions-Board-Player )
 * Dimensions      - dimension of the square board
 * Board           - list of lists that represents the square board of the game
 * Player          - the next player to move
 * Winner          - the player that won the game
 */
% display_game_winner(+GameState, +Winner)
display_game_winner(Dimensions-Board-_, Winner) :-
    clr,
    display_header(Dimensions),
    display_winner(Winner),
    new_line(2),
    display_board(Board, Dimensions),
    new_line(2).

/**
 * Display Move Instructions
 */
% display_move_instructions
display_move_instructions :-
    write('*              MOVE FORMAT              *\n'),
    write('*****************************************\n'),
    write('*   Column Line Direction (no spaces)   *\n'),
    write('*   Directions:                         *\n'),
    write('*                 r - right             *\n'),
    write('*                 l - left              *\n'),
    write('*                 u - up                *\n'),
    write('*                 d - down              *\n'),
    write('*                 x - extract           *\n'),
    write('*****************************************\n').

/**
 * Display AI Move
 */
% display_ai_move(+Move)
display_ai_move(Column-Line-Direction) :-
    new_line(1),
    write('Move: '),
    ColumnLetter is Column + 64,
    put_code(ColumnLetter),
    write(Line),
    space(1),
    print_direction(Direction),
    new_line(2).

/**
 * Prints the Direction
 */
% print_direction(+Direction)
print_direction(r) :-
    write('right').
print_direction(l) :-
    write('left').
print_direction(u) :-
    write('up').
print_direction(d) :-
    write('down').
print_direction(x) :-
    write('extract').

/*
 --------------------------------------------------------------------------------
 --------------------              Draw the Menu             --------------------
 --------------------------------------------------------------------------------
**/
/**
 * Display a Menu
 */
% display_menu(+Menu)
display_menu(Menu) :-
    clr,
    display_header,
    print_menu(Menu).

/**
 * Print the Selected Menu
 * 0 -       Main Menu
 * 1 -  Human   VS  Human
 * 2 -  Human   VS Computer
 * 3 - Computer VS  Human
 * 4 - Computer VS Computer
 */
% print_menu(+SelectedMenu)
print_menu(0) :-
    write('*               MAIN MENU               *\n'),
    write('*****************************************\n'),
    write('*   [1]  Human   VS  Human              *\n'),
    write('*   [2]  Human   VS Computer            *\n'),
    write('*   [3] Computer VS  Human              *\n'),
    write('*   [4] Computer VS Computer            *\n'),
    write('*****************************************\n').

print_menu(1) :-
    write('*             HUMAN VS HUMAN            *\n'),
    write('*****************************************\n'),
    write('*   [1] Beginners     (6x6 board)       *\n'),
    write('*   [2] Intermediates (8x8 board)       *\n'),
    write('*   [3] Advanced     (10x10 board)      *\n'),
    write('*   [0] Back                            *\n'),
    write('*****************************************\n').

print_menu(2) :-
    write('*           HUMAN VS COMPUTER           *\n'),
    write('*****************************************\n'),
    write('*   [1] Beginners     (6x6 board)       *\n'),
    write('*   [2] Intermediates (8x8 board)       *\n'),
    write('*   [3] Advanced     (10x10 board)      *\n'),
    write('*   [0] Back                            *\n'),
    write('*****************************************\n').

print_menu(3) :-
    write('*           COMPUTER VS HUMAN           *\n'),
    write('*****************************************\n'),
    write('*   [1] Beginners     (6x6 board)       *\n'),
    write('*   [2] Intermediates (8x8 board)       *\n'),
    write('*   [3] Advanced     (10x10 board)      *\n'),
    write('*   [0] Back                            *\n'),
    write('*****************************************\n').

print_menu(4) :-
    write('*          COMPUTER VS COMPUTER         *\n'),
    write('*****************************************\n'),
    write('*   [1] Beginners     (6x6 board)       *\n'),
    write('*   [2] Intermediates (8x8 board)       *\n'),
    write('*   [3] Advanced     (10x10 board)      *\n'),
    write('*   [0] Back                            *\n'),
    write('*****************************************\n').

/**
 * Print Bot Difficulty Menu
 */
% print_bot_difficulty_menu(+BotColor)
print_bot_difficulty_menu(  1) :-
    write('*****************************************\n'),
    write('*           RED BOT DIFFICULTY          *\n'),
    write('*****************************************\n'),
    write('*   [1] AI Random Movement              *\n'),
    write('*   [2] AI Greedy Movement              *\n'),
    write('*   [0] Player                          *\n'),
    write('*****************************************\n').

print_bot_difficulty_menu(- 1) :-
    write('*****************************************\n'),
    write('*          BLUE BOT DIFFICULTY          *\n'),
    write('*****************************************\n'),
    write('*   [1] AI Random Movement              *\n'),
    write('*   [2] AI Greedy Movement              *\n'),
    write('*   [0] Player                          *\n'),
    write('*****************************************\n').

/**
 * Display the Game Start Menu
 * Contains all the Options from the Game
 */
% display_start_game_menu(+Dimensions, +BotDifficulty)
display_start_game_menu(Dimensions, RedBot-BlueBot) :-
    write('*              GAME OPTIONS             *\n'),
    write('*****************************************\n'),
    write('*   - '), print_dimensions(Dimensions), write('                     *\n'),
    write('*   - Red : '), print_bot( RedBot), write('                      *\n'),
    write('*   - Blue: '), print_bot(BlueBot), write('                      *\n'),
    write('*****************************************\n').

/**
 * Print Board Dimensions
 * 7 chars
 */
% print_dimensions(+Dimensions)
print_dimensions(Dimensions) :-
    Dimensions < 10,
    write(Dimensions),
    write(' x '),
    write(Dimensions),
    write(' board'),
    space(2).
print_dimensions(10) :-
    write('10 x 10 board').

/**
 * Print Bot Difficulty
 * 6 chars
 */
% print_bot(+BotDifficulty)
print_bot(0) :-
    write('Player').
print_bot(1) :-
    write('Random').
print_bot(2) :-
    write('Greedy').
