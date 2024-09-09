import { useCallback, useEffect, useState } from "react"
import { useAuth } from "../context/AuthProvider"
import { useToast } from "../context/ToastProvider"
import { invoke } from "../lib/axios"

function useSubscription(disableFetch = false) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPlan, setCurrentPlan] = useState(null)

  const createSubscription = useCallback(
    async (data) => {
      try {
        setLoading(true)
        const response = await invoke({
          method: "POST",
          endpoint: `/subscription/${user?.id}/new`,
          data,
        })

        if (response.error) {
          throw new Error(response.error)
        }

        setCurrentPlan(response.res.subscription)
        showToast({
          type: "success",
          message: response.res?.message || "Subscription add successfully",
        })
        return !!response.res.subscription
      } catch (error) {
        setCurrentPlan(null)
        showToast({
          type: "error",
          message: error?.message || "An error occurred",
        })
        return false
      } finally {
        setLoading(false)
      }
    },
    [user?.id],
  )

  const getCurrentPlan = useCallback(async () => {
    if (disableFetch || !user?.id) return // prevent automatic fetching
    try {
      const response = await invoke({
        endpoint: `/subscription/${user?.id}`,
      })

      if (response.error) {
        throw new Error(response.error)
      }

      setCurrentPlan(response.res.subscription)
    } catch (error) {
      setCurrentPlan(null)
    } finally {
      setLoading(false)
    }
  }, [user?.id, disableFetch])

  const fetchPlans = useCallback(async () => {
    if (disableFetch || !user?.id) return // prevent automatic fetching
    try {
      setLoading(true)
      const response = await invoke({
        endpoint: `/subscription/${user?.id}/plans`,
      })

      if (response.error) {
        throw new Error(response.error)
      }

      setPlans(response.res.plans)
    } catch (error) {
      setPlans([])
    } finally {
      setLoading(false)
    }
  }, [disableFetch, user?.id])

  const updatePlan = useCallback(
    async (data) => {
      try {
        setLoading(true)
        const response = await invoke({
          method: "PUT",
          endpoint: `/subscription/${user?.id}/update`,
          data,
        })

        if (response.error) {
          throw new Error(response.error)
        }

        setCurrentPlan(response.res.subscription)
      } catch (error) {
        setCurrentPlan(null)
      } finally {
        setLoading(false)
      }
    },
    [user?.id],
  )

  const assignPlan = useCallback(
    /**
     * @param {string} planId
     */
    async (planId) => {
      try {
        setLoading(true)
        const response = await invoke({
          method: "PUT",
          endpoint: `/subscription/${user?.id}/assign/${planId}`,
        })

        if (response.error) {
          const err = new Error(response.error.message)
          err.statusCode = response.status
          throw err
        }

        showToast({ type: "success", message: response.res.message })
        getCurrentPlan()
        fetchPlans()
      } catch (error) {
        showToast({ type: "error", message: error.message })
      } finally {
        setLoading(false)
      }
    },
    [user?.id],
  )

  useEffect(() => {
    fetchPlans()
    getCurrentPlan()
  }, [getCurrentPlan, fetchPlans])
  return {
    createSubscription,
    plans,
    currentPlan,
    loading,
    updatePlan,
    assignPlan,
  }
}

export default useSubscription
