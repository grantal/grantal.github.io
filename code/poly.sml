(* poly.sml *)
fun poly li =
    let
        (* takes a value j and returns a function that 
           fn f x => x^j *)
        fun pow j =
            if j = 0 then fn y => 1
            else fn y => y*((pow (j-1)) y)
        (* length function *)
        fun len il =
            if il = nil then 0
            else 1 + (len (tl il))
        (* uses pow to make a polynomial function for each element then add them up *)
        fun help il i =
            if il = nil then fn x => 0
            else fn x => (hd il)*((pow i) x) + ((help (tl il) (i-1)) x)
    in
        help li ((len li) - 1)
    end



