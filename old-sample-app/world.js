import { WorldBuilder } from './src/builders/world-builder.js'
import { fillTable, clearColorLabels } from './commons.js'

let onFillDetails = (details) => {}
let clearDetails = () => document.querySelector('#selected-details').innerHTML = ''

const buildParameters = {
  containerSelector: '#world-map', 
  selectedPathClass: 'path--selected',
  onPathClick: (details) => {
    console.log('custom click details:', details)
    if(!mapBuilder.togglePath(details.code)) {
      document.querySelector('#country-name').innerHTML = 'Select a country'
      clearDetails()
      return
    }
    onFillDetails(details)
  }, 
}

const mapBuilder = new WorldBuilder(buildParameters);
mapBuilder
  .render()
  .then(() => colorWithGdp('state-rgb'))

const colorWithGdp = async (view) => {
  const sampleData = (await fetch('./sample-data/countries-gdp.json')
    .then(res => res.json()))
    .map(d => ({
      code: d.ISO2,
      value: d.GDP
    }))
  mapBuilder.colorizeRdYlGn(sampleData)
  
  fillTable(sampleData)
  clearColorLabels()
  clearDetails()
  // onFillDetails = ({code}) => {
  //   document.querySelector('#city-name').innerHTML = codesWithStates.find(d => d.code == code).name
  //   document.querySelector('#city-details').innerHTML = `
  //     <span>GDP: </span>
  //     <span>${sampleData.find(d => d.code == code)?.value}</span>
  //   `
  // }
}