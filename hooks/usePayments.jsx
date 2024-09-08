import { useCallback, useEffect, useState } from "react"
import { useAuth } from "../context/AuthProvider"
import { useToast } from "../context/ToastProvider"
import { invoke } from "../lib/axios"
import { PAYMENT_OPTIONS } from "../src/utils/payments"

function usePayments(disableFetchOnMount = false) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [savedMethods, setSavedMethods] = useState([])
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState(null)
  const [paymentOptions] = useState(() => {
    return PAYMENT_OPTIONS.map((option) => ({
      ...option,
      disabled: option.comingSoon,
    }))
  })

  const getPaymentMethods = useCallback(async () => {
    if (!user?.id || disableFetchOnMount) return

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
  }, [user?.id, disableFetchOnMount])

  const getPaymentHistory = useCallback(async () => {
    if (!user?.id || disableFetchOnMount) return
    try {
      setLoading(true)
      const response = await invoke({
        endpoint: `/payment/${user?.id}/paymentHistory`,
      })

      if (response.error) {
        const err = new Error(response.error.message)
        err.statusCode = response.status
        throw err
      }

      setHistory(response.res.history || [])
    } catch (error) {
      setHistory([])
    } finally {
      setLoading(false)
    }
  }, [user?.id, disableFetchOnMount])

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
    getPaymentMethods()
    // getPaymentHistory()
  }, [getPaymentMethods, getPaymentHistory])

  return {
    loading,
    history,
    savedMethods,
    paymentOptions,
    addNewPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    defaultPaymentMethod,
  }
}

export default usePayments
