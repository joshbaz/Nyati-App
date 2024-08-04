import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { Text, View } from "react-native"
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated"
import { FontAwesome5 } from "@expo/vector-icons"
import { COLORS } from "../src/color/VariableColors"

/**
 * @typedef {Object} Toast
 * @property {"success" | "danger" | "info" | "warning"} type
 * @property {string} message
 * @property {boolean} showToast
 * @property {number} duration
 * */

/**
 * @typedef {Object} ToastContext
 * @property {(params: Toast) => void} showToast
 * @property {Toast} toast
 */

/**
 * @name ToastContext
 * @description Toast context
 * @type {React.Context<ToastContext>}
 * @returns {React.Context<ToastContext>}
 */

const ToastContext = createContext({
  toast: {
    type: "success",
    message: "",
    showToast: false,
    duration: 4000,
  },
  showToast: () => {},
})

function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    type: "success",
    showToast: false,
    message: "",
    duration: 4000,
  })

  /**
   * @name showToast
   * @description Function to make and trigger the toast
   * @param {Toast} params
   * @returns {void} void
   * */
  const showToast = useCallback(
    ({ type, message, duration = 4000 }) => {
      if (toast.showToast) {
        // remove the previous toast
        setToast({ message: "", type: "success", showToast: false })
      }
      // set the new toast
      setToast((prev) => ({
        ...prev,
        type,
        message,
        showToast: true,
        duration,
      }))
    },
    [toast.showToast],
  )

  useEffect(() => {
    if (toast.showToast) {
      const timer = setTimeout(() => {
        setToast({ message: "", type: "success", showToast: false })
      }, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.showToast, toast.duration])

  return (
    <ToastContext.Provider value={{ showToast, toast }}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

/**
 * @name Toast
 * @description Toast component
 * @param {{toast: Toast}} props
 * @returns React.ReactNode
 */
export const Toast = ({ toast }) => {
  const TOAST_TYPE = {
    success: {
      backgroundColor: "#2ecc71",
      icon: "check-circle",
    },
    danger: {
      backgroundColor: "#e74c3c",
      icon: "exclamation-circle",
    },
    info: {
      backgroundColor: "#3498db",
      icon: "info-circle",
    },
    warning: {
      backgroundColor: "#f39c12",
      icon: "exclamation-triangle",
    },
  }

  const { backgroundColor, icon } = TOAST_TYPE[toast.type]

  if (!toast.showToast) return null
  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 50,
        width: "90%",
        height: "auto",
        backgroundColor: backgroundColor,
        left: "5%",
        borderRadius: 10,
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1000,
      }}
      entering={FadeInUp.delay(200)}
      exiting={FadeOutUp}
    >
      <FontAwesome5 name={icon} size={30} color='#FFF' />

      <View style={{ marginLeft: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: "400", color: "#FFF" }}>
          {toast.message}
        </Text>
      </View>
    </Animated.View>
  )
}

export default ToastProvider
