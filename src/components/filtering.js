export function initFiltering(elements = {}) {
    const updateIndexes = (indexes) => {
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
    };

    const applyFiltering = (query, state, action) => {
        if (action && action.name === 'clear') {
            const field = action.dataset.field;
            const input = action.closest('.filter')?.querySelector(`[name="${field}"]`);
            if (input) {
                input.value = '';
                state[field] = '';
            }
        }

        const filter = {};
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) {
                    filter[`filter[${elements[key].name}]`] = elements[key].value;
                }
            }
        });

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query;
    };

    return {
        updateIndexes,
        applyFiltering
    };
}