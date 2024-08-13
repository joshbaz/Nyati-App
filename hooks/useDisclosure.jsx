import React from "react"

/**
 * @typedef {Object} returns
 * @property {boolean} isOpen - The state of the modal, drawer, or component
 * @property {()=> void} onOpen - A function to set isOpen to true
 * @property {()=> void} onClose - A function to set isOpen to false
 * @property {()=> void} onToggle - A function to toggle the isOpen state
 */

/**
 * @name useDisclosure
 * @description A custom hook to handle the state of a modal, drawer, or any other component that needs to be toggled
 * @param {boolean} defaultIsOpen
 * @returns {returns} An object containing isOpen, onOpen, onClose, and onToggle
 */
function useDisclosure(defaultIsOpen = false) {
  const [isOpen, setIsOpen] = React.useState(defaultIsOpen)

  /**
   * @name onOpen
   * @description Set isOpen to true
   * @returns {void}
   */
  const onOpen = () => setIsOpen(true)

  /**
   * @name onClose
   * @description Sets isOpen to false
   * @returns {void}
   */
  const onClose = () => setIsOpen(false)

  /**
   * @name onToggle
   * @description Toggles the isOpen state between true and false
   * @returns {void}
   */
  const onToggle = () => setIsOpen(!isOpen)

  return { isOpen, onOpen, onClose, onToggle }
}

export default useDisclosure
