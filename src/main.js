import './fonts/ys-display/fonts.css';
import './style.css';

import {data as sourceData} from "./data/dataset_1.js";
import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";
import {initPagination} from './components/pagination.js';
import {initTable} from "./components/table.js";
import {initSorting} from './components/sorting.js';
import {initFiltering} from './components/filtering.js';
import {initSearching} from './components/searching.js';


const {data, ...indexes} = initData(sourceData);

function collectState() {
    const formData = new FormData(document.querySelector('form[name="table"]'));
    const state = processFormData(formData);

    return {
        ...state,
        rowsPerPage: parseInt(state.rowsPerPage) || 10,
        page: parseInt(state.page) || 1
    };
}

function render(action) {
    const state = collectState();
    let result = {
        data: [...data],
        state: state
    };

    try {
        result.data = applySearching(result.data, result.state, action);
        result.data = applyFiltering(result.data, result.state, action);
        result.data = applySorting(result.data, result.state, action);
        result = applyPagination(result.data, result.state, action);
    } catch (e) {
        console.error('Error during table processing:', e);
    }
    
    sampleTable.render(result.data);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

const applySearching = initSearching('search');
const applyFiltering = initFiltering(sampleTable.filter.elements, {sellers: indexes.sellers});
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);
const applyPagination = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

document.querySelector('#app').appendChild(sampleTable.container);
render();