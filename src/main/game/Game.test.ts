
import {canMakeNewMove, hasReached2048, passDirectionCheck, isGameOver, isMoved, getBlankCordinates} from "./Game"

describe("Game logic is right", () => {
    it ("canMakeNewMove", () => {
        expect(canMakeNewMove([[2,8,4,8],[16,4,8,4],[32,8,4,2],[2,32,3,2]])).toBe(true)
        expect(canMakeNewMove([[2,8,4,8],[16,4,8,4],[32,8,4,2],[2,32,3,4]])).toBe(false)
    })
    it ("hasReached2048", () => {
        expect(hasReached2048([[2,8,1024,8],[16,256,8,4],[32,8,4,2],[2,32,3,2]])).toBe(false)
        expect(hasReached2048([[0,0,0,0],[0,2,0,0],[0,2,0,0],[0,0,0,0]])).toBe(false)
        expect(hasReached2048([[2048,2,4,8],[16,256,8,4],[32,8,4,2],[2,32,3,2]])).toBe(false)
        expect(hasReached2048([[4096, 0, 2, 2],[16,256,8,4],[32,8,4,2],[2,32,3,2]])).toBe(false)
    })
    it ("passDirectionCheck", () => {
        expect(passDirectionCheck(undefined)).toBe(false)
        expect(passDirectionCheck("left")).toBe(true)
        expect(passDirectionCheck("right")).toBe(true)
        expect(passDirectionCheck("up")).toBe(true)
        expect(passDirectionCheck("down")).toBe(true)
        expect(passDirectionCheck("LEFT")).toBe(false)
        expect(passDirectionCheck("RIGHT")).toBe(false)
        expect(passDirectionCheck("UP")).toBe(false)
        expect(passDirectionCheck("123")).toBe(false)
    })
    it ("isGameOver", () => {
        expect(isGameOver([[0,0,2,2],[0,0,0,0],[0,0,0,0],[0,0,0,0]])).toBe(false)
        expect(isGameOver([[2,8,4,8],[16,4,8,4],[32,8,4,2],[2,32,8,2]])).toBe(false)
        expect(isGameOver([[2,8,4,8],[16,4,8,4],[32,8,4,2],[2,32,8,4]])).toBe(true)
        expect(isGameOver([[2,32,2,4],[16,4,8,4],[32,8,4,2],[2,32,8,4]])).toBe(false)
    })
    it ("isMoved", () => {
        const board1= [[2,8,4,8],[16,4,8,4],[32,8,4,2],[2,32,3,2]]
        const board2= [[2,8,8,8],[16,4,8,4],[32,8,4,2],[2,32,3,2]]
        const board3 = [[0,2,2,0], [16,4,8,4],[32,8,4,2],[2,32,3,2]]
        expect(isMoved(board2, board2)).toBe(false)
        expect(isMoved(board1, board2)).toBe(true)
        expect(isMoved(board2, board3)).toBe(true)
    })
    it ("getBlankCordinate", ()=> {
        const board1 = [[2,8,4,8],[16,4,8,4],[32,8,4,2],[2,32,3,2]]
        const board2 = [[0,2,2,0], [16,4,8,4],[32,8,4,2],[2,32,3,2]]
        expect(getBlankCordinates(board1)).toHaveLength(0)
        expect(getBlankCordinates(board2)).toHaveLength(2)
    })

    
} )