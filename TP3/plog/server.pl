:-use_module(library(sockets)).
:-use_module(library(lists)).
:-use_module(library(codesio)).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                        Server                                                   %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% To run, enter 'server.' on sicstus command line after consulting this file.
% You can test requests to this server by going to http://localhost:8081/<request>.
% Go to http://localhost:8081/quit to close server.

% Made by Luis Reis (ei12085@fe.up.pt) for LAIG course at FEUP.

port(8081).

% Server Entry Point
server :-
	port(Port),
	write('Opened Server'), nl, nl,
	socket_server_open(Port, Socket),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'), nl.

% Server Loop 
% Uncomment writes for more information on incomming connections
server_loop(Socket) :-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
		% write('Accepted connection'), nl,
	    % Parse Request
		catch((
			read_request(Stream, Request),
			read_header(Stream)
		),_Exception,(
			% write('Error parsing request.'), nl,
			close_stream(Stream),
			fail
		)),
		
		% Generate Response
		handle_request(Request, MyReply, Status),
		format('Request: ~q~n',[Request]),
		format('Reply: ~q~n', [MyReply]),
		
		% Output Response
		format(Stream, 'HTTP/1.0 ~p~n', [Status]),
		format(Stream, 'Access-Control-Allow-Origin: *~n', []),
		format(Stream, 'Content-Type: text/plain~n~n', []),
		format(Stream, '~p', [MyReply]),
	
		% write('Finnished Connection'), nl, nl,
		close_stream(Stream),
	(Request = quit), !.
	
close_stream(Stream) :- flush_output(Stream), close(Stream).

% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
handle_request(Request, MyReply, '200 OK') :- catch(parse_input(Request, MyReply),error(_,_),fail), !.
handle_request(syntax_error, 'Syntax Error', '400 Bad Request') :- !.
handle_request(_, 'Bad Request', '400 Bad Request').

% Reads first Line of HTTP Header and parses request
% Returns term parsed from Request-URI
% Returns syntax_error in case of failure in parsing
read_request(Stream, Request) :-
	read_line(Stream, LineCodes),
	print_header_line(LineCodes),
	
	% Parse Request
	atom_codes('GET /',Get),
	append(Get,RL,LineCodes),
	read_request_aux(RL,RL2),	
	
	catch(read_from_codes(RL2, Request), error(syntax_error(_),_), fail), !.
read_request(_,syntax_error).
	
read_request_aux([32|_],[46]) :- !.
read_request_aux([C|Cs],[C|RCs]) :- read_request_aux(Cs, RCs).


% Reads and Ignores the rest of the lines of the HTTP Header
read_header(Stream) :-
	repeat,
	read_line(Stream, Line),
	print_header_line(Line),
	(Line = []; Line = end_of_file), !.

check_end_of_header([]) :- !, fail.
check_end_of_header(end_of_file) :- !, fail.
check_end_of_header(_).

% Function to Output Request Lines (uncomment the line bellow to see more information on received HTTP Requests)
% print_header_line(LineCodes) :- catch((atom_codes(Line,LineCodes),write(Line),nl),_,fail), !.
print_header_line(_).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Require your Prolog Files here
:- consult('talpa.pl').

% Add Commands
/*
_________________________________________________________________________________________
| Number  |    Command Name    |                  Input                  |    Output    |
|    0    | Start the Game     | Dimensions                              | Board Player |
|    1    | Game Over          | Dimensions Board Player                 | Winner       |
|    2    | Choose AI Move     | Dimensions Board Player Level           | Move         |
|    3    | Choose Player Move | Dimensions Board Player Column Line Dir | Move         |
|    4    | Move a Piece       | Dimensions Board Player Move            | Board Player |
|_________|____________________|_________________________________________|______________|
*/
% parse_input(Input, Output).
% Output:
%		0 - Ok / Valid Move
% 		1 - Error / Invalid Move

parse_input([0, Dimensions], 0-Board-Player) :-
	initial(Dimensions-Board-Player).
parse_input([0 | _], 1).

parse_input([1, Dimensions, JSBoard, Player], 0-Winner) :-
    transform_board(JSBoard, Board),
	game_over(Dimensions-Board-Player, Winner).
parse_input([1 | _], 1).

parse_input([2, Dimensions, JSBoard, Player, Level], 0-Column-Line-Direction) :-
    transform_board(JSBoard, Board),
	Level \= 0, choose_move(Dimensions-Board-Player, _, Level, Column-Line-Direction).
parse_input([2, _, _, _, 0], 1).
parse_input([2 | _], 1).

parse_input([3, Dimensions, JSBoard, Player, Column, Line, Direction], 0-Column-Line-Direction) :-
    transform_board(JSBoard, Board),
	verify_player_move(Dimensions-Board-Player, Column-Line-Direction).
parse_input([3 | _], 1).

parse_input([4, Dimensions, JSBoard, Player, Column, Line, Direction], 0-JSNewBoard-NewPlayer) :-
    transform_board(JSBoard, Board),
	move(Dimensions-Board-Player, Column-Line-Direction, Dimensions-NewBoard-NewPlayer),
    untransform_board(NewBoard, JSNewBoard).
parse_input([4 | _], 1).

parse_input(handshake, hi).
parse_input([quit], goodbye).

/**
 * Verifies if the Move made by the Player is Valid
 * 		- Similar to choose_player_move but obtaining the move
 * 				from the request and not from the console
 */
% verify_player_move(+GameState, +Move)
verify_player_move(GameState, Move) :-
    valid_moves(GameState, _, ValidMoves),
    !,
    member(Move, ValidMoves).

/**
 * Transforms the Received Board into Prolog Board
 */
% transform_board(+Board, -TransformedBoard)
transform_board([Line | Board], [TransformedLine | TransformedBoard]) :-
    transform_line(Line, TransformedLine),
    transform_board(Board, TransformedBoard).
transform_board([], []).

/**
 * Transforms the Received Line into Prolog Line
 */
% transform_line(+Line, -TransformedLine)
transform_line(['E' | Line], [' ' | TransformedLine]) :-
    transform_line(Line, TransformedLine).
transform_line([Element | Line], [Element | TransformedLine]) :-
    Element \= 'E',
    transform_line(Line, TransformedLine).
transform_line([], []).


/**
 * Transforms the Prolog Board into Sending Board
 */
% untransform_board(+TransformedBoard, -Board)
untransform_board([TransformedLine | TransformedBoard], [Line | Board]) :-
    untransform_line(TransformedLine, Line),
    untransform_board(TransformedBoard, Board).
untransform_board([], []).

/**
 * Transforms the Prolog Line into Sending Line
 */
% untransform_line(+TransformedLine, -Line)
untransform_line([' ' | TransformedLine], ['E' | Line]) :-
    untransform_line(TransformedLine, Line).
untransform_line([Element | TransformedLine], [Element | Line]) :-
    Element \= ' ',
    untransform_line(TransformedLine, Line).
untransform_line([], []).
