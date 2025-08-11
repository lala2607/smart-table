import {createComparison, defaultRules} from "../lib/compare.js";

export function initFiltering(elements = {}, indexes = {}) {
    // Заполняем выпадающий список продавцов
    if (elements.searchBySeller && indexes.sellers) {
        const select = elements.searchBySeller;
        select.innerHTML = '<option value="">All Sellers</option>';
        
        Object.values(indexes.sellers).forEach(seller => {
            const option = document.createElement('option');
            option.value = seller;
            option.textContent = seller;
            select.appendChild(option);
        });
    }

    const compare = createComparison(defaultRules);

    return (data, state, action) => {
        if (!Array.isArray(data)) return [];
        
        if (action && action.name === 'clear') {
            const field = action.dataset.field;
            const input = action.closest('.filter')?.querySelector(`[name="${field}"]`);
            if (input) {
                input.value = '';
                state[field] = '';
            }
        }

        return data.filter(row => compare(row, state));
    };
}