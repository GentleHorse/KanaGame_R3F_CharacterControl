# Kana Game with React Three Fiber & React Three Rapier

## Trouble shoot
### "Rendered more hooks than during the previous render"
**Error** <br> 
It happened in the `Kicker` component when tried to call the `if` statement before `useFrame` function. <br><br>

**What causd this kind of error**
- `if` statements called before a hook
- A hook is invoked inside the body of an `if`, `else`, `for` or `while` statement
