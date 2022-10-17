// 🐨 you're going to need the Dialog component
// It's just a light wrapper around ReachUI Dialog
// 📜 https://reacttraining.com/reach-ui/dialog/
import { Dialog } from './lib'

import React from "react"

const callAll = (...fns) => (...args) => fns.forEach(fn => fn & fn(...args))

const ModalContext = React.createContext()
export function Modal(props) {
  const [isOpen, setIsOpen] = React.useState(false)
  return <ModalContext.Provider value={{ isOpen, setIsOpen }} {...props} />
}
const useModalConext = () => React.useContext(ModalContext)

export function ModalOpenButton({ children: child }) {
  const { setIsOpen } = useModalConext()
  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(true), child.props.onClick)
  })
}
export function ModalDismissButton({ children: child }) {
  const { setIsOpen } = useModalConext()
  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(false), child.props.onClick)
  })
}

export function ModalContents({ title, modalLabelText, ...props }) {
  const { isOpen, setIsOpen } = useModalConext()
  return <Dialog
    isOpen={isOpen}
    onDismiss={() => setIsOpen(false)}
    {...props}
  >
  </Dialog>
}
