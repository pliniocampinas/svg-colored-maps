import mapBuildingTools from '../map-building-tools.js'

export async function getResolver() {
  try {
    const svg = await import('../maps/brazil-states.svg');
    return svg.default; // Contains the raw SVG content
  } catch (error) {
    throw new Error(`Error importing SVG brazil-states.svg: ${error.message}`);
  }
}

export class BrazilStatesBuilder {
  constructor(params) {
    mapBuildingTools.construct(this, {
      ...params,
      codeAttribute: 'statecode',
      svgResolver: getResolver,
    })
  }

  async render() {
    return mapBuildingTools.render(this)
  }

  togglePath(code) {
    return mapBuildingTools.togglePath(this, code)
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

export default { BrazilStatesBuilder }