const getDeciles = (values) => {
  const orderedValues = values.slice().sort((a,b) => a - b)
  const deciles = []
  for (let nthDecile = 1; nthDecile <= 10; nthDecile++) {
    const decileIndex = Math.ceil(orderedValues.length * (nthDecile / 10)) - 1
    deciles.push(orderedValues[decileIndex])
  }

  return deciles
}

const getDecileIndex = (decils, value) => {
  for (let index = 0; index < decils.length; index++) {
    const decilUpperValue = decils[index];
    if(value <= decilUpperValue) {
      return index
    }
  }
  return 0
}

export default {
  construct(builderInstance, {
    containerSelector,
    selectedPathClass,
    onPathClick,
    onLoad,
    codeAttribute,
    svgResolver,
  }) {
    builderInstance.rendered = false
    builderInstance.containerSelector = containerSelector
    builderInstance.selectedPathClass = selectedPathClass
    builderInstance.onPathClick = onPathClick || ((details) => console.log('click details:', details))
    builderInstance.onLoad = onLoad || (() => console.log('map loaded'))
    builderInstance.pathElementsMap = {}
    builderInstance.currentData = []
    builderInstance.selectedCodes = []
    builderInstance.codeAttribute = codeAttribute || 'code'
    builderInstance.svgResolver = svgResolver 
  },

  async render(builderInstance) {
    if(builderInstance.rendered) {
      console.error('Render map error: maps can only be rendered once')
      return
    }

    const containerElement = document.querySelector(builderInstance.containerSelector)
    if(!containerElement) {
      console.error('Render map error: container element not found')
      return
    }

    if (typeof builderInstance.svgResolver === 'string') {
      const svgText = await fetch(builderInstance.svgResolver).then(res => res.text())
      containerElement.innerHTML = svgText
    } else if (typeof builderInstance.svgResolver === 'function') {
      const svgText = await Promise.resolve(builderInstance.svgResolver())
      containerElement.innerHTML = svgText
    } else {
      const svgText = await Promise.resolve(builderInstance.svgResolver)
      containerElement.innerHTML = svgText
    }

    builderInstance.onLoad()

    for (const pathElement of containerElement.querySelectorAll('path')) {
      const code = pathElement.getAttribute(builderInstance.codeAttribute)
      if(!code) {
        continue
      }
      pathElement.addEventListener('click', () => builderInstance.onPathClick({
        code,
        pathElement,
      }))
      builderInstance.pathElementsMap[code] = pathElement
    }

    builderInstance.rendered = true
    return builderInstance.pathElementsMap
  },

  colorizeRdYlGn(pathElementsMap, codesAndValues) {
    const RdYlGn10 = ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837']
    const deciles = getDeciles(codesAndValues.map(d => d.value))
    codesAndValues.forEach(element => {
      const decileIndex = getDecileIndex(deciles, element.value)
      pathElementsMap[element.code]?.setAttribute('fill', RdYlGn10[decileIndex])
    })
  },

  colorizeBlues(pathElementsMap, codesAndValues) {
    const blues =  ['#8fffff', '#00ffff', '#00bfff', '#009fff', '#0080ff', '#0060ff', '#0040ff', '#0020ff', '#0010d9', '#0000b3']
    const deciles = getDeciles(codesAndValues.map(d => d.value))
    codesAndValues.forEach(element => {
      const decileIndex = getDecileIndex(deciles, element.value)
      pathElementsMap[element.code]?.setAttribute('fill', blues[decileIndex])
    })
  },

  colorizeCategories(pathElementsMap, codesAndValues, { customPallete } = {}) {
    const categoricalPallete = customPallete?? ['#1f77b4','#ff7f0e','#2ca02c','#d62728','#9467bd','#8c564b','#e377c2','#7f7f7f','#bcbd22','#17becf']
    const uniqueValues = [...new Set(codesAndValues.map(d => d.value))]
    if(uniqueValues.length > categoricalPallete.length) {
      console.warn('There are more unique values than colors in the pallete, there will be repeated colors')
    }

    const colorMap = {}
    uniqueValues.forEach((v, i) => colorMap[v] = categoricalPallete[i%categoricalPallete.length])

    codesAndValues.forEach(element => {
      const color = colorMap[element.value]
      if (!color) {
        return
      }
      pathElementsMap[element.code]?.setAttribute('fill', color)
    })

    return colorMap
  },

  togglePath(builderInstance, code) {
    const pathElement = builderInstance.pathElementsMap[code]
    if(!pathElement) {
      console.warn('Path not found for code', code)
      return ''
    }
    if(!builderInstance.selectedPathClass) {
      console.warn('There is no selectedPathClass configured')
      return ''
    }

    let deselected = false
    for (let index = 0; index < builderInstance.selectedCodes.length; index++) {
      const prevCode = builderInstance.selectedCodes[index];
      const prevPathElement = builderInstance.pathElementsMap[prevCode]
      prevPathElement.classList.remove(builderInstance.selectedPathClass)

      if(prevCode == code) {
        deselected = true
      }
    }

    builderInstance.selectedCodes = []

    if(deselected) {
      return ''
    }

    if(pathElement.classList.contains(builderInstance.selectedPathClass)) {
      pathElement.classList.remove(builderInstance.selectedPathClass)
      return ''
    }

    pathElement.classList.add(builderInstance.selectedPathClass)
    builderInstance.selectedCodes.push(code)
    return code
  },

  clearAllSelectedPaths(builderInstance) {
    for (let index = 0; index < builderInstance.selectedCodes.length; index++) {
      const prevCode = builderInstance.selectedCodes[index];
      const prevPathElement = builderInstance.pathElementsMap[prevCode]
      prevPathElement.classList.remove(builderInstance.selectedPathClass)
    }

    builderInstance.selectedCodes = []
  },

  clearSelectedPaths(builderInstance, codes) {
    for (let index = 0; index < codes.length; index++) {
      const prevPathElement = builderInstance.pathElementsMap[codes[index]]
      prevPathElement.classList.remove(builderInstance.selectedPathClass)
    }

    builderInstance.selectedCodes = builderInstance.selectedCodes.filter(c => !codes.includes(c))
  },

  selectPaths(builderInstance, codes) {
    if(!builderInstance.selectedPathClass) {
      console.warn('There is no selectedPathClass configured')
      return
    }

    for (let index = 0; index < codes?.length; index++) {
      const code = codes[index];
      const pathElement = builderInstance.pathElementsMap[code]
      pathElement.classList.add(builderInstance.selectedPathClass)
      builderInstance.selectedCodes.push(code)
    }
  },
}