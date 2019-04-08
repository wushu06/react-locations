import React from 'react';

class SearchInit  extends React.Component {

    searchTerm = (val, cat = '', locations,searchAll, exclusive, stateResult, stateDupCheck) => {
        const regex = new RegExp(cat, "i");
        const regexAll = new RegExp(val, "i");
        let result = [...stateResult]
      //  this.setState({loading: true})
        let dupCheck = [...stateDupCheck];
        let cord = []

        locations.map((item, index) => {

            if (!searchAll) {
                if (exclusive) {
                    if (regex.test(item.category_path_names)) {
                        // if (result.indexOf(item.category_path_names) === -1) {
                        if (item.exclusive !== '0') {
                            result.push({
                                id: item.id,
                                loc_title: item.location_title,
                                loc_id: item.location_id,
                                img: item.file_name,
                                name: item.name + ' > ' + item.parent_category_path_names,
                                mime: item.mime,
                                category_name: item.category_name,
                                category_parent: item.parent_category_path_names,
                                category_path_names: item.category_path_names,
                                exclusive: item.exclusive
                            })
                        }
                        //  }


                    }
                } else {
                    if (regex.test(item.category_path_names)) {
                        let name = item.name;


                        if (dupCheck.indexOf(name) === -1) {
                            result.unshift({
                                id: item.id,
                                check: name,
                                loc_title: item.location_title,
                                loc_id: item.location_id,
                                img: item.file_name,
                                name: item.name + ' > ' + item.parent_category_path_names,
                                mime: item.mime,
                                category_name: item.category_name,
                                category_parent: item.parent_category_path_names,
                                category_path_names: item.category_path_names,
                                exclusive: item.exclusive,
                                postcode: item.postcode,
                                lat: item.latitude,
                                lng: item.longitude,
                                commercial: item.commercial,
                                residential: item.residential,
                                production: item.production,
                                all: '1'
                            })
                            cord.push({
                                name: name,
                                postcode: item.postcode,
                                lat: item.latitude,
                                lng: item.longitude

                            })

                        } else {
                            result.map(function (obj, i) {

                                if (obj.check === name) {
                                    Object.keys(obj).indexOf('img2') === -1 ? obj['img2'] = item.file_name : obj['img3'] = item.file_name

                                }
                            });
                        }


                        dupCheck.push(name)

                    }
                }
            } else {
                if (exclusive) {
                    if (regexAll.test(item.location_title)) {
                        if (result.indexOf(item.location_title) === -1) {
                            if (item.exclusive !== '0') {
                                result.push({
                                    id: item.id,
                                    loc_title: item.location_title,
                                    loc_id: item.location_id,
                                    img: item.file_name,
                                    name: item.name,
                                    mime: item.mime,
                                    category_name: item.category_name,
                                    category_parent: item.parent_category_path_names,
                                    exclusive: item.exclusive
                                })
                            }
                            dupCheck.push(item.location_title)
                        }

                    }
                } else {
                    if (regexAll.test(item.location_title)) {

                        if (dupCheck.indexOf(item.location_title) === -1) {
                            result.push({
                                id: item.id,
                                loc_title: item.location_title,
                                loc_id: item.location_id,
                                img: item.file_name,
                                name: item.name,
                                mime: item.mime,
                                category_name: item.category_name,
                                category_parent: item.parent_category_path_names,
                                exclusive: item.exclusive
                            })

                            dupCheck.push(item.location_title)

                        }

                    }
                }
            }

        });
        // numberOfResult: result.length, got replaced with the displayresult one
      //  this.setState({numberOfResult: result.length, dupCheck, cord: cord})


        return {
            result: result,
            numberOfResult: result.length,
            dupCheck,
            cord: cord
        };
    }
}

export default SearchInit
