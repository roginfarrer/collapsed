import { Collapse } from '@collapsed/core'

const toggle = document.querySelector('button')
const collapse = document.querySelector('#collapse-container')

let isOpen = false
let myState = 'closed'

const instance = new Collapse({
  getCollapseElement: () => collapse,
  getToggleElement: () => toggle,
  initialExpanded: isOpen,
  onStateChange: setState,
  // state: myState,
})

function hydrateElements() {
  const { onClickHandler, ...toggleProps } = instance.getToggle({
    disabled: false,
  })
  for (const property in toggleProps) {
    if (toggleProps[property])
      toggle.setAttribute(property, toggleProps[property])
  }

  const { style: collapseStyle, ...collapseProps } = instance.getCollapse()
  for (const property in collapseProps) {
    if (collapseProps[property])
      collapse.setAttribute(property, collapseProps[property])
  }
  for (const property in collapseStyle) {
    collapse.style[property] = collapseStyle[property]
  }
}

function handleClick() {
  if (isOpen) {
    instance.close()
    isOpen = false
  } else {
    instance.open()
    isOpen = true
  }
}

function setState(state) {
  console.log({ state })
  instance.setOptions((prev) => ({ ...prev, state }))
  hydrateElements()
}

toggle.addEventListener('click', handleClick)

hydrateElements()
