/*
ex1
*/



package main

import (
    "fmt"
    "strconv"
)

func is_palindrome(n int) bool {
    var lowmask int = 1 //will be used to get a bit of n from the start
    var highmask int = 1 //from the end
    // make highmask the most significant bit of n
    for highmask*2 <= n {
        highmask *= 2
    }
    for lowmask <= highmask {
        // true if bit is one, false if 0
        var lowbit bool = (n & lowmask) != 0
        var highbit bool = (n & highmask) != 0
        if highbit != lowbit {
            return false
        }
        lowmask *= 2
        highmask /= 2
        
    }
    return true

}


func main() {
    var s string = ""
    fmt.Println("Enter an integer: ")
    fmt.Scanln(&s)
    var n int = 0
    n, _ = strconv.Atoi(s)
    fmt.Printf("Is %d a bit palindrome? %t\n", n, is_palindrome(n))
}

