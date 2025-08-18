import React from "react"

type Props = {
  condition: boolean
  children: React.ReactNode
}

export default function RenderIf({ children, condition }: Props) {
  return <>{condition ? children : null}</>
}
