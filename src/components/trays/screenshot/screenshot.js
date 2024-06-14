import React, { forwardRef, Fragment } from 'react';
import { useScreenshot, createFileName } from 'use-react-screenshot';
import { IconButton } from '@mui/joy';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

/**
 * creates a screenshot of the app surface. this method expects a
 * reference to the parent view that will be turned into an image.
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const Screenshot = forwardRef((props, ref) => {
    // create the screenshot component
    // eslint-disable-next-line no-unused-vars
    const [image, takeScreenShot] = useScreenshot({
        type: "image/jpeg",
        quality: 1.0
    });

    // create the imaginary link to download the image
    const download = (image, { name = "sreencap-" + new Date().toISOString(), extension = "jpg" } = {}) => {
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
    const downloadScreenshot = () => takeScreenShot(ref.current).then(download);

    // render the button to download the image
    return (
        <Fragment>
            <IconButton sx={{marginLeft: 10}} onClick={downloadScreenshot}>
                <AddAPhotoIcon />
            </IconButton>
        </Fragment>
    );
});