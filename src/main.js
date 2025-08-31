import './fonts/ys-display/fonts.css';
import './style.css';

import {data as sourceData} from "./data/dataset_1.js";
import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";
import {initPagination} from './components/pagination.js';
import {initTable} from "./components/table.js";
import {initSorting} from './components/sorting.js';
import {initSearching} from './components/searching.js';
import {initFiltering} from './components/filtering.js';

const api = initData(sourceData);

function collectState() {
    const formData = new FormData(document.querySelector('form[name="table"]'));
    const state = processFormData(formData);

    return {
        ...state,
        rowsPerPage: parseInt(state.rowsPerPage) || 10,
        page: parseInt(state.page) || 1
    };
}

async function render(action) {
    const state = collectState();
    let query = {};

    try {
        query = applySearching(query, state, action);
        query = applyFiltering(query, state, action);
        query = applySorting(query, state, action);
        query = applyPagination(query, state, action);
    } catch (e) {
        console.error('Error during table processing:', e);
    }
    
    const { total, items } = await api.getRecords(query);
    updatePagination(total, query);
    sampleTable.render(items);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

const applySearching = initSearching('search');
const {applyFiltering, updateIndexes} = initFiltering(sampleTable.filter.elements);
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);
const {applyPagination, updatePagination} = initPagination(
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

async function init() {
    const indexes = await api.getIndexes();
    updateIndexes(indexes);
    return indexes;
}

document.querySelector('#app').appendChild(sampleTable.container);
init().then(() => render());