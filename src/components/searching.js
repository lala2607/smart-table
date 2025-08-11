import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField = 'search') {
    const compare = createComparison(
        ['skipEmptyTargetValues'], // Используем массив имен правил
        [rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)]
    );

    return (data = [], state = {}) => {
        if (!Array.isArray(data)) return [];
        return data.filter(row => compare(row, state));
    };
}
