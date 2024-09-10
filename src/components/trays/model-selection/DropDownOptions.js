import React, { Fragment } from "react";
import PropTypes from 'prop-types';
import { Option } from '@mui/joy';

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
    if (data.data != null) {
        // if there is a warning getting the result
        if (data.data['Warning'] !== undefined) {
            return (
                <div>
                    Warning: {data.data['Warning']}
                </div>
            );
        }
        // if there is an error getting the result
        else if(data.data['Error'] !== undefined) {
            return (
                <div>
                    Error: {data.data['Error']}
                </div>
            );
        }
        // return all the options
        else {
            return (
                <Fragment>
                    {data.data[data.type].filter(item => item !== "").map(item => (
                        <Option key={ item } value={ item } sx={{ fontSize: "sm" }}>{ item }</Option>
                    ))}
                </Fragment>
            );
        }
    }
}