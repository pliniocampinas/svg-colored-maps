import { SaoPauloMunicipalitiesBuilder } from './src/builders/sao-paulo-municipalities-builder.js'
import { fillTable, clearColorLabels } from './commons.js'

let onFillDetails = (details) => {}
let clearDetails = () => document.querySelector('#city-details').innerHTML = ''

const buildParameters = {
  containerSelector: '#municipalities-map', 
  selectedPathClass: 'path--selected',
  onPathClick: (details) => {
    console.log('custom click details:', details)
    if(!mapBuilder.togglePath(details.code)) {
      document.querySelector('#city-name').innerHTML = 'Select a city'
      clearDetails()
      return
    }
    onFillDetails(details)
  }, 
}

const mapBuilder = new SaoPauloMunicipalitiesBuilder(buildParameters);
mapBuilder
  .render()
  .then(() => colorWithGdp('state-rgb'))

const colorWithGdp = async (view) => {
  const codesWithStates = (await fetch('./sample-data/municipalities-codes.json')
    .then(res => res.json()))
    .filter(d => d.stateAcronym === 'SP')

  const codes = codesWithStates.map(d => d.code)
  const sampleData = (await fetch('./sample-data/gdp-per-capita-2019.json')
    .then(res => res.json()))
    .filter(d => codes.includes(d.code))
    .map(d => ({
      code: d.code,
      value: d.gdpPerCapitaBrl2019
    }))
  
  fillTable(sampleData)
  if(view === 'state-rgb') {
    mapBuilder.colorizeRdYlGn(sampleData)
  }
  if(view === 'state-blues') {
    mapBuilder.colorizeBlues(sampleData)
  }
  clearColorLabels()
  clearDetails()
  onFillDetails = ({code}) => {
    document.querySelector('#city-name').innerHTML = codesWithStates.find(d => d.code == code).name
    document.querySelector('#city-details').innerHTML = `
      <span>GDP: </span>
      <span>${sampleData.find(d => d.code == code)?.value}</span>
    `
  }
}

document.querySelector('.switch-view-button[view-name="state-rgb"]').addEventListener('click', () => colorWithGdp('state-rgb'))
document.querySelector('.switch-view-button[view-name="state-blues"]').addEventListener('click', () => colorWithGdp('state-blues'))