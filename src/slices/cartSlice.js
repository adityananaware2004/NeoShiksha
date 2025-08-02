import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-hot-toast"

const initialState = {
  cart: (() => {
    try {
      const cartData = localStorage.getItem("cart")
      return cartData ? JSON.parse(cartData) : []
    } catch (error) {
      console.error("Error parsing cart data:", error)
      localStorage.removeItem("cart")
      return []
    }
  })(),
  total: (() => {
    try {
      const totalData = localStorage.getItem("total")
      return totalData ? JSON.parse(totalData) : 0
    } catch (error) {
      console.error("Error parsing total data:", error)
      localStorage.removeItem("total")
      return 0
    }
  })(),
  totalItems: (() => {
    try {
      const totalItemsData = localStorage.getItem("totalItems")
      return totalItemsData ? JSON.parse(totalItemsData) : 0
    } catch (error) {
      console.error("Error parsing totalItems data:", error)
      localStorage.removeItem("totalItems")
      return 0
    }
  })(),
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const course = action.payload
      const index = state.cart.findIndex((item) => item._id === course._id)

      if (index >= 0) {
        // If the course is already in the cart, do not modify the quantity
        toast.error("Course already in cart")
        return
      }
      // If the course is not in the cart, add it to the cart
      state.cart.push(course)
      // Update the total quantity and price
      state.totalItems++
      state.total += course.price
      // Update to localstorage
      localStorage.setItem("cart", JSON.stringify(state.cart))
      localStorage.setItem("total", JSON.stringify(state.total))
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems))
      // show toast
      toast.success("Course added to cart")
    },
    removeFromCart: (state, action) => {
      const courseId = action.payload
      const index = state.cart.findIndex((item) => item._id === courseId)

      if (index >= 0) {
        // If the course is found in the cart, remove it
        state.totalItems--
        state.total -= state.cart[index].price
        state.cart.splice(index, 1)
        // Update to localstorage
        localStorage.setItem("cart", JSON.stringify(state.cart))
        localStorage.setItem("total", JSON.stringify(state.total))
        localStorage.setItem("totalItems", JSON.stringify(state.totalItems))
        // show toast
        toast.success("Course removed from cart")
      }
    },
    resetCart: (state) => {
      state.cart = []
      state.total = 0
      state.totalItems = 0
      // Update to localstorage
      localStorage.removeItem("cart")
      localStorage.removeItem("total")
      localStorage.removeItem("totalItems")
    },
  },
})

export const { addToCart, removeFromCart, resetCart } = cartSlice.actions

export default cartSlice.reducer