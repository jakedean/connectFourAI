 'diagTrip' : function (board) {
      for (var row = 5; row > 2; row -= 1) {
        for (var col = 0; col < 7; col += 1) {
          if (board[row][col] && board[row][col] === board[row-1][col-1] && board[row][col] === board[row-2][col-2]) {
            if (board[row+1] && board[row+1][col+1] === 0) {
              if (board[row][col] === 2) {
                return {'winDiagRow' : row+1,
                         'winDiagCol' : col+1
                       };
              } else {
                return {'blockDiagRow' : row+1,
                         'blockDiagCol' : col+1
                       };
              }
            } else if (board[row-3] && board[row-3][col-3] === 0) {
              if (board[row][col] === 2) {
                return {'winDiagRow' : row-3,
                         'winDiagCol' : col-3
                       };
              } else {
                return {'blockDiagRow' : row-3,
                         'blockDiagCol' : col-3
                       };
              }
            }
          } else if (board[row][col] && board[row][col] === board[row-1][col+1] && board[row][col] === board[row-2][col+2]) {
            if (board[row+1] && board[row+1][col-1] === 0) {
              if (board[row][col] === 2) {
                return {'winDiagRow' : row-1,
                         'winDiagCol' : col+1
                       };
              } else {
                return {'blockDiagRow' : row-1,
                         'blockDiagCol' : col+1
                       };
              }
            } else if (board[row-3][col+3] === 0) {
              if (board[row][col] === 2) {
                return {'winDiagRow' : row-3,
                         'winDiagCol' : col+3
                       };
              } else {
                return {'blockDiagRow' : row-3,
                         'blockDiagCol' : col+3
                       };
              }
            }
          }
        }
      }
      return false;
    },