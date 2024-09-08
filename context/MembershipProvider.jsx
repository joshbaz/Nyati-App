import React, { createContext, useContext } from "react"
import usePayments from "../hooks/usePayments"
import useSubscription from "../hooks/useSubscription"

/**
 * @typedef {Object} MembershipContextType
 * @property {boolean} payloading
 * @property {boolean} subloading
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
  payloading: false,
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
  // states
  const {
    plans,
    assignPlan,
    updatePlan,
    currentPlan,
    loading: subloading,
  } = useSubscription(disableFetchOnMount)

  const {
    history,
    savedMethods,
    paymentOptions,
    addNewPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    defaultPaymentMethod,
    loading: payloading,
  } = usePayments(disableFetchOnMount)

  return (
    <MembershipContext.Provider
      value={{
        payloading,
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
