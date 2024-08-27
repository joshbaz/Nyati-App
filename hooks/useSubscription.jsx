import React, { useCallback, useEffect, useState } from "react"
import { useAuth } from "../context/AuthProvider"
import { invoke } from "../lib/axios"

const plansList = [
  {
    label: "Monthly",
    value: "monthly",
    price: 1530,
    currency: "UGX", // Ugandan Shilling
    selected: false,
  },
  {
    label: "Weekly",
    value: "weekly",
    price: 100,
    currency: "UGX",
    selected: false,
  },
]

function useSubscription(disableFetch = false) {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [plans, setPlans] = useState(plansList)

  const fetchSubscription = useCallback(async () => {
    if (disableFetch) return // prevent automatic fetching
    try {
      const response = await invoke({
        endpoint: `/payment/${user?.id}/subscription`,
      })

      if (response.error) {
        throw new Error(response.error)
      }

      // update the plans with the selected plan
      const updatedPlans = plans.map((plan) => {
        if (!response.res.subscription) return plan

        const selectedPlan = response.res?.subscription?.plan ?? null
        if (selectedPlan && selectedPlan === plan.value) {
          return { ...plan, selected: true }
        }

        return plan
      })

      setPlans(updatedPlans)
      setSubscription(response.res.subscription)
    } catch (error) {
      setSubscription(null)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  const updateSubscription = useCallback(
    async (data) => {
      try {
        setLoading(true)
        const response = await invoke({
          method: "PUT",
          endpoint: `/user/${user?.id}/subscription`,
          data,
        })

        if (response.error) {
          throw new Error(response.error)
        }

        setSubscription(response.res.subscription)
      } catch (error) {
        console.error("Error - something is not right", error)
        setSubscription(null)
      } finally {
        setLoading(false)
      }
    },
    [user?.id],
  )

  useEffect(() => {
    fetchSubscription()
  }, [fetchSubscription])
  return { subscription, loading, updateSubscription, plans }
}

export default useSubscription
