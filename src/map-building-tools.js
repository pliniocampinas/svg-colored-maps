const getQuantiles = (values, nTil) => {
  const orderedValues = values.slice().sort((a,b) => a - b)
  const quantiles = []
  for (let nthQuantile = 1; nthQuantile <= nTil; nthQuantile++) {
    const quantileIndex = Math.ceil(orderedValues.length * (nthQuantile / nTil)) - 1
    quantiles.push(orderedValues[quantileIndex])
  }

  return quantiles
}

const getQuantilIndex = (quantiles, value) => {
  for (let index = 0; index < quantiles.length; index++) {
    const quantilUpperValue = quantiles[index];
    if(value <= quantilUpperValue) {
      return index
    }
  }
  return 0
}

const shrinkPalleteWithContrast = (originalPallete, newLength) => {
  if (originalPallete.length <= 2) {
    return [...originalPallete]
  }

  if (newLength == 2) {
    return [originalPallete.at(0), originalPallete.at(-1)]
  }

  const newPallete = []
  const leap =  Math.floor(originalPallete.length/newLength);
  let cursor = 0
  while(newPallete.length < newLength - 1) {
    newPallete.push(originalPallete[cursor])
    if(cursor == 0) {
      cursor++
    }
    cursor+= leap
  }
  const last = originalPallete.at(-1)
  newPallete.push(last)
  return newPallete
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
    const quantiles = getQuantiles(codesAndValues.map(d => d.value), RdYlGn10.length)
    codesAndValues.forEach(element => {
      const quantileIndex = getQuantilIndex(quantiles, element.value)
      pathElementsMap[element.code]?.setAttribute('fill', RdYlGn10[quantileIndex])
    })
  },

  colorizeBlues(pathElementsMap, codesAndValues, { numberOfQuantiles } = {}) {
    const defaultBlues =  ['#8fffff', '#00ffff', '#00bfff', '#009fff', '#0080ff', '#0060ff', '#0040ff', '#0020ff', '#0010d9', '#0000b3']
    let nQuantiles = defaultBlues.length
    let pallete = defaultBlues
    if (numberOfQuantiles > 0 && numberOfQuantiles < defaultBlues.length) {
      nQuantiles = numberOfQuantiles
      pallete = shrinkPalleteWithContrast(defaultBlues, numberOfQuantiles)
    }
    const quantiles = getQuantiles(codesAndValues.map(d => d.value), nQuantiles)
    codesAndValues.forEach(element => {
      const quantileIndex = getQuantilIndex(quantiles, element.value)
      pathElementsMap[element.code]?.setAttribute('fill', pallete[quantileIndex])
    })
  },

  colorizeCustomWithPallete(pathElementsMap, codesAndValues, { customPallete } = {}) {
    let nQuantiles = customPallete.length
    const quantiles = getQuantiles(codesAndValues.map(d => d.value), nQuantiles)
    codesAndValues.forEach(element => {
      const quantileIndex = getQuantilIndex(quantiles, element.value)
      pathElementsMap[element.code]?.setAttribute('fill', customPallete[quantileIndex])
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