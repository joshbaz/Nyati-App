import { useCallback, useEffect, useState } from "react"
import { Image } from "react-native"
import AIRTELMONEY from "../assets/AirtelMoney.png"
import MTNMOMO from "../assets/MtnMoMo.png"
import PESAPAL from "../assets/pesapal.png"
import { useAuth } from "../context/AuthProvider"
import { invoke } from "../lib/axios"

const options = [
  {
    label: "MTN MOMO",
    value: "mtnmomo",
    comingSoon: false,
    logo: Image.resolveAssetSource(MTNMOMO).uri,
  },
  {
    label: "Airtel Money",
    value: "airtelmoney",
    comingSoon: true,
    logo: Image.resolveAssetSource(AIRTELMONEY).uri,
  },
  {
    label: "Visa | Mastercard",
    value: "pesapal",
    comingSoon: true,
    logo: Image.resolveAssetSource(PESAPAL).uri,
  },
]

function usePayments(loadSaved) {
  const { user } = useAuth()
  const [methods, setMethods] = useState(() => {
    return options.map((option) => ({
      ...option,
      disabled: option.comingSoon,
    }))
  })
  const [loading, setLoading] = useState(true)

  const loadSavedMethods = useCallback(async () => {
    if (!loadSaved) return
    try {
      const response = await invoke({
        endpoint: `/payment/${user.id}/paymentMethods`,
      })

      if (response.error) {
        throw new Error(response.error)
      }

      // format the response to match the options
      const savedMethods = response.res?.methods ?? []

      // only return the methods that are are in the saved methods
      const formattedMethods = savedMethods.map((method) => {
        const option = options.find((opt) => opt.value === method.name)
        if (!option) return null
        return {
          ...option,
          disabled: option.comingSoon,
        }
      })

      setMethods(formattedMethods)
    } catch (error) {
      setMethods([]) // set methods to empty array to allow user to select a method
    } finally {
      setLoading(false)
    }
  }, [loadSaved])

  useEffect(() => {
    loadSavedMethods()
  }, [loadSavedMethods])

  return { methods, loading }
}

export default usePayments
