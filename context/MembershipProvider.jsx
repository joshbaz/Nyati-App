import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import useSubscription from "../hooks/useSubscription"
import { invoke } from "../lib/axios"
import { PAYMENT_OPTIONS } from "../src/utils/payments"
import { useAuth } from "./AuthProvider"
import { useToast } from "./ToastProvider"

/**
 * @typedef {Object} MembershipContextType
 * @property {boolean} loading
 * @property {Array} history
 * @property {Array} plans
 * @property {Object} currentPlan
 * @property {Object} defaultPaymentMethod
 * @property {Array} paymentOptions
 * @property {Array} savedMethods
 * @property {(data: Object) => void} updatePlan
 * @property {(planId: string) => void} assignPlan
 * @property {(data: Object) => void} addNewPaymentMethod
 * @property {(id: string, data: Object) => void} updatePaymentMethod
 * @property {(id: string) => void} deletePaymentMethod
 */

/**
 * @name MembershipContext
 * @description Membership context
 * @type {React.Context<MembershipContextType>}
 * @returns {React.Context<MembershipContextType>}
 * */

const MembershipContext = createContext({
  loading: false,
  subloading: false,
  history: [],
  plans: [],
  currentPlan: null,
  defaultPaymentMethod: null,
  savedMethods: [],
  paymentOptions: [],
  updatePlan: () => {},
  assignPlan: () => {},
  addNewPaymentMethod: () => {},
  deletePaymentMethod: () => {},
})

function MembershipProvider({ children, disableFetchOnMount = false }) {
  const { user } = useAuth()
  const { showToast } = useToast()

  // states
  const {
    plans,
    assignPlan,
    updatePlan,
    currentPlan,
    loading: subloading,
  } = useSubscription(disableFetchOnMount)
  const [paymentOptions, setPaymentOptions] = useState(() => {
    return PAYMENT_OPTIONS.map((option) => {
      return {
        ...option,
        disabled: option?.comingSoon,
      }
    })
  })
  const [savedMethods, setSavedMethods] = useState(PAYMENT_OPTIONS || [])
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  /**
   * @name addNewPaymentMethod
   * @description add new payment method
   * @param {Object} data
   * @returns {void}
   */
  const addNewPaymentMethod = useCallback(
    async (data) => {
      try {
        setLoading(true)
        const response = await invoke({
          method: "POST",
          endpoint: `/payment/${user?.id}/newpaymentmethod`,
          data,
        })

        if (response.error) {
          const err = new Error(response.error.message)
          err.statusCode = response.status
          throw err
        }

        // Redirect to the payment methods page & show success toast
        showToast({
          type: "success",
          message: "Payment method added successfully",
        })

        // fetch the updated payment methods
        getPaymentMethods()
      } catch (error) {
        showToast({ type: "error", message: error.message })
      } finally {
        setLoading(false)
      }
    },
    [user?.id],
  )

  /**
   * @name getPaymentMethods
   * @description get user's payment methods
   * @returns {void}
   * */
  const getPaymentMethods = useCallback(async () => {
    try {
      setLoading(true)
      const response = await invoke({
        endpoint: `/payment/${user?.id}/paymentMethods`,
      })

      if (response.error) {
        const err = new Error(response.error.message)
        err.statusCode = response.status
        throw err
      }

      let methods = PAYMENT_OPTIONS

      if (response.res.methods && response.res.methods.length > 0) {
        // update the payment methods to include the default properties for the payment options
        methods = response.res.methods.map((method) => {
          const found = PAYMENT_OPTIONS.find(
            (option) => option.value === method.name,
          )
          if (found) {
            return {
              ...method,
              ...found,
            }
          }
          return method
        })
      }

      // get the default payment method
      const defaultMethod =
        methods.find((method) => method.defaultStatus) || null

      setDefaultPaymentMethod(defaultMethod)
      setSavedMethods(methods)
    } catch (error) {
      showToast({ type: "error", message: error.message })
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  /**
   * @name getPaymentHistory
   * @description get user's plan
   * @returns {void}
   */
  const getPaymentHistory = useCallback(async () => {
    try {
      setLoading(true)

      const response = await invoke({
        endpoint: `/payment/${user?.id}/history`,
      })

      if (response.error) {
        const err = new Error(response.error.message)
        err.statusCode = response.status
        throw err
      }
      setHistory(response.res?.history || [])
    } catch (error) {
      showToast({ type: "error", message: error.message })
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  /**
   * @name updatePaymentMethod
   * @description update a payment method
   * @returns {void}
   */
  const updatePaymentMethod = useCallback(
    /**
     * @param {string} id
     * @param {Object} data
     */
    async (id, data) => {
      try {
        setLoading(true)
        const response = await invoke({
          method: "PUT",
          endpoint: `/payment/${user?.id}/updateMethod/${id}`,
          data,
        })

        if (response.error) {
          const err = new Error(response?.error.message)
          err.statusCode = response.status
          throw err
        }

        showToast({ type: "success", message: response?.res?.message })
        // fetch the updated payment methods
        getPaymentMethods()
      } catch (error) {
        showToast({ type: "error", message: error.message })
      } finally {
        setLoading(false)
      }
    },
    [user?.id],
  )

  /**
   * @name deletePaymentMethod
   * @description delete a payment method
   * @param {string} id
   * @returns {void}
   */
  const deletePaymentMethod = useCallback(
    /**
     *
     * @param {string} id
     */
    async (id) => {
      try {
        setLoading(true)
        const response = await invoke({
          method: "DELETE",
          endpoint: `/payment/${user?.id}/paymentMethod/${id}`,
        })

        if (response.error) {
          const err = new Error(response.error.message)
          err.statusCode = response.status
          throw err
        }

        // fetch the updated payment methods
        getPaymentMethods()
        showToast({ type: "success", message: response.res.message })
      } catch (error) {
        showToast({ type: "error", message: error.message })
      } finally {
        setLoading(false)
      }
    },
    [user?.id],
  )

  useEffect(() => {
    if (disableFetchOnMount) return
    getPaymentMethods()
    getPaymentHistory()
  }, [getPaymentHistory, getPaymentMethods, disableFetchOnMount])

  return (
    <MembershipContext.Provider
      value={{
        loading,
        subloading,
        history,
        plans,
        currentPlan,
        defaultPaymentMethod,
        paymentOptions,
        savedMethods,
        updatePlan,
        assignPlan,
        addNewPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
      }}
    >
      {children}
    </MembershipContext.Provider>
  )
}

export function useMembership() {
  const context = useContext(MembershipContext)
  if (!context) {
    throw new Error("useMembership must be used within a MembershipProvider")
  }
  return context
}

export default MembershipProvider
