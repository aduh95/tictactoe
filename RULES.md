# Tic-tac-toe-ception Rules

It's a tic-tac-toe game, except each case is a tic-tac-toe game.

#### Game grid

The game grid is composed of a 3×3 grid of 9 3×3 sub-grids, each containing a
game of the classic tic-tac-toe.

#### Game Play

In order to win the game, a player must win three tic-tac-toe grids in a
horizontal, vertical, or diagonal row.

The player playing ❌ team starts the game by placing their mark on a grid cell.
Then the player playing ⭕︎ team takes the turn.

When a player places their mark, it dictates in which sub-grid the next move
must take place. E.G.: If the previous player places its mark in the top-right
cell of any sub-grid, the next move must be placed on the top-right sub-grid.

When a cell is marked, it is forbidden to mark it again, unless the sub-grid is
already full and the player must place a move.

#### End of the game

The game stops either:

- When a player wins. The player who has won three tic-tac-toe games in a
  horizontal, vertical, or diagonal row is the winner.
- When all the cases have been marked by either of the players. It is a draw.
