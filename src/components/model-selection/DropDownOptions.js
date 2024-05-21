import React, {Fragment} from "react";
import PropTypes from 'prop-types';
import {Option} from '@mui/joy';

/**
 * returns a list of drop down options for that data/type.
 *
 * @param data
 * @param type
 * @constructor
 */
export default function DropDownOptions(data) {
    // set component prop types
    DropDownOptions.propTypes = { data: PropTypes.any };

    // do not render if there is no data
    if (data.data == null) return;

    // return all the options
    return (
        <Fragment>
            {data.data[data.type].filter(item => item !== "").map(item => (
                <Option key={item} value={item}>{item}</Option>
            ))}
        </Fragment>
    );
}