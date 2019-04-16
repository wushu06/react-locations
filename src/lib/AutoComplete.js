import React from 'react';

class AutoComplete  extends React.Component {

    searchAutoComplete = ( val,categories, limit = true) =>{
        const regex = new RegExp(val, "i");
        let result = []
        let filter = []
        let filterfake = []
        let filterfake2 = []
        let suggestions = []
        let i = 0;
        categories.length > 0 && categories.map((item, index) => {
            if (regex.test(item.category_path_names)) {
                if (filterfake2.indexOf(item.category_path_names) === -1) {
                    filterfake2.push(item.category_path_names)
                }

                if (filterfake.indexOf(item.category_path_names) === -1) {
                    filterfake.push(item.category_path_names)

                    if (filterfake.length > 21 && limit) {
                        return;
                    }
                    filter.push({
                        filter: item.category_path_names,
                        name: item.name,
                        count: item.name_count,
                        index: filterfake2.length
                    })


                }

            }

        })


        let counts = {};
        filter.forEach(function (x) {
            counts[x] = (counts[x] || 0) + 1;
        });

        return {filter: filter, filterResult: filterfake2.length};

    }

}

export default AutoComplete;