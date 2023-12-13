import mapBuildingTools from '../map-building-tools.js'
import worldSvg from '../maps/world-map.svg.js'

const getResolver = () => new Promise((resolve) => resolve(worldSvg))

export class WorldBuilder {
  constructor(params) {
    mapBuildingTools.construct(this, {
      ...params,
      codeAttribute: 'id',
      svgResolver: getResolver,
    })
  }

  async render() {
    return mapBuildingTools.render(this)
  }

  togglePath(code) {
    return mapBuildingTools.togglePath(this, code)
  }

  colorizeBlues(codesAndValues) {
    this.currentData = codesAndValues
    mapBuildingTools.colorizeBlues(this.pathElementsMap, codesAndValues, {
      numberOfQuantiles: 4
    })
  }

  colorizeRdYlGn(codesAndValues) {
    this.currentData = codesAndValues
    mapBuildingTools.colorizeRdYlGn(this.pathElementsMap, codesAndValues)
  }

  colorizeCategories(codesAndValues, { customPallete } = {}) {
    this.currentData = codesAndValues
    const colorMap = mapBuildingTools.colorizeCategories(this.pathElementsMap, codesAndValues, {customPallete})
    return colorMap
  }
}

export default { WorldBuilder }