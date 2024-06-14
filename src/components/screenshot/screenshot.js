import React, { Fragment } from 'react';
import { IconButton } from '@mui/joy';
import * as htmlToImage from "html-to-image";
import AddAPhotoRoundedIcon from '@mui/icons-material/AddAPhotoRounded';



/**
 * creates a screenshot of the app surface. this method expects a
 * reference to the parent view that will be turned into an image.
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const Screenshot = () => {

    /**
     * Creates a filename for the download target
     *
     * @param extension
     * @param names
     * @returns {string}
     */
    const createFileName = (extension = "", ...names) => {
        if (!extension) {
            return "";
        }

        return `${names.join("")}.${extension}`;
    };

    /**
     * initiates the screenshot
     *
     * @param node
     * @returns {Promise<*>}
     */
    const takeScreenShot = async (node) => {
        // return the rendering
        return await htmlToImage.toJpeg(node);
    };

    /**
     * create the imaginary link to download the image
     *
     * @param image
     * @param name
     * @param extension
     */
    const download = (image, { name = "screencap-" + new Date().toISOString(), extension = "jpg" } = {}) => {
        // create a target element
        const a = document.createElement("a");

        // specify the image
        a.href = image;

        // create a file name
        a.download = createFileName(extension, name);

        // execute the link
        a.click();
    };

    // click handler to initiate the image download
    const downloadScreenshot = () => takeScreenShot(document.body).then(download);

    // render the button to download the image
    return (
        <Fragment>
            <IconButton sx={{ marginLeft: 2 }} onClick={ downloadScreenshot }>
                <AddAPhotoRoundedIcon />
            </IconButton>
        </Fragment>
    );
};